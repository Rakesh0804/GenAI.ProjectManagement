export interface User {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isActive: boolean;
  lastLoginAt?: Date;
  managerId?: string;
  managerName?: string;
  roles: string[];
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateUserRequest {
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
  isActive: boolean;
  managerId?: string;
}

export interface UpdateUserRequest {
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isActive: boolean;
  managerId?: string;
}

export interface LoginRequest {
  userName: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  expires: Date;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
