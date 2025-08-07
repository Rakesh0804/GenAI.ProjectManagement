using System.ComponentModel.DataAnnotations;
using GenAI.ProjectManagement.Domain.Common;

namespace GenAI.ProjectManagement.Domain.Entities;

public class Role : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string? Description { get; set; }
    
    public bool IsActive { get; set; } = true;
    
    // Navigation Properties
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}
