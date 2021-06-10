using DPM.Models.PumpModel;
using DPM_ServerSide.DAL;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace DPM.Controllers.Pumps.CentrifugalPump
{
    [Route("api/[controller]")]
    [ApiController]

    public class CentrifugalPumpTrainAPIController : ControllerBase
    {
        private readonly DPMDal _context;

        public CentrifugalPumpTrainAPIController(DPMDal context)
        {
            _context = context;
        }
        public async Task<IActionResult> GetClassification()
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;
            try
            {
                List<CentrifugalPumpTrainClassificationModel> centrifugalPumpClassification = await _context.CentrifugalPumpTrainClassifications.Where(a => a.UserId == userId).ToListAsync();
                var PumpClassificationData = centrifugalPumpClassification.ToList();
                return Ok(PumpClassificationData);
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }

        }
        [HttpPost]
        [Route("PumpConfiguration")]
        public async Task<IActionResult> PostConfiguration([FromBody] List<CentrifugalPumpTrainModel> pumpdetails)
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;

            try
            {
                foreach (var item in pumpdetails)
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
                    _context.CentrifugalPumpTrainData.Add(item);
                    await _context.SaveChangesAsync();

                }
                return Ok(pumpdetails);
            }
            catch (Exception exe)
            {
                return BadRequest(exe.Message);
            }

        }

        // GET api/<CentrifugalPumpTrainAPIController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        [HttpPost]
        [Route("PumpUploadCSV")]
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
                    var list = new List<CentrifugalPumpTrainModel>();

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
                            var obj = new CentrifugalPumpTrainModel();
                            IRow row = sheet.GetRow(i);
                            var PS = row.GetCell(0).ToString();
                            var PD = row.GetCell(1).ToString();
                            var Q = row.GetCell(2).ToString();
                            var D = row.GetCell(3).ToString();
                            var H = row.GetCell(4).ToString();
                            var E = row.GetCell(5).ToString();
                            var g = row.GetCell(6).ToString();
                            var F = row.GetCell(7).ToString();

                            obj.TenantId = 1;
                            obj.PS = Convert.ToDecimal(PS);
                            obj.PD = Convert.ToDecimal(PD);
                            obj.Q = Convert.ToDecimal(Q);
                            obj.D = Convert.ToDecimal(D);
                            obj.H = Convert.ToDecimal(H);
                            obj.E = Convert.ToDecimal(E);
                            obj.g = Convert.ToDecimal(g);
                            obj.F = Convert.ToDecimal(F);


                            list.Add(obj);
                            _context.CentrifugalPumpTrainData.Add(obj);
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
