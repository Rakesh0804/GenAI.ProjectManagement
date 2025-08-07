using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using GenAI.ProjectManagement.Domain.Interfaces;
using GenAI.ProjectManagement.Domain.Interfaces.Services;
using GenAI.ProjectManagement.Persistence.Context;
using GenAI.ProjectManagement.Persistence.UnitOfWork;
using GenAI.ProjectManagement.Persistence.Repositories;
using GenAI.ProjectManagement.Persistence.Services;

namespace GenAI.ProjectManagement.Persistence.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddPersistenceServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Add DbContext
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        // Add repositories and unit of work
        services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IRoleRepository, RoleRepository>();
        services.AddScoped<IClaimRepository, ClaimRepository>();
        services.AddScoped<IUserRoleRepository, UserRoleRepository>();
        services.AddScoped<IUserClaimRepository, UserClaimRepository>();
        services.AddScoped<IProjectRepository, ProjectRepository>();
        services.AddScoped<IUserProjectRepository, UserProjectRepository>();
        services.AddScoped<IProjectTaskRepository, ProjectTaskRepository>();
        services.AddScoped<IOrganizationRepository, OrganizationRepository>();
        services.AddScoped<IBranchRepository, BranchRepository>();
        services.AddScoped<IOrganizationPolicyRepository, OrganizationPolicyRepository>();
        services.AddScoped<ICompanyHolidayRepository, CompanyHolidayRepository>();
        services.AddScoped<IOrganizationSettingRepository, OrganizationSettingRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork.UnitOfWork>();

        // Add services
        services.AddScoped<ICounterService, CounterService>();

        return services;
    }
}
