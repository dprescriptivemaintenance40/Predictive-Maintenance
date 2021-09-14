using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DPM_Testing.Models;
using Microsoft.AspNetCore.Authorization;
using DPM_ServerSide.DAL;
using DPM.Models.Prescriptive.PSR;
using DPM.Models.Prescriptive;
using System;

namespace DPM_Testing.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PSRClientContractorAPIController : ControllerBase
    {
        private readonly DPMDal _context;

        public PSRClientContractorAPIController(DPMDal context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("GetAllConfigurationRecords")]
        public async Task<ActionResult<IEnumerable<PSRClientContractorModel>>> GetPSRClientContractorModels()
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;
            return await _context.PSRClientContractorModels.Where(a => a.UserId == userId).OrderBy(a => a.PSRClientContractorId).ToListAsync();
        }

        [HttpGet("{id}")]
        [Route("GetRecordById")]
        public async Task<ActionResult<PSRClientContractorModel>> GetPSRClientContractorModel(int id)
        {
            var psrClientContractorModel = await _context.PSRClientContractorModels.FindAsync(id);

            if (psrClientContractorModel == null)
            {
                return NotFound();
            }

            return psrClientContractorModel;
        }

        [HttpPut]
        public async Task<IActionResult> PutAddRuleModel(PSRClientContractorModel psrClientContractorModel)
        {
            int id = psrClientContractorModel.PSRClientContractorId;
            if (id != psrClientContractorModel.PSRClientContractorId)
            {
                return BadRequest();
            }

            _context.Entry(psrClientContractorModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PSRClientContractorModelExists(id))
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
        public async Task<ActionResult<PSRClientContractorModel>> PostAddRuleModel(PSRClientContractorModel psrClientContractorModel)
        {
            try
            {
                psrClientContractorModel.UserId = User.Claims.First(c => c.Type == "UserID").Value;
                _context.PSRClientContractorModels.Add(psrClientContractorModel);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetPSRClientContractorModel", new { id = psrClientContractorModel.PSRClientContractorId }, psrClientContractorModel);
            }
            catch (Exception exe)
            {

                return BadRequest(exe.Message);
            }
        }

        private bool PSRClientContractorModelExists(int id)
        {
            return _context.PSRClientContractorModels.Any(e => e.PSRClientContractorId == id);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePSRClientContractorModel(int id)
        {
            var psrClientContractorModel = await _context.PSRClientContractorModels.FindAsync(id);
            if (psrClientContractorModel == null)
            {
                return NotFound();
            }

            _context.PSRClientContractorModels.Remove(psrClientContractorModel);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost]
        [Route("PostSkillData")]
        public async Task<IActionResult> postSkillDate(List<MapStrategySkillModel> mapStrategySkillModels)
        {
            try
            {
                var addResults = mapStrategySkillModels.Where(a => a.MapId == 0).ToList();
                var updateResults = mapStrategySkillModels.Where(a => a.MapId != 0).ToList();               
                if (updateResults.Count > 0)
                {
                    this._context.MapStrategySkillModels.UpdateRange(updateResults);
                }
                if (addResults.Count > 0)
                {
                    this._context.MapStrategySkillModels.AddRange(addResults);
                }
                    await this._context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }

        [HttpGet]
        [Route("GetSkillMappedData")]
        public async Task<IActionResult> GetSkillMappedData(string UserId)
        {
            try
            {              
                return Ok(await this._context.MapStrategySkillModels.Where(a => a.UserId == UserId).ToListAsync());
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }

        [HttpPost]
        [Route("PostSkillPSRMapping")]
        public async Task<IActionResult> PostSkillPSRMapping(List<SkillPSRMappingModel> skillPSRMappingModel)
        {
            try
            {
                var add = skillPSRMappingModel.Where(a => a.PSRId == 0).ToList();
                var update = skillPSRMappingModel.Where(a => a.PSRId != 0).ToList();
                if (update.Count > 0)
                {
                    this._context.SkillPSRMappingModels.UpdateRange(update);
                }
                if (add.Count > 0)
                {
                    this._context.SkillPSRMappingModels.AddRange(add);
                }
                await this._context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }

        [HttpPut]
        [Route("UpdateSkillPSRMSSMapping")]
        public async Task<IActionResult> UpdateSkillPSRMSSMapping(SkillPSRMappingModel skillPSRMapping)
        {
            try
            {
                _context.Entry(skillPSRMapping).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }

        [HttpPut]
        [Route("UpdateSkillPSRMappingFGC")]
        public async Task<IActionResult> UpdateSkillPSRMappingFGC(SkillPSRMappingMSS skillPSRMappingMSS)
        {
            try
            {
                _context.Entry(skillPSRMappingMSS).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }

        [HttpGet]
        [Route("GetSkillPSRMapping")]
        public async Task<IActionResult> GetSkillPSRMapping(string UserId)
        {
            try
            {
                return Ok(await this._context.SkillPSRMappingModels.Where(a => a.UserId == UserId)
                                                                   .Include(r=>r.SkillPSRMappingMSS)
                                                                   .ToListAsync());
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }

        [HttpPost]
        [Route("PostCBATask")]
        public async Task<IActionResult> PostCBATask(CBAModel CBAModel)
        {
            try
            {
                
                if (CBAModel.CBAId == 0)
                {
                    List<CBAModel> CheckAlreadySaved = new List<CBAModel>();
                    CheckAlreadySaved = await _context.CBAModels.Where(r=>r.TagNumber == CBAModel.TagNumber && r.FailureMode == CBAModel.FailureMode 
                                                                       && r.EquipmentType == CBAModel.EquipmentType && r.MachineType == CBAModel.MachineType).ToListAsync();
                    if(CheckAlreadySaved.Count == 0)
                    {
                        _context.CBAModels.Add(CBAModel);
                        await this._context.SaveChangesAsync();
                        return Ok();
                    }
                    else
                    {
                        return BadRequest("Already saved in database, Update it if any changes");
                    }
                }
                else
                {
                    CBAModel cBAModel = new CBAModel();
                    cBAModel.CBATaskModel = CBAModel.CBATaskModel;
                    CBAModel.CBATaskModel = null;
                    _context.Entry(CBAModel).State = EntityState.Modified;
                    var add = cBAModel.CBATaskModel.Where(a => a.CBATaskId == 0).ToList();
                    var update = cBAModel.CBATaskModel.Where(a => a.CBATaskId != 0).ToList();
                    if (update.Count > 0)
                    {
                        this._context.CBATaskModels.UpdateRange(update);
                    }
                    if (add.Count > 0)
                    {
                        this._context.CBATaskModels.AddRange(add);
                    }
                   await this._context.SaveChangesAsync();
                return Ok();
                }
                
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }

        [HttpGet]
        [Route("GetSavedCBA")]
        public async Task<IActionResult> GetSavedCBA(string UserId)
        {
            try
            {
                return Ok(await this._context.CBAModels.Where(a => a.UserId == UserId)
                                                                   .Include(r => r.CBATaskModel)
                                                                   .ToListAsync());
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }
    }
}
