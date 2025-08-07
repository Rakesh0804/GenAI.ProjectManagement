import { Component, OnInit, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, startWith, map } from 'rxjs';

import { Branch } from '../../models/organization.model';
import { User } from '../../../auth/interfaces/user.interface';

// Simple DTOs for branch operations
interface BranchCreateDto {
  organizationId: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  managerId: string;
  isActive: boolean;
}

interface BranchUpdateDto {
  id: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  managerId: string;
  isActive: boolean;
}

interface BranchDialogData {
  mode: 'create' | 'edit';
  branch: Branch | null;
  organizationId: string;
  users: User[];
}

@Component({
  selector: 'app-branch-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './branch-form.component.html',
  styleUrls: ['./branch-form.component.scss']
})
export class BranchFormComponent implements OnInit {
  private fb = inject(FormBuilder);

  branchForm!: FormGroup;
  isEdit = false;
  isSubmitting = false;
  filteredUsers!: Observable<User[]>;

  constructor(
    public dialogRef: MatDialogRef<BranchFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BranchDialogData
  ) {}

  ngOnInit(): void {
    this.isEdit = this.data.mode === 'edit';
    this.initializeForm();
    this.setupUserFilter();
  }

  private initializeForm(): void {
    this.branchForm = this.fb.group({
      name: [
        this.data.branch?.name || '', 
        [Validators.required, Validators.minLength(2), Validators.maxLength(100)]
      ],
      description: [
        this.data.branch?.description || '', 
        [Validators.maxLength(500)]
      ],
      address: [
        this.data.branch?.address || '', 
        [Validators.maxLength(200)]
      ],
      city: [
        this.data.branch?.city || '', 
        [Validators.maxLength(50)]
      ],
      state: [
        this.data.branch?.state || '', 
        [Validators.maxLength(50)]
      ],
      country: [
        this.data.branch?.country || '', 
        [Validators.maxLength(50)]
      ],
      postalCode: [
        this.data.branch?.zipCode || '', 
        [Validators.maxLength(20)]
      ],
      phone: [
        this.data.branch?.phone || '', 
        [Validators.pattern(/^[\+]?[\s\-\(\)]*([0-9][\s\-\(\)]*){6,20}$/)]
      ],
      email: [
        this.data.branch?.email || '', 
        [Validators.email, Validators.maxLength(100)]
      ],
      managerId: [
        this.data.branch?.managerId || '', 
        [Validators.required]
      ],
      isActive: [
        this.data.branch?.isActive ?? true
      ]
    });
  }

  private setupUserFilter(): void {
    const managerControl = this.branchForm.get('managerId');
    if (managerControl) {
      this.filteredUsers = managerControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterUsers(value || ''))
      );
    }
  }

  private _filterUsers(value: string): User[] {
    if (typeof value !== 'string') {
      return this.data.users;
    }

    const filterValue = value.toLowerCase();
    return this.data.users.filter((user: User) =>
      user.firstName.toLowerCase().includes(filterValue) ||
      user.lastName.toLowerCase().includes(filterValue) ||
      user.email.toLowerCase().includes(filterValue)
    );
  }  displayUserFn(userId: string): string {
    if (!userId) return '';
    const user = this.data.users.find((u: User) => u.id === userId);
    return user ? `${user.firstName} ${user.lastName} (${user.email})` : '';
  }

  onUserSelected(userId: string): void {
    this.branchForm.patchValue({ managerId: userId });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.branchForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.branchForm.get(fieldName);
    if (!field || !field.errors) return '';

    const errors = field.errors;
    
    if (errors['required']) return `${this.getFieldLabel(fieldName)} is required`;
    if (errors['minlength']) return `${this.getFieldLabel(fieldName)} must be at least ${errors['minlength'].requiredLength} characters`;
    if (errors['maxlength']) return `${this.getFieldLabel(fieldName)} cannot exceed ${errors['maxlength'].requiredLength} characters`;
    if (errors['email']) return 'Please enter a valid email address';
    if (errors['pattern']) return 'Please enter a valid phone number';
    
    return 'Invalid input';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Branch Name',
      description: 'Description',
      address: 'Address',
      city: 'City',
      state: 'State/Province',
      country: 'Country',
      postalCode: 'Postal Code',
      phone: 'Phone',
      email: 'Email',
      managerId: 'Manager'
    };
    return labels[fieldName] || fieldName;
  }

  onSubmit(): void {
    if (this.branchForm.valid) {
      const formValue = this.branchForm.value;
      
      // Map postalCode to zipCode for backend compatibility
      const branchData = {
        ...formValue,
        zipCode: formValue.postalCode
      };
      delete branchData.postalCode;
      
      if (this.isEdit && this.data.branch) {
        const updateDto: BranchUpdateDto = {
          id: this.data.branch.id,
          ...branchData
        };
        this.dialogRef.close(updateDto);
      } else {
        const createDto: BranchCreateDto = {
          organizationId: this.data.organizationId,
          ...branchData
        };
        this.dialogRef.close(createDto);
      }
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.branchForm.controls).forEach(key => {
        const control = this.branchForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onReset(): void {
    this.branchForm.reset();
    this.initializeForm();
  }
}
