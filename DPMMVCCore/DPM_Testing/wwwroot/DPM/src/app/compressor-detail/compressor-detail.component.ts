import { Component, OnInit } from '@angular/core';
 import* as XLSX from 'xlsx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Header } from 'primeng/api';
@Component({
  selector: 'app-compressor-detail',
  templateUrl: './compressor-detail.component.html',
  styleUrls: ['./compressor-detail.component.scss']
})
export class CompressorDetailComponent {

  ngOnInit(){
    this.http.get<any>("api/CompressureDetailsAPI").subscribe(
      res=>{this.compListWithClassification=res, console.log(this.compListWithClassification)}, error => console.log(error)
    )
   
    
  }
  
  constructor(private http: HttpClient) { }
   
  fileName='ExcelSheet.xlsx'
  CompDetailList: any;
  compListWithClassification: any = [];
  customer:any =[];
  file: File
  filelist: any
  arrayBuffer: any
  compDetail: any
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
       this.CompDetailList = XLSX.utils.sheet_to_json(worksheet,{raw:true});  
      this.CompDetailList = XLSX.utils.sheet_to_json(worksheet, { raw: true });
    //this.compListWithClassification= this.CompDetailList;
      //  this.compDetail= arraylist
      //	this this.CompDetailList=    this.filelist;    
      console.log(this.filelist);




      this.http.post<any>('api/CompressureDetailsAPI', JSON.stringify(this.CompDetailList), this.headers)
        .subscribe(res => {
          this.compListWithClassification = res;
        }, err => {
          
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
  exportToExcel(){
    
    let element = document.getElementById('exportexcel'); 
   const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
   const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

       /* save to file */
      XLSX.writeFile(wb, this.fileName);
  }

}


