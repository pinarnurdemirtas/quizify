namespace quizify.Models
{
    public class ExamRequest
    {
        public Exam exam { get; set; }
        public List<ExamQuestions> examQuestions { get; set; }
    }
}