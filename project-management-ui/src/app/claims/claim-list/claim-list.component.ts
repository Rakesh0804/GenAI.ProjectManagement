import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { Claim, ClaimService } from '../../core/services/claim.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { ClaimFormComponent } from '../claim-form/claim-form.component';
import { ErrorHandlerService } from '../../core/services/error-handler.service';

@Component({
  selector: 'app-claim-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatDialogModule,
    MatMenuModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    FormsModule
  ],
  templateUrl: './claim-list.component.html',
  styleUrl: './claim-list.component.scss'
})
export class ClaimListComponent implements OnInit {
  claims: Claim[] = [];
  displayedColumns: string[] = ['name', 'type', 'description', 'status', 'createdAt', 'actions'];
  totalCount = 0;
  pageSize = 10;
  currentPage = 0;
  searchTerm = '';
  isLoading = false;

  constructor(
    private claimService: ClaimService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.loadClaims();
  }

  loadClaims(): void {
    this.isLoading = true;
    this.claimService.getClaims(this.currentPage + 1, this.pageSize, this.searchTerm)
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.claims = response.data.items;
            this.totalCount = response.data.totalCount;
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.errorHandler.handleError(error);
          this.isLoading = false;
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadClaims();
  }

  onSearchChange(): void {
    this.currentPage = 0;
    this.loadClaims();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ClaimFormComponent, {
      width: '550px',
      maxWidth: '95vw',
      autoFocus: false,
      restoreFocus: false,
      data: {
        mode: 'create'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.loadClaims();
        this.snackBar.open('Claim created successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      }
    });
  }

  openEditDialog(claim: Claim): void {
    const dialogRef = this.dialog.open(ClaimFormComponent, {
      width: '550px',
      maxWidth: '95vw',
      autoFocus: false,
      restoreFocus: false,
      data: {
        mode: 'edit',
        claim: claim
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.loadClaims();
        this.snackBar.open('Claim updated successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      }
    });
  }

  deleteClaim(claim: Claim): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      maxWidth: '90vw',
      data: {
        title: 'Delete Claim',
        message: `Are you sure you want to delete the claim "${claim.name}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        icon: 'warning',
        color: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.claimService.deleteClaim(claim.id).subscribe({
          next: (response) => {
            if (response.success) {
              this.loadClaims();
              this.snackBar.open('Claim deleted successfully', 'Close', {
                duration: 3000,
                panelClass: ['success-snackbar']
              });
            }
          },
          error: (error) => {
            this.errorHandler.handleError(error);
          }
        });
      }
    });
  }

  getStatusClass(isActive: boolean): string {
    return isActive ? 'status-active' : 'status-inactive';
  }

  getStatusText(isActive: boolean): string {
    return isActive ? 'Active' : 'Inactive';
  }

  getTypeIcon(type: string): string {
    switch (type.toLowerCase()) {
      case 'permission':
        return 'security';
      case 'role':
        return 'group';
      case 'feature':
        return 'toggle_on';
      default:
        return 'label';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}
