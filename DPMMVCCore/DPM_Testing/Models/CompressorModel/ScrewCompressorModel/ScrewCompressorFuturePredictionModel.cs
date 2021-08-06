using System;
using System.ComponentModel.DataAnnotations;

namespace DPM.Models.CompressorModel.ScrewCompressorModel
{
    public class ScrewCompressorFuturePredictionModel
    {
        [Key]
        public int SCFPId { get; set; }
        public DateTime PredictedDate { get; set; }
        public string UserId { get; set; }
        public int TenantId { get; set; }
        public int BatchId { get; set; }
        public decimal PS1 { get; set; }
        public decimal PD1 { get; set; }
        public decimal PS2 { get; set; }
        public decimal PD2 { get; set; }
        public decimal TS1 { get; set; }
        public decimal TD1 { get; set; }
        public decimal TS2 { get; set; }
        public decimal TD2 { get; set; }        
        public string Prediction { get; set; }
        public string RD { get; set; }
        public string SSRB { get; set; }
        public string CF { get; set; }
   
    }

}
