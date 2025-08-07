import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { OrganizationService } from '../../../core/services/organization.service';
import { BranchWithManager } from '../../models/organization.model';
import { PaginatedResponse } from '../../../core/models/api.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-branch-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss']
})
export class BranchListComponent implements OnInit {
  branches: BranchWithManager[] = [];
  isLoading = true;
  organizationId: string = '';
  
  // Pagination
  totalCount = 0;
  pageSize = 10;
  pageNumber = 1;
  pageSizeOptions = [5, 10, 25, 50];

  // Search
  searchControl = new FormControl('');

  // Table columns
  displayedColumns: string[] = ['name', 'code', 'branchType', 'manager', 'city', 'phone', 'isActive', 'actions'];

  constructor(
    private organizationService: OrganizationService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.organizationId = this.route.snapshot.paramMap.get('organizationId') || '';
    
    // Setup search functionality
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.pageNumber = 1;
        this.loadBranches();
      });

    this.loadBranches();
  }

  loadBranches(): void {
    this.isLoading = true;
    
    this.organizationService.getBranches(
      this.organizationId,
      this.pageNumber,
      this.pageSize,
      this.searchControl.value || undefined
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.branches = response.data.items;
          this.totalCount = response.data.totalCount;
        } else {
          this.showError('Failed to load branches');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading branches:', error);
        this.showError('Failed to load branches');
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadBranches();
  }

  createBranch(): void {
    this.router.navigate(['/organizations', this.organizationId, 'branches', 'new']);
  }

  editBranch(branchId: string): void {
    this.router.navigate(['/organizations', this.organizationId, 'branches', 'edit', branchId]);
  }

  deleteBranch(branch: BranchWithManager): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Branch',
        message: `Are you sure you want to delete "${branch.name}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.performDelete(branch.id);
      }
    });
  }

  private performDelete(branchId: string): void {
    this.organizationService.deleteBranch(branchId).subscribe({
      next: (response) => {
        if (response.success) {
          this.showSuccess('Branch deleted successfully');
          this.loadBranches();
        } else {
          this.showError('Failed to delete branch');
        }
      },
      error: (error) => {
        console.error('Error deleting branch:', error);
        this.showError('Failed to delete branch');
      }
    });
  }

  getBranchTypeLabel(branchType: string): string {
    return branchType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }

  getManagerName(branch: BranchWithManager): string {
    if (branch.manager) {
      return `${branch.manager.firstName} ${branch.manager.lastName}`;
    }
    return 'No Manager';
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}
