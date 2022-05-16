﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DPM.Models.Prescriptive.CentrifugalPumpModel
{
    public class CentrifugalPumpCbaModel
    {
        [Key]
        public int CPCMId { get; set; }
        public int CentrifugalPumpMssId { get; set; }
        public int CFPPrescriptiveId { get; set; }
        public int CPPFMId { get; set; }
        public int TagNumber { get; set; }
        public List<CentrifugalPumpPrescriptiveCBAFailureMode> centrifugalPumpPrescriptiveCBAFailureModes { get; set; }
    }
    public class CentrifugalPumpPrescriptiveCBAFailureMode
    {
        [Key]
        public int CPPCFMId { get; set; }
        public int CPCMId { get; set; }
        public string FailureMode { get; set; }
        public List<CBAFailureModeTask> CBAFailureModeTasks { get; set; }
        public CentrifugalPumpCbaModel centrifugalPumpCbaModel { get; set; }

    }
    public class CBAFailureModeTask
    {
        [Key]
        public int CFMId { get; set; }
        public int CPPCFMId { get; set; }
        public string IsAgeRelated { get; set; }
        public string RiskMatrix { get; set; }
        public string Consequence { get; set; }
        public string HasScenario { get; set; }
        public string DescribeScenario { get; set; }
        public string MSSMaintenanceTask { get; set; }
        public string MSSStartergy { get; set; }
        public string MSSMAintenanceInterval { get; set; }
        public int RWC { get; set; }
        public int TaskDuration { get; set; }
        public int ResourceCost { get; set; }
        public int MaterialCost  { get; set; }
        public int POC { get; set; }
        public string WorkCenter { get; set; }
        public string OnStream { get; set; }
        public string Status { get; set; }
        public CentrifugalPumpPrescriptiveCBAFailureMode centrifugalPumpPrescriptiveCBAFailureModes { get; set; }
    }
}
