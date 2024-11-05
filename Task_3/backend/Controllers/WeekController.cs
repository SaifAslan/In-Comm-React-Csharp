using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Week;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/course/{courseId}/week")]
    public class WeekController : ControllerBase
    {
        private readonly IWeekRepository _weekRepository;
        public WeekController(IWeekRepository weekRepository)
        {
            _weekRepository = weekRepository;
        }
        // GET api/course/5/week
        [HttpGet]
        [Authorize(Roles = "Admin,Instructor")]
        public async Task<IActionResult> getCourseWeeks(int courseId)
        {
            var weeks = await _weekRepository.getCourseWeeksAsync(courseId);
            if (weeks == null) return NotFound();
            return Ok(weeks);
        }
        [HttpPost]
        [Authorize(Roles = "Admin,Instructor")]
        public async Task<IActionResult> createCourseWeek(int courseId, [FromBody] CreateWeekDto createWeekDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var week = await _weekRepository.createWeekAsync(createWeekDto, courseId);
            return CreatedAtAction(nameof(getCourseWeeks), new { courseId = courseId, weekId = week.Id }, week);
        }

        [HttpDelete("{weekId}")]
        [Authorize(Roles = "Admin,Instructor")] // Restrict access to Admins and Instructors
        public async Task<IActionResult> DeleteWeek(int courseId, int weekId)
        {
            var deleted = await _weekRepository.deleteWeek(weekId); // Attempt to delete the week
            if (!deleted)
            {
                return NotFound("Week not found."); // Return not found if the week does not exist
            }

            return NoContent(); // Return no content on successful deletion
        }

        [HttpPut("{weekId}")]
        [Authorize(Roles = "Admin,Instructor")]
        public async Task<IActionResult> UpdateWeek(int courseId, int weekId, [FromBody] UpdateWeekDto updateWeekDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var updatedWeek = await _weekRepository.UpdateWeekAsync(weekId, updateWeekDto);
            if (updatedWeek == null) return NotFound("Week not found.");

            return Ok(updatedWeek);
        }

        // DELETE api/course/{courseId}/week/bulk-delete
        [HttpDelete("bulk-delete")]
        [Authorize(Roles = "Admin,Instructor")]
        public async Task<IActionResult> BulkDeleteWeeks(int courseId, [FromBody] List<int> weekIds)
        {
            if (weekIds == null || weekIds.Count == 0) return BadRequest("No week IDs provided.");

            var deleted = await _weekRepository.BulkDeleteWeeks(weekIds);
            if (!deleted) return NotFound("No weeks found to delete.");

            return NoContent();
        }
    }
}