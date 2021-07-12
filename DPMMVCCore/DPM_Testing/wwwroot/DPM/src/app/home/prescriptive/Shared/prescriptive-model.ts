
    export class CentrifugalPumpPrescriptiveModels
    {
        public CFPPrescriptiveId 
        public UserId 
        public MachineType 
        public EquipmentType 
        public TagNumber 
        public FunctionFluidType 
        public FunctionFailure 
        public Date 
        public FailureModeWithLSETree 
        public FMWithConsequenceTree 
        public ComponentCriticalityFactor 
        public ComponentRating 
        public CMaintainenancePractice 
        public CFrequencyMaintainenance 
        public CConditionMonitoring 
        public CAttachmentDBPath 
        public CAttachmentFullPath 
        public CRemarks 
        public FCAAdded 
        public MSSAdded 
        public centrifugalPumpPrescriptiveFailureModes : any = []
        

    }

    export class CentrifugalPumpPrescriptiveFailureMode
    {
       
        public CPPFMId 
        public CFPPrescriptiveId 
        public FunctionMode 
        public LocalEffect 
        public SystemEffect 
        public Consequence 
        public DownTimeFactor 
        public ScrapeFactor 
        public SafetyFactor 
        public ProtectionFactor 
        public FrequencyFactor 
        public CriticalityFactor 
        public Rating 
        public MaintainenancePractice 
        public FrequencyMaintainenance 
        public ConditionMonitoring 
        public AttachmentDBPath 
        public AttachmentFullPath 
        public Remark 
        public Pattern 
        public FCACondition 
        public FCAInterval 
        public FCAFFI 
        public FCAComment 
        public FCAAlpha 
        public FCABeta 
        public FCASafeLife 
        public FCAUsefulLife 
        public FCAUpdateIntervals 
        public FCAUpdateConditions 
        public MSSStartergyList
        public CentrifugalPumpMssModel : any = []
        
    }

    

