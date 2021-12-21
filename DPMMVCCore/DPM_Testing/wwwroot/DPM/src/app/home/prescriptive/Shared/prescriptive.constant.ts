import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class PrescriptiveContantAPI {
    //#region  FMEA - Add, configuration, consequence, display, list,  FCA, MSS API's

    public FMEATagCheck: string = '/PrescriptiveAPI';
    public XFMEATagCheck: string = '/FMEAPrescriptiveAPI/GetXFMEARecords';
    public FMEADropdownData: string = '/PrescriptiveLookupMasterAPI/GetRecords';
    public FMEATreeSave: string = '/PrescriptiveAPI/PostCentrifugalPumpPrescriptiveData';
    public XFMEA : string = '/FMEAPrescriptiveAPI/FMEAPrescriptiveModelData';
    public FMEAFileUpload: string = '/PrescriptiveAPI/UploadFile';
    public FMEADeleteFileUpload: string = '/PrescriptiveAPI/UpdateFileUpload';
    public FMEASaveConsequence: string = '/PrescriptiveAPI/CFPrescriptiveAdd';
    public XFMEASaveConsequence: string = '/FMEAPrescriptiveAPI/XFMEAPrescriptiveAdd';
    public PrescriptiveRecordsForFCA: string = '/PrescriptiveAPI/GetPrescriptiveRecordsForFCA';
    public PrescriptiveRecordsForMSS: string = '/PrescriptiveAPI/GetPrescriptiveRecordsForMSS';
    public FCASave: string = '/PrescriptiveAPI/PrespectivePattern';
    public FCAWebal: string = '/PrescriptiveAPI/WebalAlgo';
    public FCAWebalWithDetails: string = '/PrescriptiveAPI/WebalAlgoritmWithDetails';
    public MSSSave: string = '/PrescriptiveAPI/UpdatePrespectiveMSS';
    public FMEAConfiguration: string = '/PrescriptiveLookupMasterAPI';
    public FMEAListSingleDelete: string = '/PrescriptiveAPI/DeletePrespectiveModel';
    public XFMEAListSingleDelete: string = '/FMEAPrescriptiveAPI/DeleteXFMEAPrespectiveModel';
    public FMEAParentAttachments: string = '/PrescriptiveAPI/CompontentAttachment';
    //#endregion


    //#region  FMEA Update API's only

    public SaveFailureModeUpdate: string = '/PrescriptiveAPI/EditConsequenceTree';
    public UpdateChanges: string = '/PrescriptiveAPI/FunctionModeAndConsequenceUpdate';
    public DeleteFailureModeFrommTree: string = '/PrescriptiveAPI/FailureModeDelete';
    public SaveUpdatedPattern: string = '/PrescriptiveAPI/UpdatePrespectivePattern';
    public UpdateMSSToTree: string = '/PrescriptiveAPI/PrescriptiveUpdateSingleFMMSSUpdate';
    public SaveFunction: string = '/PrescriptiveAPI/FunctionUpdate';

    //#endregion


    //#region RCA API

    public RCASaveAPI: string = '/RCAAPI/SaveNewRCA';
    public RCAGetAPI: string = '/RCAAPI/GetAllRCARecords';
    public RCAGetHeatExchangerFMAPI: string = '/PrescriptiveLookupMasterAPI/RCAHeatExchanger';
    public RCADeleteAPI: string = '/RCAAPI/DeleteRCARecord';
    public RCAUpdateAttachment: string = '/PrescriptiveAPI/UpdateFileUpload'
    public RCAUpdateAPI: string = '/RCAAPI/RCAUpdate'
    public RCAOnlyTreeSaveAPI: string = '/RCAAPI/RCATreeUpdate';

    //#endregion

    //#region PCR 
    
    public GetAllConfigurationRecords : string = '/PSRClientContractorAPI/GetAllConfigurationRecords';
    public GetRecordById : string = '/PSRClientContractorAPI/GetRecordById';
    public PSRClientContractorAPI : string = '/PSRClientContractorAPI';

    public MSSStrategyGetAllRecords : string = "/MSSStartegyAPI/GetAllConfigurationRecords";
    public MSSStartegyAPI : string = "/MSSStartegyAPI";


    public UserProductionDetailAPI = '/UserProductionAPI';
    public GetUserProductionDetail = '/UserProductionAPI/GetAllConfigurationRecords';

    //#endregion

}