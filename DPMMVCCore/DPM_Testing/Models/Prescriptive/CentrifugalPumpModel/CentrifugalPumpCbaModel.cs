
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

public class PrescriptiveCbaModel
{
    [Key]
    public int PCMId { get; set; }
    public int CFPPrescriptiveId { get; set; }
    public int CPPFMId { get; set; }
    public string TagNumber { get; set; }
    public string EquipmentType { get; set; }
    public string FunctionFailure { get; set; }
    public string IsAgeRelated { get; set; }
    public string RiskMatrix { get; set; }
    public string Consequence { get; set; }
    public string HasScenario { get; set; }
    public string DescribeScenario { get; set; }
    public List<CBAFailureMode> CBAFailureModes { get; set; }
}
public class CBAFailureMode
{
    [Key]
    public int CFMId { get; set; }
    public int PCMId { get; set; }
    public string FailureMode { get; set; }
    public int ETBF { get; set; }
    public float PONC { get; set; }
    public string EC { get; set; }
    public string HS { get; set; }
    public string EV { get; set; }
    public string CA { get; set; }
    public int ETBC { get; set; }
    public float TotalAnnualPOC { get; set; }
    public float TotalAnnualCostWithMaintenance { get; set; }
    public float ResidualRiskWithMaintenance { get; set; }
    public float MEI { get; set; }
    public List<CBAMaintenanceTask> CBAMaintenanceTasks { get; set; }
    public PrescriptiveCbaModel PrescriptiveCbaModels { get; set; }
}
public class CBAMaintenanceTask
{
    [Key]
    public int CMTId { get; set; }
    public int CFMId { get; set; }
    public int CentrifugalPumpMssId { get; set; }
    public string MSSMaintenanceTask { get; set; }
    public string MSSStartergy { get; set; }
    public int MaterialCost { get; set; }
    public string Status { get; set; }
    public List<CBAMainenanceInterval> CBAMainenanceIntervals { get; set; }
    public CBAFailureMode CBAFailureMode { get; set; }
}
public class CBAMainenanceInterval
{
    [Key]
    public int CMIId { get; set; }
    public int CMTId { get; set; }
    public string MSSFrequency { get; set; }
    public string Maintenancelibrary { get; set; }
    public string RWC { get; set; }
    public float TaskDuration { get; set; }
    public float ResourceCost { get; set; }
    public float POC { get; set; }
    public float AnnualPOC { get; set; }
    public string WorkCenter { get; set; }
    public string OnStream { get; set; }
    public CBAMaintenanceTask CBAMaintenanceTasks { get; set; }
}


