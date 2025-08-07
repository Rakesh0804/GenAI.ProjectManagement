export interface Organization {
  id: string;
  name: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  logo?: string;
  establishedDate?: string;
  employeeCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrganizationRequest {
  name: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  logo?: string;
  establishedDate?: string;
  employeeCount: number;
}

export interface UpdateOrganizationRequest extends CreateOrganizationRequest {
  id: string;
}

export interface Branch {
  id: string;
  organizationId: string;
  name: string;
  code?: string;
  branchType: BranchType;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  managerId?: string;
  manager?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBranchRequest {
  organizationId: string;
  name: string;
  code?: string;
  branchType: BranchType;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  managerId?: string;
}

export interface UpdateBranchRequest extends CreateBranchRequest {
  id: string;
}

export enum BranchType {
  HEADQUARTERS = 'HEADQUARTERS',
  REGIONAL = 'REGIONAL',
  LOCAL = 'LOCAL',
  SATELLITE = 'SATELLITE'
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
