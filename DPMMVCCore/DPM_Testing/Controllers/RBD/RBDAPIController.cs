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
    public class RBDAPIController : ControllerBase
    {
        private readonly DPMDal _context;

        public RBDAPIController(DPMDal context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("GetAllRBDTree")]
        public async Task<ActionResult<IEnumerable<RBDModel>>> GetAllRBDTree(string UserId)
        {
              return await _context.RBDModels.Where(a=>a.UserId == UserId)
                                                 .OrderBy(a=> a.RBDId).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RBDModel>> GetRBDById(int id)
        {
            var RBDModel = await _context.RBDModels.FindAsync(id);

            if (RBDModel == null)
            {
                return NotFound();
            }

            return RBDModel;
        }

        [HttpPut]
        public async Task<IActionResult> PutRBDModel(RBDModel rBDModel)
        {
            int id = rBDModel.RBDId;
            if (id != rBDModel.RBDId)
            {
                return BadRequest();
            }

            _context.Entry(rBDModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RBDModelExists(id))
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
        public async Task<ActionResult<RBDModel>> PostRBDModel(RBDModel rbdModel)
        {
            try
            {
                rbdModel.Date = DateTime.Now;
                 _context.RBDModels.Add(rbdModel);
                 await _context.SaveChangesAsync();

                  return Ok(rbdModel);

            }
            catch (System.Exception exe)
            {

                return BadRequest(exe.Message);
            }
        }

        private bool RBDModelExists(int id)
        {
            return _context.RBDModels.Any(e => e.RBDId == id);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRBDModel(int id)
        {
            var RBDObj = await _context.RBDModels.FindAsync(id);
            if (RBDObj == null)
            {
                return NotFound();
            }

            _context.RBDModels.Remove(RBDObj);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
