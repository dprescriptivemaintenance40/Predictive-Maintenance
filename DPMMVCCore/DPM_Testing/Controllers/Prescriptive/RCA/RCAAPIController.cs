using DPM.Models.Prescriptive.RCA;
using DPM_ServerSide.DAL;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace DPM.Controllers.Prescriptive.RCA
{
    [Route("api/[controller]")]
    [ApiController]
    public class RCAAPIController : ControllerBase
    {
        private readonly DPMDal _context;
        private IWebHostEnvironment _hostingEnvironment;

        public RCAAPIController(DPMDal context, IWebHostEnvironment hostingEnvironment)
        {
            _context = context;
            _hostingEnvironment = hostingEnvironment;
        }

        // GET: api/<RCAAPIController>
        [HttpGet]
        [Route("GetAllRCARecords")]
        public async Task<IActionResult> GetAllRecords()
        {
            try
            {
                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                List<RCAModel> rcaList = await _context.rCAModels.Where(a => a.UserId == userId)
                                                               .OrderBy(a => a.RCAID)
                                                               .ToListAsync();
                return Ok(rcaList);
            }
            catch (Exception exe)
            {

                return BadRequest(exe.Message);
            }
        }

        // GET api/<RCAAPIController>/5
        [HttpGet]
        [Route("GetRCARecordById")]
        public async Task<IActionResult> GetRecordById(int id)
        {
            try
            {
                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                RCAModel RCAModel = await _context.rCAModels.FirstOrDefaultAsync(a => a.UserId == userId && a.RCAID == id);
                return Ok(RCAModel);
            }
            catch (Exception exe)
            {

                return BadRequest(exe.Message);
            }
        }

        // GET api/<RCAAPIController>/5
        [HttpGet]
        [Route("GetRCARecordByTagNumber")]
        public async Task<IActionResult> GetRCARecordByTagNumber(string tagNumber)
        {
            try
            {
                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                var RCAModel = await _context.rCAModels.Where(a => a.UserId == userId && a.TagNumber == tagNumber).ToListAsync();
                return Ok(RCAModel);
            }
            catch (Exception exe)
            {

                return BadRequest(exe.Message);
            }
        }

        // POST api/<RCAAPIController>
        [HttpPost]
        [Route("SaveNewRCA")]
        public async Task<IActionResult> PostSaveNewRCA(RCAModel rcaModel)
        {
            try
            {
                DateTime Date = DateTime.Now;
                var Code = Convert.ToString(Date.TimeOfDay);
                rcaModel.RCACode = Code;
                rcaModel.UserId = User.Claims.First(c => c.Type == "UserID").Value;
                await _context.rCAModels.AddAsync(rcaModel);
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception exe)
            {

                return BadRequest(exe.Message);
            }

        }

        // PUT api/<RCAAPIController>/5
        [HttpPut]
        [Route("RCAUpdate")]
        public async Task<IActionResult> Put(RCAModel RCA)
        {
            try
            {
                string userID = User.Claims.First(c => c.Type == "UserID").Value;
                RCAModel Data = await _context.rCAModels.FirstOrDefaultAsync(a => a.RCAID == RCA.RCAID && a.UserId == userID);
                Data.RCAQualitativeTree = RCA.RCAQualitativeTree;
                Data.RCAQuantitiveTree = RCA.RCAQuantitiveTree;
                DateTime Date = DateTime.Now;
                var Code = Convert.ToString(Date.TimeOfDay);
                Data.RCACode = Code;
                Data.RCALabel = RCA.RCALabel;
                Data.RCAQualitativeFailureMode = RCA.RCAQualitativeFailureMode;
                Data.RCAQualitativeEquipment = RCA.RCAQualitativeEquipment;
                Data.RCAQuantitiveFailureMode = RCA.RCAQuantitiveFailureMode;
                Data.RCAQuantitiveEquipment = RCA.RCAQuantitiveEquipment;
                _context.Entry(Data).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception exe)
            {

                return BadRequest(exe.Message);
            }
        }

        [HttpPut]
        [Route("RCATreeUpdate")]
        public async Task<IActionResult> PutOnlyTreeUpdate(RCAModel RCA)
        {
            try
            {
                string userID = User.Claims.First(c => c.Type == "UserID").Value;
                RCAModel Data = await _context.rCAModels.FirstOrDefaultAsync(a => a.RCAID == RCA.RCAID && a.UserId == userID);
                Data.RCAQualitativeTree = RCA.RCAQualitativeTree;
                _context.Entry(Data).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }

        // DELETE api/<RCAAPIController>/5
        [HttpDelete]
        [Route("DeleteRCARecord")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                string userID = User.Claims.First(c => c.Type == "UserID").Value;
                RCAModel Data = await _context.rCAModels.FirstOrDefaultAsync(a => a.RCAID == id && a.UserId == userID);
                _context.rCAModels.Remove(Data);
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
