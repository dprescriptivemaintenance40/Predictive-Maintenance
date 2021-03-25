using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DPM.Models.RecycleBinModel
{
    public class RecycleBinCentrifugalPumpPrescriptiveModel
    {
        [Key]
        public int RCPPMId { get; set; }
        public int CFPPrescriptiveId { get; set; }
        public string UserId { get; set; }
        public string MachineType { get; set; }
        public string EquipmentType { get; set; }
        public string TagNumber { get; set; }
        public string FunctionFluidType { get; set; }
        public string FunctionRatedHead { get; set; }
        public string FunctionPeriodType { get; set; }
        public string FunctionFailure { get; set; }
        public DateTime Date { get; set; }
        public string FailureModeWithLSETree { get; set; }
        public string FMWithConsequenceTree { get; set; }
        public int ComponentCriticalityFactor { get; set; }
        public string ComponentRating { get; set; }
        public string CMaintainenancePractice { get; set; }
        public string CFrequencyMaintainenance { get; set; }
        public string CConditionMonitoring { get; set; }
        public string CAttachmentDBPath { get; set; }
        public string CAttachmentFullPath { get; set; }
        public string CRemarks { get; set; }
        public List<RestoreCentrifugalPumpPrescriptiveFailureMode> restoreCentrifugalPumpPrescriptiveFailureModes { get; set; }

    }

    public class RestoreCentrifugalPumpPrescriptiveFailureMode
    {
        [Key]
        public int RCPFMId { get; set; }
        public int RCPPMId { get; set; }
        public string UserId { get; set; }
        public int CPPFMId { get; set; }
        public int CFPPrescriptiveId { get; set; }
        public string FunctionMode { get; set; }
        public string LocalEffect { get; set; }
        public string SystemEffect { get; set; }
        public string Consequence { get; set; }
        public int DownTimeFactor { get; set; }
        public int ScrapeFactor { get; set; }
        public int SafetyFactor { get; set; }
        public int ProtectionFactor { get; set; }
        public int FrequencyFactor { get; set; }
        public int CriticalityFactor { get; set; }
        public string Rating { get; set; }
        public string MaintainenancePractice { get; set; }
        public string FrequencyMaintainenance { get; set; }
        public string ConditionMonitoring { get; set; }
        public string AttachmentDBPath { get; set; }
        public string AttachmentFullPath { get; set; }
        public string Remark { get; set; }
        public int IsDeleted { get; set; }
        public string DeletedFMTree { get; set; }

        public RecycleBinCentrifugalPumpPrescriptiveModel RecycleBinCentrifugalPumpPrescriptiveModel { get; set; }
    }
}
