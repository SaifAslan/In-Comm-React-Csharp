using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Course;
using backend.Interfaces;
using backend.Models;
using Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class CourseRepository : ICourseRepository
    {
        private readonly ApplicationDbContext _context;

        public CourseRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // Method to create a new course
        public async Task<Course> CreateCourseAsync(CreateCourseDto createCourseDto)
        {
            var courseFromDto = new Course
            {
                Title = createCourseDto.Title,
                Description = createCourseDto.Description,
                InstructorId = createCourseDto.InstructorId
            }; // Set the course properties from the DTO
            var result = await _context.Courses.AddAsync(courseFromDto); // Add the course to the DbSet
            await _context.SaveChangesAsync(); // Save changes to the database
            return result.Entity; // Return the created course
        }

        // Method to update an existing course
        public async Task<bool> UpdateCourseAsync(Course course)
        {
            _context.Courses.Update(course); // Update the course entity
            return await _context.SaveChangesAsync() > 0; // Save changes and return success status
        }

        // Optionally, you can add methods to get courses, delete, etc.
        public async Task<Course?> GetCourseByIdAsync(int courseId)
        {
            return await _context.Courses.Include(c => c.Weeks) // Include related weeks if necessary
                                          .FirstOrDefaultAsync(c => c.Id == courseId);
        }
        public async Task<(List<Course> Courses, int TotalCount)> GetCoursesAsync(int pageNumber, int pageSize)
        {
            var totalCount = await _context.Courses.CountAsync(); // Get total count of courses
            var courses = await _context.Courses.Include(c => c.Instructor)
                                         .Skip((pageNumber - 1) * pageSize) // Skip previous pages
                                         .Take(pageSize) // Take the specified number of courses
                                         .ToListAsync(); // Execute the query and convert to a list
                                         
        

            return (courses, totalCount); // Return the list of courses and total count
        }

        public async Task<bool> CourseExistsAsync(int courseId)
        {
            return await _context.Courses.AnyAsync(c => c.Id == courseId); // Check if any course matches the given ID
        }
    }
}