namespace quizify.Models
{
    public class Question
    {
        public int id { get; set; }  // 'id' küçük harf
        public string question_type { get; set; }  // 'questions_type' küçük harf
        public string question_text { get; set; }  // 'questions_text' küçük harf
        public int category_id { get; set; }  // 'category_id' küçük harf
    }
}