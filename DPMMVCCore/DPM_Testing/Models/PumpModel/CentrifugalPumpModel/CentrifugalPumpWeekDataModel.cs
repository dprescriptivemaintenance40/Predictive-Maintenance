using System;
using System.ComponentModel.DataAnnotations;

namespace DPM.Models.PumpModel
{
    public class CentrifugalPumpWeekDataModel
    {
        [Key]
        public int CPWId { get; set; }
        public string TagNumber { get; set; }
        public string UserId { get; set; }
        public DateTime Date { get; set; }
        public DateTime InsertedDate { get; set; }
        public decimal OneH { get; set; }
        public decimal OneV { get; set; }
        public decimal TwoH { get; set; }
        public decimal TwoV { get; set; }
        public decimal TwoA { get; set; }
        public decimal ThreeH { get; set; }
        public decimal ThreeV { get; set; }
        public decimal ThreeA { get; set; }
        public decimal FourH { get; set; }
        public decimal FourV { get; set; }
        public decimal OneT { get; set; }
        public decimal TwoT { get; set; }
        public decimal ThreeT { get; set; }
        public decimal FourT { get; set; }
        public decimal AMP { get; set; }

    }
}
