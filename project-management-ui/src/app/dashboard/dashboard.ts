import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { ProjectService } from '../core/services/project.service';
import { TaskService } from '../core/services/task.service';
import { AuthService } from '../core/services/auth.service';
import { Project, ProjectStatus, Priority } from '../core/models/project.model';
import { ProjectTask, TaskStatus, TaskPriority, UserTaskDashboard } from '../core/models/task.model';
import { User } from '../core/models/user.model';
import { ProjectFormComponent } from '../projects/project-form/project-form';
import { TaskFormComponent } from '../tasks/task-form/task-form';

// Interface for dashboard data
interface QuickLink {
  title: string;
  route: string;
  icon: string;
}

interface Holiday {
  name: string;
  date: Date;
  type: string;
}

interface Announcement {
  title: string;
  content: string;
  date: Date;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    RouterModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  projects: Project[] = [];
  recentTasks: ProjectTask[] = [];
  myPendingTasks: ProjectTask[] = [];
  userTaskDashboard: UserTaskDashboard | null = null;
  quickLinks: QuickLink[] = [];
  upcomingHolidays: Holiday[] = [];
  announcements: Announcement[] = [];
  stats = {
    totalProjects: 0,
    activeProjects: 0,
    myTasks: 0,
    completedTasks: 0
  };

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    this.currentUser = this.authService.currentUserValue;
  }

  ngOnInit(): void {
    this.loadDashboardData();
    this.initializeMockData();
  }

  private loadDashboardData(): void {
    // Load projects
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects.slice(0, 5); // Show only recent 5
        this.stats.totalProjects = projects.length;
        this.stats.activeProjects = projects.filter(p => p.isActive).length;
      },
      error: (error) => console.error('Error loading projects:', error)
    });

    // Load user task dashboard data if user is logged in
    if (this.currentUser?.id) {
      this.taskService.getUserTaskDashboard(this.currentUser.id).subscribe({
        next: (dashboard) => {
          this.userTaskDashboard = dashboard;
          this.myPendingTasks = dashboard.pendingTasks.slice(0, 5); // Show only first 5 pending tasks
          this.stats.myTasks = dashboard.totalTaskCount;
          this.stats.completedTasks = dashboard.completedTaskCount;
        },
        error: (error) => console.error('Error loading user task dashboard:', error)
      });
    }

    // Load all tasks for recent tasks display
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.recentTasks = tasks.slice(0, 5); // Show only recent 5
      },
      error: (error) => console.error('Error loading tasks:', error)
    });
  }

  private initializeMockData(): void {
    // Mock Quick Links
    this.quickLinks = [
      { title: 'Create Project', route: '/projects/new', icon: 'add_circle' },
      { title: 'My Tasks', route: '/tasks', icon: 'assignment' },
      { title: 'Team Calendar', route: '/calendar', icon: 'event' },
      { title: 'Reports', route: '/reports', icon: 'assessment' }
    ];

    // Mock Upcoming Holidays
    this.upcomingHolidays = [
      { name: 'Ganesh Chaturthi', date: new Date('2025-08-27'), type: 'Restricted holiday' },
      { name: 'Mahatma Gandhi Jayanti/Vijaya Dashami', date: new Date('2025-10-02'), type: 'Restricted holiday' },
      { name: 'Deepavali', date: new Date('2025-10-20'), type: 'Restricted holiday' },
      { name: 'Deepavali', date: new Date('2025-10-21'), type: 'Restricted holiday' },
      { name: 'Thanksgiving Day', date: new Date('2025-11-27'), type: 'Restricted holiday' },
      { name: 'Christmas Eve', date: new Date('2025-12-24'), type: 'Restricted holiday' },
      { name: 'Christmas Day', date: new Date('2025-12-25'), type: 'Restricted holiday' }
    ];

    // Mock Announcements
    this.announcements = [
      { 
        title: 'Welcome to the new project management system', 
        content: 'We are excited to announce the launch of our new project management platform.',
        date: new Date('2025-08-06')
      }
    ];
  }

  formatDate(date: Date, format: string): string {
    const d = new Date(date);
    switch (format) {
      case 'd':
        return d.getDate().toString();
      case 'MMM':
        return d.toLocaleDateString('en-US', { month: 'short' });
      case 'EEEE':
        return d.toLocaleDateString('en-US', { weekday: 'long' });
      case 'MMM d, yyyy':
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      default:
        return d.toLocaleDateString();
    }
  }

  getStatusColor(status: number): string {
    switch (status) {
      case 0: return 'primary';   // Planning/ToDo
      case 1: return 'accent';    // InProgress
      case 2: return 'warn';      // OnHold/InReview
      case 3: return 'primary';   // Completed/Done
      case 4: return 'warn';      // Cancelled/Blocked
      default: return 'primary';
    }
  }

  getPriorityColor(priority: number): string {
    switch (priority) {
      case 0: return '#4caf50';   // Low - Green
      case 1: return '#ff9800';   // Medium - Orange
      case 2: return '#f44336';   // High - Red
      case 3: return '#9c27b0';   // Critical - Purple
      default: return '#757575';  // Default - Gray
    }
  }

  // Project status methods
  getStatusText(status: ProjectStatus): string {
    switch (status) {
      case ProjectStatus.Planning: return 'Planning';
      case ProjectStatus.InProgress: return 'In Progress';
      case ProjectStatus.OnHold: return 'On Hold';
      case ProjectStatus.Completed: return 'Completed';
      case ProjectStatus.Cancelled: return 'Cancelled';
      default: return 'Unknown';
    }
  }

  getStatusBadgeClass(status: ProjectStatus): string {
    switch (status) {
      case ProjectStatus.Planning: return 'status-planning';
      case ProjectStatus.InProgress: return 'status-inprogress';
      case ProjectStatus.OnHold: return 'status-onhold';
      case ProjectStatus.Completed: return 'status-completed';
      case ProjectStatus.Cancelled: return 'status-cancelled';
      default: return 'status-unknown';
    }
  }

  getPriorityText(priority: Priority): string {
    switch (priority) {
      case Priority.Low: return 'Low';
      case Priority.Medium: return 'Medium';
      case Priority.High: return 'High';
      case Priority.Critical: return 'Critical';
      default: return 'Unknown';
    }
  }

  getPriorityBadgeClass(priority: Priority): string {
    switch (priority) {
      case Priority.Low: return 'priority-low';
      case Priority.Medium: return 'priority-medium';
      case Priority.High: return 'priority-high';
      case Priority.Critical: return 'priority-critical';
      default: return 'priority-unknown';
    }
  }

  // Task status methods
  getTaskStatusText(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.ToDo: return 'To Do';
      case TaskStatus.InProgress: return 'In Progress';
      case TaskStatus.InReview: return 'In Review';
      case TaskStatus.Done: return 'Done';
      case TaskStatus.Blocked: return 'Blocked';
      default: return 'Unknown';
    }
  }

  getTaskStatusBadgeClass(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.ToDo: return 'status-todo';
      case TaskStatus.InProgress: return 'status-inprogress';
      case TaskStatus.InReview: return 'status-inreview';
      case TaskStatus.Done: return 'status-done';
      case TaskStatus.Blocked: return 'status-blocked';
      default: return 'status-unknown';
    }
  }

  getTaskPriorityText(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.Low: return 'Low';
      case TaskPriority.Medium: return 'Medium';
      case TaskPriority.High: return 'High';
      case TaskPriority.Critical: return 'Critical';
      default: return 'Unknown';
    }
  }

  getTaskPriorityBadgeClass(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.Low: return 'priority-low';
      case TaskPriority.Medium: return 'priority-medium';
      case TaskPriority.High: return 'priority-high';
      case TaskPriority.Critical: return 'priority-critical';
      default: return 'priority-unknown';
    }
  }

  createProject(): void {
    const dialogRef = this.dialog.open(ProjectFormComponent, {
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      disableClose: true,
      panelClass: 'project-form-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDashboardData();
      }
    });
  }

  createTask(): void {
    console.log('createTask method called'); // Debug log
    try {
      const dialogRef = this.dialog.open(TaskFormComponent, {
        width: '90vw',
        maxWidth: '800px',
        height: 'auto',
        maxHeight: '90vh',
        disableClose: true,
        hasBackdrop: true,
        backdropClass: 'task-dialog-backdrop',
        panelClass: 'task-dialog-panel'
      });

      console.log('Dialog ref created:', dialogRef); // Debug log

      dialogRef.afterClosed().subscribe(result => {
        console.log('Dialog closed with result:', result); // Debug log
        if (result) {
          this.loadDashboardData();
        }
      });
    } catch (error) {
      console.error('Error opening task dialog:', error); // Debug log
    }
  }
}
