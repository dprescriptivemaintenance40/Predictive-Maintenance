import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelFormatService {

  constructor() { }

  GetExcelFormat(Data:any, Name:string){
    var content = '';
    content +=
      '<tr>'
    Data.forEach(header => {
      content += '<th style="font-weight:bold;">' + header + '</th>'
    });
    content += '</tr>';

    var s = document.createElement("table");
    s.innerHTML = content;

    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(s);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, Name);
    XLSX.writeFile(wb, Name + '.xlsx');

  }
}
