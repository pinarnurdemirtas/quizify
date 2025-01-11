using quizify.Models;

namespace quizify.Data;

// Define the IExamRepository interface
public interface IExamRepository
{
    Task<Exam> CreateExamAsync(ExamRequest newExamRequest);
    Task<Exam> GetExamByIdAsync(int id);
    Task<IEnumerable<Exam>> GetExamsByUserIdAsync(int userId);
    Task<bool> DeleteExamAsync(int id);
    Task<string> UploadFileAsync(IFormFile file);
}