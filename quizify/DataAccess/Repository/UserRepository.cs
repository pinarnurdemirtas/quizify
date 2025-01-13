using Microsoft.EntityFrameworkCore;
using quizify.Models;


namespace quizify.Data
{

    public class UserRepository : IUserRepository
    {
        private readonly QuizifyDbContext _context;

        public UserRepository(QuizifyDbContext context)
        {
            _context = context;
        }

        public async Task<User> GetUserByUsernameAsync(string username)
        {
            return await _context.users.SingleOrDefaultAsync(u => u.Username == username);
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _context.users.SingleOrDefaultAsync(u => u.Id == id);
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
        
        public async Task<bool> UpdateUserAsync(User user)
        {
            var existingUser = await GetUserByIdAsync(user.Id);
            if (existingUser == null) return false;

            existingUser.Username = user.Username;
            existingUser.Email = user.Email;
            existingUser.Gender = user.Gender; 
            existingUser.Name = user.Name;
            existingUser.Surname = user.Surname;
            existingUser.Document = " ";
            existingUser.Phone = user.Phone;
            existingUser.Department = user.Department;


            _context.users.Update(existingUser);
            return await SaveChangesAsync();
        }


        public async Task<bool> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}