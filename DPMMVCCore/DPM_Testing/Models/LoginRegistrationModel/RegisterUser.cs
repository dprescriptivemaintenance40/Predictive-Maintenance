using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace DPM_Testing.Models
{
    public class RegisterUser: IdentityUser
    {
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Company { get; set; }
        [NotMapped]
        public string ImageUrl { get; set; }
        public int UserType { get; set; }

    }
}
