export type Role = "admin" | "user";
export type activeEnum = "active" | "inactive";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: Role;
  status: activeEnum;
}

export interface AuthUser {
  id: number;
  username: string;
  name: string;
  email: string;
  role: Role;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  fullName: string;
  email: string;
  password: string;
  role: Role;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}
