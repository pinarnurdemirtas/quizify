using Microsoft.AspNetCore.Mvc;
using quizify.Data;


namespace quizify.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoriesController(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        [HttpGet]
        public async Task<ActionResult<List<Categories>>> GetCategories(int? parentId = null)
        {
            var categories = await _categoryRepository.GetCategoriesAsync(parentId);
            return Ok(categories);
        }
    }
}