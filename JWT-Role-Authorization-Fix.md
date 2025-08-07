# JWT Role Authorization Fix Summary

## Issue Analysis
The 403 Forbidden error occurred because:

1. **OrganizationsController requires Admin role**: `[Authorize(Roles = "Admin")]`
2. **JWT tokens didn't include role claims**: Only had userId, userName, email
3. **Current user lacks Admin role**: Even if roles were included, current user might not be Admin

## Root Cause
The JWT token generation was missing role claims, making role-based authorization impossible.

## Solution Applied

### 1. Updated JWT Token Service Interface
**File**: `GenAI.ProjectManagement.Domain/Interfaces/Services/ISecurityServices.cs`
```csharp
// Before
string GenerateToken(string userId, string email, string userName);

// After
string GenerateToken(string userId, string email, string userName, IEnumerable<string> roles);
```

### 2. Enhanced JWT Token Generation
**File**: `GenAI.ProjectManagement.Infrastructure/Services/JwtTokenService.cs`
```csharp
// Added role claims to JWT token
var claims = new List<Claim>
{
    new Claim(ClaimTypes.NameIdentifier, userId),
    new Claim(ClaimTypes.Name, userName),
    new Claim(ClaimTypes.Email, email)
};

// Add role claims - THIS WAS MISSING
foreach (var role in roles)
{
    claims.Add(new Claim(ClaimTypes.Role, role));
}
```

### 3. Updated User Repository to Include Roles
**File**: `GenAI.ProjectManagement.Persistence/Repositories/UserRepository.cs`
```csharp
// Enhanced to include UserRoles navigation property
public async Task<User?> GetByUserNameAsync(string userName, CancellationToken cancellationToken = default)
{
    return await _dbSet
        .Include(x => x.Manager)
        .Include(x => x.UserRoles)        // Added this
            .ThenInclude(ur => ur.Role)   // Added this
        .FirstOrDefaultAsync(x => x.UserName == userName, cancellationToken);
}
```

### 4. Updated Login Handler to Pass Roles
**File**: `GenAI.ProjectManagement.Application/Features/Users/Handlers/UserCommandHandlers.cs`
```csharp
// Extract user roles and pass to JWT generation
var roleNames = user.UserRoles.Select(ur => ur.Role.Name).ToList();
var token = _jwtTokenService.GenerateToken(user.Id.ToString(), user.Email, user.UserName, roleNames);
```

## Solution Options

### Option 1: Login as Admin User ⭐ **RECOMMENDED**
Use the admin credentials that were seeded:
- **Username**: `admin`
- **Password**: `Admin123!`
- **Role**: `Admin`

### Option 2: Modify Controller Authorization (Alternative)
Change the OrganizationsController authorization to allow more roles:
```csharp
// Instead of: [Authorize(Roles = "Admin")]
[Authorize(Roles = "Admin,ProjectManager")]
// Or: [Authorize] // Allow any authenticated user
```

## Testing Steps

### 1. Restart API Server
The backend needs to be restarted to pick up the JWT token changes:
```bash
# Stop current API server process
# Restart using: dotnet run or run-aspire-apphost task
```

### 2. Login with Admin User
In the frontend, login with:
- **Username**: `admin`
- **Password**: `Admin123!`

### 3. Verify JWT Token Contains Roles
Check browser developer tools → Network tab → Look for login response:
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": { ... }
}
```

Decode the JWT token at jwt.io to verify it contains role claims:
```json
{
  "nameid": "user-id",
  "unique_name": "admin", 
  "email": "admin@projectmanagement.com",
  "role": "Admin",          // ← This should now be present
  "exp": 1234567890
}
```

### 4. Test Organization Access
Try accessing the organization dashboard again. The 403 error should be resolved.

## Alternative Quick Fix
If you want to test immediately without restarting the server, temporarily modify the OrganizationsController:
```csharp
// Comment out the role requirement temporarily
// [Authorize(Roles = "Admin")]
[Authorize] // Allow any authenticated user
public class OrganizationsController : BaseController
```

## Current Status
- ✅ **JWT Token Service**: Updated to include role claims
- ✅ **User Repository**: Enhanced to load user roles 
- ✅ **Login Handler**: Modified to pass roles to JWT generation
- ⏳ **Server Restart**: Required to apply changes
- ⏳ **Testing**: Needs login with admin user

**Next Action**: Restart the API server and login with admin credentials to test the fix!
