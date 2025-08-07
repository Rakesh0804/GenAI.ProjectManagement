using System.ComponentModel.DataAnnotations;
using GenAI.ProjectManagement.Domain.Common;

namespace GenAI.ProjectManagement.Domain.Entities;

public class Counter : BaseEntity
{
    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    public int CurrentValue { get; set; } = 0;
    
    [MaxLength(200)]
    public string? Description { get; set; }
}
