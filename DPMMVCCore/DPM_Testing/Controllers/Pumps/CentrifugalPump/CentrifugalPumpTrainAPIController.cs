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
                List<CentrifugalPumpTrainModel> centrifugalPumpClassification = await _context.CentrifugalPumpTrainData.Where(a => a.UserId == userId).ToListAsync();
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
                var ScrewCompressorConfigurationModel = await _context.AddRuleModels.Where(a => a.MachineType == "Pump" && a.EquipmentType == "Centrifugal Pump").OrderBy(a => a.AddRuleId).ToListAsync();

                decimal Dcustomer = Convert.ToDecimal(ScrewCompressorConfigurationModel[0].Alarm);
                decimal HAlaram = Convert.ToDecimal(ScrewCompressorConfigurationModel[1].Alarm);
                decimal HTrigger = Convert.ToDecimal(ScrewCompressorConfigurationModel[1].Trigger);
                var Formula = ScrewCompressorConfigurationModel[2].Columns;

                List<CentrifugalPumpHQLibraryModel> centrifugalPumpHQLibraryModel = await _context.CentrifugalPumpHQLibraryModels.OrderBy(a => a.CentrifugalPumpHQLibraryID).ToListAsync();
                var HQLibraryList = centrifugalPumpHQLibraryModel.ToList();
                List<decimal> QLlist = new List<decimal>();
                string result = "";
                foreach (var i in HQLibraryList)
                {
                    QLlist.Add(i.Q);
                }
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

                    decimal P1 = item.P1;
                    decimal P2 = item.P2;

                    decimal HCustomernumber = 10 * (P2 - P1) / Dcustomer;
                    decimal Qnumber = item.Q;
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
                        var HValueLibrary = FirstHClose - (DeviationH * difference);
                        var Trigger = (HValueLibrary * HTrigger); // Trigger
                        var Alarm = ((HValueLibrary * HAlaram)); // Alarm
                        
                        if (Trigger >= HCustomernumber)
                        {
                            result = "Degrade";
                        }
                        else if (Alarm >= HCustomernumber)
                        {
                            result = "Incipient";
                        }
                        else
                        {
                            result = "Normal";
                        }

                    }
                    item.Classification = result;
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
