using DPM_ServerSide.DAL;
using DPM_ServerSide.Models.CompressorModel.ScrewCompressorModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DPM.Controllers.Compressors.ScrewCompressor
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ScrewCompressorPredictionChartAPIController : ControllerBase
    {
        private readonly DPMDal _context;

        public ScrewCompressorPredictionChartAPIController(DPMDal context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("GetPredictionPreviousWeek")]
        public async Task<IActionResult> GetPreviousWeek()
        {
            try
            {

                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                DateTime date = DateTime.Now;
                DateTime mondayOfLastWeek = date.AddDays(-Convert.ToInt32(date.DayOfWeek) - 6);
                DateTime sundayOfLastWeek = date.AddDays(-Convert.ToInt32(date.DayOfWeek));
                DateTime dt = mondayOfLastWeek;
                DateTime dt1 = sundayOfLastWeek;
                DateTime previousMonday = dt.Date;
                DateTime previousSunday = dt1.Date;

                List<ScrewCompressorPredictionModel>
                           screwCompressorPrediction = await _context.ScrewCompressurePredictionData
                                                                  .Where(a => a.UserId == userId
                                                                      && (a.InsertedDate >= previousMonday
                                                                      && a.InsertedDate <= previousSunday)
                                                                      && a.Prediction != null)
                                                                      .ToListAsync();
                var predictionData = screwCompressorPrediction.ToList();
                return Ok(predictionData);

            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }

        }


        [HttpGet]
        [Route("ScrewPredictionLastUpload")]

        public async Task<IActionResult> GetLastUpload(string LastUploadDate)
        {
            try
            {

                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                DateTime dt = Convert.ToDateTime(LastUploadDate);
                DateTime lastUpload = dt.Date;

                List<ScrewCompressorPredictionModel> screwCompressorPrediction = await _context.ScrewCompressurePredictionData.Where(a => a.UserId == userId && a.InsertedDate == lastUpload && a.Prediction != null).ToListAsync();
                var predictionData = screwCompressorPrediction.ToList();
                return Ok(predictionData);
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }

        }


        [HttpGet]
        [Route("ScrewPredictionPreviousMonth")]
        public async Task<IActionResult> GetPreviousMonth()
        {
            DateTime d = DateTime.Now;
            d = d.AddMonths(-1);
            var Month = d.Month;
            var Year = d.Year;
            string userId = User.Claims.First(c => c.Type == "UserID").Value;
            try
            {
                List<ScrewCompressorPredictionModel> screwCompressorPrediction =
                                                      await _context.ScrewCompressurePredictionData
                                                             .Where(a => a.UserId == userId
                                                                 && (a.InsertedDate.Date.Year == Year
                                                                 && a.InsertedDate.Date.Month == Month)
                                                                 && a.Prediction != null)
                                                                .ToListAsync();
                var predictionData = screwCompressorPrediction.ToList();
                return Ok(predictionData);
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }
    }
}
