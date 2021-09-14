using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DPM.Models.Prescriptive.PSR
{
    public class CBAModel
    {
        [Key]
        public int CBAId { get; set; }
        public string UserId { get; set; }
        public int RCMTreeId { get; set; }
        public string FailureMode { get; set; }
        public string MachineType { get; set; }
        public string TagNumber { get; set; }
        public string ETBF { get; set; }
        public string EquipmentType { get; set; }
        public double EconomicRiskWithOutDPM { get; set; }
        public double EconomicRiskWithDPM { get; set; }
        public double EconomicRiskWithDPMConstraint { get; set; }
        public double MEIWithoutDPM { get; set; }
        public double MEIWithDPM { get; set; }
        public double MEIWithDPMConstraint { get; set; }
        public string EconomicRiskWithOutDPMCR { get; set; }
        public string EconomicRiskWithDPMCR { get; set; }
        public string EconomicRiskWithDPMConstraintCR { get; set; }
        public double LevelCount { get; set; }
        public double TotalAnnualPOC { get; set; }
        public double TotalPONC { get; set; }
        public double VendorETBC { get; set; }
        public double OverallETBC { get; set; }
        public double ResidualRiskWithMaintenance { get; set; }
        public double VendorPOC { get; set; }
        public List<CBATaskModel> CBATaskModel { get; set; }
    }

    public class CBATaskModel
    {
        [Key]
        public int CBATaskId { get; set; }
        public int CBAId { get; set; }
        public string CentrifugalPumpMssId { get; set; }
        public string MSSIntervalSelectionCriteria { get; set; }
        public string MSSMaintenanceTask { get; set; }
        public string MSSMaintenanceInterval { get; set; }
        public string Craft { get; set; }
        public double Level { get; set; }
        public double AnnualPOC { get; set; }
        public string Status { get; set;  }
        public string Checked { get; set; }
        public string Hours { get; set; }
        public int Progress { get; set; }
        public CBAModel CBAModel { get; set; }
    }

}
