import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';
import * as XLSX from 'xlsx';
import { ScrewCompressorPredictionModel } from '../configuration/screw-compressor-prediction.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.scss'],
  providers: [MessageService]
})
export class PredictionComponent implements OnInit {

  public showBulkPrediction: boolean = false;
  public file: any;
  public configurationObj: ScrewCompressorPredictionModel = new ScrewCompressorPredictionModel();
  public configurationObjList: any = [];

  private notification = null
  private fileName = 'ExcelSheet.xlsx'
  private testingList: any;
  private screwWithPrediction: any = [];
  private customer: any = [];
  // private file: File
  private filelist: any
  private arrayBuffer: any
  private compDetail: any
  private loading: boolean = false;
  private first = 0;
  private rows = 10000;
  private PridictedId: number = 0;
  private Image = false;
  private enableImage = true;
  private CancelImage = false;
  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }


  constructor(private title: Title,
    private http: HttpClient,
    private messageService: MessageService,
    private commonLoadingDirective: CommonLoadingDirective) { }


  ngOnInit() {
    this.title.setTitle('DPM | Screw Prediction');
    this.showNotification('');
    setInterval(() => {
      if (this.showBulkPrediction) {
        this.getPredictedList();
      } else {
        if (this.PridictedId != 0) {
          this.getPredictedById(this.PridictedId);
        }
      }
    }, 10000);
  }
  imgDowd() {
    let link = document.createElement("a");
    link.download = "Compressor Image";
    link.href = "src/assets/img/compressor.PNG";
    link.click();
  }

  compressorImage() {
    this.enableImage = false;
    this.CancelImage = true;
    this.Image = true;
  }
  compressorImageCancel() {
    this.enableImage = true;
    this.Image = false;
    this.CancelImage = false;

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



  getPredictedList() {
    this.screwWithPrediction = [];
    this.http.get<any>('api/ScrewCompressureAPI/GetPrediction', this.headers)
      .subscribe(res => {
        if (res.length > 0) {
          if (res[0].Prediction != null) {
            this.screwWithPrediction = res;
            this.commonLoadingDirective.showLoading(false, "");
          }
        }
      }, err => {
        this.commonLoadingDirective.showLoading(false, "");
        console.log(err.error);
      });
  }


  getPredictedById(PredictedId) {
    // this.configurationObj = new ScrewCompressorPredictionModel();
    this.showNotification("")
    this.http.get<any>('api/ScrewCompressureAPI/GetPredictionById?PredictedId=' + PredictedId, this.headers)
      .subscribe(res => {
        //this.configurationObj = res;
        if (res.Prediction != "") {
          this.showNotification(res.Prediction)
          this.commonLoadingDirective.showLoading(false, "");
        }
      }, err => {
        this.commonLoadingDirective.showLoading(false, "");
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
      this.commonLoadingDirective.showLoading(true, "Please wait to get the predicted values....");
      this.http.post<any>('api/ScrewCompressureAPI/Prediction', JSON.stringify(XLSX.utils.sheet_to_json(worksheet, { raw: true })), this.headers)
        .subscribe(res => {
        }, err => {
          // this.loading = false;
          //this.commonLoadingDirective.showLoading(false, "");
          console.log(err.error);
        });
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

  ChangeToBulkPrediction() {
    if (!this.showBulkPrediction) {
      this.configurationObj = new ScrewCompressorPredictionModel();
      this.showNotification("")
      this.showBulkPrediction = true;
      this.commonLoadingDirective.showLoading(true, "Please wait to get the predicted values....");
      this.PridictedId = 0;
    } else {
      this.configurationObj = new ScrewCompressorPredictionModel();
      this.showNotification("")
      this.showBulkPrediction = false;
      this.PridictedId = 0;
    }
  }

  Prediction() {
    //  if (this.configurationObj) {
    this.configurationObj.Prediction = "";
    this.configurationObj.PredictionId = 0;
    this.configurationObj.UserId = "";
    this.commonLoadingDirective.showLoading(true, "Please wait to get the predicted values....");
    this.configurationObj.InsertedDate = moment().format("YYYY-MM-DD");
    this.http.post<any>('api/ScrewCompressureAPI/PredictionObj', this.configurationObj, this.headers)
      .subscribe(res => {
        this.configurationObj = res;
        this.PridictedId = res.PredictionId;
      }, err => {
        this.commonLoadingDirective.showLoading(false, "");
        console.log(err.error);
      });

  }

  exportToExcel() {
    const dataArray = this.screwWithPrediction
    if (dataArray != 0) {
      const dataArrayList = dataArray.map(obj => {
        const { PredictionId, BatchId, TenantId, InsertedDate, ...rest } = obj;
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
      this.messageService.add({ severity: 'info', detail: 'Excel Downloaded Successfully', sticky: true });

    } else {
      this.messageService.add({ severity: 'warn', detail: 'No Records are Found to Download in Excel', sticky: true });
    }

  }


  // convert Json to CSV data in Angular2
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
