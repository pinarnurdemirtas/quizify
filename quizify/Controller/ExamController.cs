using Microsoft.AspNetCore.Mvc;
using quizify.Data;
using quizify.Models;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.IO;
using Microsoft.AspNetCore.Authorization;

namespace quizify.Controller;


[ApiController]
[Route("api/[controller]")]


public class ExamController : ControllerBase
{
    private readonly QuizifyDbContext _context;
    public ExamController(QuizifyDbContext context)
    {
        _context = context;
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
            User_id = newExamRequest.exam.User_id,
            Name = newExamRequest.exam.Name,
            Pdf_url = newExamRequest.exam.Pdf_url, 
            Created_at = DateTime.UtcNow
        };
        _context.Exam.Add(newExam);
        await _context.SaveChangesAsync();

        // ExamQuestions tablosuna soruları ekle
        foreach (var examQuestion in newExamRequest.examQuestions)
        {
            examQuestion.Exam_id = newExam.Id; 
            await _context.ExamQuestions.AddAsync(examQuestion);
        }
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetExamById), new { id = newExam.Id }, newExam);
    }

    
    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetExamById(int id)
    {
        var exam = await _context.Exam.FindAsync(id);
        if (exam == null)
        {
            return NotFound("Exam bulunamadı.");
        }
        return Ok(exam);
    }

    [HttpGet("user/{userId}")]
    [Authorize]

    public async Task<IActionResult> GetExamsByUserId(int userId)
    {
        var exams = await _context.Exam
            .Where(e => e.User_id == userId)  
            .ToListAsync();
        if (exams == null || !exams.Any())
        {
            return NotFound("Kullanıcıya ait sınav bulunamadı.");
        }
        return Ok(exams);
    }
    
    [HttpDelete("{id}")]
    [Authorize]

    public async Task<IActionResult> DeleteExam(int id)
    {
        var exam = await _context.Exam.FindAsync(id);
        if (exam == null)
        {
            return NotFound(new { Message = "Exam not found" });
        }

        _context.Exam.Remove(exam);
        await _context.SaveChangesAsync();


        // İlgili soruları sil
        var examQuestions = await _context.ExamQuestions
            .Where(eq => eq.Exam_id == id)
            .ToListAsync();
        _context.ExamQuestions.RemoveRange(examQuestions);

        // Sınavı sil
      
        return NoContent();
    }

    
    [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Yüklenecek bir dosya bulunamadı.");
            
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);
            var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            var fileUrl = $"{Request.Scheme}://{Request.Host}/uploads/{fileName}";
            return Ok(new { url = fileUrl });
        }
}
