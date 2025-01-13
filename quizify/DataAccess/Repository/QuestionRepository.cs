using Microsoft.EntityFrameworkCore;
using quizify.Models;

namespace quizify.Data
{
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
                .Where(q => q.Category_id == categoryId && q.IsApproved) 
                .ToListAsync();
        }

        public async Task<Question> AddQuestionAsync(Question question)
        {
            question.IsApproved = false;

            _context.questions.Add(question);
            await _context.SaveChangesAsync();
            return question;
        }

        public async Task<bool> ApproveQuestionAsync(int questionId)
        {
            var question = await _context.questions.FindAsync(questionId);
            if (question == null) return false;

            question.IsApproved = true;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}