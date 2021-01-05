import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Header } from 'primeng/api';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-train',
  templateUrl: './train.component.html',
  styleUrls: ['./train.component.scss']
})
export class TrainComponent implements OnInit {

  constructor(private http: HttpClient,
    private title: Title) { }

  first = 0;

  rows = 10000;
  ngOnInit() {
    this.title.setTitle('DPM/ScrewTrain');

    setInterval(() => {
      this.getScrewCompressureList();
    }, 5000);
  }
  getScrewCompressureList() {
    this.loading = true;
    this.http.get<any>("api/ScrewCompressureAPI")
      .subscribe(res => {
        this.compListWithClassification = res;
        console.log(this.compListWithClassification);
        this.loading = false;
      }, err => {
        console.log(err.error);
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



  fileName = 'ExcelSheet.xlsx'
  CompDetailList: any;
  compListWithClassification: any = [];
  customer: any = [];
  file: File
  filelist: any
  arrayBuffer: any
  compDetail: any
  private loading: boolean = false;
  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  // classification=false;
  // withoutClassification=false;
  // getClassification=true

  // GetClassification(){
  //   this.classification=true;
  //   this.withoutClassification=true;
  //   this.getClassification=false
  // }

  // WithoutClassification(){
  //   this.getClassification=true
  //   this.classification=false;
  //   this.withoutClassification=false;
  // }

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
      //  this.CompDetailList = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      //this.compListWithClassification= this.CompDetailList;
      //  this.compDetail= arraylist
      //	this this.CompDetailList=    this.filelist;    
      console.log(this.filelist);



      this.loading = true;
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


  Downloadfile() {
    let link = document.createElement("a");
    link.download = "Excel_Format";
    link.href = "DPM/dist/DPM/assets/Excel_Format.xlsx";
    link.click();
  }
  exportToExcel() {

    let element = document.getElementById('exportexcel');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }

  ChangeInConfiguration(){
    var Data = 123
    this.http.post("api/ScrewCompressureAPI/ConfigurationChange",Data).subscribe(
      res=>console.log(res)
    )
  }
}
