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
    public class DesignationAccessAPIController : ControllerBase
    {
        private readonly DPMDal _context;

        public DesignationAccessAPIController(DPMDal context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("GetAllDesignation")]
        public async Task<ActionResult<IEnumerable<DesignationAccessModel>>> GetDesignationAccessModels(string UserId)
        {
              return await _context.DesignationAccessModels.Where(a=>a.CompanyUserId == UserId)
                                                 .OrderBy(a=> a.DAId).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DesignationAccessModel>> GetDesignationAccessModel(int id)
        {
            var designationAccessModel = await _context.DesignationAccessModels.FindAsync(id);

            if (designationAccessModel == null)
            {
                return NotFound();
            }

            return designationAccessModel;
        }

        [HttpPut]
        public async Task<IActionResult> PutDesignationAccessModel(DesignationAccessModel designationAccessModel)
        {
            int id = designationAccessModel.DAId;
            if (id != designationAccessModel.DAId)
            {
                return BadRequest();
            }

            _context.Entry(designationAccessModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DesignationAccessModelExists(id))
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
        public async Task<ActionResult<DesignationAccessModel>> PostDesignationAccessModel(DesignationAccessModel designationAccessModels)
        {
            try
            {
                DesignationAccessModel CheckDesignationAccessModel = await _context.DesignationAccessModels.Where(r => r.CompanyUserId == designationAccessModels.CompanyUserId && r.DesignationName == designationAccessModels.DesignationName).FirstOrDefaultAsync();
                if(CheckDesignationAccessModel == null)
                {
                    _context.DesignationAccessModels.Add(designationAccessModels);
                    await _context.SaveChangesAsync();

                    return CreatedAtAction("GetDesignationAccessModel", new { id = designationAccessModels.DAId }, designationAccessModels);

                }
                else
                {
                    return Ok(new { message = "Designation already exist !!!" });
                }
            }
            catch (System.Exception exe)
            {

                return BadRequest(exe.Message);
            }
        }

        private bool DesignationAccessModelExists(int id)
        {
            return _context.DesignationAccessModels.Any(e => e.DAId == id);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDesignationAccessModel(int id)
        {
            var DesignationAccessModelss = await _context.DesignationAccessModels.FindAsync(id);
            if (DesignationAccessModelss == null)
            {
                return NotFound();
            }

            _context.DesignationAccessModels.Remove(DesignationAccessModelss);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
