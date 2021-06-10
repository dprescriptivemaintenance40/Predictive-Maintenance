import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class CentrifugalPumpConstantAPI{

    public DailyData : string = '/CenterifugalPumpAPI/GetCentrifugalPumpDailyData';
    public PostCentrifugalPumpDailydata : string = '/CenterifugalPumpAPI/PostCentrifugalPumpDailyData';
    public PostCentrifugalPumpWeekdata : string = '/CenterifugalPumpAPI/PostCentrifugalPumpWeekData';
    public GetCentrifugalPumpWeekdata : string = '/CenterifugalPumpAPI/GetCentrifugalPumpWeekData';
    public GetDailyDates : string = '/CenterifugalPumpAPI/GetDailyDates';
    public GetWeekDates : string = '/CenterifugalPumpAPI/GetWeekDates';
    public GetVendorList : string = '/CenterifugalPumpAPI/GetVendorList';

    public getCentrifugalPumpTrainList : string = '/CentrifugalPumpTrainAPI/getConfiguration';
    public CentrifugalPumpTrainAddData : string = '/CentrifugalPumpTrainAPI/PumpConfiguration';
  
}