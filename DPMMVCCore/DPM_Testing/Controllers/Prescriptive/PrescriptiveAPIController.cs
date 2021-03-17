using DPM.Models.Prescriptive;
using DPM_ServerSide.DAL;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
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
        public async Task<ActionResult<IEnumerable<CentrifugalPumpPrescriptiveModel>>> GetPrescriptive()
        {
            try
            {
                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                return await _context.PrescriptiveModelData.Where(a => a.UserId == userId)
                                                           .Include( a => a.centrifugalPumpPrescriptiveFailureModes)
                                                           .OrderBy(a => a.CFPPrescriptiveId)
                                                           .ToListAsync();
                 
            }
            catch (Exception exe)
            {

                return BadRequest(exe.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CentrifugalPumpPrescriptiveModel>> GetPrescriptiveById(int id)
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
        [Route("PostCentrifugalPumpPrescriptiveData")]
        public async Task<ActionResult<CentrifugalPumpPrescriptiveModel>> PostPrescriptive([FromBody] CentrifugalPumpPrescriptiveModel prescriptiveModel)
        {
            try
            {
                List<int> Calculation = new List<int>();

                var CentrifugalPumpPrescriptiveFailureModeData = prescriptiveModel.centrifugalPumpPrescriptiveFailureModes;
                prescriptiveModel.centrifugalPumpPrescriptiveFailureModes = new List<CentrifugalPumpPrescriptiveFailureMode>() ;

                foreach (var item in CentrifugalPumpPrescriptiveFailureModeData)
                {
                    var DT = item.DownTimeFactor;
                    var SF = item.ScrapeFactor;
                    var SF2 = item.SafetyFactor;
                    var PF = item.ProtectionFactor;
                    var FF = item.FrequencyFactor;
                    var ADD = (DT + SF + SF2);
                    var MULT = ADD * PF * FF;
                    Calculation.Add(MULT);

                    if (MULT > 1000)
                    {
                        item.Rating = "A";
                        item.MaintainenancePractice = "CBM and OBM Both";
                        item.FrequencyMaintainenance = "Daily Condition Monitoring, or Online Monitoring";
                        item.ConditionMonitoring = "Vibration Monitoring";
                    }
                    else if ((500 < MULT) && (MULT < 1000))
                    {
                        item.Rating = "B";
                        item.MaintainenancePractice = "OBM";
                        item.FrequencyMaintainenance = "Twice a week Condition Monitoring";
                        item.ConditionMonitoring = "Vibration Monitoring";
                    }
                    else if ((200 < MULT) && (MULT <= 500))
                    {
                        item.Rating = "C";
                        item.MaintainenancePractice = "PM";
                        item.FrequencyMaintainenance = "Weekly Condition Monitoring";
                        item.ConditionMonitoring = "Vibration Monitoring";
                    }
                    else if ((100 < MULT) && (MULT <= 200))
                    {
                        item.Rating = "D";
                        item.MaintainenancePractice = "TBM";
                        item.FrequencyMaintainenance = "Half of PF interval, typically Monthly or fortnightly, time based maintenance";
                        item.ConditionMonitoring = "Nan";
                    }
                    else if ((0 < MULT) && (MULT < 100))
                    {
                        item.Rating = "E";
                        item.MaintainenancePractice = "Breakdown Maintenance";
                        item.FrequencyMaintainenance = "All the time of Failure";
                        item.ConditionMonitoring = "Nan";
                    }

                    item.CriticalityFactor = MULT;

                    prescriptiveModel.centrifugalPumpPrescriptiveFailureModes.Add(item);

                }

                var CF = Calculation.Sum();
                prescriptiveModel.ComponentCriticalityFactor = CF;

                if (CF > 1000)
                {
                    prescriptiveModel.ComponentRating = "A";
                    prescriptiveModel.CMaintainenancePractice = "CBM and OBM Both";
                    prescriptiveModel.CFrequencyMaintainenance = "Daily Condition Monitoring, or Online Monitoring";
                    prescriptiveModel.CConditionMonitoring = "Vibration Monitoring";
                }
                else if ( ( 500 < CF )  && ( CF < 1000 ) )
                {
                    prescriptiveModel.ComponentRating = "B";
                    prescriptiveModel.CMaintainenancePractice = "OBM";
                    prescriptiveModel.CFrequencyMaintainenance = "Twice a week Condition Monitoring";
                    prescriptiveModel.CConditionMonitoring = "Vibration Monitoring";
                }
                else if ((200 < CF) && (CF <= 500))
                {
                    prescriptiveModel.ComponentRating = "C";
                    prescriptiveModel.CMaintainenancePractice = "PM";
                    prescriptiveModel.CFrequencyMaintainenance = "Weekly Condition Monitoring";
                    prescriptiveModel.CConditionMonitoring = "Vibration Monitoring";
                } 
                else if ((100 < CF) && (CF <= 200))
                {
                    prescriptiveModel.ComponentRating = "D";
                    prescriptiveModel.CMaintainenancePractice = "TBM";
                    prescriptiveModel.CFrequencyMaintainenance = "Half of PF interval, typically Monthly or fortnightly, time based maintenance";
                    prescriptiveModel.CConditionMonitoring = "Nan";
                }
                else if ((0 < CF) && (CF < 100))
                {
                    prescriptiveModel.ComponentRating = "E";
                    prescriptiveModel.CMaintainenancePractice = "Breakdown Maintenance";
                    prescriptiveModel.CFrequencyMaintainenance = "All the time of Failure";
                    prescriptiveModel.CConditionMonitoring = "Nan";
                }

                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                DateTime d1 = DateTime.Now;
                prescriptiveModel.Date = d1.Date;
                prescriptiveModel.UserId = userId;
                _context.PrescriptiveModelData.Add(prescriptiveModel);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetPrescriptiveById", new { id = prescriptiveModel.CFPPrescriptiveId }, prescriptiveModel);
            }
            catch (Exception exe)
            {

                return BadRequest(exe.Message);
            }
        }

        

        [HttpPut]
        [Route("CFPrescriptiveAdd")]
        public async Task<IActionResult> PutPrespective(CentrifugalPumpPrescriptiveModel prescriptiveModel)
        {
            
            CentrifugalPumpPrescriptiveModel centrifugalPumpPrescriptiveModel = new CentrifugalPumpPrescriptiveModel();
            centrifugalPumpPrescriptiveModel = await _context.PrescriptiveModelData.FindAsync(prescriptiveModel.CFPPrescriptiveId);
            centrifugalPumpPrescriptiveModel.centrifugalPumpPrescriptiveFailureModes = prescriptiveModel.centrifugalPumpPrescriptiveFailureModes;
            centrifugalPumpPrescriptiveModel.FMWithConsequenceTree = prescriptiveModel.FMWithConsequenceTree;
      
            _context.Entry(centrifugalPumpPrescriptiveModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PrespectiveModelExists(prescriptiveModel.CFPPrescriptiveId))
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
        [Route("FunctionUpdate")]
        public async Task<IActionResult> PutFunctionUpdate(CentrifugalPumpPrescriptiveModel prescriptiveModel)
        {

            CentrifugalPumpPrescriptiveModel centrifugalPumpPrescriptiveModel = new CentrifugalPumpPrescriptiveModel();
            centrifugalPumpPrescriptiveModel = await _context.PrescriptiveModelData.FindAsync(prescriptiveModel.CFPPrescriptiveId);
            centrifugalPumpPrescriptiveModel.FunctionFluidType = prescriptiveModel.FunctionFluidType;
            centrifugalPumpPrescriptiveModel.FunctionRatedHead = prescriptiveModel.FunctionRatedHead;
            centrifugalPumpPrescriptiveModel.FunctionPeriodType = prescriptiveModel.FunctionPeriodType;
            centrifugalPumpPrescriptiveModel.FailureModeWithLSETree = prescriptiveModel.FailureModeWithLSETree;
            centrifugalPumpPrescriptiveModel.FMWithConsequenceTree = prescriptiveModel.FMWithConsequenceTree;

            _context.Entry(centrifugalPumpPrescriptiveModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PrespectiveModelExists(prescriptiveModel.CFPPrescriptiveId))
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
        [Route("FunctionModeAndConsequenceUpdate")]
        public async Task<IActionResult> PutFunctionModeAndConsequenceUpdate(CentrifugalPumpPrescriptiveModel prescriptiveModel)
        {
            try
            {
                List<int> Calculation = new List<int>();

                var CentrifugalPumpPrescriptiveFailureModeData = prescriptiveModel.centrifugalPumpPrescriptiveFailureModes;
                prescriptiveModel.centrifugalPumpPrescriptiveFailureModes = new List<CentrifugalPumpPrescriptiveFailureMode>();

                var CFData = _context.centrifugalPumpPrescriptiveFailureModes.Where(a => a.CFPPrescriptiveId == prescriptiveModel.CFPPrescriptiveId).ToList();

                foreach (var c in CFData)
                {
                    Calculation.Add(c.CriticalityFactor);
                    prescriptiveModel.centrifugalPumpPrescriptiveFailureModes.Add(c);

                }

                foreach (var item in CentrifugalPumpPrescriptiveFailureModeData)
                {
                    var DT = item.DownTimeFactor;
                    var SF = item.ScrapeFactor;
                    var SF2 = item.SafetyFactor;
                    var PF = item.ProtectionFactor;
                    var FF = item.FrequencyFactor;
                    var ADD = (DT + SF + SF2);
                    var MULT = ADD * PF * FF;
                    Calculation.Add(MULT);

                    if (MULT > 1000)
                    {
                        item.Rating = "A";
                        item.MaintainenancePractice = "CBM and OBM Both";
                        item.FrequencyMaintainenance = "Daily Condition Monitoring, or Online Monitoring";
                        item.ConditionMonitoring = "Vibration Monitoring";
                    }
                    else if ((500 < MULT) && (MULT < 1000))
                    {
                        item.Rating = "B";
                        item.MaintainenancePractice = "OBM";
                        item.FrequencyMaintainenance = "Twice a week Condition Monitoring";
                        item.ConditionMonitoring = "Vibration Monitoring";
                    }
                    else if ((200 < MULT) && (MULT <= 500))
                    {
                        item.Rating = "C";
                        item.MaintainenancePractice = "PM";
                        item.FrequencyMaintainenance = "Weekly Condition Monitoring";
                        item.ConditionMonitoring = "Vibration Monitoring";
                    }
                    else if ((100 < MULT) && (MULT <= 200))
                    {
                        item.Rating = "D";
                        item.MaintainenancePractice = "TBM";
                        item.FrequencyMaintainenance = "Half of PF interval, typically Monthly or fortnightly, time based maintenance";
                        item.ConditionMonitoring = "Nan";
                    }
                    else if ((0 < MULT) && (MULT < 100))
                    {
                        item.Rating = "E";
                        item.MaintainenancePractice = "Breakdown Maintenance";
                        item.FrequencyMaintainenance = "All the time of Failure";
                        item.ConditionMonitoring = "Nan";
                    }

                    item.CriticalityFactor = MULT;

                    prescriptiveModel.centrifugalPumpPrescriptiveFailureModes.Add(item);

                }

               

                var CF = Calculation.Sum();

                prescriptiveModel.ComponentCriticalityFactor = CF;


                if (CF > 1000)
                {
                    prescriptiveModel.ComponentRating = "A";
                    prescriptiveModel.CMaintainenancePractice = "CBM and OBM Both";
                    prescriptiveModel.CFrequencyMaintainenance = "Daily Condition Monitoring, or Online Monitoring";
                    prescriptiveModel.CConditionMonitoring = "Vibration Monitoring";
                }
                else if ((500 < CF) && (CF < 1000))
                {
                    prescriptiveModel.ComponentRating = "B";
                    prescriptiveModel.CMaintainenancePractice = "OBM";
                    prescriptiveModel.CFrequencyMaintainenance = "Twice a week Condition Monitoring";
                    prescriptiveModel.CConditionMonitoring = "Vibration Monitoring";
                }
                else if ((200 < CF) && (CF <= 500))
                {
                    prescriptiveModel.ComponentRating = "C";
                    prescriptiveModel.CMaintainenancePractice = "PM";
                    prescriptiveModel.CFrequencyMaintainenance = "Weekly Condition Monitoring";
                    prescriptiveModel.CConditionMonitoring = "Vibration Monitoring";
                }
                else if ((100 < CF) && (CF <= 200))
                {
                    prescriptiveModel.ComponentRating = "D";
                    prescriptiveModel.CMaintainenancePractice = "TBM";
                    prescriptiveModel.CFrequencyMaintainenance = "Half of PF interval, typically Monthly or fortnightly, time based maintenance";
                    prescriptiveModel.CConditionMonitoring = "Nan";
                }
                else if ((0 < CF) && (CF < 100))
                {
                    prescriptiveModel.ComponentRating = "E";
                    prescriptiveModel.CMaintainenancePractice = "Breakdown Maintenance";
                    prescriptiveModel.CFrequencyMaintainenance = "All the time of Failure";
                    prescriptiveModel.CConditionMonitoring = "Nan";
                }


                    CentrifugalPumpPrescriptiveModel centrifugalPumpPrescriptiveModelData = await _context.PrescriptiveModelData.FindAsync(prescriptiveModel.CFPPrescriptiveId);
                    centrifugalPumpPrescriptiveModelData.centrifugalPumpPrescriptiveFailureModes = null;
                    centrifugalPumpPrescriptiveModelData.FailureModeWithLSETree = prescriptiveModel.FailureModeWithLSETree;
                    centrifugalPumpPrescriptiveModelData.FMWithConsequenceTree = prescriptiveModel.FMWithConsequenceTree;
                    centrifugalPumpPrescriptiveModelData.ComponentCriticalityFactor = prescriptiveModel.ComponentCriticalityFactor;
                    centrifugalPumpPrescriptiveModelData.ComponentRating = prescriptiveModel.ComponentRating;
                    centrifugalPumpPrescriptiveModelData.CMaintainenancePractice = prescriptiveModel.CMaintainenancePractice;
                    centrifugalPumpPrescriptiveModelData.CFrequencyMaintainenance = prescriptiveModel.CFrequencyMaintainenance;
                    centrifugalPumpPrescriptiveModelData.CConditionMonitoring = prescriptiveModel.CConditionMonitoring;
                    _context.Entry(centrifugalPumpPrescriptiveModelData).State = EntityState.Modified;
                  
                    await _context.SaveChangesAsync();


                    var ToAddFM = prescriptiveModel.centrifugalPumpPrescriptiveFailureModes;
              
                    foreach (var item in ToAddFM)
                    {
                        item.CPPFMId = 0;
                        _context.centrifugalPumpPrescriptiveFailureModes.Add(item);
                        await _context.SaveChangesAsync();
                    }



            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PrespectiveModelExists(prescriptiveModel.CFPPrescriptiveId))
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
        [Route("FailureModeDelete")]
        public async Task<IActionResult> PutPrespectiveFailureModel(CentrifugalPumpPrescriptiveModel obj)
        {
            var MinusCF = 0;
            foreach (var mode in obj.centrifugalPumpPrescriptiveFailureModes)
            {
                var FailuerMode = await _context.centrifugalPumpPrescriptiveFailureModes.FindAsync(mode.CPPFMId);
                MinusCF = FailuerMode.CriticalityFactor;
                _context.centrifugalPumpPrescriptiveFailureModes.Remove(FailuerMode);
            }

            CentrifugalPumpPrescriptiveModel centrifugalPumpPrescriptiveModel = await _context.PrescriptiveModelData.FindAsync(obj.CFPPrescriptiveId);
            var CCF = centrifugalPumpPrescriptiveModel.ComponentCriticalityFactor;
            var CF = CCF - MinusCF;

            centrifugalPumpPrescriptiveModel.ComponentCriticalityFactor = CF;

            if (CF > 1000)
            {
                centrifugalPumpPrescriptiveModel.ComponentRating = "A";
                centrifugalPumpPrescriptiveModel.CMaintainenancePractice = "CBM and OBM Both";
                centrifugalPumpPrescriptiveModel.CFrequencyMaintainenance = "Daily Condition Monitoring, or Online Monitoring";
                centrifugalPumpPrescriptiveModel.CConditionMonitoring = "Vibration Monitoring";
            }
            else if ((500 < CF) && (CF < 1000))
            {
                centrifugalPumpPrescriptiveModel.ComponentRating = "B";
                centrifugalPumpPrescriptiveModel.CMaintainenancePractice = "OBM";
                centrifugalPumpPrescriptiveModel.CFrequencyMaintainenance = "Twice a week Condition Monitoring";
                centrifugalPumpPrescriptiveModel.CConditionMonitoring = "Vibration Monitoring";
            }
            else if ((200 < CF) && (CF <= 500))
            {
                centrifugalPumpPrescriptiveModel.ComponentRating = "C";
                centrifugalPumpPrescriptiveModel.CMaintainenancePractice = "PM";
                centrifugalPumpPrescriptiveModel.CFrequencyMaintainenance = "Weekly Condition Monitoring";
                centrifugalPumpPrescriptiveModel.CConditionMonitoring = "Vibration Monitoring";
            }
            else if ((100 < CF) && (CF <= 200))
            {
                centrifugalPumpPrescriptiveModel.ComponentRating = "D";
                centrifugalPumpPrescriptiveModel.CMaintainenancePractice = "TBM";
                centrifugalPumpPrescriptiveModel.CFrequencyMaintainenance = "Half of PF interval, typically Monthly or fortnightly, time based maintenance";
                centrifugalPumpPrescriptiveModel.CConditionMonitoring = "Nan";
            }
            else if ((0 < CF) && (CF < 100))
            {
                centrifugalPumpPrescriptiveModel.ComponentRating = "E";
                centrifugalPumpPrescriptiveModel.CMaintainenancePractice = "Breakdown Maintenance";
                centrifugalPumpPrescriptiveModel.CFrequencyMaintainenance = "All the time of Failure";
                centrifugalPumpPrescriptiveModel.CConditionMonitoring = "Nan";
            }


            centrifugalPumpPrescriptiveModel.FMWithConsequenceTree = obj.FMWithConsequenceTree;
            centrifugalPumpPrescriptiveModel.FailureModeWithLSETree = obj.FailureModeWithLSETree;
            _context.Entry(centrifugalPumpPrescriptiveModel).State = EntityState.Modified;

            await _context.SaveChangesAsync();
            return NoContent();
        }


        [HttpPut]
        [Route("EditConsequenceTree")]
        public async Task<IActionResult> PutEditConsequenceTree(CentrifugalPumpPrescriptiveModel prescriptiveModel)
        {
            try
            {
                List<int> Calculation = new List<int>();

                var CentrifugalPumpPrescriptiveFailureModeData = prescriptiveModel.centrifugalPumpPrescriptiveFailureModes;
                prescriptiveModel.centrifugalPumpPrescriptiveFailureModes = new List<CentrifugalPumpPrescriptiveFailureMode>();
                var ParentId = 0;
                var ChildId = 0;

                foreach (var item in CentrifugalPumpPrescriptiveFailureModeData)
                {
                    ParentId = item.CFPPrescriptiveId;
                    ChildId = item.CPPFMId;
                    var DT = item.DownTimeFactor;
                    var SF = item.ScrapeFactor;
                    var SF2 = item.SafetyFactor;
                    var PF = item.ProtectionFactor;
                    var FF = item.FrequencyFactor;
                    var ADD = (DT + SF + SF2);
                    var MULT = ADD * PF * FF;
                    Calculation.Add(MULT);

                    if (MULT > 1000)
                    {
                        item.Rating = "A";
                        item.MaintainenancePractice = "CBM and OBM Both";
                        item.FrequencyMaintainenance = "Daily Condition Monitoring, or Online Monitoring";
                        item.ConditionMonitoring = "Vibration Monitoring";
                    }
                    else if ((500 < MULT) && (MULT < 1000))
                    {
                        item.Rating = "B";
                        item.MaintainenancePractice = "OBM";
                        item.FrequencyMaintainenance = "Twice a week Condition Monitoring";
                        item.ConditionMonitoring = "Vibration Monitoring";
                    }
                    else if ((200 < MULT) && (MULT <= 500))
                    {
                        item.Rating = "C";
                        item.MaintainenancePractice = "PM";
                        item.FrequencyMaintainenance = "Weekly Condition Monitoring";
                        item.ConditionMonitoring = "Vibration Monitoring";
                    }
                    else if ((100 < MULT) && (MULT <= 200))
                    {
                        item.Rating = "D";
                        item.MaintainenancePractice = "TBM";
                        item.FrequencyMaintainenance = "Half of PF interval, typically Monthly or fortnightly, time based maintenance";
                        item.ConditionMonitoring = "Nan";
                    }
                    else if ((0 < MULT) && (MULT < 100))
                    {
                        item.Rating = "E";
                        item.MaintainenancePractice = "Breakdown Maintenance";
                        item.FrequencyMaintainenance = "All the time of Failure";
                        item.ConditionMonitoring = "Nan";
                    }

                    item.CriticalityFactor = MULT;

                    prescriptiveModel.centrifugalPumpPrescriptiveFailureModes.Add(item);

                }

                var CFData = _context.centrifugalPumpPrescriptiveFailureModes.Where(a => a.CFPPrescriptiveId == ParentId).ToList();

                foreach (var c in CFData)
                {
                    if (c.CPPFMId != ChildId)
                    {
                        Calculation.Add(c.CriticalityFactor);
                        prescriptiveModel.centrifugalPumpPrescriptiveFailureModes.Add(c);
                    }
                   
                    
                }

                var CF = Calculation.Sum();

                prescriptiveModel.ComponentCriticalityFactor = CF;


                if (CF > 1000)
                {
                    prescriptiveModel.ComponentRating = "A";
                    prescriptiveModel.CMaintainenancePractice = "CBM and OBM Both";
                    prescriptiveModel.CFrequencyMaintainenance = "Daily Condition Monitoring, or Online Monitoring";
                    prescriptiveModel.CConditionMonitoring = "Vibration Monitoring";
                }
                else if ((500 < CF) && (CF < 1000))
                {
                    prescriptiveModel.ComponentRating = "B";
                    prescriptiveModel.CMaintainenancePractice = "OBM";
                    prescriptiveModel.CFrequencyMaintainenance = "Twice a week Condition Monitoring";
                    prescriptiveModel.CConditionMonitoring = "Vibration Monitoring";
                }
                else if ((200 < CF) && (CF <= 500))
                {
                    prescriptiveModel.ComponentRating = "C";
                    prescriptiveModel.CMaintainenancePractice = "PM";
                    prescriptiveModel.CFrequencyMaintainenance = "Weekly Condition Monitoring";
                    prescriptiveModel.CConditionMonitoring = "Vibration Monitoring";
                }
                else if ((100 < CF) && (CF <= 200))
                {
                    prescriptiveModel.ComponentRating = "D";
                    prescriptiveModel.CMaintainenancePractice = "TBM";
                    prescriptiveModel.CFrequencyMaintainenance = "Half of PF interval, typically Monthly or fortnightly, time based maintenance";
                    prescriptiveModel.CConditionMonitoring = "Nan";
                }
                else if ((0 < CF) && (CF < 100))
                {
                    prescriptiveModel.ComponentRating = "E";
                    prescriptiveModel.CMaintainenancePractice = "Breakdown Maintenance";
                    prescriptiveModel.CFrequencyMaintainenance = "All the time of Failure";
                    prescriptiveModel.CConditionMonitoring = "Nan";
                }

                CentrifugalPumpPrescriptiveModel centrifugalPumpPrescriptiveModel = await _context.PrescriptiveModelData.FindAsync(prescriptiveModel.CFPPrescriptiveId);
                centrifugalPumpPrescriptiveModel.centrifugalPumpPrescriptiveFailureModes = prescriptiveModel.centrifugalPumpPrescriptiveFailureModes;
                centrifugalPumpPrescriptiveModel.FailureModeWithLSETree = prescriptiveModel.FailureModeWithLSETree;
                centrifugalPumpPrescriptiveModel.FMWithConsequenceTree = prescriptiveModel.FMWithConsequenceTree;
                centrifugalPumpPrescriptiveModel.ComponentCriticalityFactor = prescriptiveModel.ComponentCriticalityFactor;
                centrifugalPumpPrescriptiveModel.ComponentRating = prescriptiveModel.ComponentRating;
                centrifugalPumpPrescriptiveModel.CMaintainenancePractice = prescriptiveModel.CMaintainenancePractice;
                centrifugalPumpPrescriptiveModel.CFrequencyMaintainenance = prescriptiveModel.CFrequencyMaintainenance;
                centrifugalPumpPrescriptiveModel.CConditionMonitoring = prescriptiveModel.CConditionMonitoring;
                _context.Entry(centrifugalPumpPrescriptiveModel).State = EntityState.Modified;

                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PrespectiveModelExists(prescriptiveModel.CFPPrescriptiveId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(prescriptiveModel.FMWithConsequenceTree);
        }


        private bool PrespectiveModelExists(int id)
        {
            return _context.PrescriptiveModelData.Any(e => e.CFPPrescriptiveId == id);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePrespectiveModel(int id)
        {
            try
            {
              
                var prescriptiveModel = _context.PrescriptiveModelData.Where(a => a.CFPPrescriptiveId == id)
                                                         .Include(a => a.centrifugalPumpPrescriptiveFailureModes)
                                                         .First();
                if (prescriptiveModel == null)
                {
                    return NotFound();
                }

                _context.PrescriptiveModelData.Remove(prescriptiveModel);
                await _context.SaveChangesAsync();

                return NoContent();

            }
            catch (Exception exe)
            {

                return BadRequest(exe.Message);
            }

       
           
        }


        [HttpPost]
        [Route("UploadFile")]
        public IActionResult GetActionResult()
        {
            try
            {
                string pathToSave = "";
                var file = Request.Form.Files[0];
                var imageFolder = Path.Combine("wwwroot\\Evidence_Image\\");
                var pdfFolder = Path.Combine("wwwroot\\Evidence_PDF\\");
                var wordFolder = Path.Combine("wwwroot\\Evidence_Doc\\");
                var imageRootPath = Path.Combine(Directory.GetCurrentDirectory(), imageFolder);
                var pdfRootPath = Path.Combine(Directory.GetCurrentDirectory(), pdfFolder);
                var UserId = User.Claims.First(c => c.Type == "UserID").Value;
                if (file.ContentType == "application/pdf")
                {
                    pathToSave = string.Format("{0}{1}", pdfRootPath, UserId);
                } else if (file.ContentType == "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
                {
                    pathToSave = string.Format("{0}{1}", wordFolder, UserId);
                }
                else
                {
                    pathToSave = string.Format("{0}{1}", imageRootPath, UserId);
                }
               
                // Check folder exists
                if (!Directory.Exists(pathToSave))
                {
                    Directory.CreateDirectory(pathToSave);
                }

               
                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, fileName);
                    string dbPath = "";
                    if (file.ContentType == "application/pdf")
                    {
                        dbPath = string.Format("Evidence_PDF/{0}/{1}", UserId, fileName);
                    } else if (file.ContentType == "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
                    {
                        dbPath = string.Format("Evidence_Doc/{0}/{1}", UserId, fileName);
                    }
                    else
                    {
                        dbPath = string.Format("Evidence_Image/{0}/{1}", UserId, fileName);
                    }

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                        stream.Position = 0;
                    }

                    return Ok(new { dbPath, fullPath });
                }
                else
                {
                    return BadRequest();
                }
            }
            
            catch (Exception exe)
            {

                return BadRequest(exe.Message);
            }
        }


        [HttpPut]
        [Route("UpdateFileUpload")]
        public IActionResult PutUpdateFileUpload(string fullPath)
        {
            try
            {
                string _fileToBeDeleted = fullPath;
                if (System.IO.File.Exists(_fileToBeDeleted))
                {
                    System.IO.File.Delete(_fileToBeDeleted);
                }

                return Ok();
            }
            catch (Exception exe)
            {

                return BadRequest(exe.Message);
            }
        }
    }
}
