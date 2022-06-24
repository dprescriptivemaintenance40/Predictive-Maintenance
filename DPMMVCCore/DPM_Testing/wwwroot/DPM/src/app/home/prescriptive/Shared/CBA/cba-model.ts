export class PrescriptiveCbaModel {
    public PCMId: number;
    public CFPPrescriptiveId: number;
    public CPPFMId: number;
    public TagNumber: string = "";
    public EquipmentType :string = "";
    public FunctionFailure :string = "";
    public IsAgeRelated: string = ""
    public RiskMatrix: string = ""
    public Consequence: string = ""
    public HasScenario: string = ""
    public DescribeScenario: string = ""
    public CBAFailureModes: any = []
}
export class CBAFailureMode {
    public CFMId: number;
    public PCMId: number;
    public FailureMode: string = "";
    public ETBF: number;
    public PONC: number;
    public EC: string;
    public HS: string = "";
    public EV: string;
    public CA: string;
    public ETBC: number;
    public TotalAnnualPOC: number;
    public TotalAnnualCostWithMaintenance: number;
    public ResidualRiskWithMaintenance: number;
    public MEI: number;
    public CBAMaintenanceTasks:any = [];
}
export class CBAMaintenanceTask {
    public CMTId: number = 0;
    public CFMId: number = 0;
    public CentrifugalPumpMssId: number = 0;
    public MSSMaintenanceTask: string = ""
    public MSSStartergy: string = ""
    public MaterialCost: number = 0;
    public Status: string = "";
    public CBAMainenanceIntervals:any = [];
}
export class CBAMaintenanceInterval {
    public CMIId: number;
    public CMTId: number;
    public Maintenancelibrary: string;
    public MSSFrequency: string = ""
    public RWC: string;
    public TaskDuration: number;
    public ResourceCost: number;
    public POC: number;
    public AnnualPOC: number;
    public WorkCenter: string = ""
    public OnStream: string = ""
}


