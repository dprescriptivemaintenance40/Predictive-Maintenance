using DPM.Models.Prescriptive;
using DPM.Models.RecycleBinModel;
using DPM_ServerSide.DAL;
using Microsoft.AspNetCore.Hosting;
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
        private IWebHostEnvironment _hostingEnvironment;

        public PrescriptiveAPIController(DPMDal context, IWebHostEnvironment hostingEnvironment)
        {
            _context = context;
            _hostingEnvironment = hostingEnvironment;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CentrifugalPumpPrescriptiveModel>>> GetPrescriptive()
        {
            try
            {
                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                return await _context.PrescriptiveModelData.Where(a => a.UserId == userId)
                                                           .Include(a => a.centrifugalPumpPrescriptiveFailureModes)
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
        [Route("RestoreRecords")]

        public async Task<ActionResult<CentrifugalPumpPrescriptiveModel>> PostRestoreRecords([FromBody] CentrifugalPumpPrescriptiveModel prescriptiveModel)
        {
            try
            {
                _context.PrescriptiveModelData.Add(prescriptiveModel);
                await _context.SaveChangesAsync();

                return Ok();

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
                prescriptiveModel.centrifugalPumpPrescriptiveFailureModes = new List<CentrifugalPumpPrescriptiveFailureMode>();

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

                return Ok(ToAddFM);

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
        }


        [HttpPut]
        [Route("FailureModeDelete")]
        public async Task<IActionResult> PutPrespectiveFailureModel(CentrifugalPumpPrescriptiveModel obj)
        {
            var MinusCF = 0;
            string userId = User.Claims.First(c => c.Type == "UserID").Value;
            RecycleBinCentrifugalPumpPrescriptiveModel recyclePM = new RecycleBinCentrifugalPumpPrescriptiveModel();
            RestoreCentrifugalPumpPrescriptiveFailureMode recycleChild = new RestoreCentrifugalPumpPrescriptiveFailureMode();
            recyclePM.restoreCentrifugalPumpPrescriptiveFailureModes = new List<RestoreCentrifugalPumpPrescriptiveFailureMode>();
            foreach (var mode in obj.centrifugalPumpPrescriptiveFailureModes)
            {
                CentrifugalPumpPrescriptiveFailureMode FailuerMode = await _context.centrifugalPumpPrescriptiveFailureModes.FindAsync(mode.CPPFMId);
                MinusCF = FailuerMode.CriticalityFactor;
                _context.centrifugalPumpPrescriptiveFailureModes.Remove(FailuerMode);

                recycleChild.UserId = userId;
                recycleChild.CPPFMId = FailuerMode.CPPFMId;
                recycleChild.CFPPrescriptiveId = FailuerMode.CFPPrescriptiveId;
                recycleChild.FunctionMode = FailuerMode.FunctionMode;
                recycleChild.LocalEffect = FailuerMode.LocalEffect;
                recycleChild.SystemEffect = FailuerMode.SystemEffect;
                recycleChild.Consequence = FailuerMode.Consequence;
                recycleChild.DownTimeFactor = FailuerMode.DownTimeFactor;
                recycleChild.ScrapeFactor = FailuerMode.ScrapeFactor;
                recycleChild.SafetyFactor = FailuerMode.SafetyFactor;
                recycleChild.ProtectionFactor = FailuerMode.ProtectionFactor;
                recycleChild.FrequencyFactor = FailuerMode.FrequencyFactor;
                recycleChild.CriticalityFactor = FailuerMode.CriticalityFactor;
                recycleChild.Rating = FailuerMode.Rating;
                recycleChild.MaintainenancePractice = FailuerMode.MaintainenancePractice;
                recycleChild.FrequencyMaintainenance = FailuerMode.FrequencyMaintainenance;
                recycleChild.ConditionMonitoring = FailuerMode.ConditionMonitoring;
                recycleChild.AttachmentDBPath = FailuerMode.AttachmentDBPath;
                recycleChild.AttachmentFullPath = FailuerMode.AttachmentFullPath;
                recycleChild.Remark = FailuerMode.Remark;

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



            recyclePM.CFPPrescriptiveId = centrifugalPumpPrescriptiveModel.CFPPrescriptiveId;
            recyclePM.UserId = centrifugalPumpPrescriptiveModel.UserId;
            recyclePM.MachineType = centrifugalPumpPrescriptiveModel.MachineType;
            recyclePM.EquipmentType = centrifugalPumpPrescriptiveModel.EquipmentType;
            recyclePM.TagNumber = centrifugalPumpPrescriptiveModel.TagNumber;
            recyclePM.FunctionFluidType = centrifugalPumpPrescriptiveModel.FunctionFluidType;
            recyclePM.FunctionRatedHead = centrifugalPumpPrescriptiveModel.FunctionRatedHead;
            recyclePM.FunctionPeriodType = centrifugalPumpPrescriptiveModel.FunctionPeriodType;
            recyclePM.FunctionFailure = centrifugalPumpPrescriptiveModel.FunctionFailure;
            recyclePM.Date = centrifugalPumpPrescriptiveModel.Date;
            recyclePM.FailureModeWithLSETree = centrifugalPumpPrescriptiveModel.FailureModeWithLSETree;
            recyclePM.FMWithConsequenceTree = centrifugalPumpPrescriptiveModel.FMWithConsequenceTree;
            recyclePM.ComponentCriticalityFactor = centrifugalPumpPrescriptiveModel.ComponentCriticalityFactor;
            recyclePM.ComponentRating = centrifugalPumpPrescriptiveModel.ComponentRating;
            recyclePM.CMaintainenancePractice = centrifugalPumpPrescriptiveModel.CMaintainenancePractice;
            recyclePM.CFrequencyMaintainenance = centrifugalPumpPrescriptiveModel.CFrequencyMaintainenance;
            recyclePM.CConditionMonitoring = centrifugalPumpPrescriptiveModel.CConditionMonitoring;
            recyclePM.restoreCentrifugalPumpPrescriptiveFailureModes.Add(recycleChild);

            _context.recycleCentrifugalPumpModelData.Add(recyclePM);

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

        [HttpDelete]
        [Route("DeletePrespectiveModel")]
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

                RecycleBinCentrifugalPumpPrescriptiveModel recyclePM = new RecycleBinCentrifugalPumpPrescriptiveModel();
                RestoreCentrifugalPumpPrescriptiveFailureMode recycleChild = new RestoreCentrifugalPumpPrescriptiveFailureMode();
                recyclePM.restoreCentrifugalPumpPrescriptiveFailureModes = new List<RestoreCentrifugalPumpPrescriptiveFailureMode>();

                foreach (var item in prescriptiveModel.centrifugalPumpPrescriptiveFailureModes)
                {
                    recycleChild.UserId = prescriptiveModel.UserId;
                    recycleChild.CPPFMId = item.CPPFMId;
                    recycleChild.CFPPrescriptiveId = item.CFPPrescriptiveId;
                    recycleChild.FunctionMode = item.FunctionMode;
                    recycleChild.LocalEffect = item.LocalEffect;
                    recycleChild.SystemEffect = item.SystemEffect;
                    recycleChild.Consequence = item.Consequence;
                    recycleChild.DownTimeFactor = item.DownTimeFactor;
                    recycleChild.ScrapeFactor = item.ScrapeFactor;
                    recycleChild.SafetyFactor = item.SafetyFactor;
                    recycleChild.ProtectionFactor = item.ProtectionFactor;
                    recycleChild.FrequencyFactor = item.FrequencyFactor;
                    recycleChild.CriticalityFactor = item.CriticalityFactor;
                    recycleChild.Rating = item.Rating;
                    recycleChild.MaintainenancePractice = item.MaintainenancePractice;
                    recycleChild.FrequencyMaintainenance = item.FrequencyMaintainenance;
                    recycleChild.ConditionMonitoring = item.ConditionMonitoring;
                    recycleChild.AttachmentDBPath = item.AttachmentDBPath;
                    recycleChild.AttachmentFullPath = item.AttachmentFullPath;
                    recycleChild.Remark = item.Remark;
                }

                recyclePM.CFPPrescriptiveId = prescriptiveModel.CFPPrescriptiveId;
                recyclePM.UserId = prescriptiveModel.UserId;
                recyclePM.MachineType = prescriptiveModel.MachineType;
                recyclePM.EquipmentType = prescriptiveModel.EquipmentType;
                recyclePM.TagNumber = prescriptiveModel.TagNumber;
                recyclePM.FunctionFluidType = prescriptiveModel.FunctionFluidType;
                recyclePM.FunctionRatedHead = prescriptiveModel.FunctionRatedHead;
                recyclePM.FunctionPeriodType = prescriptiveModel.FunctionPeriodType;
                recyclePM.FunctionFailure = prescriptiveModel.FunctionFailure;
                recyclePM.Date = prescriptiveModel.Date;
                recyclePM.FailureModeWithLSETree = prescriptiveModel.FailureModeWithLSETree;
                recyclePM.FMWithConsequenceTree = prescriptiveModel.FMWithConsequenceTree;
                recyclePM.ComponentCriticalityFactor = prescriptiveModel.ComponentCriticalityFactor;
                recyclePM.ComponentRating = prescriptiveModel.ComponentRating;
                recyclePM.CMaintainenancePractice = prescriptiveModel.CMaintainenancePractice;
                recyclePM.CFrequencyMaintainenance = prescriptiveModel.CFrequencyMaintainenance;
                recyclePM.CConditionMonitoring = prescriptiveModel.CConditionMonitoring;
                recyclePM.restoreCentrifugalPumpPrescriptiveFailureModes.Add(recycleChild);

                _context.recycleCentrifugalPumpModelData.Add(recyclePM);
                _context.PrescriptiveModelData.Remove(prescriptiveModel);
                await _context.SaveChangesAsync();

                return NoContent();

            }
            catch (Exception exe)
            {

                return BadRequest(exe.Message);
            }



        }



        [HttpDelete("{id}")]
        [Route("DeleteRecycleWholeData")]
        public async Task<IActionResult> DeleteRecycleWholeData(int RCPPMId, int RCPFMId)
        {
            try
            {
                if (RCPPMId != 0 && RCPFMId == 0)
                {

                    var RecycleData = _context.recycleCentrifugalPumpModelData.Where(a => a.RCPPMId == RCPPMId)
                                                        .Include(a => a.restoreCentrifugalPumpPrescriptiveFailureModes)
                                                        .First();
                    _context.recycleCentrifugalPumpModelData.Remove(RecycleData);
                    await _context.SaveChangesAsync();

                }
                else if (RCPPMId == 0 && RCPFMId != 0)
                {
                    RestoreCentrifugalPumpPrescriptiveFailureMode RecycleData = await _context.restoreCentrifugalPumpPrescriptiveFailureModes.FindAsync(RCPFMId);

                    _context.restoreCentrifugalPumpPrescriptiveFailureModes.Remove(RecycleData);
                    await _context.SaveChangesAsync();
                }
                else
                {

                }

                return Ok();


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
                var imageRootPath = Path.Combine(Directory.GetCurrentDirectory(), imageFolder);
                var pdfRootPath = Path.Combine(Directory.GetCurrentDirectory(), pdfFolder);
                var UserId = User.Claims.First(c => c.Type == "UserID").Value;
                var removePath = Request.Form["removePath"];
                if (file.ContentType == "application/pdf")
                {
                    pathToSave = string.Format("{0}{1}", pdfRootPath, UserId);
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
                    }
                    else
                    {
                        dbPath = string.Format("Evidence_Image/{0}/{1}", UserId, fileName);
                    }
                    if (!string.IsNullOrEmpty(removePath))
                    {
                        System.IO.File.Delete(Path.Combine(_hostingEnvironment.WebRootPath, removePath));
                    }

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                        stream.Position = 0;
                    }
                    var FileId = Guid.NewGuid();
                    return Ok(new { dbPath, fullPath, UserId, FileId, fileName });
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


        [HttpGet]
        [Route("CFRecycleDataForChild")]
        public async Task<ActionResult<IEnumerable<RecycleBinCentrifugalPumpPrescriptiveModel>>> GetRecycleData()
        {
            try
            {
                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                return await _context.recycleCentrifugalPumpModelData.Where(a => a.UserId == userId)
                                                           .Include(a => a.restoreCentrifugalPumpPrescriptiveFailureModes)
                                                           .OrderBy(a => a.RCPPMId)
                                                           .ToListAsync();
            }
            catch (Exception exe)
            {

                return BadRequest(exe.Message);
            }
        }

        [HttpGet]
        [Route("GetRecordsFromCPPM")]
        public IActionResult GetRecords(int id)
        {
            try
            {
                CentrifugalPumpPrescriptiveModel record = _context.PrescriptiveModelData.Where(a => a.CFPPrescriptiveId == id)
                                                                                        .Include(a => a.centrifugalPumpPrescriptiveFailureModes)
                                                                                         .FirstOrDefault();
                return Ok(record);
            }
            catch (Exception exe)
            {

                return BadRequest(exe.Message);
            }
        }


        [HttpGet]
        [Route("CFRecycleWholeData")]
        public async Task<ActionResult<IEnumerable<RecycleBinCentrifugalPumpPrescriptiveModel>>> GetRecycleWholeData()
        {
            try
            {
                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                return await _context.recycleCentrifugalPumpModelData.Where(a => a.UserId == userId)
                                                           .Include(a => a.restoreCentrifugalPumpPrescriptiveFailureModes)
                                                           .OrderBy(a => a.RCPPMId)
                                                           .ToListAsync();
            }
            catch (Exception exe)
            {

                return BadRequest(exe.Message);
            }
        }


        [HttpDelete]
        [Route("UpdateFileUpload")]
        public IActionResult DeleteUpdateFileUpload(string fullPath)
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

        [HttpPut]
        [Route("CompontentAttachment")]
        public async Task<IActionResult> PutCompontentAttachment(int id)
        {

            try
            {
                string pathToSave = "";
                var file = Request.Form.Files[0];
                var imageFolder = Path.Combine("wwwroot\\Evidence_Image\\");
                var pdfFolder = Path.Combine("wwwroot\\Evidence_PDF\\");
                var imageRootPath = Path.Combine(Directory.GetCurrentDirectory(), imageFolder);
                var pdfRootPath = Path.Combine(Directory.GetCurrentDirectory(), pdfFolder);
                var UserId = User.Claims.First(c => c.Type == "UserID").Value;
                var CRemarks = Request.Form["CRemarks"];
                var removePath = Request.Form["removePath"];
                if (file.ContentType == "application/pdf")
                {
                    pathToSave = string.Format("{0}", pdfRootPath);
                }
                else
                {
                    pathToSave = string.Format("{0}", imageRootPath);
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
                        dbPath = string.Format("Evidence_PDF/{0}", fileName);
                    }
                    else
                    {
                        dbPath = string.Format("Evidence_Image/{0}", fileName);
                    }
                    if (!string.IsNullOrEmpty(removePath))
                    {
                        System.IO.File.Delete(Path.Combine(_hostingEnvironment.WebRootPath, removePath));
                    }
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                        stream.Position = 0;
                    }


                    CentrifugalPumpPrescriptiveModel centrifugalPumpPrescriptiveModel = new CentrifugalPumpPrescriptiveModel();
                    centrifugalPumpPrescriptiveModel = await _context.PrescriptiveModelData.FindAsync(id);
                    centrifugalPumpPrescriptiveModel.CAttachmentDBPath = dbPath;
                    centrifugalPumpPrescriptiveModel.CAttachmentFullPath = fullPath;
                    centrifugalPumpPrescriptiveModel.CRemarks = CRemarks;

                    _context.Entry(centrifugalPumpPrescriptiveModel).State = EntityState.Modified;
                    await _context.SaveChangesAsync();
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
