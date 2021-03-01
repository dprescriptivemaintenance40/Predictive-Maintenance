import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';
import { MessageService } from 'primeng/api';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-centrifugal-pump',
  templateUrl: './centrifugal-pump.component.html',
  styleUrls: ['./centrifugal-pump.component.scss'],
  providers: [MessageService]
})
export class CentrifugalPumpComponent implements OnInit {
  public fileName = 'ExcelSheet.xlsx';
  public centrifugalPump: any = [];
  public centrifugalPumpList: any = [];
  public loading: boolean = false;
  public first = 0;
  public rows = 10000;
  public file: File;
  public filelist: any;
  public arrayBuffer: any;
  public user: any = [];
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

  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(public http: HttpClient,
    public title: Title,
    public messageService: MessageService,
    public commonLoadingDirective: CommonLoadingDirective) {
    if (localStorage.getItem('userObject') != null) {
      this.user = JSON.parse(localStorage.getItem('userObject'))
    }
  }

  ngOnInit() {
    this.title.setTitle('DPM | Centrifugal Pump');
    this.http.get<any>('api/CenterifugalPumpAPI').subscribe(res => {
      this.centrifugalPump = res

    })
  }

  Downloadfile() {
    var content = '';
    content +=
      '<tr>'
    this.pumpcolumns.forEach(header => {
      content += '<th style="font-weight:bold;">' + header + '</th>'
    });
    content += '</tr>';

    var s = document.createElement("table");
    s.innerHTML = content;

    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(s);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Pump_data');
    XLSX.writeFile(wb, 'Pump_data' + '.xlsx');
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
      this.loading = true;
      this.commonLoadingDirective.showLoading(true, "Please wait to get the uploaded rules....");
      this.http.post<any>('api/CenterifugalPumpAPI', JSON.stringify(this.centrifugalPumpList), this.headers)
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
  }



  exportToExcel() {
    const dataArray = this.centrifugalPump
    if (dataArray != 0) {
      const dataArrayList = dataArray.map(obj => {
        const { CentrifugalPumpId, UserId, InsertedDate, ...rest } = obj;
        return rest;
      })

      var csvData = this.ConvertToCSV(dataArrayList);
      var a = document.createElement("a");
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      var blob = new Blob([csvData], { type: 'text/csv' });
      var url = window.URL.createObjectURL(blob);
      a.href = url;
      var link: string = "DPMCentrifugalPump" + '.csv';
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
}
