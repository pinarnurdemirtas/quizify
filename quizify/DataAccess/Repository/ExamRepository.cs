using Microsoft.EntityFrameworkCore;
using quizify.Models;

namespace quizify.Data
{
    public class ExamRepository : IExamRepository
    {
         private readonly QuizifyDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ExamRepository(QuizifyDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<Exam> CreateExamAsync(ExamRequest newExamRequest)
        {
            if (newExamRequest == null || newExamRequest.exam == null || newExamRequest.exam_questions == null)
                return null;

            var newExam = new Exam
            {
                User_id = newExamRequest.exam.User_id,
                Name = newExamRequest.exam.Name,
                Pdf_url = newExamRequest.exam.Pdf_url,
                Created_at = DateTime.UtcNow
            };

            _context.exams.Add(newExam);
            await _context.SaveChangesAsync();

            foreach (var examQuestion in newExamRequest.exam_questions)
            {
                examQuestion.ExamId = newExam.Id;
                _context.exam_questions.Add(examQuestion);
            }
            await _context.SaveChangesAsync();

            return newExam;
        }

        public async Task<Exam> GetExamByIdAsync(int id)
        {
            return await _context.exams
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<IEnumerable<Exam>> GetExamsByUserIdAsync(int userId)
        {
            return await _context.exams
                .Where(e => e.User_id == userId)
                .ToListAsync();
        }

        public async Task<bool> DeleteExamAsync(int id)
        {
            var exam = await _context.exams.FindAsync(id);
            if (exam == null)
            {
                return false;
            }

            _context.exams.Remove(exam);

            var examQuestions = await _context.exam_questions
                .Where(eq => eq.ExamId == id)
                .ToListAsync();
            _context.exam_questions.RemoveRange(examQuestions);

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<string> UploadFileAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return null;

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var request = _httpContextAccessor.HttpContext.Request;
            var fileUrl = $"{request.Scheme}://{request.Host}/uploads/{fileName}";
            return fileUrl;
        }
    }
}