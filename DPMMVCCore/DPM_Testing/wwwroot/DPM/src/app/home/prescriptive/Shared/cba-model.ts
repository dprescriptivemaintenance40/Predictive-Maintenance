export class CentrifugalPumpCbaModel {
    public CPCMId: number;
    public CFPPrescriptiveId: number;
    public CPPFMId: number;
    public TagNumber: string = "";
    public FailureMode: string = ""
    public IsAgeRelated: string = ""
    public RiskMatrix: string = ""
    public Consequence: string = ""
    public HasScenario: string = ""
    public DescribeScenario: string = ""
    public CBAFailureModeTasks: any = []
}
export class CBAFailureModeTask {
    public CFMId: number;
    public CPCMId: number;
    public CPMId:number;
    public MSSMaintenanceTask: string = ""
    public MSSStartergy: string = ""
    public MSSMAintenanceInterval: string = ""
    public RWC: number;
    public TaskDuration: number;
    public ResourceCost: number;
    public MaterialCost: number;
    public POC: number;
    public WorkCenter: string = ""
    public OnStream: string = ""
    public Status: string = ""
}