import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { MessageService } from "primeng/api";
import { CommonBLService } from "src/app/shared/BLDL/common.bl.service";
import { PrescriptiveContantAPI } from "../prescriptive/Shared/prescriptive.constant";

@Component({
    templateUrl: './prescriptive-poc.component.html',
    providers: [MessageService]
})
export class PrescriptivePocComponent {

    public MachineType: string = "";
    public EquipmentType: string = "";
    public TagNumber: string = "";
    public EquipmentList: any = []
    public prescriptiveRecords: any[] = [];
    public TagList: any = [];
    public SelectedTagNumber: string = "";
    public showPrescriptive: boolean = false;
    constructor( private messageService: MessageService,
        private http: HttpClient) {
        this.MachineEquipmentSelect();
        this.getPrescriptiveRecords();
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
                    this.showPrescriptive = true;
                }, err => {
                    console.log(err.err);
                });
        } else {
            this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Please select all three fields." })
        }

    }
}