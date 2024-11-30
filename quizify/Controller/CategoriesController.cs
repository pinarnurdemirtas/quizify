using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using quizify.Data;
using quizify.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace quizify.Controller;


[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly QuizifyDbContext _context;
    public CategoriesController(QuizifyDbContext context)
    {
        _context = context;
    }
    
    [HttpGet]
    public async Task<ActionResult<List<Categories>>> GetCategories(int? parentId = null)
    {
        //Kategoriler Sorgusu
        IQueryable<Categories> categoriesQuery = _context.categories;

        // Eğer parentId null değilse, filtre uygula
        if (parentId.HasValue)
        {
            categoriesQuery = categoriesQuery.Where(c => c.ParentId == parentId);
        }
        
        //Verileri Seçme
        var categories = await categoriesQuery
            .Select(c => new Categories
            {
                Id = c.Id,
                Name = c.Name,
                ParentId = c.ParentId
            })
            .ToListAsync();

        //Yanıt Döndürme
        return Ok(categories);
    }

}