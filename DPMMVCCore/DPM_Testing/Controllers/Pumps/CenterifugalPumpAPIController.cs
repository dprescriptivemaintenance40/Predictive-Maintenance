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
        public async Task <ActionResult<CentrifugalPumpModel>> PostCenterifugalPump([FromBody] List<CentrifugalPumpModel>  centrifugalPumpModel)
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
    }
}
