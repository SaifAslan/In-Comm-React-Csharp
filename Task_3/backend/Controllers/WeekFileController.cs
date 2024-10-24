using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Interfaces;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/week/{weekId}/files")]
    [ApiController]
    public class WeekFileController : ControllerBase
    {
        private readonly IConfiguration _configuration; // Configuration to access app settings
        private readonly IWeekFileRepository _weekFileRepository;

        public WeekFileController(IConfiguration configuration, IWeekFileRepository weekFileRepository)
        {
            _configuration = configuration; // Initialize configuration
            _weekFileRepository = weekFileRepository; // Initialize week file repository
        }

        // GET: api/week/{weekId}/files
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetFiles(int weekId)
        {
            var files = await _weekFileRepository.GetWeekFilesByWeekIdAsync(weekId); // Get files for the week
            return Ok(files); // Return the list of files
        }
        

        [HttpPost("upload")]
        [Authorize(Roles = "Admin,Instructor")] // Restrict access to Admins and Instructors
        public async Task<IActionResult> UploadFile(int weekId,IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }



            var blobStorageService = new BlobStorageService(_configuration.GetSection("AzureStorage:ConnectionString").Value);
            var fileUrl = await blobStorageService.UploadFileAsync(file); // Upload the file and get the URL
            var weekFile = new WeekFile
            {
                WeekId = weekId, // Set the foreign key to the week
                FileName = file.FileName, // Set the file name
                Url = fileUrl // Set the URL returned from blob storage
            };
            var newWeekFile = await _weekFileRepository.CreateWeekFileAsync(weekId, weekFile); // Save the file

            return Ok(newWeekFile); // Return the URL of the uploaded file
        }

         // GET: api/week/{weekId}/files/{fileId}
        [HttpGet("{weekFileId}")]
        public async Task<IActionResult> GetFileById(int weekFileId)
        {
            var weekFile = await _weekFileRepository.GetWeekFileByIdAsync(weekFileId); // Get the file by ID
            if (weekFile == null) return NotFound("File not found."); // Return not found if the file does not exist
            return Ok(weekFile); // Return the file data
        }

        // DELETE: api/week/{weekId}/files/{fileId}
        [HttpDelete("{weekFileId}")]
        [Authorize(Roles = "Admin,Instructor")] // Restrict access to Admins and Instructors
        public async Task<IActionResult> DeleteFile(int weekFileId)
        {
            var deleted = await _weekFileRepository.DeleteWeekFileAsync(weekFileId); // Attempt to delete the file
            if (!deleted) return NotFound("File not found."); // Return not found if the file does not exist
            return NoContent(); // Return no content on successful deletion
        }

    }
}