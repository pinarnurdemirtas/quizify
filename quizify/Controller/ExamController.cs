using Microsoft.AspNetCore.Mvc;
using quizify.Data;
using quizify.Models;
using quizify.Services;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.IO;

namespace quizify.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExamController : ControllerBase
    {
        private readonly QuizifyDbContext _context;
        private readonly PdfService _pdfService;

        // Dependency Injection ile DbContext ve PdfService ekleniyor
        public ExamController(QuizifyDbContext context, PdfService pdfService)
        {
            _context = context;
            _pdfService = pdfService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateExam([FromBody] ExamRequest newExamRequest)
        {
            if (newExamRequest == null || newExamRequest.exam == null || newExamRequest.examQuestions == null)
            {
                return BadRequest("Exam ve ExamQuestions alanları zorunludur.");
            }

            // Yeni sınavı veritabanına ekle
            var newExam = new Exam
            {
                user_id = newExamRequest.exam.user_id,
                name = newExamRequest.exam.name,
                pdf_url = "temporary_url", // PDF URL'sini burada oluşturabilirsiniz
                created_at = DateTime.UtcNow
            };

            _context.exams.Add(newExam);
            await _context.SaveChangesAsync(); // İlk olarak sınavı kaydet

            // ExamQuestions tablosuna soruları ekle
            foreach (var examQuestion in newExamRequest.examQuestions)
            {
                examQuestion.exam_id = newExam.id;  // Yeni eklenen sınavın ID'sini kullan
                await _context.exam_questions.AddAsync(examQuestion);
            }

            await _context.SaveChangesAsync();

            // PDF oluşturulacak
            var pdfFilePath = _pdfService.GeneratePdf(newExam, newExamRequest.examQuestions);

            // PDF URL'sini güncelle
            newExam.pdf_url = pdfFilePath;
            _context.exams.Update(newExam);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetExamById), new { id = newExam.id }, newExam);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetExamById(int id)
        {
            var exam = await _context.exams.FindAsync(id);
            if (exam == null)
            {
                return NotFound("Exam bulunamadı.");
            }
            return Ok(exam);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetExamsByUserId(int userId)
        {
            var exams = await _context.exams
                .Where(e => e.user_id == userId)  // UserId'ye göre filtreleme
                .ToListAsync();

            if (exams == null || !exams.Any())
            {
                return NotFound("Kullanıcıya ait sınav bulunamadı.");
            }

            return Ok(exams);
        }

        [HttpGet("{id}/pdf")]
        public async Task<IActionResult> GetPdf(int id)
        {
            var exam = await _context.exams.FindAsync(id);
            if (exam == null)
            {
                return NotFound("Exam bulunamadı.");
            }

            // PDF dosyasının yolunu al
            var pdfFilePath = exam.pdf_url;
            if (string.IsNullOrEmpty(pdfFilePath))
            {
                return NotFound("PDF dosyası bulunamadı.");
            }

            // Dosya yolu geçerli mi kontrol et
            if (!System.IO.File.Exists(pdfFilePath))
            {
                return NotFound("PDF dosyası bulunamadı veya yol hatalı.");
            }

            try
            {
                // PDF dosyasını okuma
                var fileBytes = await System.IO.File.ReadAllBytesAsync(pdfFilePath);
                return File(fileBytes, "application/pdf", Path.GetFileName(pdfFilePath));
            }
            catch (Exception ex)
            {
                // Dosya okuma sırasında bir hata olursa
                return StatusCode(500, $"Dosya okuma hatası: {ex.Message}");
            }
        }

        // Yeni eklenen sınav silme işlemi
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExam(int id)
        {
            var exam = await _context.exams.FindAsync(id);
            if (exam == null)
            {
                return NotFound("Sınav bulunamadı.");
            }

            // Öncelikle sınavla ilişkili tüm soruları sil
            var examQuestions = await _context.exam_questions
                                              .Where(eq => eq.exam_id == id)
                                              .ToListAsync();
            
            _context.exam_questions.RemoveRange(examQuestions);

            // Sonra sınavı sil
            _context.exams.Remove(exam);

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();  // Başarılı bir silme işlemi sonrası 204 No Content döner.
            }
            catch (Exception ex)
            {
                // Veritabanı kaydı silme sırasında bir hata oluşursa
                return StatusCode(500, $"Silme işlemi sırasında bir hata oluştu: {ex.Message}");
            }
        }
    }
}
