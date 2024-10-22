using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace backend.Models
{
    public class AppUser : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public DateTime CreatedAt { get; } = DateTime.Now.Date;
        public DateTime UpdatedAt { get; set; }
        public int RoleId { get; set; } // Foreign key to Role
        public Role Role { get; set; } // Navigation property   
    }
}