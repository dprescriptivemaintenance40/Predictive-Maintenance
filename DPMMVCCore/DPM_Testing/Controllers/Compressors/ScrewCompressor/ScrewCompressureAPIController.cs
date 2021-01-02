using DPM_ServerSide.DAL;
using DPM_ServerSide.Models.CompressorModel.ScrewCompressorModel;
using DPM_Testing.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace DPM_Testing.Controllers
{
    [Authorize]
  //  [EnableCors("MyAllowSpecificOrigins")]
    [Route("api/[controller]")]
    [ApiController]
    public class ScrewCompressureAPIController : ControllerBase
    {

        private readonly DPMDal _context;

        public ScrewCompressureAPIController(DPMDal context)
        {
            _context = context;
        }
        // GET: api/<ScrewCompressureAPIController>
        [HttpGet]
        //  public IEnumerable<string> Get()
        //  {
        //      return new string[] { "value1", "value2" };
        //  }

        public async Task<ActionResult<IEnumerable<ScrewCompressorTrainClassificationModel>>> GetcompressureWithClassifications()
        {
            return await _context.ScrewCompressureTrainClassifications.ToListAsync();
        }




        // GET api/<CompressureDetailsAPIController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<ScrewCompressureAPIController>
        [HttpPost]
        [Route("Configuration")]
        public IActionResult PostConfiguration([FromBody] List<ScrewCompressorTrainModel> compressuredetails)
        {
            // var CompresureList = JsonConvert.DeserializeObject<compresureList>(json);
            try
            {
                foreach (var item in compressuredetails)
                {
                    item.TenantId = 1;
                    item.InsertedDate = DateTime.Now;
                    _context.ScrewCompressureTrainData.Add(item);
                    _context.SaveChanges();

                }
                return Ok(compressuredetails);
            }
            catch (Exception exe)
            {

       
                return BadRequest(exe.Message);
            }
            
        }

        [HttpGet]
        [Route("GetPrediction")]
        public IActionResult GetPrediction()
        {
            try
            {
                IQueryable<ScrewCompressorPredictionModel> screwCompressorPredictions = _context.ScrewCompressurePredictionData.AsQueryable();
                return Ok(screwCompressorPredictions);
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }

        }

        [HttpPost]
        [Route("Prediction")]
        public IActionResult PostPrediction([FromBody] List<ScrewCompressorPredictionModel> predictionDetails)
        {
            // var CompresureList = JsonConvert.DeserializeObject<compresureList>(json);
            try
            {
                foreach (var item in predictionDetails)
                {
                    item.TenantId = 1;
                    item.InsertedDate = DateTime.Now;
                  //  item.Prediction = "Calulating";
                    _context.ScrewCompressurePredictionData.Add(item);
                    _context.SaveChanges();

                }
                return Ok(predictionDetails);
            }
            catch (Exception exe)
            {


                return BadRequest(exe.Message);
            }

        }






        // PUT api/<ScrewCompressureAPIController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<ScrewCompressureAPIController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }

 
    }
}
