﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace DPM_Testing.Models
{
    public class ScrewCompressorTrainModel
    {
        [Key]
        public int BatchId { get; set; }
        public string UserId { get; set; }
        public int TenantId { get; set; }
        public decimal PS1 { get; set; }
        public decimal PD1 { get; set; }
        public decimal PS2 { get; set; }
        public decimal PD2 { get; set; }
        public decimal TS1 { get; set; }
        public decimal TD1 { get; set; }
        public decimal TS2 { get; set; }
        public decimal TD2 { get; set; }
        public DateTime InsertedDate { get; set; }
        public string ProcessingStage { get; set; }
        public string FailureModeType { get; set; }
        [NotMapped]
        public string Date { get; set; }

    }

}