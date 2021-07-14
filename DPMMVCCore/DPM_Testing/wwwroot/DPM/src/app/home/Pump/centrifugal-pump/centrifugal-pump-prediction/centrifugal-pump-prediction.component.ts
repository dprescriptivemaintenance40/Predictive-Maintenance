import { HttpClient,HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';
import { MessageService } from 'primeng/api';
import { CentrifugalPumpConstantAPI } from '../centrifugal-pump.API';
import * as XLSX from 'xlsx';
import { CentrifugalPumpPredictionModel } from './centrifugal-pump-prediction.model';
import * as moment from 'moment';
import { ConfigService } from 'src/app/shared/config.service';

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
  public minDate = new Date();
  public maxDate = new Date();
  public rangeDates: Date[];
  public UserDetails: any = [];
  public CentrifugalPumpconfigurationObj: CentrifugalPumpPredictionModel = new CentrifugalPumpPredictionModel();
  public futurePredictionDataTableList : any =[];
  constructor(public http: HttpClient,
    public title: Title,
    public messageService: MessageService,
    private configService: ConfigService,
    private CentrifugalPumpPredictionName: CentrifugalPumpConstantAPI,
    private CentrifugalPumpPredictionMethod: CommonBLService,
   ) { 
    this.FromDate = moment().format('YYYY-MM-DD');
    this.ToDate = moment().format('YYYY-MM-DD');
    this.GetFuturePredictionRecords();
    this.UserDetails = JSON.parse(localStorage.getItem('userObject'));
    // this.maxDate.setDate(this.maxDate.getDate() + 3); 
    
    // this.maxDate = moment().add(10, 'days').toDate();
    // this.minDate = moment().subtract(10, 'days').toDate();
    // console.log(this.minDate)
    // console.log(this.maxDate)
   }

  ngOnInit(): void {
    this.title.setTitle('CentrifugalPump Prediction | Dynamic Prescriptive Maintenence');
    this.CPChangeToBulkPrediction();
    this.getPredictedList();
  }

  GetFuturePredictionRecords(){
    this.CentrifugalPumpPredictionMethod.getWithoutParameters(this.CentrifugalPumpPredictionName.GetFuturePredictionRecords)
    .subscribe(
      (res: any)=>{
        if(res.length>0){
          this.minDate = moment(res[0].FPDate).toDate();
          this.maxDate = moment(res[res.length-1].FPDate).toDate();
        }
      }
    )
  }


  SelectedFutureDate(){
    var  toDate : any =[];
    toDate = this.rangeDates[1]
    if(this.rangeDates[1] == null || this.rangeDates[1] == undefined){
      toDate = this.rangeDates[0]
    }
    const params = new HttpParams()
          .set('fromDate', moment(this.rangeDates[0]).format('YYYY-MM-DD'))
          .set('toDate', moment(toDate).format('YYYY-MM-DD'))
    this.CentrifugalPumpPredictionMethod.getWithParameters(this.CentrifugalPumpPredictionName.GetFuturePredictionRecordsByDate, params)
    .subscribe(
      (res : any) =>{
        this.futurePredictionDataTableList = res;
      }, err => { console.log(err.error)}
    )
  }

  Downloadfile() {
    let link = document.createElement("a");
    link.download = "Excel_Format";
    link.href = "dist/DPM/assets/PumpExcel_Format.xlsx";
    link.click();
  }

 async addfile(event) {
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
      const url : string = this.CentrifugalPumpPredictionName.CentrifugalPumpPredictionAddData;
      this.CentrifugalPumpPredictionMethod.postWithHeaders(url, this.centrifugalPumpDetailList)
        .subscribe(async res => {
              var UserId = res[0].UserId;
              var Data : any = await this.GetTrainDataList();
              if(Data.length >= 10){
                await this.http.get(`${this.configService.getApi('PREDICTION_URL')}UserId=${UserId}&name=prediction&type=pump`, { responseType: 'text' })
                      .subscribe(res => {
                        this.getPredictedList();
                        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Process is completed' });
                      }, err => {
                        console.log(err.error);
                      })
              }else{
                this.getPredictedList();
                this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'For prediction you should have minimum 20 records in train' }); 
                this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'Prediction cannot be done' });      
              }
            }, err => {
              console.log(err.error);
            })
          this.loading = false;  
    }
  }
  showNotification(category) {
    switch (category) {
      case '':
        this.notification = { class: '', message: '' };
        break;
      case 'Bad':
        this.notification = { class: 'text-success', message: 'Bad' };
        break;
      case 'Normal':
        this.notification = { class: 'text-success', message: 'normal' };
        break;
      case 'Incipient':
        this.notification = { class: 'text-primary', message: 'Incipient!' };
        break;
      case 'Degrade':
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
      }, err => {
        console.log(err.error);
      });
  }

  FuturePrediction(){
    this.CentrifugalPumpPredictionMethod.getWithoutParameters(this.CentrifugalPumpPredictionName.FuturePrediction)
    .subscribe(async (res : any)=>{
      if(res.length>5){
        await this.http.get(`${this.configService.getApi('PREDICTION_URL')}UserId=${this.UserDetails.UserId}&name=futureprediction&type=pump`, { responseType: 'text' })
        .subscribe(res => {
          this.GetFuturePredictionRecords();
        }, err=>{console.log(err.error)})
        //logic to hit future prediction
      }else if(res.length > 0){
        this.messageService.add({ severity: 'info', summary: 'info', detail: `Need more ${(res.length-5)} more day's of data to do future prediction on prediction records.` }); 
      }else{
        this.messageService.add({ severity: 'info', summary: 'info', detail: 'Please upload data in prediction to do future prediction' }); 
      }
    }, err=>console.log(err.error));
  }

  getPredictedList() {
    var url : string = this.CentrifugalPumpPredictionName.getCentrifugalPumpPredictedList;
    this.CentrifugalPumpPredictionMethod.getWithoutParameters(url)
        .subscribe((res: any) => {
            this.centrifugalPumpWithPrediction = res;
            this.loading = false;
      }, err => {
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
 if(this.CentrifugalPumpconfigurationObj.P1 >0 && this.CentrifugalPumpconfigurationObj.P2 >0 || this.CentrifugalPumpconfigurationObj.I >0 || this.CentrifugalPumpconfigurationObj.Q >0){
    this.CentrifugalPumpconfigurationObj.Prediction = "";
    this.CentrifugalPumpconfigurationObj.UserId = "";
    this.CentrifugalPumpconfigurationObj.InsertedDate = moment().format("YYYY-MM-DD");
    var url : string =  this.CentrifugalPumpPredictionName.Prediction
    this.CentrifugalPumpPredictionMethod.postWithoutHeaders(url, this.CentrifugalPumpconfigurationObj)
      .subscribe(async (res : any) => {
        this.CentrifugalPumpconfigurationObj = new CentrifugalPumpPredictionModel();
         var UserId = res.UserId;
         var PridictedId = res.CentifugalPumpPID;
         var Data : any = await this.GetTrainDataList();
         if(Data.length >= 20){ 
          await this.http.get(`${this.configService.getApi('PREDICTION_URL')}UserId=${UserId}&name=prediction&type=pump`, { responseType: 'text' })
                .subscribe(res => {
                  this.getPredictedById(PridictedId);
                  this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Process is completed' });
                }, err => {
                  console.log(err.error);
                })
         }else{
          this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'For prediction you should have minimum 20 records in train' }); 
          this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'Prediction cannot be done' });      
        }
         
      }, err => {
        console.log(err.error);
      });
    }else {
      this.messageService.add({ severity: 'warn', detail: 'No Records are Found for Prediction'});
    }
  }

  async GetTrainDataList(){
    return await this.CentrifugalPumpPredictionMethod.getWithoutParameters(this.CentrifugalPumpPredictionName.getCentrifugalPumpTrainList)
                 .toPromise()
  }

  getPredictedListRecordsByDate(){
    const params = new HttpParams()
          .set('FromDate', this.FromDate)
          .set('ToDate', this.ToDate)
     this.CentrifugalPumpPredictionMethod.getWithParameters(this.CentrifugalPumpPredictionName.getPredictedListByDate, params)
     .subscribe(
       (res : any) => {
        this.centrifugalPumpWithPrediction = res;
       }, err => { console.log(err.error)}
     )
  }
  exportToExcel() {
    const dataArray = this.centrifugalPumpWithPrediction
    if (dataArray != 0) {
      const dataArrayList = dataArray.map(obj => {
        const {CentifugalPumpPID,UserId,BatchId, InsertedDate, ...rest } = obj;
        return rest;
      })

      var csvData = this.ConvertToCSV(dataArrayList);
      var a = document.createElement("a");
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      var blob = new Blob([csvData], { type: 'text/csv' });
      var url = window.URL.createObjectURL(blob);
      a.href = url;
      // var x = new Date();
      var link: string = "DPMPrediction" + '.csv';
      a.download = link.toLocaleLowerCase();
      a.click();
      this.messageService.add({ severity: 'info', detail: 'Excel Downloaded Successfully'});

    } else {
      this.messageService.add({ severity: 'warn', detail: 'No Records are Found to Download in Excel'});
    }
  }
  ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    var row = "";
    for (var index in objArray[0]) {
      //Now convert each value to string and comma-separated
      row += index + ',';
    }
    row = row.slice(0, -1);
    //append Label row with line break
    str += row + '\r\n';
    for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var index in array[i]) {
        if (line != '') line += ','

        line += array[i][index];
      }
      str += line + '\r\n';
    }
    return str;
  }
}
