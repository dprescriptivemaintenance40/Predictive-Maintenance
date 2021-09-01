export class CentrifugalPumpPrescriptiveModel{
    public CFPPrescriptiveId : number = 0 ;
    public UserId : string = "";
    public MachineType : string = "";
    public EquipmentType : string = "";
    public TagNumber : string = "";
    public FunctionFluidType : string = "";
    public FunctionRatedHead : string = "";
    public FunctionPeriodType : string = "";
    public FunctionFailure : string = "";
    public Date : Date ;
    public FailureModeWithLSETree : string = "";
    public FMWithConsequenceTree : string = "";
    public FCAAdded : string = "";
    public MSS : string = "";
    public Type : string = "";

    public centrifugalPumpPrescriptiveFailureModes: any = []

}

