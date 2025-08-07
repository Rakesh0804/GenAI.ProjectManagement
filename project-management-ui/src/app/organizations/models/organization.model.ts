export enum BranchType {
  HEADQUARTERS = 'HEADQUARTERS',
  REGIONAL = 'REGIONAL',
  BRANCH = 'BRANCH',
  WAREHOUSE = 'WAREHOUSE',
  SALES_OFFICE = 'SALES_OFFICE'
}

export enum PolicyType {
  GENERAL = 'GENERAL',
  HR = 'HR',
  IT = 'IT',
  SECURITY = 'SECURITY',
  FINANCIAL = 'FINANCIAL',
  OPERATIONAL = 'OPERATIONAL'
}

export interface Organization {
  id: string;
  name: string;
  description?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  logoUrl?: string;
  establishedDate?: string;
  industry?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
  zipCode?: string;
  managerId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BranchWithManager extends Branch {
  manager?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
  };
}

export interface OrganizationWithBranches extends Organization {
  branches: BranchWithManager[];
}

export interface OrganizationPolicy {
  id: string;
  organizationId: string;
  title: string;
  content: string;
  policyType: PolicyType;
  effectiveDate: string;
  expiryDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyHoliday {
  id: string;
  organizationId: string;
  name: string;
  date: string;
  description?: string;
  isRecurring: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationSetting {
  id: string;
  organizationId: string;
  key: string;
  value: string;
  dataType: string;
  description?: string;
  isEditable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrganizationRequest {
  name: string;
  description?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  logoUrl?: string;
  establishedDate?: string;
  industry?: string;
}

export interface UpdateOrganizationRequest extends CreateOrganizationRequest {
  id: string;
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
  zipCode?: string;
  managerId?: string;
}

export interface UpdateBranchRequest extends CreateBranchRequest {
  id: string;
}
