namespace quizify.Models
{
    public class Question
    {
        public int Id { get; set; }  // 'id' küçük harf
        public string Question_type { get; set; }  // 'questions_type' küçük harf
        public string Question_text { get; set; }  // 'questions_text' küçük harf
        public int Category_id { get; set; }  // 'category_id' küçük harf
    }
}