import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as XLSX from 'xlsx';
import { ScrewCompressorPredictionModel } from '../configuration/screw-compressor-prediction.model';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.scss']
})
export class PredictionComponent implements OnInit {

  public showBulkPrediction: boolean = false;
  public file: any;
  public configurationObj: ScrewCompressorPredictionModel = new ScrewCompressorPredictionModel();
  public configurationObjList: any = [];
  constructor(private title: Title,
    private http: HttpClient) { }



  first = 0;

  rows = 10000;

  ngOnInit() {
    this.title.setTitle('DPM | Screw Prediction');
    this.showNotification('');
    setInterval(() => {
      this.getPredictedList();
    }, 5000);
  }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.screwWithPrediction ? this.first === (this.screwWithPrediction.length - this.rows) : true;

  }

  isFirstPage(): boolean {
    return this.screwWithPrediction ? this.first === 0 : true;

  }

  notification = null
  fileName = 'ExcelSheet.xlsx'
  testingList: any;
  screwWithPrediction: any = [];
  customer: any = [];
  //file: File
  filelist: any
  arrayBuffer: any
  compDetail: any
  private loading: boolean = false;
  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  getPredictedList() {
    this.loading = true;
    this.http.get<any>('api/ScrewCompressureAPI/GetPrediction', this.headers)
      .subscribe(res => {
        this.screwWithPrediction = res;
        this.showNotification(res[0].Prediction)
        this.loading = false;
      }, err => {
        this.loading = false;
        console.log(err.error);
      });
  }


  addfile(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.file = fileList[0];
      this.fileName = this.file.name;
    }

    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      this.loading = true;
      this.http.post<any>('api/ScrewCompressureAPI/Prediction', JSON.stringify(XLSX.utils.sheet_to_json(worksheet, { raw: true })), this.headers)
        .subscribe(res => {
          //this.screwWithPrediction = res;
          this.loading = false;
        }, err => {
          this.loading = false;
          console.log(err.error);
        });
    }
  }



  showNotification(category) {
    switch (category) {
      case '':
        this.notification = { class: 'text-dark', message: 'Prediction' };
        break;
      case 'normal':
        this.notification = { class: 'text-success', message: 'Normal' };
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

  ChangeToBulkPrediction() {
    if (!this.showBulkPrediction)
      this.showBulkPrediction = true;
    else
      this.showBulkPrediction = false;
  }

  Prediction() {
    this.configurationObjList.push(this.configurationObj);
    this.loading = true;
    this.http.post<any>('api/ScrewCompressureAPI/Prediction', JSON.stringify(this.configurationObjList), this.headers)
      .subscribe(res => {
        this.screwWithPrediction = res;
        this.showNotification(res[0].Prediction);
        this.loading = false;
        this.configurationObj = new ScrewCompressorPredictionModel();
      }, err => {
        this.loading = false;
        console.log(err.error);
      });
    // let formData = new FormData();
    // formData.append('bulkFile', this.file);
    // this.http.post('http://127.0.0.1:8000/CompressorPrediction?BulkPredict=' + this.showBulkPrediction + "&PS1=" + this.configurationObj.PS1
    //   + "&PD1=" + this.configurationObj.PD1 + "&PS2=" + this.configurationObj.PS2 + "&PD2=" + this.configurationObj.PD2
    //   + "&TS1=" + this.configurationObj.TS1 + "&TD1=" + this.configurationObj.TD1 + "&TS2=" + this.configurationObj.TS2
    //   + "&TD2=" + this.configurationObj.TD2, formData, { responseType: 'text' })
    //   .subscribe((res: any) => {
    //     this.screwWithPrediction = res[0];
    //     this.showNotification(res[0][0].Predicted)
    //     console.log(res[1]);
    //   }, err => {
    //     alert("Please try later.")
    //   })
  }

}
