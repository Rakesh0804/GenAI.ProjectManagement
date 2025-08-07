import { Component, OnInit, Inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProjectService } from '../../core/services/project.service';
import { Project, ProjectStatus, Priority, CreateProjectRequest, UpdateProjectRequest } from '../../core/models/project.model';

@Component({
  selector: 'app-project-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './project-form.html',
  styleUrl: './project-form.scss'
})
export class ProjectFormComponent implements OnInit {
  projectForm: FormGroup;
  isEditMode = false;
  submitting = false;
  project?: Project;

  // Expose enums to template
  ProjectStatus = ProjectStatus;
  Priority = Priority;

  // Enum options for dropdowns
  statusOptions = [
    { value: ProjectStatus.Planning, label: 'Planning' },
    { value: ProjectStatus.InProgress, label: 'In Progress' },
    { value: ProjectStatus.OnHold, label: 'On Hold' },
    { value: ProjectStatus.Completed, label: 'Completed' },
    { value: ProjectStatus.Cancelled, label: 'Cancelled' }
  ];

  priorityOptions = [
    { value: Priority.Low, label: 'Low' },
    { value: Priority.Medium, label: 'Medium' },
    { value: Priority.High, label: 'High' },
    { value: Priority.Critical, label: 'Critical' }
  ];

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    @Optional() public dialogRef: MatDialogRef<ProjectFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.projectForm = this.createForm();
  }

  ngOnInit(): void {
    // Check if editing from route parameter
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.isEditMode = true;
      this.loadProject(projectId);
    }
    
    // Check if editing from dialog data
    if (this.data?.project) {
      this.isEditMode = true;
      this.project = this.data.project;
      this.populateForm();
    }
  }

  private createForm(): FormGroup {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(1000)]],
      clientName: ['', [Validators.maxLength(100)]],
      startDate: [todayString, [Validators.required]],
      endDate: [''],
      status: [ProjectStatus.Planning, [Validators.required]],
      priority: [Priority.Medium, [Validators.required]],
      budget: [0, [Validators.min(0)]]
    });
  }

  private loadProject(projectId: string): void {
    this.submitting = true;
    this.projectService.getProject(projectId).subscribe({
      next: (project) => {
        this.project = project;
        this.populateForm();
        this.submitting = false;
      },
      error: (error) => {
        console.error('Error loading project:', error);
        this.snackBar.open('Error loading project', 'Close', { duration: 3000 });
        this.submitting = false;
      }
    });
  }

  private populateForm(): void {
    if (this.project) {
      const startDate = new Date(this.project.startDate).toISOString().split('T')[0];
      const endDate = this.project.endDate ? new Date(this.project.endDate).toISOString().split('T')[0] : '';
      
      this.projectForm.patchValue({
        name: this.project.name,
        description: this.project.description,
        clientName: this.project.clientName,
        startDate: startDate,
        endDate: endDate,
        status: this.project.status,
        priority: this.project.priority,
        budget: this.project.budget
      });
    }
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      this.submitting = true;
      
      if (this.isEditMode && this.project) {
        this.updateProject();
      } else {
        this.createProject();
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private createProject(): void {
    const formValue = this.projectForm.value;
    const createDto: CreateProjectRequest = {
      name: formValue.name,
      description: formValue.description,
      clientName: formValue.clientName,
      startDate: new Date(formValue.startDate),
      endDate: formValue.endDate ? new Date(formValue.endDate) : new Date(),
      status: formValue.status,
      priority: formValue.priority,
      budget: formValue.budget
    };

    this.projectService.createProject(createDto).subscribe({
      next: (project) => {
        this.snackBar.open('Project created successfully', 'Close', { duration: 3000 });
        this.submitting = false;
        this.onSuccess();
      },
      error: (error) => {
        console.error('Error creating project:', error);
        this.snackBar.open('Error creating project', 'Close', { duration: 3000 });
        this.submitting = false;
      }
    });
  }

  private updateProject(): void {
    if (!this.project) return;

    const formValue = this.projectForm.value;
    const updateDto: UpdateProjectRequest = {
      name: formValue.name,
      description: formValue.description,
      clientName: formValue.clientName,
      startDate: new Date(formValue.startDate),
      endDate: formValue.endDate ? new Date(formValue.endDate) : new Date(),
      status: formValue.status,
      priority: formValue.priority,
      budget: formValue.budget,
      isActive: true
    };

    this.projectService.updateProject(this.project.id, updateDto).subscribe({
      next: (project) => {
        this.snackBar.open('Project updated successfully', 'Close', { duration: 3000 });
        this.submitting = false;
        this.onSuccess();
      },
      error: (error) => {
        console.error('Error updating project:', error);
        this.snackBar.open('Error updating project', 'Close', { duration: 3000 });
        this.submitting = false;
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.projectForm.controls).forEach(key => {
      const control = this.projectForm.get(key);
      control?.markAsTouched();
    });
  }

  private onSuccess(): void {
    if (this.dialogRef) {
      this.dialogRef.close(true);
    } else {
      this.router.navigate(['/projects']);
    }
  }

  onCancel(): void {
    if (this.dialogRef) {
      this.dialogRef.close(false);
    } else {
      this.router.navigate(['/projects']);
    }
  }

  getFormTitle(): string {
    return this.isEditMode ? 'Edit Project' : 'Create New Project';
  }

  getSubmitButtonText(): string {
    return this.isEditMode ? 'Update Project' : 'Create Project';
  }
}
