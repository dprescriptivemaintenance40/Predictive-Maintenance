using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DPM.Models.Prescriptive
{
    public class PrescriptiveModel
    {
        [Key]
        public int PrescriptiveId { get; set; }
        public string UserId { get; set; }
        public string MachineType { get; set; }
        public string EquipmentType { get; set; }
        public string TagNumber { get; set; }
        public string FunctionFluidType { get; set; }
        public string FunctionRatedHead { get; set; }
        public string FunctionPeriodType { get; set; }
        public string FunctionFailure { get; set; }
        public string FunctionMode { get; set; }
        public string LocalEffect { get; set; }
        public string SystemEffect { get; set; }
        public DateTime Date { get; set; }
        public string Consequence { get; set; }
    }
}
