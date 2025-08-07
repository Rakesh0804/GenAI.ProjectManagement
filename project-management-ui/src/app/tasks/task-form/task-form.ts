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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable, startWith, map } from 'rxjs';
import { TaskService } from '../../core/services/task.service';
import { ProjectService } from '../../core/services/project.service';
import { UserService } from '../../core/services/user.service';
import { ProjectTask, TaskStatus, TaskPriority, CreateTaskRequest, UpdateTaskRequest } from '../../core/models/task.model';
import { Project } from '../../core/models/project.model';
import { User } from '../../core/models/user.model';
import { TASK_TYPES, DEFAULT_TASK_TYPE, TaskType } from '../../core/constants/task-types.constants';

@Component({
  selector: 'app-task-form',
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
    MatProgressSpinnerModule,
    MatAutocompleteModule
  ],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss'
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  task?: ProjectTask;
  projects: Project[] = [];
  users: User[] = [];
  private autocompleteSetup = false;

  // Autocomplete observables
  filteredProjects!: Observable<Project[]>;
  filteredUsers!: Observable<User[]>;

  // Initialize arrays as properties to prevent change detection loops
  statusOptions: Array<{value: number, label: string}> = [
    { value: 0, label: 'To Do' },        // TaskStatus.ToDo
    { value: 1, label: 'In Progress' },  // TaskStatus.InProgress
    { value: 2, label: 'In Review' },    // TaskStatus.InReview
    { value: 3, label: 'Done' },         // TaskStatus.Done
    { value: 4, label: 'Blocked' }       // TaskStatus.Blocked
  ];

  priorityOptions: Array<{value: number, label: string}> = [
    { value: 0, label: 'Low' },      // TaskPriority.Low
    { value: 1, label: 'Medium' },   // TaskPriority.Medium
    { value: 2, label: 'High' },     // TaskPriority.High
    { value: 3, label: 'Critical' }  // TaskPriority.Critical
  ];

  // Use the constants for task types
  taskTypes: TaskType[] = TASK_TYPES;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private projectService: ProjectService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    @Optional() public dialogRef: MatDialogRef<TaskFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.taskForm = this.createForm();
  }

  ngOnInit(): void {
    // Load projects and users from API
    this.loadProjects();
    this.loadUsers();
    
    // Check if editing from route parameter
    const taskId = this.route.snapshot.paramMap.get('id');
    if (taskId) {
      this.isEditMode = true;
      // this.loadTask(taskId); // Temporarily disabled
    }
    
    // Check if editing from dialog data
    if (this.data?.task) {
      this.isEditMode = true;
      this.task = this.data.task;
      this.populateForm();
    }

    // Check if creating task for specific project
    if (this.data?.projectId) {
      this.taskForm.patchValue({ projectId: this.data.projectId });
    }
  }

  private setupAutocomplete(): void {
    if (this.autocompleteSetup) return;
    
    this.autocompleteSetup = true;
    
    // Setup project autocomplete
    this.filteredProjects = this.taskForm.get('projectId')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const searchText = typeof value === 'string' ? value : (value?.name || '');
        return this._filterProjects(searchText);
      })
    );

    // Setup user autocomplete
    this.filteredUsers = this.taskForm.get('assignedUserId')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const searchText = typeof value === 'string' ? value : (value ? `${value.firstName} ${value.lastName}` : '');
        return this._filterUsers(searchText);
      })
    );

    // Trigger initial values
    this.taskForm.get('projectId')?.updateValueAndValidity();
    this.taskForm.get('assignedUserId')?.updateValueAndValidity();
  }

  private _filterProjects(value: string): Project[] {
    if (!this.projects || !Array.isArray(this.projects)) {
      return [];
    }
    const filterValue = value.toLowerCase();
    return this.projects.filter(project => 
      project.name.toLowerCase().includes(filterValue) ||
      (project.clientName && project.clientName.toLowerCase().includes(filterValue))
    );
  }

  private _filterUsers(value: string): User[] {
    if (!this.users || !Array.isArray(this.users)) {
      return [];
    }
    const filterValue = value.toLowerCase();
    return this.users.filter(user => 
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(filterValue) ||
      user.email.toLowerCase().includes(filterValue)
    );
  }

  displayProjectFn(project: Project): string {
    return project ? project.name : '';
  }

  displayUserFn(user: User): string {
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  // Helper method for debugging
  testUserFilter(): void {
    const testResult = this._filterUsers('admin');
  }

  private createForm(): FormGroup {
    const form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(1000)]],
      projectId: ['', [Validators.required]],
      acronym: [DEFAULT_TASK_TYPE, [Validators.required]], // Use constant for default
      assignedUserId: [''],
      status: [0, [Validators.required]],  // 0 = TaskStatus.ToDo
      priority: [1, [Validators.required]], // 1 = TaskPriority.Medium
      dueDate: [''],
      estimatedHours: [0, [Validators.min(0)]]
    });
    return form;
  }

  private loadUsers(): void {
    this.userService.getAllUsersForDropdown().subscribe({
      next: (users) => {
        this.users = users;
        // Setup autocomplete immediately after users are loaded
        this.setupAutocompleteIfReady();
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.users = []; // Ensure it's an empty array on error
      }
    });
  }

  private loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        // Setup autocomplete immediately after projects are loaded
        this.setupAutocompleteIfReady();
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.projects = []; // Ensure it's an empty array on error
      }
    });
  }

  private setupAutocompleteIfReady(): void {
    // Setup autocomplete as soon as we have either dataset
    if (!this.autocompleteSetup) {
      this.setupAutocomplete();
    }
  }

  private loadTask(taskId: string): void {
    this.isLoading = true;
    this.taskService.getTask(taskId).subscribe({
      next: (task) => {
        this.task = task;
        this.populateForm();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading task:', error);
        this.snackBar.open('Error loading task', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  private populateForm(): void {
    if (this.task) {
      const dueDate = this.task.dueDate ? new Date(this.task.dueDate).toISOString().split('T')[0] : '';
      
      // Find the project and user objects for autocomplete
      const project = this.projects.find(p => p.id === this.task!.projectId);
      const user = this.users.find(u => u.id === this.task!.assignedUserId);
      
      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description,
        projectId: project || this.task.projectId,
        acronym: this.task.acronym,
        assignedUserId: user || this.task.assignedUserId || '',
        status: this.task.status,
        priority: this.task.priority,
        dueDate: dueDate,
        estimatedHours: this.task.estimatedHours || 0
      });

      // Disable acronym field for existing tasks since task number is auto-generated
      if (this.isEditMode) {
        this.taskForm.get('acronym')?.disable();
      }
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.isLoading = true;
      
      if (this.isEditMode && this.task) {
        this.updateTask();
      } else {
        this.createTask();
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private createTask(): void {
    const formValue = this.taskForm.value;
    
    // Extract IDs from autocomplete objects
    const projectId = typeof formValue.projectId === 'object' ? formValue.projectId.id : formValue.projectId;
    const assignedUserId = typeof formValue.assignedUserId === 'object' ? formValue.assignedUserId.id : formValue.assignedUserId;
    
    const createDto: CreateTaskRequest = {
      title: formValue.title,
      description: formValue.description,
      acronym: formValue.acronym,
      projectId: projectId,
      assignedToUserId: assignedUserId || undefined,
      status: formValue.status,
      priority: formValue.priority,
      dueDate: formValue.dueDate ? new Date(formValue.dueDate) : undefined,
      estimatedHours: formValue.estimatedHours
    };

    this.taskService.createTask(createDto).subscribe({
      next: (task) => {
        this.snackBar.open('Task created successfully', 'Close', { duration: 3000 });
        this.isLoading = false;
        this.onSuccess();
      },
      error: (error) => {
        console.error('Error creating task:', error);
        this.snackBar.open('Error creating task', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  private updateTask(): void {
    if (!this.task) return;

    const formValue = this.taskForm.value;
    
    // Extract IDs from autocomplete objects
    const assignedUserId = typeof formValue.assignedUserId === 'object' ? formValue.assignedUserId.id : formValue.assignedUserId;
    
    const updateDto: UpdateTaskRequest = {
      title: formValue.title,
      description: formValue.description,
      assignedToUserId: assignedUserId || undefined,
      status: formValue.status,
      priority: formValue.priority,
      dueDate: formValue.dueDate ? new Date(formValue.dueDate) : undefined,
      estimatedHours: formValue.estimatedHours,
      actualHours: this.task.actualHours || 0,
      isActive: true
    };

    this.taskService.updateTask(this.task.id, updateDto).subscribe({
      next: (updatedTask) => {
        this.snackBar.open('Task updated successfully', 'Close', { duration: 3000 });
        this.isLoading = false;
        this.onSuccess();
      },
      error: (error) => {
        console.error('Error updating task:', error);
        this.snackBar.open('Error updating task', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.taskForm.controls).forEach(key => {
      const control = this.taskForm.get(key);
      control?.markAsTouched();
    });
  }

  private onSuccess(): void {
    if (this.dialogRef) {
      // Return true to indicate successful update/creation
      this.dialogRef.close(true);
    } else {
      this.router.navigate(['/tasks']);
    }
  }

  onCancel(): void {
    if (this.dialogRef) {
      this.dialogRef.close(false);
    } else {
      this.router.navigate(['/tasks']);
    }
  }

  getFormTitle(): string {
    return this.isEditMode ? 'Edit Task' : 'Create New Task';
  }

  getSubmitButtonText(): string {
    return this.isEditMode ? 'Update Task' : 'Create Task';
  }
}
