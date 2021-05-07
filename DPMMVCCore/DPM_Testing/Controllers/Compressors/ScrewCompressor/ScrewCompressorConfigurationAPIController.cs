using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DPM_Testing.Models;
using Microsoft.AspNetCore.Authorization;
using DPM_ServerSide.DAL;

namespace DPM_Testing.Controllers
{
    [Authorize]   
    [Route("api/[controller]")]
    [ApiController]
    public class ScrewCompressorConfigurationAPIController : ControllerBase
    {
        private readonly DPMDal _context;

        public ScrewCompressorConfigurationAPIController(DPMDal context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ScrewCompressorConfigurationModel>>> GetAddRuleModels()
        {
              return await _context.AddRuleModels.OrderBy(a=> a.AddRuleId).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ScrewCompressorConfigurationModel>> GetAddRuleModel(int id)
        {
            var addRuleModel = await _context.AddRuleModels.FindAsync(id);

            if (addRuleModel == null)
            {
                return NotFound();
            }

            return addRuleModel;
        }

        [HttpPut]
        public async Task<IActionResult> PutAddRuleModel(ScrewCompressorConfigurationModel addRuleModel)
        {
            int id = addRuleModel.AddRuleId;
            if (id != addRuleModel.AddRuleId)
            {
                return BadRequest();
            }

            _context.Entry(addRuleModel).State = EntityState.Modified;

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
        public async Task<ActionResult<ScrewCompressorConfigurationModel>> PostAddRuleModel(ScrewCompressorConfigurationModel addRuleModel)
        {
            _context.AddRuleModels.Add(addRuleModel);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAddRuleModel", new { id = addRuleModel.AddRuleId }, addRuleModel);
        }

        private bool AddRuleModelExists(int id)
        {
            return _context.AddRuleModels.Any(e => e.AddRuleId == id);
        }
    }
}
