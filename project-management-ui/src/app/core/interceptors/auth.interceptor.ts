import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRedirecting = false; // Prevent multiple redirects

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add auth token to request if available
    let authReq = req;
    const token = this.authService.tokenValue;
    
    if (token && !req.url.includes('/auth/login')) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 Unauthorized errors
        if (error.status === 401 && !this.isRedirecting) {
          this.isRedirecting = true;
          console.warn('Unauthorized request detected. Clearing authentication and redirecting to login.');
          
          // Clear authentication cache
          this.authService.clearInvalidAuth();
          
          // Show user-friendly message
          this.snackBar.open('Your session has expired. Please log in again.', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          
          // Redirect to login page with return URL
          const returnUrl = this.router.url !== '/login' ? this.router.url : '/dashboard';
          this.router.navigate(['/login'], { 
            queryParams: { returnUrl } 
          }).finally(() => {
            // Reset redirect flag after navigation
            setTimeout(() => this.isRedirecting = false, 1000);
          });
          
          // Don't propagate the error further to prevent multiple redirects
          return throwError(() => new Error('Session expired'));
        }
        
        // Handle 403 Forbidden errors
        if (error.status === 403) {
          console.warn('Access forbidden for URL:', req.url);
          this.snackBar.open('You do not have permission to access this resource.', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
        
        // Handle 0 status (network errors, CORS issues, etc.)
        if (error.status === 0) {
          console.error('Network error or server unreachable:', error);
          this.snackBar.open('Unable to connect to the server. Please check your internet connection.', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
        
        // Handle 500+ server errors
        if (error.status >= 500) {
          console.error('Server error for URL:', req.url, error);
          this.snackBar.open('A server error occurred. Please try again later.', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
        
        // Handle 400-499 client errors (excluding 401 and 403 already handled)
        if (error.status >= 400 && error.status < 500 && error.status !== 401 && error.status !== 403) {
          console.warn('Client error for URL:', req.url, error);
          // For validation errors or bad requests, let the component handle the specific error
          if (error.status !== 400 && error.status !== 422) {
            this.snackBar.open('Request failed. Please check your input and try again.', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        }
        
        // Propagate other errors
        return throwError(() => error);
      })
    );
  }
}
