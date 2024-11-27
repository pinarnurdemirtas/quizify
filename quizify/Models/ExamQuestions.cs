namespace quizify.Models
{
    public class ExamQuestions
    {
        public int id { get; set; }  
        public int exam_id { get; set; }
        public int question_id { get; set; }
        public DateTime created_at { get; set; }
    }
}