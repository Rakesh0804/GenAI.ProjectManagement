# Listing Component Design Standards

## Overview
This document outlines the standardized design system for all listing components in the Project Management application, using the `claim-list` component as the benchmark. All listing components should follow these design patterns to ensure consistency and professional appearance.

## Key Design Principles

### 1. Header Card Structure
- **Gradient Background**: Primary color to primary-dark gradient (135deg)
- **Color Scheme**: White text on primary gradient background
- **Layout**: Flex layout with title/subtitle on left, actions on right
- **Title Structure**: Icon + title with subtitle below
- **Actions**: Glass-morphism style buttons with hover effects

### 2. Content Card Structure
- **Background**: Clean white background
- **Shadow**: Medium shadow for depth
- **Border Radius**: Consistent border radius using CSS variables
- **Padding**: Zero padding on mat-card-content for full-width tables

### 3. Search Section
- **Background**: Light background with bottom border
- **Field Width**: Maximum 400px for optimal UX
- **Styling**: Outline appearance with search icon suffix

### 4. Table Design
- **Headers**: Light background with primary color icons
- **Rows**: Hover effects with light background
- **Cell Padding**: Consistent using CSS variable spacing
- **Typography**: Professional hierarchy with font weights

### 5. Status and Priority Chips
- **Design**: Rounded chips with icons and text
- **Colors**: Semantic color system (success, warning, error)
- **Icons**: Contextual icons for better recognition
- **Size**: Consistent sizing with proper spacing

## Component Structure Template

```html
<div class="[module-name]-list-container">
  <!-- Header Card -->
  <mat-card class="header-card">
    <mat-card-header>
      <div class="header-content">
        <div class="header-left">
          <mat-card-title>
            <mat-icon class="header-icon">[icon-name]</mat-icon>
            [Module Name] Management
          </mat-card-title>
          <mat-card-subtitle>[Description text]</mat-card-subtitle>
        </div>
        <div class="header-actions">
          <button mat-raised-button color="primary" (click)="create[Entity]()" class="create-button">
            <mat-icon>add</mat-icon>
            Create [Entity]
          </button>
        </div>
      </div>
    </mat-card-header>
  </mat-card>

  <!-- Content Card -->
  <mat-card class="content-card">
    <mat-card-content>
      <!-- Search Section -->
      <div class="search-section">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search [entities]...</mat-label>
          <input matInput [(ngModel)]="searchTerm" (input)="onSearch()" placeholder="[Search placeholder]">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="loading-container">
        <mat-spinner diameter="50"></mat-spinner>
        <p>Loading [entities]...</p>
      </div>

      <!-- Table -->
      <div *ngIf="!isLoading" class="table-container">
        <table mat-table [dataSource]="[entities] || []" class="[entities]-table">
          <!-- Columns with header-cell class and header-content structure -->
          <!-- Action menu with mat-divider separation -->
        </table>

        <!-- No Data State -->
        <div *ngIf="(![entities] || [entities].length === 0)" class="no-data">
          <mat-icon class="no-data-icon">[no-data-icon]</mat-icon>
          <h3>[No data title]</h3>
          <p>[No data description]</p>
          <button *ngIf="!searchTerm" mat-raised-button color="primary" (click)="create[Entity]()">
            <mat-icon>add</mat-icon>
            Create First [Entity]
          </button>
        </div>
      </div>

      <!-- Pagination -->
      <mat-paginator *ngIf="!isLoading && [entities] && [entities].length > 0" class="paginator">
      </mat-paginator>
    </mat-card-content>
  </mat-card>
</div>
```

## SCSS Structure Template

```scss
// [Module] List Component Styles - Professional Design System
.[module-name]-list-container {
  padding: var(--spacing-large);
  max-width: 1400px;
  margin: 0 auto;

  // Header card styling
  .header-card {
    margin-bottom: var(--spacing-large);
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
    color: white;
    box-shadow: var(--shadow-medium);
    border-radius: var(--border-radius);

    mat-card-header {
      padding: var(--spacing-large);
      // ... header content structure
    }
  }

  // Content card styling
  .content-card {
    background: white;
    box-shadow: var(--shadow-medium);
    border-radius: var(--border-radius);
    overflow: hidden;
  }

  // Search section styling
  .search-section {
    padding: var(--spacing-large);
    background: var(--background-light);
    border-bottom: 1px solid var(--border-light);
  }

  // Table container and styling
  .table-container {
    // ... professional table styles
  }

  // Responsive design
  @media (max-width: 768px) {
    // ... mobile adaptations
  }
}
```

## Required TypeScript Methods

```typescript
// Status/Priority styling methods
getStatusClass(status: Status): string { /* ... */ }
getStatusIcon(status: Status): string { /* ... */ }
getPriorityClass(priority: Priority): string { /* ... */ }
getPriorityIcon(priority: Priority): string { /* ... */ }

// Date formatting
formatDate(date: Date | string | undefined): string { /* ... */ }

// CRUD operations
openCreateDialog(): void { /* ... */ }
openEditDialog(entity: Entity): void { /* ... */ }
deleteEntity(entity: Entity): void { /* ... */ }

// Search and pagination
onSearch(): void { /* ... */ }
onPageChange(event: PageEvent): void { /* ... */ }
```

## Required Angular Material Imports

```typescript
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
```

## CSS Variables Used

```scss
// Spacing
--spacing-small: 8px;
--spacing-medium: 16px;
--spacing-large: 24px;
--spacing-xl: 32px;
--spacing-xxl: 48px;

// Colors
--primary-color: #1976d2;
--primary-dark: #1565c0;
--primary-light: #e3f2fd;
--success-color: #4caf50;
--success-light: #e8f5e8;
--success-dark: #2e7d32;
--error-color: #f44336;
--error-light: #ffebee;
--error-dark: #c62828;
--text-primary: #212121;
--text-secondary: #757575;
--text-light: #9e9e9e;
--background-light: #f5f5f5;
--background-hover: #f9f9f9;
--border-light: #e0e0e0;

// Shadows
--shadow-medium: 0 2px 8px rgba(0, 0, 0, 0.1);

// Border radius
--border-radius: 8px;
```

## Standardized Components

### ✅ Implemented
1. **claim-list** - Benchmark component with all design standards
2. **user-list** - Updated to match claim-list standards
3. **task-list** - Updated to match claim-list standards

### 🔲 To be Updated
- project-list
- team-list
- organization-list
- calendar-list
- timetracker-list
- attendance-list
- files-list
- travel-list
- compensation-list
- reports-list
- chat-list

## Best Practices

1. **Consistency**: Always use the same header structure across all modules
2. **Accessibility**: Include proper ARIA labels and tooltips
3. **Performance**: Use OnPush change detection where possible
4. **Responsive**: Ensure mobile-first responsive design
5. **Loading States**: Always provide loading and empty state feedback
6. **Error Handling**: Implement proper error handling with user feedback
7. **Icons**: Use consistent Material Design icons for similar actions
8. **Colors**: Follow the semantic color system for status indicators

## Maintenance Notes

- Update this document when making changes to the design system
- Test new components against the claim-list benchmark
- Ensure all CSS variables are defined in the global styles
- Validate responsive behavior on multiple screen sizes
- Keep the component structure consistent for easier maintenance

---

*Last Updated: [Current Date]*  
*Benchmark Component: claim-list.component*  
*Design System Version: 1.0*
