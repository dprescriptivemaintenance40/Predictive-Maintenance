using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using DPM_ServerSide.DAL;
using DPM.Models.Prescriptive;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace DPM.Controllers.Prescriptive.FMEA
{
    [Route("api/[controller]")]
    [ApiController]
    public class FMEAPrescriptiveAPIController : ControllerBase
    {
        private readonly DPMDal _context;
        

        public FMEAPrescriptiveAPIController(DPMDal context)
        {
            _context = context;
        }


        // GET: api/<FMEAPrescriptiveAPIController>
        [HttpGet]
        [Route("GetXFMEARecords")]
        public async Task<ActionResult<IEnumerable<XFMEAPrescriptiveModel>>> GetFMEAPrescriptiveModel(string UserId)
        {
            try
            {
                var userid = UserId;
                return await _context.FMEAPrescriptiveModelData.Where(a => a.UserId == userid)
                                                           .Include(a => a.FMEAPrescriptiveFailureModes)
                                                           .OrderByDescending(a => a.CFPPrescriptiveId)
                                                           .ToListAsync();
            }
            catch (Exception exe)
            {

                return BadRequest(exe.Message);
            }
        }



        // POST api/<FMEAPrescriptiveAPIController>
        [HttpPost]
         [Route("FMEAPrescriptiveModelData")]
         public async Task<ActionResult<XFMEAPrescriptiveModel>> PostFMEAModel([FromBody] XFMEAPrescriptiveModel fMEAPrescriptiveModel)
         {
             try
             {
                 string userid = User.Claims.First(c => c.Type == "UserID").Value;
                 var failuremodes = fMEAPrescriptiveModel.FMEAPrescriptiveFailureModes;
                 fMEAPrescriptiveModel.FMEAPrescriptiveFailureModes = null;
                 fMEAPrescriptiveModel.UserId = userid;
                 await _context.FMEAPrescriptiveModelData.AddAsync(fMEAPrescriptiveModel);
                 await _context.SaveChangesAsync();
         
                 for (int i = 0; i < failuremodes.Count; i++)
                 {
                     failuremodes[i].CFPPrescriptiveId = fMEAPrescriptiveModel.CFPPrescriptiveId;
                     await _context.XFMEAPrescriptiveFailureModes.AddAsync(failuremodes[i]);
                     await _context.SaveChangesAsync();
                 }
                 List<XFMEAPrescriptiveModel> XFMEAPrescriptiveModels = await _context.FMEAPrescriptiveModelData.Where(a => a.CFPPrescriptiveId == fMEAPrescriptiveModel.CFPPrescriptiveId)
                                                                            .Include(a => a.FMEAPrescriptiveFailureModes)
                                                                            .ToListAsync();
                     
                 return Ok(XFMEAPrescriptiveModels);
             }
         
             catch (System.Exception exe)
             {
         
                 return BadRequest(exe.Message);
             }
         }
         
         
         // PUT api/<FMEAPrescriptiveAPIController>/5
         [HttpPut]
         [Route("XFMEAPrescriptiveAdd")]
         public async Task<IActionResult> PutFMEAModel(XFMEAPrescriptiveModel fMEAPrescriptiveModel)
         {
             try
             {
                var failuremodes = fMEAPrescriptiveModel.FMEAPrescriptiveFailureModes;
                string userid = User.Claims.First(c => c.Type == "UserID").Value;
                fMEAPrescriptiveModel.UserId = userid;
                fMEAPrescriptiveModel.FMEAPrescriptiveFailureModes = null;
                _context.Entry(fMEAPrescriptiveModel).State = EntityState.Modified;
                 await _context.SaveChangesAsync();

                for (int i = 0; i < failuremodes.Count; i++)
                {
                    failuremodes[i].CFPPrescriptiveId = fMEAPrescriptiveModel.CFPPrescriptiveId;
                    _context.Entry(failuremodes[i]).State = EntityState.Modified;
                    await _context.SaveChangesAsync();

                }

                return Ok();
             }
             catch (Exception exe)
             {
         
                 return BadRequest(exe.Message);
             }
         
         
         }
         
          // DELETE api/<FMEAPrescriptiveAPIController>/5
          [HttpDelete]
          [Route("DeleteXFMEAPrespectiveModel")]
          public async Task<IActionResult> DeleteFMEAModel(int id)
          {

            try
            {
                var FMEAObj = _context.FMEAPrescriptiveModelData.Where(a => a.CFPPrescriptiveId == id)
                                                            .Include(a => a.FMEAPrescriptiveFailureModes)
                                                            .First();
                _context.FMEAPrescriptiveModelData.Remove(FMEAObj);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }
    }
}
