# .NET Aspire AppHost Configuration

## Overview
This project now includes a .NET Aspire AppHost that orchestrates the entire application stack:
- PostgreSQL Database
- .NET Core API
- Angular Frontend

## VS Code Launch Configurations

### Available Launch Options:

1. **Launch Aspire AppHost** - Full orchestration with Aspire Dashboard
2. **Launch API Only** - Just the .NET Core API
3. **Launch Angular Frontend Only** - Just the Angular application
4. **Launch Full Stack (API + Frontend)** - Both API and Frontend without Aspire

## How to Use

### Method 1: Using Aspire AppHost (Recommended)
1. Open VS Code in the project root
2. Press `F5` or go to Run and Debug
3. Select "Launch Aspire AppHost"
4. This will start:
   - PostgreSQL container
   - .NET Core API on port 5052
   - Angular frontend on port 4200
   - Aspire Dashboard on port 15888

### Method 2: Individual Services
1. Select "Launch API Only" to start just the API
2. Select "Launch Angular Frontend Only" to start just the frontend
3. Select "Launch Full Stack" to start both without Aspire

## Aspire Dashboard
When using the AppHost, the Aspire Dashboard will be available at:
**http://localhost:15888**

The dashboard provides:
- Service status and health checks
- Logs from all services
- Metrics and performance data
- Distributed tracing
- Configuration management

## Services and Ports

| Service | Port | URL |
|---------|------|-----|
| Angular Frontend | 4200 | http://localhost:4200 |
| .NET Core API | 5052 | http://localhost:5052 |
| PostgreSQL | 5432 | localhost:5432 |
| Aspire Dashboard | 15888 | http://localhost:15888 |
| pgAdmin (optional) | Auto-assigned | Check Aspire Dashboard |

## Demo Credentials
- **Admin**: admin / Admin123!
- **Project Manager**: jmanager / Manager123!
- **Developer**: jdeveloper / Dev123!
- **Tester**: btester / Test123!

## Tasks Available

Use `Ctrl+Shift+P` and type "Tasks: Run Task" to access:
- `build-apphost` - Build the Aspire AppHost
- `build-api` - Build the API project
- `run-aspire-apphost` - Run Aspire AppHost in terminal
- `stop-aspire` - Stop all Aspire services
- `clean-build-all` - Clean and rebuild entire solution

## Benefits of Using Aspire

1. **Service Discovery**: Services automatically discover each other
2. **Unified Logging**: All logs in one dashboard
3. **Health Monitoring**: Real-time health checks
4. **Configuration Management**: Centralized configuration
5. **Local Development**: Mimics production-like environment
6. **Debugging**: Distributed tracing and debugging support

## Troubleshooting

If services don't start:
1. Ensure Docker Desktop is running
2. Check that ports 4200, 5052, 5432, and 15888 are available
3. Run `dotnet workload update` to update Aspire workloads
4. Use the "stop-aspire" task to clean up any stuck processes

## Next Steps

1. Press F5 and select "Launch Aspire AppHost"
2. Wait for all services to start (check Aspire Dashboard)
3. Navigate to http://localhost:4200 to test the application
4. Use http://localhost:15888 to monitor all services
