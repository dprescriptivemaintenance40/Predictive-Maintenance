using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DPM_Testing.Models;
using Microsoft.AspNetCore.Authorization;
using DPM_ServerSide.DAL;
using DPM.Models.Prescriptive;

namespace DPM_Testing.Controllers
{
    [Authorize]   
    [Route("api/[controller]")]
    [ApiController]
    public class SkillLibraryAPIController : ControllerBase
    {
        private readonly DPMDal _context;

        public SkillLibraryAPIController(DPMDal context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("GetAllConfigurationRecords")]
        public async Task<ActionResult<IEnumerable<UserSkillLibraryModel>>> GetUserSkillLibraryModels()
        {
              return await _context.UserSkillLibraryModels.OrderBy(a=> a.SKillLibraryId).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserSkillLibraryModel>> GetUserSkillLibraryModel(int id)
        {
            var Model = await _context.UserSkillLibraryModels.FindAsync(id);

            if (Model == null)
            {
                return NotFound();
            }

            return Model;
        }

        [HttpPut]
        public async Task<IActionResult> PutUserSkillLibraryModel(UserSkillLibraryModel Model)
        {
            int id = Model.SKillLibraryId;
            if (id != Model.SKillLibraryId)
            {
                return BadRequest();
            }

            _context.Entry(Model).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserSkillLibraryModelExists(id))
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
        public async Task<ActionResult<UserSkillLibraryModel>> PostUserSkillLibraryModel(UserSkillLibraryModel addModel)
        {
            try
            {
                _context.UserSkillLibraryModels.Add(addModel);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetUserSkillLibraryModel", new { id = addModel.SKillLibraryId }, addModel);
            }
            catch (System.Exception exe)
            {

                return BadRequest(exe.Message);
            }
        }

        private bool UserSkillLibraryModelExists(int id)
        {
            return _context.UserSkillLibraryModels.Any(e => e.SKillLibraryId == id);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserSkillLibraryModel(int id)
        {
            var deleteModel = await _context.UserSkillLibraryModels.FindAsync(id);
            if (deleteModel == null)
            {
                return NotFound();
            }

            _context.UserSkillLibraryModels.Remove(deleteModel);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
