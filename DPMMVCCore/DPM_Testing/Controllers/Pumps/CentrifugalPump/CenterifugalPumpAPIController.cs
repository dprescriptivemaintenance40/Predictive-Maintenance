using DPM.Models.PumpModel;
using DPM_ServerSide.DAL;
using DPM_Testing.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace DPM.Controllers.Pumps
{
    [Route("api/[controller]")]
    [ApiController]
    public class CenterifugalPumpAPIController : ControllerBase
    {
        private readonly DPMDal _context;

        public CenterifugalPumpAPIController(DPMDal context)
        {
            _context = context;
        }
        [HttpGet]
        [Route("GetCentrifugalPumpDailyData")]
        public async Task<ActionResult<IEnumerable<CentrifugalPumpModel>>> GetCenterifugalPump()
        {
            try
            {
                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                return await _context.CentrifugalPumpModelData.Where(a => a.UserId == userId).OrderByDescending(a => a.Date).ToListAsync();
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }

        [HttpPost]
        [Route("PostCentrifugalPumpDailyData")]
        public async Task<ActionResult<CentrifugalPumpModel>> PostCenterifugalPump([FromBody] List<CentrifugalPumpModel> centrifugalPumpModel)
        {
            try
            {
                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                DateTime d1 = DateTime.Now;
                var collection = centrifugalPumpModel.ToList();
                foreach (var item in collection)
                {
                    item.InsertedDate = d1.Date;
                    item.UserId = userId;
                    _context.CentrifugalPumpModelData
                        .Add(item);
                    await _context.SaveChangesAsync();
                }
                return Ok(collection);

            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }


        [HttpGet]
        [Route("GetCentrifugalPumpWeekData")]
        public async Task<ActionResult<IEnumerable<CentrifugalPumpWeekDataModel>>> GetCentrifugalPumpWeekDataModel()
        {
            try
            {
                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                return await _context.CentrifugalPumpWeekDataModel.Where(a => a.UserId == userId).OrderByDescending(a => a.Date).ToListAsync();
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }

        [HttpPost]
        [Route("PostCentrifugalPumpWeekData")]
        public async Task<ActionResult<CentrifugalPumpWeekDataModel>> PostCentrifugalPumpWeekDataModel([FromBody] List<CentrifugalPumpWeekDataModel> centrifugalPumpWeekDataModel)
        {
            try
            {
                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                DateTime d1 = DateTime.Now;
                var collection = centrifugalPumpWeekDataModel.ToList();
                foreach (var item in collection)
                {
                    item.InsertedDate = d1.Date;
                    item.UserId = userId;
                    item.Date = item.Date.Date;
                    _context.CentrifugalPumpWeekDataModel
                        .Add(item);
                    await _context.SaveChangesAsync();
                }
                return Ok(collection);

            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }

        [HttpGet]
        [Route("GetWeekDates")]
        public async Task<IActionResult> GetRecords(string FromDate, string ToDate, string VendorId)
        {
            try
            {

                string userId;
                if (VendorId == "")
                {
                    userId = User.Claims.First(c => c.Type == "UserID").Value;
                }
                else
                {
                    userId = VendorId;
                }
                DateTime d = Convert.ToDateTime(FromDate);
                DateTime d1 = Convert.ToDateTime(ToDate);

                List<CentrifugalPumpWeekDataModel> centrifugalPumpWeekDataModel =
                                                    await _context.CentrifugalPumpWeekDataModel
                                                             .Where(a => a.UserId == userId
                                                              && (a.Date >= d.Date
                                                              && a.Date <= d1.Date))
                                                              .ToListAsync();
                var data = centrifugalPumpWeekDataModel.ToList();
                return Ok(data);


            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }

        }


        [HttpGet]
        [Route("GetDailyDates")]
        public async Task<IActionResult> DailyDates(string FromDate, string ToDate, string VendorId)
        {
            try
            {
                string userId;
                if(VendorId == "")
                {
                    userId = User.Claims.First(c => c.Type == "UserID").Value;
                }
                else
                {
                    userId = VendorId;
                }    
                DateTime d = Convert.ToDateTime(FromDate);
                DateTime d1 = Convert.ToDateTime(ToDate);


                List<CentrifugalPumpModel> centrifugalPumpModel =
                                                     await _context.CentrifugalPumpModelData
                                                             .Where(a => a.UserId == userId
                                                              && (a.Date >= d.Date
                                                              && a.Date <= d1.Date))
                                                              .ToListAsync();
                var data = centrifugalPumpModel.ToList();
                return Ok(data);

            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }

        }

        [HttpGet]
        [Route("GetVendorList")]
        public async Task<IActionResult> GetvendorList()
        {
            try
            {
                var List = await _context.RegisterUsers.Where(a => a.UserType == 3).ToListAsync();
                return Ok(List);
            }
            catch (Exception exe)
            {

                return BadRequest(exe.Message);
            }
        }

        [HttpPost]
        [Route("PostHQLibrary")]
        public async Task<IActionResult> PostHQData([FromBody] List<CentrifugalPumpHQLibraryModel> centrifugalPumpHQLibrary)
        {
            try
            {
                var collection = centrifugalPumpHQLibrary.ToList();
                foreach (var item in collection)
                {
                    _context.CentrifugalPumpHQLibraryModels.Add(item);
                    await _context.SaveChangesAsync();
                }
                return Ok();

            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }

        [HttpGet]
        [Route("CPTrain")]
        public async Task<IActionResult> GetHQData()
        {
            try
            {
                var ScrewCompressorConfigurationModel = await _context.AddRuleModels.Where(a => a.MachineType == "Pump" && a.EquipmentType == "Centrifugal Pump").OrderBy(a=>a.AddRuleId).ToListAsync();

                decimal Dcustomer = Convert.ToDecimal(ScrewCompressorConfigurationModel[0].Alarm);
                decimal HAlaram = Convert.ToDecimal(ScrewCompressorConfigurationModel[1].Alarm);
                decimal HTrigger = Convert.ToDecimal(ScrewCompressorConfigurationModel[1].Trigger);
                var Formula= ScrewCompressorConfigurationModel[2].Columns;

                List<CentrifugalPumpHQLibraryModel> centrifugalPumpHQLibraryModel = await _context.CentrifugalPumpHQLibraryModels.OrderBy(a => a.CentrifugalPumpHQLibraryID).ToListAsync();
                var HQLibraryList = centrifugalPumpHQLibraryModel.ToList();
                List<decimal> QLlist = new List<decimal>();
                foreach (var item in HQLibraryList)
                {
                 //   QLlist.Add(item.Q);
                }
                decimal P1 = 0.1m;
                decimal P2 = 2.3m;

                decimal HCustomernumber = 10 * (P2 - P1) / Dcustomer;
                decimal Qnumber = 1100m;
                decimal Firstclosest = QLlist.Aggregate((x, y) => Math.Abs(x - Qnumber) < Math.Abs(y - Qnumber) ? x : y);
                int Firstclosestindex = QLlist.IndexOf(Firstclosest);
               
                if (Firstclosestindex != -1)
                {
                    decimal difference;
                    if (Qnumber < Firstclosest)
                    {
                        Firstclosestindex = Firstclosestindex - 1;
                        difference = Firstclosest - Qnumber;
                    }
                    else
                    {
                        difference = Qnumber - Firstclosest;
                    }
                    var FirstClosestValue = HQLibraryList[Firstclosestindex];
                    var FirstHClose = FirstClosestValue.H;
                    var FirstQClose = FirstClosestValue.Q;
                    var SecondClosestValue = HQLibraryList[Firstclosestindex + 1];
                    var SecondHClose = SecondClosestValue.H;
                    var SecondQClose = SecondClosestValue.Q;
                    var ValueDifference = SecondQClose - FirstQClose;
                    var DeviationH = (FirstHClose - SecondHClose) / ValueDifference;
                 //   var HValueLibrary = FirstHClose - (DeviationH * difference);
                 //   var Trigger = (HValueLibrary * HTrigger); // Trigger
                //    var Alarm = ((HValueLibrary * HAlaram)); // Alarm
                    //string result = "";
                    //if (Trigger >= HCustomernumber)
                    //{
                    //     result = "Degrade";
                    //}
                    //else if (Alarm >= HCustomernumber)
                    //{
                    //     result = "Incipient"; 
                    //}
                    //else 
                    //{
                    //     result = "Normal";
                    //}

                }
                return Ok();
            }
            catch (Exception exe)
            {

                return BadRequest(exe.Message);
            }
        }

    }
}
