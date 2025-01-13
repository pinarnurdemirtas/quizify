using Microsoft.EntityFrameworkCore;
using quizify.Models;

namespace quizify.Data
{

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
                .Where(t => t.Category_id == categoryId && t.IsApproved) 
                .ToListAsync();
        }

        public async Task<TestQuestion> AddTestQuestionAsync(TestQuestion testQuestion)
        {
            testQuestion.IsApproved = false;

            await _context.testquestions.AddAsync(testQuestion);
            await SaveChangesAsync();
            return testQuestion;
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> ApproveTestQuestionAsync(int testQuestionId)
        {
            var testQuestion = await _context.testquestions.FindAsync(testQuestionId);
            if (testQuestion == null) return false;

            testQuestion.IsApproved = true;
            await SaveChangesAsync();
            return true;
        }
    }

}