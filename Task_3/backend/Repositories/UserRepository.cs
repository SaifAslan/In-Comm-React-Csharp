using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Account;
using backend.Dtos.User;
using backend.Interfaces;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Identity;

namespace backend.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly UserManager<AppUser> _userManager; // User manager for user-related operations
        private readonly SignInManager<AppUser> _signInManager; // Sign-in manager for handling user authentication
        private readonly ITokenService _tokenService; // Service for generating tokens

        // Constructor for UserRepository
        public UserRepository(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, ITokenService tokenService)
        {
            _userManager = userManager; // Initialize user manager
            _signInManager = signInManager; // Initialize sign-in manager
            _tokenService = tokenService; // Initialize token service
        }

        // Method to get user by ID
        public async Task<AppUser> GetUserByIdAsync(string userId)
        {
            return await _userManager.FindByIdAsync(userId); // Retrieve user by ID
        }

        // Method to get user by username
        public async Task<AppUser> GetUserByUsernameAsync(string username)
        {
            return await _userManager.FindByNameAsync(username); // Retrieve user by username
        }

        // Method to create a new user
        public async Task<RegisterResult> CreateUserAsync(UserRegisterDto user)
        {
            var appUser = new AppUser // Create a new AppUser instance
            {
                Email = user.Email,
                DateOfBirth = user.DateOfBirth,
                UpdatedAt = DateTime.Now.Date,
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                UserName = user.Email,
            };

            var createdUser = await _userManager.CreateAsync(appUser, user.Password); // Attempt to create user
            if (createdUser.Succeeded)
            {
                var roleResult = await _userManager.AddToRoleAsync(appUser, user.Role); // Assign role to user
                if (roleResult.Succeeded)
                {
                    return RegisterResult.Success(appUser); // Return success result
                }
                else
                {
                    return RegisterResult.Failure(roleResult.Errors, 500); // Return failure if role assignment failed
                }
            }
            else
            {
                return RegisterResult.Failure(createdUser.Errors, 500); // Return failure if user creation failed
            }
        }

        // Method to update an existing user
        public async Task<bool> UpdateUserAsync(AppUser user)
        {
            var result = await _userManager.UpdateAsync(user); // Attempt to update user
            return result.Succeeded; // Return success status
        }

        // Method to delete a user by ID
        public async Task<bool> DeleteUserAsync(string userId)
        {
            var user = await GetUserByIdAsync(userId); // Retrieve user by ID
            if (user != null)
            {
                var result = await _userManager.DeleteAsync(user); // Attempt to delete user
                return result.Succeeded; // Return success status
            }
            return false; // Return false if user not found
        }

        // Method for user login
        public async Task<LoginResult> UserLoginAsync(UserLoginDto userLoginDto)
        {
            var user = await _userManager.FindByEmailAsync(userLoginDto.Email); // Retrieve user by email
            if (user == null) return LoginResult.Failure("Email not found!", 404); // Return failure if email not found

            var result = await _signInManager.CheckPasswordSignInAsync(user, userLoginDto.Password, false); // Check user credentials
            if (!result.Succeeded) return LoginResult.Failure("Invalid credentials!", 401); // Return failure if credentials are invalid

            return LoginResult.Success(user); // Return success with user info
        }
    }
}
