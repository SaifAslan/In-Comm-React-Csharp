using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Course;
using backend.Models;

namespace backend.Interfaces
{
    public interface ICourseRepository
    {
        Task<Course> CreateCourseAsync(CreateCourseDto createCourseDto); // Method to create a course
        Task<bool> UpdateCourseAsync(Course course); // Method to update a course
        Task<Course?> GetCourseByIdAsync(int courseId); // Method to get a course by ID
        Task<(List<Course> Courses, int TotalCount)> GetCoursesAsync(int pageNumber, int pageSize); // Method to get courses with pagination
        Task<bool> CourseExistsAsync(int courseId); // Check if a course exists

    }
}