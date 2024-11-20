using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using quizify.Data;
using quizify.Helpers;
using quizify.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace quizify.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly QuizifyDbContext _context;
        private readonly JwtSettings _jwtSettings;

        public AuthController(QuizifyDbContext context, JwtSettings jwtSettings)
        {
            _context = context;
            _jwtSettings = jwtSettings;
        }

        // Kullanıcı giriş işlemi
        [HttpPost("login")]
        public IActionResult Login([FromBody] Login loginUser)
        {
            // Kullanıcıyı veritabanında bul
            var user = _context.users.SingleOrDefault(u =>
                u.username == loginUser.username && u.password == loginUser.password);

            if (user == null)
                return Unauthorized(new { message = "Invalid username or password." });

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
                    user.id
                }
            });
        }

       
    }
}
