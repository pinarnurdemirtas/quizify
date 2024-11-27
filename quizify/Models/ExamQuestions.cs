namespace quizify.Models
{
    public class ExamQuestions
    {
        public int Id { get; set; }  
        public int Exam_id { get; set; }
        public int Question_id { get; set; }
        public DateTime Created_at { get; set; }
    }
}