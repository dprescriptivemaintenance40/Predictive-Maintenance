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
using System.Reflection;
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

        public static DataTable ToDataTable<T>(List<T> items)
        {
            DataTable dataTable = new DataTable(typeof(T).Name);

            //Get all the properties
            PropertyInfo[] Props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
            foreach (PropertyInfo prop in Props)
            {
                //Setting column names as Property names
                dataTable.Columns.Add(prop.Name);
            }
            foreach (T item in items)
            {
                var values = new object[Props.Length];
                for (int i = 0; i < Props.Length; i++)
                {
                    //inserting property values to datatable rows
                    values[i] = Props[i].GetValue(item, null);
                }
                dataTable.Rows.Add(values);
            }
            //put a breakpoint here and check datatable
            return dataTable;
        }
        [HttpGet]
        [Route("GetClassification")]
        public async Task<IActionResult> GetClassification()
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;
            try
            {
                List<ScrewCompressorTrainClassificationModel> screwCompressorClassification = await _context.ScrewCompressureTrainClassifications.Where(a => a.UserId == userId).ToListAsync();
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
               
                IQueryable<ScrewCompressorConfigurationModel> ruleDetails = _context.AddRuleModels.OrderBy(a => a.AddRuleId).AsQueryable();
                DataTable dtRules = ToDataTable<ScrewCompressorConfigurationModel>(ruleDetails.ToList());

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
                    var PD1 = item.PD1;
                    var PS2 = item.PS2;
                    var PS1 = item.PS1;
                    var PD2 = item.PD2;
                    var TS1 = item.TS1;
                    var TD1 = item.TD1;
                    var TS2 = item.TS2;
                    var TD2 = item.TD2;

                    var T = Convert.ToDecimal(TD1 - TS1);
                    var T2 = Convert.ToDecimal(TD2 - TS2);
                    var T3 = Convert.ToDecimal((((PD1 + 1) / (PS1 + 1)) - 1));
                    var T4 = Convert.ToDecimal((((PD2 + 1) / (PS2 + 1)) - 1));
                    var data = dtRules.Rows[1]["Trigger"];
                    if (((PD1 >= Convert.ToDecimal(dtRules.Rows[1]["Trigger"])))
                         && (T >= Convert.ToDecimal(dtRules.Rows[8]["Trigger"]))
                         && (T2 >= Convert.ToDecimal(dtRules.Rows[9]["Trigger"]))
                         && (T3 >= Convert.ToDecimal(dtRules.Rows[10]["Trigger"]))
                         && (T4 <= Convert.ToDecimal(dtRules.Rows[11]["Trigger"])))
                    {
                        item.ClassificationsId = 2;
                        item.Classifications = "degrade";
                        item.ProcessingStage = "Done";
                    }

                    else if ((PD1 <= Convert.ToDecimal(dtRules.Rows[1]["Alarm"]))
                          || (PS2 <= Convert.ToDecimal(dtRules.Rows[2]["Alarm"]))
                          || (PD2 <= Convert.ToDecimal(dtRules.Rows[3]["Alarm"]))
                          || (TD1 <= Convert.ToDecimal(dtRules.Rows[5]["Alarm"]))
                          || (TD2 <= Convert.ToDecimal(dtRules.Rows[7]["Alarm"])))
                    {
                        item.ClassificationsId = 0;
                        item.Classifications = "bad";
                        item.ProcessingStage = "Done";
                    }

                    else if (((PD1 >= Convert.ToDecimal(dtRules.Rows[1]["Trigger"])))
                         || (T >= Convert.ToDecimal(dtRules.Rows[8]["Trigger"]))
                         || (T2 >= Convert.ToDecimal(dtRules.Rows[9]["Trigger"]))
                         || (T3 >= Convert.ToDecimal(dtRules.Rows[10]["Trigger"]))
                         || (T4 <= Convert.ToDecimal(dtRules.Rows[11]["Trigger"])))
                    {
                        item.ClassificationsId = 1;
                        item.Classifications = "incipient";
                        item.ProcessingStage = "Done";
                    }
                    else
                    {
                        item.ClassificationsId = 3;
                        item.Classifications = "normal";
                        item.ProcessingStage = "Done";
                    }
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

        [HttpGet]
        [Route("GetPrediction")]
        public async Task<IActionResult> GetPrediction()
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;
            try
            {
                List<ScrewCompressorPredictionModel> screwCompressorPredictions = await _context.ScrewCompressurePredictionData.Where(a => a.UserId == userId).OrderBy(a => a.InsertedDate).ToListAsync();
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
                                                                                                                                 && (a.InsertedDate >= PredictionFromDate
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

                List<ScrewCompressorTrainModel> screwCompressorTrainData = await _context.ScrewCompressureTrainData.Where(a => a.UserId == userId).OrderBy(a => a.InsertedDate).ToListAsync();
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


                List<ScrewCompressorTrainClassificationModel> screwCompressorTrainClassificationData = await _context.ScrewCompressureTrainClassifications.Where(a => a.UserId == userId).OrderBy(a => a.InsertedDate).ToListAsync();
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
