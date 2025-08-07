import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ProjectService } from '../../core/services/project.service';
import { TaskService } from '../../core/services/task.service';
import { Project, ProjectStatus, Priority } from '../../core/models/project.model';
import { ProjectTask, TaskStatus, TaskPriority } from '../../core/models/task.model';

@Component({
  selector: 'app-project-detail',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatProgressBarModule,
    MatSnackBarModule
  ],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss'
})
export class ProjectDetail implements OnInit {
  project: Project | null = null;
  projectTasks: ProjectTask[] = [];
  loading = true;
  tasksLoading = false;

  // Expose enums to template
  ProjectStatus = ProjectStatus;
  Priority = Priority;
  TaskStatus = TaskStatus;
  TaskPriority = TaskPriority;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.loadProject(projectId);
      this.loadProjectTasks(projectId);
    }
  }

  loadProject(id: string): void {
    this.loading = true;
    this.projectService.getProject(id).subscribe({
      next: (project) => {
        this.project = project;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading project:', error);
        this.snackBar.open('Error loading project', 'Close', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  loadProjectTasks(projectId: string): void {
    this.tasksLoading = true;
    this.taskService.getTasksByProject(projectId).subscribe({
      next: (tasks) => {
        this.projectTasks = tasks;
        this.tasksLoading = false;
      },
      error: (error) => {
        console.error('Error loading project tasks:', error);
        this.tasksLoading = false;
      }
    });
  }

  getStatusClass(status: ProjectStatus): string {
    switch (status) {
      case ProjectStatus.Planning:
        return 'status-planning';
      case ProjectStatus.InProgress:
        return 'status-progress';
      case ProjectStatus.OnHold:
        return 'status-hold';
      case ProjectStatus.Completed:
        return 'status-completed';
      case ProjectStatus.Cancelled:
        return 'status-cancelled';
      default:
        return '';
    }
  }

  getPriorityClass(priority: Priority): string {
    switch (priority) {
      case Priority.Low:
        return 'priority-low';
      case Priority.Medium:
        return 'priority-medium';
      case Priority.High:
        return 'priority-high';
      case Priority.Critical:
        return 'priority-critical';
      default:
        return '';
    }
  }

  getTaskStatusClass(status: TaskStatus): string {
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

  getTaskPriorityClass(priority: TaskPriority): string {
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

  getStatusLabel(status: ProjectStatus): string {
    switch (status) {
      case ProjectStatus.Planning:
        return 'Planning';
      case ProjectStatus.InProgress:
        return 'In Progress';
      case ProjectStatus.OnHold:
        return 'On Hold';
      case ProjectStatus.Completed:
        return 'Completed';
      case ProjectStatus.Cancelled:
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  }

  getPriorityLabel(priority: Priority): string {
    switch (priority) {
      case Priority.Low:
        return 'Low';
      case Priority.Medium:
        return 'Medium';
      case Priority.High:
        return 'High';
      case Priority.Critical:
        return 'Critical';
      default:
        return 'Unknown';
    }
  }

  getTaskStatusLabel(status: TaskStatus): string {
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

  getTaskPriorityLabel(priority: TaskPriority): string {
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

  getProgressPercentage(): number {
    if (!this.project || !this.project.taskCount || this.project.taskCount === 0) {
      return 0;
    }
    return Math.round(((this.project.completedTaskCount || 0) / this.project.taskCount) * 100);
  }

  getTasksByStatus(status: TaskStatus): ProjectTask[] {
    return this.projectTasks.filter(task => task.status === status);
  }

  editProject(): void {
    // Navigate to edit project page
    this.router.navigate(['/projects', this.project?.id, 'edit']);
  }

  deleteProject(): void {
    if (!this.project) return;
    
    if (confirm(`Are you sure you want to delete project "${this.project.name}"?`)) {
      this.projectService.deleteProject(this.project.id).subscribe({
        next: () => {
          this.snackBar.open('Project deleted successfully', 'Close', {
            duration: 3000
          });
          this.router.navigate(['/projects']);
        },
        error: (error) => {
          console.error('Error deleting project:', error);
          this.snackBar.open('Error deleting project', 'Close', {
            duration: 3000
          });
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }
}
