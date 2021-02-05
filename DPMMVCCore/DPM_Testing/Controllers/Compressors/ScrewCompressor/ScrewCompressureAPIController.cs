using DPM_ServerSide.DAL;
using DPM_ServerSide.Models.CompressorModel.ScrewCompressorModel;
using DPM_Testing.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;

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

        //public async Task<ActionResult<IEnumerable<ScrewCompressorTrainClassificationModel>>> GetcompressureWithClassifications()
        //{
        //    return await _context.ScrewCompressureTrainClassifications.ToListAsync();
        //}

        public IActionResult GetClassification()
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;
            try
            {
                IQueryable<ScrewCompressorTrainClassificationModel> screwCompressorClassification = _context.ScrewCompressureTrainClassifications.Where(a => a.UserId == userId).AsQueryable();
                var ClassificationData = screwCompressorClassification.ToList();
                return Ok(ClassificationData);
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }

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
             string userId = User.Claims.First(c => c.Type == "UserID").Value;

            try
            {
                foreach (var item in compressuredetails)
                {
                    DateTime datetime = item.InsertedDate;
                    if (datetime == DateTime.MinValue)
                    {
                        item.InsertedDate = DateTime.Now;
                    }
                    DateTime dt = item.InsertedDate;
                    DateTime dateOnly = dt.Date;
                    item.InsertedDate = dateOnly;
                    item.UserId = userId;
                    item.TenantId = 1;
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
            string userId = User.Claims.First(c => c.Type == "UserID").Value;
            try
            {
                IQueryable<ScrewCompressorPredictionModel> screwCompressorPredictions = _context.ScrewCompressurePredictionData.Where(a => a.UserId == userId).OrderBy(a=> a.InsertedDate).AsQueryable();
                var PredictionData = screwCompressorPredictions.ToList();
                return Ok(PredictionData);
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }

        }
        [HttpGet]
        [Route("GetPredictionById")]
        public IActionResult GetPredictionById(int PredictedId)
        {
            try
            {
                ScrewCompressorPredictionModel screwCompressorPredictions = _context.ScrewCompressurePredictionData.Where(a => a.PredictionId == PredictedId).AsQueryable().FirstOrDefault();
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
            string userId = User.Claims.First(c => c.Type == "UserID").Value;
            try
            {
                foreach (var item in predictionDetails)
                {
                    DateTime datetime = item.InsertedDate;
                    if (datetime == DateTime.MinValue)
                    {
                        item.InsertedDate = DateTime.Now;
                    }
                    DateTime dt = item.InsertedDate;
                    DateTime dateOnly = dt.Date;
                    item.InsertedDate = dateOnly;
                    item.UserId = userId;
                    item.TenantId = 1;
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

        [HttpPost]
        [Route("PredictionObj")]
        public IActionResult PostPredictionObj([FromBody] ScrewCompressorPredictionModel predictionDetails)
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;
            try
            {
                DateTime datetime = predictionDetails.InsertedDate;
                if (datetime == DateTime.MinValue)
                {
                    predictionDetails.InsertedDate = DateTime.Now;
                }
                DateTime dt = predictionDetails.InsertedDate;
                DateTime dateOnly = dt.Date;
                predictionDetails.InsertedDate = dateOnly;
                predictionDetails.TenantId = 1;
                predictionDetails.UserId = userId;
                predictionDetails.Prediction = "pending";
                _context.ScrewCompressurePredictionData.Add(predictionDetails);
                _context.SaveChanges();
                return Ok(predictionDetails);
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }

        }


        [HttpPost]
        [Route("ConfigurationChange")]
        public IActionResult PostConfigurationChange(int Data)
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;
            try
            {

                IQueryable<ScrewCompressorTrainModel> screwCompressorTrainData = _context.ScrewCompressureTrainData.Where(a => a.UserId == userId).OrderBy(a=> a.InsertedDate).AsQueryable();
                var DetailData = screwCompressorTrainData.ToList();
                foreach (var item in DetailData)
                {

                    ScrewCompressorTrainModel screwTrainData = _context.Find<ScrewCompressorTrainModel>(item.BatchId);
                    screwTrainData.ProcessingStage = null;
                    screwTrainData.BatchId = item.BatchId;
                    screwTrainData.UserId = item.UserId;
                    screwTrainData.TenantId = 1;
                    screwTrainData.InsertedDate = item.InsertedDate;
                    screwTrainData.PS1 = item.PS1;
                    screwTrainData.PD1 = item.PD1;
                    screwTrainData.PS2 = item.PS2;
                    screwTrainData.PD2 = item.PD2;
                    screwTrainData.TS1 = item.TS1;
                    screwTrainData.TD1 = item.TD1;
                    screwTrainData.TS2 = item.TS2;
                    screwTrainData.TD2 = item.TD2;
                    _context.ScrewCompressureTrainData.Attach(screwTrainData);
                    _context.Entry(screwTrainData).State = EntityState.Modified;
                    _context.SaveChanges();

                }


                IQueryable<ScrewCompressorTrainClassificationModel> screwCompressorTrainClassificationData = _context.ScrewCompressureTrainClassifications.Where(a => a.UserId == userId).OrderBy(a=> a.InsertedDate).AsQueryable();
                var classifydata = screwCompressorTrainClassificationData.ToList();
                foreach (var item in classifydata)
                {
                    ScrewCompressorTrainClassificationModel screwTrainClassification = _context.Find<ScrewCompressorTrainClassificationModel>(item.CompClassID);

                    var id = item.CompClassID;
                    screwTrainClassification = _context.ScrewCompressureTrainClassifications.Find(id);
                    _context.ScrewCompressureTrainClassifications.Remove(screwTrainClassification);
                    _context.SaveChanges();
                }
                return NoContent();
            }

            catch (Exception exe)
            {

                return BadRequest(exe.Message);
            }

        }



        [HttpPost]
        [Route("UploadCSV")]
        public IActionResult PostUploadCSV()
        {
            using var transaction = _context.Database.BeginTransaction();

            try
            {

                var file = Request.Form.Files[0];
                string folderName = "Upload";
                string newPath = Path.Combine(Guid.NewGuid().ToString() + '_' + folderName);
                if (!Directory.Exists(newPath))
                {
                    Directory.CreateDirectory(newPath);
                }
                if (file.Length > 0)
                {
                    string fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    string fullPath = Path.Combine(newPath, fileName);
                    string sFileExtension = Path.GetExtension(file.FileName);
                    ISheet sheet;
                    var list = new List<ScrewCompressorTrainModel>();

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                        stream.Position = 0;
                        if (sFileExtension == ".xls")
                        {
                            HSSFWorkbook hssfwb = new HSSFWorkbook(stream); //This will read the Excel 97-2000 formats  
                            sheet = hssfwb.GetSheetAt(0); //get first sheet from workbook  
                        }
                        else
                        {
                            NPOI.XSSF.UserModel.XSSFWorkbook hssfwb = new XSSFWorkbook(stream); //This will read 2007 Excel format  
                            sheet = hssfwb.GetSheetAt(0); //get first sheet from workbook   
                        }
                        IRow headerRow = sheet.GetRow(0); //Get Header Row
                        int cellCount = headerRow.LastCellNum;

                        transaction.CreateSavepoint("amin");

                        for (int i = (sheet.FirstRowNum + 1); i <= sheet.LastRowNum; i++) //Read Excel File
                        {
                            var obj = new ScrewCompressorTrainModel();
                            IRow row = sheet.GetRow(i);
                            var PS1 = row.GetCell(0).ToString();
                            var PD1 = row.GetCell(1).ToString();
                            var PS2 = row.GetCell(2).ToString();
                            var PD2 = row.GetCell(3).ToString();
                            var TS1 = row.GetCell(4).ToString();
                            var TD1 = row.GetCell(5).ToString();
                            var TS2 = row.GetCell(6).ToString();
                            var TD2 = row.GetCell(7).ToString();

                            obj.TenantId = 1;
                           // obj.InsertedDate = DateTime.Now;
                            obj.PS1 = Convert.ToDecimal(PS1);
                            obj.PD1 = Convert.ToDecimal(PD1);
                            obj.PS2 = Convert.ToDecimal(PS2);
                            obj.PD2 = Convert.ToDecimal(PD2);
                            obj.TS1 = Convert.ToDecimal(TS1);
                            obj.TD1 = Convert.ToDecimal(TD1);
                            obj.TS2 = Convert.ToDecimal(TS2);
                            obj.TD2 = Convert.ToDecimal(TD2);


                            list.Add(obj);
                            _context.ScrewCompressureTrainData.Add(obj);
                            _context.SaveChangesAsync();

                        }

                        transaction.Commit();
                        _context.Database.CloseConnection();
                    }


                }

                // System.IO.File.Delete(newPath);
                return Ok("Done");

            }
            catch (Exception exe)
            {


                transaction.RollbackToSavepoint("amin");
                _context.Database.CloseConnection();
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
