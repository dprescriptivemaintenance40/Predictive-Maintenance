using System;
using System.ComponentModel.DataAnnotations;

namespace DPM.Models.PumpModel
{
    public class CentrifugalPumpModel
    {
        [Key]
        public int CentrifugalPumpId { get; set; }
        public string UserId { get; set; }
        public string TagNumber { get; set; }
        public DateTime? InsertedDate { get; set; }
        public DateTime? Date { get; set; }
        public decimal PI025 { get; set; }
        public decimal PI022 { get; set; }
        public decimal PI023 { get; set; }
        public decimal PI027 { get; set; }
        public decimal PE203 { get; set; }
        public decimal TI061 { get; set; }
        public decimal TI062 { get; set; }
        public decimal TI263 { get; set; }
    }
}
