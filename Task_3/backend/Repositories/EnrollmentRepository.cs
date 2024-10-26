using backend.Interfaces;
using backend.Models;
using Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class EnrollmentRepository : IEnrollmentRepository
    {
        private readonly ApplicationDbContext _context;

        public EnrollmentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> EnrollStudentAsync(string studentId, int courseId)
        {
            // Check if the student exists
            var studentExists = await _context.Users.AnyAsync(u => u.Id == studentId);
            if (!studentExists)
            {
                throw new Exception($"User with ID {studentId} does not exist.");
            }

            var enrollment = new Enrollment
            {
                StudentId = studentId,
                CourseId = courseId
            };

            _context.Enrollments.Add(enrollment);
            return await _context.SaveChangesAsync() > 0; // Returns true if a change was made
        }

        public async Task<bool> UnenrollStudentAsync(string studentId, int courseId)
        {
            var enrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.StudentId == studentId && e.CourseId == courseId);

            if (enrollment == null)
            {
                return false; // Enrollment not found
            }

            _context.Enrollments.Remove(enrollment);
            return await _context.SaveChangesAsync() > 0; // Returns true if a change was made
        }

        public async Task<bool> IsStudentEnrolledAsync(string studentId, int courseId)
        {
            return await _context.Enrollments
                .AnyAsync(e => e.StudentId == studentId && e.CourseId == courseId);
        }


        public async Task<List<Course>> GetEnrolledCoursesAsync(string studentId)
        {
            return await _context.Enrollments
                .Where(e => e.StudentId == studentId)
                .Select(e => e.Course).Include(c => c.Instructor)
                .ToListAsync();
        }

        
    }
}
