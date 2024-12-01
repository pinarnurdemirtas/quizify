using quizify.Data;
using quizify.Models;
using Microsoft.AspNetCore.Mvc;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
namespace quizify.Controller;


[ApiController]
[Route("api/[controller]")]
public class RegisterController : ControllerBase
{
    private readonly QuizifyDbContext _context;
    public RegisterController(QuizifyDbContext context)
    {
        _context = context;
    }

    [HttpPost("Register")]
    public async Task<IActionResult> Register([FromBody] User user)
    {
        // Kullanıcı adı ve email kontrolleri
        if (_context.users.Any(k => k.username == user.username))
        {
            return BadRequest("Kullanıcı adı zaten kullanılıyor.");
        }
        if (_context.users.Any(k => k.email == user.email))
        {
            return BadRequest("Email zaten kullanılıyor.");
        }

        // Şifreyi hash'le
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(user.password);
        user.password = passwordHash;
        
        // Kullanıcıyı veritabanına ekle
        _context.users.Add(user);
        await _context.SaveChangesAsync();

        //Başarılı Yanıt
        return Ok("Kullanıcı başarıyla kaydedildi.");
    }


    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        // Kullanıcıyı ID ile bul
        var kisi = await _context.users.FindAsync(id);
        if (kisi == null)
        {
            return NotFound("Kullanıcı bulunamadı.");
        }

        // Kullanıcıyı sil
        _context.users.Remove(kisi);
        await _context.SaveChangesAsync();

        //Başarılı Yanıt
        return Ok("Kullanıcı başarıyla silindi.");
    }
}


