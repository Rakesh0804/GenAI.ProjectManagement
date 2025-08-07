using System.ComponentModel.DataAnnotations;
using GenAI.ProjectManagement.Domain.Common;

namespace GenAI.ProjectManagement.Domain.Entities;

public class CompanyHoliday : BaseEntity
{
    [Required]
    public Guid OrganizationId { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string? Description { get; set; }
    
    [Required]
    public DateOnly Date { get; set; }
    
    public bool IsRecurring { get; set; } = false;
    
    [Required]
    [MaxLength(50)]
    public string HolidayType { get; set; } = "Company"; // National, Regional, Company
    
    public string? ApplicableBranches { get; set; } // JSON array of branch IDs
    
    public bool IsActive { get; set; } = true;
    
    // Navigation Properties
    public Organization Organization { get; set; } = null!;
}
