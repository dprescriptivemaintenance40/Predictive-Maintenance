using System.ComponentModel.DataAnnotations;
namespace DPM_Testing.Models
{
    public class DesignationAccessModel
    {
        [Key]
        public int DAId { get; set; }
        public string CompanyUserId { get; set; }
        public string DesignationName { get; set; }
        public int Dashborad { get; set; }
        public int TrainConfiguration { get; set; }
        public int ScrewTrain { get; set; }
        public int ScrewPrediction { get; set; }
        public int FMEA { get; set; }
        public int RCM { get; set; }
        public int RCMConfiguration { get; set; }
        public int RCA { get; set; }
        public int CBA { get; set; }
        public int AssesmentReport { get; set; }
        public int SkillLibrary { get; set; }
        public int UPD { get; set; }
        public int CCL { get; set; }
        public int RecycleBin { get; set; }
    }
}
