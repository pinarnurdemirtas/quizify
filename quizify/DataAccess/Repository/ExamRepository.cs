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
            // Eğer dosya null ise veya boyutu 0 ise geçersizdir, null döndür.
            if (file == null || file.Length == 0)
                return null;
            
            // Yükleme yapılacak klasör yolunu belirle ("wwwroot/uploads").
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
            // Eğer bu klasör yoksa, oluştur.
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }
            
            // Dosya adı için benzersiz bir ad oluştur ve dosya uzantısını koru.
            var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            
            // Dosyanın tam yolunu belirle.
            var filePath = Path.Combine(uploadsFolder, fileName);
            
            // Dosyayı belirtilen yola kaydetmek için bir dosya akışı (stream) oluştur.
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                // Dosyayı asenkron olarak hedef akışa kopyala.
                await file.CopyToAsync(stream);
            }
            
            // HTTP isteğinden protokol (http/https) ve host bilgisini al.
            var request = _httpContextAccessor.HttpContext.Request;
            
            // Dosya URL'sini oluştur (örneğin: http://localhost:5000/uploads/{fileName}).
            var fileUrl = $"{request.Scheme}://{request.Host}/uploads/{fileName}";
            
            // Dosyanın URL'sini döndür.
            return fileUrl;
        }
    }
}