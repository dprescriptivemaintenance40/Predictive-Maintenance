using DPM.Models.PumpModel;
using DPM_ServerSide.DAL;
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

    }
}
