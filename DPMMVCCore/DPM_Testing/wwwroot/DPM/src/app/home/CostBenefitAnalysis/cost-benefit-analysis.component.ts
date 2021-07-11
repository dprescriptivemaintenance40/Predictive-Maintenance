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
        // if (this.MachineType == "Compressor") {
        //     this.EquipmentList = []
        //     this.EquipmentList = ["Screw Compressor"]
        // }
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
            this.http.get(`api/PrescriptiveAPI/GetPrescriptiveByEquipmentType?machine=${this.MachineType}&Equi=${this.EquipmentType}&TagNumber=${this.SelectedTagNumber}`)
                .subscribe((res: any) => {
                    this.prescriptiveRecords = res;
                    this.prescriptiveRecords.centrifugalPumpPrescriptiveFailureModes.forEach(row => {
                        if (!row.MSSMaintenanceInterval || row.MSSMaintenanceInterval === 'NA' || row.MSSMaintenanceInterval === 'Not Applicable') {
                            row.POC = 0;
                            row.AnnualPOC = 0;
                            row.Status = '';
                        } else {
                            let annu = row.MSSMaintenanceInterval.split(' ');
                            if (row.MSSMaintenanceInterval.toLowerCase().includes('week')) {
                                row.POC = 0.00025;
                                row.AnnualPOC = (parseFloat(annu[0]) * 0.00025).toFixed(3);
                            } else if (row.MSSMaintenanceInterval.toLowerCase().includes('month')) {
                                row.POC = 0.02;
                                row.AnnualPOC = (parseFloat(annu[0]) * 0.02).toFixed(3);
                            }
                            row.MSSMaintenanceInterval = `${parseFloat(annu[0]).toFixed(1)} ${annu[1]}`;
                            row.Status = 'Retained';
                            row.TotalAnnualPOC = row.AnnualPOC;
                            row.ETBC = 30;
                            row.TotalPONC = 20796;
                            row.ETBF = 2;
                            row.TotalAnnualCostWithMaintenance = 1.777;
                            row.EconomicRiskWithoutMaintenance = row.TotalPONC / row.ETBF;
                            row.ResidualRiskWithMaintenance = row.TotalAnnualCostWithMaintenance - row.TotalAnnualPOC;
                            row.MEI = (((row.TotalPONC / row.ETBF) - (row.TotalPONC / row.ETBC)) / row.TotalAnnualPOC).toFixed(0);
                        }
                    });
                    this.showPrescriptive = true;
                }, err => {
                    console.log(err.err);
                });
        } else {
            this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Please select all three fields." })
        }

    }
}