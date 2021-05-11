import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';
import { MessageService } from 'primeng/api';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { ExcelFormatService } from '../../Services/excel-format.service';
import { HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { CentrifugalPumpConstantAPI } from './centrifugal-pump.API';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';

@Component({
  selector: 'app-centrifugal-pump',
  templateUrl: './centrifugal-pump.component.html',
  styleUrls: ['./centrifugal-pump.component.scss'],
  providers: [MessageService, DatePipe]
})
export class CentrifugalPumpComponent implements OnInit {
  public FromDate: string = "";
  public uniqueDates: any = [];
  public ToDate: string = "";
  public dropDownData: any = [];
  public fileName = 'ExcelSheet.xlsx';
  public centrifugalPump: any = [];
  public centrifugalPumpList: any = [];
  public centrifugalPumpWeekdata: any = [];
  public centrifugalPumpWeekList: any = [];
  public loading: boolean = false;
  public first = 0;
  public rows = 10000;
  public file: File;
  public filelist: any;
  public arrayBuffer: any;
  public user: any = [];
  public DailyWeekMode : string;
  public CentrifugalPumpDailyData : boolean = true;
  public CentrifugalPumpWeekData : boolean = false;
  private pumpcolumns: any = [
    'TagNumber',
    'PI025',
    'PI022',
    'PI023',
    'PI027',
    'PE203',
    'TI061',
    'TI062',
    'TI263',
    'Date'
  ]

  public centrifugalPumpColumns: any = [
    { field: 'TagNumber', header: 'Tag Number', width: '8em' },
    { field: 'PI025', header: 'PI025', width: '7em' },
    { field: 'PI022', header: 'PI022', width: '7em' },
    { field: 'PI023', header: 'PI023', width: '7em' },
    { field: 'PI027', header: 'PI027', width: '7em' },
    { field: 'PE203', header: 'PE203', width: '7em' },
    { field: 'TI061', header: 'TI061', width: '7em' },
    { field: 'TI062', header: 'TI062', width: '7em' },
    { field: 'TI263', header: 'TI263', width: '7em' },
    { field: 'Date', header: 'Date', width: '10em' },
  ]

  private pumpWeekDatacolumns: any = [
    'TagNumber',
    'OneH',
    'OneV',
    'TwoH',
    'TwoV',
    'TwoA',
    'ThreeH',
    'ThreeV',
    'ThreeA',
    'FourH',
    'FourV',
    'OneT',
    'TwoT',
    'ThreeT',
    'FourT',
    'AMP',
    'Date'
  ]
  public centrifugalPumpColumnsWeekData: any = [
    { field: 'TagNumber', header: 'Tag Number', width: '8em' },
    { field: 'OneH', header: 'OneH', width: '7em' },
    { field: 'OneV', header: 'OneV', width: '7em' },
    { field: 'TwoH', header: 'TwoH', width: '7em' },
    { field: 'TwoV', header: 'TwoV', width: '7em' },
    { field: 'TwoA', header: 'TwoA', width: '7em' },
    { field: 'ThreeH', header: 'ThreeH', width: '7em' },
    { field: 'ThreeV', header: 'ThreeV', width: '7em' },
    { field: 'ThreeA', header: 'ThreeA', width: '7em' },
    { field: 'FourH', header: 'FourH', width: '7em' },
    { field: 'FourV', header: 'FourV', width: '7em' },
    { field: 'OneT', header: 'OneT', width: '7em' },
    { field: 'TwoT', header: 'TwoT', width: '7em' },
    { field: 'ThreeT', header: 'ThreeT', width: '7em' },
    { field: 'FourT', header: 'FourT', width: '7em' },
    { field: 'AMP', header: 'AMP', width: '7em' },
    { field: 'Date', header: 'Date', width: '10em' },
  ]

  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(public http: HttpClient,
    public title: Title,
    public messageService: MessageService,
    public datepipe: DatePipe,
    private excelFormatService : ExcelFormatService,
    public commonLoadingDirective: CommonLoadingDirective,
    private CPAPIName : CentrifugalPumpConstantAPI,
    private CPAPIMethod : CommonBLService) {
    if (localStorage.getItem('userObject') != null) {
      this.user = JSON.parse(localStorage.getItem('userObject'))
    }
  }

  ngOnInit() {
    this.title.setTitle('DPM | Centrifugal Pump');
   this.GetDailyData()
  }
GetDailyData(){
  const url : string = this.CPAPIName.DailyData;
  this.CPAPIMethod.getWithoutParameters(url)
 // this.http.get<any>('api/CenterifugalPumpAPI/GetCentrifugalPumpDailyData')
  .subscribe(res => {
    this.centrifugalPump = res
   this.UniqueDate( this.centrifugalPump)

  })
}

  PostCentrifugalPumpDailydata(obj){
    this.commonLoadingDirective.showLoading(true, "Please wait....");
    this.loading = true;
    const url : string = this.CPAPIName.PostCentrifugalPumpDailydata;
    this.CPAPIMethod.postWithHeaders(url, obj)
   // this.http.post<any>('api/CenterifugalPumpAPI/PostCentrifugalPumpDailyData', JSON.stringify(obj), this.headers)
    .subscribe(res => {
      this.centrifugalPump = res
      this.commonLoadingDirective.showLoading(false, "");
      this.loading = false;
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Process is completed' });
    }, err => {
      console.log(err.error);
      this.loading = false;
      this.commonLoadingDirective.showLoading(false, "");
    })
  }


  PostCentrifugalPumpWeekdata(obj){
    this.commonLoadingDirective.showLoading(true, "Please wait....");
    this.loading = true;
    const url :string = this.CPAPIName.PostCentrifugalPumpWeekdata;
    this.CPAPIMethod.postWithHeaders(url, obj)
   // this.http.post<any>('api/CenterifugalPumpAPI/PostCentrifugalPumpWeekData', JSON.stringify(obj),this.headers)
    .subscribe(
      res =>{ 
        this.centrifugalPumpWeekList = res
        this.loading = false;
        this.commonLoadingDirective.showLoading(false, "");
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Process is completed' });
      }
    )
  }

  GetCentrifugalPumpWeekdata(){
    const url : string = this.CPAPIName.GetCentrifugalPumpWeekdata;
    this.CPAPIMethod.getWithoutParameters(url)
   // this.http.get<any>('api/CenterifugalPumpAPI/GetCentrifugalPumpWeekData')
    .subscribe(
      res =>{ 
        this.centrifugalPumpWeekList = res
       var weekDate = this.UniqueDate(this.centrifugalPumpWeekList)
      }
    )
  }
  Downloadfile() {  
    if(this.DailyWeekMode.length == 0){
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Please Select Daily or week mode' });
    }else if(this.DailyWeekMode =='daily'){
      var Name = 'PumpDaily_data'
      this.excelFormatService.GetExcelFormat(this.pumpcolumns , Name)
  }else if(this.DailyWeekMode == 'week'){
    var Name = 'PumpWeek_data'
    this.excelFormatService.GetExcelFormat(this.pumpWeekDatacolumns , Name) 
  } 
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
      this.centrifugalPumpList = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      if(this.DailyWeekMode.length == 0){
          this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Please Select Daily or week mode', sticky: true });
      }else if(this.DailyWeekMode == 'daily'){
        this.PostCentrifugalPumpDailydata(this.centrifugalPumpList )
      }else if(this.DailyWeekMode == 'week'){
        this.PostCentrifugalPumpWeekdata(this.centrifugalPumpList )
      }
    }
  }

  exportToExcel() {
    var dataArray
    var Name
    if(this.DailyWeekMode == 'daily'){
      dataArray = this.centrifugalPump
      Name = "DPMCentrifugalPumpDailyData"
    }else if(this.DailyWeekMode == 'week'){
      dataArray = this.centrifugalPumpWeekList
      Name = "DPMCentrifugalPumpWeekData"
    }
    if (dataArray != 0) {
      const dataArrayList = dataArray.map(obj => {
        const { CentrifugalPumpId, UserId, InsertedDate,CPWId,...rest } = obj;
        return rest;
      })
      var csvData = this.ConvertToCSV(dataArrayList);
      var a = document.createElement("a");
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      var blob = new Blob([csvData], { type: 'text/csv' });
      var url = window.URL.createObjectURL(blob);
      a.href = url;
      var link: string = Name + '.csv';
      a.download = link.toLocaleLowerCase();
      a.click();
      this.messageService.add({ severity: 'info', detail: 'Excel Downloaded Successfully' });
    } else {
      this.messageService.add({ severity: 'warn', detail: 'No Records are Found to Download in Excel' });
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

  ChooseData(d){ 
    if(this.DailyWeekMode == 'daily'){
      this.CentrifugalPumpDailyData =true;
      this.CentrifugalPumpWeekData =false;
      this.GetDailyData();
     console.log("daily");   
    }else if(this.DailyWeekMode == 'week'){
      this.CentrifugalPumpDailyData =false;
      this.CentrifugalPumpWeekData =true;
      this.GetCentrifugalPumpWeekdata();
      console.log("week");
    }
  }
  

  UniqueDate(a){
    this.uniqueDates = null;
    this.uniqueDates = []
    for (var i = 0; i < a.length; i++) {
      if (this.uniqueDates.indexOf(a[i].Date) === -1) {
       var date = this.datepipe.transform(a[i].Date, 'dd-MM-yyyy')
        this.uniqueDates.push(date);
      }
    }
  }
 
  GetCentrifugapPumpUniqueDate(e) {
    if(this.DailyWeekMode == 'daily'){
      const params = new HttpParams()
            .set("FromDate",this.FromDate )
            .set("ToDate",this.ToDate)
      const url : string = this.CPAPIName.GetDailyDates;
      this.CPAPIMethod.getWithParameters(url, params) 
     // this.http.get('api/CenterifugalPumpAPI/GetDailyDates',{params})
      .subscribe(res =>{
          console.log(res)
          this.centrifugalPump = res
         
      })
    }else if (this.DailyWeekMode == 'week'){
      const params = new HttpParams()
            .set( "FromDate",this.FromDate )
            .set(  "ToDate",this.ToDate)
      const url : string = this.CPAPIName.GetWeekDates;
      this.CPAPIMethod.getWithParameters(url, params)
     // this.http.get('api/CenterifugalPumpAPI/GetWeekDates',{params})
      .subscribe(res =>{
          console.log(res)
          this.centrifugalPumpWeekList =res  
      })
    }
  }
}
