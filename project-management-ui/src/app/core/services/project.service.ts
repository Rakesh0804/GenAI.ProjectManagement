import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Project, CreateProjectRequest, UpdateProjectRequest, AssignUserToProjectRequest } from '../models/project.model';
import { AuthService } from './auth.service';
import { AppConfigService } from '../../config/app-config.service';

interface ApiResponse<T> {
  data: T;
  isSuccess: boolean;
  message?: string;
}

interface PaginatedResult<T> {
  items: T[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient, private authService: AuthService, private appConfig: AppConfigService) {}

  private get apiUrl(): string {
    return `${this.appConfig.apiUrl}/projects`;
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.tokenValue;
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getProjects(): Observable<Project[]> {
    return this.http.get<ApiResponse<PaginatedResult<Project>>>(this.apiUrl, { headers: this.getAuthHeaders() })
      .pipe(
        map(response => response.data.items)
      );
  }

  getProject(id: string): Observable<Project> {
    return this.http.get<ApiResponse<Project>>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(
        map(response => response.data)
      );
  }

  createProject(project: CreateProjectRequest): Observable<Project> {
    return this.http.post<ApiResponse<Project>>(this.apiUrl, project, { headers: this.getAuthHeaders() })
      .pipe(
        map(response => response.data)
      );
  }

  updateProject(id: string, project: UpdateProjectRequest): Observable<Project> {
    return this.http.put<ApiResponse<Project>>(`${this.apiUrl}/${id}`, project, { headers: this.getAuthHeaders() })
      .pipe(
        map(response => response.data)
      );
  }

  deleteProject(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(
        map(() => void 0)
      );
  }

  assignUserToProject(projectId: string, request: AssignUserToProjectRequest): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/${projectId}/assign-user`, request, { headers: this.getAuthHeaders() })
      .pipe(
        map(() => void 0)
      );
  }

  removeUserFromProject(projectId: string, userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${projectId}/remove-user/${userId}`, { headers: this.getAuthHeaders() });
  }
}
