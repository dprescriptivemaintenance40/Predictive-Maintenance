using System;
using System.ComponentModel.DataAnnotations;

namespace DPM.Models.Prescriptive
{
    public class MapStrategySkillModel
    {
        [Key]
        public int MapId { get; set; }
        public string UserId { get; set; }
        public string EmployeeCode { get; set; }
        public string Craft { get; set; }
        public string Strategy { get; set; }
        public int SkillPercent { get; set; }

    }
}
