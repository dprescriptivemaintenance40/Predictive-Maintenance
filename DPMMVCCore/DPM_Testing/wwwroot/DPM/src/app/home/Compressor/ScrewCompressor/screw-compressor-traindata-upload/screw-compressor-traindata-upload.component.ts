import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Title } from '@angular/platform-browser';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';
import { MessageService } from 'primeng/api';
import { ConfigService } from 'src/app/shared/config.service';
import { SCConstantsAPI } from '../shared/ScrewCompressorAPI.service';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';

@Component({
  selector: 'app-screw-compressor-traindata-upload',
  templateUrl: './screw-compressor-traindata-upload.component.html',
  styleUrls: ['./screw-compressor-traindata-upload.component.scss']
})
export class ScrewCompressorTraindataUploadComponent implements OnInit {

  public fileName = 'ExcelSheet.xlsx';
  public file: File
  public filelist: any
  public arrayBuffer: any
  public loading: boolean = false;
  public uploadpumpListWithClassification: any = [];
  public UploadCompDetailList: any;

  constructor(public http: HttpClient,
    public title: Title,
    public messageService: MessageService,
    public commonLoadingDirective: CommonLoadingDirective,
    private configService: ConfigService,
    private screwCompressorAPIName : SCConstantsAPI,
    private screwCompressorMethod : CommonBLService) { }

  ngOnInit() {
    this.title.setTitle('Screw Train Upload Train Data | Dynamic Prescriptive Maintenence');
  }

  addfile(event) {
    this.file = event.target.files[0];
    var fileReader = new FileReader();
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
      this.UploadCompDetailList = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      this.loading = true;
      this.commonLoadingDirective.showLoading(true, "Please wait to get the uploaded rules....");
      const url : string = this.screwCompressorAPIName.TrainAddData;
      this.screwCompressorMethod.postWithHeaders(url, this.UploadCompDetailList)
      .subscribe(async res => {
        this.uploadpumpListWithClassification = res;
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Process is completed' });
      }, err => {
        console.log(err.error);
        this.commonLoadingDirective.showLoading(false, "");
      })
    this.loading = false;  
}
  }

}
