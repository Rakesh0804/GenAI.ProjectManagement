using MediatR;
using System.Text.Json.Serialization;
using GenAI.ProjectManagement.Application.DTOs.Claim;
using GenAI.ProjectManagement.Application.Common.Models;

namespace GenAI.ProjectManagement.Application.Features.Claims.Commands;

public class CreateClaimCommand : IRequest<Result<ClaimDto>>
{
    [JsonPropertyName("createClaimDto")]
    public CreateClaimDto CreateClaimDto { get; set; } = null!;
}

public class UpdateClaimCommand : IRequest<Result<ClaimDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
    
    [JsonPropertyName("updateClaimDto")]
    public UpdateClaimDto UpdateClaimDto { get; set; } = null!;
}

public class DeleteClaimCommand : IRequest<Result>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
}
