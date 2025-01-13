using quizify.Models;

namespace quizify.Data;

public interface ITestQuestionRepository
{
    Task<IEnumerable<TestQuestion>> GetTestsByCategoryAsync(int categoryId);
    Task<TestQuestion> AddTestQuestionAsync(TestQuestion testQuestion);
    Task<bool> ApproveTestQuestionAsync(int testQuestionId);
    Task<bool> SaveChangesAsync();
}