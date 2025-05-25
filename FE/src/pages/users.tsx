import { useState } from "react";
import { useLocation } from "wouter";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { UserTable } from "@/components/users/user-table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UsersPage() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  return (
    <MainLayout>
      <div className="pt-16 md:pt-8 px-4 sm:px-6 md:px-8">
        <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
        </div>

        {/* Filters */}
        <div className="mt-4 bg-white p-4 shadow rounded-lg">
          <div className="flex flex-col sm:flex-row">
            <div className="flex-1 sm:mr-3 mb-3 sm:mb-0">
              <label htmlFor="user-search" className="sr-only">
                Search
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  name="user-search"
                  id="user-search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search users"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="mt-4 flex flex-col">
          <div className="my-2 sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <UserTable
                searchTerm={searchTerm}
                roleFilter={roleFilter}
                statusFilter={statusFilter}
              />
            </div>
          </div>
        </div>

        {/* Pagination will be added here */}
      </div>
    </MainLayout>
  );
}
