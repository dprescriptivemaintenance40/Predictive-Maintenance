using DPM_ServerSide.DAL;
using DPM_ServerSide.Models.CompressorModel.ScrewCompressorModel;
using DPM_Testing.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

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


        // GET: api/<ScrewCompressorPredictionChartAPIController>
        [HttpGet]
        [Route("GetPredictionPreviousWeek")]
        public IActionResult GetPreviousWeek()
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

                IQueryable<ScrewCompressorPredictionModel>
                           screwCompressorPrediction = _context.ScrewCompressurePredictionData
                                                                  .Where(a => a.UserId == userId
                                                                      && (a.InsertedDate >= previousMonday
                                                                      && a.InsertedDate <= previousSunday)
                                                                      && a.Prediction != null )
                                                                      .AsQueryable();
                var predictionData = screwCompressorPrediction.ToList();
                return Ok(predictionData);

            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }

        }


        [HttpGet("{id}")]
        [Route("ScrewPredictionLastUpload")]

        public IActionResult GetLastUpload(string LastUploadDate)
        {
            try
            {

                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                DateTime dt = Convert.ToDateTime(LastUploadDate);
                DateTime lastUpload = dt.Date;

                IQueryable<ScrewCompressorPredictionModel> screwCompressorPrediction = _context.ScrewCompressurePredictionData.Where(a => a.UserId == userId && a.InsertedDate == lastUpload && a.Prediction != null).AsQueryable();
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
        public IActionResult GetPreviousMonth()
        {
            DateTime d = DateTime.Now;
            d = d.AddMonths(-1);
            var Month = d.Month;
            var Year = d.Year;
            string userId = User.Claims.First(c => c.Type == "UserID").Value;
            try
            {
                IQueryable<ScrewCompressorPredictionModel> screwCompressorPrediction =
                                                     _context.ScrewCompressurePredictionData
                                                             .Where(a => a.UserId == userId
                                                                 && ( a.InsertedDate.Date.Year == Year
                                                                 &&   a.InsertedDate.Date.Month == Month )
                                                                 &&   a.Prediction != null)
                                                                .AsQueryable();
                var predictionData = screwCompressorPrediction.ToList();
                return Ok(predictionData);
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }


        // POST api/<ScrewCompressorPredictionChartAPIController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<ScrewCompressorPredictionChartAPIController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<ScrewCompressorPredictionChartAPIController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
