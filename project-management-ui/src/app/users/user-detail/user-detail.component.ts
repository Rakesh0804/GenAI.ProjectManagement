import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User, UserService, ChangePasswordRequest } from '../../core/services/user.service';
import { UserFormComponent } from '../user-form/user-form.component';
import { ErrorHandlerService } from '../../core/services/error-handler.service';

@Component({
  selector: 'app-user-detail',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatTableModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent implements OnInit {
  user: User | null = null;
  subordinates: User[] = [];
  isLoading = true;
  userId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private errorHandler: ErrorHandlerService
  ) {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    if (this.userId) {
      this.loadUserDetails();
      this.loadSubordinates();
    } else {
      this.router.navigate(['/users']);
    }
  }

  loadUserDetails(): void {
    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        this.user = user;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorHandler.handleError(error);
        this.isLoading = false;
        this.router.navigate(['/users']);
      }
    });
  }

  loadSubordinates(): void {
    this.userService.getSubordinates(this.userId).subscribe({
      next: (subordinates) => {
        this.subordinates = subordinates;
      },
      error: (error) => {
        this.errorHandler.handleError(error);
      }
    });
  }

  editUser(): void {
    if (!this.user) return;

    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '800px',
      data: { mode: 'edit', user: this.user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUserDetails();
        this.snackBar.open('User updated successfully', 'Close', { duration: 3000 });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }

  getFullName(): string {
    if (!this.user) return '';
    return `${this.user.firstName} ${this.user.lastName}`;
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString();
  }

  getInitials(): string {
    if (!this.user) return '';
    return `${this.user.firstName.charAt(0)}${this.user.lastName.charAt(0)}`.toUpperCase();
  }
}
