import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';

export interface ProjectStatistics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  onHoldProjects: number;
}

export interface TaskStatistics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
}

export interface ModuleInfo {
  name: string;
  description: string;
  icon: string;
  route: string;
  isImplemented: boolean;
  color: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MatDividerModule,
    MatChipsModule,
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  projectStats: ProjectStatistics = {
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    onHoldProjects: 0
  };

  taskStats: TaskStatistics = {
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0
  };

  // Module information
  modules: ModuleInfo[] = [
    {
      name: 'Projects',
      description: 'Manage and track project progress, milestones, and deliverables',
      icon: 'work',
      route: '/projects',
      isImplemented: true,
      color: '#2196F3'
    },
    {
      name: 'Tasks',
      description: 'Create, assign, and monitor task completion and progress',
      icon: 'assignment',
      route: '/tasks',
      isImplemented: true,
      color: '#4CAF50'
    },
    {
      name: 'Team',
      description: 'Manage team members, departments, and organizational structure',
      icon: 'people',
      route: '/users',
      isImplemented: true,
      color: '#FF9800'
    },
    {
      name: 'Calendar',
      description: 'Schedule meetings, events, and track important deadlines',
      icon: 'event',
      route: '/calendar',
      isImplemented: false,
      color: '#9C27B0'
    },
    {
      name: 'Time Tracker',
      description: 'Track time spent on projects and tasks for accurate billing',
      icon: 'access_time',
      route: '/time-tracker',
      isImplemented: false,
      color: '#607D8B'
    },
    {
      name: 'Files',
      description: 'Store, share, and collaborate on documents and files',
      icon: 'folder',
      route: '/files',
      isImplemented: false,
      color: '#795548'
    },
    {
      name: 'Reports',
      description: 'Generate insights and analytics on project performance',
      icon: 'assessment',
      route: '/reports',
      isImplemented: false,
      color: '#3F51B5'
    },
    {
      name: 'Chat',
      description: 'Real-time messaging and team communication platform',
      icon: 'chat',
      route: '/chat',
      isImplemented: false,
      color: '#E91E63'
    }
  ];

  // Recent activities
  recentActivities = [
    {
      icon: 'work',
      title: 'New project created',
      description: 'E-commerce Platform project has been initialized',
      time: '2 hours ago',
      color: '#2196F3'
    },
    {
      icon: 'assignment_turned_in',
      title: 'Task completed',
      description: 'Database schema design task marked as complete',
      time: '4 hours ago',
      color: '#4CAF50'
    },
    {
      icon: 'people',
      title: 'Team member added',
      description: 'John Doe joined the development team',
      time: '1 day ago',
      color: '#FF9800'
    },
    {
      icon: 'event',
      title: 'Meeting scheduled',
      description: 'Sprint planning meeting scheduled for tomorrow',
      time: '2 days ago',
      color: '#9C27B0'
    }
  ];

  // Quick stats cards
  quickStats = [
    {
      title: 'Active Projects',
      value: '12',
      change: '+2',
      changeType: 'positive',
      icon: 'work',
      color: '#2196F3'
    },
    {
      title: 'Team Members',
      value: '28',
      change: '+3',
      changeType: 'positive',
      icon: 'people',
      color: '#4CAF50'
    },
    {
      title: 'Pending Tasks',
      value: '45',
      change: '-8',
      changeType: 'positive',
      icon: 'assignment',
      color: '#FF9800'
    },
    {
      title: 'On Schedule',
      value: '89%',
      change: '+5%',
      changeType: 'positive',
      icon: 'schedule',
      color: '#9C27B0'
    }
  ];

  ngOnInit(): void {
    this.loadStatistics();
  }

  private loadStatistics(): void {
    // Simulate loading project statistics
    this.projectStats = {
      totalProjects: 15,
      activeProjects: 12,
      completedProjects: 3,
      onHoldProjects: 0
    };

    // Simulate loading task statistics
    this.taskStats = {
      totalTasks: 128,
      completedTasks: 83,
      pendingTasks: 45,
      overdueTasks: 7
    };
  }

  getImplementedModulesCount(): number {
    return this.modules.filter(m => m.isImplemented).length;
  }

  getTotalModulesCount(): number {
    return this.modules.length;
  }

  getCompletionPercentage(): number {
    return Math.round((this.getImplementedModulesCount() / this.getTotalModulesCount()) * 100);
  }
}
