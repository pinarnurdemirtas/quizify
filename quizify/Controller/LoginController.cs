using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using quizify.Data;
using quizify.Helpers;
using quizify.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net; // BCrypt kütüphanesi için ekleme

namespace quizify.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly QuizifyDbContext _context;
        private readonly JwtSettings _jwtSettings;

        public LoginController(QuizifyDbContext context, JwtSettings jwtSettings)
        {
            _context = context;
            _jwtSettings = jwtSettings;
        }

        // Kullanıcı giriş işlemi
        [HttpPost("login")]
        public IActionResult Login([FromBody] Login loginUser)
        {
            // Kullanıcıyı veritabanında bul
            var user = _context.users.SingleOrDefault(u => u.username == loginUser.username);

            if (user == null || !BCrypt.Net.BCrypt.Verify(loginUser.password, user.password))
            {
                return Unauthorized(new { message = "Invalid username or password." });
            }

            // JWT oluşturma
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSettings.Key);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, user.username),
                    new Claim(ClaimTypes.Email, user.email)
                }),
                Expires = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiryInMinutes),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            // Token döndürme
            return Ok(new
            {
                Token = tokenHandler.WriteToken(token),
                User = new
                {
                    user.username,
                    user.name,
                    user.surname,
                    user.email,
                    user.id,
                    phone = user.phone ?? "Not provided", // NULL kontrolü ekledik
                    user.gender,
                    user.department,
                    user.img
                }
            });
        }
    }
}
