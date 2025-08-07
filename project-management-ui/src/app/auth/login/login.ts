import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatTooltipModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private errorHandler: ErrorHandlerService
  ) {
    this.loginForm = this.fb.group({
      userNameOrEmail: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      console.log('Attempting login with:', this.loginForm.value);
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login successful, response:', response);
          console.log('IsAuthenticated:', this.authService.isAuthenticated);
          this.isLoading = false;
          this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
          console.log('Navigating to dashboard...');
          this.router.navigate(['/dashboard']).then(
            (success) => console.log('Navigation result:', success),
            (error) => console.error('Navigation error:', error)
          );
        },
        error: (error) => {
          this.isLoading = false;
          this.errorHandler.handleError(error, {
            customMessage: 'Login failed. Please check your credentials.'
          });
          console.error('Login error:', error);
        }
      });
    }
  }

  onForgotPassword(event: Event): void {
    event.preventDefault();
    this.errorHandler.handleWarning('Forgot password functionality will be implemented soon.');
    // TODO: Implement forgot password functionality
    // this.router.navigate(['/auth/forgot-password']);
  }

  onRegister(event: Event): void {
    event.preventDefault();
    this.errorHandler.handleWarning('Registration functionality will be implemented soon.');
    // TODO: Implement registration functionality
    // this.router.navigate(['/auth/register']);
  }

  onSocialLogin(provider: string): void {
    this.errorHandler.handleWarning(`${provider} login will be implemented soon.`);
    // TODO: Implement social login functionality
    console.log(`Social login with ${provider} requested`);
  }

  fillCredentials(username: string, password: string): void {
    this.loginForm.patchValue({
      userNameOrEmail: username,
      password: password
    });
    this.errorHandler.handleSuccess('Demo credentials filled successfully!');
  }
}
