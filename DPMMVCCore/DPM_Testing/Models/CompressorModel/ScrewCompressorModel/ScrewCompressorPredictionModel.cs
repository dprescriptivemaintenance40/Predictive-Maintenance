using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace DPM_ServerSide.Models.CompressorModel.ScrewCompressorModel
{
    public class ScrewCompressorPredictionModel
    {
        [Key]
        public int PredictionId { get; set; }
        public DateTime InsertedDate { get; set; }
        public string UserId { get; set; }
        public int BatchId { get; set; }
        public int TenantId { get; set; }
        public string TagNumber { get; set; }
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
        public string FuturePrediction { get; set; }
        [NotMapped]
        public long Date { get; set; }
        [NotMapped]
        public decimal FTS1 { get; set; }
        [NotMapped]
        public decimal FTD1 { get; set; }
        [NotMapped]
        public decimal FTS2 { get; set; }
        [NotMapped]
        public decimal FTD2 { get; set; }

    }
}
