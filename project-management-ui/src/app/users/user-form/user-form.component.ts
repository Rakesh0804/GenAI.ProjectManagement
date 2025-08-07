import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { User, UserService, CreateUserRequest, UpdateUserRequest } from '../../core/services/user.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';

interface DialogData {
  mode: 'create' | 'edit';
  user?: User;
}

@Component({
  selector: 'app-user-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isLoading = false;
  isCreate: boolean;
  availableManagers: User[] = [];
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private errorHandler: ErrorHandlerService,
    public dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.isCreate = data.mode === 'create';
    this.userForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadManagers();
    if (!this.isCreate && this.data.user) {
      this.populateForm(this.data.user);
    }
  }

  createForm(): FormGroup {
    if (this.isCreate) {
      return this.fb.group({
        firstName: ['', [Validators.required, Validators.maxLength(100)]],
        lastName: ['', [Validators.required, Validators.maxLength(100)]],
        email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
        userName: ['', [Validators.required, Validators.maxLength(20)]],
        phoneNumber: ['', [Validators.maxLength(15)]],
        managerId: [''],
        isActive: [true],
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
        confirmPassword: ['', [Validators.required]]
      }, { validators: this.passwordMatchValidator });
    } else {
      return this.fb.group({
        firstName: ['', [Validators.required, Validators.maxLength(100)]],
        lastName: ['', [Validators.required, Validators.maxLength(100)]],
        email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
        userName: ['', [Validators.required, Validators.maxLength(20)]],
        phoneNumber: ['', [Validators.maxLength(15)]],
        managerId: [''],
        isActive: [true]
      });
    }
  }

  passwordMatchValidator(form: any): { [key: string]: boolean } | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    
    return null;
  }

  populateForm(user: User): void {
    this.userForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userName: user.userName,
      phoneNumber: user.phoneNumber,
      managerId: user.managerId,
      isActive: user.isActive
    });
  }

  loadManagers(): void {
    this.userService.getAllUsersForDropdown().subscribe({
      next: (users) => {
        // Filter out the current user when editing
        this.availableManagers = users.filter(user => 
          this.isCreate || user.id !== this.data.user?.id
        );
      },
      error: (error) => {
        this.errorHandler.handleError(error);
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.isLoading = true;
      
      if (this.isCreate) {
        this.createUser();
      } else {
        this.updateUser();
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  createUser(): void {
    const formValue = this.userForm.value;
    const createRequest: CreateUserRequest = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      userName: formValue.userName,
      password: formValue.password,
      phoneNumber: formValue.phoneNumber || undefined,
      managerId: formValue.managerId || undefined,
      isActive: formValue.isActive
    };

    this.userService.createUser(createRequest).subscribe({
      next: (user) => {
        this.isLoading = false;
        this.dialogRef.close(user);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorHandler.handleError(error);
      }
    });
  }

  updateUser(): void {
    if (!this.data.user) return;

    const formValue = this.userForm.value;
    const updateRequest: UpdateUserRequest = {
      userName: formValue.userName,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      phoneNumber: formValue.phoneNumber || undefined,
      managerId: formValue.managerId || undefined,
      isActive: formValue.isActive
    };

    this.userService.updateUser(this.data.user.id, updateRequest).subscribe({
      next: (user) => {
        this.isLoading = false;
        this.dialogRef.close(user);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorHandler.handleError(error);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.userForm.get(fieldName);
    if (control && control.errors && control.touched) {
      const errors = control.errors;
      
      if (errors['required']) return `${this.getFieldLabel(fieldName)} is required`;
      if (errors['email']) return 'Please enter a valid email address';
      if (errors['minlength']) return `${this.getFieldLabel(fieldName)} must be at least ${errors['minlength'].requiredLength} characters`;
      if (errors['maxlength']) return `${this.getFieldLabel(fieldName)} cannot exceed ${errors['maxlength'].requiredLength} characters`;
    }
    
    if (fieldName === 'confirmPassword' && this.userForm.errors?.['passwordMismatch']) {
      return 'Passwords do not match';
    }
    
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      userName: 'Username',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      phoneNumber: 'Phone Number'
    };
    
    return labels[fieldName] || fieldName;
  }
}
