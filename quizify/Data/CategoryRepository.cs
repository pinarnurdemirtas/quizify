using Microsoft.EntityFrameworkCore;


namespace quizify.Data
{
    // Interface for CategoryRepository
    public interface ICategoryRepository
    {
        Task<List<Categories>> GetCategoriesAsync(int? parentId = null);
    }

    // Implementation of CategoryRepository
    public class CategoryRepository : ICategoryRepository
    {
        private readonly QuizifyDbContext _context;

        public CategoryRepository(QuizifyDbContext context)
        {
            _context = context;
        }

        public async Task<List<Categories>> GetCategoriesAsync(int? parentId = null)
        {
            // Build the query to retrieve categories
            IQueryable<Categories> categoriesQuery = _context.categories;

            // Apply the filter if parentId is provided
            if (parentId.HasValue)
            {
                categoriesQuery = categoriesQuery.Where(c => c.ParentId == parentId);
            }

            // Execute the query and return the result
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