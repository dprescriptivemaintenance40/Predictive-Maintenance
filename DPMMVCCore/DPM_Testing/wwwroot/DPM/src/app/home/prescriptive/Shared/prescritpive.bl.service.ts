import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { PrescriptiveDLService } from "./prescritpive.dl.service";
import * as XLSX from 'xlsx';

@Injectable({
    providedIn: 'root'
})
export class PrescriptiveBLService {

    public FMEATagCheck : string= '/PrescriptiveAPI'
    public FMEADropdownData : string= '/PrescriptiveLookupMasterAPI/GetRecords'
    public FMEATreeSave : string= '/PrescriptiveAPI/PostCentrifugalPumpPrescriptiveData'
    public FMEAFileUpload : string= '/PrescriptiveAPI/UploadFile'
    public FMEADeleteFileUpload : string= '/PrescriptiveAPI/UpdateFileUpload'
    public FMEASaveConsequence : string= '/PrescriptiveAPI/CFPrescriptiveAdd'
    public PrescriptiveRecordsForFCA : string= '/PrescriptiveAPI/GetPrescriptiveRecordsForFCA'
    public PrescriptiveRecordsForMSS : string= '/PrescriptiveAPI/GetPrescriptiveRecordsForMSS'
    public FCASave : string= '/PrescriptiveAPI/PrespectivePattern'
    public FCAWebal : string= '/PrescriptiveAPI/WebalAlgo'
    public MSSSave : string= '/PrescriptiveAPI/UpdatePrespectiveMSS'
    public FMEAConfiguration : string= '/PrescriptiveLookupMasterAPI'
    public FMEAListSingleDelete : string= '/PrescriptiveAPI/DeletePrespectiveModel'
    public FMEAParentAttachments : string= '/PrescriptiveAPI/CompontentAttachment'
    

    constructor(private prescriptiveDLService: PrescriptiveDLService) {}
    //Dynamic Get API with no Parameters
    public getWithoutParameters(url: string){
        return this.prescriptiveDLService.getWithoutParameters(url)
            .pipe(map(res => {
                return res;
            }));
    }

    //Dynamic Get API with Parameters
    public getWithParameters(url: string, params){
        return this.prescriptiveDLService.getWithParameters(url, params)
            .pipe(map(res => {
                return res;
            }));
    }

    //Dynamic Post API with no header
    public postWithoutHeaders(url: string, data: any){
        return this.prescriptiveDLService.postWithoutHeaders(url, data)
            .pipe(map(res => {
                return res;
            }));
    }

    //Dynamic Post API with header
    public postWithHeaders(url: string, data: any){
        return this.prescriptiveDLService.postWithHeaders(url, data)
            .pipe(map(res => {
                return res;
            }));
    }

    //Dynamic PUT 
    public PutData(url: string, data: any){
        return this.prescriptiveDLService.PutData(url, data)
            .pipe(map(res => {
                return res;
            }, err => { return err}));
    }

    //Dynamic Delete with Param
    public DeleteWithParam(url: string, params){
        return this.prescriptiveDLService.DeleteWithParam(url, params)
            .pipe(map(res => {
                return res;
            }, err => { return err}));
    }

    //Dynamic Delete without Param
    public DeleteWithID(url: string, id){
        return this.prescriptiveDLService.DeleteWithID(url, id)
            .pipe(map(res => {
                return res;
            }, err => { return err}));
    }


    
    public GetMSSLibrary(){
        return this.prescriptiveDLService.GetMSSLibrary()
            .pipe(map(res => {
                return res;
            }));
    }

}