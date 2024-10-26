using backend.Dtos.Enrollment;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace backend.Controllers
{
    [Route("api/enrollment")]
    [ApiController]
    public class EnrollmentController : ControllerBase
    {
        private readonly IEnrollmentRepository _enrollmentRepository;

        public EnrollmentController(IEnrollmentRepository enrollmentRepository)
        {
            _enrollmentRepository = enrollmentRepository;
        }

        // POST: api/enrollment/enroll
        [HttpPost("enroll")]
        [Authorize] // Require authorization
        public async Task<IActionResult> Enroll([FromBody] EnrollRequestDto enrollRequestDto)
        {
            var result = await _enrollmentRepository.EnrollStudentAsync(enrollRequestDto.StudentId, enrollRequestDto.CourseId);
            if (result)
            {
                return Ok("Successfully enrolled.");
            }
            return BadRequest("Enrollment failed.");
        }

        // DELETE: api/enrollment/unenroll
        [HttpDelete("unenroll")]
        [Authorize] // Require authorization
        public async Task<IActionResult> Unenroll([FromBody] UnenrollRequestDto unenrollRequestDto)
        {
            var result = await _enrollmentRepository.UnenrollStudentAsync(unenrollRequestDto.StudentId, unenrollRequestDto.CourseId);
            if (result)
            {
                return Ok("Successfully unenrolled.");
            }
            return BadRequest("Unenrollment failed.");
        }

        // GET: api/enrollment/check
        [HttpGet("check")]
        [Authorize] // Require authorization
        public async Task<IActionResult> CheckEnrollment(string studentId, int courseId)
        {
            var isEnrolled = await _enrollmentRepository.IsStudentEnrolledAsync(studentId, courseId);
            return Ok(isEnrolled);
        }
        // GET: api/enrollment/{userId}/courses
        [HttpGet("{userId}/courses")]
        [Authorize] // Require authorization
        public async Task<IActionResult> GetEnrolledCourses(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
            {
                return BadRequest("Invalid user ID.");
            }

            // Use the repository to get enrolled courses for the specified user
            var courses = await _enrollmentRepository.GetEnrolledCoursesAsync(userId);
            if (courses == null || !courses.Any())
            {
                return NotFound("No enrolled courses found.");
            }

            return Ok(courses);
        }
    }

}
