namespace quizify.Models
{
    public class TestQuestion
    {
        public int Id { get; set; }  
        public int Category_id { get; set; }  
        public string Question_text { get; set; }  
        public string Op1 { get; set; }  
        public string Op2 { get; set; }  
        public string Op3 { get; set; } 
        public string Op4 { get; set; }  
        public string Op5 { get; set; } 
        public string Answer { get; set; }  
        
    }
}