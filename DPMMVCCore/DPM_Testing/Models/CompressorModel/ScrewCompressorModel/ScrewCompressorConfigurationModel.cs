﻿using System.ComponentModel.DataAnnotations;

namespace DPM_Testing.Models
{
    public class ScrewCompressorConfigurationModel
    {
        [Key]
        public int AddRuleId { get; set; }
        public string Columns { get; set; }
        public float Alarm { get; set; }
        public float Trigger { get; set; }
        public string Condition { get; set; }
    }
}
