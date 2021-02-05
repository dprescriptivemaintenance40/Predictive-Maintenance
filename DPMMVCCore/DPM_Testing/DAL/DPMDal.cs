using DPM_ServerSide.Models.CompressorModel.ScrewCompressorModel;
using DPM_ServerSide.Models.CompressorModel;
using DPM_Testing.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DPM.Models.CompressorModel.ScrewCompressorModel;

namespace DPM_ServerSide.DAL
{
    public class DPMDal:DbContext
    {
       

        public DPMDal(DbContextOptions<DPMDal> options) : base(options)
        {

        }

        public DbSet<ScrewCompressorConfigurationModel> AddRuleModels { get; set; }
        public DbSet<ScrewCompressorTrainModel> ScrewCompressureTrainData { get; set; }
        public DbSet<ScrewCompressorPredictionModel> ScrewCompressurePredictionData { get; set; }
        public DbSet<ScrewCompressorTrainClassificationModel> ScrewCompressureTrainClassifications { get; set; }
        public DbSet<ScrewCompressorFuturePredictionModel> ScrewCompressureFuturePrediction { get; set; }
        public DbSet<ContactUs> contactUs { get; set; }
        public DbSet<RegisterUser> RegisterUsers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ScrewCompressorConfigurationModel>().ToTable("addrulemodel");
            modelBuilder.Entity<ScrewCompressorTrainModel>().ToTable("compressuredetails");
            modelBuilder.Entity<ScrewCompressorTrainClassificationModel>().ToTable("compressurewithclassification");
            modelBuilder.Entity<ScrewCompressorPredictionModel>().ToTable("screwcompressorpredictiontable");
            modelBuilder.Entity<ScrewCompressorFuturePredictionModel>().ToTable("screwcompressorfutureprediction");
            modelBuilder.Entity<ContactUs>().ToTable("contactus").HasKey(p => p.ContactUsId);
            modelBuilder.Entity<RegistrationModel>().ToTable("registeruser");
        }

    }
}
