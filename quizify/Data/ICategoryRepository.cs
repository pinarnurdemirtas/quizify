namespace quizify.Data;

// Interface for CategoryRepository
public interface ICategoryRepository
{
    Task<List<Categories>> GetCategoriesAsync(int? parentId = null);
}