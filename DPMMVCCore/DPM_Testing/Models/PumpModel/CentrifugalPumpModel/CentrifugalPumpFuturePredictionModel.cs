using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DPM.Models.PumpModel
{
    public class CentrifugalPumpFuturePredictionModel
    {
        [Key]
        public int CentifugalPumpFID { get; set; }
        public string TagNumber { get; set; }
        public string BatchId { get; set; }
        public string UserId { get; set; }
        public decimal P1 { get; set; }
        public decimal P2 { get; set; }
        public decimal I { get; set; }
        public decimal Q { get; set; }
        public DateTime FPDate { get; set; }
        public string FuturePrediction { get; set; }
    }
}
