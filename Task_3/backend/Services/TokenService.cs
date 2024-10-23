using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Interfaces;
using backend.Models;
using Microsoft.IdentityModel.Tokens;

namespace backend.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _configuration; // Configuration to access app settings
        private readonly SymmetricSecurityKey _symmetricSecurityKey; // Security key for signing tokens

        public TokenService(IConfiguration configuration)
        {
            _configuration = configuration; // Initialize configuration
            _symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:SigningKey"])); // Create security key from signing key
        }

        // Method to create a JWT token for a user
        public string CreateToken(AppUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Email, user.Email), // Add email claim
                new Claim(JwtRegisteredClaimNames.GivenName, user.FirstName) // Add first name claim
            };

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
