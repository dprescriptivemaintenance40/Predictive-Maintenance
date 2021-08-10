using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DPM.Models.Prescriptive.PSR
{
    public class MSSStrategyModel
    {
        [Key]
        public int MSSStrategyModelId { get; set; }
        [NotMapped]
        public string UserId { get; set; }
        public string Strategy { get; set; }
        public string MaintenanceTask{ get; set; }
    }
}
