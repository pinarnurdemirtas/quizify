public class Categories
{
    public int Id { get; set; }  
    public string Name { get; set; }
    public int? ParentId { get; set; } 
    public List<Categories> SubCategories { get; set; } = new List<Categories>();
}