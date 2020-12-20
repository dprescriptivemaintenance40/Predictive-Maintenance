using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DPM_Testing.Models
{
    public class ClassificationMaster
    {
        [Key]
        public int ClassificationMasterId { get; set; }
        public int ClassificationId { get; set; }
        public string Classifications { get; set; }
    }
}
