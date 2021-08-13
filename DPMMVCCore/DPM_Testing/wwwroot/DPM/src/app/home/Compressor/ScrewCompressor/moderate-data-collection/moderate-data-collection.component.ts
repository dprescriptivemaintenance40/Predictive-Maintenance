import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-moderate-data-collection',
  templateUrl: './moderate-data-collection.component.html',
  styleUrls: ['./moderate-data-collection.component.scss']
})
export class ModerateDataCollectionComponent implements OnInit {

  public UploadCompDetailList: any;

  constructor(public http: HttpClient,
    public title: Title) { }

  ngOnInit() {
    this.title.setTitle('Screw Compressor Moderate Data | Dynamic Prescriptive Maintenence');
  }

  addfile(event) {
    var file : any = event.target.files[0];
    var fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = (e) => {
      var arrayBuffer : any = fileReader.result;
      var data = new Uint8Array(arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary", cellDates: true });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
      this.UploadCompDetailList = XLSX.utils.sheet_to_json(worksheet, { raw: true });
       
}
  }

}

