using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace backend.Services
{
    public class BlobStorageService
    {
        private readonly BlobServiceClient _blobServiceClient;
        private readonly string _containerName = "incommblobcontainer"; // Your container name

        public BlobStorageService(string connectionString)
        {
            _blobServiceClient = new BlobServiceClient(connectionString); // Initialize BlobServiceClient
        }

        public async Task<string> UploadFileAsync(IFormFile file)
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName); // Get container client
            await containerClient.CreateIfNotExistsAsync(); // Create the container if it does not exist

            var blobClient = containerClient.GetBlobClient(file.FileName); // Get a reference to the blob
            await blobClient.UploadAsync(file.OpenReadStream(), new BlobHttpHeaders { ContentType = file.ContentType }); // Upload the file

            return blobClient.Uri.ToString(); // Return the URL of the uploaded file
        }
    }
}