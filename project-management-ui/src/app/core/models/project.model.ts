export enum ProjectStatus {
  Planning = 0,
  InProgress = 1,
  OnHold = 2,
  Completed = 3,
  Cancelled = 4
}

export enum Priority {
  Low = 0,
  Medium = 1,
  High = 2,
  Critical = 3
}

export interface Project {
  id: string;
  name: string;
  description: string;
  clientName: string;
  budget: number;
  startDate: Date;
  endDate: Date;
  status: ProjectStatus;
  priority: Priority;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
  members: ProjectMember[];
  taskCount?: number;
  completedTaskCount?: number;
}

export interface ProjectMember {
  userId: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  assignedDate: Date;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  clientName: string;
  budget: number;
  startDate: Date;
  endDate: Date;
  status: ProjectStatus;
  priority: Priority;
}

export interface UpdateProjectRequest {
  name: string;
  description: string;
  clientName: string;
  budget: number;
  startDate: Date;
  endDate: Date;
  status: ProjectStatus;
  priority: Priority;
  isActive: boolean;
}

export interface AssignUserToProjectRequest {
  userId: string;
}
