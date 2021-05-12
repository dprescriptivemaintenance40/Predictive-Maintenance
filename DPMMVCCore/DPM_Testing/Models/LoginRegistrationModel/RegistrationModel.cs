using System.ComponentModel.DataAnnotations;

namespace DPM_Testing.Models
{
    public class RegistrationModel
    {
        [Key]
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Company { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Password { get; set; }        
        public int UserType { get; set; }
        public string ImageUrl { get; set; }

    }
}
