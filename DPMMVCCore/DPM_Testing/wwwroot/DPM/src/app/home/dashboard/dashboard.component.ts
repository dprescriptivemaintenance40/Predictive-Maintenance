import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from "@angular/core";
import { DatePipe } from '@angular/common'
import { HttpClient, HttpParams } from "@angular/common/http";
import { DomSanitizer, Title } from "@angular/platform-browser";
import { Chart } from "chart.js";
import * as moment from "moment";
import { MessageService } from 'primeng/api';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';
import { Router } from "@angular/router";
import { CommonBLService } from "src/app/shared/BLDL/common.bl.service";
import { SCConstantsAPI } from "../Compressor/ScrewCompressor/shared/ScrewCompressorAPI.service";
import { PrescriptiveContantAPI } from "../prescriptive/Shared/prescriptive.constant";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [MessageService, DatePipe]
})
export class DashboardComponent {

  public ScrewTrainLastUploadDate;
  public trainRealTime: any = [];
  public predictRealTime: any = [];
  public ScrewTrainLastUploadList: any = [];
  public ScrewTrainPreviousWeekList: any = [];
  public ScrewTrainPreviousMonthList: any = [];
  public ScrewTrainLinePieChartDateCount: any = [];
  public ScrewPredictionLinePieChartDateCount: any = [];
  public RealTimeLineChartDateCount: any = [];

  public ScrewPredictionLastUploadList: any = [];
  public ScrewPredictionPreviousWeekList: any = [];
  public ScrewPredictionPreviousMonthList: any = [];
  public ScrewPredictionLastUploadDate;
  public TrainLineCalculation: any = [];
  public PredictionLineCalculation: any = [];
  public TrainCountCalculations: any = [];
  public PredictionCountCalculations: any = [];
  public ScrewTrainDateList: any = [];
  public ScrewPredictionDateList: any = [];
  public dynamicNormalData: any = [];
  public dynamicIncipientData: any = [];
  public dynamicDegradeData: any = [];
  public stopDynamicChartAfterCount: number = 0;

  public CompressorType: string = "ScrewCompressor";
  public TrainPredictType: string = "Train";
  public SelectDateType: string = "LastUpload";
  //====== for screw Train Calculations ======
  public normalCount: any = [];
  public incipientCount: any = [];
  public degradeCount: any = [];
  //========End==================
  //====== for screw Prediction Calculations ======
  public screwPredictionDataNormalCount: any = [];
  public screwPredictionDataIncipientCount: any = [];
  public screwPredictonDataDegradeCount: any = [];
  //========End==================
  public screwTrainList: any = []; // to store list of records of Screw Train
  public screwPredictionList: any = []; // to store list of records screw Prediction
  public screwTrainTotalCount: number = 0;
  public screwPredictionTotalCount: number = 0;

  //====== for screw Train Calculations ======
  public TrainNormalCount: number = 0;
  public TrainIncipientCount: number = 0;
  public TrainDegradeCount: number = 0;
  public TrainNormalPercentage: number = 0;
  public TrainIncipientPercentage: number = 0;
  public TrainDegradePercentage: number = 0;
  ///====End=======

  //======for screw Prediction Calculation ====
  public screwPredictionNormalCount: number = 0;
  public screwPredictionIncipientCount: number = 0;
  public screwPredictionDegradeCount: number = 0;
  public screwPredictionNormalPercentage: number = 0;
  public screwPredictionIncipientPercentage: number = 0;
  public screwPredictionDegradePercentage: number = 0;

  // =====End ======

  public url = 'api/ScrewCompressureAPI'
  public ScrewTrainLineChart
  public ScrewTrainPieChart
  public ScrewPredictionLine: any;
  public ScrewPredictionPie: any;
  public RealTimeLine: any;
  public user: any = [];
  constructor(public http: HttpClient,
    public title: Title,
    public messageService: MessageService,
    public datepipe: DatePipe,
    public router: Router,
    public commonLoadingDirective: CommonLoadingDirective,
    public changeDetectorRef: ChangeDetectorRef,
    public sanitizer: DomSanitizer,
    private dashboardAPIName : SCConstantsAPI,
    private prescriptiveAPIName : PrescriptiveContantAPI,
    private dashboardMethod : CommonBLService) {
    if (localStorage.getItem('userObject') != null) {
      this.user = JSON.parse(localStorage.getItem('userObject'))
    }
  }

  public prescriptiveRecords: any = [];
  public Table1: boolean = true;
  public Table2: boolean = false;
  public FailureModeDataTabe2: any;

  name = "Angular";

  ngOnInit() {
    this.title.setTitle('DPM | Dashboard');
    if (!(this.user.UserType == 3)) {
      this.getPrescriptiveRecords();
      this.getScrewTrainUniqueDateOfUploadFromDB();
      this.getScrewTrainTillFirstUploadList();
    }
  }


  SelectCompressorType() {
    if (this.CompressorType == 'ScrewCompressor') {
      console.log('ScrewCompressor selected');
    } else if (this.CompressorType == 'ScrewCompressor2') {
      console.log('ScrewCompressor 2 selected');
    } else {
      console.log('ScrewCompressor not selected');
    }
  }


  TrainPredict() {
    if (this.SelectDateType.length > 0) {
      if ((this.TrainPredictType == 'Prediction' && this.CompressorType == 'ScrewCompressor')) {
        this.getScrewPredictionTillFirstUploadList();
      } else if ((this.TrainPredictType == 'Train' && this.CompressorType == 'ScrewCompressor' && this.SelectDateType == 'TillFirstUpload')) {
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Screw Compressor Train with TillFirstUpload has been Selected' });
        this.commonLoadingDirective.showLoading(true, "Please wait to get ready graph....");
        this.getScrewTrainTillFirstUploadList()
      } else if ((this.TrainPredictType == 'Train' && this.CompressorType == 'ScrewCompressor' && this.SelectDateType == 'LastUpload')) {
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Screw Compressor Train with LastUpload has been Selected' });
        this.getScrewTrainUniqueDateOfUploadFromDB();
      } else if ((this.TrainPredictType == 'Train' && this.CompressorType == 'ScrewCompressor' && this.SelectDateType == 'PreviousWeek')) {
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Screw Compressor Train with PreviousWeek has been Selected' });
        this.getScrewTrainPreviousWeek();
      } else if ((this.TrainPredictType == 'Train' && this.CompressorType == 'ScrewCompressor' && this.SelectDateType == 'PreviousMonth')) {
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Screw Compressor Train with PreviousMonth has been Selected' });
        this.getScrewTrainPreviousMonthList();
      } else if ((this.TrainPredictType == 'Prediction' && this.CompressorType == 'ScrewCompressor' && this.SelectDateType == 'TillFirstUpload')) {
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Screw Compressor Prediction with TillFirstUpload has been Selected' });
        this.getScrewPredictionTillFirstUploadList();
      } else if ((this.TrainPredictType == 'Prediction' && this.CompressorType == 'ScrewCompressor' && this.SelectDateType == 'LastUpload')) {
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Screw Compressor Prediction with LastUpload has been Selected' });
        this.getScrewPredictionUniqueDateOfUploadFromDB();
      } else if ((this.TrainPredictType == 'Prediction' && this.CompressorType == 'ScrewCompressor' && this.SelectDateType == 'PreviousWeek')) {
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Screw Compressor Prediction with PreviousWeek has been Selected' });
        this.getScrewPredictionPreviousWeek();
      } else if ((this.TrainPredictType == 'Prediction' && this.CompressorType == 'ScrewCompressor' && this.SelectDateType == 'PreviousMonth')) {
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Screw Compressor Prediction with PreviousMonth has been Selected' });
        this.getScrewPredictionPreviousMonthList();
      } else if ((this.TrainPredictType == 'Prediction' && this.CompressorType == 'ScrewCompressor2')) {
        console.log('ScrewCompressor2 Prediction Selected')
      }

    } else { }

  }

  getScrewTrainPreviousMonthList() {
    const url : string = this.dashboardAPIName.ScrewTrainPreviousMonthList;
    this.dashboardMethod.getWithoutParameters(url)
    .subscribe(
      res => {
        this.ScrewTrainPreviousMonthList = res;
        if (this.ScrewTrainPreviousMonthList.length > 0) {
          this.commonLoadingDirective.showLoading(true, "Please wait to generate graph....");
          this.ScrewTrainLineCalculation(this.ScrewTrainPreviousMonthList);
          this.ScrewTrainCountCalculations(this.ScrewTrainPreviousMonthList);
          this.displayScrewTrainLinePieChart(this.ScrewTrainPreviousMonthList);
          this.commonLoadingDirective.showLoading(false, "ready....");
        } else {
          this.commonLoadingDirective.showLoading(false, "No records to plot graph....");
          this.messageService.add({ severity: 'info', summary: 'Info', detail: 'No records to plot graph' });

        }

      });

  }

  getScrewTrainLastUploadList() {
    // let headers = new HttpHeaders()
    // headers.append('Content-Type', 'application/json');
    // headers.append('LastUploadDate', this.ScrewTrainLastUploadDate);
    // let params = new HttpParams().append('LastUploadDate', this.ScrewTrainLastUploadDate)
    // const url : string = this.dashboardAPIName.ScrewTrainLastUploadList;
    const params = new HttpParams()
          .set('LastUploadDate', this.ScrewTrainLastUploadDate)
    const url : string = this.dashboardAPIName.ScrewTrainLastUploadList
    this.dashboardMethod.getWithParameters(url, params)
  //  this.http.get('api/ScrewCompressorTrainChartAPI/ScrewTrainLastUpload', { headers: headers, params })
  .subscribe(
      res => {
        this.ScrewTrainLastUploadList = res;

        if (this.ScrewTrainLastUploadList.length > 0) {
          this.ScrewTrainLineCalculation(this.ScrewTrainLastUploadList);
          this.ScrewTrainCountCalculations(this.ScrewTrainLastUploadList);
          this.displayScrewTrainLinePieChart(this.ScrewTrainLastUploadList);
          this.commonLoadingDirective.showLoading(false, "ready...");

        } else {
          this.commonLoadingDirective.showLoading(false, "ready...");
        }

      });


  }




  getScrewTrainPreviousWeek() {
    const url : string = this.dashboardAPIName.ScrewTrainPreviousWeek;
    this.dashboardMethod.getWithoutParameters(url)
    .subscribe(
      res => {
        this.ScrewTrainPreviousWeekList = res;

        if (this.ScrewTrainPreviousWeekList.length > 0) {
          this.commonLoadingDirective.showLoading(true, "Please wait to get ready graph....");
          this.ScrewTrainLineCalculation(this.ScrewTrainPreviousWeekList);
          this.ScrewTrainCountCalculations(this.ScrewTrainPreviousWeekList);
          this.displayScrewTrainLinePieChart(this.ScrewTrainPreviousWeekList);
          this.commonLoadingDirective.showLoading(false, "ready....");
        } else {
          this.commonLoadingDirective.showLoading(false, "No records to plot graph....");
          this.messageService.add({ severity: 'info', summary: 'Info', detail: 'No records to plot graph' });

        }

      });
  }


  getScrewTrainUniqueDateOfUploadFromDB() {
    const url : string = this.dashboardAPIName.ScrewCompressorDataList;
    this.dashboardMethod.getWithoutParameters(url)
    .subscribe(
      res => {
        this.ScrewTrainDateList = res;

        if (this.ScrewTrainDateList.length > 0) {

          this.commonLoadingDirective.showLoading(true, "Graph is getting ready please wait...");
          var uniqueDates = [];
          for (var i = 0; i < this.ScrewTrainDateList.length; i++) {

            if (uniqueDates.indexOf(this.ScrewTrainDateList[i].InsertedDate) === -1) {
              uniqueDates.push(this.ScrewTrainDateList[i].InsertedDate);

            }

          }


          let moments = uniqueDates.map(d => moment(d)), maxDate = moment.max(moments)

          var LastUploadDate = maxDate.format('YYYY MM DD');
          console.log("LastUploadDate : ", LastUploadDate)
          this.ScrewTrainLastUploadDate = LastUploadDate
          this.getScrewTrainLastUploadList();

        } else {
          this.commonLoadingDirective.showLoading(false, "No records to plot graph....");

        }

      });


  }



  getScrewPredictionUniqueDateOfUploadFromDB() {
    const url : string = this.dashboardAPIName.PredictionDataList;
    this.dashboardMethod.getWithoutParameters(url)
    .subscribe(
      (res: any) => {
        this.ScrewPredictionDateList = res;

        if (res.length > 0) {
          if (res[0].Prediction != null) {
            this.commonLoadingDirective.showLoading(true, "Please wait till graph get ready....");


            var uniqueDates = [];

            for (var i = 0; i < this.ScrewPredictionDateList.length; i++) {

              if (uniqueDates.indexOf(this.ScrewPredictionDateList[i].InsertedDate) === -1) {
                uniqueDates.push(this.ScrewPredictionDateList[i].InsertedDate);
              }
            }
            let moments = uniqueDates.map(d => moment(d)), maxDate = moment.max(moments)

            var LastUploadDate = maxDate.format('YYYY MM DD');
            console.log("LastUploadDate : ", LastUploadDate)
            this.ScrewTrainLastUploadDate = LastUploadDate
            this.getScrewPredictionLastUploadList();

          }
        } else {
          this.commonLoadingDirective.showLoading(false, "No records to plot graph....");
          this.messageService.add({ severity: 'info', summary: 'Info', detail: 'No records to plot graph' });

        }

      });


  }



  getScrewTrainTillFirstUploadList() {
    const url : string = this.dashboardAPIName.ScrewCompressorDataList;
    this.dashboardMethod.getWithoutParameters(url)
    .subscribe(
      res => {
        this.screwTrainList = res;

        if (this.screwTrainList.length > 0) {
          this.ScrewTrainLineCalculation(this.screwTrainList);
          this.ScrewTrainCountCalculations(this.screwTrainList);
          this.displayScrewTrainLinePieChart(this.screwTrainList);
          this.displyRealTimeLine(this.screwTrainList);
          this.ScrewTrainRealTimeNormal(this.screwTrainList)
          this.ScrewTrainRealTimeIncipient()
          this.ScrewTrainRealTimeDegrade()
          this.commonLoadingDirective.showLoading(false, "Graph is ready");
        } else {
          this.messageService.add({ severity: 'info', summary: 'Info', detail: 'No records to plot graph ' });

          this.commonLoadingDirective.showLoading(false, "No records to plot graph....");
        }

      }, err => {

        console.log(err);
      }
    )

  }

  getScrewPredictionPreviousMonthList() {

    const url : string = this.dashboardAPIName.ScrewPredictionPreviousMonthList;
    this.dashboardMethod.getWithoutParameters(url)
    .subscribe(
      res => {
        this.ScrewPredictionPreviousMonthList = res;

        if (this.ScrewPredictionPreviousMonthList.length > 0) {
          this.commonLoadingDirective.showLoading(true, "Please wait till graph get ready....");

          this.ScrewPredictionLineCalculation(this.ScrewPredictionPreviousMonthList);
          this.ScrewPredictionCountCalculations(this.ScrewPredictionPreviousMonthList);
          this.displayScrewPredictionLinePieChart(this.ScrewPredictionPreviousMonthList);
          this.commonLoadingDirective.showLoading(false, "ready....");

        } else {
          this.commonLoadingDirective.showLoading(false, "No records to plot graph....");
          this.messageService.add({ severity: 'info', summary: 'Info', detail: 'No records to plot graph' });

        }

      });

  }

  getScrewPredictionLastUploadList() {
    // let headers = new HttpHeaders()
    // headers.append('Content-Type', 'application/json');
    // headers.append('LastUploadDate', this.ScrewPredictionLastUploadDate);
    // let params = new HttpParams().append('LastUploadDate', this.ScrewPredictionLastUploadDate)
    // // var LastUploadDate : string = this.ScrewTrainLastUploadDate
    const params = new HttpParams()
          .set('LastUploadDate', this.ScrewPredictionLastUploadDate)
    const url : string = this.dashboardAPIName.ScrewPredictionLastUploadList;
    this.dashboardMethod.getWithParameters(url, params)
 //   this.http.get('api/ScrewCompressorPredictionChartAPI/ScrewPredictionLastUpload', { params })
   .subscribe(
      res => {
        this.ScrewPredictionLastUploadList = res;

        if (this.ScrewPredictionLastUploadList.length > 0) {
          this.ScrewPredictionLineCalculation(this.ScrewPredictionLastUploadList);
          this.ScrewPredictionCountCalculations(this.ScrewPredictionLastUploadList);
          this.displayScrewPredictionLinePieChart(this.ScrewPredictionLastUploadList);
          this.commonLoadingDirective.showLoading(false, "ready....");

        } else {
          this.commonLoadingDirective.showLoading(false, "No records to plot graph....");
          this.messageService.add({ severity: 'info', summary: 'Info', detail: 'No records to plot graph' });

        }

      });


  }




  getScrewPredictionPreviousWeek() {
    const url : string = this.dashboardAPIName.ScrewPredictionPreviousWeek;
    this.dashboardMethod.getWithoutParameters(url)
    .subscribe(
      res => {
        this.ScrewPredictionPreviousWeekList = res;

        if (this.ScrewPredictionPreviousWeekList.length > 0) {
          this.commonLoadingDirective.showLoading(true, "Please wait till graph get ready....");
          this.ScrewPredictionLineCalculation(this.ScrewPredictionPreviousWeekList);
          this.ScrewPredictionCountCalculations(this.ScrewPredictionPreviousWeekList);
          this.displayScrewPredictionLinePieChart(this.ScrewPredictionPreviousWeekList);
          this.commonLoadingDirective.showLoading(false, "ready....");

        } else {
          this.commonLoadingDirective.showLoading(false, "No records to plot graph....");
          this.messageService.add({ severity: 'info', summary: 'Info', detail: 'No records to plot graph' });


        }

      });
  }


  getScrewPredictionTillFirstUploadList() {
    const url : string = this.dashboardAPIName.PredictionDataList;
    this.dashboardMethod.getWithoutParameters(url)
    .subscribe(
      res => {
        this.screwPredictionList = res;

        if (this.screwPredictionList.length > 0) {
          if (res[0].Prediction != null) {
            this.commonLoadingDirective.showLoading(true, "Please wait till graph get ready....");

            this.ScrewPredictionLineCalculation(this.screwPredictionList);
            this.ScrewPredictionCountCalculations(this.screwPredictionList);
            this.displayScrewPredictionLinePieChart(this.screwPredictionList);
            this.ScrewPredictRealTimeNormal(this.screwPredictionList);
            this.ScrewPredictRealTimeIncipient();
            this.ScrewPredictRealTimeDegrade();
            this.displyRealTimeLine(this.screwPredictionList);
            this.commonLoadingDirective.showLoading(false, "ready....");

          }
        } else {
          this.commonLoadingDirective.showLoading(false, "No records to plot graph....");
          this.messageService.add({ severity: 'info', summary: 'Info', detail: 'No records to plot graph' });

        }
      }, err => {
        console.log(err);
      }
    );
  }



  ScrewTrainLineCalculation(Data) {
    this.normalCount = null;
    this.incipientCount = null;
    this.degradeCount = null;
    var normalCount: any = [];
    var normalValuation: number = 0;
    var incipientCount: any = [];
    var incipientValuation: number = 0;
    var degradeCount: any = [];
    var degradeValuation: number = 0;

    this.TrainLineCalculation = Data;

    this.TrainLineCalculation.forEach((value) => {
      if (value.ClassificationId == 0) {
        normalValuation = normalValuation + 1;
        normalCount.push(normalValuation);
        incipientCount.push(incipientValuation);
        degradeCount.push(degradeValuation)

      } else if (value.ClassificationId == 1) {

        incipientValuation = incipientValuation + 1;
        incipientCount.push(incipientValuation);
        normalCount.push(normalValuation);
        degradeCount.push(degradeValuation)

      } else {

        degradeValuation = degradeValuation + 1;
        degradeCount.push(degradeValuation)
        normalCount.push(normalValuation);
        incipientCount.push(incipientValuation);

      }

    });

    /// array of data for line  in Screw Train
    this.normalCount = normalCount;
    this.incipientCount = incipientCount;
    this.degradeCount = degradeCount;
    console.log('normal count : ', this.normalCount);
    console.log('incipient count : ', this.incipientCount);
    console.log('degrade count : ', this.degradeCount);

  }

  ScrewPredictionLineCalculation(Data) {

    this.screwPredictionDataNormalCount = null;
    this.screwPredictionDataIncipientCount = null;
    this.screwPredictonDataDegradeCount = null;
    var normalCount: any = [];
    var normalValuation: number = 0;
    var incipientCount: any = [];
    var incipientValuation: number = 0;
    var degradeCount: any = [];
    var degradeValuation: number = 0;

    this.PredictionLineCalculation = Data;

    this.PredictionLineCalculation.forEach((value) => {
      if (value.Prediction == 'normal') {
        normalValuation = normalValuation + 1;
        normalCount.push(normalValuation);
        incipientCount.push(incipientValuation);
        degradeCount.push(degradeValuation)

      } else if (value.Prediction == 'incipient') {

        incipientValuation = incipientValuation + 1;
        incipientCount.push(incipientValuation);
        normalCount.push(normalValuation);
        degradeCount.push(degradeValuation)

      } else {

        degradeValuation = degradeValuation + 1;
        degradeCount.push(degradeValuation)
        normalCount.push(normalValuation);
        incipientCount.push(incipientValuation);

      }

    });

    /// array of data for line  in Screw Prediction
    this.screwPredictionDataNormalCount = normalCount;
    this.screwPredictionDataIncipientCount = incipientCount;
    this.screwPredictonDataDegradeCount = degradeCount;
    //  console.log(this.normalCount, this.incipientCount, this.degradeCount)

  }



  ScrewTrainCountCalculations(Data) {

    this.TrainCountCalculations = null;
    this.TrainCountCalculations = Data;
    var countKey = Object.keys(this.TrainCountCalculations).length;
    this.screwTrainTotalCount = countKey
    //   console.log('total count', this.screwTrainTotalCount)


    var result: any = [];

    if (this.TrainCountCalculations != 0) {

      this.TrainCountCalculations.forEach(function (o) {
        Object.keys(o).forEach(function (k) {
          result[k] = result[k] || {};
          result[k][o[k]] = (result[k][o[k]] || 0) + 1;
        });
      });
      this.TrainIncipientCount = result.Classification.incipient;
      if (this.TrainIncipientCount == undefined) {
        this.TrainIncipientCount = 0;
      }
      this.TrainDegradeCount = result.Classification.degrade;
      if (this.TrainDegradeCount == undefined) {
        this.TrainDegradeCount = 0;
      }
      this.TrainNormalCount = result.Classification.normal;
      if (this.TrainNormalCount == undefined) {
        this.TrainNormalCount = 0;
      }
      this.TrainNormalPercentage = this.TrainNormalCount / this.screwTrainTotalCount * 100
      //   console.log('Screw Train Normal Percentage : ', this.TrainNormalPercentage);

      this.TrainIncipientPercentage = this.TrainIncipientCount / this.screwTrainTotalCount * 100
      //   console.log('Screw Train Incipient Percentage : ', this.TrainIncipientPercentage)

      this.TrainDegradePercentage = this.TrainDegradeCount / this.screwTrainTotalCount * 100
      //   console.log('Screw Train Degrade Percentage : ', this.TrainDegradePercentage)

    }
  }

  ScrewPredictionCountCalculations(Data) {
    this.PredictionCountCalculations = null;
    this.PredictionCountCalculations = Data;

    var countKey = Object.keys(this.PredictionCountCalculations).length;
    this.screwPredictionTotalCount = countKey
    var result: any = [];

    if (this.PredictionCountCalculations != 0) {

      this.PredictionCountCalculations.forEach((o) => {
        Object.keys(o).forEach((k) => {
          result[k] = result[k] || {};
          result[k][o[k]] = (result[k][o[k]] || 0) + 1;
        });
      });
      this.screwPredictionIncipientCount = result.Prediction.incipient;
      if (this.screwPredictionIncipientCount == undefined) {
        this.screwPredictionIncipientCount = 0;
      }
      this.screwPredictionDegradeCount = result.Prediction.degrade;
      if (this.screwPredictionDegradeCount == undefined) {
        this.screwPredictionDegradeCount = 0;
      }
      this.screwPredictionNormalCount = result.Prediction.normal;
      if (this.screwPredictionNormalCount == undefined) {
        this.screwPredictionNormalCount = 0;
      }

      this.screwPredictionNormalPercentage = this.screwPredictionNormalCount / this.screwPredictionTotalCount * 100
      //    console.log('Screw Prediction Normal Percentage : ', this.screwPredictionNormalPercentage);

      this.screwPredictionIncipientPercentage = this.screwPredictionIncipientCount / this.screwPredictionTotalCount * 100
      //     console.log('Screw Prediction Incipient Percentage : ', this.screwPredictionIncipientPercentage)

      this.screwPredictionDegradePercentage = this.screwPredictionDegradeCount / this.screwPredictionTotalCount * 100
      //     console.log('Screw Prediction Degrade Percentage : ', this.screwPredictionDegradePercentage)


    }

  }




  displayScrewTrainLinePieChart(Data) {
    this.ScrewTrainLinePieChartDateCount = Data
    let items = [];
    this.ScrewTrainLinePieChartDateCount.forEach((value) => {
      var Date = moment(value.InsertedDate).format('DD-MM-YYYY');
      items.push(Date);
    });

    if (this.ScrewTrainLineChart != undefined) {
      this.ScrewTrainLineChart.destroy();
    }
    this.changeDetectorRef.detectChanges();
    this.ScrewTrainLineChart = new Chart('LineContainer', {
      type: "line",
      data: {
        labels: items,
        datasets: [
          {
            label: "Incipent",
            data: this.incipientCount,
            borderWidth: 1,
            borderColor: "#FFA500"
          }, {
            label: "Normal",
            data: this.normalCount,
            borderWidth: 1,
            borderColor: "#008000"
          },
          {
            label: "Degrade Screw      Train Chart       Time vs Count",
            data: this.degradeCount,
            borderWidth: 2,
            borderColor: " #FF0000"
          }
        ]
      },
      options: {
        scales: {
          xAxes: [{}],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Count"
              }
            }
          ],
        }
      }
    });

    if (this.ScrewTrainLineChart != undefined) {
      this.ScrewTrainLineChart.update();
    }
    if (this.ScrewTrainPieChart != undefined) {
      this.ScrewTrainPieChart.destroy();
    }
    this.changeDetectorRef.detectChanges();
    this.ScrewTrainPieChart = new Chart('pie', {
      type: "pie",
      data: {
        labels: ["Normal", "incipient", "Degrade"],
        datasets: [
          {
            backgroundColor: ["#2ecc71", "#f1c40f", "#e74c3c"],
            data: [this.TrainNormalPercentage, this.TrainIncipientPercentage, this.TrainDegradePercentage]
          }
        ]
      }
    })
    if (this.ScrewTrainPieChart != undefined) {
      this.ScrewTrainPieChart.update();
    }

  }

  displayScrewPredictionLinePieChart(Data) {
    this.ScrewPredictionLinePieChartDateCount = Data
    let items = [];
    this.ScrewPredictionLinePieChartDateCount.forEach((value) => {
      var Date = moment(value.InsertedDate).format('DD-MM-YYYY');
      items.push(Date)
    });
    if (this.ScrewPredictionLine != undefined) {
      this.ScrewPredictionLine.destroy();
    }
    this.changeDetectorRef.detectChanges();

    this.ScrewPredictionLine = new Chart('LineContainer', {
      type: "line",
      data: {
        labels: items,
        datasets: [
          {
            label: "Incipent",
            data: this.screwPredictionDataIncipientCount,
            borderWidth: 1,
            borderColor: "#FFA500"
          }, {
            label: "Normal",
            data: this.screwPredictionDataNormalCount,
            borderWidth: 1,
            borderColor: "#008000"
          },
          {
            label: "Degrade                    Screw Prediction Chart     Time vs Count",
            data: this.screwPredictonDataDegradeCount,
            borderWidth: 2,
            borderColor: " #FF0000"
          }
        ]
      },
      options: {
        scales: {
          xAxes: [
            {

            }

          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Count"
              }
            }
          ],
        }
      }
    });
    if (this.ScrewPredictionLine != undefined) {
      this.ScrewPredictionLine.update();
    }
    if (this.ScrewPredictionPie != undefined) {
      this.ScrewPredictionPie.destroy();
    }
    this.changeDetectorRef.detectChanges();

    this.ScrewPredictionPie = new Chart('pie', {
      type: "pie",
      data: {
        labels: ["Normal", "incipient", "Degrade"],
        datasets: [
          {
            backgroundColor: ["#2ecc71", "#f1c40f", "#e74c3c"],
            data: [this.screwPredictionNormalPercentage, this.screwPredictionIncipientPercentage, this.screwPredictionDegradePercentage]
          }
        ]
      }
    });
    if (this.ScrewPredictionPie != undefined) {
      this.ScrewPredictionPie.update();
    }
  }


  ScrewTrainRealTimeNormal(Data) {
    this.stopDynamicChartAfterCount = null
    this.trainRealTime = Data;
    var countKey = Object.keys(this.trainRealTime).length;
    this.stopDynamicChartAfterCount = countKey
    var abc: any = [];
    this.dynamicNormalData = null;
    var interval = 500;
    var promise = Promise.resolve();

    this.normalCount.forEach((el) => {
      promise = promise.then(() => {
        abc.push(el)
        return new Promise((resolve) => {
          setTimeout(resolve, interval);
        });
      });
    });
    promise.then(() => {
      console.log('Loop finished.');
    });

    this.dynamicNormalData = abc;
    if (this.RealTimeLine != undefined) {
      this.RealTimeLine.update();
    }
  }

  ScrewTrainRealTimeIncipient() {
    var incipient: any = [];
    this.dynamicNormalData = null;
    var interval = 500;
    var promise = Promise.resolve();

    this.incipientCount.forEach((el) => {
      promise = promise.then(() => {
        incipient.push(el)
        return new Promise((resolve) => {
          setTimeout(resolve, interval);
        });
      });
    });
    promise.then(() => {
      console.log('Loop finished.');
    });

    this.dynamicIncipientData = incipient;
    if (this.RealTimeLine != undefined) {
      this.RealTimeLine.update();
    }

  }

  ScrewTrainRealTimeDegrade() {

    var degrade: any = [];
    this.dynamicNormalData = null;
    var interval = 500;
    var promise = Promise.resolve();

    this.degradeCount.forEach((el) => {
      promise = promise.then(() => {
        degrade.push(el);
        return new Promise((resolve) => {
          setTimeout(resolve, interval);
        });
      });
    });
    promise.then(() => {
      console.log('Loop finished.');
    });

    this.dynamicDegradeData = degrade;
    if (this.RealTimeLine != undefined) {
      this.RealTimeLine.update();
    }

  }

  ScrewPredictRealTimeNormal(Data) {
    this.predictRealTime = null;
    this.predictRealTime = Data;
    var countKey = Object.keys(this.predictRealTime).length;
    this.stopDynamicChartAfterCount = countKey
    var abc: any = [];
    this.dynamicNormalData = null;
    var interval = 500;
    var promise = Promise.resolve();

    this.screwPredictionDataNormalCount.forEach((el) => {
      promise = promise.then(() => {
        abc.push(el)
        return new Promise((resolve) => {
          setTimeout(resolve, interval);
        });
      });
    });
    promise.then(() => {
      console.log('Loop finished.');
    });

    this.dynamicNormalData = abc;
    if (this.RealTimeLine != undefined) {
      this.RealTimeLine.update();
    }

  }

  ScrewPredictRealTimeIncipient() {
    var incipient: any = [];
    this.dynamicNormalData = null;
    var interval = 500;
    var promise = Promise.resolve();

    this.screwPredictionDataIncipientCount.forEach((el) => {
      promise = promise.then(() => {
        incipient.push(el)
        return new Promise((resolve) => {
          setTimeout(resolve, interval);
        });
      });
    });
    promise.then(() => {
      console.log('Loop finished.');
    });

    this.dynamicIncipientData = incipient;
    if (this.RealTimeLine != undefined) {
      this.RealTimeLine.update();
    }

  }

  ScrewPredictRealTimeDegrade() {
    var degrade: any = [];
    this.dynamicNormalData = null;
    var interval = 500;
    var promise = Promise.resolve();

    this.screwPredictonDataDegradeCount.forEach((el) => {
      promise = promise.then(() => {
        degrade.push(el);
        return new Promise((resolve) => {
          setTimeout(resolve, interval);
        });
      });
    });
    promise.then(() => {
      console.log('Loop finished.');
    });

    this.dynamicDegradeData = degrade;
    if (this.RealTimeLine != undefined) {
      this.RealTimeLine.update();
    }

  }

  displyRealTimeLine(Data) {
    this.RealTimeLineChartDateCount = Data
    var iteration = 0;
    let items = [];
    this.RealTimeLineChartDateCount.forEach((value) => {
      var Date = moment(value.InsertedDate).format('DD-MM-YYYY')
      items.push(Date)

    });

    var clear = setInterval(() => {
      iteration = iteration + 1;

      if (this.stopDynamicChartAfterCount == iteration) {
        clearInterval(clear);
      } else {
        if (this.RealTimeLine != undefined) {
          this.RealTimeLine.destroy();
        }
        this.changeDetectorRef.detectChanges();
        this.RealTimeLine = new Chart('RealContainer', {
          type: "line",
          data: {
            labels: items,
            datasets: [
              {
                label: "Incipent",
                data: this.dynamicIncipientData,
                borderWidth: 1,
                borderColor: "#FFA500"
              },
              {
                label: "Normal",
                data: this.dynamicNormalData,
                borderWidth: 1,
                borderColor: "#008000"
              },
              {
                label: "Degrade                          Time vs Count",
                data: this.dynamicDegradeData,
                borderWidth: 2,
                borderColor: " #FF0000"
              }
            ]
          },
          options: {
            scales: {
              xAxes: [{}],
              yAxes: [
                {
                  scaleLabel: {
                    display: true,
                    labelString: "Count",

                  }
                }
              ],

            }
          }
        }
        );
      }

    }, 2000)

  }

  getPrescriptiveRecords() {
    const url : string = this.prescriptiveAPIName.FMEATagCheck;
    this.dashboardMethod.getWithoutParameters(url)
    .subscribe(
      res => {
        this.prescriptiveRecords = res;
        this.getTreeStructure(this.prescriptiveRecords[0]);
      }, err => {
        console.log(err.err);
      }
    )
  }

  getTreeStructure(item) {
    this.tree = JSON.parse(item.FailureModeWithLSETree);
  }

  UpdatePrescriptiveRecords(p) {
    if (localStorage.getItem('PrescriptiveUpdateObject') != null) {
      localStorage.removeItem('PrescriptiveUpdateObject');
    }
    localStorage.setItem('PrescriptiveUpdateObject', JSON.stringify(p));
    if (localStorage.getItem('PrescriptiveUpdateObject') != null) {
      this.router.navigateByUrl('/Home/Prescriptive/Update');
    }
  }


  public CFPPrescriptiveId;
  public DeleteTreeName: string = ""

  DeletePrescriptiveRecords(p) {
    this.CFPPrescriptiveId = p.CFPPrescriptiveId
    this.DeleteTreeName = p.TagNumber
  }

  SoftDeletePrescriptiveRecords() {
    const params = new HttpParams()
          .set('id', this.CFPPrescriptiveId)
    const url : string = this.prescriptiveAPIName.FMEAListSingleDelete;
    this.dashboardMethod.DeleteWithParam(url, params)
      .subscribe(res => {
        this.getPrescriptiveRecords();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Deleted Successfully' });
      }, err => {
        console.log(err)
      });
  }

  ADDConsequenceRecords(p) {
    if (localStorage.getItem('PrescriptiveUpdateObject') != null) {
      localStorage.removeItem('PrescriptiveUpdateObject');
    }
    localStorage.setItem('PrescriptiveUpdateObject', JSON.stringify(p));
    if (localStorage.getItem('PrescriptiveUpdateObject') != null) {
      this.router.navigateByUrl('/Home/Prescriptive/Consequences');
      this.getPrescriptiveRecords();
    }

  }

  FailureModeTable(p) {
    this.Table1 = false
    this.Table2 = true
    this.FailureModeDataTabe2 = p.centrifugalPumpPrescriptiveFailureModes;
    this.getTreeStructure(p);
  }

  BackToTable1() {
    this.Table1 = true
    this.Table2 = false
  }
  public fileAttachmentEnable: boolean = false
  public fileUpload: string = ""
  public UploadFileDataResponse: any = []
  public fileToUpload;
  public ImageEnable: boolean = false;
  public PdfEnable: boolean = false;
  public FileSafeUrl: any;
  public FileUrl: any;
  private ParentId: number = 0;
  public CRemarks: string = "";
  public CAttachmentFile: any;
  public tree: any;
  public uploadFile(event) {
    if (event.target.files.length > 0) {
      if (event.target.files[0].type === 'application/pdf'
        || event.target.files[0].type === 'image/png'
        || event.target.files[0].type === 'image/jpeg') {
        let fileToUpload = event.target.files[0];
        this.fileUpload = fileToUpload.name;
        this.CAttachmentFile = event.target.files[0];
      }
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: "Only Pdf's and Images are allowed" })
    }
  }
  getAttachmentID(p) {
    this.ParentId = p.CFPPrescriptiveId;
    this.CRemarks = p.CRemarks;
    this.fileToUpload = p.CAttachmentDBPath;
    this.fileUpload = p.CAttachmentDBPath.split('/')[1];
  }

  saveAttachment() {
    const formData = new FormData();
    formData.append('file', this.CAttachmentFile);
    formData.append('CRemarks', this.CRemarks);
    formData.append('removePath', this.fileToUpload)
    
    this.http.put(`api/PrescriptiveAPI/CompontentAttachment?id=${this.ParentId}`, formData)
      .subscribe(res => {
        this.getPrescriptiveRecords();
        this.UploadFileDataResponse = res;
        this.fileAttachmentEnable = true;
        this.CRemarks = "";
        this.fileToUpload = "";
        this.fileUpload = "";
      }, err => { console.log(err.err) }
      )
  }
  ViewAttachment(p) {
    this.FileSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(p.CAttachmentDBPath);
    this.FileUrl = p.CAttachmentDBPath;
    var extension = this.getFileExtension(p.CAttachmentDBPath);
    this.CRemarks = p.CRemarks;
    if (extension.toLowerCase() == 'jpg' || extension.toLowerCase() == 'jpeg' || extension.toLowerCase() == 'png') {
      this.ImageEnable = true;
      this.PdfEnable = false;
    } else if (extension.toLowerCase() == 'pdf') {
      this.ImageEnable = false;
      this.PdfEnable = true;
    }
  }
  getFileExtension(filename) {
    const extension = filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename;
    return extension;
  }
  CloseAttachmentModal() {
    this.fileAttachmentEnable = false
    this.fileToUpload = []
  }
  FMEAReports(p) {
    localStorage.setItem('ReportObj', JSON.stringify(p))
  }

}