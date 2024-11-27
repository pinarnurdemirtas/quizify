namespace quizify.Models
{
    public class Exam
    {
        public int id { get; set; }  
        public int user_id { get; set; }
        public string name { get; set; }
        public string pdf_url { get; set; }
        public DateTime created_at { get; set; }
    }
}