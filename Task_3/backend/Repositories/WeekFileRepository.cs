using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Interfaces;
using backend.Models;
using Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class WeekFileRepository : IWeekFileRepository
    {
        private readonly ApplicationDbContext _context;
        public WeekFileRepository(ApplicationDbContext context)

        {
            _context = context; // Initialize ApplicationDbContext

        }

        public async Task<WeekFile> CreateWeekFileAsync(int weekId, WeekFile file)
        {
            file.WeekId = weekId; // Set the week ID
            var result = await _context.Files.AddAsync(file); // Add the file to the DbSet
            await _context.SaveChangesAsync(); // Save changes to the database
            return result.Entity; // Return the created file       
        }

        public async Task<bool> DeleteWeekFileAsync(int fileId)
        {
            var file = await _context.Files.FindAsync(fileId); // Find the file by ID
            if (file == null) return false; // Return false if the file does not exist

            _context.Files.Remove(file); // Remove the file entity
            return await _context.SaveChangesAsync() > 0; // Save changes and return success status
        }

        public async Task<WeekFile?> GetWeekFileByIdAsync(int fileId)
        {
            return await _context.Files.FindAsync(fileId); // Find the file by ID
        }

        public async Task<List<WeekFile>> GetWeekFilesByWeekIdAsync(int weekId)
        {
            return await _context.Files.Where(f => f.WeekId == weekId).ToListAsync(); // Get files for the specific week
        }
    }
}