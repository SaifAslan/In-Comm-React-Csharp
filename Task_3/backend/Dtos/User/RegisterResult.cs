using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.User;
using backend.Models;
using Microsoft.AspNetCore.Identity;

namespace backend.Dtos.Account
{
    public class RegisterResult
    {
        public AppUser User { get; set; }
        public bool IsSuccess => User != null;
        public IEnumerable<IdentityError> Errors  { get; set; }
        public int StatusCode { get; set; }

        public static RegisterResult Success(AppUser user)
        {
            return new RegisterResult { User = user, StatusCode = 201 };
        }
        public static RegisterResult Failure(IEnumerable<IdentityError> errors, int statusCode)
        {
            return new RegisterResult { Errors = errors, StatusCode = statusCode };
        }

    }
}