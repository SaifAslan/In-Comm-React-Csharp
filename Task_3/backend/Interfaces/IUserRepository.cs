using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Account;
using backend.Dtos.User;
using backend.Models;

namespace backend.Interfaces
{
    public interface IUserRepository
    {
        Task<AppUser> GetUserByIdAsync(string userId);
        Task<AppUser> GetUserByUsernameAsync(string username);
        Task<RegisterResult> CreateUserAsync(UserRegisterDto user);
        Task<bool> UpdateUserAsync(AppUser user);
        Task<bool> DeleteUserAsync(string userId);
        Task<LoginResult> UserLoginAsync(UserLoginDto userLoginDto); 
        Task<(List<AppUser> Users, int TotalCount)> GetUsersAsync(string role, int pageNumber, int pageSize);

    }
}