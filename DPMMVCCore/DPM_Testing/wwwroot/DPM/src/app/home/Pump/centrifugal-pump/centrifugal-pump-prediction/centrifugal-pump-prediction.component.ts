import { HttpClient,HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';
import { MessageService } from 'primeng/api';
import { CentrifugalPumpConstantAPI } from '../centrifugal-pump.API';
import * as XLSX from 'xlsx';
import { CentrifugalPumpPredictionModel } from './centrifugal-pump-prediction.model';
import * as moment from 'moment';

@Component({
  selector: 'app-centrifugal-pump-prediction',
  templateUrl: './centrifugal-pump-prediction.component.html',
  styleUrls: ['./centrifugal-pump-prediction.component.scss']
})
export class CentrifugalPumpPredictionComponent implements OnInit {

  public fileName = 'ExcelSheet.xlsx';
  public file: File
  public filelist: any
  public arrayBuffer: any
  public loading: boolean = false;
  public centrifugalPumpDetailList: any;
  public centrifugalPumpWithPrediction: any = [];
  public showCentrifugalPumpBulkPrediction: boolean = false;
  public SingleCentrifugalPumpBulkPredictionName : string = "";
  public PridictedId: number = 0;
  public notification = null;
  public FromDate : string = ""
  public ToDate : string = ""
  public CentrifugalPumpconfigurationObj: CentrifugalPumpPredictionModel = new CentrifugalPumpPredictionModel();

  constructor(public http: HttpClient,
    public title: Title,
    public messageService: MessageService,
    public commonLoadingDirective: CommonLoadingDirective,
    private CentrifugalPumpPredictionName: CentrifugalPumpConstantAPI,
    private CentrifugalPumpPredictionMethod: CommonBLService,
   ) { }

  ngOnInit(): void {
    this.title.setTitle('CentrifugalPump Prediction | Dynamic Prescriptive Maintenence');
    this.CPChangeToBulkPrediction();
    this.showNotification('');
    // this.GetAllRecords();
    this.getPredictedList();
  }

  Downloadfile() {
    let link = document.createElement("a");
    link.download = "Excel_Format";
    link.href = "dist/DPM/assets/PumpExcel_Format.xlsx";
    link.click();
  }

  addfile(event) {
    this.file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary", cellDates: true });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
      this.centrifugalPumpDetailList = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      this.loading = true;
      this.commonLoadingDirective.showLoading(true, "Please wait to get the predicted values....");
      const url : string = this.CentrifugalPumpPredictionName.CentrifugalPumpPredictionAddData;
      this.CentrifugalPumpPredictionMethod.postWithHeaders(url, this.centrifugalPumpDetailList)
        .subscribe(async res => {
              // this.centrifugalPumpWithPrediction = res;
              this.GetAllRecords()
              this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Process is completed' });
            }, err => {
              console.log(err.error);
              this.commonLoadingDirective.showLoading(false, "");
            })
          this.loading = false;  
    }
  }
  showNotification(category) {
    switch (category) {
      case '':
        this.notification = { class: '', message: '' };
        break;
      case 'bad':
        this.notification = { class: 'text-success', message: 'Bad' };
        break;
      case 'normal':
        this.notification = { class: 'text-success', message: 'normal' };
        break;
      case 'incipient':
        this.notification = { class: 'text-primary', message: 'Incipient!' };
        break;
      case 'degrade':
        this.notification = { class: 'text-danger', message: 'Degrade!' };
        break;

      default:
        break;
    }
  }
  getPredictedById(PredictedId) {
    this.showNotification("")
    const params = new HttpParams()
          .set("PredictedId", PredictedId)
     var url : string = this.CentrifugalPumpPredictionName.getPredictionById
     this.CentrifugalPumpPredictionMethod.getWithParameters(url, params)
     .subscribe((res: any) => {
        this.showNotification(res.Prediction)
        this.commonLoadingDirective.showLoading(false, "");
      }, err => {
        this.commonLoadingDirective.showLoading(false, "");
        console.log(err.error);
      });
  }

  getPredictedList() {
    this.centrifugalPumpWithPrediction = [];
    this.commonLoadingDirective.showLoading(true, "Please wait to get the predicted values....");
    var url : string = this.CentrifugalPumpPredictionName.getCentrifugalPumpPredictedList;
    this.CentrifugalPumpPredictionMethod.getWithoutParameters(url)
      .subscribe(res => {
        this.centrifugalPumpWithPrediction = res;
        this.commonLoadingDirective.showLoading(false, "");
      }, err => {
        this.commonLoadingDirective.showLoading(false, "");
        console.log(err.error);
      });
  }
  
  CPChangeToBulkPrediction() {
    if (!this.showCentrifugalPumpBulkPrediction) {
      this.CentrifugalPumpconfigurationObj = new CentrifugalPumpPredictionModel();
      this.showNotification("")
      this.showCentrifugalPumpBulkPrediction = true;
      this.getPredictedList();
      this.SingleCentrifugalPumpBulkPredictionName = "Single Prediction"
      this.PridictedId = 0;
    } else {
      this.CentrifugalPumpconfigurationObj = new CentrifugalPumpPredictionModel();
      this.showNotification("")
      this.showCentrifugalPumpBulkPrediction = false;
      this.PridictedId = 0;
      this.SingleCentrifugalPumpBulkPredictionName = "Bulk Prediction"
    }
  }

  CentrifugalPumpPrediction() {
    this.CentrifugalPumpconfigurationObj.Prediction = "";
    this.CentrifugalPumpconfigurationObj.UserId = "";
    this.commonLoadingDirective.showLoading(true, "Please wait to get the predicted values....");
    this.CentrifugalPumpconfigurationObj.InsertedDate = moment().format("YYYY-MM-DD");
    var url : string =  this.CentrifugalPumpPredictionName.Prediction
    this.CentrifugalPumpPredictionMethod.postWithoutHeaders(url, this.CentrifugalPumpconfigurationObj)
      .subscribe(async (res : any) => {
        this.CentrifugalPumpconfigurationObj = res;
        this.getPredictedById(res.CentifugalPumpPID);
        //  this.PridictedId = res.PredictionId;
        // await this.http.get(`${this.configService.getApi('PREDICTION_URL')}name=prediction`, { responseType: 'text' })
          // .subscribe(res => {
          //   this.getPredictedById(this.PridictedId);
          //   this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Process is completed' });
          // }, err => {
          //   console.log(err.error);
          //   this.commonLoadingDirective.showLoading(false, "");
          // })
      }, err => {
        this.commonLoadingDirective.showLoading(false, "");
        console.log(err.error);
      });

  }
  getPredictedListRecordsByDate(){
    const params = new HttpParams()
          .set('FromDate', this.FromDate)
          .set('ToDate', this.ToDate)
     this.CentrifugalPumpPredictionMethod.getWithParameters( this.CentrifugalPumpPredictionName.getPredictedListByDate, params)
     .subscribe(
       (res : any) => {
        this.centrifugalPumpWithPrediction = res;
       }, err => { console.log(err.error)}
     )
  }
  GetAllRecords(){
    this.commonLoadingDirective.showLoading(true, "Please wait to get the predicted values....");
    var url : string = this.CentrifugalPumpPredictionName.getCentrifugalPumpAllRecords;
    this.CentrifugalPumpPredictionMethod.getWithoutParameters(url)
      .subscribe(res => {
        this.centrifugalPumpWithPrediction = res;
        this.commonLoadingDirective.showLoading(false, "");
      }, err => {
        this.commonLoadingDirective.showLoading(false, "");
        console.log(err.error);
      });

  }
}
