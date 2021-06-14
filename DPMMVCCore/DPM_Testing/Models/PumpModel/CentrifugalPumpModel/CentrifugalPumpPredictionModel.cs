using System;
using System.ComponentModel.DataAnnotations;

namespace DPM.Models.PumpModel
{
    public class CentrifugalPumpPredictionModel
    {
        [Key]
        public int CentifugalPumpPID { get; set; }
        public string TagNumber { get; set; }
        public string BatchId { get; set; }
        public string UserId { get; set; }
        public decimal P1 { get; set; }
        public decimal P2 { get; set; }
        public decimal Amperage { get; set; }
        public decimal Q { get; set; }
        public DateTime InsertedDate { get; set; }
        public string Prediction { get; set; }
    }
}
