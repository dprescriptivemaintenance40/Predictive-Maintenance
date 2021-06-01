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
    public class CenterifugalPumpConfigurationAPIController : ControllerBase
    {
        private readonly DPMDal _context;

        public CenterifugalPumpConfigurationAPIController(DPMDal context)
        {
            _context = context;
        }
        // GET: api/<CenterifugalPumpConfigurationAPIController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CentrifugalPumpConfigurationModel>>> GetAddRuleModels()
        {
            return await _context.PumpAddRuleModels.OrderBy(a => a.AddPumpRuleId).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CentrifugalPumpConfigurationModel>> GetAddRuleModel(int id)
        {
            var addPumpRuleModel = await _context.PumpAddRuleModels.FindAsync(id);

            if (addPumpRuleModel == null)
            {
                return NotFound();
            }

            return addPumpRuleModel;
        }

        [HttpPut]
        public async Task<IActionResult> PutAddRuleModel(CentrifugalPumpConfigurationModel addPumpRuleModel)
        {
            int id = addPumpRuleModel.AddPumpRuleId;
            if (id != addPumpRuleModel.AddPumpRuleId)
            {
                return BadRequest();
            }

            _context.Entry(addPumpRuleModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AddRuleModelExists(id))
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
        public async Task<ActionResult<CentrifugalPumpConfigurationModel>> PostAddRuleModel(CentrifugalPumpConfigurationModel addPumpRuleModel)
        {
            _context.PumpAddRuleModels.Add(addPumpRuleModel);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAddRuleModel", new { id = addPumpRuleModel.AddPumpRuleId }, addPumpRuleModel);
        }

        private bool AddRuleModelExists(int id)
        {
            return _context.PumpAddRuleModels.Any(e => e.AddPumpRuleId == id);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAddRuleModel(int id)
        {
            var pumprulemodel = await _context.PumpAddRuleModels.FindAsync(id);
            if (pumprulemodel == null)
            {
                return NotFound();
            }

            _context.PumpAddRuleModels.Remove(pumprulemodel);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
