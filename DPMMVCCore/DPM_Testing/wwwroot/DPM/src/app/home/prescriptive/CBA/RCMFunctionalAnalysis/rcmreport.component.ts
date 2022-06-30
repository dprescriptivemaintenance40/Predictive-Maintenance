import { HttpParams } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { timeStamp } from "console";
import { CommonBLService } from "src/app/shared/BLDL/common.bl.service";
import { PrescriptiveContantAPI } from "../../Shared/prescriptive.constant";

@Component({
    selector: 'app-rcmreport',
    templateUrl: './rcmreport.component.html',
    styleUrls: ['./rcmreport.component.css'],
})

export class RCMFunctionalAnalysis implements OnInit {

    public RCMDataId: any = [];
    public CBARecords: any = [];
    public TagNumber: string = "";
    public taskList: any = [];
    public Consequence: string = "";
    public FailureModeList: any = [];
    public CBAFailureMode: any = [];

    constructor(public route: ActivatedRoute,
        private RCMReportBLService: CommonBLService,
        private RCMReportContantAPI: PrescriptiveContantAPI,) {

    }

    ngOnInit() {
        this.GetRCMData();
    }

    async ngOnDestroy() {
        await localStorage.removeItem('RCMReportObj')
    }

    public GetRCMData() {
        this.RCMDataId = localStorage.getItem('RCMReportObjId');
        var url: string = this.RCMReportContantAPI.CBARecordsForReport;
        const params = new HttpParams()
            .set('id', this.RCMDataId)
        this.RCMReportBLService.getWithParameters(url, params).subscribe
            ((res: any) => {
                this.CBARecords = res;
                this.SetRCMDataReport();
                console.log(this.CBARecords);
            });
    }

    public DownloadRCMReport(){
        window.print();
    }
    public SetRCMDataReport() {
        this.TagNumber = this.CBARecords.TagNumber;
        this.Consequence = this.CBARecords.Consequence;
        this.CBAFailureMode = this.CBARecords.CBAFailureModes;
        for (let CBAId = 0; CBAId < this.CBAFailureMode.length; CBAId++) {
            let failuremodeobj = {};
            failuremodeobj['FailureMode'] = this.CBAFailureMode[CBAId].FailureMode;
            failuremodeobj['EC'] = this.CBAFailureMode[CBAId].EC;
            failuremodeobj['HS'] = this.CBAFailureMode[CBAId].HS;
            failuremodeobj['EV'] = this.CBAFailureMode[CBAId].EV;
            failuremodeobj['CA'] = this.CBAFailureMode[CBAId].CA;
            failuremodeobj['ETBC'] = this.CBAFailureMode[CBAId].ETBC;
            failuremodeobj['ETBF'] = this.CBAFailureMode[CBAId].ETBF;
            failuremodeobj['PONC'] = this.CBAFailureMode[CBAId].PONC;
            failuremodeobj['EC'] = this.CBAFailureMode[CBAId].EC;
            failuremodeobj['TotalAnnualCostWithMaintenance'] = this.CBAFailureMode[CBAId].TotalAnnualCostWithMaintenance;
            failuremodeobj['ResidualRiskWithMaintenance'] = this.CBAFailureMode[CBAId].ResidualRiskWithMaintenance;
            failuremodeobj['TotalAnnualPOC'] = this.CBAFailureMode[CBAId].TotalAnnualPOC;
            failuremodeobj['MEI'] = this.CBAFailureMode[CBAId].MEI;
            if (failuremodeobj['MEI'] > 1){
                failuremodeobj['TaskApproved'] = 'Yes';
            }
            else if(failuremodeobj['MEI'] < 1){
                failuremodeobj['TaskApproved'] = 'No';
            }
            failuremodeobj['Tasks'] = [];
            this.FailureModeList.push(failuremodeobj);
            this.CBAFailureMode[CBAId].CBAMaintenanceTasks.forEach(tasks => {
                let obj = {};
                obj['Task'] = tasks.MSSMaintenanceTask;
                obj['Status'] = tasks.Status;
                tasks.CBAMainenanceIntervals.forEach(intervals => {
                    obj['Frequency'] = intervals.MSSFrequency;
                    obj['RWC'] = intervals.RWC;
                    obj['POC'] = intervals.POC;
                    obj['AnnualPOC'] = intervals.AnnualPOC;
                    this.FailureModeList[CBAId].Tasks.push(obj);
                });
            });
        }
    }
}