using quizify.Models;

namespace quizify.Data;

public interface IQuestionRepository
{
    Task<IEnumerable<Question>> GetQuestionsByCategoryAsync(int categoryId);
    Task<Question> AddQuestionAsync(Question question);
    Task<Question> GetQuestionByIdAsync(int id);
    Task UpdateQuestionAsync(Question question);
}