using Microsoft.EntityFrameworkCore;
using quizify.Models;

namespace quizify.Data
{
    public class QuizifyDbContext : DbContext
    {
        public QuizifyDbContext(DbContextOptions<QuizifyDbContext> options) : base(options)
        {
        }

        // Veritabanı tabloları
        public DbSet<Kisi> users { get; set; }
        
    }
}