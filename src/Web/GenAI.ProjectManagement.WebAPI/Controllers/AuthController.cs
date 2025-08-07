using Microsoft.AspNetCore.Mvc;
using MediatR;
using GenAI.ProjectManagement.Application.Features.Users.Commands;
using GenAI.ProjectManagement.Application.DTOs.User;
using GenAI.ProjectManagement.WebAPI.Controllers.Base;

namespace GenAI.ProjectManagement.WebAPI.Controllers;

public class AuthController : BaseController
{
    public AuthController(IMediator mediator) : base(mediator)
    {
    }

    /// <summary>
    /// User login
    /// </summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserLoginDto loginDto)
    {
        var command = new LoginUserCommand { LoginDto = loginDto };
        var result = await _mediator.Send(command);
        return HandleResult(result);
    }

    /// <summary>
    /// User logout (client-side token removal)
    /// </summary>
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        // JWT is stateless, so logout is handled on the client side
        // by removing the token from storage
        return Ok(new
        {
            success = true,
            message = "Logged out successfully"
        });
    }

    /// <summary>
    /// Validate token (optional endpoint for token verification)
    /// </summary>
    [HttpPost("validate-token")]
    public IActionResult ValidateToken([FromBody] string token)
    {
        // This could be implemented to validate tokens if needed
        // For now, it's a placeholder
        return Ok(new
        {
            success = true,
            message = "Token validation endpoint"
        });
    }
}
