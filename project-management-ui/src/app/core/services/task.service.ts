import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ProjectTask, CreateTaskRequest, UpdateTaskRequest, UserTaskDashboard } from '../models/task.model';
import { AuthService } from './auth.service';
import { AppConfigService } from '../../config/app-config.service';

interface ApiResponse<T> {
  data: T;
  isSuccess: boolean;
  message?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface TaskQueryParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortDescending?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient, private authService: AuthService, private appConfig: AppConfigService) {}

  private get apiUrl(): string {
    return `${this.appConfig.apiUrl}/tasks`;
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.tokenValue;
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
  }

  getTasks(queryParams?: TaskQueryParams): Observable<PaginatedResult<ProjectTask>> {
    let params = new HttpParams();
    
    if (queryParams) {
      if (queryParams.pageNumber) {
        params = params.set('pageNumber', queryParams.pageNumber.toString());
      }
      if (queryParams.pageSize) {
        params = params.set('pageSize', queryParams.pageSize.toString());
      }
      if (queryParams.searchTerm) {
        params = params.set('searchTerm', queryParams.searchTerm);
      }
      if (queryParams.sortBy) {
        params = params.set('sortBy', queryParams.sortBy);
      }
      if (queryParams.sortDescending !== undefined) {
        params = params.set('sortDescending', queryParams.sortDescending.toString());
      }
    }

    return this.http.get<ApiResponse<PaginatedResult<ProjectTask>>>(this.apiUrl, { 
      headers: this.getAuthHeaders(),
      params: params
    }).pipe(
      map(response => response.data)
    );
  }

  // Get all tasks (for dashboard and other components that don't need pagination)
  getAllTasks(): Observable<ProjectTask[]> {
    const params = new HttpParams()
      .set('pageNumber', '1')
      .set('pageSize', '1000'); // Large page size to get all tasks

    return this.http.get<ApiResponse<PaginatedResult<ProjectTask>>>(this.apiUrl, { 
      headers: this.getAuthHeaders(),
      params: params
    }).pipe(
      map(response => response.data.items)
    );
  }

  getTask(id: string): Observable<ProjectTask> {
    return this.http.get<ApiResponse<ProjectTask>>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(
        map(response => response.data)
      );
  }

  getTasksByProject(projectId: string): Observable<ProjectTask[]> {
    return this.http.get<ApiResponse<ProjectTask[]>>(`${this.apiUrl}/project/${projectId}`, { headers: this.getAuthHeaders() })
      .pipe(
        map(response => response.data)
      );
  }

  getTasksByUser(userId: string): Observable<ProjectTask[]> {
    return this.http.get<ApiResponse<ProjectTask[]>>(`${this.apiUrl}/user/${userId}`, { headers: this.getAuthHeaders() })
      .pipe(
        map(response => response.data)
      );
  }

  createTask(task: CreateTaskRequest): Observable<ProjectTask> {
    return this.http.post<ApiResponse<ProjectTask>>(this.apiUrl, task, { headers: this.getAuthHeaders() })
      .pipe(
        map(response => response.data)
      );
  }

  updateTask(id: string, task: UpdateTaskRequest): Observable<ProjectTask> {
    return this.http.put<ApiResponse<ProjectTask>>(`${this.apiUrl}/${id}`, task, { headers: this.getAuthHeaders() })
      .pipe(
        map(response => response.data)
      );
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(
        map(() => void 0)
      );
  }

  getUserTaskDashboard(userId: string): Observable<UserTaskDashboard> {
    return this.http.get<ApiResponse<UserTaskDashboard>>(`${this.apiUrl}/dashboard/user/${userId}`, { headers: this.getAuthHeaders() })
      .pipe(
        map(response => response.data)
      );
  }
}
