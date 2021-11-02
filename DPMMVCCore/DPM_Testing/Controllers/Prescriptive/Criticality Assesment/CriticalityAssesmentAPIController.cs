using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using DPM_ServerSide.DAL;
using DPM.Models;
using System;

namespace DPM_Testing.Controllers
{
    [Authorize]   
    [Route("api/[controller]")]
    [ApiController]
    public class CriticalityAssesmentAPIController : ControllerBase
    {
        private readonly DPMDal _context;

        public CriticalityAssesmentAPIController(DPMDal context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("GetAllCARecords")]
        public async Task<ActionResult<IEnumerable<CriticalityAssesmentModel>>> GetCriticalityAssesmentModel()
        {
              return await _context.CriticalityAssesmentModels.OrderBy(a=> a.CAId).ToListAsync();
        }



        [HttpPost]
        [Route("CASingleRecordPost")]
        public async Task<ActionResult<CriticalityAssesmentModel>> PostCriticalityAssesmentModel(CriticalityAssesmentModel criticalityAssesmentModel)
        {
            try
            {
                await _context.CriticalityAssesmentModels.AddAsync(criticalityAssesmentModel);
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception exe)
            {

                return BadRequest(exe.Message);
            }
        }

        [HttpPost]
        [Route("CAExcelPost")]
        public async Task<ActionResult<CriticalityAssesmentModel>> PostExcelCriticalityAssesmentList(List<CriticalityAssesmentModel> criticalityAssesmentModel)
        {
            try
            {
                await _context.CriticalityAssesmentModels.AddRangeAsync(criticalityAssesmentModel);
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception exe)
            {

                return BadRequest(exe.Message);
            }
        }
        [HttpDelete("{Id}")]
        public async Task<ActionResult> Delete(int Id)
        {
            try { 
           
             var RBDObj = await _context.RBDModels.FindAsync(Id);
            _context.RBDModels.Remove(RBDObj);
                await _context.SaveChangesAsync();
            
                return Ok();

            }
            catch (Exception exc)
            {

                return BadRequest(exc.Message);
            }
            
        }

    }
}
