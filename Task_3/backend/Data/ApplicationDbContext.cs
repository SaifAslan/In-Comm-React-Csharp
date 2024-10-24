using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Data
{
    public class ApplicationDbContext : IdentityDbContext<AppUser>
    {
        public DbSet<Course> Courses { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }
        public DbSet<Week> Weeks { get; set; }
        public DbSet<WeekFile> Files { get; set; }
        public ApplicationDbContext(DbContextOptions dbContextOptions) : base(dbContextOptions) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder); // Call the base method

            List<IdentityRole> roles = new List<IdentityRole>
            {
                new IdentityRole
                {
                    Name = "Admin",
                    NormalizedName = "ADMIN"
                },
                new IdentityRole {
                    Name = "Student",
                    NormalizedName = "STUDENT"
                },
                new IdentityRole {
                    Name = "Instructor",
                    NormalizedName = "INSTRUCTOR"
                }
            };

            modelBuilder.Entity<IdentityRole>().HasData(roles);

            modelBuilder.Entity<Enrollment>().HasKey(e => e.Id);

            modelBuilder.Entity<Enrollment>()
                .HasOne(e => e.Student)
                .WithMany(s => s.Enrollments)
                .HasForeignKey(e => e.StudentId)
                .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete


            modelBuilder.Entity<Enrollment>()
                .HasOne(e => e.Course)
                .WithMany(c => c.Enrollments)
                .HasForeignKey(e => e.CourseId)
                .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete

            modelBuilder.Entity<Course>()
                .HasMany(c => c.Weeks)
                .WithOne(w => w.Course)
                .HasForeignKey(w => w.CourseId);

            modelBuilder.Entity<Week>()
                .HasMany(w => w.Files)
                .WithOne(f => f.Week)
                .HasForeignKey(f => f.WeekId);

        }
    }
}
