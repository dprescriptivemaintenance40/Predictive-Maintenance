using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DPM.Models.Prescriptive
{
    public class UserProductionModel
    {
        [Key]
        public int UserProductionId { get; set; }
        public string UserId { get; set; }
        public string Item { get; set; }
        public double TotalHours { get; set; }
        public double ProductionLossPercentage { get; set; }
        public double TotalCost { get; set; }
    }
}
