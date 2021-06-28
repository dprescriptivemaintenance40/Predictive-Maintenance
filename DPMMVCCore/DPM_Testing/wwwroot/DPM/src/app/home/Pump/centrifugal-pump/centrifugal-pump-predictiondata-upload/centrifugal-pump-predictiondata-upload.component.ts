import { HttpClient,HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';
import { MessageService } from 'primeng/api';
import { CentrifugalPumpConstantAPI } from '../centrifugal-pump.API';
import * as XLSX from 'xlsx';
import { ConfigService } from 'src/app/shared/config.service';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';
@Component({
  selector: 'app-centrifugal-pump-predictiondata-upload',
  templateUrl: './centrifugal-pump-predictiondata-upload.component.html',
  styleUrls: ['./centrifugal-pump-predictiondata-upload.component.scss']
})
export class CentrifugalPumpPredictiondataUploadComponent implements OnInit {
  public fileName = 'ExcelSheet.xlsx';
  public file: File
  public filelist: any
  public arrayBuffer: any
  public loading: boolean = false;
  public UploadcentrifugalPumpDetailList: any;
  public UploadcentrifugalPumpWithPrediction: any = [];
 

  constructor(public http: HttpClient,
    public title: Title,
    public messageService: MessageService,
    private configService: ConfigService,
    private CentrifugalPumpPredictionName: CentrifugalPumpConstantAPI,
    private CentrifugalPumpPredictionMethod: CommonBLService,
    public commonLoadingDirective: CommonLoadingDirective,
   ) { }

  ngOnInit() {
    this.title.setTitle('CentrifugalPump Upload Prediction Data | Dynamic Prescriptive Maintenence');
  }

  async addfile(event) {
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
      this.UploadcentrifugalPumpDetailList = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      this.loading = true;
      const url : string = this.CentrifugalPumpPredictionName.CentrifugalPumpPredictionAddData;
      this.CentrifugalPumpPredictionMethod.postWithHeaders(url, this.UploadcentrifugalPumpDetailList)
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
