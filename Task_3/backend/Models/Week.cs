using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Week
    {
        public int Id { get; set; } // Unique identifier for the week
        public int CourseId { get; set; } // Foreign key to the Course
        public Course Course { get; set; } // Navigation property to Course
        public string Title { get; set; } // Title of the week
        public string Description { get; set; }
        public DateTime CreatedAt { get; } = DateTime.Now.Date; // Date the week was created
        public DateTime UpdatedAt { get; set; } // Date the week was last updated
        public ICollection<File> Files { get; set; } // Navigation property for files in the week

    }
}