using Microsoft.AspNetCore.Mvc;
using quizify.Models;
using quizify.Data;


namespace quizify.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestQuestionsController : ControllerBase
    {
        private readonly ITestQuestionRepository _testQuestionRepository;

        public TestQuestionsController(ITestQuestionRepository testQuestionRepository)
        {
            _testQuestionRepository = testQuestionRepository;
        }

        // Get tests by category
        [HttpGet("category/{category_id}")]
        public async Task<ActionResult<IEnumerable<TestQuestion>>> GetTestsByCategory(int category_id)
        {
            var tests = await _testQuestionRepository.GetTestsByCategoryAsync(category_id);
            if (tests == null || !tests.Any())
            {
                return NotFound(new { message = "No tests found for this category." });
            }
            return Ok(tests);
        }

        // Add a new test question
        [HttpPost]
        public async Task<IActionResult> AddTestQuestion([FromBody] TestQuestion testQuestion)
        {
            var createdTest = await _testQuestionRepository.AddTestQuestionAsync(testQuestion);
            return Ok(createdTest);
        }
    }
}