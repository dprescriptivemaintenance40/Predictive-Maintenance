import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Title } from '@angular/platform-browser';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';

@Component({
  selector: 'app-moderate-data-collection',
  templateUrl: './moderate-data-collection.component.html',
  styleUrls: ['./moderate-data-collection.component.scss']
})
export class ModerateDataCollectionComponent implements OnInit {

  public UploadCompDetailList: any = [];
  public MinedSensorData : any = [] ;
  public RawData : boolean = true;
  public SensorData : boolean = false;
  public loading:boolean = false;

  constructor(public http: HttpClient,
    public title: Title,
    public commonLoadingDirective: CommonLoadingDirective) { }

  ngOnInit() {
    this.title.setTitle('Screw Compressor Moderate Data | Dynamic Prescriptive Maintenence');
    this.getMininedSensorData();
    this.getRawSensorData();
  }

  GetRawData(){
    this.RawData = true;
    this.SensorData = false;
  }
  GetSensorData(){
    this.RawData = false;
    this.SensorData = true;
  }
//   addfile(event) {
//     var file : any = event.target.files[0];
//     var fileReader = new FileReader();
//     fileReader.readAsArrayBuffer(file);
//     fileReader.onload = (e) => {
//       var arrayBuffer : any = fileReader.result;
//       var data = new Uint8Array(arrayBuffer);
//       var arr = new Array();
//       for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
//       var bstr = arr.join("");
//       var workbook = XLSX.read(bstr, { type: "binary", cellDates: true });
//       var first_sheet_name = workbook.SheetNames[0];
//       var worksheet = workbook.Sheets[first_sheet_name];
//       console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
//       this.UploadCompDetailList = XLSX.utils.sheet_to_json(worksheet, { raw: true });
       
// }
//   }


  getRawSensorData(){
    this.loading = true;
    //this.commonLoadingDirective.showLoading(true, "Please wait");
    this.http.get('dist/DPM/assets/RawDataFile.xlsx',{responseType:'blob'}).subscribe(
      (res : any) => {
        let fileReader = new FileReader();
                fileReader.readAsArrayBuffer(res);
                fileReader.onload = async (e) => {
                    var arrayBuffer: any = fileReader.result;
                    var data = new Uint8Array(arrayBuffer);
                    var arr = new Array();
                    for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
                    var bstr = arr.join("");
                    var workbook = XLSX.read(bstr, { type: "binary", cellDates: true });
                    var first_sheet_name = workbook.SheetNames[0];
                    var worksheet = workbook.Sheets[first_sheet_name];
                    this.UploadCompDetailList = await XLSX.utils.sheet_to_json(worksheet, { raw: true });
                   // this.commonLoadingDirective.showLoading(false, "");
                   this.loading = false;
                }
      }
    )
  }


  getMininedSensorData(){
    this.commonLoadingDirective.showLoading(true, "");
    this.http.get('dist/DPM/assets/RawMinedData.xlsx',{responseType:'blob'}).subscribe(
      (res : any) => {
        let fileReader = new FileReader();
                fileReader.readAsArrayBuffer(res);
                fileReader.onload = async (e) => {
                    var arrayBuffer: any = fileReader.result;
                    var data = new Uint8Array(arrayBuffer);
                    var arr = new Array();
                    for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
                    var bstr = arr.join("");
                    var workbook = XLSX.read(bstr, { type: "binary", cellDates: true });
                    var first_sheet_name = workbook.SheetNames[0];
                    var worksheet = workbook.Sheets[first_sheet_name];
                    this.MinedSensorData = await XLSX.utils.sheet_to_json(worksheet, { raw: true });
                    this.commonLoadingDirective.showLoading(false, "");
                }
      }
    )
  }


}

