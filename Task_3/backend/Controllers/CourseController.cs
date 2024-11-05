using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using backend.Dtos.Course;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/course")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly ICourseRepository _courseRepository;
        public CourseController(ICourseRepository courseRepository)
        {
            _courseRepository = courseRepository;
        }

        // POST: api/courses
        [HttpPost]
        [Authorize(Roles = "Admin,Instructor")] // Restrict access to Admins and Instructors
        public async Task<IActionResult> CreateCourse([FromBody] CreateCourseDto createCourseDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState); // Return bad request if model state is invalid
            var createdCourse = await _courseRepository.CreateCourseAsync(createCourseDto); // Create the course
            return CreatedAtAction(nameof(GetCourseById), new { id = createdCourse.Id }, createdCourse); // Return created response with the course data
        }

        // GET: api/courses/{id}
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetCourseById(int id)
        {
            var course = await _courseRepository.GetCourseByIdAsync(id); // Get the course by ID
            if (course == null)
            {
                return NotFound("Course not found."); // Return not found if course does not exist
            }

            return Ok(course); // Return the course data
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetCourses(int pageNumber = 1, int pageSize = 10)
        {
            if (pageNumber < 1 || pageSize < 1)
            {
                return BadRequest("Page number and page size must be greater than 0."); // Validate input
            }

            var (courses, totalCount) = await _courseRepository.GetCoursesAsync(pageNumber, pageSize); // Get paginated courses

            return Ok(new
            {
                TotalCount = totalCount, // Return total count of courses
                Courses = courses // Return the list of courses
            });
        }

        // PUT: api/courses/{id} (Update the existing Put method)
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Instructor")]
        public async Task<IActionResult> UpdateCourse(int id, [FromBody] UpdateCourseDto updateCourseDto)
        {
            var existingCourse = await _courseRepository.GetCourseByIdAsync(id);
            if (existingCourse == null)
            {
                return NotFound("Course not found.");
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (User.IsInRole("Admin") || existingCourse.InstructorId == userId)
            {
                var updated = await _courseRepository.UpdateCourseAsync(id, updateCourseDto);
                if (!updated)
                {
                    return StatusCode(500, "Failed to update the course.");
                }
                return NoContent();
            }

            return Forbid();
        }
        
        // DELETE: api/courses/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Instructor")]
        public async Task<IActionResult> DeleteCourse(int id)
        {
            var course = await _courseRepository.GetCourseByIdAsync(id);
            if (course == null)
            {
                return NotFound("Course not found.");
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (User.IsInRole("Admin") || course.InstructorId == userId)
            {
                var deleted = await _courseRepository.DeleteCourseAsync(course);
                if (!deleted)
                {
                    return StatusCode(500, "Failed to delete the course.");
                }
                return NoContent();
            }

            return Forbid();
        }


    }
}