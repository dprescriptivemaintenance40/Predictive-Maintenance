using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace DPM_Testing.Models
{
    public class AddRuleModel
    {
        [Key]
        public int AddRuleId { get; set; }

       
        public string Columns { get; set; }

        public float Alarm { get; set; }

        public float Trigger { get; set; }

        
        public string Condition { get; set; }
    }
}
