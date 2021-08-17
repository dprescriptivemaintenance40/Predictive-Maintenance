using System.ComponentModel.DataAnnotations;

namespace DPM.Models.Prescriptive.PSR
{
    public class PSRClientContractorModel
    {
        [Key]
        public int PSRClientContractorId { get; set; }
        public string UserId { get; set; }
        public string CraftSF { get; set; }
        public string CraftLF { get; set; }
        public double ClientHourlyRate { get; set; }
        public double ContractorHourlyRate { get; set; }
    }
}
