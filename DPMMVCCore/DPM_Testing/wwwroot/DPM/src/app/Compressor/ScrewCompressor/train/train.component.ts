import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Title } from '@angular/platform-browser';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';
import { MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment.prod'
import * as moment from 'moment';
@Component({
  selector: 'app-train',
  templateUrl: './train.component.html',
  styleUrls: ['./train.component.scss'],
  providers: [MessageService]
})
export class TrainComponent implements OnInit {

  public fileName = 'ExcelSheet.xlsx'
  public CompDetailList: any;
  public compListWithClassification: any = [];
  public customer: any = [];
  public file: File
  public filelist: any
  public arrayBuffer: any
  public compDetail: any
  public loading: boolean = false;
  public first = 0;
  public rows = 10000;
  public progress: number;
  public message: string;
  public Image = false;
  public enableImage = true;
  public CancelImage = false;
  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }


  constructor(public http: HttpClient,
    public title: Title,
    public messageService: MessageService,
    public commonLoadingDirective: CommonLoadingDirective) { }


  ngOnInit() {
    this.title.setTitle('DPM | Screw Train');
    this.getScrewCompressureList();
    // setInterval(() => {
    //   this.getScrewCompressureList();
    // }, 10000);
  }
  getScrewCompressureList() {
    this.compListWithClassification = [];
    this.loading = true;
    this.http.get<any>("api/ScrewCompressureAPI")
      .subscribe(res => {
        if (res.length > 0) {
          this.compListWithClassification = res;
          console.log(this.compListWithClassification);
          this.commonLoadingDirective.showLoading(false, "");

        }
        this.loading = false;
      }, err => {
        console.log(err.error);
        this.commonLoadingDirective.showLoading(false, "");
        this.loading = false;
      }
      )
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
    return this.compListWithClassification ? this.first === (this.compListWithClassification.length - this.rows) : true;
  }

  isFirstPage(): boolean {
    return this.compListWithClassification ? this.first === 0 : true;
  }


  upload(event) {
    if (event.length === 0)
      return;
    const file = event.target.files[0];
    var formData: FormData = new FormData();
    formData.append('files', file);
    this.http.post('api/ScrewCompressureAPI/UploadCSV', formData).subscribe(
      res =>
        alert(res)

    );

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
      this.CompDetailList = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      this.loading = true;
      this.commonLoadingDirective.showLoading(true, "Please wait to get the uploaded rules....");
      this.http.post<any>('api/ScrewCompressureAPI/Configuration', JSON.stringify(this.CompDetailList), this.headers)
        .subscribe(async res => {
          await this.http.get(`${environment.ruleengineurl}name=dpm`, { responseType: 'text' })
            .subscribe(res => {
              this.getScrewCompressureList();
              this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Process is completed' });
            }, err => {
              console.log(err.error);
              this.commonLoadingDirective.showLoading(false, "");
            })
          this.loading = false;
        }, err => {
          this.loading = false;
          console.log(err.error);
        }
        );
    }
  }



  ChangeInConfiguration() {

    if (this.compListWithClassification.length > 0) {
      var Data = 123;
      //this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Wait for some time ', sticky: true });
      this.commonLoadingDirective.showLoading(true, "Please wait to get the configured rules....");
      this.loading = true;
      this.http.post("api/ScrewCompressureAPI/ConfigurationChange", Data)
        .subscribe(async res => {
          await this.http.get(`${environment.ruleengineurl}name=dpm`, { responseType: 'text' })
            .subscribe(res => {
              this.getScrewCompressureList();
              this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Process is completed' });
            }, err => {
              console.log(err.error);
              this.commonLoadingDirective.showLoading(false, "");
            })
          this.loading = false;
        }, err => {
          this.loading = false;
          console.log(err.error);
        });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'No values are present to revaluate, upload the file first !!!', sticky: true });
    }

  }


  Downloadfile() {
    let link = document.createElement("a");
    link.download = "Excel_Format";
    link.href = "dist/DPM/assets/Excel_Format.xlsx";
    link.click();
  }


  // exportToExcel() {


  //   let element = document.getElementById('exportexcel');
  //   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  //   /* save to file */
  //   XLSX.writeFile(wb, this.fileName);
  // }



  exportToExcel() {
    const dataArray = this.compListWithClassification
    if (dataArray != 0) {
      const dataArrayList = dataArray.map(obj => {
        const { CompClassID, BatchId, TenantId, ClassificationId, InsertedDate, ...rest } = obj;
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
      var link: string = "DPMTrain" + '.csv';
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

}
