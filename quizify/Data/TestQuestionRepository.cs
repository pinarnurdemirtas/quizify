using Microsoft.EntityFrameworkCore;
using quizify.Models;


namespace quizify.Data
{

    // Implementation of the interface
    public class TestQuestionRepository : ITestQuestionRepository
    {
        private readonly QuizifyDbContext _context;

        public TestQuestionRepository(QuizifyDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TestQuestion>> GetTestsByCategoryAsync(int categoryId)
        {
            return await _context.testquestions
                .Where(t => t.Category_id == categoryId)
                .ToListAsync();
        }

        public async Task<TestQuestion> AddTestQuestionAsync(TestQuestion testQuestion)
        {
            await _context.testquestions.AddAsync(testQuestion);
            await SaveChangesAsync();
            return testQuestion;
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}