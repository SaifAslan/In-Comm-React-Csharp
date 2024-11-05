using backend.Dtos.Week;
using backend.Interfaces;
using backend.Models;
using Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class WeekRepository : IWeekRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly ICourseRepository _courseRepository;
        public WeekRepository(ApplicationDbContext context, ICourseRepository courseRepository)
        {
            _context = context;
            _courseRepository = courseRepository;
        }
        public async Task<Week> createWeekAsync(CreateWeekDto creatWeekDto, int courseId)
        {
            // Check if the course exists
            if (!await _courseRepository.CourseExistsAsync(courseId))
            {
                throw new ArgumentException("Course not found."); // Throw an exception if the course does not exist
            }

            var week = new Week
            {
                CourseId = courseId,
                Title = creatWeekDto.Title,
                Description = creatWeekDto.Description,
            };
            var result = await _context.Weeks.AddAsync(week);
            await _context.SaveChangesAsync();
            return result.Entity; // Return the created week
        }

        public async Task<bool> deleteWeek(int weekId)
        {
            var week = await _context.Weeks.FindAsync(weekId); // Find the week by ID
            if (week == null) return false; // Return false if the week does not exist

            _context.Weeks.Remove(week); // Remove the week entity
            return await _context.SaveChangesAsync() > 0; // Save changes and return success status        
        }

        public async Task<List<Week>> getCourseWeeksAsync(int courseId)
        {
            // Check if the course exists
            if (!await _courseRepository.CourseExistsAsync(courseId))
            {
                throw new ArgumentException("Course not found."); // Throw an exception if the course does not exist
            }

            return await _context.Weeks.Where(w => w.CourseId == courseId).ToListAsync(); // Get weeks for the specific course     
        }

        public async Task<bool> BulkDeleteWeeks(List<int> weekIds)
        {
            var weeksToDelete = await _context.Weeks
                .Where(w => weekIds.Contains(w.Id))
                .ToListAsync();

            if (weeksToDelete.Count == 0) return false;

            _context.Weeks.RemoveRange(weeksToDelete);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Week> UpdateWeekAsync(int weekId, UpdateWeekDto updateWeekDto)
        {
            var week = await _context.Weeks.FindAsync(weekId);

            if (week == null) return null;

            week.Title = updateWeekDto.Title ?? week.Title;
            week.Description = updateWeekDto.Description ?? week.Description;
            week.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();
            return week;
        }
    }
}