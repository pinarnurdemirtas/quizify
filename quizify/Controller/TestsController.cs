using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using quizify.Models;
using System.Linq;
using System.Threading.Tasks;
using quizify.Data;

namespace quizify.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestsController : ControllerBase
    {
        private readonly QuizifyDbContext _context;

        public TestsController(QuizifyDbContext context)
        {
            _context = context;
        }

        // GET: api/Tests/category/{category_id}
        [HttpGet("category/{category_id}")]
        public async Task<ActionResult<IEnumerable<Test>>> GetTestsByCategory(int category_id)
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
    }
}