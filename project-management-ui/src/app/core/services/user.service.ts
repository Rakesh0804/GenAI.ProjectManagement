import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User, CreateUserRequest, UpdateUserRequest, ChangePasswordRequest } from '../models/user.model';
import { AuthService } from './auth.service';
import { AppConfigService } from '../../config/app-config.service';
import { ApiResponse, PaginatedResponse } from '../models/api.model';

// Re-export types for backward compatibility
export type { User, CreateUserRequest, UpdateUserRequest, ChangePasswordRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient, 
    private authService: AuthService, 
    private appConfig: AppConfigService
  ) {}

  private get apiUrl(): string {
    return `${this.appConfig.apiUrl}/users`;
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.tokenValue;
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Get users with pagination
  getUsers(page: number = 1, pageSize: number = 10, searchTerm?: string): Observable<PaginatedResponse<User>> {
    let params = new HttpParams()
      .set('pageNumber', page.toString())
      .set('pageSize', pageSize.toString());
    
    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    return this.http.get<ApiResponse<PaginatedResponse<User>>>(this.apiUrl, { 
      headers: this.getAuthHeaders(),
      params: params
    }).pipe(map(response => response.data));
  }

  // Get all users without pagination for dropdowns
  getAllUsersForDropdown(): Observable<User[]> {
    const params = new HttpParams()
      .set('pageNumber', '1')
      .set('pageSize', '1000'); // Large page size to get all users
    
    return this.http.get<ApiResponse<PaginatedResponse<User>>>(this.apiUrl, { 
      headers: this.getAuthHeaders(),
      params: params
    }).pipe(
      map(response => response.data.items)
    );
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/${id}`, { 
      headers: this.getAuthHeaders() 
    }).pipe(map(response => response.data));
  }

  createUser(user: CreateUserRequest): Observable<User> {
    return this.http.post<ApiResponse<User>>(this.apiUrl, user, { 
      headers: this.getAuthHeaders() 
    }).pipe(map(response => response.data));
  }

  updateUser(id: string, user: UpdateUserRequest): Observable<User> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/${id}`, user, { 
      headers: this.getAuthHeaders() 
    }).pipe(map(response => response.data));
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`, { 
      headers: this.getAuthHeaders() 
    }).pipe(map(() => void 0));
  }

  changePassword(userId: string, request: ChangePasswordRequest): Observable<void> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${userId}/change-password`, request, { 
      headers: this.getAuthHeaders() 
    }).pipe(map(() => void 0));
  }

  getSubordinates(managerId: string): Observable<User[]> {
    return this.http.get<ApiResponse<User[]>>(`${this.apiUrl}/${managerId}/subordinates`, { 
      headers: this.getAuthHeaders() 
    }).pipe(map(response => response.data));
  }
}
