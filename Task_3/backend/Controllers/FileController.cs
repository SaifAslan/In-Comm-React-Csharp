using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/file")]
    [ApiController]
    public class FileController : ControllerBase
    {        
        private readonly IConfiguration _configuration; // Configuration to access app settings

        public FileController(IConfiguration configuration)
        {
            _configuration = configuration; // Initialize configuration
        }
        
        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            var blobStorageService = new BlobStorageService(_configuration.GetSection("AzureStorage:ConnectionString").Value);
            var fileUrl = await blobStorageService.UploadFileAsync(file); // Upload the file and get the URL

            return Ok(new { fileUrl }); // Return the URL of the uploaded file
        }

    }
}