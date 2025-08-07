import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrganizationService } from '../../../core/services/organization.service';
import { Organization, OrganizationWithBranches, Branch, BranchType } from '../../models/organization.model';
import { PaginatedResponse } from '../../../core/models/api.model';
import { OrganizationFormComponent } from '../organization-form/organization-form.component';
import { BranchFormComponent } from '../branch-form/branch-form.component';
import { OrganizationDetailsDialogComponent, OrganizationDetailsDialogData } from '../organization-details-dialog/organization-details-dialog.component';

@Component({
  selector: 'app-organization-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
    MatChipsModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  templateUrl: './organization-dashboard.component.html',
  styleUrls: ['./organization-dashboard.component.scss']
})
export class OrganizationDashboardComponent implements OnInit {
  organizations: OrganizationWithBranches[] = [];
  isLoading = true;
  currentPage = 1;
  pageSize = 10;
  totalCount = 0;

  constructor(
    private organizationService: OrganizationService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadOrganizationsData();
  }

  loadOrganizationsData(): void {
    this.isLoading = true;
    this.organizationService.getAllOrganizationsWithBranches(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        if (response.success) {
          this.organizations = response.data.items;
          this.totalCount = response.data.totalCount;
        } else {
          this.showError('Failed to load organizations data');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading organizations:', error);
        this.showError('Failed to load organizations data');
        this.isLoading = false;
      }
    });
  }

  selectOrganization(organization: OrganizationWithBranches): void {
    // This method can be removed or used for other purposes
  }

  createOrganization(): void {
    const dialogRef = this.dialog.open(OrganizationFormComponent, {
      width: '800px',
      maxHeight: '90vh',
      data: { mode: 'create', organization: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadOrganizationsData();
        this.showSuccess('Organization created successfully');
      }
    });
  }

  editOrganization(organization: OrganizationWithBranches): void {
    if (organization) {
      const dialogRef = this.dialog.open(OrganizationFormComponent, {
        width: '800px',
        maxHeight: '90vh',
        data: { mode: 'edit', organization: organization }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadOrganizationsData();
          this.showSuccess('Organization updated successfully');
        }
      });
    }
  }

  viewOrganizationDetails(organization: OrganizationWithBranches): void {
    if (!organization) {
      return;
    }

    const dialogRef = this.dialog.open(OrganizationDetailsDialogComponent, {
      width: '90vw',
      maxWidth: '900px',
      height: '90vh',
      maxHeight: '800px',
      disableClose: false,
      hasBackdrop: true,
      panelClass: 'organization-details-dialog-container',
      data: {
        organization: organization,
        onEditBranch: (org: OrganizationWithBranches, branch: Branch) => {
          dialogRef.close();
          this.editBranch(org, branch);
        },
        onCreateBranch: (org: OrganizationWithBranches) => {
          dialogRef.close();
          this.createBranch(org);
        },
        onDeleteBranch: (branchId: string) => {
          this.deleteBranch(branchId);
        },
        getBranchTypeIcon: this.getBranchTypeIcon.bind(this),
        getBranchTypeLabel: this.getBranchTypeLabel.bind(this),
        getBranchTypeColor: this.getBranchTypeColor.bind(this),
        getEstablishedYear: this.getEstablishedYear.bind(this),
        trackByBranchId: this.trackByBranchId.bind(this)
      } as OrganizationDetailsDialogData
    });
  }

  createBranch(organization: OrganizationWithBranches): void {
    if (organization) {
      this.openBranchDialog('create', organization);
    }
  }

  viewAllBranches(organization: OrganizationWithBranches): void {
    this.router.navigate(['/organizations', organization.id, 'branches']);
  }

  editBranch(organization: OrganizationWithBranches, branch: Branch): void {
    this.openBranchDialog('edit', organization, branch);
  }

  private openBranchDialog(mode: 'create' | 'edit', organization: OrganizationWithBranches, branch?: Branch): void {
    const dialogRef = this.dialog.open(BranchFormComponent, {
      width: '800px',
      maxHeight: '90vh',
      data: { 
        mode, 
        branch: branch || null, 
        organizationId: organization.id,
        users: [] // TODO: Load users from service
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadOrganizationsData();
        this.showSuccess(`Branch ${mode === 'edit' ? 'updated' : 'created'} successfully`);
      }
    });
  }

  deleteBranch(branchId: string): void {
    // For now, just show a message. In production, this would show a confirmation dialog
    this.showInfo('Delete functionality will be implemented with confirmation dialog');
  }

  getEstablishedYear(organization: OrganizationWithBranches): string {
    if (!organization || !organization.establishedDate) return 'N/A';
    return new Date(organization.establishedDate).getFullYear().toString();
  }

  getBranchTypeLabel(branchType: any): string {
    // Ensure we have a valid string representation
    let typeString: string;
    
    if (typeof branchType === 'string') {
      typeString = branchType;
    } else if (typeof branchType === 'number') {
      // Handle numeric enum values
      typeString = Object.values(BranchType)[branchType] || BranchType.BRANCH;
    } else {
      typeString = BranchType.BRANCH;
    }
    
    // Ensure typeString is actually a string before calling replace
    if (typeof typeString !== 'string') {
      typeString = String(typeString);
    }
    
    return typeString.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }

  getBranchTypeIcon(branchType: any): string {
    // Ensure we have a valid string representation
    let typeString: string;
    
    if (typeof branchType === 'string') {
      typeString = branchType;
    } else if (typeof branchType === 'number') {
      // Handle numeric enum values
      typeString = Object.values(BranchType)[branchType] || BranchType.BRANCH;
    } else {
      typeString = BranchType.BRANCH;
    }
    
    switch (typeString) {
      case BranchType.HEADQUARTERS:
        return 'corporate_fare';
      case BranchType.REGIONAL:
        return 'domain';
      case BranchType.BRANCH:
        return 'business';
      case BranchType.WAREHOUSE:
        return 'inventory';
      case BranchType.SALES_OFFICE:
        return 'storefront';
      default:
        return 'business';
    }
  }

  getBranchTypeColor(branchType: any): 'primary' | 'accent' | 'warn' | undefined {
    // Ensure we have a valid string representation
    let typeString: string;
    
    if (typeof branchType === 'string') {
      typeString = branchType;
    } else if (typeof branchType === 'number') {
      // Handle numeric enum values
      typeString = Object.values(BranchType)[branchType] || BranchType.BRANCH;
    } else {
      typeString = BranchType.BRANCH;
    }
    
    switch (typeString) {
      case BranchType.HEADQUARTERS:
        return 'primary';
      case BranchType.REGIONAL:
        return 'accent';
      case BranchType.WAREHOUSE:
        return 'warn';
      default:
        return undefined;
    }
  }

  getBranchTypeSummary(branches: any[]): { type: string; label: string; count: number }[] {
    const summary = branches.reduce((acc, branch) => {
      const type = branch.branchType;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(summary).map(([type, count]) => ({
      type,
      label: this.getBranchTypeLabel(type),
      count: count as number
    }));
  }

  trackByBranchId(index: number, branch: any): string {
    return branch.id;
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showInfo(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['info-snackbar']
    });
  }
}
