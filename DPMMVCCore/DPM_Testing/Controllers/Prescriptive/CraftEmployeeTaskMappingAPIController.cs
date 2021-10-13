using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DPM_Testing.Models;
using Microsoft.AspNetCore.Authorization;
using DPM_ServerSide.DAL;
using DPM.Models;

namespace DPM_Testing.Controllers
{
    [Authorize]   
    [Route("api/[controller]")]
    [ApiController]
    public class CraftEmployeeTaskMappingAPIController : ControllerBase
    {
        private readonly DPMDal _context;

        public CraftEmployeeTaskMappingAPIController(DPMDal context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("GetAllRecords")]
        public async Task<ActionResult<IEnumerable<CraftEmployeeTaskMappingModel>>> GetCraftEmployeeTaskMappingModels(string userId)
        {
            try
            {
                var records = await _context.CraftEmployeeTaskMappingModels.Where(a => a.UserId == userId)
                                                                                  .Include(a => a.CraftEmployeeTaskChild)
                                                                                  .ThenInclude(a=>a.EmployeeTaskListModels)
                                                                                  .OrderBy(a => a.CETId).ToListAsync();
                return Ok(records);
            }
            catch (System.Exception exe)
            {
                return BadRequest(exe.Message);
            }
              
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CraftEmployeeTaskMappingModel>> GetCraftEmployeeTaskMappingModel(int id)
        {
            var CraftEmployeeTaskMappingModel = await _context.CraftEmployeeTaskMappingModels.Where(r=>r.CETId == id).Include(r=>r.CraftEmployeeTaskChild).FirstOrDefaultAsync();

            if (CraftEmployeeTaskMappingModel == null)
            {
                return NotFound();
            }

            return CraftEmployeeTaskMappingModel;
        }

        [HttpPut]
        [Route("UpdateParent")]
        public async Task<IActionResult> PutCraftEmployeeTaskMappingModel(CraftEmployeeTaskMappingModel craftEmployeeTaskMappingModel)
        {
            int id = craftEmployeeTaskMappingModel.CETId;
            if (id != craftEmployeeTaskMappingModel.CETId)
            {
                return BadRequest();
            }
            craftEmployeeTaskMappingModel.CraftEmployeeTaskChild =null;
            _context.Entry(craftEmployeeTaskMappingModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CraftEmployeeTaskMappingModelExists(id))
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

        [HttpPut]
        [Route("UpdateChild")]
        public async Task<IActionResult> PutUpdateChild(CraftEmployeeTaskChild craftEmployeeTaskChild)
        {
            try
            {
                int id = craftEmployeeTaskChild.CETChildId;
                if (id != craftEmployeeTaskChild.CETChildId)
                {
                    return BadRequest();
                }
                _context.Entry(craftEmployeeTaskChild).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (System.Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }

        [HttpPost]
        [Route("PostParent")]
        public async Task<ActionResult<CraftEmployeeTaskMappingModel>> Post(CraftEmployeeTaskMappingModel craftEmployeeTaskMappingModels)
        {
            try
            {
                _context.CraftEmployeeTaskMappingModels.Add(craftEmployeeTaskMappingModels);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetCraftEmployeeTaskMappingModel", new { id = craftEmployeeTaskMappingModels.CETId }, craftEmployeeTaskMappingModels);
            }
            catch (System.Exception exe)
            {

                return BadRequest(exe.Message);
            }
        }

        [HttpPost]
        [Route("PostEmployeeTask")]
        public async Task<ActionResult<EmployeeTaskListModel>> PostEmployeeTask(EmployeeTaskListModel employeeTaskListModel)
        {
            try
            {
                _context.EmployeeTaskListModels.Add(employeeTaskListModel);
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (System.Exception exe)
            {

                return BadRequest(exe.Message);
            }
        }

        [HttpPost]
        [Route("PostChild")]
        public async Task<ActionResult<CraftEmployeeTaskMappingModel>> PostChild(CraftEmployeeTaskChild craftEmployeeTaskChild)
        {
            try
            {
                _context.CraftEmployeeTaskChilds.Add(craftEmployeeTaskChild);
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (System.Exception exe)
            {

                return BadRequest(exe.Message);
            }
        }

        private bool CraftEmployeeTaskMappingModelExists(int id)
        {
            return _context.CraftEmployeeTaskMappingModels.Any(e => e.CETId == id);
        }

        [HttpDelete]
        [Route("DeleteParent")]
        public async Task<IActionResult> DeleteCraftEmployeeTaskMappingModel(int id)
        {
            var CraftEmployeeTaskMappingModel = await _context.CraftEmployeeTaskMappingModels.Where(r=>r.CETId == id)
                                                                                             .Include(a=>a.CraftEmployeeTaskChild)
                                                                                             .FirstOrDefaultAsync();
            if (CraftEmployeeTaskMappingModel == null)
            {
                return NotFound();
            }
            foreach (var item in CraftEmployeeTaskMappingModel.CraftEmployeeTaskChild)
            {
                _context.CraftEmployeeTaskChilds.Remove(item);
            }

            _context.CraftEmployeeTaskMappingModels.Remove(CraftEmployeeTaskMappingModel);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete]
        [Route("DeleteChild")]
        public async Task<IActionResult> DeleteCraftEmployeeTaskChild(int id)
        {
            var CraftEmployeeTaskChild = await _context.CraftEmployeeTaskChilds.FindAsync(id);
            if (CraftEmployeeTaskChild == null)
            {
                return NotFound();
            }

            _context.CraftEmployeeTaskChilds.Remove(CraftEmployeeTaskChild);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
