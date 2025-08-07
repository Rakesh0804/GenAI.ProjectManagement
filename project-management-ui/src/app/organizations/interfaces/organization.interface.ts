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

export interface OrganizationCreateDto {
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

export interface OrganizationUpdateDto {
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
}

export interface Branch {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  managerId: string;
  managerName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BranchCreateDto {
  organizationId: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  managerId: string;
  isActive: boolean;
}

export interface BranchUpdateDto {
  id: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  managerId: string;
  isActive: boolean;
}

export interface OrganizationPolicy {
  id: string;
  organizationId: string;
  policyName: string;
  policyType: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationPolicyCreateDto {
  organizationId: string;
  policyName: string;
  policyType: string;
  description?: string;
  isActive: boolean;
}

export interface OrganizationPolicyUpdateDto {
  id: string;
  policyName: string;
  policyType: string;
  description?: string;
  isActive: boolean;
}

export interface CompanyHoliday {
  id: string;
  organizationId: string;
  holidayName: string;
  holidayDate: string;
  description?: string;
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyHolidayCreateDto {
  organizationId: string;
  holidayName: string;
  holidayDate: string;
  description?: string;
  isRecurring: boolean;
}

export interface CompanyHolidayUpdateDto {
  id: string;
  holidayName: string;
  holidayDate: string;
  description?: string;
  isRecurring: boolean;
}

export interface OrganizationSetting {
  id: string;
  organizationId: string;
  settingKey: string;
  settingValue: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationSettingCreateDto {
  organizationId: string;
  settingKey: string;
  settingValue: string;
  description?: string;
}

export interface OrganizationSettingUpdateDto {
  id: string;
  settingKey: string;
  settingValue: string;
  description?: string;
}
