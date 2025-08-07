using Microsoft.Extensions.DependencyInjection;
using GenAI.ProjectManagement.Infrastructure.Services;
using GenAI.ProjectManagement.Domain.Interfaces.Services;

namespace GenAI.ProjectManagement.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
    {
        // Add services
        services.AddScoped<Domain.Interfaces.Services.IJwtTokenService, JwtTokenService>();
        services.AddScoped<Domain.Interfaces.Services.IPasswordHashingService, PasswordHashingService>();

        return services;
    }
}
