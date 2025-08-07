import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Claim {
  id: string;
  name: string;
  type: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateClaimDto {
  name: string;
  type: string;
  description?: string;
  isActive: boolean;
}

export interface UpdateClaimDto {
  name: string;
  type: string;
  description?: string;
  isActive: boolean;
}

export interface ClaimSummary {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
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

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errors?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ClaimService {
  private readonly baseUrl = `${environment.apiUrl}/claims`;

  constructor(private http: HttpClient) {}

  getClaims(pageNumber: number = 1, pageSize: number = 10, searchTerm?: string): Observable<ApiResponse<PaginatedResult<Claim>>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    
    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    return this.http.get<ApiResponse<PaginatedResult<Claim>>>(this.baseUrl, { params });
  }

  getClaimById(id: string): Observable<ApiResponse<Claim>> {
    return this.http.get<ApiResponse<Claim>>(`${this.baseUrl}/${id}`);
  }

  getClaimByName(name: string): Observable<ApiResponse<Claim>> {
    return this.http.get<ApiResponse<Claim>>(`${this.baseUrl}/by-name/${name}`);
  }

  getActiveClaims(): Observable<ApiResponse<ClaimSummary[]>> {
    return this.http.get<ApiResponse<ClaimSummary[]>>(`${this.baseUrl}/active`);
  }

  createClaim(claim: CreateClaimDto): Observable<ApiResponse<Claim>> {
    return this.http.post<ApiResponse<Claim>>(this.baseUrl, claim);
  }

  updateClaim(id: string, claim: UpdateClaimDto): Observable<ApiResponse<Claim>> {
    return this.http.put<ApiResponse<Claim>>(`${this.baseUrl}/${id}`, claim);
  }

  deleteClaim(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/${id}`);
  }
}
