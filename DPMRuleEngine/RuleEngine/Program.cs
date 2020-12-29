using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading;

namespace RuleEngine
{
    public class Program : DbContext
    {
        public static string connString;
        public object DataSource { get; set; }
        public DbSet<AddRuleModel> AddRuleModels { get; set; }
        public DbSet<CompressureDetailsModel> compressDetail { get; set; }
        public DbSet<CompressureWithClassificationModel> compressureWithClassifications { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(connString);
            Console.WriteLine("=================Connected with postgre sql=============");
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


        static void Main(string[] args)
        {
            var builder = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json");
            var configuration = builder.Build();
            connString = configuration["PostgreConnectionString"];
            Console.WriteLine("=================== Processing Stage is started ===========================");

            using (var context = new Program())
            {

                try
                {
                    DataTable t = new DataTable();
                    IQueryable<CompressureDetailsModel> compressDetail = context.compressDetail.Where(a => string.IsNullOrEmpty(a.ProcessingStage)).AsQueryable();
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
                            if (TS1 >= Convert.ToDecimal(dtRules.Rows[4]["Trigger"])
                                || (TD1 >= Convert.ToDecimal(dtRules.Rows[5]["Trigger"]) || TD1 <= Convert.ToDecimal(dtRules.Rows[5]["Alarm"]))
                                 || (TS2 >= Convert.ToDecimal(dtRules.Rows[6]["Trigger"]) || TS2 <= Convert.ToDecimal(dtRules.Rows[6]["Alarm"]))
                                 || (TD2 >= Convert.ToDecimal(dtRules.Rows[7]["Trigger"]) || TD2 <= Convert.ToDecimal(dtRules.Rows[7]["Alarm"]))
                                 || Convert.ToDecimal(TD1 - TS1) >= Convert.ToDecimal(dtRules.Rows[8]["Trigger"])
                                 || Convert.ToDecimal(TD2 - TS2) >= Convert.ToDecimal(dtRules.Rows[9]["Trigger"])
                                 || Convert.ToDecimal(((PD1 + 1) / (PS1 + 1)) - 1) <= Convert.ToDecimal(dtRules.Rows[10]["Trigger"])
                                 || Convert.ToDecimal(((PD2 + 1) / (PS2 + 1)) - 1) <= Convert.ToDecimal(dtRules.Rows[11]["Trigger"]))
                            {
                                row["ClassificationId"] = 1;
                                row["Classification"] = "incipient";
                                row["ProcessingStage"] = "Done";
                            }

                            else if (TD1 >= Convert.ToDecimal(dtRules.Rows[5]["Alarm"])
                                 || TS2 >= Convert.ToDecimal(dtRules.Rows[6]["Alarm"])
                                 || TD2 >= Convert.ToDecimal(dtRules.Rows[7]["Alarm"]))
                            {
                                row["ClassificationId"] = 2;
                                row["Classification"] = "degrade";
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
                            compressurewithclassification.PS1 = PS1;
                            compressurewithclassification.PD1 = PD1;
                            compressurewithclassification.PS2 = PS2;
                            compressurewithclassification.PD2 = PD2;
                            compressurewithclassification.TS1 = TS1;
                            compressurewithclassification.TD1 = TD1;
                            compressurewithclassification.TS2 = TS2;
                            compressurewithclassification.TD2 = TD2;
                            compressurewithclassification.ClassificationId = Convert.ToInt32(row["ClassificationId"]);
                            compressurewithclassification.Classification = Convert.ToString(row["Classification"]);
                            compressurewithclassification.InsertedDate = DateTime.Now;
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
                            compressuredetails.TenantId = 1;
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
                    Console.ReadLine();
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Processing Stage BatchId : Failed");
                    Console.WriteLine(ex.StackTrace);
                }

            }

        }


    }
}
