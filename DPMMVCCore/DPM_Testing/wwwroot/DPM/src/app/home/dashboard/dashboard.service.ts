import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class DashboardConstantAPI{

    public ScrewTrainPreviousMonthList : string = '/ScrewCompressorTrainChartAPI/ScrewTrainPreviousMonth'
    public ScrewTrainLastUploadList : string = '/ScrewCompressorTrainChartAPI/ScrewTrainLastUpload'
    public ScrewTrainPreviousWeek : string = '/ScrewCompressorTrainChartAPI/GetPreviousWeek'
    public ScrewCompressorDataList : string = '/ScrewCompressureAPI'
    public PredictionDataList : string = '/ScrewCompressureAPI/GetPrediction'
    public ScrewPredictionPreviousMonthList : string = '/ScrewCompressorPredictionChartAPI/ScrewPredictionPreviousMonth'
    public ScrewPredictionLastUploadList : string = '/ScrewCompressorPredictionChartAPI/ScrewPredictionLastUpload'
    public ScrewPredictionPreviousWeek : string = '/ScrewCompressorPredictionChartAPI/GetPredictionPreviousWeek'
    public GetAllRecords: string = '/ScrewCompressorTrainChartAPI/GetAllRecords'
    public GetFilterRecords: string = '/ScrewCompressorTrainChartAPI/ScrewTrainFilter'
}