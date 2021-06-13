using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection;
using static RuleEngine.RuleDbContext;
using System.Linq;
using System.ComponentModel.DataAnnotations;

namespace RuleEngine
{
    public static class RuleEngine
    {
        [FunctionName("RuleEngine")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Admin, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            string Userid = req.Query["UserId"];

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);
            Userid = Userid ?? data?.Userid;

             using (var context = new RuleDbContext())
            {

                try
                {
                    DataTable t = new DataTable();
                    IQueryable<CompressureDetailsModel> compressDetail = context.compressDetail
                                                                                .Where(a => string.IsNullOrEmpty(a.ProcessingStage) 
                                                                                         && a.UserId == Userid).OrderBy(a => a.InsertedDate)
                                                                                         .AsQueryable();
                    DataTable dt = ToDataTable<CompressureDetailsModel>(compressDetail.ToList());
                    DataColumn dc = new DataColumn("ClassificationId");
                    DataColumn dc1 = new DataColumn("Classification", typeof(string));
                    DataColumn dc2 = new DataColumn("ProcessingStage", typeof(string));
                    dt.Columns.Add(dc);
                    dt.Columns.Add(dc1);
                    dc2.AllowDBNull = true;
                    t.Columns.Add(dc2);

                    IQueryable<AddRuleModel> ruleDetails = context.AddRuleModels.OrderBy(a => a.AddRuleId).AsQueryable();
                    DataTable dtRules = ToDataTable<AddRuleModel>(ruleDetails.ToList());



                    foreach (DataRow row in dt.Rows)
                    {
                        var ProcessingStage = Convert.ToString(row["ProcessingStage"]);
                        if (ProcessingStage == "")
                        {
                            var id = Convert.ToDecimal(row["BatchId"]);
                            var TenantId = Convert.ToDecimal(row["TenantId"]);
                            var InsertedDate = Convert.ToDateTime(row["InsertedDate"]);
                            var PS1 = Convert.ToDecimal(row["PS1"]);
                            var PD1 = Convert.ToDecimal(row["PD1"]);
                            var PS2 = Convert.ToDecimal(row["PS2"]);
                            var PD2 = Convert.ToDecimal(row["PD2"]);
                            var TS1 = Convert.ToDecimal(row["TS1"]);
                            var TD1 = Convert.ToDecimal(row["TD1"]);
                            var TS2 = Convert.ToDecimal(row["TS2"]);
                            var TD2 = Convert.ToDecimal(row["TD2"]);
                            var UserId = Convert.ToString(row["UserId"]);

                            var T = Convert.ToDecimal(TD1 - TS1);
                            var T2 = Convert.ToDecimal(TD2 - TS2);
                            var T3 = Convert.ToDecimal((((PD1 + 1) / (PS1 + 1)) - 1));
                            var T4 = Convert.ToDecimal((((PD2 + 1) / (PS2 + 1)) - 1));
                            if (((PD1 >= Convert.ToDecimal(dtRules.Rows[1]["Trigger"])))
                                 && (T >= Convert.ToDecimal(dtRules.Rows[8]["Trigger"]))
                                 && (T2 >= Convert.ToDecimal(dtRules.Rows[9]["Trigger"]))
                                 && (T3 >= Convert.ToDecimal(dtRules.Rows[10]["Trigger"]))
                                 && (T4 <= Convert.ToDecimal(dtRules.Rows[11]["Trigger"])))
                            {
                                row["ClassificationId"] = 2;
                                row["Classification"] = "degrade";
                                row["ProcessingStage"] = "Done";
                            }

                            else if ((PD1 <= Convert.ToDecimal(dtRules.Rows[1]["Alarm"]))
                                  || (PS2 <= Convert.ToDecimal(dtRules.Rows[2]["Alarm"]))
                                  || (PD2 <= Convert.ToDecimal(dtRules.Rows[3]["Alarm"]))
                                  || (TD1 <= Convert.ToDecimal(dtRules.Rows[5]["Alarm"]))
                                  || (TD2 <= Convert.ToDecimal(dtRules.Rows[7]["Alarm"])))
                            {
                                row["ClassificationId"] = 3;
                                row["Classification"] = "bad";
                                row["ProcessingStage"] = "Done";
                            }

                            else if (((PD1 >= Convert.ToDecimal(dtRules.Rows[1]["Trigger"])))
                                 || (T >= Convert.ToDecimal(dtRules.Rows[8]["Trigger"]))
                                 || (T2 >= Convert.ToDecimal(dtRules.Rows[9]["Trigger"]))
                                 || (T3 >= Convert.ToDecimal(dtRules.Rows[10]["Trigger"]))
                                 || (T4 <= Convert.ToDecimal(dtRules.Rows[11]["Trigger"])))
                            {
                                row["ClassificationId"] = 1;
                                row["Classification"] = "incipient";
                                row["ProcessingStage"] = "Done";
                            }
                            else
                            {
                                row["ClassificationId"] = 0;
                                row["Classification"] = "normal";
                                row["ProcessingStage"] = "Done";
                            }

                            CompressureWithClassificationModel compressurewithclassification = new CompressureWithClassificationModel();
                            compressurewithclassification.BatchId = Convert.ToInt32(row["BatchId"]);
                            compressurewithclassification.TenantId = Convert.ToInt32(row["TenantId"]);
                            compressurewithclassification.PS1 = PS1;
                            compressurewithclassification.PD1 = PD1;
                            compressurewithclassification.PS2 = PS2;
                            compressurewithclassification.PD2 = PD2;
                            compressurewithclassification.TS1 = TS1;
                            compressurewithclassification.TD1 = TD1;
                            compressurewithclassification.TS2 = TS2;
                            compressurewithclassification.TD2 = TD2;
                            compressurewithclassification.UserId = UserId;
                            compressurewithclassification.InsertedDate = DateTime.Now;
                            compressurewithclassification.ClassificationId = Convert.ToInt32(row["ClassificationId"]);
                            compressurewithclassification.Classification = Convert.ToString(row["Classification"]);
                            context.compressureWithClassifications.Add(compressurewithclassification);

                            CompressureDetailsModel compressuredetails = new CompressureDetailsModel();
                            compressuredetails.BatchId = Convert.ToInt32(row["BatchId"]);
                            compressuredetails.PS1 = PS1;
                            compressuredetails.PD1 = PD1;
                            compressuredetails.PS2 = PS2;
                            compressuredetails.PD2 = PD2;
                            compressuredetails.TS1 = TS1;
                            compressuredetails.TD1 = TD1;
                            compressuredetails.TS2 = TS2;
                            compressuredetails.TD2 = TD2;
                            compressuredetails.UserId = UserId;
                            compressuredetails.TenantId = Convert.ToInt32(row["TenantId"]);
                            compressuredetails.InsertedDate = InsertedDate;
                            compressuredetails.ProcessingStage = Convert.ToString(row["ProcessingStage"]);

                            var dbEntity = context.Find<CompressureDetailsModel>(compressuredetails.BatchId);
                            context.Entry(dbEntity).State = EntityState.Detached;
                            context.Entry(compressuredetails).State = EntityState.Modified;

                            context.SaveChanges();

                            Console.WriteLine("Processing Stage BatchId {0}", compressuredetails.BatchId, ": Done");

                            continue;
                        }
                    }

                    Console.WriteLine("=================== Processing Stage is end ===========================");
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Processing Stage BatchId : Failed");
                    Console.WriteLine(ex.StackTrace);
                }

            }

            string responseMessage = string.IsNullOrEmpty(Userid)
                ? "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response."
                : $"Hello, {Userid}. This HTTP triggered function executed successfully.";

            return new OkObjectResult(responseMessage);
        }
    }
    public class RuleDbContext : DbContext
    {
        public DbSet<AddRuleModel> AddRuleModels { get; set; }
        public DbSet<CompressureDetailsModel> compressDetail { get; set; }
        public DbSet<CompressureWithClassificationModel> compressureWithClassifications { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(@"Server=51.79.221.240;Database=DPMDB;Port=5432;User Id=postgres;Password=Admin@123");
            Console.WriteLine(" =================Connected with postgre sql=============");
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AddRuleModel>().ToTable("addrulemodel");
            modelBuilder.Entity<CompressureDetailsModel>().ToTable("compressuredetails");
            modelBuilder.Entity<CompressureWithClassificationModel>().ToTable("compressurewithclassification");
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

        public class AddRuleModel
        {
            [Key]
            public int AddRuleId { get; set; }
            public string Columns { get; set; }
            public float Alarm { get; set; }
            public float Trigger { get; set; }
            public string Condition { get; set; }

        }
        public class CompressureDetailsModel
        {
            [Key]
            public int BatchId { get; set; }
            public string UserId { get; set; }
            public int TenantId { get; set; }
            public decimal PS1 { get; set; }
            public decimal PD1 { get; set; }
            public decimal PS2 { get; set; }
            public decimal PD2 { get; set; }
            public decimal TS1 { get; set; }
            public decimal TD1 { get; set; }
            public decimal TS2 { get; set; }
            public decimal TD2 { get; set; }
            public DateTime InsertedDate { get; set; }
            public string ProcessingStage { get; set; }


        }
        public class CompressureWithClassificationModel
        {
            [Key]
            public int CompClassID { get; set; }
            public string UserId { get; set; }
            public int BatchId { get; set; }
            public int TenantId { get; set; }
            public int ClassificationId { get; set; }
            public decimal PS1 { get; set; }
            public decimal PD1 { get; set; }
            public decimal PS2 { get; set; }
            public decimal PD2 { get; set; }
            public decimal TS1 { get; set; }
            public decimal TD1 { get; set; }
            public decimal TS2 { get; set; }
            public decimal TD2 { get; set; }
            public DateTime InsertedDate { get; set; }
            public string Classification { get; set; }
        }
    }

}
