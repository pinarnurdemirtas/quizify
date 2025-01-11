using Microsoft.EntityFrameworkCore;
using quizify.Models;

namespace quizify.Data;

public class QuizifyDbContext : DbContext
{
    public QuizifyDbContext(DbContextOptions<QuizifyDbContext> options) : base(options){}
    
    public DbSet<User> users { get; set; }
    public DbSet<Categories> categories { get; set; }
    public DbSet<Question> questions { get; set; }
    public DbSet<TestQuestion> testquestions { get; set; }
    public DbSet<ExamQuestions> exam_questions { get; set; }
    public DbSet<Exam> exams { get; set; }
    
}
