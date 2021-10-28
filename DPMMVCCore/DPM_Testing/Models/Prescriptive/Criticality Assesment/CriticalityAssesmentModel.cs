
using System.ComponentModel.DataAnnotations;

namespace DPM.Models
{

    public class CriticalityAssesmentModel
    {
        [Key]
        public int CAId { get; set; }
        public string Asset { get; set; }
        public string Location { get; set; }
        public string AssetDescription { get; set; }
        public string LocationDescription { get; set; }
        public string FailureClass { get; set; }
        public string LocationParent { get; set; }
        public string CriticalityProjectStage { get; set; }
        public string GeneralLedgerAccount { get; set; }
        public string Area { get; set; }
        public string Status { get; set; }
        public double SE { get; set; }
        public double PLE { get; set; }
        public double EE { get; set; }
        public double RE { get; set; }
        public double RF { get; set; }
        public double FRE { get; set; }
        public double Criticality { get; set; }
        public string RiskRanking { get; set; }
    }
}
