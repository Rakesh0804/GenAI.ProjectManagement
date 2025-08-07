# AI Assistant Reference - GenAI Project Management System

## 🤖 For Future AI Context

This document provides complete architectural understanding for AI assistants working on this project.

## 🎯 Project Identity

**Name**: GenAI Project Management System  
**Architecture**: .NET 9 Clean Architecture with Angular 20 frontend  
**Status**: Production-ready multi-module enterprise application  
**Database**: PostgreSQL with Entity Framework Core  
**Authentication**: JWT with role-based authorization  

## 📋 Module Implementation Matrix

| Module | Status | Backend | Frontend | Database | API | Documentation |
|--------|--------|---------|----------|-----------|-----|---------------|
| User Module | ✅ Complete | ✅ CQRS | ✅ Angular | ✅ EF Core | ✅ JWT Auth | ✅ Documented |
| Role Module | ✅ Complete | ✅ CQRS | ✅ Angular | ✅ EF Core | ✅ RBAC | ✅ Documented |
| Project Module | ✅ Complete | ✅ CQRS | ✅ Kanban | ✅ EF Core | ✅ Team Mgmt | ✅ Documented |
| Task Module | ✅ Complete | ✅ CQRS | ✅ Task Board | ✅ EF Core | ✅ Auto Number | ✅ Documented |
| Organization Module | ✅ Complete | ✅ CQRS | ✅ Material | ✅ EF Core | ✅ Admin Only | ✅ Documented |

## 🏗️ Architectural DNA

### Core Patterns Applied
1. **Clean Architecture**: Domain → Application → Infrastructure → Presentation
2. **CQRS with MediatR**: Separate commands and queries with Result<T> pattern
3. **Repository Pattern**: Domain-specific data access with EF Core
4. **BaseController Pattern**: Consistent API responses with HandleResult()
5. **Standalone Components**: Angular 20 with Material Design
6. **Entity Configuration**: Explicit EF Core fluent API configuration

### Error Handling Philosophy
- **Result<T> Pattern**: All operations return Result<T> with success/failure state
- **Validation Pipeline**: Frontend + Backend validation with consistent messages
- **Global Exception Handling**: Centralized error processing in BaseController
- **User-Friendly Messages**: Translated error codes to meaningful messages

### Security Implementation
- **JWT Authentication**: Token-based with refresh token support
- **Role-Based Authorization**: Admin/User roles with method-level protection
- **Input Validation**: FluentValidation on backend, Reactive Forms on frontend
- **CORS Configuration**: Secure cross-origin request handling

## 📁 Key File Locations

### Backend Architecture
```
src/Core/GenAI.ProjectManagement.Domain/Entities/
├── User.cs                    # User entity with roles
├── Project.cs                 # Project with team assignments
├── Task.cs                    # Task with auto-numbering
├── Organization.cs            # Organization with branches
├── Branch.cs                  # Branch with manager assignment
├── OrganizationPolicy.cs      # Company policies
├── CompanyHoliday.cs          # Holiday management
└── OrganizationSetting.cs     # System configurations

src/Core/GenAI.ProjectManagement.Application/Features/
├── Users/                     # User CQRS operations
├── Projects/                  # Project CQRS operations
├── Tasks/                     # Task CQRS operations
├── Organizations/             # Organization CQRS operations
└── Branches/                  # Branch CQRS operations

src/Infrastructure/GenAI.ProjectManagement.Persistence/
├── Configurations/            # EF Core entity configurations
├── Repositories/              # Repository implementations
└── Migrations/                # Database schema migrations

src/Web/GenAI.ProjectManagement.WebAPI/Controllers/
├── UsersController.cs         # User management API
├── ProjectsController.cs      # Project management API
├── TasksController.cs         # Task management API
├── OrganizationsController.cs # Organization management API
└── BranchesController.cs      # Branch management API
```

### Frontend Architecture
```
project-management-ui/src/app/
├── auth/                      # Authentication components
├── users/                     # User management UI
├── projects/                  # Project management UI
├── tasks/                     # Task management UI
├── organizations/             # Organization management UI
│   ├── interfaces/
│   │   └── organization.interface.ts
│   ├── components/
│   │   ├── organization-form/
│   │   ├── branch-form/
│   │   └── organization-dashboard/
│   └── models/
└── shared/                    # Shared components and services
```

## 🔧 Development Patterns

### Creating New Modules (Step-by-Step)
1. **Domain Layer**: Create entity with proper validation attributes
2. **Entity Configuration**: Create EF Core configuration with relationships
3. **Repository Interface**: Define domain-specific repository methods
4. **Repository Implementation**: Implement with EF Core DbContext
5. **DTOs**: Create request/response DTOs with proper mapping
6. **CQRS Commands**: Create command classes with validation
7. **CQRS Queries**: Create query classes with filtering
8. **Command Handlers**: Implement with Result<T> pattern
9. **Query Handlers**: Implement with repository and mapping
10. **API Controller**: Inherit from BaseController with authorization
11. **Database Migration**: Generate and apply EF Core migration
12. **Frontend Interfaces**: Create TypeScript interfaces
13. **Angular Components**: Create with Material Design and reactive forms
14. **Integration**: Connect components with API services

### BaseController Usage
```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize] // or [Authorize(Roles = "Admin")]
public class ModuleController : BaseController
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateModuleCommand command)
    {
        var result = await Mediator.Send(command);
        return HandleResult(result);
    }
}
```

### Result<T> Pattern
```csharp
// Success case
return Result<ModuleDto>.Success(moduleDto);

// Failure case
return Result<ModuleDto>.Failure("Module not found");

// Repository pattern
var entity = await _repository.GetByIdAsync(id);
if (entity == null)
    return Result<ModuleDto>.Failure("Module not found");
```

### Angular Component Pattern
```typescript
@Component({
  selector: 'app-module-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, ...],
  templateUrl: './module-form.component.html',
  styleUrls: ['./module-form.component.scss']
})
export class ModuleFormComponent implements OnInit {
  form = this.fb.group({
    property: ['', [Validators.required]],
    // ... other form controls
  });
}
```

## � Frontend Service Architecture

### Service Organization
All Angular services are located in `src/app/core/services/` with consistent `.service.ts` naming:

```
core/services/
├── auth.service.ts           # Authentication and authorization
├── error-handler.service.ts  # Global error handling  
├── organization.service.ts   # Organization and branch management
├── project.service.ts        # Project management
├── task.service.ts          # Task management
└── user.service.ts          # User management
```

### Service Import Pattern
```typescript
// Always import from core/services with .service.ts suffix
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { ProjectService } from '../../core/services/project.service';
import { TaskService } from '../../core/services/task.service';
import { OrganizationService } from '../../core/services/organization.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
```

### Service Implementation Pattern
```typescript
@Injectable({
  providedIn: 'root'
})
export class ModuleService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private appConfig: AppConfigService
  ) {}

  private get apiUrl(): string {
    return `${this.appConfig.apiUrl}/modules`;
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.tokenValue;
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Paginated results for lists
  getModules(page: number = 1, pageSize: number = 10, searchTerm?: string): Observable<PaginatedResponse<Module>> {
    let params = new HttpParams()
      .set('pageNumber', page.toString())
      .set('pageSize', pageSize.toString());
    
    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    return this.http.get<ApiResponse<PaginatedResponse<Module>>>(this.apiUrl, { 
      headers: this.getAuthHeaders(),
      params: params
    }).pipe(map(response => response.data));
  }

  // Non-paginated for dropdowns
  getAllModulesForDropdown(): Observable<Module[]> {
    const params = new HttpParams()
      .set('pageNumber', '1')
      .set('pageSize', '1000');
    
    return this.http.get<ApiResponse<PaginatedResponse<Module>>>(this.apiUrl, { 
      headers: this.getAuthHeaders(),
      params: params
    }).pipe(map(response => response.data.data));
  }
}
```

## �🚀 Build & Deployment

### Development Environment
```bash
# Backend - Start Aspire host
cd ProjectManagement.AppHost
dotnet run

# Frontend - Start Angular dev server
cd project-management-ui
npm install
ng serve

# Access application
# Aspire Dashboard: https://localhost:17057
# Angular App: http://localhost:4200
# API: https://localhost:5052
```

### Database Commands
```bash
# Add new migration
dotnet ef migrations add MigrationName -p src/Infrastructure/GenAI.ProjectManagement.Persistence -s src/Web/GenAI.ProjectManagement.WebAPI

# Update database
dotnet ef database update -p src/Infrastructure/GenAI.ProjectManagement.Persistence -s src/Web/GenAI.ProjectManagement.WebAPI
```

## 🧠 AI Context Notes

### When Adding New Features
1. **Always follow existing patterns** - Check similar implementations first
2. **Use BaseController** - Inherit for consistent API responses
3. **Implement Result<T>** - All operations should return Result<T>
4. **Add proper authorization** - Use [Authorize] or [Authorize(Roles = "Admin")]
5. **Create EF configuration** - Explicit configuration for all entities
6. **Generate migration** - Always create migration after domain changes
7. **Use Material Design** - Angular components should use Material Design
8. **Type safety** - Create TypeScript interfaces for all data structures

### Common Gotchas
1. **Property naming** - Frontend uses camelCase, backend uses PascalCase
2. **Entity relationships** - Always configure navigation properties
3. **Authorization** - Organization module requires Admin role
4. **Validation** - Both frontend and backend validation required
5. **Database indexes** - Add indexes for commonly queried fields
6. **Material imports** - Remember to import Material modules in components

### Testing Strategy
1. **Unit tests** - Test business logic in domain/application layers
2. **Integration tests** - Test API endpoints with in-memory database
3. **Component tests** - Test Angular components with TestBed
4. **E2E tests** - Test complete user workflows

## 📚 Documentation Structure

```
docs/
├── Architecture/
│   ├── Project-Architecture-Overview.md    # Complete system overview
│   ├── OrganizationModule-Architecture.md  # Organization detailed docs
│   └── OrganizationModule-Summary.md       # Quick reference
└── FeatureImplementation/
    ├── 01-UserModule.md                     # User module specs
    ├── 02-RoleModule.md                     # Role module specs
    ├── 03-ClaimsModule.md                   # Claims module specs
    ├── 04-ProjectModule.md                  # Project module specs
    ├── 05-TaskModule.md                     # Task module specs
    └── 07-OrganizationModule.md             # Organization module specs
```

## 🎯 Success Metrics

The system demonstrates:
- ✅ **Architectural Consistency**: All modules follow same patterns
- ✅ **Security**: Role-based authorization implemented
- ✅ **Performance**: Strategic database indexing
- ✅ **Maintainability**: Clean separation of concerns
- ✅ **Scalability**: CQRS pattern supports horizontal scaling
- ✅ **User Experience**: Material Design with responsive layouts
- ✅ **Developer Experience**: Strong typing and consistent APIs
- ✅ **Documentation**: Comprehensive technical documentation

**This is a mature, production-ready enterprise application ready for continued development and enhancement!** 🚀
