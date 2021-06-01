
using System.ComponentModel.DataAnnotations;
namespace DPM.Models.PumpModel
{
    public class CentrifugalPumpConfigurationModel
    {
        [Key]
        public int AddPumpRuleId { get; set; }
        public string Columns { get; set; }
        public float Alarm { get; set; }
        public float Trigger { get; set; }
        public string Condition { get; set; }
    }
}
