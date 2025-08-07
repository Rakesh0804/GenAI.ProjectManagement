import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { User, LoginRequest, LoginResponse } from '../models/user.model';
import { AppConfigService } from '../../config/app-config.service';

// Interface for the API wrapper response
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);

  public currentUser$ = this.currentUserSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();

  constructor(
    private http: HttpClient,
    private appConfig: AppConfigService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadStoredAuth();
  }

  private get apiUrl(): string {
    return `${this.appConfig.apiUrl}/auth`;
  }

  private loadStoredAuth(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const token = localStorage.getItem('auth_token');
        const userStr = localStorage.getItem('current_user');
        
        if (token && userStr && userStr !== 'undefined' && userStr !== 'null') {
          const user = JSON.parse(userStr);
          this.tokenSubject.next(token);
          this.currentUserSubject.next(user);
          console.log('Auth loaded from storage:', { token: !!token, user });
        } else {
          console.log('No valid auth data in storage');
        }
      } catch (error) {
        console.error('Error loading stored auth:', error);
        // Clear invalid data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
      }
    }
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/login`, request)
      .pipe(
        map(apiResponse => apiResponse.data), // Extract the data from the API wrapper
        tap(response => {
          this.setAuth(response.token, response.user);
        })
      );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('current_user');
      console.log('Auth data cleared from storage');
    }
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
  }

  clearInvalidAuth(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('current_user');
    }
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
  }

  private setAuth(token: string, user: User): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('current_user', JSON.stringify(user));
        console.log('Auth stored successfully:', { token: !!token, user: !!user });
      } catch (error) {
        console.error('Error storing auth data:', error);
      }
    }
    this.tokenSubject.next(token);
    this.currentUserSubject.next(user);
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  get tokenValue(): string | null {
    return this.tokenSubject.value;
  }

  get isAuthenticated(): boolean {
    return !!this.tokenValue;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserValue;
    return user?.roles?.includes(role) || false;
  }

  isAdmin(): boolean {
    return this.hasRole('Admin');
  }

  isProjectManager(): boolean {
    return this.hasRole('ProjectManager');
  }
}
