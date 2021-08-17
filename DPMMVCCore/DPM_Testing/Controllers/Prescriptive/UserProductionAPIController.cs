using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using DPM_ServerSide.DAL;
using DPM.Models.Prescriptive;

namespace DPM_Testing.Controllers
{
    [Authorize]   
    [Route("api/[controller]")]
    [ApiController]
    public class UserProductionAPIController : ControllerBase
    {
        private readonly DPMDal _context;

        public UserProductionAPIController(DPMDal context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("GetAllConfigurationRecords")]
        public async Task<ActionResult<IEnumerable<UserProductionModel>>> GetUserProductionModels()
        {
              return await _context.UserProductionModels.OrderBy(a=> a.UserProductionId).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserProductionModel>> GetUserProductionModel(int id)
        {
            var UserProductionModel = await _context.UserProductionModels.FindAsync(id);

            if (UserProductionModel == null)
            {
                return NotFound();
            }

            return UserProductionModel;
        }

        [HttpPut]
        public async Task<IActionResult> PutAddRuleModel(UserProductionModel UserProductionModel)
        {
            int id = UserProductionModel.UserProductionId;
            if (id != UserProductionModel.UserProductionId)
            {
                return BadRequest();
            }

            _context.Entry(UserProductionModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserProductionModelExists(id))
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
        public async Task<ActionResult<UserProductionModel>> PostUserProductionModel(UserProductionModel UserProductionModel)
        {
            try
            {
                UserProductionModel.UserId = User.Claims.First(c => c.Type == "UserID").Value;
                _context.UserProductionModels.Add(UserProductionModel);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetUserProductionModel", new { id = UserProductionModel.UserProductionId }, UserProductionModel);
            }
            catch (System.Exception exe)
            {

                return BadRequest(exe.Message);
            }
        }

        private bool UserProductionModelExists(int id)
        {
            return _context.UserProductionModels.Any(e => e.UserProductionId == id);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserProductionModel(int id)
        {
            var UserProductionModel = await _context.UserProductionModels.FindAsync(id);
            if (UserProductionModel == null)
            {
                return NotFound();
            }

            _context.UserProductionModels.Remove(UserProductionModel);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
