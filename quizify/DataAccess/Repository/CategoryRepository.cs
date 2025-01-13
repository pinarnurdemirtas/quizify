using Microsoft.EntityFrameworkCore;


namespace quizify.Data
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly QuizifyDbContext _context;

        public CategoryRepository(QuizifyDbContext context)
        {
            _context = context;
        }

        public async Task<List<Categories>> GetCategoriesAsync(int? parentId = null)
        {
            IQueryable<Categories> categoriesQuery = _context.categories;
            if (parentId.HasValue)
            {
                categoriesQuery = categoriesQuery.Where(c => c.ParentId == parentId);
            }
            var categories = await categoriesQuery
                .Select(c => new Categories
                {
                    Id = c.Id,
                    Name = c.Name,
                    ParentId = c.ParentId
                })
                .ToListAsync();
            return categories;
        }
    }
}