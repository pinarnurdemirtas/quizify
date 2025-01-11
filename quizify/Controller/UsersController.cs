using System.Security.Claims;
using quizify.Models;
using quizify.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace quizify.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly Security _security;

        public UsersController(IUserRepository userRepository, Security security)
        {
            _userRepository = userRepository;
            _security = security;
        }

        // Kullanıcı giriş işlemi
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Login loginUser)
        {
            // Kullanıcıyı veritabanında buluyoruz
            var user = await _userRepository.GetUserByUsernameAsync(loginUser.Username);

            if (user == null)
                return Unauthorized(new { message = "Invalid username or password." });

            // Şifreyi doğrulama
            if (!BCrypt.Net.BCrypt.Verify(loginUser.Password, user.Password))
            {
                return Unauthorized(new { message = "Invalid username or password." });
            }

            // JWT oluşturma
            var token = _security.CreateToken(user);

            return Ok(new
            {
                Token = token,
                User = new
                {
                    user.Email,
                    user.Phone,
                    user.Username,
                    user.Name,
                    user.Surname,
                    user.Gender,
                    user.Department,
                    user.Img,
                    user.Id,
                    user.Password
                }
            });
        }

        // Kullanıcı kaydetme (Register)
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User newUser)
        {
            // Kullanıcı adı kontrolü
            var existingUser = await _userRepository.GetUserByUsernameAsync(newUser.Username);
            if (existingUser != null)
            {
                return BadRequest("Kullanıcı adı zaten kullanılıyor.");
            }

            // Şifreyi hash'le
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(newUser.Password);
    
            // Hash'lenmiş şifreyi kullanıcı objesine ata
            newUser.Password = hashedPassword;

            // Kullanıcıyı veritabanına ekle
            var result = await _userRepository.AddUserAsync(newUser);
            if (!result)
            {
                return StatusCode(500, "Kullanıcı kaydedilirken bir hata oluştu.");
            }

            return Ok("Kullanıcı başarıyla kaydedildi.");
        }


        // Kullanıcı silme (Delete)
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Kullanıcı ID'sini al

            // Ekstra yetki kontrolü
            if (userId != id.ToString())
            {
                return Unauthorized("Bu işlemi yapmaya yetkiniz yok.");
            }
    
            var result = await _userRepository.RemoveUserAsync(id);
            if (!result)
            {
                return NotFound("Kullanıcı bulunamadı.");
            }

            return Ok("Kullanıcı başarıyla silindi.");
        }
        
        
        // Kullanıcı bilgileri düzenleme (Update)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] User user)
        {
            if (id != user.Id)
            {
                return BadRequest("User ID mismatch.");
            }

            var result = await _userRepository.UpdateUserAsync(user);
            if (!result)
            {
                return NotFound($"User with ID {id} not found.");
            }

            return Ok("User updated successfully.");
        }
    }
}
