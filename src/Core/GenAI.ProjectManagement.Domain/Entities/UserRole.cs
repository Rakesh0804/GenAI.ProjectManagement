using GenAI.ProjectManagement.Domain.Common;

namespace GenAI.ProjectManagement.Domain.Entities;

public class UserRole : BaseEntity
{
    public Guid UserId { get; set; }
    public Guid RoleId { get; set; }
    
    // Navigation Properties
    public User User { get; set; } = null!;
    public Role Role { get; set; } = null!;
}
