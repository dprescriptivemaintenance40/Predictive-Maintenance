import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Title } from '@angular/platform-browser';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';
import { MessageService } from 'primeng/api';
import { ConfigService } from 'src/app/shared/config.service';
import { SCConstantsAPI } from '../shared/ScrewCompressorAPI.service';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';
import { ProfileConstantAPI } from 'src/app/home/profile/profileAPI.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-train',
  templateUrl: './train.component.html',
  styleUrls: ['./train.component.scss'],
  providers: [MessageService]
})
export class TrainComponent implements OnInit {

  public fileName = 'ExcelSheet.xlsx'
  public CompDetailList: any;
  public compListWithClassification: any = [];
  public customer: any = [];
  public file: File
  public filelist: any
  public arrayBuffer: any
  public compDetail: any
  public loading: boolean = false;
  public first = 0;
  public rows = 10000;
  public progress: number;
  public message: string;
  public Image = false;
  public enableImage = true;
  public CancelImage = false;
  public failureModeType: string = "RD";
  displayModal: boolean;
  displayBasic: boolean;

  public classificationDetails: any = []
  public user: any = [];
  public companyDetail: any = []
  public TagNumber: string = "";
  public EquipmentType: string = "";
  public Date = new Date();
  public DOA = new Date();
  public ACC: string;
  public AFP: string;
  public RK: any = "L/M/H= M | HSECES= Y | CRIT= II";
  public DAB: any;

  public incipient: number = 0;
  public degrade: number = 0;
  public normal: number = 0;

  public AFPincipient: number = 0;
  public AFPdegrade: number = 0;
  public AFPnormal: number = 0;

  public FinalAFPincipient: number = 0;
  public FinalAFPdegrade: number = 0;
  public FinalAFPnormal: number = 0;

  public totalCount: number = 0;
  public AFPtotalCount: number = 0;
  public FinalAFPTotalCount: number = 0;

  public incipientPerentage: number = 0
  public degradePercentage: number = 0
  public normalpercentage: number = 0
  public PerformanceNumber: any = 0

  public AFPincipientPerentage: number = 0
  public AFPdegradePercentage: number = 0
  public AFPnormalpercentage: number = 0

  public finalPerformanceNumber: number = 0
  public finalACCCalculation: number = 0;
  public FinalAFCCalcuation: number = 0;
  public screwWithPredictionDetails: any = [];
  public AFPVisible: boolean = false;
  public AFPNotVisible: boolean = false;
  public Focalname: string = ""
  public TagList: any = [];
  public Firstname: string = ""
  public Lastname: string = ""
  public Company: string = ""
  public Email: string = ""
  public PhoneNumber: string = ""
  public TrainDataNormalCount: any = [];
  public TrainDataIncipientCount: any = [];
  public TrainDataDegradeCount: any = [];
  public TrainDataBadCount: any = [];
  public ScrewCompressorAllData: any;
  public classi: any = [];
  public Degradecount: number = 0;
  public Normalcount: number = 0;
  public Incipientcount: number = 0;
  public badcount: number = 0;
  public buttonvisible: boolean = false;
  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  public UserDetails: any = []

  constructor(public http: HttpClient,
    public title: Title,
    public messageService: MessageService,
    public commonLoadingDirective: CommonLoadingDirective,
    private configService: ConfigService,
    private screwCompressorAPIName: SCConstantsAPI,
    private profileAPIName: ProfileConstantAPI,
    private router: Router,
    private screwCompressorMethod: CommonBLService) {
  }


  ngOnInit() {
    this.title.setTitle('Screw Train | Dynamic Prescriptive Maintenence');
    this.getScrewCompressureList();
    this.getUserDetails();
    this.GenerateReport()
    this.GetAllRecords()
    this.GetPredictionRecords()
  }

  showModalDialog() {
    this.displayModal = true;
  }
  GotoPrediction() {
    this.router.navigateByUrl('/Home/Compressor/ScrewPrediction');
  }
  showBasicDialog() {
    this.displayBasic = true;
  }

  getUserDetails() {
    this.UserDetails = JSON.parse(localStorage.getItem('userObject'));
    this.Firstname = JSON.parse(localStorage.getItem('userObject')).FirstName
    this.Lastname = JSON.parse(localStorage.getItem('userObject')).LastName
    this.Company = JSON.parse(localStorage.getItem('userObject')).Company
    this.Email = JSON.parse(localStorage.getItem('userObject')).Email
    this.PhoneNumber = JSON.parse(localStorage.getItem('userObject')).PhoneNumber
  }

  SelectFailureModeType() {
    this.getScrewCompressureList();
  }

  getScrewCompressureList() {
    this.compListWithClassification = [];
    this.loading = true;
    const params = new HttpParams()
      .set('type', this.failureModeType)
    const url: string = this.screwCompressorAPIName.getTrainList
    this.screwCompressorMethod.getWithParameters(url, params)
      // this.http.get<any>("api/ScrewCompressureAPI")
      .subscribe((res: any) => {
        if (res.length > 0) {
          this.compListWithClassification = res;
          console.log(this.compListWithClassification);
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
  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.compListWithClassification ? this.first === (this.compListWithClassification.length - this.rows) : true;
  }

  isFirstPage(): boolean {
    return this.compListWithClassification ? this.first === 0 : true;
  }


  upload(event) {
    if (event.length === 0)
      return;
    const file = event.target.files[0];
    var formData: FormData = new FormData();
    formData.append('files', file);
    const url: string = this.screwCompressorAPIName.UploadCSV
    this.screwCompressorMethod.postWithoutHeaders(url, formData).subscribe(
      // this.http.post('api/ScrewCompressureAPI/UploadCSV', formData).subscribe(
      res =>
        alert(res)

    );

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
      this.CompDetailList = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      this.loading = true;
      this.commonLoadingDirective.showLoading(true, "Please wait to get the uploaded rules....");
      if (this.failureModeType === "RD") {
        const url: string = this.screwCompressorAPIName.TrainAddData;
        this.screwCompressorMethod.postWithHeaders(url, this.CompDetailList)
          .subscribe(async res => {
            await this.http.get(`${this.configService.getApi('RULE_ENGINE_URL')}UserId=${this.UserDetails.UserId}`, { responseType: 'text' })
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
      } else if (this.failureModeType === "SSRB") {
        this.screwCompressorMethod.postWithHeaders(this.screwCompressorAPIName.TrainAddDataSSRB, this.CompDetailList)
          .subscribe(res => {
            this.getScrewCompressureList();
          },
            err => { console.log(err.error); })
      } else if (this.failureModeType === "CF") {
        this.screwCompressorMethod.postWithHeaders(this.screwCompressorAPIName.TrainAddDataCoolerFailure, this.CompDetailList)
          .subscribe(res => {
            this.getScrewCompressureList();
          },
            err => { console.log(err.error); })
      }
    }
  }

  ChangeInConfiguration() {
    if (this.compListWithClassification.length > 0) {
      var Data = 123;
      //this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Wait for some time ', sticky: true });
      this.commonLoadingDirective.showLoading(true, "Please wait to get the configured rules....");
      this.loading = true;
      const url: string = this.screwCompressorAPIName.ChangeInConfiguration;
      this.screwCompressorMethod.postWithoutHeaders(url, Data)
        // this.http.post("api/ScrewCompressureAPI/ConfigurationChange", Data)
        .subscribe(async res => {
          await this.http.get(`${this.configService.getApi('RULE_ENGINE_URL')}UserId=${this.UserDetails.UserId}`, { responseType: 'text' })
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
        });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'No values are present to revaluate, upload the file first !!!', sticky: true });
    }

  }


  Downloadfile() {
    let link = document.createElement("a");
    link.download = "Excel_Format";
    link.href = "dist/DPM/assets/Excel_Format.xlsx";
    link.click();
  }



  exportToExcel() {
    var dataArray: any = [];
    dataArray = this.compListWithClassification
    if (this.failureModeType === "CF") {
      var list: any = [];
      this.compListWithClassification.forEach(element => {
        let obj = {}
        obj['InsertedDate'] = element.InsertedDate;
        obj['T1'] = element.TS1;
        obj['T2'] = element.TD1;
        obj['Classification'] = element.Classification;
        list.push(obj);
      });
      dataArray = [];
      dataArray = list;
    }
    if (dataArray.length != 0) {
      const dataArrayList = dataArray.map(obj => {
        const { CompClassID, BatchId, TenantId, ClassificationId, ...rest } = obj;
        return rest;
      })

      var csvData = this.ConvertToCSV(dataArrayList);
      var a = document.createElement("a");
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      var blob = new Blob([csvData], { type: 'text/csv' });
      var url = window.URL.createObjectURL(blob);
      a.href = url;
      // var x = new Date();
      var link: string = "DPMTrain" + '.csv';
      a.download = link.toLocaleLowerCase();
      a.click();
      this.messageService.add({ severity: 'info', detail: 'Excel Downloaded Successfully', sticky: true });

    } else {
      this.messageService.add({ severity: 'warn', detail: 'No Records are Found to Download in Excel', sticky: true });
    }
  }

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
  imgDowd() {
    let link = document.createElement("a");
    link.download = "Compressor Image";
    link.href = "src/assets/img/compressor.PNG";
    link.click();
  }

  compressorImage() {
    this.enableImage = false;
    this.CancelImage = true;
    this.Image = true;
  }
  compressorImageCancel() {
    this.enableImage = true;
    this.Image = false;
    this.CancelImage = false;

  }


  GenerateReport() {
    var countKey = Object.keys(this.classificationDetails).length;
    this.totalCount = countKey
    var uniqueNames = [];
    var uniqueObj = [];

    for (var i = 0; i < this.classificationDetails.length; i++) {
      if (uniqueNames.indexOf(this.classificationDetails[i].Classification) === -1) {
        uniqueObj.push(this.classificationDetails[i])
        uniqueNames.push(this.classificationDetails[i].Classification);
      }
    }
    var result: any = [];

    if (this.classificationDetails != 0) {

      this.classificationDetails.forEach(function (o) {
        Object.keys(o).forEach(function (k) {
          result[k] = result[k] || {};
          result[k][o[k]] = (result[k][o[k]] || 0) + 1;
        });
      });
      this.incipient = result.Classification.incipient;
      if (this.incipient == undefined) {
        this.incipient = 0;
      }
      this.degrade = result.Classification.degrade;
      if (this.degrade == undefined) {
        this.degrade = 0;
      }
      this.normal = result.Classification.normal;
      if (this.normal == undefined) {
        this.normal = 0;
      }

      this.normalpercentage = this.normal / this.totalCount * 100
      this.incipientPerentage = this.incipient / this.totalCount * 100
      this.degradePercentage = this.degrade / this.totalCount * 100


      var ACCCalculation: any = [((this.normalpercentage / 100) * 1) + ((this.incipientPerentage / 100) * 5) + ((this.degradePercentage / 100) * 10)];
      console.log(ACCCalculation);

      if (ACCCalculation == NaN) {
        ACCCalculation = 0;
      }

      this.finalACCCalculation = parseFloat(ACCCalculation);



    }

    // AssestForecastPerformance = AFP
    var AFPcountKey = Object.keys(this.screwWithPredictionDetails).length;
    console.log(AFPcountKey);// find number of length of json object
    this.AFPtotalCount = AFPcountKey
    var AFPuniqueNames = [];
    var AFPuniqueObj = [];

    for (var i = 0; i < this.screwWithPredictionDetails.length; i++) {
      if (AFPuniqueNames.indexOf(this.screwWithPredictionDetails[i].Classification) === -1) {
        AFPuniqueObj.push(this.screwWithPredictionDetails[i])
        AFPuniqueNames.push(this.screwWithPredictionDetails[i].Classification);
      }
    }
    var result: any = [];
    if (this.screwWithPredictionDetails.length != 0) {
      this.screwWithPredictionDetails.forEach(function (o) {
        Object.keys(o).forEach(function (k) {
          result[k] = result[k] || {};
          result[k][o[k]] = (result[k][o[k]] || 0) + 1;
        });
      });

      this.AFPincipient = result.Prediction.incipient;
      if (this.AFPincipient == undefined) {
        this.AFPincipient = 0;
      }
      this.AFPdegrade = result.Prediction.degrade;
      if (this.AFPdegrade == undefined) {
        this.AFPdegrade = 0;
      }
      this.AFPnormal = result.Prediction.normal;
      if (this.AFPnormal == undefined) {
        this.AFPnormal = 0;
      }
      this.FinalAFPnormal = (this.AFPnormal + this.normal);
      this.FinalAFPincipient = (this.AFPincipient + this.incipient);
      this.FinalAFPdegrade = (this.AFPdegrade + this.degrade);

      this.FinalAFPTotalCount = this.totalCount + this.AFPtotalCount
      this.AFPnormalpercentage = (this.FinalAFPnormal / this.FinalAFPTotalCount * 100)

      this.AFPincipientPerentage = (this.FinalAFPincipient / this.FinalAFPTotalCount * 100)

      this.AFPdegradePercentage = (this.FinalAFPdegrade / this.FinalAFPTotalCount * 100)

      var AFCCalcuation: any = [((this.AFPnormalpercentage / 100) * 1) + ((this.AFPincipientPerentage / 100) * 5) + ((this.AFPdegradePercentage / 100) * 10)];

      this.FinalAFCCalcuation = parseFloat(AFCCalcuation);
      console.log(this.FinalAFCCalcuation);
      if (AFCCalcuation == NaN) {
        this.FinalAFCCalcuation = 0;
      }
      this.messageService.add({ severity: 'success', summary: 'success', detail: ' To Download Report, Click Download Report Button ' });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Prediction have not done yet, Asset Forecast will not Generate ' });
    }
    var LMH: any = [(0 * 1) + (1 * 5) + (0 * 10)]
    console.log(LMH)
    var HSECES: any = [(0 * 1) + (1 * 10)]
    console.log(HSECES)
    var CRIT: any = [(0 * 10) + (1 * 5) + (0 * 1)]
    console.log(CRIT)

    this.PerformanceNumber = [this.finalACCCalculation + this.FinalAFCCalcuation +
      parseFloat(LMH) + parseFloat(HSECES)
      + parseFloat(CRIT)];

    this.finalPerformanceNumber = parseFloat(this.PerformanceNumber);
    if (this.PerformanceNumber > 10) {
      this.DAB = "Y"
    } else {
      this.DAB = "N"
    }
  }

  GetPredictionRecords() {
    const url2: string = this.screwCompressorAPIName.getPredictedList;
    this.screwCompressorMethod.getWithoutParameters(url2)
      .subscribe(res => {
        this.screwWithPredictionDetails = res;
        if (this.screwWithPredictionDetails.length == 0) {
          this.buttonvisible = true;
          this.AFPNotVisible = true;
          this.AFPVisible = false;
          this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Still You have not done Prediction. Do Prediction & Generate Report', sticky: true });
          this.commonLoadingDirective.showLoading(false, '');
        } else {
          this.AFPNotVisible = false;
          this.AFPVisible = true;
          this.commonLoadingDirective.showLoading(false, '');
        }
      }, err => {
        this.commonLoadingDirective.showLoading(false, '');
        console.log(err.error);
      });


  }

  GetAllRecords() {
    this.TrainDataNormalCount = null;
    this.TrainDataIncipientCount = null;
    this.TrainDataDegradeCount = null;
    var normalCount: any = [];
    var normalValuation: number = 0;
    var incipientCount: any = [];
    var incipientValuation: number = 0;
    var degradeCount: any = [];
    var degradeValuation: number = 0;

    this.screwCompressorMethod.getWithoutParameters(this.profileAPIName.GetAllRecords)
      .subscribe(
        res => {
          this.ScrewCompressorAllData = res;
          this.ScrewCompressorAllData.forEach(element => {
            this.classi.push(element.Classification);
          });

          this.classi.forEach((value) => {
            if (value == 'normal') {
              normalValuation = normalValuation + 1;
              normalCount.push(normalValuation);
              incipientCount.push(incipientValuation);
              degradeCount.push(degradeValuation)

            } else if (value == 'incipient') {
              incipientValuation = incipientValuation + 1;
              incipientCount.push(incipientValuation);
              normalCount.push(normalValuation);
              degradeCount.push(degradeValuation)

            } else {
              degradeValuation = degradeValuation + 1;
              degradeCount.push(degradeValuation)
              normalCount.push(normalValuation);
              incipientCount.push(incipientValuation);

            }
            this.TrainDataNormalCount = normalCount;
            this.TrainDataIncipientCount = incipientCount;
            this.TrainDataDegradeCount = degradeCount;

          });
          for (var i = 0; i < this.ScrewCompressorAllData.length; i++) {
            if (this.classi[i] == "degarde" || this.classi[i] == "degrade") {
              this.Degradecount = this.Degradecount + 1
            } else if (this.classi[i] == "incipient") {
              this.Incipientcount = this.Incipientcount + 1
            } else if (this.classi[i] == "normal") {
              this.Normalcount = this.Normalcount + 1
            } else
              this.badcount = this.badcount + 1

          }
          this.normalpercentage = ((this.Degradecount / this.ScrewCompressorAllData.length) * 100)
          this.incipientPerentage = ((this.Incipientcount / this.ScrewCompressorAllData.length) * 100)
          this.degradePercentage = ((this.Normalcount / this.ScrewCompressorAllData.length) * 100)

        }, error => {
          console.log(error.error)
        }
      )
  }

}
