import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

export interface ErrorDisplayOptions {
  duration?: number;
  showGenericMessage?: boolean;
  customMessage?: string;
  panelClass?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(private snackBar: MatSnackBar) {}

  /**
   * Handle and display errors in a user-friendly way
   */
  handleError(error: any, options: ErrorDisplayOptions = {}): void {
    const defaultOptions: ErrorDisplayOptions = {
      duration: 5000,
      showGenericMessage: true,
      panelClass: ['error-snackbar']
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    let message = '';
    
    if (finalOptions.customMessage) {
      message = finalOptions.customMessage;
    } else if (error instanceof HttpErrorResponse) {
      message = this.getHttpErrorMessage(error);
    } else if (error?.error?.message) {
      message = error.error.message;
    } else if (error?.message) {
      message = error.message;
    } else if (finalOptions.showGenericMessage) {
      message = 'An unexpected error occurred. Please try again.';
    }
    
    if (message) {
      this.snackBar.open(message, 'Close', {
        duration: finalOptions.duration,
        panelClass: finalOptions.panelClass
      });
    }
    
    // Log error for debugging
    console.error('Error handled by ErrorHandlerService:', error);
  }

  /**
   * Handle success messages
   */
  handleSuccess(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Close', {
      duration,
      panelClass: ['success-snackbar']
    });
  }

  /**
   * Handle warning messages
   */
  handleWarning(message: string, duration: number = 4000): void {
    this.snackBar.open(message, 'Close', {
      duration,
      panelClass: ['warning-snackbar']
    });
  }

  private getHttpErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 0:
        return 'Unable to connect to the server. Please check your internet connection.';
      case 400:
        return error.error?.message || 'Bad request. Please check your input.';
      case 401:
        return 'Your session has expired. Please log in again.';
      case 403:
        return 'You do not have permission to access this resource.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return error.error?.message || 'A conflict occurred. This resource may already exist.';
      case 422:
        return error.error?.message || 'Validation failed. Please check your input.';
      case 429:
        return 'Too many requests. Please wait and try again.';
      case 500:
        return 'A server error occurred. Please try again later.';
      case 502:
        return 'Server is temporarily unavailable. Please try again later.';
      case 503:
        return 'Service is temporarily unavailable. Please try again later.';
      default:
        return error.error?.message || `An error occurred (${error.status}). Please try again.`;
    }
  }
}
