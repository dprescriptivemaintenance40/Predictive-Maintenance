using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using DPM_ServerSide.DAL;
using DPM.Models.Prescriptive.PSR;

namespace DPM_Testing.Controllers
{
    [Authorize]   
    [Route("api/[controller]")]
    [ApiController]
    public class MSSStartegyAPIController : ControllerBase
    {
        private readonly DPMDal _context;

        public MSSStartegyAPIController(DPMDal context)
        {
            _context = context;
        }

        [HttpPost]
        [Route("PostMSSStratgyList")]
        public async Task<ActionResult> Post(List<MSSStrategyModel> mSSStrategyModels)
        {
            try
            {
                foreach (var item in mSSStrategyModels)
                {
                    _context.MSSStrategyModels.Add(item);
                    await _context.SaveChangesAsync();
                }
                return Ok();
            }
            catch (System.Exception exe)
            {

                return BadRequest(exe.Message);
            }
        }

        [HttpGet]
        [Route("GetAllConfigurationRecords")]
        public async Task<ActionResult<IEnumerable<MSSStrategyModel>>> GetMSSStrategyModel()
        {
              return await _context.MSSStrategyModels.OrderBy(a=> a.MSSStrategyModelId).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MSSStrategyModel>> GetMSSStrategyModel(int id)
        {
            var MSSStrategyModel = await _context.MSSStrategyModels.FindAsync(id);

            if (MSSStrategyModel == null)
            {
                return NotFound();
            }

            return MSSStrategyModel;
        }

        [HttpPut]
        public async Task<IActionResult> PutMSSStrategyModel(MSSStrategyModel mssStrategyModel)
        {
            int id = mssStrategyModel.MSSStrategyModelId;
            if (id != mssStrategyModel.MSSStrategyModelId)
            {
                return BadRequest();
            }

            _context.Entry(mssStrategyModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MSSStrategyModelExists(id))
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
        public async Task<ActionResult<MSSStrategyModel>> PostAddRuleModel(MSSStrategyModel mssStrategyModel)
        {
            try
            {
                _context.MSSStrategyModels.Add(mssStrategyModel);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetMSSStrategyModel", new { id = mssStrategyModel.MSSStrategyModelId }, mssStrategyModel);
            }
            catch (System.Exception exe)
            {

                return BadRequest(exe.Message);
            }
        }

        private bool MSSStrategyModelExists(int id)
        {
            return _context.MSSStrategyModels.Any(e => e.MSSStrategyModelId == id);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMSSStrategyModel(int id)
        {
            var mssStrategyModel = await _context.MSSStrategyModels.FindAsync(id);
            if (mssStrategyModel == null)
            {
                return NotFound();
            }

            _context.MSSStrategyModels.Remove(mssStrategyModel);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
