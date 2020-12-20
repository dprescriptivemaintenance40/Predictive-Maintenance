using DPM_Testing.DAL;
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
    public class CompressureDetailsAPIController : ControllerBase
    {

        private readonly DPMDal _context;

        public CompressureDetailsAPIController(DPMDal context)
        {
            _context = context;
        }
        // GET: api/<CompressureDetailsAPIController>
        [HttpGet]
        //  public IEnumerable<string> Get()
        //  {
        //      return new string[] { "value1", "value2" };
        //  }

        public async Task<ActionResult<IEnumerable<compressurewithclassification>>> GetcompressureWithClassifications()
        {
            return await _context.compressureWithClassifications.ToListAsync();
        }




        // GET api/<CompressureDetailsAPIController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<CompressureDetailsAPIController>
        [HttpPost]
        public IActionResult Post([FromBody] List<compressuredetails> compressuredetails)
        {
            // var CompresureList = JsonConvert.DeserializeObject<compresureList>(json);
            try
            {
                foreach (var item in compressuredetails)
                {
                    item.TenantId = 1;
                    item.InsertedDate = DateTime.Now;
                    _context.compressuredetails.Add(item);
                    _context.SaveChanges();

                }

                //List<compressuredetails> compressDetail = _context.compressuredetails.ToList();
                //DataTable dt = ToDataTable<compressuredetails>(compressDetail);
                //DataColumn dc = new DataColumn("ClassificationId");
                //DataColumn dc1 = new DataColumn("Classification", typeof(string));
                //dt.Columns.Add(dc);
                //dt.Columns.Add(dc1);

                //List<AddRuleModel> ruleDetails = _context.AddRuleModels.ToList();
                //DataTable dtRules = ToDataTable<AddRuleModel>(ruleDetails);

                //foreach (DataRow row in dt.Rows)
                //{
                //    var PS1 = Convert.ToDecimal(row["PS1"]);
                //    var PD1 = Convert.ToDecimal(row["PD1"]);
                //    var PS2 = Convert.ToDecimal(row["PS2"]);
                //    var PD2 = Convert.ToDecimal(row["PD2"]);
                //    var TS1 = Convert.ToDecimal(row["TS1"]);
                //    var TD1 = Convert.ToDecimal(row["TD1"]);
                //    var TS2 = Convert.ToDecimal(row["TS2"]);
                //    var TD2 = Convert.ToDecimal(row["TD2"]);
                //    if (TS1 >= Convert.ToDecimal(dtRules.Rows[4]["Trigger"])
                //        && (TD1 >= Convert.ToDecimal(dtRules.Rows[5]["Trigger"]) && TD1 <= Convert.ToDecimal(dtRules.Rows[5]["Alarm"]))
                //        && (TS2 >= Convert.ToDecimal(dtRules.Rows[6]["Trigger"]) && TS2 <= Convert.ToDecimal(dtRules.Rows[6]["Alarm"]))
                //        && (TD2 >= Convert.ToDecimal(dtRules.Rows[7]["Trigger"]) && TD2 <= Convert.ToDecimal(dtRules.Rows[7]["Alarm"]))
                //        && Convert.ToDecimal(TD1 - TS1) >= Convert.ToDecimal(dtRules.Rows[8]["Trigger"]) && Convert.ToDecimal(TD2 - TS2) >= Convert.ToDecimal(dtRules.Rows[9]["Trigger"])
                //        && Convert.ToDecimal(((PD1 + 1) / (PS1 + 1)) - 1) <= Convert.ToDecimal(dtRules.Rows[10]["Trigger"])
                //        && Convert.ToDecimal(((PD2 + 1) / (PS2 + 1)) - 1) <= Convert.ToDecimal(dtRules.Rows[11]["Trigger"]))
                //    {
                //        row["ClassificationId"] = 1;
                //        row["Classification"] = "incipient";
                //    }
                //    else if (TD1 >= Convert.ToDecimal(dtRules.Rows[5]["Alarm"])
                //        && TS2 >= Convert.ToDecimal(dtRules.Rows[6]["Alarm"])
                //        && TD2 >= Convert.ToDecimal(dtRules.Rows[7]["Alarm"]))
                //    {
                //        row["ClassificationId"] = 2;
                //        row["Classification"] = "degrade";
                //    }
                //    else
                //    {
                //        row["ClassificationId"] = 0;
                //        row["Classification"] = "normal";
                //    }

                //    compressurewithclassification compressurewithclassification = new compressurewithclassification();
                //    compressurewithclassification.BatchId = Convert.ToInt32(row["BatchId"]);
                //    compressurewithclassification.PS1 = PS1;
                //    compressurewithclassification.PD1 = PD1;
                //    compressurewithclassification.PS2 = PS2;
                //    compressurewithclassification.PD2 = PD2;
                //    compressurewithclassification.TS1 = TS1;
                //    compressurewithclassification.TD1 = TD1;
                //    compressurewithclassification.TS2 = TS2;
                //    compressurewithclassification.TD2 = TD2;
                //    compressurewithclassification.ClassificationId = Convert.ToInt32(row["ClassificationId"]);
                //    compressurewithclassification.Classification = Convert.ToString(row["Classification"]);
                //    compressurewithclassification.InsertedDate = DateTime.Now;
                //    _context.compressureWithClassifications.Add(compressurewithclassification);

                    //ClassificationMaster classiMaster = new ClassificationMaster();
                    //classiMaster.ClassificationId = compressurewithclassification.ClassificationId;
                    //classiMaster.Classifications = compressurewithclassification.Classification;
                    //_context.classiMaster.Add(classiMaster);
                //    _context.SaveChanges();

                //}

                //  var compressWithClassification = _context.compressureWithClassifications.ToList();
                //var compressWithClassification = (from pd in _context.compressureWithClassifications
                //                                  join od in _context.classiMaster on pd.ClassificationId equals od.ClassificationMasterId


                //                                  select new
                //                                  {   pd.PS1,
                //                                      pd.PD1,
                //                                      pd.PS2,
                //                                      pd.PD2,
                //                                      pd.TS1,
                //                                      pd.TD1,
                //                                      pd.TS2,
                //                                      pd.TD2,
                //                                      od.ClassificationId,
                //                                      od.Classifications,
                //                                  }).ToList();
                return Ok(compressuredetails);
            }
            catch (Exception exe)
            {

       
                return BadRequest(exe.Message);
            }
            
        }

        // PUT api/<CompressureDetailsAPIController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<CompressureDetailsAPIController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }

        public  DataTable ToDataTable<T>(List<T> items)
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
    }
}
