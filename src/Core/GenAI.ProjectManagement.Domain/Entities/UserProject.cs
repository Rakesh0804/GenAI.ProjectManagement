using GenAI.ProjectManagement.Domain.Common;
using GenAI.ProjectManagement.Domain.Enums;

namespace GenAI.ProjectManagement.Domain.Entities;

public class UserProject : BaseEntity
{
    public Guid UserId { get; set; }
    public Guid ProjectId { get; set; }
    public ProjectRole Role { get; set; } = ProjectRole.TeamMember;
    public DateTime AssignedDate { get; set; } = DateTime.UtcNow;
    public DateTime? UnassignedDate { get; set; }
    public bool IsActive { get; set; } = true;
    
    // Navigation Properties
    public User User { get; set; } = null!;
    public Project Project { get; set; } = null!;
}
