﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DPM_Testing.Models
{
    public class ContactUs
    {
        [Key]
        public int ContactUsId { get; set; }
        public string Email { get; set; }
        public string To = "aminsohailmanna324@gmail.com";
       
        public string Subject { get; set; }
        public string Comment { get;}
      //  public bool IsBodyHtml { get; set;}
    }
}
