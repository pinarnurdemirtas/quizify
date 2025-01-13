namespace quizify.Models
{
    public class Question
    {
        public int Id { get; set; }  
        public string Question_type { get; set; }  
        public string Question_text { get; set; }  
        public string Answer { get; set; }  
        public int Category_id { get; set; }  
        public bool IsApproved { get; set; } 

        
        
    }
}