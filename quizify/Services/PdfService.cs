using PdfSharpCore.Pdf;
using PdfSharpCore.Drawing;
using quizify.Models;
using System.IO;

namespace quizify.Services
{ 
    public class PdfService
    {
        private readonly IWebHostEnvironment _webHostEnvironment;

        // Konstruktor ile IWebHostEnvironment servisinin dependency injection ile alınması
        public PdfService(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }

        public string GeneratePdf(Exam exam, List<ExamQuestions> examQuestions)
        {
            // _webHostEnvironment.WebRootPath kontrolü yapalım
            if (string.IsNullOrEmpty(_webHostEnvironment.WebRootPath))
            {
                throw new InvalidOperationException("WebRootPath is not available.");
            }

            // PDF dosyasını kaydetmek için wwwroot/pdf dizininin yolu
            var pdfFolderPath = Path.Combine(_webHostEnvironment.WebRootPath, "pdfs");

            // Eğer pdfs klasörü yoksa, bu klasörü oluştur
            if (!Directory.Exists(pdfFolderPath))
            {
                Directory.CreateDirectory(pdfFolderPath);
            }

            // Exam.id kontrolü yapalım
            if (exam == null || exam.id <= 0)
            {
                throw new ArgumentException("Exam ID is invalid.");
            }

            // PDF dosyasını kaydetmek için tam dosya yolu
            string filePath = Path.Combine(pdfFolderPath, $"Exam_{exam.id}.pdf");

            // PDF oluşturma işlemi burada yapılır
            PdfDocument pdfDocument = new PdfDocument();
            // PDF içeriklerini buraya ekleyebilirsiniz
            pdfDocument.Save(filePath);  // PDF dosyasını belirtilen yolda kaydedin

            // Kaydedilen PDF dosyasının yolunu döndürün
            return filePath;
        }
    }
}
