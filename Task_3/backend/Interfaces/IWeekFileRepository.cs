using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Interfaces
{
    public interface IWeekFileRepository
    {
        Task<WeekFile> CreateWeekFileAsync(int weekId, WeekFile file); // Create a file for a week
        Task<bool> DeleteWeekFileAsync(int fileId); // Delete a file by ID
        Task<List<WeekFile>> GetWeekFilesByWeekIdAsync(int weekId); // Get files for a specific week
        Task<WeekFile?> GetWeekFileByIdAsync(int fileId); // Get a file by ID
    }
}