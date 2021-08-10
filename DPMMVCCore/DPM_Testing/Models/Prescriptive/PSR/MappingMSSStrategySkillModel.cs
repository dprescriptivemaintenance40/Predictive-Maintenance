using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DPM.Models.Prescriptive
{
    public class MappingMSSStrategySkillModel
    {
        [Key]
        public int MapId { get; set; }
        public int MSSStrategyModelId { get; set; }
        public int PSRClientContractorId { get; set; }
        public string Employee { get; set; }
        public int CentrifugalPumpMssId { get; set; }
        public int CFPPrescriptiveId { get; set; }
        public int CPPFMId { get; set; }

    }
}
