export class CentrifugalPumpCbaModel {
    public CPCMId: string = ""
    public CentrifugalPumpMssId: string = ""
    public CFPPrescriptiveId: string = ""
    public CPPFMId: string = ""
    public TagNumber: string = ""
    public centrifugalPumpPrescriptiveCBAFailureModes: any = []
}
export class CentrifugalPumpPrescriptiveCBAFailureMode {
    public CPPCFMId: number;
    public CPCMId: number;
    public FailureMode: string = ""
    public CBAFailureModeTasks: any = []
}
export class CBAFailureModeTask {
    public CFMId: number;
    public CPPCFMId: number;
    public IsAgeRelated: string = ""
    public RiskMatrix: string = ""
    public Consequence: string = ""
    public HasScenario: string = ""
    public DescribeScenario: string = ""
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