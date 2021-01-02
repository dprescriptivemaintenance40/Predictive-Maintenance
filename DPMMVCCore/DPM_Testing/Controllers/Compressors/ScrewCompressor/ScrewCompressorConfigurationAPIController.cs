using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DPM_Testing.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authorization;
using DPM_ServerSide.DAL;

namespace DPM_Testing.Controllers
{
    
    //[EnableCors("MyAllowSpecificOrigins")]
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

        // GET: api/AddRuleModeAPI
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ScrewCompressorConfigurationModel>>> GetAddRuleModels()
        {
              return await _context.AddRuleModels.OrderBy(a=> a.AddRuleId).ToListAsync();
          //  return await _context.AddRuleModels.Where(w => w.AddRuleId == '1').Take(8).ToListAsync();
        }

        // GET: api/AddRuleModeAPI/5
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

        // PUT: api/AddRuleModeAPI/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAddRuleModel(int id, ScrewCompressorConfigurationModel addRuleModel)
        {
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

        // POST: api/AddRuleModeAPI
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ScrewCompressorConfigurationModel>> PostAddRuleModel(ScrewCompressorConfigurationModel addRuleModel)
        {
            _context.AddRuleModels.Add(addRuleModel);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAddRuleModel", new { id = addRuleModel.AddRuleId }, addRuleModel);
        }

        // DELETE: api/AddRuleModeAPI/5
        [HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteAddRuleModel(int id)
        //{
        //    var addRuleModel = await _context.AddRuleModels.FindAsync(id);
        //    if (addRuleModel == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.AddRuleModels.Remove(addRuleModel);
        //    await _context.SaveChangesAsync();

        //    return NoContent();
        //}

        private bool AddRuleModelExists(int id)
        {
            return _context.AddRuleModels.Any(e => e.AddRuleId == id);
        }
    }
}
