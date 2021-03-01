using DPM_ServerSide.DAL;
using DPM_Testing.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DPM.Controllers.Compressors.ScrewCompressor
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ScrewCompressorTrainChartAPIController : ControllerBase
    {
        private readonly DPMDal _context;

        public ScrewCompressorTrainChartAPIController(DPMDal context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("GetPreviousWeek")]
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

                IQueryable<ScrewCompressorTrainClassificationModel>
                           screwCompressorClassification =  _context.ScrewCompressureTrainClassifications
                                                                  .Where(a => a.UserId == userId
                                                                      && ( a.InsertedDate >= previousMonday 
                                                                      && a.InsertedDate <= previousSunday))
                                                                      .AsQueryable();
                var ClassificationData = screwCompressorClassification.ToList();
                return Ok(ClassificationData);

            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }

        }


        [HttpGet("{id}")]
        [Route("ScrewTrainLastUpload")]

        public IActionResult GetLastUpload(string LastUploadDate)
        {
            try
            {

                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                DateTime dt = Convert.ToDateTime(LastUploadDate);
                DateTime lastUpload = dt.Date;

                IQueryable<ScrewCompressorTrainClassificationModel> screwCompressorClassification = _context.ScrewCompressureTrainClassifications.Where(a => a.UserId == userId && a.InsertedDate == lastUpload).AsQueryable();
                var ClassificationData = screwCompressorClassification.ToList();
                return Ok(ClassificationData);
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }

        }


        [HttpGet]
        [Route("ScrewTrainPreviousMonth")]
        public IActionResult GetPreviousMonth()
        { 
            DateTime d = DateTime.Now;
            d = d.AddMonths(-1);
            var Month = d.Month;
            var Year = d.Year;
            string userId = User.Claims.First(c => c.Type == "UserID").Value;
            try
            {
                IQueryable<ScrewCompressorTrainClassificationModel> screwCompressorClassification = 
                                                     _context.ScrewCompressureTrainClassifications
                                                             .Where(a => a.UserId == userId 
                                                                 && a.InsertedDate.Date.Year == Year
                                                                 && a.InsertedDate.Date.Month == Month)
                                                                .AsQueryable();
                var ClassificationData = screwCompressorClassification.ToList();
                return Ok(ClassificationData);
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }
    }
}
