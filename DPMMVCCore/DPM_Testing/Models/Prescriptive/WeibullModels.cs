
using System.Collections.Generic;

namespace DPM.Models.Prescriptive
{

    public class WeibullModel
    {
        public double Alpha { get; set; }
        public double Beta { get; set; }
        public double rSquare { get; set; }
        public List<WeibullMTBFModel> weibullMTBFModels { get; set; }
        public List<WeibullHazardRateModel> weibullHazardRateModels { get; set; }
    }

    public class WeibullMTBFModel
    {
        public int MTBFDays { get; set; }
        public int Rank { get; set; }
        public double MedianRankPercentage { get; set; }
        public double LogOfMTBFDays { get; set; }
        public double InverseOfMedianRankPercentage { get; set; }
        public double LogOfInverseOfMedianRankPercentage { get; set; }
    }

    public class WeibullHazardRateModel
    {
        public int CyclesDays { get; set; }
        public double CDF { get; set; }
        public double Reliability { get; set; }
        public double HazardRate { get; set; }
        public double PDF { get; set; }
        public double WeibullLogx { get; set; }
        public double WeibullLogxOfLogx { get; set; } 
    }
}
