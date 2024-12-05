using System.Security.Claims;
using quizify.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace quizify.Controller;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly QuizifyDbContext _context;
    private readonly Security _security; // No need for JwtSettings anymore

    public UsersController(QuizifyDbContext context, Security security)
    {
        _context = context;
        _security = security; // Initialize Security class
    }

    // Kullanıcı giriş işlemi
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] Login loginUser)
    {
        // Kullanıcıyı veritabanında buluyoruz
        var user = await _context.users.SingleOrDefaultAsync(u =>
            u.username == loginUser.username);

        if (user == null)
            return Unauthorized(new { message = "Invalid username or password." });

        // Şifreyi doğrulama
        if (!BCrypt.Net.BCrypt.Verify(loginUser.password, user.password))
            return Unauthorized(new { message = "Invalid username or password." });

        // JWT oluşturma, Security sınıfındaki CreateToken metodunu kullanarak
        var token = _security.CreateToken(user); // No need to pass _jwtSettings

        return Ok(new
        {
            Token = token,
            User = new
            {
                user.username,
                user.surname,
                user.id
            }
        });
    }
    
    
    
    // Kullanıcı kaydetme (Register)
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] Models.User users)
    {
        // Kullanıcı adı kontrolü
        if (_context.Set<Models.User>().Any(k => k.username == users.username))
        {
            return BadRequest("Kullanıcı adı zaten kullanılıyor.");
        }

        // Şifreyi hash'le
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(users.password);
        users.password = passwordHash;
        

        // Kullanıcıyı veritabanına ekle
        _context.Set<Models.User>().Add(users);
        await _context.SaveChangesAsync();

        return Ok("Kullanıcı başarıyla kaydedildi.");
    }

    // Kullanıcı silme (Delete)
    [HttpDelete("delete/{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Kullanıcı ID'sini al
        var idStr = id.ToString(); // id'yi string'e çevir

        // Konsola yazdırarak her iki değeri kontrol edelim
        Console.WriteLine($"userId: {userId}");
        Console.WriteLine($"idStr: {idStr}");
    

        // Ekstra yetki kontrolü
        if (userId != id.ToString()) 
        {
            return Unauthorized("Bu işlemi yapmaya yetkiniz yok.");
        }

        var kisi = await _context.Set<Models.User>().FindAsync(id);

        if (kisi == null)
        {
            return NotFound("Kullanıcı bulunamadı.");
        }

        _context.Set<Models.User>().Remove(kisi);
        await _context.SaveChangesAsync();

        return Ok("Kullanıcı başarıyla silindi.");
    }
}