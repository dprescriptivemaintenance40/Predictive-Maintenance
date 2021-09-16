using System.ComponentModel.DataAnnotations;
namespace DPM_Testing.Models
{
    public class RegistrationModel : BaseModel
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
        public int UserType { get; set; } // 1 => Company Admin & 0 => Trial
        public string ImageUrl { get; set; }
        public int DesignationId { get; set; } // 0 => Admin & other than 0 is DesignationAccessModel PK.
        public int Enable { get; set; } // 0 => Disable & 1 =>Enable
    }
}
