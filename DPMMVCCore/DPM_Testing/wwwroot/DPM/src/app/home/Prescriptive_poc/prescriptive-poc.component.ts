import { Component } from "@angular/core";
import { CommonBLService } from "src/app/shared/BLDL/common.bl.service";
import { PrescriptiveContantAPI } from "../prescriptive/Shared/prescriptive.constant";

@Component({
    templateUrl: './prescriptive-poc.component.html'
})
export class PrescriptivePocComponent {


    public prescriptiveRecords: any[] = [];
    constructor(private commonBLService: CommonBLService,
        private prescriptiveContantAPI: PrescriptiveContantAPI) {
        this.getPrescriptiveRecords();
    }

    getPrescriptiveRecords() {
        var url: string = this.prescriptiveContantAPI.FMEATagCheck
        this.commonBLService.getWithoutParameters(url)
            .subscribe((res: any) => {
                this.prescriptiveRecords = res;
            }, err => {
                console.log(err.err);
            });
    }
}