using Microsoft.AspNetCore.Mvc;
using MimeKit;
using MailKit.Net.Smtp; // SmtpClient için
using quizify.Models;
using quizify.Data;


namespace quizify.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestQuestionsController : ControllerBase
    {
        private readonly ITestQuestionRepository _testQuestionRepository;

        public TestQuestionsController(ITestQuestionRepository testQuestionRepository)
        {
            _testQuestionRepository = testQuestionRepository;
        }

        [HttpGet("category/{category_id}")]
        public async Task<ActionResult<IEnumerable<TestQuestion>>> GetTestsByCategory(int category_id)
        {
            var tests = await _testQuestionRepository.GetTestsByCategoryAsync(category_id);
            if (tests == null || !tests.Any())
            {
                return NotFound(new { message = "No tests found for this category." });
            }
            return Ok(tests);
        }

        [HttpPost]
        public async Task<ActionResult> PostTestQuestion([FromBody] TestQuestion testQuestion)
        {
            testQuestion.IsApproved = false;
            var addedTest = await _testQuestionRepository.AddTestQuestionAsync(testQuestion);

            string verificationUrl = $"http://localhost:5000/api/testquestions/approve?id={addedTest.Id}";

            try
            {
                MimeMessage mimeMessage = new MimeMessage();
                mimeMessage.From.Add(new MailboxAddress("QUIZIFY", "pncpnc979@gmail.com"));
                mimeMessage.To.Add(new MailboxAddress("Pınar Nur", "pinardmrts18@gmail.com"));
                mimeMessage.Subject = "Yeni Test Sorusu Eklendi - Doğrulama Gerekiyor";
                mimeMessage.Body = new TextPart("plain")
                {
                    Text = $"Yeni bir test sorusu eklendi\nSoru: {addedTest.Question_text}" +
                           $"\nOp1: {addedTest.Op1}" +
                           $"\nOp2: {addedTest.Op2}" +
                           $"\nOp3: {addedTest.Op3}" +
                           $"\nOp4: {addedTest.Op4}" +
                           $"\nOp5: {addedTest.Op5}" +
                           $"\nCevap: {addedTest.Answer}\n\nLütfen doğrulama bağlantısına tıklayın:\n{verificationUrl}"
                };

                using (SmtpClient client = new SmtpClient())
                {
                    client.Connect("smtp.gmail.com", 587, false);
                    client.Authenticate("pncpnc979@gmail.com", "vcrw lerx bgeb upgp"); // Burada şifreyi değiştirdiğinizden emin olun
                    client.Send(mimeMessage);
                    client.Disconnect(true);
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"E-posta gönderilemedi: {ex.Message}");
            }

            return Ok("Test sorusu başarıyla eklendi ve doğrulama için e-posta gönderildi.");
        }

        [HttpGet("approve")]
        public async Task<ActionResult> ApproveTestQuestion([FromQuery] int id)
        {
            var isApproved = await _testQuestionRepository.ApproveTestQuestionAsync(id);

            if (!isApproved)
            {
                return NotFound("Test sorusu bulunamadı veya zaten onaylanmış.");
            }

            return Ok("Test sorusu başarıyla onaylandı.");
        }
    }

}