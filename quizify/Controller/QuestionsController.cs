using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using quizify.Data;
using quizify.Models;

namespace quizify.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionsController : ControllerBase
    {
        private readonly QuizifyDbContext _context;

        public QuestionsController(QuizifyDbContext context)
        {
            _context = context;
        }

        // GET api/questions?category=20
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Question>>> GetQuestionsByCategory([FromQuery] int category)
        {

            var questions = await _context.questions
                .Where(q => q.category_id == category)
                .ToListAsync();

            if (questions == null || questions.Count == 0)
            {
                return NotFound("No questions found for this category.");
            }

            return Ok(questions);
        }
    }
}