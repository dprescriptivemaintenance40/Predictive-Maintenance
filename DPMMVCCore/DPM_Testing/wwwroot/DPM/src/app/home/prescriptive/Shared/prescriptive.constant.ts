import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class PrescriptiveContantAPI{
    //#region  FMEA - Add, configuration, consequence, display, list,  FCA, MSS API's

    public FMEATagCheck : string= '/PrescriptiveAPI';
    public FMEADropdownData : string= '/PrescriptiveLookupMasterAPI/GetRecords';
    public FMEATreeSave : string= '/PrescriptiveAPI/PostCentrifugalPumpPrescriptiveData';
    public FMEAFileUpload : string= '/PrescriptiveAPI/UploadFile';
    public FMEADeleteFileUpload : string= '/PrescriptiveAPI/UpdateFileUpload';
    public FMEASaveConsequence : string= '/PrescriptiveAPI/CFPrescriptiveAdd';
    public PrescriptiveRecordsForFCA : string= '/PrescriptiveAPI/GetPrescriptiveRecordsForFCA';
    public PrescriptiveRecordsForMSS : string= '/PrescriptiveAPI/GetPrescriptiveRecordsForMSS';
    public FCASave : string= '/PrescriptiveAPI/PrespectivePattern';
    public FCAWebal : string= '/PrescriptiveAPI/WebalAlgo';
    public MSSSave : string= '/PrescriptiveAPI/UpdatePrespectiveMSS';
    public FMEAConfiguration : string= '/PrescriptiveLookupMasterAPI';
    public FMEAListSingleDelete : string= '/PrescriptiveAPI/DeletePrespectiveModel';
    public FMEAParentAttachments : string= '/PrescriptiveAPI/CompontentAttachment';

    //#endregion


    //#region  FMEA Update API's only

    public SaveFailureModeUpdate : string= '/PrescriptiveAPI/EditConsequenceTree';
    public UpdateChanges : string= '/PrescriptiveAPI/FunctionModeAndConsequenceUpdate';
    public DeleteFailureModeFrommTree : string= '/PrescriptiveAPI/FailureModeDelete';
    public SaveUpdatedPattern : string = '/PrescriptiveAPI/UpdatePrespectivePattern';
    public UpdateMSSToTree : string = '/PrescriptiveAPI/PrescriptiveUpdateSingleFMMSSUpdate';
    public SaveFunction : string = '/PrescriptiveAPI/FunctionUpdate';

    //#endregion

}