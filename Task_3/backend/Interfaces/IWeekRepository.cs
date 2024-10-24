using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Week;
using backend.Models;

namespace backend.Interfaces
{
    public interface IWeekRepository
    {
        Task<Week> createWeekAsync(CreateWeekDto createWeekDto, int courseId); // Method to create a week
        Task<List<Week>> getCourseWeeksAsync(int courseId);
        Task<bool> deleteWeek(int weekId);// Method to get all weeks
    }
}