using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using quizify.Data;
using quizify.Models;
namespace quizify.Controller;


[Route("api/[controller]")]
[ApiController]
public class QuestionsController : ControllerBase
{
    private readonly QuizifyDbContext _context;
    public QuestionsController(QuizifyDbContext context)
    {
        _context = context;
    }
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Question>>> GetQuestionsByCategory([FromQuery] int category)
    {
        var questions = await _context.questions
            .Where(q => q.Category_id == category)
            .ToListAsync();
        if (questions == null || questions.Count == 0)
        {
            return NotFound("No questions found for this category.");
        }
        return Ok(questions);
    }

    [HttpPost]
    public async Task<ActionResult<Question>> PostQuestion(Question question)
    {
        _context.questions.Add(question);
        await _context.SaveChangesAsync();
        return Ok(question);
    }
}
