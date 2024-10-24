using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class WeekFile
    {
        public int Id { get; set; } // Unique identifier for the file
        public int WeekId { get; set; } // Foreign key to the Week
        public Week Week { get; set; } // Navigation property to Week
        public string FileName { get; set; } // Name of the file
        public string Url { get; set; } // URL of the uploaded file
        public DateTime UploadedAt { get; } = DateTime.Now.Date; // Date the file was uploaded
    }
}