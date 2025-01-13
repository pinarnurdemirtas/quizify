using quizify.Models;

namespace quizify.Data;

public interface IQuestionRepository
{
    Task<IEnumerable<Question>> GetQuestionsByCategoryAsync(int categoryId);
    Task<Question> AddQuestionAsync(Question question);
    Task<bool> ApproveQuestionAsync(int questionId); 

  
}