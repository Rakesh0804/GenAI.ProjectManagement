using Microsoft.EntityFrameworkCore;
using GenAI.ProjectManagement.Domain.Entities;
using GenAI.ProjectManagement.Domain.Interfaces;
using GenAI.ProjectManagement.Persistence.Context;

namespace GenAI.ProjectManagement.Persistence.Repositories;

public class ProjectTaskRepository : GenericRepository<ProjectTask>, IProjectTaskRepository
{
    public ProjectTaskRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<ProjectTask>> GetByProjectIdAsync(Guid projectId, CancellationToken cancellationToken = default)
    {
        return await _context.ProjectTasks
            .Include(t => t.Project)
            .Include(t => t.AssignedToUser)
            .Where(t => t.ProjectId == projectId && t.IsActive)
            .OrderBy(t => t.Title)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<ProjectTask>> GetByAssignedUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.ProjectTasks
            .Include(t => t.Project)
            .Include(t => t.AssignedToUser)
            .Where(t => t.AssignedToUserId == userId && t.IsActive)
            .OrderBy(t => t.DueDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<ProjectTask>> GetByParentTaskIdAsync(Guid parentTaskId, CancellationToken cancellationToken = default)
    {
        return await _context.ProjectTasks
            .Include(t => t.Project)
            .Include(t => t.AssignedToUser)
            .Where(t => t.ParentTaskId == parentTaskId && t.IsActive)
            .OrderBy(t => t.Title)
            .ToListAsync(cancellationToken);
    }

    public async Task<ProjectTask?> GetTaskWithSubTasksAsync(Guid taskId, CancellationToken cancellationToken = default)
    {
        return await _context.ProjectTasks
            .Include(t => t.Project)
            .Include(t => t.AssignedToUser)
            .Include(t => t.SubTasks)
            .FirstOrDefaultAsync(t => t.Id == taskId && t.IsActive, cancellationToken);
    }

    public override async Task<IEnumerable<ProjectTask>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.ProjectTasks
            .Include(t => t.Project)
            .Include(t => t.AssignedToUser)
            .Where(t => t.IsActive)
            .OrderBy(t => t.Title)
            .ToListAsync(cancellationToken);
    }

    public override async Task<ProjectTask?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.ProjectTasks
            .Include(t => t.Project)
            .Include(t => t.AssignedToUser)
            .FirstOrDefaultAsync(t => t.Id == id && t.IsActive, cancellationToken);
    }
}
