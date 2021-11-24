using DPM_ServerSide.Models.CompressorModel.ScrewCompressorModel;
using DPM_Testing.Models;
using Microsoft.EntityFrameworkCore;
using DPM.Models.CompressorModel.ScrewCompressorModel;
using DPM.Models.Prescriptive;
using DPM.Models.PumpModel;
using DPM.Models.RecycleBinModel;
using DPM.Models.Prescriptive.RCA;
using DPM.Models.Prescriptive.PSR;
using DPM.Models.Prescriptive.FMEA;
using DPM.Models;

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
        public DbSet<CentrifugalPumpPrescriptiveModel> PrescriptiveModelData { get; set; }
        public DbSet<PrescriptiveLookupMasterModel> PrescriptiveLookupMassterModelData { get; set; }
        public DbSet<ContactUs> contactUs { get; set; }
        public DbSet<RegistrationModel> RegisterUsers { get; set; }
        public DbSet<CentrifugalPumpModel> CentrifugalPumpModelData { get; set; }
        public DbSet<CentrifugalPumpPrescriptiveFailureMode> centrifugalPumpPrescriptiveFailureModes { get; set; }
        public DbSet<CentrifugalPumpMssModel> CentrifugalPumpMssModels { get; set; }
        public DbSet<FMEAPrescriptiveModel> FMEAPrescriptiveModelData { get; set; }
        public DbSet<FMEAPumpPrescriptiveFailureModes> FMEAPumpPrescriptiveFailureModes { get; set; }
        public DbSet<RecycleBinCentrifugalPumpPrescriptiveModel> recycleCentrifugalPumpModelData { get; set; }
        public DbSet<RestoreCentrifugalPumpPrescriptiveFailureMode> restoreCentrifugalPumpPrescriptiveFailureModes { get; set; }
        public DbSet<CentrifugalPumpWeekDataModel> CentrifugalPumpWeekDataModel { get; set; }
        public DbSet<RCAModel> rCAModels{ get; set; }
        public DbSet<CentrifugalPumpHQLibraryModel> CentrifugalPumpHQLibraryModels { get; set; }
        public DbSet<CentrifugalPumpPredictionModel> CentrifugalPumpPredictions { get; set; }
        public DbSet<CentrifugalPumpTrainModel> CentrifugalPumpTrainData { get; set; }
        public DbSet<CentrifugalPumpFuturePredictionModel> CentrifugalPumpFuturePredictionModels { get; set; }
        public DbSet<PSRClientContractorModel> PSRClientContractorModels { get; set; }
        public DbSet<MSSStrategyModel> MSSStrategyModels { get; set; }
        public DbSet<MapStrategySkillModel> MapStrategySkillModels { get; set; }
        public DbSet<SkillPSRMappingModel> SkillPSRMappingModels { get; set; }
        public DbSet<SkillPSRMappingMSS> SkillPSRMappingMSS { get; set; }
        public DbSet<UserSkillLibraryModel> UserSkillLibraryModels { get; set; }
        public DbSet<UserProductionModel> UserProductionModels { get; set; }
        public DbSet<ScrewCompressorForecastModel> ScrewCompressorForecastModels { get; set; }
        public DbSet<CBAModel> CBAModels { get; set; }
        public DbSet<CBATaskModel> CBATaskModels { get; set; }
        public DbSet<DesignationAccessModel> DesignationAccessModels { get; set; }
        public DbSet<RBDModel> RBDModels { get; set; }
        public DbSet<CriticalityAssesmentModel> CriticalityAssesmentModels { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ScrewCompressorConfigurationModel>().ToTable("addrulemodel");
            modelBuilder.Entity<ScrewCompressorTrainModel>().ToTable("compressuredetails");
            modelBuilder.Entity<ScrewCompressorTrainClassificationModel>().ToTable("compressurewithclassification");
            modelBuilder.Entity<ScrewCompressorPredictionModel>().ToTable("screwcompressorpredictiontable");
            modelBuilder.Entity<ScrewCompressorFuturePredictionModel>().ToTable("screwcompressorfutureprediction");
            modelBuilder.Entity<ContactUs>().ToTable("contactus").HasKey(p => p.ContactUsId);
            modelBuilder.Entity<RegistrationModel>().ToTable("RegisterUser");
            modelBuilder.Entity<PrescriptiveLookupMasterModel>().ToTable("prescriptive_lookupmaster");
            modelBuilder.Entity<CentrifugalPumpModel>().ToTable("centrifugalpump");
            modelBuilder.Entity<CentrifugalPumpWeekDataModel>().ToTable("centrifugalpumpweekdata");
            modelBuilder.Entity<CentrifugalPumpPrescriptiveModel>().ToTable("dpmprescriptive");
            modelBuilder.Entity<CentrifugalPumpPrescriptiveFailureMode>().ToTable("centrifugalpumpfailuremodes");
            modelBuilder.Entity<CentrifugalPumpPrescriptiveFailureMode>()
                        .HasOne(p => p.CentrifugalPumpPrescriptiveModel)
                        .WithMany(b => b.centrifugalPumpPrescriptiveFailureModes)
                        .HasForeignKey(a => a.CFPPrescriptiveId);
            modelBuilder.Entity<CentrifugalPumpMssModel>().ToTable("centrifugalpumpmsstable");
            modelBuilder.Entity<CentrifugalPumpMssModel>()
                        .HasOne(p => p.CentrifugalPumpPrescriptiveFailureMode)
                        .WithMany(b => b.CentrifugalPumpMssModel)
                        .HasForeignKey(a => a.CPPFMId);

            modelBuilder.Entity<FMEAPrescriptiveModel>().ToTable("fmeaprescriptive");
            modelBuilder.Entity<FMEAPumpPrescriptiveFailureModes>().ToTable("fmeapumpfailuremodes");
            modelBuilder.Entity<FMEAPumpPrescriptiveFailureModes>()
                    .HasOne(p => p.FMEAPrescriptiveModel)
                    .WithMany(b => b.FMEAPumpPrescriptiveFailureModes)
                    .HasForeignKey(a => a.CFPPrescriptiveId);


            modelBuilder.Entity<RecycleBinCentrifugalPumpPrescriptiveModel>().ToTable("recycledpmprescriptive");
            modelBuilder.Entity<RestoreCentrifugalPumpPrescriptiveFailureMode>().ToTable("recyclecentrifugalpumpfailuremodes");
            modelBuilder.Entity<RestoreCentrifugalPumpPrescriptiveFailureMode>()
                        .HasOne(p => p.RecycleBinCentrifugalPumpPrescriptiveModel)
                        .WithMany(b => b.restoreCentrifugalPumpPrescriptiveFailureModes)
                        .HasForeignKey(a => a.RCPPMId);
            modelBuilder.Entity<RCAModel>().ToTable("rcatable");
            modelBuilder.Entity<CentrifugalPumpHQLibraryModel>().ToTable("centrifugalpumpHQtable");
            modelBuilder.Entity<CentrifugalPumpTrainModel>().ToTable("centrifugalpumpTraindetails");
            modelBuilder.Entity<CentrifugalPumpPredictionModel>().ToTable("centrifugalpumppredictiontable");
            modelBuilder.Entity<CentrifugalPumpFuturePredictionModel>().ToTable("centrifugalpumpfuturepredictiontable");
            modelBuilder.Entity<PSRClientContractorModel>().ToTable("PSRClientContractor");
            modelBuilder.Entity<MSSStrategyModel>().ToTable("MSSStrategyMaintenanceTask");
            modelBuilder.Entity<MapStrategySkillModel>().ToTable("MapStrategySkillModel");
            modelBuilder.Entity<SkillPSRMappingModel>().ToTable("SkillPSRMappingtable");
            modelBuilder.Entity<SkillPSRMappingMSS>().ToTable("SkillPSRMappingMSSModel");
            modelBuilder.Entity<SkillPSRMappingMSS>()
                        .HasOne(p => p.SkillPSRMappingModel)
                        .WithMany(b => b.SkillPSRMappingMSS)
                        .HasForeignKey(a => a.PSRId);
            modelBuilder.Entity<UserSkillLibraryModel>().ToTable("UserSkillLibraryModelTable");
            modelBuilder.Entity<UserProductionModel>().ToTable("UserProductionModelTable");
            modelBuilder.Entity<ScrewCompressorForecastModel>().ToTable("forecast").HasNoKey();
            modelBuilder.Entity<CBAModel>().ToTable("CBAModelTable");
            modelBuilder.Entity<CBATaskModel>().ToTable("CBATaskModelTable");
            modelBuilder.Entity<CBATaskModel>()
                        .HasOne(p => p.CBAModel)
                        .WithMany(b => b.CBATaskModel)
                        .HasForeignKey(a => a.CBAId);
            modelBuilder.Entity<DesignationAccessModel>().ToTable("DesignationAccessModelTable");
            modelBuilder.Entity<RBDModel>().ToTable("RBDTable");
        modelBuilder.Entity<CriticalityAssesmentModel>().ToTable("CriticalityAssesmentModelTable");
        }

    }
}
