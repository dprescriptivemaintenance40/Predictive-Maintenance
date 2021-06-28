using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DPM.Models.PumpModel
{
    public class CentrifugalPumpHQLibraryModel
    {
        [Key]
        public int CentrifugalPumpHQLibraryID { get; set; }
        public decimal H { get; set; }
        public decimal Q { get; set; }
        public double KW { get; set; }
        public double CalculatedEff { get; set; }
        public double GraphEff{ get; set; }
    }
}
