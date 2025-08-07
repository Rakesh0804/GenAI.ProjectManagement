using System.ComponentModel.DataAnnotations;
using GenAI.ProjectManagement.Domain.Common;
using GenAI.ProjectManagement.Domain.Enums;

namespace GenAI.ProjectManagement.Domain.Entities;

public class Project : BaseEntity
{
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string? Description { get; set; }
    
    [Required]
    public DateTime StartDate { get; set; }
    
    public DateTime? EndDate { get; set; }
    
    public ProjectStatus Status { get; set; } = ProjectStatus.Planning;
    
    public ProjectPriority Priority { get; set; } = ProjectPriority.Medium;
    
    public decimal? Budget { get; set; }
    
    [MaxLength(100)]
    public string? ClientName { get; set; }
    
    public bool IsActive { get; set; } = true;
    
    // Navigation Properties
    public ICollection<UserProject> UserProjects { get; set; } = new List<UserProject>();
    public ICollection<ProjectTask> Tasks { get; set; } = new List<ProjectTask>();
}
