using System.Security.Claims;
using MailKit.Net.Smtp;
using quizify.Models;
using quizify.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MimeKit;
using Microsoft.Extensions.Logging;

namespace quizify.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly Security _security;
        private readonly ILogger<UsersController> _logger;

        public UsersController(IUserRepository userRepository, Security security, ILogger<UsersController> logger)
        {
            _userRepository = userRepository;
            _security = security;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Login loginUser)
        {
            // Kullanıcı adı kontrolü
            var user = await _userRepository.GetUserByUsernameAsync(loginUser.Username);

            if (user == null || !BCrypt.Net.BCrypt.Verify(loginUser.Password, user.Password))
            {
                return Unauthorized(new { message = "Geçersiz kullanıcı adı veya şifre." });
            }

            // Kullanıcı doğrulama durumu kontrolü
            if (!user.IsVerified)
            {
                return Unauthorized(new { message = "Hesabınız doğrulanmamış." });
            }

            // Token oluşturma
            var token = _security.CreateToken(user);

            // Giriş başarılı
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
                    user.Document,
                    user.Department,
                    user.Img,
                    user.Id
                }
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User newUser)
        {
            var existingUser = await _userRepository.GetUserByUsernameAsync(newUser.Username);
            if (existingUser != null)
            {
                return BadRequest("Kullanıcı adı zaten kullanılıyor.");
            }

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(newUser.Password);
            newUser.Password = hashedPassword;
            newUser.IsVerified = false;

            var result = await _userRepository.AddUserAsync(newUser);
            if (!result)
            {
                _logger.LogError("Kullanıcı kaydedilirken bir hata oluştu.");
                return StatusCode(500, "Kullanıcı kaydedilirken bir hata oluştu.");
            }

            var userDocument = $"Ad Soyad: {newUser.Name} {newUser.Surname}\n" +
                               $"Belge: {newUser.Document}\n";

            var verificationUrl = $"http://localhost:5000/api/users/verify/{newUser.Username}";
            var rejectUrl = $"http://localhost:5000/api/users/reject/{newUser.Username}";

            await SendConfirmationEmail(newUser.Email, verificationUrl, userDocument, rejectUrl);

            return Ok("Kullanıcı başarıyla kaydedildi. Doğrulama e-postası gönderildi.");
        }

        [HttpGet("verify/{username}")]
        public async Task<IActionResult> VerifyUser(string username)
        {
            var user = await _userRepository.GetUserByUsernameAsync(username);
            if (user == null)
            {
                return BadRequest("Kullanıcı bulunamadı.");
            }

            if (user.IsVerified)
            {
                return BadRequest("Kullanıcı zaten doğrulandı.");
            }

            user.IsVerified = true;
            var result = await _userRepository.UpdateUserAsync(user);
            if (!result)
            {
                _logger.LogError("Doğrulama işlemi sırasında bir hata oluştu.");
                return StatusCode(500, "Doğrulama işlemi sırasında bir hata oluştu.");
            }

            await SendAccountVerifiedEmail(user.Email);

            return Ok("Hesap Doğrulama Başarılı.");
        }

        [HttpGet("reject/{username}")]
        public async Task<IActionResult> RejectUser(string username)
        {
            var user = await _userRepository.GetUserByUsernameAsync(username);
            if (user == null)
            {
                return BadRequest("Kullanıcı bulunamadı.");
            }

            // Kullanıcıyı silme işlemi
            var result = await _userRepository.RemoveUserAsync(user.Id);
            if (!result)
            {
                return StatusCode(500, "Kullanıcı reddedilirken bir hata oluştu.");
            }

            return Ok("Kullanıcı başarıyla reddedildi ve silindi.");
        }

        private async Task SendConfirmationEmail(string userEmail, string verificationUrl, string userDocument, string rejectUrl)
        {
            var mimeMessage = new MimeMessage();
            mimeMessage.From.Add(new MailboxAddress("QUIZIFY", "pncpnc979@gmail.com"));
            mimeMessage.To.Add(new MailboxAddress("Pınar Nur", "pinardmrts18@gmail.com"));
            mimeMessage.Subject = "Hesap Doğrulaması Gerekiyor";
            mimeMessage.Body = new TextPart("plain")
            {
                Text = $"Hesabı doğrulamak için aşağıdaki bağlantıya tıklayın:\n\n{verificationUrl}\n\nAyrıca, hesabı reddetmek için: {rejectUrl}\n\n{userDocument}"
            };

            using (var client = new SmtpClient())
            {
                await client.ConnectAsync("smtp.gmail.com", 587, false);
                await client.AuthenticateAsync("pncpnc979@gmail.com", "vcrw lerx bgeb upgp");
                await client.SendAsync(mimeMessage);
                await client.DisconnectAsync(true);
            }
        }

        private async Task SendAccountVerifiedEmail(string userEmail)
        {
            var mimeMessage = new MimeMessage();
            mimeMessage.From.Add(new MailboxAddress("QUIZIFY", "pncpnc979@gmail.com"));
            mimeMessage.To.Add(new MailboxAddress("Kullanıcı", userEmail));
            mimeMessage.Subject = "Hesabınız Doğrulandı";
            mimeMessage.Body = new TextPart("plain")
            {
                Text = "Hesabınız başarıyla doğrulandı. Artık giriş yapabilirsiniz."
            };

            using (var client = new SmtpClient())
            {
                await client.ConnectAsync("smtp.gmail.com", 587, false);
                await client.AuthenticateAsync("pncpnc979@gmail.com", "vcrw lerx bgeb upgp");
                await client.SendAsync(mimeMessage);
                await client.DisconnectAsync(true);
            }
        }

        [Authorize]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _userRepository.RemoveUserAsync(id);
            if (!result)
            {
                return NotFound("Kullanıcı bulunamadı.");
            }

            return Ok("Kullanıcı başarıyla silindi.");
        }

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
