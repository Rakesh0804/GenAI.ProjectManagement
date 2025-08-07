import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { OrganizationWithBranches, Branch } from '../../models/organization.model';

export interface OrganizationDetailsDialogData {
  organization: OrganizationWithBranches;
  onEditBranch: (organization: OrganizationWithBranches, branch: Branch) => void;
  onCreateBranch: (organization: OrganizationWithBranches) => void;
  onDeleteBranch: (branchId: string) => void;
  getBranchTypeIcon: (branchType: string) => string;
  getBranchTypeLabel: (branchType: string) => string;
  getBranchTypeColor: (branchType: string) => string;
  getEstablishedYear: (organization: OrganizationWithBranches) => string;
  trackByBranchId: (index: number, branch: Branch) => string;
}

@Component({
  selector: 'app-organization-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatTooltipModule,
    MatMenuModule,
    MatDividerModule
  ],
  template: `
    <div class="organization-details-dialog">
      <div class="dialog-header">
        <div class="org-header">
          <div class="org-avatar-large">
            <img *ngIf="data.organization.logoUrl" [src]="data.organization.logoUrl" [alt]="data.organization.name">
            <mat-icon *ngIf="!data.organization.logoUrl">business</mat-icon>
          </div>
          <div class="org-info">
            <div class="org-title-row">
              <h2>{{ data.organization.name }}</h2>
              <button mat-icon-button mat-dialog-close class="close-btn" matTooltip="Close Details">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <p class="org-industry">{{ data.organization.industry || 'Organization' }}</p>
            <div class="status-chip" [class.active]="data.organization.isActive" [class.inactive]="!data.organization.isActive">
              <mat-icon>{{ data.organization.isActive ? 'check_circle' : 'cancel' }}</mat-icon>
              <span>{{ data.organization.isActive ? 'Active' : 'Inactive' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="tab-container">
        <mat-tab-group class="details-tabs">
          <!-- Overview Tab -->
          <mat-tab label="Overview">
            <div class="tab-content">
            <div class="organization-details">
              <!-- Quick Stats -->
              <div class="stats-grid">
                <div class="stat-card">
                  <mat-icon color="primary">business</mat-icon>
                  <div class="stat-info">
                    <span class="stat-number">{{ data.organization.branches.length || 0 }}</span>
                    <span class="stat-label">Branches</span>
                  </div>
                </div>
                
                <div class="stat-card" *ngIf="data.organization.establishedDate">
                  <mat-icon color="accent">event</mat-icon>
                  <div class="stat-info">
                    <span class="stat-number">{{ data.getEstablishedYear(data.organization) }}</span>
                    <span class="stat-label">Established</span>
                  </div>
                </div>
                
                <div class="stat-card" *ngIf="data.organization.city || data.organization.country">
                  <mat-icon color="warn">location_on</mat-icon>
                  <div class="stat-info">
                    <span class="stat-number">{{ data.organization.city }}{{ data.organization.city && data.organization.country ? ', ' : '' }}{{ data.organization.country }}</span>
                    <span class="stat-label">Location</span>
                  </div>
                </div>
              </div>

              <!-- Contact Information -->
              <mat-card class="contact-card">
                <mat-card-header>
                  <mat-card-title>
                    <mat-icon>contact_mail</mat-icon>
                    Contact Information
                  </mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <div class="contact-grid">
                    <div class="contact-item" *ngIf="data.organization.email">
                      <mat-icon>email</mat-icon>
                      <div class="contact-details">
                        <span class="contact-label">Email</span>
                        <a [href]="'mailto:' + data.organization.email" class="contact-value">{{ data.organization.email }}</a>
                      </div>
                    </div>
                    
                    <div class="contact-item" *ngIf="data.organization.phone">
                      <mat-icon>phone</mat-icon>
                      <div class="contact-details">
                        <span class="contact-label">Phone</span>
                        <a [href]="'tel:' + data.organization.phone" class="contact-value">{{ data.organization.phone }}</a>
                      </div>
                    </div>
                    
                    <div class="contact-item" *ngIf="data.organization.website">
                      <mat-icon>language</mat-icon>
                      <div class="contact-details">
                        <span class="contact-label">Website</span>
                        <a [href]="data.organization.website" target="_blank" class="contact-value">{{ data.organization.website }}</a>
                      </div>
                    </div>
                    
                    <div class="contact-item" *ngIf="data.organization.address">
                      <mat-icon>home</mat-icon>
                      <div class="contact-details">
                        <span class="contact-label">Address</span>
                        <span class="contact-value">{{ data.organization.address }}</span>
                      </div>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>

              <!-- Additional Information -->
              <div class="info-grid" *ngIf="data.organization.description">
                <mat-card class="info-card">
                  <mat-card-header>
                    <mat-card-title>
                      <mat-icon>description</mat-icon>
                      Description
                    </mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <p>{{ data.organization.description }}</p>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- Branches Tab -->
        <mat-tab [label]="'Branches (' + (data.organization.branches.length || 0) + ')'">
          <div class="tab-content">
            <div class="branches-detail">
              <div class="branches-header">
                <h3>Organization Branches</h3>
                <button mat-raised-button color="primary" (click)="data.onCreateBranch(data.organization)">
                  <mat-icon>add</mat-icon>
                  Add Branch
                </button>
              </div>

              <div *ngIf="data.organization.branches && data.organization.branches.length > 0" class="branches-grid">
                <mat-card *ngFor="let branch of data.organization.branches; trackBy: data.trackByBranchId" class="branch-card">
                  <mat-card-header>
                    <div mat-card-avatar class="branch-avatar">
                      <mat-icon [color]="data.getBranchTypeColor(branch.branchType)">{{ data.getBranchTypeIcon(branch.branchType) }}</mat-icon>
                    </div>
                    <mat-card-title>{{ branch.name }}</mat-card-title>
                    <mat-card-subtitle>{{ data.getBranchTypeLabel(branch.branchType) }}</mat-card-subtitle>
                    <div class="branch-actions">
                      <button mat-icon-button [matMenuTriggerFor]="branchMenu">
                        <mat-icon>more_vert</mat-icon>
                      </button>
                      <mat-menu #branchMenu="matMenu">
                        <button mat-menu-item (click)="data.onEditBranch(data.organization, branch)">
                          <mat-icon>edit</mat-icon>
                          <span>Edit Branch</span>
                        </button>
                        <mat-divider></mat-divider>
                        <button mat-menu-item (click)="data.onDeleteBranch(branch.id)" class="delete-action">
                          <mat-icon color="warn">delete</mat-icon>
                          <span>Delete Branch</span>
                        </button>
                      </mat-menu>
                    </div>
                  </mat-card-header>
                  
                  <mat-card-content>
                    <div class="branch-details">
                      <div class="branch-info-item" *ngIf="branch.city">
                        <mat-icon>location_on</mat-icon>
                        <span>{{ branch.city }}</span>
                      </div>
                      
                      <div class="branch-info-item" *ngIf="branch.manager">
                        <mat-icon>person</mat-icon>
                        <span>{{ branch.manager.firstName }} {{ branch.manager.lastName }}</span>
                      </div>
                      
                      <div class="branch-info-item" *ngIf="branch.email">
                        <mat-icon>email</mat-icon>
                        <span>{{ branch.email }}</span>
                      </div>
                      
                      <div class="branch-info-item" *ngIf="branch.phone">
                        <mat-icon>phone</mat-icon>
                        <span>{{ branch.phone }}</span>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>

              <!-- No Branches State -->
              <div *ngIf="!data.organization.branches || data.organization.branches.length === 0" class="no-branches-detail">
                <mat-icon>business_center</mat-icon>
                <h3>No Branches</h3>
                <p>This organization doesn't have any branches yet.</p>
                <button mat-raised-button color="primary" (click)="data.onCreateBranch(data.organization)">
                  <mat-icon>add</mat-icon>
                  Create First Branch
                </button>
              </div>
            </div>
          </div>
        </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styleUrls: ['./organization-details-dialog.component.scss']
})
export class OrganizationDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<OrganizationDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrganizationDetailsDialogData
  ) {}
}
