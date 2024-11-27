namespace quizify.Models
{
    public class Exam
    {
        public int Id { get; set; }  
        public int User_id { get; set; }
        public string Name { get; set; }
        public string Pdf_url { get; set; }
        public DateTime Created_at { get; set; }
    }
}