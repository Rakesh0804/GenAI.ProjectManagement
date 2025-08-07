using GenAI.ProjectManagement.Domain.Common;

namespace GenAI.ProjectManagement.Domain.Entities;

public class UserClaim : BaseEntity
{
    public Guid UserId { get; set; }
    public Guid ClaimId { get; set; }
    public string? ClaimValue { get; set; }
    
    // Navigation Properties
    public User User { get; set; } = null!;
    public Claim Claim { get; set; } = null!;
}
