import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { HttpClient, HttpRequest, HttpHeaders, HttpEventType, HttpResponse } from '@angular/common/http'
import { Title } from '@angular/platform-browser';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-train',
  templateUrl: './train.component.html',
  styleUrls: ['./train.component.scss'],
  providers: [MessageService]
})
export class TrainComponent implements OnInit {

  private fileName = 'ExcelSheet.xlsx'
  private CompDetailList: any;
  private compListWithClassification: any = [];
  private customer: any = [];
  private file: File
  private filelist: any
  private arrayBuffer: any
  private compDetail: any
  private loading: boolean = false;
  private first = 0;
  private rows = 10000;
  public progress: number;
  public message: string;
  private Image=false;
  private enableImage =true;
  private CancelImage=false;
  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }


  constructor(private http: HttpClient,
    private title: Title,
    private messageService: MessageService,
    private commonLoadingDirective: CommonLoadingDirective) { }


  ngOnInit() {
    this.title.setTitle('DPM | Screw Train');

    setInterval(() => {
      this.getScrewCompressureList();
    }, 10000);
  }
  getScrewCompressureList() {
    this.compListWithClassification = [];
    this.http.get<any>("api/ScrewCompressureAPI")
      .subscribe(res => {
        if (res.length > 0) {
          this.compListWithClassification = res;
          console.log(this.compListWithClassification);
          this.commonLoadingDirective.showLoading(false, "");
        }
      }, err => {
        console.log(err.error);
        this.commonLoadingDirective.showLoading(false, "");
        // this.loading = false;
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
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
      this.CompDetailList = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      console.log(this.filelist);
      this.loading = true;
      this.commonLoadingDirective.showLoading(true, "Please wait to get the configured rules....");
      this.http.post<any>('api/ScrewCompressureAPI/Configuration', JSON.stringify(this.CompDetailList), this.headers)
        .subscribe(res => {
          //this.compListWithClassification = res;
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
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Wait for some time ', sticky: true });
      this.commonLoadingDirective.showLoading(true, "Please wait to get the configured rules....");
      this.http.post("api/ScrewCompressureAPI/ConfigurationChange", Data).subscribe(
        res => console.log(res)

      )

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
  imgDowd(){
    let link = document.createElement("a");
    link.download = "Compressor Image";
    link.href = "src/assets/img/compressor.PNG";
    link.click();
  }

  compressorImage(){
    this.enableImage=false;
    this.CancelImage=true;
    this.Image=true;
  }
  compressorImageCancel(){
    this.enableImage=true;
    this.Image=false;
    this.CancelImage=false;
    
  }

}
