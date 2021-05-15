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
    public class PrescriptiveLookupMasterAPIController : ControllerBase
    {
        private readonly DPMDal _context;

        public PrescriptiveLookupMasterAPIController(DPMDal context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PrescriptiveLookupMasterModel>>> GetLookupMassterModel()
        {
            return await _context.PrescriptiveLookupMassterModelData.OrderBy(a => a.PrescriptiveLookupMasterId).ToListAsync();
         }

        [HttpGet("{id}")]
        public async Task<ActionResult<PrescriptiveLookupMasterModel>> GetLookupMassterModel(int id)
        {
            var lookupMasterModel = await _context.PrescriptiveLookupMassterModelData.FindAsync(id);

            if (lookupMasterModel == null)
            {
                return NotFound();
            }

            return lookupMasterModel;
        }

        [HttpGet("{id}")]
        [Route("GetRecords")]
        public IActionResult GetRecords(string MachineType, string EquipmentType)
        {
            try
            {
                string MT = MachineType;
                string ET = EquipmentType;
                IQueryable<PrescriptiveLookupMasterModel> prescriptiveLookupMasterModels = _context.PrescriptiveLookupMassterModelData
                                                                                                    .Where(a => a.MachineType == MT
                                                                                                             && a.EquipmentType == ET )
                                                                                                    .OrderBy(a => a.PrescriptiveLookupMasterId )
                                                                                                    .AsQueryable();
                var Data = prescriptiveLookupMasterModels.ToList();
                return Ok(Data);

            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }           
        
        }

        [HttpPost]
        public async Task<ActionResult<PrescriptiveLookupMasterModel>> PostLookupMassterModel(PrescriptiveLookupMasterModel lookupMasterModel)
        {
            DateTime dt = DateTime.Now;
            lookupMasterModel.Date = dt.Date;
            _context.PrescriptiveLookupMassterModelData.Add(lookupMasterModel);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetLookupMassterModel", new { id = lookupMasterModel.PrescriptiveLookupMasterId }, lookupMasterModel);
        }
        
        [HttpPut]
        public async Task<IActionResult> PutLookupMassterModel(PrescriptiveLookupMasterModel lookupMasterModel)
        {
            int id = lookupMasterModel.PrescriptiveLookupMasterId;
            if (id != lookupMasterModel.PrescriptiveLookupMasterId)
            {
                return BadRequest();
            }

            _context.Entry(lookupMasterModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PutLookupMasterModel(id))
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

        private bool PutLookupMasterModel(int id)
        {
            return _context.PrescriptiveLookupMassterModelData.Any(e => e.PrescriptiveLookupMasterId == id);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLookupMasterModel(int id)
        {
            var lookupMasterModel = await _context.PrescriptiveLookupMassterModelData.FindAsync(id);
            if (lookupMasterModel == null)
            {
                return NotFound();
            }

            _context.PrescriptiveLookupMassterModelData.Remove(lookupMasterModel);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet]
        [Route("RCAHeatExchanger")]
        public async Task<ActionResult<PrescriptiveLookupMasterModel>> GetData(string data)
        {
            var lookupMasterModel = await _context.PrescriptiveLookupMassterModelData.Where(a => a.Function == data)
                                                                                     .OrderBy(a => a.PrescriptiveLookupMasterId)
                                                                                     .ToListAsync();

            if (lookupMasterModel == null)
            {
                return NotFound();
            }

            return Ok(lookupMasterModel);
        }
    }
}
