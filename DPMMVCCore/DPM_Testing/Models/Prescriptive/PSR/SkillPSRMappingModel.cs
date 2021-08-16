using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DPM.Models.Prescriptive.PSR
{
    public class SkillPSRMappingModel
    {
        [Key]
        public int PSRId { get; set; }
        public string UserId { get; set; }
        public string MaintenanceTask { get; set; }
        public int MaintenanceTaskId { get; set; }
        public string Strategy { get; set; }
        public int Craft { get; set; }
        public double HourlyRate { get; set; }
        public double TaskDuration { get; set; }
        public double MaterialCost { get; set; }
        public double POC { get; set; }
    }
}
