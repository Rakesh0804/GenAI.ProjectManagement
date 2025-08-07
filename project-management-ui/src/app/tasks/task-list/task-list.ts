import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TaskService, PaginatedResult, TaskQueryParams } from '../../core/services/task.service';
import { ProjectTask, TaskStatus, TaskPriority } from '../../core/models/task.model';
import { TaskFormComponent } from '../task-form/task-form';

@Component({
  selector: 'app-task-list',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatPaginatorModule
  ],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss'
})
export class TaskList implements OnInit {
  pagedTasks: ProjectTask[] = [];
  loading = true;
  displayedColumns: string[] = ['taskNumber', 'title', 'project', 'assignee', 'status', 'priority', 'dueDate', 'actions'];
  
  // Search properties
  searchTerm = '';
  private searchTimeout: any;
  
  // Pagination properties
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;
  hasPreviousPage = false;
  hasNextPage = false;
  
  // Expose enums to template
  TaskStatus = TaskStatus;
  TaskPriority = TaskPriority;

  constructor(
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    const queryParams: TaskQueryParams = {
      pageNumber: this.currentPage,
      pageSize: this.pageSize
    };
    
    // Add search term if present
    if (this.searchTerm && this.searchTerm.trim()) {
      queryParams.searchTerm = this.searchTerm.trim();
    }
    
    this.taskService.getTasks(queryParams).subscribe({
      next: (result: PaginatedResult<ProjectTask>) => {
        this.pagedTasks = result.items;
        this.totalItems = result.totalCount;
        this.totalPages = result.totalPages;
        this.hasPreviousPage = result.hasPreviousPage;
        this.hasNextPage = result.hasNextPage;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.snackBar.open('Error loading tasks', 'Close', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  // Pagination methods
  getTotalPages(): number {
    return this.totalPages;
  }

  getStartIndex(): number {
    return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  getEndIndex(): number {
    const endIndex = this.currentPage * this.pageSize;
    return Math.min(endIndex, this.totalItems);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadTasks();
    }
  }

  nextPage(): void {
    if (this.hasNextPage) {
      this.currentPage++;
      this.loadTasks();
    }
  }

  previousPage(): void {
    if (this.hasPreviousPage) {
      this.currentPage--;
      this.loadTasks();
    }
  }

  changePageSize(newPageSize: number): void {
    this.pageSize = newPageSize;
    this.currentPage = 1; // Reset to first page
    this.loadTasks();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1; // PageEvent uses 0-based indexing
    this.pageSize = event.pageSize;
    this.loadTasks();
  }

  getStatusClass(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.ToDo:
        return 'status-todo';
      case TaskStatus.InProgress:
        return 'status-progress';
      case TaskStatus.InReview:
        return 'status-review';
      case TaskStatus.Done:
        return 'status-done';
      case TaskStatus.Blocked:
        return 'status-blocked';
      default:
        return '';
    }
  }

  getPriorityClass(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.Low:
        return 'priority-low';
      case TaskPriority.Medium:
        return 'priority-medium';
      case TaskPriority.High:
        return 'priority-high';
      case TaskPriority.Critical:
        return 'priority-critical';
      default:
        return '';
    }
  }

  getStatusLabel(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.ToDo:
        return 'To Do';
      case TaskStatus.InProgress:
        return 'In Progress';
      case TaskStatus.InReview:
        return 'In Review';
      case TaskStatus.Done:
        return 'Done';
      case TaskStatus.Blocked:
        return 'Blocked';
      default:
        return 'Unknown';
    }
  }

  getStatusIcon(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.ToDo:
        return 'radio_button_unchecked';
      case TaskStatus.InProgress:
        return 'hourglass_empty';
      case TaskStatus.InReview:
        return 'rate_review';
      case TaskStatus.Done:
        return 'check_circle';
      case TaskStatus.Blocked:
        return 'block';
      default:
        return 'help';
    }
  }

  getPriorityLabel(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.Low:
        return 'Low';
      case TaskPriority.Medium:
        return 'Medium';
      case TaskPriority.High:
        return 'High';
      case TaskPriority.Critical:
        return 'Critical';
      default:
        return 'Unknown';
    }
  }

  getPriorityIcon(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.Low:
        return 'keyboard_arrow_down';
      case TaskPriority.Medium:
        return 'drag_handle';
      case TaskPriority.High:
        return 'keyboard_arrow_up';
      case TaskPriority.Critical:
        return 'priority_high';
      default:
        return 'help';
    }
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'No due date';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  updateTaskStatus(task: ProjectTask, newStatus: TaskStatus): void {
    const updateRequest = {
      title: task.title,
      description: task.description,
      status: newStatus,
      priority: task.priority,
      dueDate: task.dueDate,
      estimatedHours: task.estimatedHours,
      actualHours: task.actualHours,
      isActive: task.isActive,
      assignedUserId: task.assignedUserId
    };

    this.taskService.updateTask(task.id, updateRequest).subscribe({
      next: () => {
        task.status = newStatus;
        this.loadTasks(); // Refresh data
        this.snackBar.open('Task status updated successfully', 'Close', {
          duration: 3000
        });
      },
      error: (error) => {
        console.error('Error updating task status:', error);
        this.snackBar.open('Error updating task status', 'Close', {
          duration: 3000
        });
      }
    });
  }

  deleteTask(task: ProjectTask): void {
    if (confirm(`Are you sure you want to delete task "${task.title}"?`)) {
      this.taskService.deleteTask(task.id).subscribe({
        next: () => {
          this.snackBar.open('Task deleted successfully', 'Close', {
            duration: 3000
          });
          this.loadTasks(); // Reload all tasks and refresh pagination
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          this.snackBar.open('Error deleting task', 'Close', {
            duration: 3000
          });
        }
      });
    }
  }

  createTask(): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '800px',
      maxHeight: '90vh',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Add a small delay to ensure backend processing is complete
        setTimeout(() => {
          this.loadTasks();
        }, 100);
      }
    });
  }

  editTask(task: ProjectTask): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '800px',
      maxHeight: '90vh',
      disableClose: true,
      data: { task }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Add a small delay to ensure backend processing is complete
        setTimeout(() => {
          this.loadTasks();
        }, 100);
      }
    });
  }

  isOverdue(task: ProjectTask): boolean {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today && task.status !== TaskStatus.Done;
  }

  // Search methods
  onSearchChange(event: any): void {
    // Clear previous timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // Set a timeout to debounce the search
    this.searchTimeout = setTimeout(() => {
      this.currentPage = 1; // Reset to first page on search
      this.loadTasks();
    }, 500); // Wait 500ms after user stops typing
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 1;
    this.loadTasks();
  }
}
