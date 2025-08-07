using MediatR;
using System.Text.Json.Serialization;
using GenAI.ProjectManagement.Application.DTOs.Project;
using GenAI.ProjectManagement.Application.Common.Models;

namespace GenAI.ProjectManagement.Application.Features.Projects.Commands;

public class CreateProjectCommand : IRequest<Result<ProjectDto>>
{
    [JsonPropertyName("createProjectDto")]
    public CreateProjectDto CreateProjectDto { get; set; } = null!;
}

public class UpdateProjectCommand : IRequest<Result<ProjectDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
    
    [JsonPropertyName("updateProjectDto")]
    public UpdateProjectDto UpdateProjectDto { get; set; } = null!;
}

public class DeleteProjectCommand : IRequest<Result<bool>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
}
