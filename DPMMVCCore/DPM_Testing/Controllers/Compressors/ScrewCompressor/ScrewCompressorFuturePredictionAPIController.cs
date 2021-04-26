using DPM.Models.CompressorModel.ScrewCompressorModel;
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

        [HttpGet]
        [Route("FuturePredictionMovingAverage")]
        public async Task<IActionResult> GetMovngAverage()
        {
            try
            {
                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                List<ScrewCompressorPredictionModel> screwCompressors = await _context.ScrewCompressurePredictionData
                                                                                .Where(a => a.UserId == userId && string.IsNullOrEmpty(a.FuturePrediction))
                                                                                .OrderBy(a => a.InsertedDate.Year)
                                                                                .ThenBy(d => d.InsertedDate.Month)
                                                                                .ThenBy(d => d.InsertedDate.Day)
                                                                                .ToListAsync();

                var prediction = screwCompressors.ToList(); ;

                if (prediction.Count > 0)
                {

                    var length = prediction.Count;

                    List<int> TenantIdList = new List<int>();
                    List<int> BatchIdList = new List<int>();
                    List<decimal> PS1List = new List<decimal>();
                    List<decimal> PD1List = new List<decimal>();
                    List<decimal> PS2List = new List<decimal>();
                    List<decimal> PD2List = new List<decimal>();
                    List<decimal> TS1List = new List<decimal>();
                    List<decimal> TD1List = new List<decimal>();
                    List<decimal> TS2List = new List<decimal>();
                    List<decimal> TD2List = new List<decimal>();
                    List<DateTime> DateList = new List<DateTime>();
                    foreach (var item in prediction)
                    {

                        TenantIdList.Add(item.TenantId);
                        BatchIdList.Add(item.BatchId);
                        PS1List.Add(item.PS1);
                        PD1List.Add(item.PD1);
                        PS2List.Add(item.PS2);
                        PD2List.Add(item.PD2);
                        TS1List.Add(item.TS1);
                        TD1List.Add(item.TD1);
                        TS2List.Add(item.TS2);
                        TD2List.Add(item.TD2);
                        DateList.Add(item.InsertedDate);
                        item.FuturePrediction = "Done";
                        _context.ScrewCompressurePredictionData.Attach(item);
                        _context.Entry(item).State = EntityState.Modified;
                        await _context.SaveChangesAsync();


                    }

                    ScrewCompressorFuturePredictionModel screwcompressorFuturePrediction = new ScrewCompressorFuturePredictionModel();
                    int BatchId = BatchIdList.IndexOf(0);

                    for (int i = 0; i < length - 5; i++)
                    {
                        DateTime dateTime = DateList.Last();
                        dateTime = dateTime.Date.AddDays(+1);
                        DateList.Add(dateTime);


                        var PS1 = (PS1List.ElementAt(i) + PS1List.ElementAt(i + 1) + PS1List.ElementAt(i + 2) + PS1List.ElementAt(i + 3) + PS1List.ElementAt(i + 4));
                        var PD1 = (PD1List.ElementAt(i) + PD1List.ElementAt(i + 1) + PD1List.ElementAt(i + 2) + PD1List.ElementAt(i + 3) + PD1List.ElementAt(i + 4));
                        var PS2 = (PS2List.ElementAt(i) + PS2List.ElementAt(i + 1) + PS2List.ElementAt(i + 2) + PS2List.ElementAt(i + 3) + PS2List.ElementAt(i + 4));
                        var PD2 = (PD2List.ElementAt(i) + PD2List.ElementAt(i + 1) + PD2List.ElementAt(i + 2) + PD2List.ElementAt(i + 3) + PD2List.ElementAt(i + 4));
                        var TS1 = (TS1List.ElementAt(i) + TS1List.ElementAt(i + 1) + TS1List.ElementAt(i + 2) + TS1List.ElementAt(i + 3) + TS1List.ElementAt(i + 4));
                        var TD1 = (TD1List.ElementAt(i) + TD1List.ElementAt(i + 1) + TD1List.ElementAt(i + 2) + TD1List.ElementAt(i + 3) + TD1List.ElementAt(i + 4));
                        var TS2 = (TS2List.ElementAt(i) + TS2List.ElementAt(i + 1) + TS2List.ElementAt(i + 2) + TS2List.ElementAt(i + 3) + TS2List.ElementAt(i + 4));
                        var TD2 = (TD2List.ElementAt(i) + TD2List.ElementAt(i + 1) + TD2List.ElementAt(i + 2) + TD2List.ElementAt(i + 3) + TD2List.ElementAt(i + 4));

                        screwcompressorFuturePrediction.SCFPId = 0;
                        screwcompressorFuturePrediction.UserId = userId;
                        screwcompressorFuturePrediction.TenantId = TenantIdList.First();
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
                        screwcompressorFuturePrediction.PredictedDate = DateList.Last();
                        _context.ScrewCompressureFuturePrediction.Add(screwcompressorFuturePrediction);
                        await _context.SaveChangesAsync();

                    }

                    return Ok(1);

                }

                return Ok(0);

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
    }
}
