namespace quizify.Models
{
    public class Kisi
    {
        public int id { get; set; }
        public string username { get; set; }
        public string password { get; set; }
        public string name { get; set; }
        public string surname { get; set; }
        public string email { get; set; }
        public string gender { get; set; }
        public string department { get; set; }
        public string img { get; set; }
        public string phone { get; set; }  // Yeni telefon numarası alanı
    }
}