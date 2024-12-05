using Microsoft.EntityFrameworkCore;
using quizify.Models;

namespace quizify.Data
{
    // Define the IExamRepository interface
    public interface IExamRepository
    {
        Task<Exam> CreateExamAsync(ExamRequest newExamRequest);
        Task<Exam> GetExamByIdAsync(int id);
        Task<IEnumerable<Exam>> GetExamsByUserIdAsync(int userId);
        Task<bool> DeleteExamAsync(int id);
        Task<string> UploadFileAsync(IFormFile file);
    }

    // Implement the IExamRepository interface in the ExamRepository class
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
            if (newExamRequest == null || newExamRequest.exam == null || newExamRequest.examQuestions == null)
                return null;

            // Create the Exam entity
            var newExam = new Exam
            {
                User_id = newExamRequest.exam.User_id,
                Name = newExamRequest.exam.Name,
                Pdf_url = newExamRequest.exam.Pdf_url,
                Created_at = DateTime.UtcNow
            };

            // Add the exam to the database
            _context.Exam.Add(newExam);
            await _context.SaveChangesAsync();

            // Add associated ExamQuestions to the database
            foreach (var examQuestion in newExamRequest.examQuestions)
            {
                examQuestion.Exam_id = newExam.Id;
                _context.ExamQuestions.Add(examQuestion);
            }
            await _context.SaveChangesAsync();

            return newExam;
        }

        public async Task<Exam> GetExamByIdAsync(int id)
        {
            return await _context.Exam
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<IEnumerable<Exam>> GetExamsByUserIdAsync(int userId)
        {
            return await _context.Exam
                .Where(e => e.User_id == userId)
                .ToListAsync();
        }

        public async Task<bool> DeleteExamAsync(int id)
        {
            var exam = await _context.Exam.FindAsync(id);
            if (exam == null)
            {
                return false;
            }

            _context.Exam.Remove(exam);

            // Remove related questions
            var examQuestions = await _context.ExamQuestions
                .Where(eq => eq.Exam_id == id)
                .ToListAsync();
            _context.ExamQuestions.RemoveRange(examQuestions);

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<string> UploadFileAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return null;

            // Define the upload folder path
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            // Create a unique file name
            var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);

            // Save the file to the disk
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Build the file URL
            var request = _httpContextAccessor.HttpContext.Request;
            var fileUrl = $"{request.Scheme}://{request.Host}/uploads/{fileName}";
            return fileUrl;
        }
    }
}