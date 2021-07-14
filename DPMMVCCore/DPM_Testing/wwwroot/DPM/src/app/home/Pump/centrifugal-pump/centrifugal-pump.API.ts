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

    public getCentrifugalPredictionPredictionList : string = '/CentrifugalPumpPredictionAPI/GetAllPredictionRecords';
    public CentrifugalPumpPredictionAddData : string = '/CentrifugalPumpPredictionAPI/CentrifugalPumpPredictionPost';
    public getCentrifugalPumpPredictedList : string = '/CentrifugalPumpPredictionAPI/GetAllPredictionRecords';
    public getPredictedListByDate : string = '/CentrifugalPumpPredictionAPI/GetCentrifugalPumpPredictionByDate';
    public getPredictionById : string = '/CentrifugalPumpPredictionAPI/GetCentrifugalPumpPredictionById';
    public Prediction : string = '/CentrifugalPumpPredictionAPI/CentrifugalPumpSinglePrediction';

    public FuturePrediction : string = "/CentrifugalPumpFuturePredictionAPI/FuturePrediction";
    public GetFuturePredictionRecords : string = "/CentrifugalPumpFuturePredictionAPI/GetAllPredictionRecords";
    public GetFuturePredictionRecordsByDate : string = "/CentrifugalPumpFuturePredictionAPI/GetPredictionRecordsByDate";

  
}