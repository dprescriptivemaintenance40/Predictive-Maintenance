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
    public class CentrifugalPumpPredictionAPIController : ControllerBase
    {
        private readonly DPMDal _context;
        public CentrifugalPumpPredictionAPIController(DPMDal context)
        {
            _context = context;
        }
        [HttpGet]
        [Route("GetAllPredictionRecords")]
        public async Task<IActionResult> GetAllPredictionRecords()
        {
            try
            {
                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                List<CentrifugalPumpPredictionModel> centrifugalPumpPredictionModel = await _context.CentrifugalPumpPredictions.Where(a => a.UserId == userId && a.Prediction != "pending").OrderBy(a => a.CentifugalPumpPID).ToListAsync();
                var PData = centrifugalPumpPredictionModel.ToList();
                return Ok();
            }
            catch (Exception exe)
            {

                return BadRequest(exe.Message);
            }
        }


        [HttpGet]
        [Route("GetCentrifugalPumpPredictionById")]
        public async Task<IActionResult> GetPredictionById(int PredictedId)
        {
            try
            {
                var Record = await _context.CentrifugalPumpPredictions.FirstOrDefaultAsync(a => a.CentifugalPumpPID == PredictedId);
                return Ok(Record);
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }

        }


        [HttpPost]
        [Route("CentrifugalPumpPredictionPost")]
        public async Task<IActionResult> Post([FromBody] List<CentrifugalPumpPredictionModel> CentrifugalPumpPredictionModel)
        {
            try
            {
                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                foreach (var item in CentrifugalPumpPredictionModel)
                {
                    DateTime datetime = item.InsertedDate;
                    if (datetime == DateTime.MinValue)
                    {
                        item.InsertedDate = DateTime.Now.Date;
                    }
                    item.InsertedDate = DateTime.Now.Date;
                    item.Prediction = "pending";
                    _context.CentrifugalPumpPredictions.Add(item);
                    await _context.SaveChangesAsync();
                }
                return Ok(CentrifugalPumpPredictionModel);
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }


        [HttpPost]
        [Route("CentrifugalPumpSinglePrediction")]
        public async Task<IActionResult> PostSinglePrediction([FromBody] CentrifugalPumpPredictionModel centrifugalPumpPredictionModel)
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;
            try
            {
                DateTime datetime = centrifugalPumpPredictionModel.InsertedDate;
                if (datetime == DateTime.MinValue)
                {
                    centrifugalPumpPredictionModel.InsertedDate = DateTime.Now.Date;
                }
                centrifugalPumpPredictionModel.TagNumber = "Single Prediction";
                centrifugalPumpPredictionModel.BatchId = "Single Prediction";
                centrifugalPumpPredictionModel.UserId = userId;
                centrifugalPumpPredictionModel.Prediction = "pending";
                _context.CentrifugalPumpPredictions.Add(centrifugalPumpPredictionModel);
                await _context.SaveChangesAsync();
                return Ok(centrifugalPumpPredictionModel);
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }

        }

    }
}
