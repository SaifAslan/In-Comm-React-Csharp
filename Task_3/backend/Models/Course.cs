using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Course
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string InstructorId { get; set; } // Foreign key to ApplicationUser
        public AppUser Instructor { get; set; } // Navigation property
        public DateTime CreatedAt { get; } = DateTime.Now.Date;
        public DateTime UpdatedAt { get; set; }

        public ICollection<Enrollment> Enrollments { get; set; } // Navigation property for students enrolled  
    }
}