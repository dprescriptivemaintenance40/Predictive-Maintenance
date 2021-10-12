using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DPM.Models
{
    public class CraftEmployeeTaskMappingModel
    {
        [Key]
        public int CETId { get; set; }
        public string UserId { get; set; }
        public string Craft { get; set; }
        public int CraftId { get; set; }
        public List<CraftEmployeeTaskChild> CraftEmployeeTaskChild { get; set; }
    }

    public class CraftEmployeeTaskChild
    {
        [Key]
        public int CETChildId { get; set; }
        public int CETId { get; set; }
        public string EmployeeId { get; set; }
        public double CheckOilLevelTopUp { get; set; }
        public double VibrationCheck { get; set; }
        public double ScheduleReplacement { get; set; }
        public double ReplaceOnCondition { get; set; }
        public double ScheduleOilChange { get; set; }
        public double SupportToMechTask { get; set; }
        public string TaskId { get; set; }
        public string CriticalityRating { get; set; }
        public List<EmployeeTaskListModel> EmployeeTaskListModels { get; set; }
        public CraftEmployeeTaskMappingModel CraftEmployeeTaskMappingModel { get; set; }
    }
    public class EmployeeTaskListModel
    {
        [Key]
        public int EmployeeTaskListId { get; set; }
        public int CETChildId { get; set; }
        public int MaintenanceTaskId { get; set; }
        public string Progress { get; set; }
        public CraftEmployeeTaskChild CraftEmployeeTaskChild { get; set; }
    }
}
