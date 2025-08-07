import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class LayoutComponent implements OnInit {
  currentUser: User | null = null;
  isAuthenticated = false;
  isAdmin = false;
  notificationCount = 1;
  currentRoute = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Subscribe to authentication state
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
      this.isAdmin = user?.roles?.includes('Admin') || user?.roles?.includes('SuperAdmin') || false;
    });

    // Track current route for breadcrumb
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;
      });
  }

  ngOnInit(): void {
    // Component initialization
  }

  getCurrentSection(): string {
    const route = this.currentRoute;
    if (route.includes('/dashboard')) return 'Dashboard';
    if (route.includes('/home')) return 'ProjectHub';
    if (route.includes('/projects')) return 'Projects';
    if (route.includes('/tasks')) return 'Tasks';
    if (route.includes('/users')) return 'Team';
    if (route.includes('/organization')) return 'Organization';
    if (route.includes('/calendar')) return 'Calendar';
    if (route.includes('/time-tracker')) return 'Time Tracker';
    if (route.includes('/attendance')) return 'Attendance';
    if (route.includes('/files')) return 'Files';
    if (route.includes('/travel')) return 'Travel';
    if (route.includes('/compensation')) return 'Compensation';
    if (route.includes('/reports')) return 'Reports';
    if (route.includes('/chat')) return 'Chat';
    return 'Dashboard';
  }

  getUserInitials(): string {
    if (!this.currentUser) return 'U';
    const first = this.currentUser.firstName?.charAt(0) || '';
    const last = this.currentUser.lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || 'U';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
