using Microsoft.EntityFrameworkCore;
using quizify.Models;

namespace quizify.Data
{
    // Repository Implementation
    public class QuestionRepository : IQuestionRepository
    {
        private readonly QuizifyDbContext _context;

        public QuestionRepository(QuizifyDbContext context)
        {
            _context = context;
        }

        // Kategoriye göre onaylı soruları getiren metod
        public async Task<IEnumerable<Question>> GetQuestionsByCategoryAsync(int categoryId)
        {
            return await _context.questions
                .Where(q => q.Category_id == categoryId && q.IsApproved)  // Yalnızca onaylı soruları getir
                .ToListAsync();
        }

        // Tüm onaylı soruları getiren metod
        public async Task<IEnumerable<Question>> GetAllApprovedQuestionsAsync()
        {
            return await _context.questions
                .Where(q => q.IsApproved)  // Yalnızca onaylı soruları getir
                .ToListAsync();
        }

        // Yeni soru ekleyen metod
        public async Task<Question> AddQuestionAsync(Question question)
        {
            _context.questions.Add(question);  // Onay durumu 'false' olarak ekleniyor
            await _context.SaveChangesAsync();
            return question;
        }

        // Soruyu ID'ye göre getir
        public async Task<Question> GetQuestionByIdAsync(int id)
        {
            return await _context.questions
                .FirstOrDefaultAsync(q => q.Id == id);
        }

        // Soruyu güncelleyen metod (onaylama işlemi)
        public async Task UpdateQuestionAsync(Question question)
        {
            _context.questions.Update(question);  // Mevcut soruyu güncelle
            await _context.SaveChangesAsync();
        }
    }
}