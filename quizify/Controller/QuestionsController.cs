using Microsoft.AspNetCore.Mvc;
using MimeKit;
using MailKit.Net.Smtp; // SmtpClient için
using quizify.Models;
using quizify.Data;

namespace quizify.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionsController : ControllerBase
    {
        private readonly IQuestionRepository _questionRepository;

        public QuestionsController(IQuestionRepository questionRepository)
        {
            _questionRepository = questionRepository;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<Question>>> GetQuestionsByCategory([FromQuery] int category)
        {
            var questions = await _questionRepository.GetQuestionsByCategoryAsync(category);

            if (questions == null || !questions.Any())
            {
                return NotFound("No questions found for this category.");
            }

            return Ok(questions);
        }


        [HttpPost]
        public async Task<ActionResult> PostQuestion(Question question)
        {
            question.IsApproved = false;

            var addedQuestion = await _questionRepository.AddQuestionAsync(question);

            string verificationUrl = $"http://localhost:5000/api/questions/approve?id={addedQuestion.Id}";

            try
            {
                MimeMessage mimeMessage = new MimeMessage();
                mimeMessage.From.Add(new MailboxAddress("QUIZIFY", "pncpnc979@gmail.com"));
                mimeMessage.To.Add(new MailboxAddress("Pınar Nur", "pinardmrts18@gmail.com"));
                mimeMessage.Subject = "Yeni Soru Eklendi - Doğrulama Gerekiyor";
                mimeMessage.Body = new TextPart("plain")
                {
                    Text = $"Yeni bir soru eklendi\nSoru: {addedQuestion.Question_text}\nCevap:{addedQuestion.Answer}\n\nLütfen doğrulama bağlantısına tıklayın:\n{verificationUrl}"
                };

                using (SmtpClient client = new SmtpClient())
                {
                    client.Connect("smtp.gmail.com", 587, false);
                    client.Authenticate("pncpnc979@gmail.com", "vcrw lerx bgeb upgp");
                    client.Send(mimeMessage);
                    client.Disconnect(true);
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"E-posta gönderilemedi: {ex.Message}");
            }

            return Ok("Soru başarıyla eklendi ve doğrulama için e-posta gönderildi.");
        }


        [HttpGet("approve")]
        public async Task<ActionResult> ApproveQuestion([FromQuery] int id)
        {
            var isApproved = await _questionRepository.ApproveQuestionAsync(id);

            if (!isApproved)
            {
                return NotFound("Soru bulunamadı veya zaten onaylanmış.");
            }

            return Ok("Soru başarıyla onaylandı.");
        }
    }
}
