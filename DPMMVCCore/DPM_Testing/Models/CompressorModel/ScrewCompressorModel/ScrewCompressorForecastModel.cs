using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DPM.Models.PumpModel
{
    public class ScrewCompressorForecastModel
    {
        public string UserId { get; set; }
        public decimal TD1 { get; set; }
    }
}
