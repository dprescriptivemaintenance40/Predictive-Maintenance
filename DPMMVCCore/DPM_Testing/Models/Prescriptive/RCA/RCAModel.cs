using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DPM.Models.Prescriptive.RCA
{
    public class RCAModel
    {
        [Key]
        public int RCAID { get; set; }
        public string UserId { get; set; }
        public string TagNumber { get; set; }
        public string RCATree { get; set; }
        public string RCACode { get; set; }
        public string RCALabel { get; set; }
        public string RCAEquipment { get; set; }
        public string RCAFailureMode { get; set; }
    }
}
