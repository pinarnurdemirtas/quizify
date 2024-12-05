using Microsoft.EntityFrameworkCore;
using quizify.Models;


namespace quizify.Data
{
    // Repository Interface
    public interface IQuestionRepository
    {
        Task<IEnumerable<Question>> GetQuestionsByCategoryAsync(int categoryId);
        Task<Question> AddQuestionAsync(Question question);
    }

    // Repository Implementation
    public class QuestionRepository : IQuestionRepository
    {
        private readonly QuizifyDbContext _context;

        public QuestionRepository(QuizifyDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Question>> GetQuestionsByCategoryAsync(int categoryId)
        {
            return await _context.questions
                .Where(q => q.Category_id == categoryId)
                .ToListAsync();
        }

        public async Task<Question> AddQuestionAsync(Question question)
        {
            _context.questions.Add(question);
            await _context.SaveChangesAsync();
            return question;
        }
    }
}