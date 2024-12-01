using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using quizify.Models;
using System.Linq;
using System.Threading.Tasks;
using quizify.Data;
namespace quizify.Controller;


[Route("api/[controller]")]
[ApiController]
public class TestQuestionsController : ControllerBase
{
    private readonly QuizifyDbContext _context;
    public TestQuestionsController(QuizifyDbContext context)
    {
        _context = context;
    }
    
    [HttpGet("category/{category_id}")]
    public async Task<ActionResult<IEnumerable<TestQuestion>>> GetTestsByCategory(int category_id)
    {
        var tests = await _context.testquestions
            .Where(t => t.category_id == category_id)
            .ToListAsync();
        if (tests == null || !tests.Any())
        {
            return NotFound(new { message = "No tests found for this category." });
        }
        return Ok(tests);
    }

    [HttpPost]
    public async Task<IActionResult> AddTestQuestion([FromBody] TestQuestion testQuestion)
    {
        _context.testquestions.Add(testQuestion);
        await _context.SaveChangesAsync();
        return Ok(testQuestion);
    }
}
