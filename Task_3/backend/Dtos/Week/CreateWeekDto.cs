using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Dtos.Week
{
    public class CreateWeekDto
    {
        [Required]
        public string Title { get; set; } // Title of the week
        [Required]
        public string Description { get; set; }
    }
}