using quizify.Data;
using quizify.Models;
using Microsoft.AspNetCore.Mvc;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;


namespace quizify.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegisterController : ControllerBase
    {
        private readonly QuizifyDbContext _context;

        //TEST
        public RegisterController(QuizifyDbContext context)
        {
            _context = context;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] Kisi kisi)
        {
            if (_context.Set<Kisi>().Any(k => k.username == kisi.username))
            {
                return BadRequest("Kullanıcı adı zaten kullanılıyor.");
            }
            if (_context.Set<Kisi>().Any(k => k.email == kisi.email))
            {
                return BadRequest("Email zaten kullanılıyor.");
            }
            // Şifreyi hash'le
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(kisi.password);
            kisi.password = passwordHash;
            

            // Kullanıcıyı veritabanına ekle
            _context.Set<Kisi>().Add(kisi);
            await _context.SaveChangesAsync();

            return Ok("Kullanıcı başarıyla kaydedildi.");
        }
    
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            // Kullanıcıyı ID ile bul
            var kisi = await _context.Set<Kisi>().FindAsync(id);

            if (kisi == null)
            {
                return NotFound("Kullanıcı bulunamadı.");
            }

            // Kullanıcıyı sil
            _context.Set<Kisi>().Remove(kisi);
            await _context.SaveChangesAsync();

            return Ok("Kullanıcı başarıyla silindi.");
        }
    
    
    
    }
}

