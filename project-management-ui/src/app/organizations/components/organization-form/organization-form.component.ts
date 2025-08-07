import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Organization } from '../../models/organization.model';

interface DialogData {
  mode: 'create' | 'edit';
  organization?: Organization;
}

@Component({
  selector: 'app-organization-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './organization-form.component.html',
  styleUrls: ['./organization-form.component.scss']
})
export class OrganizationFormComponent implements OnInit {
  organizationForm: FormGroup;
  isSubmitting = false;
  isEdit: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<OrganizationFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.organizationForm = this.createForm();
    this.isEdit = data.mode === 'edit';
  }

  ngOnInit(): void {
    if (this.data.organization && this.isEdit) {
      this.populateForm();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', Validators.maxLength(1000)],
      website: ['', Validators.maxLength(255)],
      email: ['', [Validators.email, Validators.maxLength(255)]],
      phone: ['', Validators.maxLength(50)],
      address: ['', Validators.maxLength(500)],
      city: ['', Validators.maxLength(100)],
      state: ['', Validators.maxLength(100)],
      country: ['', Validators.maxLength(100)],
      postalCode: ['', Validators.maxLength(20)],
      logo: ['', Validators.maxLength(500)],
      establishedDate: [null]
    });
  }

  private populateForm(): void {
    if (this.data.organization) {
      this.organizationForm.patchValue({
        name: this.data.organization.name,
        description: this.data.organization.description,
        website: this.data.organization.website,
        email: this.data.organization.email,
        phone: this.data.organization.phone,
        address: this.data.organization.address,
        city: this.data.organization.city,
        state: this.data.organization.state,
        country: this.data.organization.country,
        postalCode: this.data.organization.zipCode,
        logo: this.data.organization.logoUrl,
        establishedDate: this.data.organization.establishedDate
      });
    }
  }

  onSubmit(): void {
    if (this.organizationForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const formData = this.organizationForm.value;
      
      if (this.isEdit && this.data.organization) {
        const updateData = {
          ...formData,
          id: this.data.organization.id
        };
        this.dialogRef.close(updateData);
      } else {
        this.dialogRef.close(formData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  resetForm(): void {
    this.organizationForm.reset();
    this.isSubmitting = false;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.organizationForm.controls).forEach(key => {
      const control = this.organizationForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.organizationForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.organizationForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Invalid email format';
      if (field.errors['maxlength']) return `${fieldName} is too long`;
      if (field.errors['min']) return `${fieldName} must be positive`;
    }
    return '';
  }
}
