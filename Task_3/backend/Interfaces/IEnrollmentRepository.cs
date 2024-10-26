using backend.Models;

namespace backend.Interfaces
{
    public interface IEnrollmentRepository
    {
        Task<bool> EnrollStudentAsync(string studentId, int courseId);
        Task<bool> UnenrollStudentAsync(string studentId, int courseId);
        Task<bool> IsStudentEnrolledAsync(string studentId, int courseId);
        Task<List<Course>> GetEnrolledCoursesAsync(string studentId); 

    }
}