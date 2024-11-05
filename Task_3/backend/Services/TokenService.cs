using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace backend.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _configuration; // Configuration to access app settings
        private readonly SymmetricSecurityKey _symmetricSecurityKey; // Security key for signing tokens

        private readonly UserManager<AppUser> _userManager; // User manager for managing user roles

        public TokenService(IConfiguration configuration, UserManager<AppUser> userManager)
        {
            _configuration = configuration; // Initialize configuration
            _symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:SigningKey"])); // Create security key from signing key
            _userManager = userManager; // Initialize user manager
        }

        // Method to create a JWT token for a user
        public string CreateToken(AppUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Email, user.Email), // Add email claim
                new Claim(JwtRegisteredClaimNames.GivenName, user.FirstName), // Add first name claim
                new Claim(ClaimTypes.NameIdentifier, user.Id) // Add user ID claim using NameIdentifier

            };
            // Add role claims
            var roles = _userManager.GetRolesAsync(user).Result; // Get the user's roles
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role)); // Add each role as a claim
            }

            var creds = new SigningCredentials(_symmetricSecurityKey, SecurityAlgorithms.HmacSha512Signature); // Create signing credentials

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims), // Set the claims identity
                Expires = DateTime.Now.AddDays(1), // Set token expiration to 1 day
                SigningCredentials = creds, // Set signing credentials
                Issuer = _configuration["JWT:Issuer"], // Set token issuer
                Audience = _configuration["JWT:Audience"] // Set token audience
            };

            var tokenHandler = new JwtSecurityTokenHandler(); // Create a token handler
            var token = tokenHandler.CreateToken(tokenDescriptor); // Create the token
            return tokenHandler.WriteToken(token); // Return the serialized token
        }
    }
}
