using DPM.Models.CompressorModel.ScrewCompressorModel;
using DPM.Models.PumpModel;
using DPM_ServerSide.DAL;
using DPM_ServerSide.Models.CompressorModel.ScrewCompressorModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DPM.Controllers.Compressors.ScrewCompressor
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScrewCompressorFuturePredictionAPIController : ControllerBase
    {
        private readonly DPMDal _context;

        public ScrewCompressorFuturePredictionAPIController(DPMDal context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        [Route("FuturePredictionMonth")]
        public async Task<IActionResult> GetFuturePredictionMonth(string FromDate, string ToDate)
        {

            try
            {

                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                DateTime d = Convert.ToDateTime(FromDate);
                DateTime futureFromDate = d.Date;
                DateTime d1 = Convert.ToDateTime(ToDate);
                DateTime futureToDate = d1.Date;
                List<ScrewCompressorFuturePredictionModel> screwCompressorFuturePrediction =
                                                           await _context.ScrewCompressureFuturePrediction
                                                                 .Where(a => a.UserId == userId
                                                                  && (a.PredictedDate >= futureFromDate
                                                                  && a.PredictedDate <= futureToDate))
                                                                 .ToListAsync();
                var futurePredictionData = screwCompressorFuturePrediction.ToList();
                return Ok(futurePredictionData);
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }

        public long DateToValues(DateTime dt)
        {
            return long.Parse(dt.Date.ToString("yyyyMMdd"));
        }

        [HttpGet]
        [Route("GetFutuerPredictionRecordsInCSVFormat")]
        public async Task<IActionResult> GetFutuerPredictionRecordsInCSVFormat(string Date)
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;
            try
            {
                List<ScrewCompressorFuturePredictionModel> screwCompressorFuturePrediction = new List<ScrewCompressorFuturePredictionModel>();
                if (Date != "")
                {
                    DateTime dt = Convert.ToDateTime(Date);
                    screwCompressorFuturePrediction = await _context.ScrewCompressureFuturePrediction.Where(a => a.UserId == userId && a.PredictedDate <= dt).OrderBy(a => a.PredictedDate).ToListAsync();
                }
                else
                {
                    screwCompressorFuturePrediction = await _context.ScrewCompressureFuturePrediction.Where(a => a.UserId == userId).OrderBy(a => a.PredictedDate).ToListAsync();
                }
                for (int i = 0; i < screwCompressorFuturePrediction.Count; i++)
                {
                
                    screwCompressorFuturePrediction[i].FTD1 = screwCompressorFuturePrediction[i].TD1;
               
                    screwCompressorFuturePrediction[i].TD1 = 0;

                    long date = DateToValues(screwCompressorFuturePrediction[i].PredictedDate);
                    screwCompressorFuturePrediction[i].Date = date;

                }
                //var newList = screwCompressorFuturePrediction.Select(d => new { d.Date, d.TS1, d.TD1, d.TS2, d.TD2, d.FTS1, d.FTD1, d.FTS2, d.FTD2 }).ToList();
                var newList = screwCompressorFuturePrediction.Select(d => new { d.Date,  d.TD1, d.FTD1,}).ToList();

                return Ok(newList);
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }

        }

        [HttpGet]
        [Route("FuturePredictionMovingAverage")]
        public async Task<IActionResult> GetMovngAverage()
        {
            try
            {
                //string userId = User.Claims.First(c => c.Type == "UserID").Value;
                //List<ScrewCompressorPredictionModel> screwCompressors = await _context.ScrewCompressurePredictionData
                //                                                                .Where(a => a.UserId == userId && string.IsNullOrEmpty(a.FuturePrediction))
                //                                                                .OrderBy(a => a.InsertedDate.Year)
                //                                                                .ThenBy(d => d.InsertedDate.Month)
                //                                                                .ThenBy(d => d.InsertedDate.Day)
                //                                                                .ToListAsync();

                //var prediction = screwCompressors.ToList(); ;

                //if (prediction.Count > 0)
                //{

                //    var length = prediction.Count;

                //    List<int> TenantIdList = new List<int>();
                //    List<int> BatchIdList = new List<int>();
                //    List<decimal> PS1List = new List<decimal>();
                //    List<decimal> PD1List = new List<decimal>();
                //    List<decimal> PS2List = new List<decimal>();
                //    List<decimal> PD2List = new List<decimal>();
                //    List<decimal> TS1List = new List<decimal>();
                //    List<decimal> TD1List = new List<decimal>();
                //    List<decimal> TS2List = new List<decimal>();
                //    List<decimal> TD2List = new List<decimal>();
                //    List<DateTime> DateList = new List<DateTime>();
                //    foreach (var item in prediction)
                //    {

                //        TenantIdList.Add(item.TenantId);
                //        BatchIdList.Add(item.BatchId);
                //        PS1List.Add(item.PS1);
                //        PD1List.Add(item.PD1);
                //        PS2List.Add(item.PS2);
                //        PD2List.Add(item.PD2);
                //        TS1List.Add(item.TS1);
                //        TD1List.Add(item.TD1);
                //        TS2List.Add(item.TS2);
                //        TD2List.Add(item.TD2);
                //        DateList.Add(item.InsertedDate);
                //        item.FuturePrediction = "Done";
                //        _context.ScrewCompressurePredictionData.Attach(item);
                //        _context.Entry(item).State = EntityState.Modified;
                //        await _context.SaveChangesAsync();


                //    }

                //    ScrewCompressorFuturePredictionModel screwcompressorFuturePrediction = new ScrewCompressorFuturePredictionModel();
                //    int BatchId = BatchIdList.IndexOf(0);

                //    for (int i = 0; i < length - 5; i++)
                //    {
                //        DateTime dateTime = DateList.Last();
                //        dateTime = dateTime.Date.AddDays(+1);
                //        DateList.Add(dateTime);


                //        var PS1 = (PS1List.ElementAt(i) + PS1List.ElementAt(i + 1) + PS1List.ElementAt(i + 2) + PS1List.ElementAt(i + 3) + PS1List.ElementAt(i + 4));
                //        var PD1 = (PD1List.ElementAt(i) + PD1List.ElementAt(i + 1) + PD1List.ElementAt(i + 2) + PD1List.ElementAt(i + 3) + PD1List.ElementAt(i + 4));
                //        var PS2 = (PS2List.ElementAt(i) + PS2List.ElementAt(i + 1) + PS2List.ElementAt(i + 2) + PS2List.ElementAt(i + 3) + PS2List.ElementAt(i + 4));
                //        var PD2 = (PD2List.ElementAt(i) + PD2List.ElementAt(i + 1) + PD2List.ElementAt(i + 2) + PD2List.ElementAt(i + 3) + PD2List.ElementAt(i + 4));
                //        var TS1 = (TS1List.ElementAt(i) + TS1List.ElementAt(i + 1) + TS1List.ElementAt(i + 2) + TS1List.ElementAt(i + 3) + TS1List.ElementAt(i + 4));
                //        var TD1 = (TD1List.ElementAt(i) + TD1List.ElementAt(i + 1) + TD1List.ElementAt(i + 2) + TD1List.ElementAt(i + 3) + TD1List.ElementAt(i + 4));
                //        var TS2 = (TS2List.ElementAt(i) + TS2List.ElementAt(i + 1) + TS2List.ElementAt(i + 2) + TS2List.ElementAt(i + 3) + TS2List.ElementAt(i + 4));
                //        var TD2 = (TD2List.ElementAt(i) + TD2List.ElementAt(i + 1) + TD2List.ElementAt(i + 2) + TD2List.ElementAt(i + 3) + TD2List.ElementAt(i + 4));

                //        screwcompressorFuturePrediction.SCFPId = 0;
                //        screwcompressorFuturePrediction.UserId = userId;
                //        screwcompressorFuturePrediction.TenantId = TenantIdList.First();
                //        screwcompressorFuturePrediction.BatchId = BatchId;
                //        screwcompressorFuturePrediction.Prediction = "pending";
                //        screwcompressorFuturePrediction.PS1 = Convert.ToDecimal(string.Format("{0:F2}", (PS1 / 5)));
                //        screwcompressorFuturePrediction.PD1 = Convert.ToDecimal(string.Format("{0:F2}", (PD1 / 5)));
                //        screwcompressorFuturePrediction.PS2 = Convert.ToDecimal(string.Format("{0:F2}", (PS2 / 5)));
                //        screwcompressorFuturePrediction.PD2 = Convert.ToDecimal(string.Format("{0:F2}", (PD2 / 5)));
                //        screwcompressorFuturePrediction.TS1 = Convert.ToDecimal(string.Format("{0:F2}", (TS1 / 5)));
                //        screwcompressorFuturePrediction.TD1 = Convert.ToDecimal(string.Format("{0:F2}", (TD1 / 5)));
                //        screwcompressorFuturePrediction.TS2 = Convert.ToDecimal(string.Format("{0:F2}", (TS2 / 5)));
                //        screwcompressorFuturePrediction.TD2 = Convert.ToDecimal(string.Format("{0:F2}", (TD2 / 5)));
                //        screwcompressorFuturePrediction.PredictedDate = DateList.Last();
                //        _context.ScrewCompressureFuturePrediction.Add(screwcompressorFuturePrediction);
                //        await _context.SaveChangesAsync();

                //    }


                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                List<ScrewCompressorPredictionModel> screwCompressors = await _context.ScrewCompressurePredictionData
                                                                                .Where(a => a.UserId == userId && string.IsNullOrEmpty(a.FuturePrediction))
                                                                                .OrderByDescending(a => a.PredictionId)
                                                                                .ToListAsync();

                List<DateTime> Date = new List<DateTime>();
                screwCompressors.Sort((x, y) => DateTime.Compare(x.InsertedDate, y.InsertedDate));
                screwCompressors.Reverse();
                var x = (from obj in screwCompressors group obj by obj.InsertedDate into g select new { Date = g.Key, Duplicatecount = g.Count() }).ToList();
                if (x.Count > 5)
                {
                    var BatchId = screwCompressors[0].BatchId;
                    var TenantId = screwCompressors[0].TenantId;
                    List<double> SPS1List = new List<double>();
                    List<double> SPD1List = new List<double>();
                    List<double> SPS2List = new List<double>();
                    List<double> SPD2List = new List<double>();
                    List<double> STS1List = new List<double>();
                    List<double> STD1List = new List<double>();
                    List<double> STS2List = new List<double>();
                    List<double> STD2List = new List<double>();
                    List<DateTime> SDate = new List<DateTime>();
                    Date = screwCompressors.Select(x => x.InsertedDate).Distinct().ToList();

                    for (int i = 0; i < Date.Count; i++)
                    {
                        List<double> LPS1List = new List<double>();
                        List<double> LPD1List = new List<double>();
                        List<double> LPS2List = new List<double>();
                        List<double> LPD2List = new List<double>();
                        List<double> LTS1List = new List<double>();
                        List<double> LTD1List = new List<double>();
                        List<double> LTS2List = new List<double>();
                        List<double> LTD2List = new List<double>();
                        int count = 0;
                        if (x[i].Date == Date[i] && x[i].Duplicatecount > 5)
                        {
                            for (int ii = 0; ii < screwCompressors.Count; ii++)
                            {
                                if (count < 5)
                                {
                                    if (screwCompressors[ii].InsertedDate == Date[i])
                                    {
                                        LPS1List.Add(Convert.ToDouble(screwCompressors[ii].PS1));
                                        LPD1List.Add(Convert.ToDouble(screwCompressors[ii].PD1));
                                        LPS2List.Add(Convert.ToDouble(screwCompressors[ii].PS2));
                                        LPD2List.Add(Convert.ToDouble(screwCompressors[ii].PD2));
                                        LTS1List.Add(Convert.ToDouble(screwCompressors[ii].TS1));
                                        LTD1List.Add(Convert.ToDouble(screwCompressors[ii].TD1));
                                        LTS2List.Add(Convert.ToDouble(screwCompressors[ii].TS2));
                                        LTD2List.Add(Convert.ToDouble(screwCompressors[ii].TD2));

                                        count = count + 1;
                                    }
                                }
                                else if (count == 5)
                                {
                                    SPS1List.Add(LPS1List.Sum() / 5);
                                    SPD1List.Add(LPD1List.Sum() / 5);
                                    SPS2List.Add(LPS2List.Sum() / 5);
                                    SPD2List.Add(LPD2List.Sum() / 5);
                                    STS1List.Add(LTS1List.Sum() / 5);
                                    STD1List.Add(LTD1List.Sum() / 5);
                                    STS2List.Add(LTS2List.Sum() / 5);
                                    STD2List.Add(LTD2List.Sum() / 5);
                                    SDate.Add(Date[i]);
                                    break;
                                }

                            }
                        }
                        else if (x[i].Date == Date[i] && x[i].Duplicatecount < 5)
                        {

                            List<ScrewCompressorPredictionModel> PredictionRecord = screwCompressors.FindAll(a => a.InsertedDate == Date[i]);
                            SPS1List.Add(Convert.ToDouble(PredictionRecord[0].PS1));
                            SPD1List.Add(Convert.ToDouble(PredictionRecord[0].PD1));
                            SPS2List.Add(Convert.ToDouble(PredictionRecord[0].PS2));
                            SPD2List.Add(Convert.ToDouble(PredictionRecord[0].PD2));
                            STS1List.Add(Convert.ToDouble(PredictionRecord[0].TS1));
                            STD1List.Add(Convert.ToDouble(PredictionRecord[0].TD1));
                            STS2List.Add(Convert.ToDouble(PredictionRecord[0].TS2));
                            STD2List.Add(Convert.ToDouble(PredictionRecord[0].TD2));
                            SDate.Add(Date[i]);
                        }
                    }

                    SPS1List.Reverse();
                    SPD1List.Reverse();
                    SPS2List.Reverse();
                    SPD2List.Reverse();
                    STS1List.Reverse();
                    STD1List.Reverse();
                    STS2List.Reverse();
                    STD2List.Reverse();
                    SDate.Reverse();
                    ScrewCompressorFuturePredictionModel screwcompressorFuturePrediction = new ScrewCompressorFuturePredictionModel();
                    if (SPS1List.Count > 5)
                    {
                        for (int i = 0; i < (SPS1List.Count - 5); i++)
                        {
                            var PS1 = (SPS1List.ElementAt(i) + SPS1List.ElementAt(i + 1) + SPS1List.ElementAt(i + 2) + SPS1List.ElementAt(i + 3) + SPS1List.ElementAt(i + 4));
                            var PD1 = (SPD1List.ElementAt(i) + SPD1List.ElementAt(i + 1) + SPD1List.ElementAt(i + 2) + SPD1List.ElementAt(i + 3) + SPD1List.ElementAt(i + 4));
                            var PS2 = (SPS2List.ElementAt(i) + SPS2List.ElementAt(i + 1) + SPS2List.ElementAt(i + 2) + SPS2List.ElementAt(i + 3) + SPS2List.ElementAt(i + 4));
                            var PD2 = (SPD2List.ElementAt(i) + SPD2List.ElementAt(i + 1) + SPD2List.ElementAt(i + 2) + SPD2List.ElementAt(i + 3) + SPD2List.ElementAt(i + 4));
                            var TS1 = (STS1List.ElementAt(i) + STS1List.ElementAt(i + 1) + STS1List.ElementAt(i + 2) + STS1List.ElementAt(i + 3) + STS1List.ElementAt(i + 4));
                            var TD1 = (STD1List.ElementAt(i) + STD1List.ElementAt(i + 1) + STD1List.ElementAt(i + 2) + STD1List.ElementAt(i + 3) + STD1List.ElementAt(i + 4));
                            var TS2 = (STS2List.ElementAt(i) + STS2List.ElementAt(i + 1) + STS2List.ElementAt(i + 2) + STS2List.ElementAt(i + 3) + STS2List.ElementAt(i + 4));
                            var TD2 = (STD2List.ElementAt(i) + STD2List.ElementAt(i + 1) + STD2List.ElementAt(i + 2) + STD2List.ElementAt(i + 3) + STD2List.ElementAt(i + 4));
                            DateTime FuturePredictionDate = SDate.Last().AddDays(i + 1);


                            screwcompressorFuturePrediction.SCFPId = 0;
                            screwcompressorFuturePrediction.UserId = userId;
                            screwcompressorFuturePrediction.TenantId = TenantId;
                            screwcompressorFuturePrediction.BatchId = BatchId;
                            screwcompressorFuturePrediction.Prediction = "pending";
                            screwcompressorFuturePrediction.PS1 = Convert.ToDecimal(string.Format("{0:F2}", (PS1 / 5)));
                            screwcompressorFuturePrediction.PD1 = Convert.ToDecimal(string.Format("{0:F2}", (PD1 / 5)));
                            screwcompressorFuturePrediction.PS2 = Convert.ToDecimal(string.Format("{0:F2}", (PS2 / 5)));
                            screwcompressorFuturePrediction.PD2 = Convert.ToDecimal(string.Format("{0:F2}", (PD2 / 5)));
                            screwcompressorFuturePrediction.TS1 = Convert.ToDecimal(string.Format("{0:F2}", (TS1 / 5)));
                            screwcompressorFuturePrediction.TD1 = Convert.ToDecimal(string.Format("{0:F2}", (TD1 / 5)));
                            screwcompressorFuturePrediction.TS2 = Convert.ToDecimal(string.Format("{0:F2}", (TS2 / 5)));
                            screwcompressorFuturePrediction.TD2 = Convert.ToDecimal(string.Format("{0:F2}", (TD2 / 5)));
                            screwcompressorFuturePrediction.PredictedDate = FuturePredictionDate;

                            _context.ScrewCompressureFuturePrediction.Add(screwcompressorFuturePrediction);
                            await _context.SaveChangesAsync();

                        }

                        foreach (var item in screwCompressors)
                        {
                            _context.ScrewCompressurePredictionData.Attach(item);
                            item.FuturePrediction = "Done";
                            await _context.SaveChangesAsync();
                        }
                    }
                }
                return Ok(x);

            }
            catch (Exception exe)
            {

                return Ok(exe.Message);
            }
        }


        [HttpGet]
        [Route("GetFuturePredictionRecords")]
        public async Task<IActionResult> GetFuturePredictionRecords()
        {
            try
            {
                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                List<ScrewCompressorFuturePredictionModel> screwCompressorFuturePredictionModels = await _context.ScrewCompressureFuturePrediction
                                                                                                                 .Where(a => a.UserId == userId)
                                                                                                                 .OrderBy(a => a.PredictedDate.Year)
                                                                                                                 .ThenBy(d => d.PredictedDate.Month)
                                                                                                         .ThenBy(d => d.PredictedDate.Day)
                                                                                                                 .ToListAsync();
                var Data = screwCompressorFuturePredictionModels.ToList();

                return Ok(Data);
            }
            catch (Exception exe)
            {

                return Ok(exe.Message);
            }
        }

        [HttpGet]
        [Route("GetFuturePredictionRecordsById")]
        public async Task<IActionResult> GetFuturePredictionRecordsById(int SCFPId)
        {
            try
            {
                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                List<ScrewCompressorFuturePredictionModel> screwCompressorFuturePredictionModels = await _context.ScrewCompressureFuturePrediction
                                                                                                                 .Where(a => a.UserId == userId && a.SCFPId == SCFPId)
                                                                                                                 .OrderBy(a => a.PredictedDate.Year)
                                                                                                                 .ThenBy(d => d.PredictedDate.Month)
                                                                                                                 .ThenBy(d => d.PredictedDate.Day)
                                                                                                                 .ToListAsync();
                var Data = screwCompressorFuturePredictionModels.ToList();

                return Ok(Data);
            }
            catch (Exception exe)
            {

                return Ok(exe.Message);
            }
        }



        [HttpGet]
        [Route("GetForecast")]
        public async Task<IActionResult> GetForecast()
        {
            try
            {
                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                List<ScrewCompressorForecastModel> screwCompressorForecastModels = await _context.ScrewCompressorForecastModels.Where(a => a.UserId == userId).ToListAsync();



              //  List<ScrewCompressorForecastModel> screwCompressorForecastModels = await _context.ScrewCompressorForecastModels
                                                                                                 //        .Where(a => a.UserId == userId)
                                                                                                 //        .OrderBy(a => a.Date.Year)
                                                                                                 //        .ThenBy(d => d.Date.Month)
                                                                                                 //.ThenBy(d => d.Date.Day)
                                                                                                 //        .ToListAsync();
                //for (int i = 0; i < screwCompressorForecastModels.Count; i++)
                //{

                //    screwCompressorForecastModels[i].FTD1 = screwCompressorForecastModels[i].TD1;

                //    screwCompressorForecastModels[i].TD1 = 0;
                //    long date = DateToValues(screwCompressorForecastModels[i].Date);
                //      screwCompressorForecastModels[i].FDate = date;
                //}
              //  var Data = screwCompressorForecastModels.Select(d => new { d.FDate, d.FTD1, d.TD1, }).ToList();
                return Ok(screwCompressorForecastModels);
            }
            catch (Exception exe)
            {

                return Ok(exe.Message);
            }
        }


        //[HttpGet]
        //[Route("MergepredictionAndForcast")]
        //public  IActionResult MergepredictionAndForcast()
        //{
        //    string userId = User.Claims.First(c => c.Type == "UserID").Value;
        //    var q = (from pd in _context.ScrewCompressurePredictionData
        //            where pd.UserId == userId
        //             select new
        //             {

        //                 InsertedDate= pd.InsertedDate,
        //                 FTD1 = _context.ScrewCompressorForecastModels.Where(obj=>obj.UserId == pd.UserId && obj.TD1 != null).Select(s=>s.TD1).FirstOrDefault(),
        //                 TD1 = pd.TD1
                          
        //             }).ToList();
         

        //    return Ok(q);

        //}


    }
}
