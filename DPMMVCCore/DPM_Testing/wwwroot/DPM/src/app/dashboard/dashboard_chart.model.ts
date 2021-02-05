import { DatePipe } from "@angular/common";

export class DashboardChartModel {
    public CompClassID :number= 0;
    public UserId: string = "";
    public BatchId: number = 0;
    public TenantId: number = 0;
    public ClassificationId: number = 0;
    public PS1: number = 0;
    public PD1: number = 0;
    public PS2: number = 0;
    public PD2: number = 0;
    public TS1: number = 0;
    public TD1: number = 0;
    public TS2: number = 0;
    public TD2: number = 0;
    public InsertedDate: DatePipe
    public Classification: string = "";
    
}
