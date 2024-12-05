using Microsoft.EntityFrameworkCore;
using quizify.Models;


namespace quizify.Data
{
    public interface IUserRepository
    {
        Task<User> GetUserByUsernameAsync(string username);
        Task<User> GetUserByIdAsync(int id);
        Task<bool> AddUserAsync(User user);
        Task<bool> RemoveUserAsync(int id);
        Task<bool> SaveChangesAsync();
    }

    public class UserRepository : IUserRepository
    {
        private readonly QuizifyDbContext _context;

        public UserRepository(QuizifyDbContext context)
        {
            _context = context;
        }

        public async Task<User> GetUserByUsernameAsync(string username)
        {
            return await _context.users.SingleOrDefaultAsync(u => u.username == username);
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _context.users.SingleOrDefaultAsync(u => u.id == id);
        }

        public async Task<bool> AddUserAsync(User user)
        {
            await _context.users.AddAsync(user);
            return await SaveChangesAsync();
        }

        public async Task<bool> RemoveUserAsync(int id)
        {
            var user = await GetUserByIdAsync(id);
            if (user == null) return false;

            _context.users.Remove(user);
            return await SaveChangesAsync();
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}