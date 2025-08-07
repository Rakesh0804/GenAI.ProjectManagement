# Organization Module - Architectural Documentation

## Overview
This document provides comprehensive architectural details for the Organization Module implementation in the GenAI Project Management System. The module follows Clean Architecture principles with CQRS pattern and provides complete organizational structure management.

## Architecture Summary

### Design Patterns Implemented
- **Clean Architecture**: Clear separation of concerns across Domain, Application, Infrastructure, and Presentation layers
- **CQRS (Command Query Responsibility Segregation)**: Separate read and write operations with dedicated handlers
- **Repository Pattern**: Data access abstraction with domain-specific methods
- **Result Pattern**: Consistent error handling and operation result communication
- **BaseController Pattern**: Uniform API response structure across all endpoints

### Technology Stack
- **Backend**: .NET 9, Entity Framework Core, MediatR, AutoMapper, FluentValidation
- **Frontend**: Angular 20, Material Design, Reactive Forms, TypeScript
- **Database**: PostgreSQL with Entity Framework Core migrations
- **Authentication**: JWT with role-based authorization (Admin required)

## Domain Layer Architecture

### Core Entities

#### Organization Entity
```csharp
public class Organization : BaseEntity
{
    public string Name { get; set; }                    // Required, Max 200 chars
    public string? Description { get; set; }            // Optional, Max 1000 chars
    public string? Website { get; set; }                // Optional, Max 255 chars
    public string? Email { get; set; }                  // Optional, Max 255 chars
    public string? Phone { get; set; }                  // Optional, Max 50 chars
    public string? Address { get; set; }                // Optional, Max 500 chars
    public string? City { get; set; }                   // Optional, Max 100 chars
    public string? State { get; set; }                  // Optional, Max 100 chars
    public string? Country { get; set; }                // Optional, Max 100 chars
    public string? PostalCode { get; set; }             // Optional, Max 20 chars
    public string? Logo { get; set; }                   // Optional, Max 500 chars
    public DateTime? EstablishedDate { get; set; }      // Optional
    public int EmployeeCount { get; set; }              // Default 0
    public bool IsActive { get; set; } = true;          // Default true
    
    // Navigation Properties
    public virtual ICollection<Branch> Branches { get; set; }
    public virtual ICollection<OrganizationPolicy> Policies { get; set; }
    public virtual ICollection<CompanyHoliday> Holidays { get; set; }
    public virtual ICollection<OrganizationSetting> Settings { get; set; }
}
```

#### Branch Entity
```csharp
public class Branch : BaseEntity
{
    public Guid OrganizationId { get; set; }           // Required FK
    public string Name { get; set; }                   // Required, Max 200 chars
    public string? Description { get; set; }           // Optional, Max 1000 chars
    public string? Address { get; set; }               // Optional, Max 500 chars
    public string? City { get; set; }                  // Optional, Max 100 chars
    public string? State { get; set; }                 // Optional, Max 100 chars
    public string? Country { get; set; }               // Optional, Max 100 chars
    public string? PostalCode { get; set; }            // Optional, Max 20 chars
    public string? Phone { get; set; }                 // Optional, Max 50 chars
    public string? Email { get; set; }                 // Optional, Max 255 chars
    public Guid ManagerId { get; set; }                // Required FK to User
    public bool IsActive { get; set; } = true;         // Default true
    
    // Navigation Properties
    public virtual Organization Organization { get; set; }
    public virtual User Manager { get; set; }
}
```

#### Supporting Entities
- **OrganizationPolicy**: Policy management with type classification
- **CompanyHoliday**: Holiday management with recurring options
- **OrganizationSetting**: Key-value configuration system

### Entity Relationships
```
Organization (1) ──────────── (Many) Branch
Organization (1) ──────────── (Many) OrganizationPolicy
Organization (1) ──────────── (Many) CompanyHoliday
Organization (1) ──────────── (Many) OrganizationSetting
Branch (Many) ───────────────── (1) User [Manager]
```

## Application Layer Architecture

### CQRS Implementation

#### Command Structure
All commands follow consistent patterns:
- Input validation using FluentValidation
- Authorization checks (Admin role required)
- Business logic execution
- Result<T> return pattern for error handling

#### Query Structure
All queries implement:
- Input parameter validation
- Data filtering and transformation
- DTO mapping with AutoMapper
- Consistent Result<T> responses

### Command Handlers

#### Organization Commands
- **CreateOrganizationCommand**: Creates new organization with validation
- **UpdateOrganizationCommand**: Updates existing organization with change tracking
- **DeleteOrganizationCommand**: Soft delete with cascade considerations

#### Branch Commands
- **CreateBranchCommand**: Creates branch with organization validation
- **UpdateBranchCommand**: Updates branch with manager assignment validation
- **DeleteBranchCommand**: Removes branch with dependency checks

### Query Handlers

#### Organization Queries
- **GetOrganizationQuery**: Single organization retrieval
- **GetOrganizationsQuery**: Paginated organization listing
- **GetOrganizationWithBranchesQuery**: Organization with related branches

#### Branch Queries
- **GetBranchQuery**: Single branch retrieval with manager details
- **GetBranchesQuery**: All branches with filtering
- **GetBranchesByOrganizationQuery**: Organization-specific branches

### Data Transfer Objects (DTOs)

#### Response DTOs
```csharp
public class OrganizationDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string? Description { get; set; }
    // ... all organization properties
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class OrganizationWithBranchesDto : OrganizationDto
{
    public List<BranchDto> Branches { get; set; }
}
```

#### Command DTOs
```csharp
public class OrganizationCreateDto
{
    public string Name { get; set; }
    public string? Description { get; set; }
    // ... input properties for creation
}

public class OrganizationUpdateDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    // ... properties for updates
}
```

## Infrastructure Layer Architecture

### Repository Implementation

#### Generic Repository Pattern
```csharp
public interface IRepository<T> where T : BaseEntity
{
    Task<Result<T>> GetByIdAsync(Guid id);
    Task<Result<IEnumerable<T>>> GetAllAsync();
    Task<Result<T>> AddAsync(T entity);
    Task<Result<T>> UpdateAsync(T entity);
    Task<Result<bool>> DeleteAsync(Guid id);
}
```

#### Domain-Specific Repositories
```csharp
public interface IOrganizationRepository : IRepository<Organization>
{
    Task<Result<Organization>> GetWithBranchesAsync(Guid id);
    Task<Result<IEnumerable<Organization>>> GetActiveOrganizationsAsync();
    Task<Result<bool>> ExistsAsync(string name);
}

public interface IBranchRepository : IRepository<Branch>
{
    Task<Result<IEnumerable<Branch>>> GetByOrganizationIdAsync(Guid organizationId);
    Task<Result<Branch>> GetWithManagerAsync(Guid id);
    Task<Result<bool>> ExistsInOrganizationAsync(Guid organizationId, string name);
}
```

### Entity Framework Configuration

#### Organization Configuration
```csharp
public class OrganizationConfiguration : IEntityTypeConfiguration<Organization>
{
    public void Configure(EntityTypeBuilder<Organization> builder)
    {
        builder.ToTable("Organizations");
        
        builder.Property(e => e.Name)
            .IsRequired()
            .HasMaxLength(200);
            
        builder.HasIndex(e => e.Name)
            .IsUnique();
            
        builder.HasMany(e => e.Branches)
            .WithOne(e => e.Organization)
            .HasForeignKey(e => e.OrganizationId)
            .OnDelete(DeleteBehavior.Cascade);
            
        // Additional configurations...
    }
}
```

#### Branch Configuration
```csharp
public class BranchConfiguration : IEntityTypeConfiguration<Branch>
{
    public void Configure(EntityTypeBuilder<Branch> builder)
    {
        builder.ToTable("Branches");
        
        builder.Property(e => e.Name)
            .IsRequired()
            .HasMaxLength(200);
            
        builder.HasIndex(e => new { e.OrganizationId, e.Name })
            .IsUnique();
            
        builder.HasOne(e => e.Manager)
            .WithMany()
            .HasForeignKey(e => e.ManagerId)
            .OnDelete(DeleteBehavior.Restrict);
            
        // Additional configurations...
    }
}
```

### Database Migration

#### Migration: AddOrganizationModule
Created tables:
- `Organizations` with proper indexes and constraints
- `Branches` with foreign key relationships
- `OrganizationPolicies` with policy type classification
- `CompanyHolidays` with recurring holiday support
- `OrganizationSettings` with key-value configuration

Key indexes created:
- `IX_Organizations_Name` (Unique)
- `IX_Branches_OrganizationId_Name` (Unique composite)
- `IX_OrganizationPolicies_OrganizationId`
- `IX_CompanyHolidays_OrganizationId`
- `IX_OrganizationSettings_OrganizationId_SettingKey` (Unique composite)

## Presentation Layer Architecture

### API Controllers

#### BaseController Pattern
```csharp
public abstract class BaseController : ControllerBase
{
    protected IActionResult HandleResult<T>(Result<T> result)
    {
        if (result.IsSuccess)
            return Ok(result.Data);
            
        return result.Error switch
        {
            "NotFound" => NotFound(result.Error),
            "ValidationError" => BadRequest(result.Error),
            "UnauthorizedAccess" => Unauthorized(result.Error),
            _ => StatusCode(500, result.Error)
        };
    }
}
```

#### Organizations Controller
```csharp
[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class OrganizationsController : BaseController
{
    // GET /api/organizations
    public async Task<IActionResult> GetOrganizations()
    
    // GET /api/organizations/{id}
    public async Task<IActionResult> GetOrganization(Guid id)
    
    // GET /api/organizations/{id}/with-branches
    public async Task<IActionResult> GetOrganizationWithBranches(Guid id)
    
    // POST /api/organizations
    public async Task<IActionResult> CreateOrganization(OrganizationCreateDto dto)
    
    // PUT /api/organizations/{id}
    public async Task<IActionResult> UpdateOrganization(Guid id, OrganizationUpdateDto dto)
    
    // DELETE /api/organizations/{id}
    public async Task<IActionResult> DeleteOrganization(Guid id)
}
```

### Frontend Architecture

#### Component Structure
```
organizations/
├── components/
│   ├── organization-form/           # Create/Edit organization
│   ├── branch-form/                 # Create/Edit branch
│   └── organization-dashboard/      # View organization details
├── interfaces/
│   └── organization.interface.ts    # TypeScript interfaces
├── models/
│   └── organization.model.ts        # Existing model compatibility
└── services/
    └── organization.service.ts      # API integration services
```

#### Angular Component Features

##### Organization Form Component
```typescript
@Component({
  selector: 'app-organization-form',
  standalone: true,
  imports: [/* Material Design modules */]
})
export class OrganizationFormComponent implements OnInit {
  @Input() organization: Organization | null = null;
  @Input() isEdit: boolean = false;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  
  organizationForm: FormGroup;
  
  // Reactive form with comprehensive validation
  // Material Design UI with responsive layout
  // Error handling and user feedback
}
```

##### Branch Form Component
```typescript
@Component({
  selector: 'app-branch-form',
  standalone: true,
  imports: [/* Material Design modules */]
})
export class BranchFormComponent implements OnInit {
  @Input() branch: Branch | null = null;
  @Input() organizationId!: string;
  @Input() users: User[] = [];
  @Output() save = new EventEmitter<BranchCreateDto | BranchUpdateDto>();
  
  // User autocomplete for manager selection
  // Reactive forms with validation
  // Material Design components
}
```

#### TypeScript Interfaces

```typescript
export interface Organization {
  id: string;
  name: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  logo?: string;
  establishedDate?: string;
  employeeCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  managerId: string;
  managerName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

#### Material Design Implementation

##### Responsive Design
- Mobile-first approach with breakpoints
- Adaptive grid systems for different screen sizes
- Touch-friendly interfaces for mobile devices
- Progressive enhancement for desktop features

##### Component Styling
```scss
.organization-form-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;

  .form-card {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 8px;

    mat-card-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      // Professional gradient styling
    }
  }
}

// Dark theme support
@media (prefers-color-scheme: dark) {
  // Dark theme color adjustments
}
```

## Security Architecture

### Authorization Strategy
- **Admin Role Required**: All organization management operations
- **JWT Token Validation**: Secure API access
- **Role-Based Access Control**: Granular permission system

### Data Validation
- **Frontend Validation**: Real-time form validation with Material Design
- **Backend Validation**: FluentValidation with business rules
- **Database Constraints**: Entity Framework configurations

### Error Handling
- **Result Pattern**: Consistent error propagation
- **HTTP Status Codes**: Proper REST API responses
- **User-Friendly Messages**: Meaningful error feedback

## Performance Considerations

### Database Optimization
- **Proper Indexing**: Strategic indexes for common queries
- **Foreign Key Relationships**: Optimized joins and navigation
- **Query Efficiency**: EF Core query optimization

### Frontend Optimization
- **Lazy Loading**: Component-based loading strategy
- **Change Detection**: OnPush strategy for performance
- **Bundle Optimization**: Tree-shaking and code splitting

### Caching Strategy
- **Repository Caching**: In-memory caching for frequently accessed data
- **HTTP Caching**: Browser caching for static resources
- **API Response Caching**: Server-side response caching

## Testing Strategy

### Unit Testing
- **Domain Logic**: Business rule validation
- **Command Handlers**: CQRS operation testing
- **Repository Methods**: Data access testing

### Integration Testing
- **API Endpoints**: Full request/response cycle testing
- **Database Operations**: Entity Framework integration testing
- **Authentication**: JWT token validation testing

### Frontend Testing
- **Component Testing**: Angular component unit tests
- **Form Validation**: Reactive form validation testing
- **Service Integration**: API service mocking and testing

## Deployment Architecture

### Database Migrations
- **Entity Framework Migrations**: Version-controlled schema changes
- **Rollback Strategy**: Safe migration rollback procedures
- **Production Deployment**: Automated migration execution

### Environment Configuration
- **Development**: Local PostgreSQL with test data
- **Staging**: Production-like environment for testing
- **Production**: Optimized PostgreSQL with monitoring

### Monitoring and Logging
- **Application Logging**: Structured logging with Serilog
- **Performance Monitoring**: Application performance metrics
- **Error Tracking**: Centralized error reporting and alerting

## Future Enhancements

### Planned Features
1. **Organization Chart Visualization**: Interactive hierarchy display
2. **Geographic Branch Mapping**: Location-based branch visualization
3. **Advanced Policy Management**: Document versioning and approval workflows
4. **Holiday Calendar Integration**: Calendar view with team scheduling
5. **Organization Analytics**: Reporting and dashboard enhancements

### Scalability Considerations
1. **Microservices Migration**: Service decomposition strategy
2. **Event Sourcing**: Event-driven architecture implementation
3. **CQRS Scaling**: Read/write database separation
4. **Cache Optimization**: Distributed caching implementation

This architecture provides a solid foundation for enterprise-level organization management with room for future growth and enhancement.
