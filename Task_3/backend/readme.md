# Course Management System - Backend

The backend for the Course Management System is built with ASP.NET Core and provides the necessary APIs to support user management, course management, and enrollment functionalities. It serves as the server-side application that handles data processing, authentication, and business logic, allowing for seamless integration with the frontend.

## Features

- **User Management**:
  - Users can register and log in as either students or instructors.
  - Role-based access control ensures appropriate permissions for different user types.

- **Course Management**:
  - Instructors can create, update, and delete courses.
  - Students can enroll in courses and access course materials.

- **Enrollment Management**:
  - Tracks which students are enrolled in which courses.
  - Provides endpoints to retrieve enrolled courses for a student.

- **Secure Authentication**:
  - Implements JWT (JSON Web Tokens) for secure API access.
  - Protects sensitive routes with authorization middleware.

- **Data Persistence**:
  - Uses Entity Framework Core for database interactions.
  - Supports SQL Server as the database management system.

## Technologies Used

- **ASP.NET Core**: A cross-platform framework for building modern cloud-based applications.
- **Entity Framework Core**: An object-relational mapper for .NET.
- **SQL Server**: A relational database management system for data storage.
- **Identity Framework**: Provides user management and authentication capabilities.
- **JWT**: JSON Web Tokens for secure authentication.

## NuGet Packages

- `Azure.Storage.Blobs` (Version: 12.22.2)
- `Microsoft.AspNetCore.Authentication.JwtBearer` (Version: 8.0.10)
- `Microsoft.AspNetCore.Cors` (Version: 2.2.0)
- `Microsoft.AspNetCore.Identity.EntityFrameworkCore` (Version: 8.0.10)
- `Microsoft.AspNetCore.Mvc.NewtonsoftJson` (Version: 8.0.10)
- `Microsoft.AspNetCore.OpenApi` (Version: 8.0.10)
- `Microsoft.EntityFrameworkCore` (Version: 8.0.10)
- `Microsoft.EntityFrameworkCore.Design` (Version: 8.0.10)
- `Microsoft.EntityFrameworkCore.SqlServer` (Version: 8.0.10)
- `Swashbuckle.AspNetCore` (Version: 6.4.0)

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [.NET SDK](https://dotnet.microsoft.com/download) (version 6.0 or above)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (for local development)

### Installation

1. Clone the repository:

2. Restore dependencies:

   ```bash
   dotnet restore
   ```

3. Update the connection string in `appsettings.json` to point to your SQL Server instance, please find a copy of the  `appsettings.json`attached to the submission e-mail.

### Database Migration

Before running the application, you need to migrate the database. Use the following commands:

1. Apply the initial migrations:

   ```bash
   dotnet ef database update
   ```

2. If there are changes in your models, make sure to create a new migration:

   ```bash
   dotnet ef migrations add YourMigrationName
   ```

3. Then, update the database to apply the new migration:

   ```bash
   dotnet ef database update
   ```

### Running the Project

To start the development server:

```bash
dotnet run
```
