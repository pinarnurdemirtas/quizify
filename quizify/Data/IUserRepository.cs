using quizify.Models;

namespace quizify.Data;

public interface IUserRepository
{
    Task<User> GetUserByUsernameAsync(string username);
    Task<User> GetUserByIdAsync(int id);
    Task<bool> AddUserAsync(User user);
    Task<bool> RemoveUserAsync(int id);
    Task<bool> UpdateUserAsync(User user);

    Task<bool> SaveChangesAsync();
}