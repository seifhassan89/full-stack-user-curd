import { apiRequest } from "@/lib/queryClient";
import { useAuthStore } from "@/store/auth-store";
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "@/types/user";

export async function login(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  const response = await apiRequest("POST", "/auth/login", credentials);
  return response.data;
}

export async function register(
  credentials: RegisterCredentials
): Promise<AuthResponse> {
  const response = await apiRequest("POST", "/auth/register", credentials);
  return response.data;
}

export async function refreshToken(
  refreshToken: string
): Promise<AuthResponse> {
  const response = await apiRequest("POST", "/auth/refresh-token", {
    refreshToken,
  });
  return response.data;
}

export async function fetchUsers(): Promise<User[]> {
  const response = await apiRequest("GET", "/users", undefined);
  return response.data;
}

export async function fetchUsersPaginated(
  page = 1,
  pageSize = 10,
  search?: string,
  status?: string,
  role?: string
): Promise<{
  data: User[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}> {
  const params = new URLSearchParams();

  // Always include page and pageSize
  params.append("pageNumber", page.toString());
  params.append("pageSize", pageSize.toString());

  // Optional filters – skip 'all' or ''
  if (search && search.trim() !== "") {
    params.append("search", search.trim());
  }

  if (status && status !== "all") {
    params.append("status", status);
  }

  if (role && role !== "all") {
    params.append("role", role);
  }

  const response = await apiRequest("GET", `/users?${params.toString()}`);
  return response;
}

export async function fetchUser(id: number): Promise<User> {
  const response = await apiRequest("GET", `/users/${id}`, undefined);
  return response.data;
}

export async function createUser(
  user: Omit<User, "id" | "createdAt">
): Promise<User> {
  const response = await apiRequest("POST", "/users", user);
  console.log(response);

  return response.data;
}

export async function updateUser(
  id: number,
  user: Partial<Omit<User, "id" | "createdAt">>
): Promise<User> {
  const response = await apiRequest("PUT", `/users/${id}`, user);
  return response.data;
}

export async function deleteUser(id: string): Promise<void> {
  await apiRequest("DELETE", `/users/${id}`, undefined);
}

// Helper function to check if a user has a specific role
export function hasRole(role: string): boolean {
  const { user } = useAuthStore.getState();
  if (!user) return false;
  return user.role === role;
}

// Helper function to check if a user has admin privileges
export function isAdmin(): boolean {
  return hasRole("admin");
}
