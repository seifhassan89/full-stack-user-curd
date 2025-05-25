import { UserAvatar } from "@/components/layout/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { deleteUser, fetchUsersPaginated } from "@/lib/auth";
import { queryClient } from "@/lib/queryClient";
import { User } from "@/types/user";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { DeleteUserDialog } from "./delete-user-dialog";

type UserTableProps = {
  searchTerm: string;
  roleFilter: string;
  statusFilter: string;
};

export function UserTable({
  searchTerm,
  roleFilter,
  statusFilter,
}: UserTableProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "users",
      currentPage,
      pageSize,
      searchTerm,
      roleFilter,
      statusFilter,
    ],
    queryFn: () =>
      fetchUsersPaginated(
        currentPage,
        pageSize,
        searchTerm.trim() || "",
        statusFilter === "all" ? "" : statusFilter,
        roleFilter === "all" ? "" : roleFilter
      ),
    placeholderData: keepPreviousData,
  });

  const users = data?.data ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error fetching users",
        description: `${error.message} Only admins are allowed to access this page or token is expired logout and login again`,
        variant: "destructive",
      });
    }
  }, [error]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "User deleted",
        description: "The user has been successfully deleted",
        variant: "default",
      });
      setUserToDelete(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not delete the user. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (userId: string) => navigate(`/users/edit/${userId}`);
  const handleDelete = (user: User) => setUserToDelete(user);
  const confirmDelete = () => {
    // TODO: if we have time
  };
  const from = (currentPage - 1) * pageSize + 1;
  const to = Math.min(from + users.length - 1, totalCount);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="text-center text-gray-500">Loading users...</div>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto overflow-y-auto border border-gray-200 sm:rounded-lg shadow">
        <Table className="min-w-full">
          <TableHeader className="sticky top-0 z-10 bg-white">
            <TableRow>
              <TableHead style={{ minWidth: "220px" }}>Name</TableHead>
              <TableHead style={{ minWidth: "100px" }}>Role</TableHead>
              <TableHead style={{ minWidth: "100px" }}>Status</TableHead>
              <TableHead className="text-right" style={{ minWidth: "180px" }}>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-sm text-gray-500"
                >
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user: User) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <div className="flex items-center">
                      <UserAvatar name={user.fullName} size="sm" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">{user.role}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status ? "success" : "destructive"}>
                      {user.status ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex space-x-3 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(user._id)}
                        className="text-primary hover:text-primary-800"
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(user)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
        <div className="text-sm text-gray-600">
          Showing <span className="font-medium">{from}</span> to{" "}
          <span className="font-medium">{to}</span> of{" "}
          <span className="font-medium">{totalCount}</span> users
        </div>

        <div className="flex items-center gap-4">
          <label htmlFor="pageSize" className="text-sm text-gray-700">
            Rows per page:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={handlePageSizeChange}
            className="border rounded px-2 py-1 text-sm text-gray-700"
          >
            {[5, 10, 25, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
          </Button>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      <DeleteUserDialog
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={confirmDelete}
        isPending={deleteMutation.isPending}
      />
    </>
  );
}
