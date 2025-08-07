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
import { MatDividerModule } from '@angular/material/divider';
import { Claim, ClaimService, CreateClaimDto, UpdateClaimDto } from '../../core/services/claim.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';

interface DialogData {
  mode: 'create' | 'edit';
  claim?: Claim;
}

@Component({
  selector: 'app-claim-form',
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
    MatTooltipModule,
    MatDividerModule
  ],
  templateUrl: './claim-form.component.html',
  styleUrl: './claim-form.component.scss'
})
export class ClaimFormComponent implements OnInit {
  claimForm: FormGroup;
  isLoading = false;
  isCreate: boolean;

  claimTypes = [
    { value: 'permission', label: 'Permission', icon: 'security' },
    { value: 'role', label: 'Role', icon: 'group' },
    { value: 'feature', label: 'Feature', icon: 'toggle_on' }
  ];

  constructor(
    private fb: FormBuilder,
    private claimService: ClaimService,
    private errorHandler: ErrorHandlerService,
    public dialogRef: MatDialogRef<ClaimFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.isCreate = data.mode === 'create';
    this.claimForm = this.createForm();
  }

  ngOnInit(): void {
    if (!this.isCreate && this.data.claim) {
      this.populateForm(this.data.claim);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-Z0-9._-]+$/)
      ]],
      type: ['', Validators.required],
      description: ['', [
        Validators.maxLength(500)
      ]],
      isActive: [true]
    });
  }

  private populateForm(claim: Claim): void {
    this.claimForm.patchValue({
      name: claim.name,
      type: claim.type,
      description: claim.description || '',
      isActive: claim.isActive
    });
  }

  getDialogTitle(): string {
    return this.isCreate ? 'Add New Claim' : 'Edit Claim';
  }

  getDialogIcon(): string {
    return this.isCreate ? 'add_circle' : 'edit';
  }

  getSubmitButtonText(): string {
    return this.isCreate ? 'Create Claim' : 'Update Claim';
  }

  getSelectedTypeIcon(): string {
    const selectedType = this.claimForm.get('type')?.value;
    const typeInfo = this.claimTypes.find(t => t.value === selectedType);
    return typeInfo?.icon || 'label';
  }

  hasError(fieldName: string, errorType: string): boolean {
    const field = this.claimForm.get(fieldName);
    return !!(field && field.hasError(errorType) && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.claimForm.get(fieldName);
    if (!field) return '';

    if (field.hasError('required')) {
      return `${this.getFieldDisplayName(fieldName)} is required`;
    }
    if (field.hasError('minlength')) {
      const minLength = field.getError('minlength').requiredLength;
      return `${this.getFieldDisplayName(fieldName)} must be at least ${minLength} characters`;
    }
    if (field.hasError('maxlength')) {
      const maxLength = field.getError('maxlength').requiredLength;
      return `${this.getFieldDisplayName(fieldName)} cannot exceed ${maxLength} characters`;
    }
    if (field.hasError('pattern')) {
      return 'Name can only contain letters, numbers, dots, hyphens, and underscores';
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const fieldNames: { [key: string]: string } = {
      name: 'Name',
      type: 'Type',
      description: 'Description'
    };
    return fieldNames[fieldName] || fieldName;
  }

  onSubmit(): void {
    if (this.claimForm.valid && !this.isLoading) {
      this.isLoading = true;

      const formValue = this.claimForm.value;

      if (this.isCreate) {
        this.createClaim(formValue);
      } else {
        this.updateClaim(formValue);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private createClaim(formValue: any): void {
    const createDto: CreateClaimDto = {
      name: formValue.name.trim(),
      type: formValue.type,
      description: formValue.description?.trim() || undefined,
      isActive: formValue.isActive
    };

    this.claimService.createClaim(createDto).subscribe({
      next: (response) => {
        if (response.success) {
          this.dialogRef.close({ success: true, data: response.data });
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorHandler.handleError(error);
        this.isLoading = false;
      }
    });
  }

  private updateClaim(formValue: any): void {
    if (!this.data.claim) return;

    const updateDto: UpdateClaimDto = {
      name: formValue.name.trim(),
      type: formValue.type,
      description: formValue.description?.trim() || undefined,
      isActive: formValue.isActive
    };

    this.claimService.updateClaim(this.data.claim.id, updateDto).subscribe({
      next: (response) => {
        if (response.success) {
          this.dialogRef.close({ success: true, data: response.data });
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorHandler.handleError(error);
        this.isLoading = false;
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.claimForm.controls).forEach(key => {
      const control = this.claimForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.dialogRef.close({ success: false });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.claimForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
