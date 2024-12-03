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
    
    [HttpPut("update/{id}")]
    public async Task<IActionResult> UpdateProfile(int id, [FromBody] User updatedUser)
    {
        // Kullanıcıyı ID ile bul
        var existingUser = await _context.users.FindAsync(id);
        if (existingUser == null)
        {
            return NotFound("Kullanıcı bulunamadı.");
        }

        // Kullanıcı bilgilerini güncelle
        if (!string.IsNullOrWhiteSpace(updatedUser.username))
        {
            if (_context.users.Any(u => u.username == updatedUser.username && u.id != id))
            {
                return BadRequest("Bu kullanıcı adı başka bir kullanıcı tarafından kullanılıyor.");
            }
            existingUser.username = updatedUser.username;
        }

        if (!string.IsNullOrWhiteSpace(updatedUser.email))
        {
            if (_context.users.Any(u => u.email == updatedUser.email && u.id != id))
            {
                return BadRequest("Bu email başka bir kullanıcı tarafından kullanılıyor.");
            }
            existingUser.email = updatedUser.email;
        }

       

        // Ad ve Soyad güncellemesi
        if (!string.IsNullOrWhiteSpace(updatedUser.name))
        {
            existingUser.name = updatedUser.name;
        }

        if (!string.IsNullOrWhiteSpace(updatedUser.surname))
        {
            existingUser.surname = updatedUser.surname;
        }

        // Veritabanını güncelle
        _context.users.Update(existingUser);
        await _context.SaveChangesAsync();

        return Ok("Profil bilgileri başarıyla güncellendi.");
    }

    
}


