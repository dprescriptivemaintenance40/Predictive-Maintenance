import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';
import * as XLSX from 'xlsx';
import { ScrewCompressorPredictionModel } from '../configuration/screw-compressor-prediction.model';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { ConfigService } from 'src/app/shared/config.service';
import { SCConstantsAPI } from '../shared/ScrewCompressorAPI.service';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';
import { ProfileConstantAPI } from 'src/app/home/profile/profileAPI.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.scss'],
  providers: [MessageService, DatePipe]
})
export class PredictionComponent implements OnInit {
 display: boolean = false;

    showDialog() {
        this.display = true;
  };
  public showBulkPrediction: boolean = false;
  public file: any;
  public configurationObj: ScrewCompressorPredictionModel = new ScrewCompressorPredictionModel();
  public configurationObjList: any = [];
  public futurePrediction: string = "Pending";
  public dofuturePredictionDisabled: boolean = true;
  public futurePredictionList: any = [];
  public futurePredictionDatesList: any = [];
  public SelectedDateFromList: any = [];
  public futurePredictionDate: any = [];
  public futurePredictionDataTableList: any = [];
  public futurePredictionDatesToShow: any = ["After One Day", "After a week", "After 15 Days", "After 30 Days"];
  public notification = null
  public fileName = 'ExcelSheet.xlsx'
  public testingList: any;
  public screwWithPrediction: any = [];
  public customer: any = [];
  public filelist: any
  public arrayBuffer: any
  public compDetail: any
  public loading: boolean = false;
  public first = 0;
  public rows = 10000;
  public PridictedId: number = 0;
  public Image = false;
  public enableImage = true;
  public CancelImage = false;

  displayModal: boolean;
  displayBasic: boolean;
  public RecommendationAlertMessage : string = "";
  public RecommendationAlertEnable : boolean = false;
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
  public Focalname:string =""
  public TagList : any = [];
  public Firstname:string =""
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
  public buttonvisible:boolean = false;
  public PredictionDataNormalCount: any = [];
public PredictionDataIncipientCount: any = [];
public PredictonDataDegradeCount: any = [];
public PredictionDataBadCount: any = [];
public ScrewPredictionAllData: any;
public PredictionDegradecount: number = 0;
public PredictionNormalcount: number = 0;
public PredictionIncipientcount: number = 0;
public Predictionbadcount: number = 0;
  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  private UserDetails: any = []
  public FromDate: string = ""
  public ToDate: string = ""
  public SingleBulkPredictionName: string = ""
  public FailureModeSelect: string = "SSRB"
  public EquipmentTagNumber : string = "";

  constructor(public title: Title,
    public http: HttpClient,
    public messageService: MessageService,
    public commonLoadingDirective: CommonLoadingDirective,
    public datepipe: DatePipe,
    private router: Router,
    private configService: ConfigService,
    private profileAPIName: ProfileConstantAPI,
    private screwCompressorAPIName: SCConstantsAPI,
    private screwCompressorMethod: CommonBLService) { 
      this.GetRecords();
    }
    public Predictionnav:any 
    public activatedRoute:any 
    
  ngOnInit() {
    this.title.setTitle('Screw Prediction | Dynamic Prescriptive Maintenence');
    this.ChangeToBulkPrediction();
    this.getFuturePredictionRecords();
    this.showNotification('');
    this.getPredictedList();
    this.getUserDetails();
    this.FromDate = moment().format('YYYY-MM-DD');
    this.ToDate = moment().format('YYYY-MM-DD');
    this.GenerateReport()
    this.GetAllRecords()
    this.GetPredictionRecords()
    this.GerAllPredictionRecords()
  
  }
  showModalDialog() {
    this.displayModal = true;
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

  RouteTodashboard(){
     this.router.navigateByUrl('/Home/Dashboard', { state: { PredictionNavigate:1}})
 }
  Downloadfile() {
    let link = document.createElement("a");
    link.download = "Excel_Format";
    link.href = "dist/DPM/assets/Excel_Format.xlsx";
    link.click();
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
    return this.screwWithPrediction ? this.first === (this.screwWithPrediction.length - this.rows) : true;

  }

  isFirstPage(): boolean {
    return this.screwWithPrediction ? this.first === 0 : true;

  }

  getPredictedListRecordsByDate() {
    const params = new HttpParams()
      .set('FromDate', this.FromDate)
      .set('ToDate', this.ToDate)
    this.screwCompressorMethod.getWithParameters(this.screwCompressorAPIName.getPredictedListByDate, params)
      .subscribe(
        (res: any) => {
          this.screwWithPrediction = res;
        }, err => { console.log(err.error) }
      )
  }

  getPredictedList() {
    this.screwWithPrediction = [];
    this.commonLoadingDirective.showLoading(true, "Please wait to get the predicted values....");
    var url: string = this.screwCompressorAPIName.getPredictedList;
    this.screwCompressorMethod.getWithoutParameters(url)
      //  this.http.get<any>('api/ScrewCompressureAPI/GetPrediction', this.headers)
      .subscribe(res => {
        this.screwWithPrediction = res;
        var Data : any = []
          Data = res;
          Data.sort((a,b)=>( moment(a.InsertedDate) > moment(b.InsertedDate) ? 1 : -1 ));
          Data.reverse();
          var incipient =0, degrade=0, normal =0;
          var counter : number =0;
          for (let index = 0; index < Data.length; index++) {
            if((Data[index].Prediction).toLowerCase() === 'normal'){
              normal = normal + 1;
            }else if((Data[index].Prediction).toLowerCase() === 'incipient'){
              incipient = incipient + 1;
            }else if((Data[index].Prediction).toLowerCase() === 'degrade' || (Data[index].Prediction).toLowerCase() === 'degarde'){
              degrade = degrade + 1;
            }
            counter = counter + 1;
            if(counter > 97){
               if(degrade > 6){
                this.RecommendationAlertMessage = 'Machine starts degrading, RCA is recomended';
                this.RecommendationAlertEnable = true;
              }else if(incipient > 6){
                this.RecommendationAlertMessage ='RCM is recomended';
                this.RecommendationAlertEnable = true;
              }else{
                this.RecommendationAlertEnable = false;
              }
              break;
            }
          }       
        this.commonLoadingDirective.showLoading(false, "");
      }, err => {
        this.commonLoadingDirective.showLoading(false, "");
        console.log(err.error);
      });
  }

  getPredictedById(PredictedId) {
    this.showNotification("")
    const params = new HttpParams()
      .set("PredictedId", PredictedId)
    var url: string = this.screwCompressorAPIName.getPredictionById
    this.screwCompressorMethod.getWithParameters(url, params)
      .subscribe((res: any) => {
        this.showNotification(res.Prediction)
        this.commonLoadingDirective.showLoading(false, "");
      }, err => {
        this.commonLoadingDirective.showLoading(false, "");
        console.log(err.error);
      });
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
      var url: string = this.screwCompressorAPIName.PredictionData;
      const params = new HttpParams()
            .set('tagNumber', this.EquipmentTagNumber)
      this.screwCompressorMethod.postWithoutHeadersWithParameters(url, XLSX.utils.sheet_to_json(worksheet, { raw: true }), params)
        // this.http.post<any>('api/ScrewCompressureAPI/Prediction', JSON.stringify(XLSX.utils.sheet_to_json(worksheet, { raw: true })), this.headers)
        .subscribe(async res => {
          // var TrainList : any = await this.GetTrainDataList();
          // if(TrainList.length >= 15){
          await this.http.get(`${this.configService.getApi('PREDICTION_URL')}UserId=${this.UserDetails.UserId}&name=prediction&type=compressor`, { responseType: 'text' })
            .subscribe(res => {
              this.getPredictedList();
              this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Process is completed' });
            }, err => {
              console.log(err.error);
              this.commonLoadingDirective.showLoading(false, "");
            })
          // }else{
          //   this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'For prediction you should have minimum 20 records in train' }); 
          //   this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'Prediction cannot be done' });      
          // }

        }, err => {
          // this.loading = false;
          //this.commonLoadingDirective.showLoading(false, "");
          console.log(err.error);
        });
    }
  }



  showNotification(category) {
    switch (category) {
      case '':
        this.notification = { class: '', message: '' };
        break;
      case 'bad':
        this.notification = { class: 'text-success', message: 'Bad' };
        break;
      case 'normal':
        this.notification = { class: 'text-success', message: 'normal' };
        break;
      case 'incipient':
        this.notification = { class: 'text-primary', message: 'Incipient!' };
        break;
      case 'degrade':
        this.notification = { class: 'text-danger', message: 'Degrade!' };
        break;

      default:
        break;
    }

  }

  ChangeToBulkPrediction() {
    if (!this.showBulkPrediction) {
      this.configurationObj = new ScrewCompressorPredictionModel();
      this.showNotification("")
      this.showBulkPrediction = true;
      this.getPredictedList();
      this.SingleBulkPredictionName = "Single Prediction"
      this.PridictedId = 0;
    } else {
      this.configurationObj = new ScrewCompressorPredictionModel();
      this.showNotification("")
      this.showBulkPrediction = false;
      this.PridictedId = 0;
      this.SingleBulkPredictionName = "Bulk Prediction"
    }
  }

  async Prediction() {
    //  if (this.configurationObj) {
    this.configurationObj.Prediction = "";
    this.configurationObj.PredictionId = 0;
    this.configurationObj.UserId = "";
    this.commonLoadingDirective.showLoading(true, "Please wait to get the predicted values....");
    this.configurationObj.InsertedDate = moment().format("YYYY-MM-DD");
    var url: string = this.screwCompressorAPIName.Prediction
    this.screwCompressorMethod.postWithoutHeaders(url, this.configurationObj)
      // this.http.post<any>('api/ScrewCompressureAPI/PredictionObj', this.configurationObj, this.headers)
      .subscribe(async (res: any) => {
        this.configurationObj = res;
        this.PridictedId = res.PredictionId;
        var UserId = res.UserId;
        // var TrainList : any = await this.GetTrainDataList();
        // if(TrainList.length >= 20){
        await this.http.get(`${this.configService.getApi('PREDICTION_URL')}UserId=${UserId}&name=prediction&type=compressor`, { responseType: 'text' })
          .subscribe(res => {
            this.getPredictedById(this.PridictedId);
            this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Process is completed' });
          }, err => {
            console.log(err.error);
            this.commonLoadingDirective.showLoading(false, "");
          })
        // }else{
        //   this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'For prediction you should have minimum 20 records in train' }); 
        //   this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'Prediction cannot be done' });      
        // }
      }, err => {
        this.commonLoadingDirective.showLoading(false, "");
        console.log(err.error);
      });

  }

  async GetTrainDataList() {
    return await this.screwCompressorMethod.getWithoutParameters(this.screwCompressorAPIName.getTrainList)
      .toPromise();
  }

  exportToExcel() {
    const dataArray = this.screwWithPrediction
    if (dataArray != 0) {
      const dataArrayList = dataArray.map(obj => {
        const { PredictionId, BatchId, TenantId, ...rest } = obj;
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
      var link: string = "DPMPrediction" + '.csv';
      a.download = link.toLocaleLowerCase();
      a.click();
      this.messageService.add({ severity: 'info', detail: 'Excel Downloaded Successfully', sticky: true });

    } else {
      this.messageService.add({ severity: 'warn', detail: 'No Records are Found to Download in Excel', sticky: true });
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

  FuturePrediction() {
    // this.futurePredictionDate = "";
    // this.futurePredictionDataTableList = [];
    // this.commonLoadingDirective.showLoading(true, "Please wait until future prediction to be done...");
    // var url: string = this.screwCompressorAPIName.FuturePrediction
    // this.screwCompressorMethod.getWithoutParameters(url)
    //   //  this.http.get<any>('api/ScrewCompressorFuturePredictionAPI/FuturePredictionMovingAverage')
    //   .subscribe(async (res: any) => {
    //     if (res.length > 5) {
    //       await this.http.get(`${this.configService.getApi('PREDICTION_URL')}UserId=${this.UserDetails.UserId}&name=futureprediction&type=compressor`, { responseType: 'text' })
    //         .subscribe(res => {
    //           this.getFuturePredictionRecords();
    //           this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Process is completed' });
    //         }, err => {
    //           console.log(err.error);
    //           this.commonLoadingDirective.showLoading(false, "");
    //         });
    //       //logic to hit future prediction
    //     } else if (res.length > 0) {
    //       this.messageService.add({ severity: 'info', summary: 'info', detail: `Need more ${(res.length - 5)} more day's of data to do future prediction on prediction records.` });
    //     } else {
    //       this.messageService.add({ severity: 'info', summary: 'info', detail: 'Please upload data in prediction to do future prediction' });
    //     }
    //   });
      var url: string = this.screwCompressorAPIName.GetScrewCompressorForecastRecords
      this.screwCompressorMethod.getWithoutParameters(url)
      .subscribe(
        async (res : any) => {
            if(res.length === 0){
              await this.http.get(`${this.configService.getApi('PREDICTION_URL')}UserId=${this.UserDetails.UserId}&name=''&type=forecast`, { responseType: 'text' })
            }else{
              this.futurePredictionDataTableList = res;
            }
        }, err =>{console.log(err.error)}
      )
  }


  getFuturePredictionRecords() {
    this.commonLoadingDirective.showLoading(true, "Fetching Records...");
    var url: string = this.screwCompressorAPIName.getFuturePredictionRecords;
    this.screwCompressorMethod.getWithoutParameters(url)
      // this.http.get<any>('api/ScrewCompressorFuturePredictionAPI/GetFuturePredictionRecords')
      .subscribe(
        (res: any) => {
          this.futurePredictionList = res;
          var Dates: any = [];
          if (res.length > 0) {
            this.futurePredictionList.forEach(element => {
              this.futurePredictionDatesList.push(this.datepipe.transform(element.PredictedDate, 'dd/MM/YYYY'));

            });
          }
          var abc = this.futurePredictionDatesList[20];
          var pqr = moment(abc, 'dd MM YYYY').add(5, 'days')
          console.log(pqr);

          this.commonLoadingDirective.showLoading(false, " ");
        }, err => {
          this.commonLoadingDirective.showLoading(false, " ");
        }
      )
  }

  FuturePredictionDates() {

    if (this.futurePredictionDate == 'After One Day') {
      this.dofuturePredictionDisabled = true;
      this.commonLoadingDirective.showLoading(true, "Fetching Records...");
      var AfterDays = this.futurePredictionDatesList[0];
      const params = new HttpParams()
        .set('FromDate', moment(this.futurePredictionDatesList[0], 'DD/MM/YYYY').format('YYYY-MM-DD'))
        .set('ToDate', moment(this.futurePredictionDatesList[0], 'DD/MM/YYYY').format('YYYY-MM-DD'));
      var url: string = this.screwCompressorAPIName.FuturePredictionDates;
      this.screwCompressorMethod.getWithParameters(url, params)
        // this.http.get('api/ScrewCompressorFuturePredictionAPI/FuturePredictionMonth', { params })
        .subscribe(
          res => {
            this.futurePredictionDataTableList = null;
            this.futurePredictionDataTableList = res;
            if (this.futurePredictionDataTableList[0].length > 0) {
              this.dofuturePredictionDisabled = true;
            } else {
              this.dofuturePredictionDisabled = false;
            }
            this.commonLoadingDirective.showLoading(false, "");
          }, err => {
            this.messageService.add({ severity: 'warn', detail: 'Something went wrong please try again later', sticky: true });

            this.commonLoadingDirective.showLoading(false, "");
          }
        )
    } else if (this.futurePredictionDate == 'After a week') {

      this.commonLoadingDirective.showLoading(true, "Fetching Records...");
      const params2 = new HttpParams()
        .set('FromDate', moment(this.futurePredictionDatesList[0], 'DD/MM/YYYY').format('YYYY-MM-DD'))
        .set('ToDate', moment(this.futurePredictionDatesList[6], 'DD/MM/YYYY').format('YYYY-MM-DD'));
      var url2: string = this.screwCompressorAPIName.FuturePredictionDates;
      this.screwCompressorMethod.getWithParameters(url2, params2)
        // this.http.get('api/ScrewCompressorFuturePredictionAPI/FuturePredictionMonth', { params })
        .subscribe(
          res => {
            this.futurePredictionDataTableList = null;
            this.futurePredictionDataTableList = res;
            if (this.futurePredictionDataTableList[0].length > 0) {
              this.dofuturePredictionDisabled = true;
            } else {
              this.dofuturePredictionDisabled = false;
            }
            this.commonLoadingDirective.showLoading(false, " ");
          }, err => {
            this.messageService.add({ severity: 'warn', detail: 'Something went wrong please try again later', sticky: true });

            this.commonLoadingDirective.showLoading(false, " ");
          }
        )
    } else if (this.futurePredictionDate == 'After 15 Days') {

      this.commonLoadingDirective.showLoading(true, "Fetching Records...");
      const params3 = new HttpParams()
        .set('FromDate', moment(this.futurePredictionDatesList[0], 'DD/MM/YYYY').format('YYYY-MM-DD'))
        .set('ToDate', moment(this.futurePredictionDatesList[14], 'DD/MM/YYYY').format('YYYY-MM-DD'));
      var url3: string = this.screwCompressorAPIName.FuturePredictionDates;
      this.screwCompressorMethod.getWithParameters(url3, params3)
        //  this.http.get('api/ScrewCompressorFuturePredictionAPI/FuturePredictionMonth', { params })
        .subscribe(
          res => {
            this.futurePredictionDataTableList = null;
            this.futurePredictionDataTableList = res;
            if (this.futurePredictionDataTableList[0].length > 0) {
              this.dofuturePredictionDisabled = true;
            } else {
              this.dofuturePredictionDisabled = false;
            }
            this.commonLoadingDirective.showLoading(false, " ");
          }, err => {
            this.messageService.add({ severity: 'warn', detail: 'Something went wrong please try again later', sticky: true });

            this.commonLoadingDirective.showLoading(false, " ");
          }
        )

    } else if (this.futurePredictionDate == 'After 30 Days') {
      this.commonLoadingDirective.showLoading(true, "Fetching Records...  ");
      const params4 = new HttpParams()
        .set('FromDate', moment(this.futurePredictionDatesList[0], 'DD/MM/YYYY').format('YYYY-MM-DD'))
        .set('ToDate', moment(this.futurePredictionDatesList[this.futurePredictionDatesList.length - 1], 'DD/MM/YYYY').format('YYYY-MM-DD'));
      var url4: string = this.screwCompressorAPIName.FuturePredictionDates;
      this.screwCompressorMethod.getWithParameters(url4, params4)
        // this.http.get('api/ScrewCompressorFuturePredictionAPI/FuturePredictionMonth', { params })
        .subscribe(
          res => {
            this.futurePredictionDataTableList = null;
            this.futurePredictionDataTableList = res;
            if (this.futurePredictionDataTableList[0].length > 0) {
              this.dofuturePredictionDisabled = true;
            } else {
              this.dofuturePredictionDisabled = false;
            }
            this.commonLoadingDirective.showLoading(false, " ");
          }, err => {
            this.messageService.add({ severity: 'warn', detail: 'Something went wrong please try again later', sticky: true });

            this.commonLoadingDirective.showLoading(false, " ");
          }
        )
    }
    else {
      this.futurePredictionDataTableList = [];

    }
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
      // this.messageService.add({ severity: 'success', summary: 'success', detail: ' To Download Report, Click Download Report Button ' });
    } else {
      // this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Prediction have not done yet, Asset Forecast will not Generate ' });
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
        this.buttonvisible= true;
        this.AFPNotVisible = true;
        this.AFPVisible = false;
        //  this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Still You have not done Prediction. Do Prediction & Generate Report',});
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
  var normalCount: any = [];
  var normalValuation: number = 0;
  var incipientCount: any = [];
  var incipientValuation: number = 0;
  var degradeCount: any = [];
  var degradeValuation: number = 0;

  this.screwCompressorMethod.getWithoutParameters(this.screwCompressorAPIName.GetAllRecords)
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
        this.normalpercentage = ((this.Degradecount/this.ScrewCompressorAllData.length )*100)
        this.incipientPerentage = ((this.Incipientcount/this.ScrewCompressorAllData.length )*100)
        this.degradePercentage = ((this.Normalcount/this.ScrewCompressorAllData.length )*100)
      
      }, error => {
        console.log(error.error)
      }
    )
}

GetRecords() {
  this.commonLoadingDirective.showLoading(true, 'Report is getting generated.');
  const url: string = this.screwCompressorAPIName.getTrainList
  this.screwCompressorMethod.getWithoutParameters(url)
    // this.http.get<any>("api/ScrewCompressureAPI")
    .subscribe(res => {
      this.classificationDetails = res;
      this.commonLoadingDirective.showLoading(false, '');
    },
      error => {
        console.log(error);
      }
    );
  this.commonLoadingDirective.showLoading(false, '');
  const url11 = this.profileAPIName.ProfileAPI
  this.screwCompressorMethod.getWithoutParameters(url11)
    .subscribe(
      res => {
        this.user = res;
        this.commonLoadingDirective.showLoading(false, '');
      },
      err => {
        this.commonLoadingDirective.showLoading(false, '');
        console.log(err);
      },
    );

  const url2: string = this.screwCompressorAPIName.getPredictedList;
  this.screwCompressorMethod.getWithoutParameters(url2)
    //  this.http.get<any>('api/ScrewCompressureAPI/GetPrediction', this.headers)
    .subscribe(res => {
      this.screwWithPredictionDetails = res;
      if (this.screwWithPredictionDetails.length == 0) {
        this.AFPNotVisible = true;
        this.AFPVisible = false;
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
public Predictions:any=[]
GerAllPredictionRecords() {
  this.PredictionDataNormalCount = null;
  this.PredictionDataIncipientCount = null;
  this.PredictonDataDegradeCount = null;
  var PredictionnormalCount: any = [];
  var PredictionnormalValuation: number = 0;
  var PredictionincipientCount: any = [];
  var PredictionincipientValuation: number = 0;
  var PredictiondegradeCount: any = [];
  var PredictiondegradeValuation: number = 0;
  this.screwCompressorMethod.getWithoutParameters(this.screwCompressorAPIName.PredictionDataList)
    .subscribe(
      res => {
        this.ScrewPredictionAllData = res;
        this.ScrewPredictionAllData.forEach(element => {
          this.Predictions.push(element.Prediction);
        });
        this.Predictions.forEach((value) => {
          if (value == 'normal') {
            PredictionnormalValuation = PredictionnormalValuation + 1;
            PredictionnormalCount.push(PredictionnormalValuation);
            PredictionincipientCount.push(PredictionincipientValuation);
            PredictiondegradeCount.push(PredictiondegradeValuation)

          } else if (value == 'incipient') {

            PredictionincipientValuation = PredictionincipientValuation + 1;
            PredictionincipientCount.push(PredictionincipientValuation);
            PredictionnormalCount.push(PredictionnormalValuation);
            PredictiondegradeCount.push(PredictiondegradeValuation)

          } else {

            PredictiondegradeValuation = PredictiondegradeValuation + 1;
            PredictiondegradeCount.push(PredictiondegradeValuation)
            PredictionnormalCount.push(PredictionnormalValuation);
            PredictionincipientCount.push(PredictionincipientValuation);

          }
          this.PredictionDataNormalCount = PredictionnormalCount;
          this.PredictionDataIncipientCount = PredictionincipientCount;
          this.PredictonDataDegradeCount = PredictiondegradeCount;

        });


        var Degradepercentage 
        var Incipientpercentage
        var Normalpercentage 
        for (var i = 0; i < this.ScrewPredictionAllData.length; i++) {
          if (this.Prediction[i] == "degarde" || this.Prediction[i] == "degrade") {
            this.PredictionDegradecount = this.PredictionDegradecount + 1
          } else if (this.Prediction[i] == "incipient") {
            this.PredictionIncipientcount = this.PredictionIncipientcount + 1
          } else if (this.Prediction[i] == "normal") {
            this.PredictionNormalcount = this.PredictionNormalcount + 1
          } else
            this.Predictionbadcount = this.Predictionbadcount + 1
        }
        Degradepercentage= (this.Degradecount/this.ScrewPredictionAllData.length )*100
        Incipientpercentage= (this.Incipientcount/this.ScrewPredictionAllData.length )*100
        Normalpercentage= (this.Normalcount/this.ScrewPredictionAllData.length )*100

        this.AFPnormalpercentage = (this.Normalcount/this.ScrewPredictionAllData.length )*100

        this.AFPincipientPerentage = (this.Incipientcount/this.ScrewPredictionAllData.length )*100
  
        this.AFPdegradePercentage = (this.Degradecount/this.ScrewPredictionAllData.length )*100

         this.GenerateReport()
      }, error => {
        console.log(error.error)
      })
}

}

