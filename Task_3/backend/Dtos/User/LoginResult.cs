using backend.Models;

namespace backend.Dtos.User
{
    public class LoginResult
    {
        public AppUser User { get; set; }
        public string ErrorMessage { get; set; }
        public int StatusCode { get; set; }
        public bool IsSuccess => User != null;

        public static LoginResult Success(AppUser user)
        {
            return new LoginResult { User = user, StatusCode = 200 };
        }
        public static LoginResult Failure(string errorMessage, int statusCode)
        {
            return new LoginResult { ErrorMessage = errorMessage, StatusCode = statusCode };
        }
    }
}