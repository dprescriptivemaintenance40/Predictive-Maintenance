import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { MessageService } from "primeng/api";

@Component({
    templateUrl: './cost-benefit-analysis.component.html',
    providers: [MessageService]
})
export class CostBenefitAnalysisComponent {

    public MachineType: string = "";
    public EquipmentType: string = "";
    public TagNumber: string = "";
    public EquipmentList: any = []
    public prescriptiveRecords: any = [];
    public TagList: any = [];
    public SelectedTagNumber: string = "";
    public showPrescriptive: boolean = false;
    public UserDetails: any;
    public showCostBenefitAnalysis: boolean = false;
    public Site: string = '';
    public Plant: string = '';
    public Unit: string = '';
    public ETBF: string = '';
    constructor(private messageService: MessageService,
        private http: HttpClient) {
        this.MachineEquipmentSelect();
        this.getPrescriptiveRecords();
        this.UserDetails = JSON.parse(localStorage.getItem('userObject'));
    }

    MachineEquipmentSelect() {
        if (this.MachineType == "Pump") {
            this.EquipmentList = []
            this.EquipmentList = ["Centrifugal Pump"]
        }
        if (this.MachineType == "Compressor") {
            this.EquipmentList = []
            this.EquipmentList = ["Screw Compressor"]
        }
    }
    getPrescriptiveRecords() {
        this.http.get('api/PrescriptiveAPI/GetTagNumber')
            .subscribe((res: any) => {
                res.forEach(element => {
                    this.TagList.push(element.TagNumber)
                });
            });
    }
    getPrescriptiveRecordsByEqui() {
        if (this.MachineType && this.EquipmentType && this.SelectedTagNumber) {
            this.prescriptiveRecords = [];
            this.http.get(`api/PrescriptiveAPI/GetPrescriptiveByEquipmentType?machine=${this.MachineType}&Equi=${this.EquipmentType}&TagNumber=${this.SelectedTagNumber}`)
                .subscribe((res: any) => {
                    this.prescriptiveRecords = res;
                    this.prescriptiveRecords.centrifugalPumpPrescriptiveFailureModes.forEach(row => {
                        row.TotalAnnualPOC = 0;
                        row.CentrifugalPumpMssModel.forEach(mss => {
                            if (!mss.MSSMaintenanceInterval || mss.MSSMaintenanceInterval === 'NA' || mss.MSSMaintenanceInterval === 'Not Applicable') {
                                mss.POC = 0;
                                mss.AnnualPOC = 0;
                                mss.Status = '';
                            } else {
                                let annu = mss.MSSMaintenanceInterval.split(' ');
                                if (mss.MSSMaintenanceInterval.toLowerCase().includes('week')) {
                                    mss.POC = 0.00025;
                                    mss.AnnualPOC = parseFloat((parseFloat(annu[0]) * 0.00025).toFixed(3));
                                } else if (mss.MSSMaintenanceInterval.toLowerCase().includes('month')) {
                                    mss.POC = 0.02;
                                    mss.AnnualPOC = parseFloat((parseFloat(annu[0]) * 0.02).toFixed(3));
                                }
                                mss.MSSMaintenanceInterval = `${parseFloat(annu[0]).toFixed(1)} ${annu[1]}`;
                                mss.Status = 'Retained';
                                row.TotalAnnualPOC += mss.AnnualPOC;
                            }
                        });
                        row.ETBC = 10;
                        row.TotalPONC = 20796;
                        row.ETBF = this.ETBF ? this.ETBF : 2;
                        row.TotalAnnualCostWithMaintenance = 1.777;
                        row.EconomicRiskWithoutMaintenance = row.TotalPONC / row.ETBF;
                        row.ResidualRiskWithMaintenance = parseFloat((row.TotalAnnualCostWithMaintenance - row.TotalAnnualPOC).toFixed(3));
                        let WithETBCAndPONC = row.TotalPONC / row.ETBC;
                        let WithoutETBCAndPONC = row.TotalPONC / 5;
                        row.WithMEI = (((row.TotalPONC / row.ETBF) - (row.TotalPONC / row.ETBC)) / WithETBCAndPONC).toFixed(0);
                        row.WithOutMEI = (((row.TotalPONC / row.ETBF) - (row.TotalPONC / 5)) / WithoutETBCAndPONC).toFixed(0);
                        row.ConsequenceCategory = row.Consequence.split(' ')[0];
                    });
                    this.showPrescriptive = true;
                }, err => {
                    console.log(err.err);
                });
        } else {
            this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Please select all three fields." })
        }

    }

    public GenerateCostBenefitReport() {
        if (this.Site && this.Plant && this.Unit) {
            this.showCostBenefitAnalysis = true;
        } else {
            this.messageService.add({ severity: 'info', summary: 'note', detail: "Please fill all three fields Site, Plant, Unit. " })
        }
    }
}