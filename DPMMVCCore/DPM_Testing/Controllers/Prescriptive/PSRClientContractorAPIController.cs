using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DPM_Testing.Models;
using Microsoft.AspNetCore.Authorization;
using DPM_ServerSide.DAL;
using DPM.Models.Prescriptive.PSR;

namespace DPM_Testing.Controllers
{
    [Authorize]   
    [Route("api/[controller]")]
    [ApiController]
    public class PSRClientContractorAPIController : ControllerBase
    {
        private readonly DPMDal _context;

        public PSRClientContractorAPIController(DPMDal context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("GetAllConfigurationRecords")]
        public async Task<ActionResult<IEnumerable<PSRClientContractorModel>>> GetPSRClientContractorModels()
        {
              return await _context.PSRClientContractorModels.OrderBy(a=> a.PSRClientContractorId).ToListAsync();
        }

        [HttpGet("{id}")]
        [Route("GetRecordById")]
        public async Task<ActionResult<PSRClientContractorModel>> GetPSRClientContractorModel(int id)
        {
            var psrClientContractorModel = await _context.PSRClientContractorModels.FindAsync(id);

            if (psrClientContractorModel == null)
            {
                return NotFound();
            }

            return psrClientContractorModel;
        }

        [HttpPut]
        public async Task<IActionResult> PutAddRuleModel(PSRClientContractorModel psrClientContractorModel)
        {
            int id = psrClientContractorModel.PSRClientContractorId;
            if (id != psrClientContractorModel.PSRClientContractorId)
            {
                return BadRequest();
            }

            _context.Entry(psrClientContractorModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PSRClientContractorModelExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<PSRClientContractorModel>> PostAddRuleModel(PSRClientContractorModel psrClientContractorModel)
        {
            try
            {
                psrClientContractorModel.UserId = User.Claims.First(c => c.Type == "UserID").Value;
                _context.PSRClientContractorModels.Add(psrClientContractorModel);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetPSRClientContractorModel", new { id = psrClientContractorModel.PSRClientContractorId }, psrClientContractorModel);
            }
            catch (System.Exception exe)
            {

                return BadRequest(exe.Message);
            }
        }

        private bool PSRClientContractorModelExists(int id)
        {
            return _context.PSRClientContractorModels.Any(e => e.PSRClientContractorId == id);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePSRClientContractorModel(int id)
        {
            var psrClientContractorModel = await _context.PSRClientContractorModels.FindAsync(id);
            if (psrClientContractorModel == null)
            {
                return NotFound();
            }

            _context.PSRClientContractorModels.Remove(psrClientContractorModel);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
