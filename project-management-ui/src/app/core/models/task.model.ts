export enum TaskStatus {
  ToDo = 0,
  InProgress = 1,
  InReview = 2,
  Done = 3,
  Blocked = 4
}

export enum TaskPriority {
  Low = 0,
  Medium = 1,
  High = 2,
  Critical = 3
}

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  acronym: string;
  taskNumber: string;
  projectId: string;
  projectName: string;
  assignedUserId?: string;
  assignedToUserName?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  acronym: string;
  projectId: string;
  assignedToUserId?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  estimatedHours?: number;
}

export interface UpdateTaskRequest {
  title: string;
  description: string;
  assignedToUserId?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  isActive: boolean;
}

export interface UserTaskDashboard {
  userId: string;
  userName: string;
  totalTaskCount: number;
  completedTaskCount: number;
  pendingTaskCount: number;
  pendingTasks: ProjectTask[];
}
