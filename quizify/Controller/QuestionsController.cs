using Microsoft.AspNetCore.Mvc;
using quizify.Models;
using quizify.Data;


namespace quizify.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionsController : ControllerBase
    {
        private readonly IQuestionRepository _questionRepository;

        public QuestionsController(IQuestionRepository questionRepository)
        {
            _questionRepository = questionRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Question>>> GetQuestionsByCategory([FromQuery] int category)
        {
            var questions = await _questionRepository.GetQuestionsByCategoryAsync(category);

            if (questions == null || !questions.Any())
            {
                return NotFound("No questions found for this category.");
            }

            return Ok(questions);
        }

        [HttpPost]
        public async Task<ActionResult<Question>> PostQuestion(Question question)
        {
            var addedQuestion = await _questionRepository.AddQuestionAsync(question);
            return Ok(addedQuestion);
        }
    }
}