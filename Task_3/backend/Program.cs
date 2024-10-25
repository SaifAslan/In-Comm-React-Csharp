using backend.Interfaces;
using backend.Models;
using backend.Repositories;
using backend.Services;
using Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args); // Create a new web application builder

// Add services to the container
builder.Services.AddEndpointsApiExplorer(); // Enable API endpoint exploration
builder.Services.AddSwaggerGen(); // Enable Swagger for API documentation
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")); // Configure the database context to use SQL Server
});

builder.Services.AddControllers(); // Add support for controllers
builder.Services.AddScoped<ITokenService, TokenService>(); // Register the token service
builder.Services.AddScoped<IUserRepository, UserRepository>(); // Register the user repository
builder.Services.AddScoped<ICourseRepository, CourseRepository>(); // Register the Course repository
builder.Services.AddScoped<IWeekRepository, WeekRepository>(); // Register the Week repository
builder.Services.AddScoped<IWeekFileRepository, WeekFileRepository>(); // Register the File repository


builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore; // Configure JSON serialization settings
});

// Configure Identity for user management
builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true; 
    options.Password.RequireUppercase = true; 
    options.Password.RequireNonAlphanumeric = true; 
    options.Password.RequiredLength = 8; 
}).AddEntityFrameworkStores<ApplicationDbContext>(); 

// Configure JWT authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme =
    options.DefaultChallengeScheme =
    options.DefaultForbidScheme =
    options.DefaultScheme =
    options.DefaultSignInScheme =
    options.DefaultSignOutScheme = JwtBearerDefaults.AuthenticationScheme; // Set the default authentication scheme to JWT
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true, // Validate the token issuer
        ValidateAudience = true, // Validate the token audience
        ValidIssuer = builder.Configuration["JWT:Issuer"], // Get valid issuer from configuration
        ValidAudience = builder.Configuration["JWT:Audience"], // Get valid audience from configuration
        ValidateIssuerSigningKey = true, // Validate the signing key
        IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(builder.Configuration["JWT:SigningKey"])), // Get signing key from configuration
        ValidateLifetime = true, // Validate the token lifetime
        ClockSkew = TimeSpan.Zero // Set clock skew to zero
    };
});

// Configure Swagger for API documentation with authentication
builder.Services.AddSwaggerGen(option =>
{
    option.SwaggerDoc("v1", new OpenApiInfo { Title = "Demo API", Version = "v1" }); // Define API documentation
    option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header, 
        Description = "Please enter a valid token", 
        Name = "Authorization", 
        Type = SecuritySchemeType.Http, 
        BearerFormat = "JWT",
        Scheme = "Bearer" 
    });
    option.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer" // Reference the security scheme
                }
            },
            new string[]{}
        }
    });
});

// Configure CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowOrigin",
        builder => builder.WithOrigins("http://localhost:3000") // Your frontend URL
                          .AllowAnyMethod()
                          .AllowAnyHeader());
});


var app = builder.Build(); // Build the application

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger(); // Enable Swagger in development
    app.UseSwaggerUI(); // Enable Swagger UI
}

app.UseCors("AllowOrigin");
app.UseHttpsRedirection(); // Redirect HTTP requests to HTTPS
app.UseAuthentication(); // Enable authentication middleware
app.UseAuthorization(); // Enable authorization middleware

app.MapControllers(); // Map attribute-based routes to controllers

app.Run(); // Run the application
