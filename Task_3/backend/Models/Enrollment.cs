using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Enrollment
    {
        public int Id { get; set; }
        public string StudentId { get; set; } // Foreign key to ApplicationUser
        public int CourseId { get; set; } // Foreign key to Course
        public DateTime CreatedAt { get; } = DateTime.Now.Date;
        public DateTime UpdatedAt { get; set; }
        public AppUser Student { get; set; } // Navigation property
        public Course Course { get; set; } // Navigation property
    }

}