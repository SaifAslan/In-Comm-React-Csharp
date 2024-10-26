using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Enrollment
{
    public class UnenrollRequestDto
    {  
        public string StudentId { get; set; }
        public int CourseId { get; set; }
    }
}