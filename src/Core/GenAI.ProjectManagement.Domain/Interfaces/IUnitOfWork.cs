namespace GenAI.ProjectManagement.Domain.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IUserRepository Users { get; }
    IRoleRepository Roles { get; }
    IClaimRepository Claims { get; }
    IUserRoleRepository UserRoles { get; }
    IUserClaimRepository UserClaims { get; }
    IProjectRepository Projects { get; }
    IUserProjectRepository UserProjects { get; }
    IProjectTaskRepository ProjectTasks { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task BeginTransactionAsync(CancellationToken cancellationToken = default);
    Task CommitTransactionAsync(CancellationToken cancellationToken = default);
    Task RollbackTransactionAsync(CancellationToken cancellationToken = default);
}
