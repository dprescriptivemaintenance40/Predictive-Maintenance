import { Injectable } from "@angular/core";


@Injectable({
    providedIn : 'root'
})

export class ProfileConstantAPI{
    public ProfileAPI : string = '/UserProfileAPI';
    public UploadImage : string = '/UserProfileAPI/UploadImage';
    public GetAllRecords: string = '/ScrewCompressorTrainChartAPI/GetAllRecords'
}