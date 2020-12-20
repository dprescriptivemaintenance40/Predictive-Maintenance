using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DPM_Testing.Models
{
    public class RegisterUser: IdentityUser
    {
        public string FullName { get; set; }
        public string Company { get; set; }
    }
}
