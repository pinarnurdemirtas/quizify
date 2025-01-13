namespace quizify.Models
{
    public class ExamQuestions
    {
        public int Id { get; set; }  
        public int ExamId { get; set; }
        public int? QuestionId { get; set; }
        public int? TestQuestionId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}