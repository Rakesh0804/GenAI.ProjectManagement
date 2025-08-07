import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard';
import { ProjectList } from './projects/project-list/project-list';
import { ProjectDetail } from './projects/project-detail/project-detail';
import { ProjectFormComponent } from './projects/project-form/project-form';
import { TaskList } from './tasks/task-list/task-list';
import { TaskFormComponent } from './tasks/task-form/task-form';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserDetailComponent } from './users/user-detail/user-detail.component';
import { ClaimListComponent } from './claims/claim-list/claim-list.component';
import { OrganizationDashboardComponent } from './organizations/components/organization-dashboard/organization-dashboard.component';
import { BranchListComponent } from './organizations/components/branch-list/branch-list.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'home', 
    component: HomeComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'projects', 
    component: ProjectList, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'projects/new', 
    component: ProjectFormComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'projects/:id', 
    component: ProjectDetail, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'projects/:id/edit', 
    component: ProjectFormComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'tasks', 
    component: TaskList, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'tasks/new', 
    component: TaskFormComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'tasks/:id/edit', 
    component: TaskFormComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'users', 
    component: UserListComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'users/:id', 
    component: UserDetailComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'claims', 
    component: ClaimListComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'organizations', 
    component: OrganizationDashboardComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'organizations/:organizationId/branches', 
    component: BranchListComponent, 
    canActivate: [AuthGuard] 
  },
  { path: '**', redirectTo: '/login' }
];
