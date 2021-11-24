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
        public async Task<ActionResult<IEnumerable<XFMEAPrescriptiveModel>>> GetFMEAPrescriptiveModel(string userId)
        {
            try
            {
                return await _context.FMEAPrescriptiveModelData.Where(a => a.UserId == userId)
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
                 var failuremodes = fMEAPrescriptiveModel.FMEAPrescriptiveFailureModes;
                 fMEAPrescriptiveModel.FMEAPrescriptiveFailureModes = null;
                 await _context.FMEAPrescriptiveModelData.AddAsync(fMEAPrescriptiveModel);
                 await _context.SaveChangesAsync();
         
                 for (int i = 0; i < failuremodes.Count; i++)
                 {
                     failuremodes[i].CFPPrescriptiveId = fMEAPrescriptiveModel.CFPPrescriptiveId;
                     await _context.XFMEAPrescriptiveFailureModes.AddAsync(failuremodes[i]);
                     await _context.SaveChangesAsync();
                 }
                 
                 return Ok();
             }
         
             catch (System.Exception exe)
             {
         
                 return BadRequest(exe.Message);
             }
         }
         
         
         // PUT api/<FMEAPrescriptiveAPIController>/5
         [HttpPut]
         public async Task<IActionResult> PutFMEAModel(XFMEAPrescriptiveModel fMEAPrescriptiveModel)
         {
             try
             {
                 _context.Entry(fMEAPrescriptiveModel).State = EntityState.Modified;
                 await _context.SaveChangesAsync();
         
                 return Ok();
             }
             catch (Exception exe)
             {
         
                 return BadRequest(exe.Message);
             }
         
         
         }
         
          // DELETE api/<FMEAPrescriptiveAPIController>/5
          [HttpDelete("{id}")]
          public async Task<IActionResult> DeleteFMEAModel(int id)
          {
              var FMEAObj = await _context.FMEAPrescriptiveModelData.FindAsync(id);
              if (FMEAObj == null)
              {
                return NotFound();
              }
              _context.FMEAPrescriptiveModelData.Remove(FMEAObj);
              await _context.SaveChangesAsync();
              return NoContent();

          }
    }
}
