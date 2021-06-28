import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';
import * as XLSX from 'xlsx';
import { MessageService } from 'primeng/api';
import { ConfigService } from 'src/app/shared/config.service';
import { SCConstantsAPI } from '../shared/ScrewCompressorAPI.service';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';


@Component({
  selector: 'app-screw-compressor-predictiondata-upload',
  templateUrl: './screw-compressor-predictiondata-upload.component.html',
  styleUrls: ['./screw-compressor-predictiondata-upload.component.scss']
})
export class ScrewCompressorPredictiondataUploadComponent implements OnInit {

  public fileName = 'ExcelSheet.xlsx';
  public file: File
  public filelist: any
  public arrayBuffer: any
  public loading: boolean = false;
  public UploadcentrifugalPumpDetailList: any;
  public UploadcentrifugalPumpWithPrediction: any = [];

  constructor(public title: Title,
    public http: HttpClient,
    public messageService: MessageService,
    public commonLoadingDirective: CommonLoadingDirective,
    private screwCompressorAPIName : SCConstantsAPI,
    private screwCompressorMethod : CommonBLService) { }

  ngOnInit() {
  }

  async addfile(event) {
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
      var url : string =  this.screwCompressorAPIName.PredictionData;
      this.screwCompressorMethod.postWithHeaders(url, XLSX.utils.sheet_to_json(worksheet, { raw: true }))
      .subscribe(async res => {
        this.UploadcentrifugalPumpWithPrediction = res;

        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Process is completed' });
      }, err => {
        console.log(err.error);
        this.commonLoadingDirective.showLoading(false, "");
      })
    this.loading = false;  
   }
  }
}
