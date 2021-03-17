using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DPM.Models.Prescriptive
{
    public class PrescriptiveLookupMasterModel
    {
        [Key]
        public int PrescriptiveLookupMasterId { get; set; }
        //public string TagNumber { get; set; }
        public string MachineType { get; set; }
        public string EquipmentType { get; set; }
        public string Function{ get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
    }
}
