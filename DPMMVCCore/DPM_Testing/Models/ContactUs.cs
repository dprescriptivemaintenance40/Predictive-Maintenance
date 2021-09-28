using System.ComponentModel.DataAnnotations;

namespace DPM_Testing.Models
{
    public class ContactUs
    {
        [Key]
        public int ContactUsId { get; set; }
        public string Comment { get; set; }
        public string Email { get; set; }
        public string To { get; set; }       
        public string Subject { get; set; }
    }
}
