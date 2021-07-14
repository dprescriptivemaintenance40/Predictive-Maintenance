using DPM.Models.PumpModel;
using DPM_ServerSide.DAL;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace DPM.Controllers.Pumps.CentrifugalPump
{
    [Route("api/[controller]")]
    [ApiController]
    public class CentrifugalPumpFuturePredictionAPIController : ControllerBase
    {
        private readonly DPMDal _context;
        public CentrifugalPumpFuturePredictionAPIController(DPMDal context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("FuturePrediction")]
        public async Task<IActionResult> FuturePrediction()
        {
            try
            {
                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                List<CentrifugalPumpPredictionModel> CPM = await _context.CentrifugalPumpPredictions.Where(a => a.UserId == userId  && string.IsNullOrEmpty(a.FuturePrediction))
                                                                                .OrderByDescending(a => a.CentifugalPumpPID)
                                                                                .ToListAsync();
                
                List<DateTime> Date = new List<DateTime>();
                CPM.Sort((x, y) => DateTime.Compare(x.InsertedDate, y.InsertedDate));
                CPM.Reverse();
                var x = (from obj in CPM group obj by obj.InsertedDate into g select new { Date = g.Key, Duplicatecount = g.Count() }).ToList();
                if (x.Count > 5)
                {
                    var TagNumber = CPM[0].TagNumber;
                    var BatchId = CPM[0].BatchId;
                    List<double> SP1 = new List<double>();
                    List<double> SP2 = new List<double>();
                    List<double> SQ = new List<double>();
                    List<double> SI = new List<double>();
                    List<DateTime> SDate = new List<DateTime>();
                    Date = CPM.Select(x => x.InsertedDate).Distinct().ToList();
                    for (int i = 0; i < Date.Count; i++)
                    {
                        List<double> LP1 = new List<double>();
                        List<double> LP2 = new List<double>();
                        List<double> LQ = new List<double>();
                        List<double> LI = new List<double>();
                        int count = 0;
                        if (x[i].Date == Date[i] && x[i].Duplicatecount > 5)
                        {
                            for (int ii = 0; ii < CPM.Count; ii++)
                            {
                                if (count < 5)
                                {
                                    if (CPM[ii].InsertedDate == Date[i])
                                    {
                                        LP1.Add(Convert.ToDouble(CPM[ii].P1));
                                        LP2.Add(Convert.ToDouble(CPM[ii].P2));
                                        LQ.Add(Convert.ToDouble(CPM[ii].Q));
                                        LI.Add(Convert.ToDouble(CPM[ii].I));
                                        count = count + 1;
                                    }
                                }
                                else if (count == 5)
                                {
                                    SP1.Add(LP1.Sum() / 5);
                                    SP2.Add(LP2.Sum() / 5);
                                    SQ.Add(LQ.Sum() / 5);
                                    SI.Add(LI.Sum() / 5);
                                    SDate.Add(Date[i]);
                                    break;
                                }

                            }
                        }
                        else if(x[i].Date == Date[i] && x[i].Duplicatecount < 5)
                        {
         
                            List<CentrifugalPumpPredictionModel> PredictionRecord = CPM.FindAll(a => a.InsertedDate == Date[i]);
                            LP1.Add(Convert.ToDouble(PredictionRecord[0].P1));
                            LP2.Add(Convert.ToDouble(PredictionRecord[0].P2));
                            LQ.Add(Convert.ToDouble(PredictionRecord[0].Q));
                            LI.Add(Convert.ToDouble(PredictionRecord[0].I));
                            SP1.Add(LP1.Sum());
                            SP2.Add(LP2.Sum());
                            SQ.Add(LQ.Sum());
                            SI.Add(LI.Sum());
                            SDate.Add(Date[i]);
                        }
                    }
                    SP1.Reverse();
                    SP2.Reverse();
                    SQ .Reverse();
                    SI .Reverse();
                    SDate.Reverse();
                    CentrifugalPumpFuturePredictionModel CPFM = new CentrifugalPumpFuturePredictionModel();
                    if(SP1.Count > 5)
                    {
                        for (int i = 0; i < (SP1.Count - 5); i++)
                        {
                            var P1 = (SP1.ElementAt(i) + SP1.ElementAt(i + 1) + SP1.ElementAt(i + 2) + SP1.ElementAt(i + 3) + SP1.ElementAt(i + 4));
                            var P2 = (SP2.ElementAt(i) + SP2.ElementAt(i + 1) + SP2.ElementAt(i + 2) + SP2.ElementAt(i + 3) + SP2.ElementAt(i + 4));
                            var Q  = (SQ.ElementAt(i)  + SQ.ElementAt(i + 1)  + SQ.ElementAt(i + 2)  + SQ.ElementAt(i + 3)  + SQ.ElementAt(i + 4));
                            var I  = (SI.ElementAt(i)  + SI.ElementAt(i + 1)  + SI.ElementAt(i + 2)  + SI.ElementAt(i + 3)  + SI.ElementAt(i + 4));
                            DateTime FuturePredictionDate = SDate.Last().AddDays(i + 1);
                            CPFM.CentifugalPumpFID = 0;
                            CPFM.TagNumber = TagNumber;
                            CPFM.BatchId = BatchId;
                            CPFM.UserId = userId;
                            CPFM.P1 = Convert.ToDecimal(string.Format("{0:F2}", (P1 / 5)));
                            CPFM.P2 = Convert.ToDecimal(string.Format("{0:F2}", (P2 / 5)));
                            CPFM.Q  = Convert.ToDecimal(string.Format("{0:F2}", (Q / 5)));
                            CPFM.I  = Convert.ToDecimal(string.Format("{0:F2}", (I / 5)));
                            CPFM.FPDate = FuturePredictionDate;
                            _context.CentrifugalPumpFuturePredictionModels.Add(CPFM);
                            await _context.SaveChangesAsync();

                        }
                        foreach (var item in CPM)
                        {
                            item.FuturePrediction = "Done";
                            _context.CentrifugalPumpPredictions.Attach(item);
                            _context.Entry(item).State = EntityState.Modified;
                            await _context.SaveChangesAsync();
                        }
                    }
                   
                }
                return Ok(x);
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }

        [HttpGet]
        [Route("GetAllPredictionRecords")]
        public async Task<IActionResult> GetFuturePredictionRecords()
        {
            try
            {
                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                var records = await _context.CentrifugalPumpFuturePredictionModels.Where(a => a.UserId == userId && (a.FuturePrediction != "" || a.FuturePrediction != null)).ToListAsync();
                return Ok(records);
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }

        [HttpGet]
        [Route("GetPredictionRecordsByDate")]
        public async Task<IActionResult> GetPredictionRecordsByDate(string fromDate, string toDate)
        {
            try
            {
                DateTime fD = Convert.ToDateTime(fromDate);
                DateTime tD = Convert.ToDateTime(toDate);
                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                var records = await _context.CentrifugalPumpFuturePredictionModels.Where(a => a.UserId == userId && a.FPDate >= fD && a.FPDate <= tD && (a.FuturePrediction != "" || a.FuturePrediction != null)).ToListAsync();
                return Ok(records);
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }
    }
}
