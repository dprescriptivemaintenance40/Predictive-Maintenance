import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';
import { PumpConfigService } from 'src/app/shared/PumpConfigService.service';
import * as XLSX from 'xlsx';
import { CentrifugalPumpConstantAPI } from '../centrifugal-pump.API';
@Component({
  selector: 'app-centrifugal-pump-train',
  templateUrl: './centrifugal-pump-train.component.html',
  styleUrls: ['./centrifugal-pump-train.component.scss']
})
export class CentrifugalPumpTrainComponent implements OnInit {
  public fileName = 'ExcelSheet.xlsx';
  public file: File
  public filelist: any
  public arrayBuffer: any
  public loading: boolean = false;
  public CompDetailList: any;
  public pumpListWithClassification: any = [];
  public UserDetails : any = []

  constructor(public http: HttpClient,
    public title: Title,
    public messageService: MessageService,
    public commonLoadingDirective: CommonLoadingDirective,
    private CentrifugalPumpName: CentrifugalPumpConstantAPI,
    private CentrifugalPumpMethod: CommonBLService,
    private CentrifugalPumpconfigService: PumpConfigService,) { }

  ngOnInit(): void {
    this.title.setTitle('CentrifugalPump Train | Dynamic Prescriptive Maintenence');
    this.getScrewCompressureList();
    this.getUserDetails();
  }

  getUserDetails(){
    this.UserDetails = JSON.parse(localStorage.getItem('userObject'));
  }
  getScrewCompressureList() {
    this.pumpListWithClassification = [];
    this.loading = true;
    const url : string = this.CentrifugalPumpName.getCentrifugalPumpTrainList
    this.CentrifugalPumpMethod.getWithoutParameters(url)
      .subscribe((res: any) => {
        if (res.length > 0) {
          this.pumpListWithClassification = res;
          console.log(this.pumpListWithClassification);
          this.commonLoadingDirective.showLoading(false, "");

        }
        this.loading = false;
      }, err => {
        console.log(err.error);
        this.commonLoadingDirective.showLoading(false, "");
        this.loading = false;
      }
      )
  }
  upload(event) {
    if (event.length === 0)
      return;
    const file = event.target.files[0];
    var formData: FormData = new FormData();
    formData.append('files', file);
    const url : string = this.CentrifugalPumpName.UploadCSV
    this.CentrifugalPumpMethod.postWithoutHeaders(url, formData).subscribe(
      res =>
        alert(res)

    );

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
      this.CompDetailList = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      this.loading = true;
      this.commonLoadingDirective.showLoading(true, "Please wait to get the uploaded rules....");
      const url : string = this.CentrifugalPumpName.CentrifugalPumpTrainAddData;
      this.CentrifugalPumpMethod.postWithHeaders(url, this.CompDetailList)
        .subscribe(async res => {
          await this.http.get(`${this.CentrifugalPumpconfigService.getApi('RULE_ENGINE_URL')}name=${this.UserDetails.UserId}`, { responseType: 'text' })
            .subscribe(res => {
              this.getScrewCompressureList();
              this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Process is completed' });
            }, err => {
              console.log(err.error);
              this.commonLoadingDirective.showLoading(false, "");
            })
          this.loading = false;
        }, err => {
          this.loading = false;
          console.log(err.error);
        }
        );
    }
  }

  exportToExcel() {
    // const dataArray = this.pumpListWithClassification
    // if (dataArray != 0) {
    //   const dataArrayList = dataArray.map(obj => {
    //     const { CompClassID, BatchId, TenantId, ClassificationId, InsertedDate, ...rest } = obj;
    //     return rest;
    //   })

    //   var csvData = this.ConvertToCSV(dataArrayList);
    //   var a = document.createElement("a");
    //   a.setAttribute('style', 'display:none;');
    //   document.body.appendChild(a);
    //   var blob = new Blob([csvData], { type: 'text/csv' });
    //   var url = window.URL.createObjectURL(blob);
    //   a.href = url;
    //   // var x = new Date();
    //   var link: string = "DPMCentrifugalPumpTrain" + '.csv';
    //   a.download = link.toLocaleLowerCase();
    //   a.click();
    //   this.messageService.add({ severity: 'info', detail: 'Excel Downloaded Successfully'});

    // } else {
    //   this.messageService.add({ severity: 'warn', detail: 'No Records are Found to Download in Excel' });
    // }
  }

  ConvertToCSV(objArray) {
    // var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    // var str = '';
    // var row = "";

    // for (var index in objArray[0]) {
    //   //Now convert each value to string and comma-separated
    //   row += index + ',';
    // }
    // row = row.slice(0, -1);
    // //append Label row with line break
    // str += row + '\r\n';

    // for (var i = 0; i < array.length; i++) {
    //   var line = '';
    //   for (var index in array[i]) {
    //     if (line != '') line += ','

    //     line += array[i][index];
    //   }
    //   str += line + '\r\n';
    // }
    // return str;
  }

  // ChangeInConfiguration() {
  //   if (this.pumpListWithClassification.length > 0) {
  //     var Data = 123;
  //     this.commonLoadingDirective.showLoading(true, "Please wait to get the configured rules....");
  //     this.loading = true;
  //     const url : string = this.CentrifugalPumpName.ChangeInConfiguration;
  //     this.CentrifugalPumpMethod.postWithoutHeaders(url, Data)
  //       .subscribe(async res => {
  //         await this.http.get(`${this.CentrifugalPumpconfigService.getApi('RULE_ENGINE_URL')}name=dpm`, { responseType: 'text' })
  //           .subscribe(res => {
  //             this.getScrewCompressureList();
  //             this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Process is completed' });
  //           }, err => {
  //             console.log(err.error);
  //             this.commonLoadingDirective.showLoading(false, "");
  //           })
  //         this.loading = false;
  //       }, err => {
  //         this.loading = false;
  //         console.log(err.error);
  //       });
  //   } else {
  //     this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'No values are present to revaluate, upload the file first !!!', sticky: true });
  //   }

  // }


  Downloadfile() {
    let link = document.createElement("a");
    link.download = "Excel_Format";
    link.href = "dist/DPM/assets/PumpExcel_Format.xlsx";
    link.click();
  }

}
