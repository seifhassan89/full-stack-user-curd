import { useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createUser, fetchUser, updateUser } from "@/lib/auth";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ComponentLoader } from "@/components/ui/loaders";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const userFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional()
    .or(z.literal("")),
  role: z.enum(["admin", "editor", "user"]),
  status: z.boolean().default(true),
});

type UserFormValues = z.infer<typeof userFormSchema>;

export default function UserFormPage() {
  const [, navigate] = useLocation();
  const params = useParams();
  const { toast } = useToast();

  const isEditMode = params && params.id;
  const userId = isEditMode ? parseInt(params.id || "0") : undefined;

  // Fetch user data if in edit mode
  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: userId ? ["/users", userId] : undefined,
    queryFn: userId ? () => fetchUser(userId) : undefined,
    enabled: !!userId,
  });

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
      status: true,
    },
  });

  // Update form values when user data is loaded
  useEffect(() => {
    if (userData && isEditMode) {
      const user = userData as any;
      form.reset({
        name: user.name || "",
        email: user.email || "",
        password: "", // Don't populate password field
        role: user.role || "user",
        status: user.status || false,
      });
    }
  }, [userData, form, isEditMode]);

  // Create user mutation
  const createMutation = useMutation({
    mutationFn: (
      user: Omit<UserFormValues, "password"> & { password: string }
    ) => createUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Success",
        description: "User created successfully",
        variant: "default",
      });
      navigate("/users");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
      });
    },
  });

  // Update user mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, user }: { id: number; user: Partial<UserFormValues> }) =>
      updateUser(id, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Success",
        description: "User updated successfully",
        variant: "default",
      });
      navigate("/users");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      });
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (values: UserFormValues) => {
    // TODO => If We Have Time
    return;
  };

  const handleCancel = () => {
    navigate("/users");
  };

  return (
    <MainLayout>
      <div className="py-6">
        <div className="max-w-3xl mx-auto">
          <div className="pb-5 border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900">
              {isEditMode ? "Edit User" : "Create User"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isEditMode
                ? "Update user information."
                : "Add a new user to the system."}
            </p>
          </div>

          <div className="mt-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            {isLoadingUser && isEditMode ? (
              <div className="text-center py-4">
                <ComponentLoader message="Loading user data..." />
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-3">
                          <FormLabel>Full name</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={isPending} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-3">
                          <FormLabel>Email address</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              {...field}
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-3">
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              {...field}
                              value={field.value || ""}
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormMessage />
                          {isEditMode && (
                            <FormDescription>
                              Leave blank to keep current password
                            </FormDescription>
                          )}
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-3">
                          <FormLabel>Role</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                            disabled={isPending}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-6 flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isPending}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Active</FormLabel>
                            <FormDescription>
                              User will be able to access the system.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isPending}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isPending}>
                      {isPending ? (
                        <>
                          <span className="mr-2">Saving...</span>
                          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                        </>
                      ) : (
                        "Save"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
