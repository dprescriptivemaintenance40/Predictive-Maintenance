using DPM.Models.PumpModel;
using DPM_ServerSide.DAL;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace DPM.Controllers.Pumps.CentrifugalPump
{
    [Route("api/[controller]")]
    [ApiController]

    public class CentrifugalPumpTrainAPIController : ControllerBase
    {
        private readonly DPMDal _context;

        public CentrifugalPumpTrainAPIController(DPMDal context)
        {
            _context = context;
        }
        [HttpGet]
        [Route("getConfiguration")]
        public async Task<IActionResult>  GetClassification()
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;
            try
            {
                List<CentrifugalPumpTrainClassificationModel> centrifugalPumpClassification = await _context.CentrifugalPumpTrainClassifications.Where(a => a.UserId == userId).ToListAsync();
                var PumpClassificationData = centrifugalPumpClassification.ToList();
                return Ok(PumpClassificationData);
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }

        }
        [HttpPost]
        [Route("PumpConfiguration")]
        public async Task<IActionResult> PostConfiguration([FromBody] List<CentrifugalPumpTrainModel> pumpdetails)
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;

            try
            {
                foreach (var item in pumpdetails)
                {
                    DateTime datetime = item.InsertedDate;
                    if (datetime == DateTime.MinValue)
                    {
                        item.InsertedDate = DateTime.Now;
                    }
                    DateTime dt = item.InsertedDate;
                    DateTime dateOnly = dt.Date;
                    item.InsertedDate = dateOnly;
                    item.UserId = userId;
                    _context.CentrifugalPumpTrainData.Add(item);
                    await _context.SaveChangesAsync();

                }
                return Ok(pumpdetails);
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }

        }
       
    }
}
