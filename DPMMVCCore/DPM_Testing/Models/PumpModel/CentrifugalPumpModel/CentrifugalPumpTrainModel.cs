using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DPM.Models.PumpModel
{
    public class CentrifugalPumpTrainModel
    {
        [Key]
        public int BatchId { get; set; }
        public string UserId { get; set; }
        public int TenantId { get; set; }
        public decimal PS { get; set; }
        public decimal PD { get; set; }
        public decimal Q { get; set; }
        public decimal D { get; set; }
        public decimal H { get; set; }
        public decimal E { get; set; }
        public decimal g { get; set; }
        public decimal F { get; set; }
        public DateTime InsertedDate { get; set; }
        public string ProcessingStage { get; set; }
    }
}
