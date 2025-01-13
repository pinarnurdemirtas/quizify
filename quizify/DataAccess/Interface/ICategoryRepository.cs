namespace quizify.Data;

public interface ICategoryRepository
{
    Task<List<Categories>> GetCategoriesAsync(int? parentId = null);
}