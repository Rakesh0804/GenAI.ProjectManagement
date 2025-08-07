import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PaginatedResponse } from '../models/api.model';
import { AuthService } from './auth.service';
import { AppConfigService } from '../../config/app-config.service';
import { 
  Organization, 
  OrganizationWithBranches,
  Branch,
  BranchWithManager,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  CreateBranchRequest,
  UpdateBranchRequest
} from '../../organizations/models/organization.model';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private appConfig: AppConfigService
  ) {}

  private get apiUrl(): string {
    return `${this.appConfig.apiUrl}/organizations`;
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.tokenValue;
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Organization methods
  getAllOrganizations(
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<ApiResponse<PaginatedResponse<Organization>>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ApiResponse<PaginatedResponse<Organization>>>(this.apiUrl, { 
      params,
      headers: this.getAuthHeaders() 
    });
  }

  getAllOrganizationsWithBranches(
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<ApiResponse<PaginatedResponse<OrganizationWithBranches>>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ApiResponse<PaginatedResponse<OrganizationWithBranches>>>(`${this.apiUrl}/with-branches`, { 
      params,
      headers: this.getAuthHeaders() 
    });
  }

  getOrganization(id: string): Observable<ApiResponse<Organization>> {
    return this.http.get<ApiResponse<Organization>>(`${this.apiUrl}/${id}`, { 
      headers: this.getAuthHeaders() 
    });
  }

  getOrganizationWithBranches(id: string): Observable<ApiResponse<OrganizationWithBranches>> {
    return this.http.get<ApiResponse<OrganizationWithBranches>>(`${this.apiUrl}/${id}/with-branches`, { 
      headers: this.getAuthHeaders() 
    });
  }

  createOrganization(request: CreateOrganizationRequest): Observable<ApiResponse<Organization>> {
    return this.http.post<ApiResponse<Organization>>(this.apiUrl, request, { 
      headers: this.getAuthHeaders() 
    });
  }

  updateOrganization(request: UpdateOrganizationRequest): Observable<ApiResponse<Organization>> {
    return this.http.put<ApiResponse<Organization>>(`${this.apiUrl}/${request.id}`, request, { 
      headers: this.getAuthHeaders() 
    });
  }

  // Branch methods
  getBranches(
    organizationId: string,
    pageNumber: number = 1,
    pageSize: number = 10,
    searchTerm?: string
  ): Observable<ApiResponse<PaginatedResponse<BranchWithManager>>> {
    let params = new HttpParams()
      .set('organizationId', organizationId)
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    return this.http.get<ApiResponse<PaginatedResponse<BranchWithManager>>>(`${this.appConfig.apiUrl}/branches`, { 
      params,
      headers: this.getAuthHeaders() 
    });
  }

  getBranch(id: string): Observable<ApiResponse<BranchWithManager>> {
    return this.http.get<ApiResponse<BranchWithManager>>(`${this.appConfig.apiUrl}/branches/${id}`, { 
      headers: this.getAuthHeaders() 
    });
  }

  createBranch(request: CreateBranchRequest): Observable<ApiResponse<Branch>> {
    return this.http.post<ApiResponse<Branch>>(`${this.appConfig.apiUrl}/branches`, request, { 
      headers: this.getAuthHeaders() 
    });
  }

  updateBranch(request: UpdateBranchRequest): Observable<ApiResponse<Branch>> {
    return this.http.put<ApiResponse<Branch>>(`${this.appConfig.apiUrl}/branches/${request.id}`, request, { 
      headers: this.getAuthHeaders() 
    });
  }

  deleteBranch(id: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.appConfig.apiUrl}/branches/${id}`, { 
      headers: this.getAuthHeaders() 
    });
  }
}
