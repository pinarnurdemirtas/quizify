using quizify.Models;

namespace quizify.Data;

// Interface definition within the same file
public interface ITestQuestionRepository
{
    Task<IEnumerable<TestQuestion>> GetTestsByCategoryAsync(int categoryId);
    Task<TestQuestion> AddTestQuestionAsync(TestQuestion testQuestion);
    Task<bool> SaveChangesAsync();
}