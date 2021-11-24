using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DPM.Models.Prescriptive
{
    public class XFMEAPrescriptiveModel
    {
        [Key]
        public int CFPPrescriptiveId { get; set; }
        public string UserId { get; set; }
        public string MachineType { get; set; }
        public string EquipmentType { get; set; }
        public string TagNumber { get; set; }
        public string FunctionFluidType { get; set; }
        public string FunctionFailure { get; set; }
        public DateTime Date { get; set; }
        public string FailureModeWithLSETree { get; set; }
        public string FMWithConsequenceTree { get; set; }
        public string Type { get; set; }
        public List<XFMEAPrescriptiveFailureModes> FMEAPrescriptiveFailureModes { get; set; }

    }

    public class XFMEAPrescriptiveFailureModes
    {
        [Key]
        public int CPPFMId { get; set; }
        public int CFPPrescriptiveId { get; set; }
        public string FunctionMode { get; set; }
        public string LocalEffect { get; set; }
        public string SystemEffect { get; set; }
        public string Consequence { get; set; }
        public string AttachmentDBPath { get; set; }
        public string AttachmentFullPath { get; set; }
        public string Remark { get; set; }

        public XFMEAPrescriptiveModel XFMEAPrescriptiveModel { get; set; }
    }
}
