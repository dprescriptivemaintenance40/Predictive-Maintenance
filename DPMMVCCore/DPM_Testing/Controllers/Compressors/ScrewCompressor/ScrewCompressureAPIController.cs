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
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace DPM_Testing.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ScrewCompressureAPIController : ControllerBase
    {

        private readonly DPMDal _context;

        public ScrewCompressureAPIController(DPMDal context)
        {
            _context = context;
        }
        
        [HttpGet]
        [Route("GetClassification")]
        public async Task<IActionResult> GetClassification(string type)
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;
            try
            {
                List<ScrewCompressorTrainClassificationModel> screwCompressorClassification = await _context.ScrewCompressureTrainClassifications.Where(a => a.UserId == userId && a.FailureModeType == type).ToListAsync();
                var ClassificationData = screwCompressorClassification.ToList();
                return Ok(ClassificationData);
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }

        }

        [HttpPost]
        [Route("Configuration")]
        public async Task<IActionResult> PostConfiguration([FromBody] List<ScrewCompressorTrainModel> compressuredetails)
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
                    item.FailureModeType = "RotarDamage";
                    item.TenantId = 1;
                    _context.ScrewCompressureTrainData.Add(item);
                    await _context.SaveChangesAsync();

                }
                return Ok(compressuredetails);
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }

        }

        [HttpPost]
        [Route("PostSSRBData")]
        public async Task<IActionResult> PostSSRBData([FromBody] List<ScrewCompressorTrainClassificationModel> trainClassificationModels)
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;

            try
            {
                foreach (var item in trainClassificationModels)
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
                    item.FailureModeType = "SSRB";
                    item.TenantId = 1;
                    var PD1a = item.PD1 + Convert.ToDecimal(1.03);
                    var PS1a = item.PS1 + Convert.ToDecimal(1.03);

                    var PD2a = item.PD2 + Convert.ToDecimal(1.03);
                    var PS2a = item.PS2 + Convert.ToDecimal(1.03);
                    if (item.TD1 > 210 || ( (PD1a/PS1a) > Convert.ToDecimal(3.5) ) || ((PD2a / PS2a) > Convert.ToDecimal(3.3)))
                    {
                        item.Classification = "degarde";
                    }
                    else if (item.TD1 > 190 || ((PD1a / PS1a) > Convert.ToDecimal(3.3)) || ((PD2a / PS2a) > Convert.ToDecimal(3.1)))
                    {
                        item.Classification = "incipient";
                    }
                    else
                    {
                        item.Classification = "normal";
                    }
                    _context.ScrewCompressureTrainClassifications.Add(item);
                    await _context.SaveChangesAsync();

                }
                return Ok();
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }

        [HttpPost]
        [Route("PostCoolerFailure")]
        public async Task<IActionResult> PostCoolerFailure([FromBody] List<ScrewCompressorTrainClassificationModel> trainClassificationModels)
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;

            try
            {
                foreach (var item in trainClassificationModels)
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
                    item.FailureModeType = "CoolerFailure";
                    item.TenantId = 1;
                    // Q=mCp(T2-T1) (KJ/sec)
                    //m=0.233 kgr/sec
                    //Cp=1.005 kJ/kgrK
                    item.TS1 = item.T1;
                    item.TS2 = item.T2;
                    decimal Q = (Convert.ToDecimal(0.233) * Convert.ToDecimal(1.005) * (item.T2 - item.T1));

                    if ( Q < 0)
                    {
                        item.Classification = "bad";
                    }
                    else if(((38.0m < Q) && (Q <= 40.0m) ) 
                        || ( (190m < item.T2) && (item.T2 <= 220m) )
                        || ( (30m <  item.T1) && (item.T1 <= 50m)  ) )
                    {
                        item.Classification = "degarde";
                    }
                    else if (((34.0m <= Q) && (Q <= 38.0m))
                        || ((170m <= item.T2) && (item.T2 <= 190m))
                        || ((25m <= item.T1) && (item.T1 <= 30m)))
                    {
                        item.Classification = "incipient";
                    }
                    else
                    {
                        item.Classification = "normal";
                    }
                   _context.ScrewCompressureTrainClassifications.Add(item);
                    await _context.SaveChangesAsync();

                }
                return Ok();
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }
        }

        [HttpGet]
        [Route("GetPrediction")]
        public async Task<IActionResult> GetPrediction()
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;
            try
            {
                List<ScrewCompressorPredictionModel> screwCompressorPredictions = await _context.ScrewCompressurePredictionData.Where(a => a.UserId == userId).OrderBy(a=> a.InsertedDate).ToListAsync();
                var PredictionData = screwCompressorPredictions.ToList();
                return Ok(PredictionData);
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }

        }

        [HttpGet]
        [Route("GetPredictionByDate")]
        public async Task<IActionResult> GetPredictionByDate(string FromDate, string ToDate)
        {
            DateTime d = Convert.ToDateTime(FromDate);
            DateTime PredictionFromDate = d.Date;
            DateTime d1 = Convert.ToDateTime(ToDate);
            DateTime PredictionToDate = d1.Date;
            string userId = User.Claims.First(c => c.Type == "UserID").Value;
            try
            {
                List<ScrewCompressorPredictionModel> screwCompressorPredictions = await _context.ScrewCompressurePredictionData.Where(a => a.UserId == userId
                                                                                                                                 && (a.InsertedDate>= PredictionFromDate
                                                                                                                                 && a.InsertedDate <= PredictionToDate))
                                                                                                                               .OrderBy(a => a.InsertedDate).ToListAsync();
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
        public async Task<IActionResult> GetPredictionById(int PredictedId)
        {
            try
            {
                ScrewCompressorPredictionModel screwCompressorPredictions = await _context.ScrewCompressurePredictionData.FirstOrDefaultAsync(a => a.PredictionId == PredictedId);
                return Ok(screwCompressorPredictions);
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message); 
            }

        }

        [HttpPost]
        [Route("Prediction")]
        public async Task<IActionResult> PostPrediction([FromBody] List<ScrewCompressorPredictionModel> predictionDetails)
        {
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
                    await _context.SaveChangesAsync();
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
        public async Task<IActionResult> PostPredictionObj([FromBody] ScrewCompressorPredictionModel predictionDetails)
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
                await _context.SaveChangesAsync();
                return Ok(predictionDetails);
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }

        }


        [HttpPost]
        [Route("ConfigurationChange")]
        public async Task<IActionResult> PostConfigurationChange(int Data)
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;
            try
            {

                List<ScrewCompressorTrainModel> screwCompressorTrainData = await _context.ScrewCompressureTrainData.Where(a => a.UserId == userId).OrderBy(a=> a.InsertedDate).ToListAsync();
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
                    await _context.SaveChangesAsync();

                }


                List<ScrewCompressorTrainClassificationModel> screwCompressorTrainClassificationData = await _context.ScrewCompressureTrainClassifications.Where(a => a.UserId == userId).OrderBy(a=> a.InsertedDate).ToListAsync();
                var classifydata = screwCompressorTrainClassificationData.ToList();
                foreach (var item in classifydata)
                {
                    ScrewCompressorTrainClassificationModel screwTrainClassification = _context.Find<ScrewCompressorTrainClassificationModel>(item.CompClassID);

                    var id = item.CompClassID;
                    screwTrainClassification = _context.ScrewCompressureTrainClassifications.Find(id);
                    _context.ScrewCompressureTrainClassifications.Remove(screwTrainClassification);
                    await _context.SaveChangesAsync();
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
                return Ok("Done");
            }
            catch (Exception exe)
            {
                transaction.RollbackToSavepoint("amin");
                _context.Database.CloseConnection();
                return BadRequest(exe.Message);
            }
        }
    }
}
