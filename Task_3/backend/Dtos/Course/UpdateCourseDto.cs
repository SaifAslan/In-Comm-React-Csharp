using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Course
{
    public class UpdateCourseDto
    {
        [Required]
        public string Title { get; set; }
        [Required]
        public string Description { get; set; }
    }
}