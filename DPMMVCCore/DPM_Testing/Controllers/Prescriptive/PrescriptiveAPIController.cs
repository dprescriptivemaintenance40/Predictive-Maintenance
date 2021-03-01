using DPM.Models.Prescriptive;
using DPM_ServerSide.DAL;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DPM.Controllers.Prescriptive
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrescriptiveAPIController : ControllerBase
    {

        private readonly DPMDal _context;

        public PrescriptiveAPIController(DPMDal context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PrescriptiveModel>>> GetPrescriptive()
        {
            try
            {
                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                return await _context.PrescriptiveModelData.Where(a => a.UserId == userId).OrderBy(a => a.PrescriptiveId).ToListAsync();

            }
            catch (Exception exe)
            {

                return BadRequest(exe.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PrescriptiveModel>> GetPrescriptive(int id)
        {
            try
            {
                var prescriptiveModel = await _context.PrescriptiveModelData.FindAsync(id);

                if (prescriptiveModel == null)
                {
                    return NotFound();
                }

                return prescriptiveModel;

            }
            catch (Exception exe)
            {

                return BadRequest(exe.Message);
            }

        }

        [HttpPost]
        public async Task<ActionResult<PrescriptiveModel>> PostPrescriptive(PrescriptiveModel prescriptiveModel)
        {
            try
            {
                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                DateTime d1 = DateTime.Now;
                prescriptiveModel.Date = d1.Date;
                prescriptiveModel.UserId = userId;
                _context.PrescriptiveModelData.Add(prescriptiveModel);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetPrescriptive", new { id = prescriptiveModel.PrescriptiveId }, prescriptiveModel);

            }
            catch (Exception exe)
            {

                return BadRequest(exe.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutPrespective(int id, PrescriptiveModel prescriptiveModel)
        {
            if (id != prescriptiveModel.PrescriptiveId)
            {
                return BadRequest();
            }
            string userId = User.Claims.First(c => c.Type == "UserID").Value;
            prescriptiveModel.UserId = userId;
            _context.Entry(prescriptiveModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PrespectiveModelExists(id))
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

        private bool PrespectiveModelExists(int id)
        {
            return _context.PrescriptiveModelData.Any(e => e.PrescriptiveId == id);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePrespectiveModel(int id)
        {
            var prescriptiveModel = await _context.PrescriptiveModelData.FindAsync(id);
            if (prescriptiveModel == null)
            {
                return NotFound();
            }

            _context.PrescriptiveModelData.Remove(prescriptiveModel);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
