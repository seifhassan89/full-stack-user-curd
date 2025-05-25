import { useMutation } from "@tanstack/react-query";
import { login, register } from "@/lib/auth";
import { useAuthStore } from "@/store/auth-store";
import { LoginCredentials, RegisterCredentials } from "@/types/user";
import { useToast } from "@/hooks/use-toast";

export function useAuth() {
  const {
    login: storeLogin,
    logout,
    accessToken,
    user,
    isAuthenticated,
  } = useAuthStore();
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: (data) => {
      storeLogin(data.accessToken, data.refreshToken, data.user);
      toast({
        title: "Logged in successfully",
        description: `Welcome back!`,
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (credentials: RegisterCredentials) => register(credentials),
    onSuccess: (data) => {
      storeLogin(data.accessToken, data.refreshToken, data.user);
      toast({
        title: "Account created successfully",
        description: "Welcome to Admin Portal!",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Registration failed",
        description: error.message || "Could not create your account",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
      variant: "default",
    });
  };

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: handleLogout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    accessToken,
    user,
    isAuthenticated,
  };
}
