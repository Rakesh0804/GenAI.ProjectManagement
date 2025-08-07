using MediatR;
using System.Text.Json.Serialization;
using GenAI.ProjectManagement.Application.DTOs.User;
using GenAI.ProjectManagement.Application.Common.Models;

namespace GenAI.ProjectManagement.Application.Features.Users.Queries;

public class GetUserByIdQuery : IRequest<Result<UserDto>>
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
}

public class GetAllUsersQuery : IRequest<Result<PaginatedResult<UserDto>>>
{
    [JsonPropertyName("pagedQuery")]
    public PagedQuery PagedQuery { get; set; } = new();
}

public class GetUsersByManagerIdQuery : IRequest<Result<IEnumerable<UserDto>>>
{
    [JsonPropertyName("managerId")]
    public Guid ManagerId { get; set; }
}
