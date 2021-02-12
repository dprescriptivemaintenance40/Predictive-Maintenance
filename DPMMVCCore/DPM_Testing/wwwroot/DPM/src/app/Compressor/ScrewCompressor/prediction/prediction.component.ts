import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';
import * as XLSX from 'xlsx';
import { ScrewCompressorPredictionModel } from '../configuration/screw-compressor-prediction.model';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment.prod';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.scss'],
  providers: [MessageService, DatePipe]
})
export class PredictionComponent implements OnInit {

  public showBulkPrediction: boolean = false;
  public file: any;
  public configurationObj: ScrewCompressorPredictionModel = new ScrewCompressorPredictionModel();
  public configurationObjList: any = [];
  public futurePrediction: string = "Pending";
  public dofuturePredictionDisabled: boolean = true;
  public futurePredictionList: any = [];
  public futurePredictionDatesList: any = [];
  public SelectedDateFromList: any = [];
  public futurePredictionDate: any = [];
  public futurePredictionDataTableList: any = [];
  public futurePredictionDatesToShow: any = ["After One Day", "After a week", "After 15 Days", "After 30 Days"];
  public notification = null
  public fileName = 'ExcelSheet.xlsx'
  public testingList: any;
  public screwWithPrediction: any = [];
  public customer: any = [];
  // public file: File
  public filelist: any
  public arrayBuffer: any
  public compDetail: any
  public loading: boolean = false;
  public first = 0;
  public rows = 10000;
  public PridictedId: number = 0;
  public Image = false;
  public enableImage = true;
  public CancelImage = false;
  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }


  constructor(public title: Title,
    public http: HttpClient,
    public messageService: MessageService,
    public commonLoadingDirective: CommonLoadingDirective,
    public datepipe: DatePipe) { }


  ngOnInit() {
    this.title.setTitle('DPM | Screw Prediction');
    this.ChangeToBulkPrediction();
    this.getFuturePredictionRecords();
    this.showNotification('');
    this.getPredictedList();
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
    this.commonLoadingDirective.showLoading(true, "Please wait to get the predicted values....");
    this.http.get<any>('api/ScrewCompressureAPI/GetPrediction', this.headers)
      .subscribe(res => {
        this.screwWithPrediction = res;
        this.commonLoadingDirective.showLoading(false, "");
      }, err => {
        this.commonLoadingDirective.showLoading(false, "");
        console.log(err.error);
      });
  }

  getPredictedById(PredictedId) {
    this.showNotification("")
    this.http.get<any>('api/ScrewCompressureAPI/GetPredictionById?PredictedId=' + PredictedId, this.headers)
      .subscribe(res => {
        this.showNotification(res.Prediction)
        this.commonLoadingDirective.showLoading(false, "");
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
      var workbook = XLSX.read(bstr, { type: "binary", cellDates: true });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      this.commonLoadingDirective.showLoading(true, "Please wait to get the predicted values....");
      this.http.post<any>('api/ScrewCompressureAPI/Prediction', JSON.stringify(XLSX.utils.sheet_to_json(worksheet, { raw: true })), this.headers)
        .subscribe(async res => {
          await this.http.get(`${environment.prediction}name=prediction`, { responseType: 'text' })
            .subscribe(res => {
              this.getPredictedList();
              this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Process is completed' });
            }, err => {
              console.log(err.error);
              this.commonLoadingDirective.showLoading(false, "");
            })
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
      this.getPredictedList();
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
      .subscribe(async res => {
        this.configurationObj = res;
        this.PridictedId = res.PredictionId;
        await this.http.get(`${environment.prediction}name=prediction`, { responseType: 'text' })
          .subscribe(res => {
            this.getPredictedById(this.PridictedId);
            this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Process is completed' });
          }, err => {
            console.log(err.error);
            this.commonLoadingDirective.showLoading(false, "");
          })
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

  FuturePrediction() {
    this.futurePredictionDate = "";
    this.futurePredictionDataTableList = [];
    this.commonLoadingDirective.showLoading(true, "Please wait until future prediction to be done...");
    this.http.get<any>('api/ScrewCompressorFuturePredictionAPI/FuturePredictionMovingAverage')
      .subscribe(async res => {
        if (res === 1) {
          await this.http.get(`${environment.prediction}name=futureprediction`, { responseType: 'text' })
            .subscribe(res => {
              this.getFuturePredictionRecords();
              this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Process is completed' });
            }, err => {
              console.log(err.error);
              this.commonLoadingDirective.showLoading(false, "");
            })
        } else {
          this.commonLoadingDirective.showLoading(false, "");
        }
      });
  }


  getFuturePredictionRecords() {
    this.commonLoadingDirective.showLoading(true, "Fetching Records...");
    this.http.get<any>('api/ScrewCompressorFuturePredictionAPI/GetFuturePredictionRecords').subscribe(
      res => {
        this.futurePredictionList = res;
        var Dates: any = [];
        if (res.length > 0) {
          this.futurePredictionList.forEach(element => {
            this.futurePredictionDatesList.push(this.datepipe.transform(element.PredictedDate, 'dd/MM/YYYY'));

          });
        }
        var abc = this.futurePredictionDatesList[20];
        var pqr = moment(abc, 'dd MM YYYY').add(5, 'days')
        console.log(pqr);

        this.commonLoadingDirective.showLoading(false, " ");
      }, err => {
        this.commonLoadingDirective.showLoading(false, " ");
      }
    )
  }

  FuturePredictionDates() {

    if (this.futurePredictionDate == 'After One Day') {
      this.dofuturePredictionDisabled = true;
      this.commonLoadingDirective.showLoading(true, "Fetching Records...");
      var AfterDays = this.futurePredictionDatesList[0];
      const params = new HttpParams()
        .set('FromDate', moment(this.futurePredictionDatesList[0], 'DD/MM/YYYY').format('YYYY-MM-DD'))
        .set('ToDate', moment(this.futurePredictionDatesList[0], 'DD/MM/YYYY').format('YYYY-MM-DD'));
      this.http.get('api/ScrewCompressorFuturePredictionAPI/FuturePredictionMonth', { params })
        .subscribe(
          res => {
            this.futurePredictionDataTableList = null;
            this.futurePredictionDataTableList = res;
            if (this.futurePredictionDataTableList[0].length > 0) {
              this.dofuturePredictionDisabled = true;
            } else {
              this.dofuturePredictionDisabled = false;
            }
            this.commonLoadingDirective.showLoading(false, "");
          }, err => {
            this.messageService.add({ severity: 'warn', detail: 'Something went wrong please try again later', sticky: true });

            this.commonLoadingDirective.showLoading(false, "");
          }
        )
    } else if (this.futurePredictionDate == 'After a week') {

      this.commonLoadingDirective.showLoading(true, "Fetching Records...");
      const params = new HttpParams()
        .set('FromDate', moment(this.futurePredictionDatesList[0], 'DD/MM/YYYY').format('YYYY-MM-DD'))
        .set('ToDate', moment(this.futurePredictionDatesList[6], 'DD/MM/YYYY').format('YYYY-MM-DD'));
      this.http.get('api/ScrewCompressorFuturePredictionAPI/FuturePredictionMonth', { params })
        .subscribe(
          res => {
            this.futurePredictionDataTableList = null;
            this.futurePredictionDataTableList = res;
            if (this.futurePredictionDataTableList[0].length > 0) {
              this.dofuturePredictionDisabled = true;
            } else {
              this.dofuturePredictionDisabled = false;
            }
            this.commonLoadingDirective.showLoading(false, " ");
          }, err => {
            this.messageService.add({ severity: 'warn', detail: 'Something went wrong please try again later', sticky: true });

            this.commonLoadingDirective.showLoading(false, " ");
          }
        )
    } else if (this.futurePredictionDate == 'After 15 Days') {

      this.commonLoadingDirective.showLoading(true, "Fetching Records...");
      const params = new HttpParams()
        .set('FromDate', moment(this.futurePredictionDatesList[0], 'DD/MM/YYYY').format('YYYY-MM-DD'))
        .set('ToDate', moment(this.futurePredictionDatesList[14], 'DD/MM/YYYY').format('YYYY-MM-DD'));
      this.http.get('api/ScrewCompressorFuturePredictionAPI/FuturePredictionMonth', { params })
        .subscribe(
          res => {
            this.futurePredictionDataTableList = null;
            this.futurePredictionDataTableList = res;
            if (this.futurePredictionDataTableList[0].length > 0) {
              this.dofuturePredictionDisabled = true;
            } else {
              this.dofuturePredictionDisabled = false;
            }
            this.commonLoadingDirective.showLoading(false, " ");
          }, err => {
            this.messageService.add({ severity: 'warn', detail: 'Something went wrong please try again later', sticky: true });

            this.commonLoadingDirective.showLoading(false, " ");
          }
        )

    } else if (this.futurePredictionDate == 'After 30 Days') {
      this.commonLoadingDirective.showLoading(true, "Fetching Records...  ");
      const params = new HttpParams()
        .set('FromDate', moment(this.futurePredictionDatesList[0], 'DD/MM/YYYY').format('YYYY-MM-DD'))
        .set('ToDate', moment(this.futurePredictionDatesList[this.futurePredictionDatesList.length - 1], 'DD/MM/YYYY').format('YYYY-MM-DD'));
      this.http.get('api/ScrewCompressorFuturePredictionAPI/FuturePredictionMonth', { params })
        .subscribe(
          res => {
            this.futurePredictionDataTableList = null;
            this.futurePredictionDataTableList = res;
            if (this.futurePredictionDataTableList[0].length > 0) {
              this.dofuturePredictionDisabled = true;
            } else {
              this.dofuturePredictionDisabled = false;
            }
            this.commonLoadingDirective.showLoading(false, " ");
          }, err => {
            this.messageService.add({ severity: 'warn', detail: 'Something went wrong please try again later', sticky: true });

            this.commonLoadingDirective.showLoading(false, " ");
          }
        )
    }
    else {
      this.futurePredictionDataTableList = [];

    }
  }



}
