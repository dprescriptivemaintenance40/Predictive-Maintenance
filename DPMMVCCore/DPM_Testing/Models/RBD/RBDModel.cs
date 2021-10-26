using System;
using System.ComponentModel.DataAnnotations;

namespace DPM.Models
{
    public class RBDModel
    {
        [Key]
        public int RBDId { get; set; }
        public string UserId { get; set; }
        public string TagNumber { get; set; }
        public string Label { get; set; }
        public DateTime Date { get; set; }
        public string Tree { get; set; }
    }
}
