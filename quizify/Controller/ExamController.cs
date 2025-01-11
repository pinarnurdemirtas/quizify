using Microsoft.AspNetCore.Mvc;
using quizify.Models;
using quizify.Data;
using Microsoft.AspNetCore.Authorization;

namespace quizify.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    
    public class ExamController : ControllerBase
    {
        private readonly IExamRepository _examRepository;

        public ExamController(IExamRepository examRepository)
        {
            _examRepository = examRepository;
        }

        [HttpPost]
        public async Task<IActionResult> CreateExam([FromBody] ExamRequest newExamRequest)
        {
            if (newExamRequest == null || newExamRequest.exam == null || newExamRequest.exam_questions == null)
            {
                return BadRequest("Exam ve ExamQuestions alanları zorunludur.");
            }

            var newExam = await _examRepository.CreateExamAsync(newExamRequest);
            return CreatedAtAction(nameof(GetExamById), new { id = newExam.Id }, newExam);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetExamById(int id)
        {
            var exam = await _examRepository.GetExamByIdAsync(id);
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
            var exams = await _examRepository.GetExamsByUserIdAsync(userId);
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
            var success = await _examRepository.DeleteExamAsync(id);
            if (!success)
            {
                return NotFound(new { Message = "Exam not found" });
            }
            return NoContent();
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            var fileUrl = await _examRepository.UploadFileAsync(file);
            if (fileUrl == null)
            {
                return BadRequest("Yüklenecek bir dosya bulunamadı.");
            }
            return Ok(new { url = fileUrl });
        }
    }
}
