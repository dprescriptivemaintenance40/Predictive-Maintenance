import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class RecycleBinConstantAPI{
    public RecycleBinChildData : string = '/PrescriptiveAPI/CFRecycleDataForChild';
    public RecycleBinWholeData : string = '/PrescriptiveAPI/CFRecycleWholeData';
    public RestoreDataGetById : string = '/PrescriptiveAPI/GetPrescriptiveById';
    public RestoreChild : string = '/PrescriptiveAPI/FunctionModeAndConsequenceUpdate';
    public RestoreWholeData : string = '/PrescriptiveAPI/RestoreRecords';
    public DeleteWholeData : string = '/PrescriptiveAPI/DeleteRecycleWholeData';
    public DeleteAttachment : string = '/PrescriptiveAPI/UpdateFileUpload';
}