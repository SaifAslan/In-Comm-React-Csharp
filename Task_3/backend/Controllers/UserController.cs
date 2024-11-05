using System.Security.Claims;
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


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto userLoginDto)
        {
            var loginResult = await _userRepository.UserLoginAsync(userLoginDto);
            if (!loginResult.IsSuccess)
            {
                return StatusCode(loginResult.StatusCode, loginResult.ErrorMessage);
            }

            var user = loginResult.User;
            var roles = await _userManager.GetRolesAsync(user);
            string token = _tokenService.CreateToken(user);
            return Ok(user.ToLoginResultDto(token, roles));
        }

        [HttpGet("users")]
        [Authorize(Roles = "Admin, Instructor")] // Assuming only admins can access this endpoint
        public async Task<IActionResult> GetUsers([FromQuery] string role, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var (users, totalCount) = await _userRepository.GetUsersAsync(role, pageNumber, pageSize);
            var userDtos = users.Select(user => new NewUserDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                DateOfBirth = user.DateOfBirth,
                UpdatedAt = user.UpdatedAt
            }).ToList();

            return Ok(new { Users = userDtos, TotalCount = totalCount });
        }

        // Endpoint for getting user profile (accessible to Student, Instructor, Admin)
        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get current user ID from claims
            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null) return NotFound("User not found." + userId);

            var roles = await _userManager.GetRolesAsync(user);
            return Ok(user.ToLoginResultDto("", roles)); // Return user profile (without token)
        }

        // Endpoint for updating user profile (accessible to Student, Instructor, Admin)
        [HttpPut("profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] UserUpdateDto userUpdateDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null) return NotFound("User not found.");

            // Update user properties
            user.FirstName = userUpdateDto.FirstName ?? user.FirstName;
            user.LastName = userUpdateDto.LastName ?? user.LastName;
            user.DateOfBirth = userUpdateDto.DateOfBirth != default ? userUpdateDto.DateOfBirth : user.DateOfBirth;

            var success = await _userRepository.UpdateUserAsync(user);
            if (!success) return StatusCode(500, "Failed to update profile.");

            return Ok("Profile updated successfully.");
        }

        // Endpoint for changing user password (accessible to Student, Instructor, Admin)
        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null) return NotFound("User not found.");

            var result = await _userManager.ChangePasswordAsync(user, changePasswordDto.CurrentPassword, changePasswordDto.NewPassword);
            if (!result.Succeeded) return BadRequest(result.Errors);

            return Ok("Password changed successfully.");
        }

        // Endpoint for deleting a user (accessible only to Admin)
        [HttpDelete("{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            var success = await _userRepository.DeleteUserAsync(userId);
            if (!success) return NotFound("User not found.");

            return Ok("User deleted successfully.");
        }

    }
}
