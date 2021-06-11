using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DPM.Models.PumpModel
{
    public class CentrifugalPumpTrainClassificationModel
    {
        [Key]
        public int PumpClassID { get; set; }
        public string UserId { get; set; }
        public int CentrifugalTrainID { get; set; }
        public int PumpClassificationId { get; set; }
        public decimal P1 { get; set; }
        public decimal P2 { get; set; }
        public decimal Average { get; set; }
        public decimal Q { get; set; }
        public DateTime InsertedDate { get; set; }
        public string PumpClassification { get; set; }
    }
}
