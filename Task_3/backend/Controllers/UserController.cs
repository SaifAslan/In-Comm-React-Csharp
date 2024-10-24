using backend.Dtos.User; 
using backend.Interfaces;
using backend.Mappers; 
using backend.Models; 
using Microsoft.AspNetCore.Authorization; 
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc; 

namespace backend.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository; // Repository for user operations
        private readonly SignInManager<AppUser> _signInManager; // Sign-in manager for handling user sign-in, logout, and user lockout
        private readonly ITokenService _tokenService; // Service for creating JWT tokens
        private readonly UserManager<AppUser> _userManager; // User manager for managing users

        // Constructor for AppUserController
        public UserController(IUserRepository userRepository, SignInManager<AppUser> signInManager, ITokenService tokenService, UserManager<AppUser> userManager)
        {
            _userRepository = userRepository;
            _signInManager = signInManager; 
            _tokenService = tokenService;
            _userManager = userManager; 
        }

        // Endpoint for user registration
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto userRegisterDto)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState); // Return bad request if model state is invalid

                var registerResult = await _userRepository.CreateUserAsync(userRegisterDto); // Attempt to create user
                if (registerResult.IsSuccess)
                {
                    var roles = await _userManager.GetRolesAsync(registerResult.User); // Get roles for the registered user
                    string token = _tokenService.CreateToken(registerResult.User); // Create JWT token for the user
                    return Ok(registerResult.User.ToLoginResultDto(token, roles)); // Return success response with user info and token
                }
                return StatusCode(registerResult.StatusCode, registerResult.Errors); // Return status code and errors if registration failed
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message); // Return server error message in case of exceptions
            }
        }

        // Endpoint for user login
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDto userLoginDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState); // Return bad request if model state is invalid

            var loginResult = await _userRepository.UserLoginAsync(userLoginDto); // Attempt to login user

            if (loginResult.IsSuccess)
            {
                var roles = await _userManager.GetRolesAsync(loginResult.User); // Get roles for the logged-in user
                string token = _tokenService.CreateToken(loginResult.User); // Create JWT token for the user
                return Ok(loginResult.User.ToLoginResultDto(token, roles)); // Return success response with user info and token
            }

            if (loginResult.StatusCode == 401) return Unauthorized(loginResult.ErrorMessage); // Return unauthorized if credentials are invalid
            return NotFound(loginResult.ErrorMessage); // Return not found if user not found
        }

        // Endpoint for user logout
        [HttpPost("logout")]
        [Authorize] // Require authorization for this endpoint
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync(); // Sign out the user
            return Ok(); // Return success response
        }
    }
}
