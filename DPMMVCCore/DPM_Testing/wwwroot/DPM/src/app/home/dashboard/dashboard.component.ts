import { ChangeDetectorRef, Component, ElementRef, ViewChild } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { MessageService } from 'primeng/api';
import { CommonBLService } from "src/app/shared/BLDL/common.bl.service";
import { DashboardConstantAPI } from "./dashboard.service";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import * as Chart from 'chart.js';
import * as moment from "moment";
import { CommonLoadingDirective } from "src/app/shared/Loading/common-loading.directive";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [MessageService]
})
export class DashboardComponent {
  chart: any;
  chart1: any;
  public FromDate: string = "";
  public FailuerModeType: string = ""
  public ToDate: string = "";
  public ClassificationData: string = "";
  public FailuerModes: string = ""
  public InsertedDate: any = [];
  public classi: any = [];
  public Prediction: any = [];
  public inserteddate: any = [];
  public ScrewCompressorAllData: any;
  public ScrewPredictionAllData: any;
  public getAllFilterData: any;
  public MachineType: string = "";
  public EquipmentType: string = "";
  public TagNumber: string = "";
  public EquipmentList: any = []
  public prescriptiveRecords: any = [];
  public TagList: any = [];
  public ETBF: string = '';
  public SelectedTagNumber: string = "";
  public CostRisk: boolean = false;
  public filterdata: boolean = false;
  public DPMMEI: number
  public DPMWithoutMEI: number;
  public Degradecount: number = 0;
  public Normalcount: number = 0;
  public Incipientcount: number = 0;
  public badcount: number = 0;

  public PredictionDegradecount: number = 0;
  public PredictionNormalcount: number = 0;
  public PredictionIncipientcount: number = 0;
  public Predictionbadcount: number = 0;

  public SelectDateType: string = "LastUpload";
  public DatesList: any = [];
  public failuermodeType: string = "";
  public ScrewTrainLastUploadList: any = [];
  public ScrewTrainPreviousWeekList: any = [];
  public ScrewTrainPreviousMonthList: any = [];
  availableYears = [2016, 2017, 2018, 2019, 2020];
  availableMonths = [{ name: 'January', selected: false },
  { name: 'February', selected: false },
  { name: 'March', selected: false },
  { name: 'April', selected: false },
  { name: 'May', selected: false },
  { name: 'June', selected: false },
  { name: 'July', selected: false },
  { name: 'August', selected: false },
  { name: 'September', selected: false },
  { name: 'October', selected: false },
  { name: 'November', selected: false },
  { name: 'December', selected: false }]

  selectionModel = {}
  public selectedYear: string;
  selectedMonths = {}
  public selectedMonth: string;

  public ComponentCriticalityFactor: string = "";
  public ComponentRating: string = "";
  public CConditionMonitoring: string = ""
  public CFrequencyMaintainenance: string = "";
  public PrescriptiveMaintenance: boolean = false;

  constructor(private title: Title,
    private http: HttpClient,
    private messageService: MessageService,
    private dashboardBLService: CommonBLService,
    private dashboardContantAPI: DashboardConstantAPI,
    private dashboardContantMethod: CommonBLService,
    private changeDetectorRef: ChangeDetectorRef,
    public commonLoadingDirective: CommonLoadingDirective,) {
    this.title.setTitle('Dashboard | Dynamic Prescriptive Maintenence');
  }
  ngOnInit() {
    this.getRecordsByEqui()
    this.showReport()
    this.GetAllRecords()
    this.MachineEquipmentSelect();
    this.getAllRecordsbyTag();
    // this.GetFilterRecords()
    this.SCClassification()
    this.GerAllPredictionRecords()
    this.availableYears.forEach(year => {
      this.selectionModel[year] = this.availableMonths.map(obj => ({ ...obj }));
    })
  }
  isDateInArray(needle, haystack) {
    for (var i = 0; i < haystack.length; i++) {
      if (needle.getDate() === haystack[i].getDate()) {
        return true;
      }
    }
    return false;
  }
  showReport() {
    let embedUrl = 'https://app.powerbi.com/reportEmbed?reportId=8229f0b7-523d-46d9-9a54-b53438061991&autoAuth=true&ctid=606acdf9-2783-4b1f-9afc-a0919c38927d&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXdlc3QtZXVyb3BlLWUtcHJpbWFyeS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D';
  }
  onChangeYear() {
    this.selectedYear
    this.selectionModel[this.selectedYear]
    this.ToDate = `${this.selectedYear}${this.selectedMonth} `;
    this.ToDate = `${this.selectedYear}-01-01 `;
    this.FromDate = `${this.selectedYear}-12-31 `;
    this.GetFilterRecords()
  }

  GerAllPredictionRecords() {
    this.dashboardBLService.getWithoutParameters(this.dashboardContantAPI.PredictionDataList)
      .subscribe(
        res => {
          this.ScrewPredictionAllData = res;
          this.ScrewPredictionAllData.forEach(element => {
            this.Prediction.push(element.Prediction);
          });
          for (var i = 0; i < this.ScrewPredictionAllData.length; i++) {
            if (this.Prediction[i] == "degarde") {
              this.PredictionDegradecount = this.PredictionDegradecount + 1
            } else if (this.Prediction[i] == "incipient") {
              this.PredictionIncipientcount = this.PredictionIncipientcount + 1
            } else if (this.Prediction[i] == "normal") {
              this.PredictionNormalcount = this.PredictionNormalcount + 1
            } else
              this.Predictionbadcount = this.Predictionbadcount + 1
          }
          this.PredictionAllRecordDonught()
          this.PredictionAllRecordDonught();
          this.PredictionOfAllpolarchart()
          // this.PredictionOfAllRecordbar()
          // this.PredictionAllRecordBarcharts()
          this.PredictionAllRecordPie()
        }, error => {
          console.log(error.error)
        })
  }
  public n:number = 0
  public i:number = 0
  public d:number = 0

  public screwPredictionDataNormalCount: any = [];
  public screwPredictionDataIncipientCount: any = [];
  public screwPredictonDataDegradeCount: any = [];
  GetAllRecords() {
    this.screwPredictionDataNormalCount = null;
    this.screwPredictionDataIncipientCount = null;
    this.screwPredictonDataDegradeCount = null;
    var normalCount: any = [];
    var normalValuation: number = 0;
    var incipientCount: any = [];
    var incipientValuation: number = 0;
    var degradeCount: any = [];
    var degradeValuation: number = 0;
    this.dashboardBLService.getWithoutParameters(this.dashboardContantAPI.GetAllRecords)
      .subscribe(
        res => {
          this.ScrewCompressorAllData = res;
            this.ScrewCompressorAllData.forEach(res => {
            res.Classification
            res.Date
            this.ClassificationData= res.Classification;
            this.InsertedDate = res.Date;
           })
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
        this.screwPredictionDataNormalCount = normalCount;
        this.screwPredictionDataIncipientCount = incipientCount;
        this.screwPredictonDataDegradeCount = degradeCount;
  
      });
          for (var i = 0; i < this.ScrewCompressorAllData.length; i++) {
            if (this.classi[i] == "degarde") {
              this.Degradecount = this.Degradecount + 1
            } else if (this.classi[i] == "incipient") {
              this.Incipientcount = this.Incipientcount + 1
            } else if (this.classi[i] == "normal") {
              this.Normalcount = this.Normalcount + 1
            } else
              this.badcount = this.badcount + 1
          }
          this.AllRecordBarcharts();
          this.ClassificationOfAllRecordDonught();
          this.ClassificationOfAllpolarchart()
          this.ClassificationOfAllRecordbar()
        }, error => {
          console.log(error.error)
        }
      )
  }

  GetFilterRecords() {
    const params = new HttpParams()
      .set("FailuerModeType", this.FailuerModeType)
      .set("ToDate", this.ToDate)
      .set("FromDate", this.FromDate)

    var url: string = this.dashboardContantAPI.GetFilterRecords;
    this.dashboardContantMethod.getWithParameters(url, params)
      .subscribe(
        res => {
          this.getAllFilterData = res
        })
  }

  FailureModeType() {
    if (this.failuermodeType == 'CH') {
      console.log('Failure Mode selected');
    } else if (this.failuermodeType == 'SSRB') {
      console.log('FailureMode Type 2 selected');
    } else {
      console.log('FailureMode Type not selected');
    }
  }

  SCClassification() {
    if (this.SelectDateType.length > 0) {
      if (this.failuermodeType == "CH" || this.failuermodeType == "SSRB" && this.SelectDateType == '2016') {
        this.commonLoadingDirective.showLoading(true, "Please wait to get ready graph....");

      } else if (this.failuermodeType == "CH" || this.failuermodeType == "SSRB" && this.SelectDateType == '2017') {

        this.commonLoadingDirective.showLoading(true, "Please wait to get ready graph....");

      } else if (this.failuermodeType == "CH" || this.failuermodeType == "SSRB" && this.SelectDateType == '2018') {

        this.commonLoadingDirective.showLoading(true, "Please wait to get ready graph....");
        this.onChangeYear()
        this.ClassificationOfAllpolarchart()
      } else if (this.failuermodeType == "CH" || this.failuermodeType == "SSRB" && this.SelectDateType == '2019') {

        this.commonLoadingDirective.showLoading(true, "Please wait to get ready graph....");

      } else if (this.failuermodeType == "CH" || this.failuermodeType == "SSRB" && this.SelectDateType == '2020') {

        this.commonLoadingDirective.showLoading(true, "Please wait to get ready graph....");

      }
    }
  }

  MachineEquipmentSelect() {
    if (this.MachineType == "Pump") {
      this.EquipmentList = []
      this.EquipmentList = ["Centrifugal Pump"]
    }
    if (this.MachineType == "Compressor") {
      this.EquipmentList = []
      this.EquipmentList = ["Screw Compressor"]
    }
  }
  getAllRecordsbyTag() {
    this.http.get('api/PrescriptiveAPI/GetTagNumber')
      .subscribe((res: any) => {
        res.forEach(element => {
          this.TagList.push(element.TagNumber)
        });
      });
  }

  getRecordsByEqui() {
    if (this.MachineType && this.EquipmentType && this.SelectedTagNumber) {
      this.prescriptiveRecords = [];
      this.http.get(`api/PrescriptiveAPI/GetPrescriptiveByEquipmentType?machine=${this.MachineType}&Equi=${this.EquipmentType}&TagNumber=${this.SelectedTagNumber}`)
        .subscribe((res: any) => {
          this.prescriptiveRecords = res;

          this.ComponentCriticalityFactor = res.ComponentCriticalityFactor
          this.CFrequencyMaintainenance = res.CFrequencyMaintainenance
          this.CConditionMonitoring = res.CConditionMonitoring
          this.ComponentRating = res.ComponentRating

          this.prescriptiveRecords.centrifugalPumpPrescriptiveFailureModes.forEach(row => {
            row.TotalAnnualPOC = 0;
            row.CentrifugalPumpMssModel.forEach(mss => {
              if (!mss.MSSMaintenanceInterval || mss.MSSMaintenanceInterval === 'NA' || mss.MSSMaintenanceInterval === 'Not Applicable') {
                mss.POC = 0;
                mss.AnnualPOC = 0;
                mss.Status = '';
              } else {
                let annu = mss.MSSMaintenanceInterval.split(' ');
                if (mss.MSSMaintenanceInterval.toLowerCase().includes('week')) {
                  mss.POC = 0.00025;
                  mss.AnnualPOC = parseFloat((parseFloat(annu[0]) * 0.00025).toFixed(3));
                } else if (mss.MSSMaintenanceInterval.toLowerCase().includes('month')) {
                  mss.POC = 0.02;
                  mss.AnnualPOC = parseFloat((parseFloat(annu[0]) * 0.02).toFixed(3));
                }
                mss.MSSMaintenanceInterval = `${parseFloat(annu[0]).toFixed(1)} ${annu[1]}`;
                mss.Status = 'Retained';
                row.TotalAnnualPOC += mss.AnnualPOC;
              }
            });
            row.ETBC = 10;
            row.TotalPONC = 194.4872;
            row.ETBF = this.ETBF ? this.ETBF : 2;
            row.TotalAnnualCostWithMaintenance = 1.777;
            row.EconomicRiskWithoutMaintenance = row.TotalPONC / row.ETBF;
            row.ResidualRiskWithMaintenance = parseFloat((row.TotalAnnualCostWithMaintenance - row.TotalAnnualPOC).toFixed(3));
            let WithETBCAndPONC = row.TotalPONC / row.ETBC;
            let WithoutETBCAndPONC = row.TotalPONC / 5;
            row.WithMEI = (((row.TotalPONC / row.ETBF) - (row.TotalPONC / row.ETBC)) / WithETBCAndPONC).toFixed(0);
            this.DPMMEI = row.WithMEI
            row.WithOutMEI = (((row.TotalPONC / row.ETBF) - (row.TotalPONC / 5)) / WithoutETBCAndPONC).toFixed(0);
            this.DPMWithoutMEI = row.WithOutMEI
            row.ConsequenceCategory = row.Consequence.split(' ')[0];
          });
          this.CostRisk = true;
          this.PrescriptiveMaintenance = true
          this.gaugechartwithDPM()
          this.gaugechartwithoutDPM()
          // this.ComponentCriticalityFactorBar()
        }, err => {
          console.log(err.err);
        });
    }
    else {
      this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Please select all three fields." })
    }

  }
  gaugechartwithDPM() {
    this.changeDetectorRef.detectChanges();
    this.chart = new Chart('gaugechart', {
      type: 'doughnut',
      data: {
        labels: ['DPM_With_MEI'],
        datasets: [
          {
            data: [this.DPMMEI, 1],
            backgroundColor: ['blue', 'lightgray'],
            fill: true
          }
        ]
      },
      options: {
        circumference: 1 * Math.PI,
        rotation: 1 * Math.PI,
        cutoutPercentage: 70
      }
    });


  }
  gaugechartwithoutDPM() {
    this.changeDetectorRef.detectChanges();
    this.chart = new Chart('canvasDPM', {
      type: 'doughnut',
      data: {
        labels: ['DPM_Without_MEI'],
        datasets: [
          {
            data: [this.DPMWithoutMEI, 1],
            backgroundColor: ['rgba(255, 0, 0, 1)'],
            fill: false
          }
        ]
      },
      options: {
        circumference: 1 * Math.PI,
        rotation: 1 * Math.PI,
        cutoutPercentage: 70
      }
    });
  }

  ClassificationOfAllRecordDonught() {
    this.chart = new Chart('canvasClass', {
      type: 'doughnut',
      data: {
        labels: ["Normal", "incipient", "Degrade"],
        datasets: [
          {
            backgroundColor: ["#008000", "#FFA500", "#FF0000"],
            data: [this.Normalcount, this.Incipientcount, this.Degradecount]
          }
        ]
      },
    });

  }


  ClassificationOfAllRecordbar() {
    this.changeDetectorRef.detectChanges();
    let dateForFilter = [];
    for (var i = 0; i < this.ScrewCompressorAllData.length; i++) {
      if (!this.isDateInArray(new Date(this.ScrewCompressorAllData[i].InsertedDate), dateForFilter)) {
        dateForFilter.push(new Date(this.ScrewCompressorAllData[i].InsertedDate));
      }
    }
    let dateForFilter1 = [];
    dateForFilter.forEach((value) => {
      var Date = moment(value).format('YYYY-MM-DD');
      dateForFilter1.push(Date);
    });
    for (var i = 0; i < dateForFilter1.length; i++) {
      var a = [];
      this.ScrewCompressorAllData.forEach(element => {
        if(moment(element.InsertedDate).format('YYYY-MM-DD')==dateForFilter1[i]){
        a.push(element.Classification)
        }
      });
      console.log(a);
    }
    this.changeDetectorRef.detectChanges();
    this.chart = new Chart('barline', {
      type: 'bar',
      data: {
        labels: dateForFilter1,
        datasets: [
          {
            label: "Incipent",
            data: this.screwPredictionDataIncipientCount,
            borderWidth: 1,
            backgroundColor: "#FFA500",
          }, {
            label: "Normal",
            data: this.screwPredictionDataNormalCount,
            borderWidth: 1,
            backgroundColor: "#008000",
          },
          {
            label: "Degrade",
            data: this.screwPredictonDataDegradeCount,
            borderWidth: 2,
            backgroundColor: "#FF0000",
          }
        ]
      },
    });

  }

  ClassificationOfAllpolarchart() {
    this.changeDetectorRef.detectChanges();
    let dateForFilter = [];
    for (var i = 0; i < this.ScrewCompressorAllData.length; i++) {
      if (!this.isDateInArray(new Date(this.ScrewCompressorAllData[i].InsertedDate), dateForFilter)) {
        dateForFilter.push(new Date(this.ScrewCompressorAllData[i].InsertedDate));
      }
    }
    let dateForFilter1 = [];
    dateForFilter.forEach((value) => {
      var Date = moment(value).format('YYYY-MM-DD');
      dateForFilter1.push(Date);
    });
    this.chart = new Chart('polarArea', {
      type: 'polarArea',
      data: {
        labels: ["Normal", "incipient", "Degrade"],
        datasets: [
          {
            backgroundColor: ["#008000", "#FFA500", "#FF0000"],
            data: [this.Normalcount, this.Incipientcount, this.Degradecount]
          }
        ]
      },
    });
  }

  AllRecordBarcharts() {
    this.changeDetectorRef.detectChanges();
    let dateForFilter = [];
    for (var i = 0; i < this.ScrewCompressorAllData.length; i++) {
      if (!this.isDateInArray(new Date(this.ScrewCompressorAllData[i].InsertedDate), dateForFilter)) {
        dateForFilter.push(new Date(this.ScrewCompressorAllData[i].InsertedDate));
      }
    }
    let dateForFilter1 = [];
    dateForFilter.forEach((value) => {
      var Date = moment(value).format('YYYY-MM-DD');
      dateForFilter1.push(Date);
    });
    for (var i = 0; i < dateForFilter1.length; i++) {
      var a = [];
      this.ScrewCompressorAllData.forEach(element => {
        if(moment(element.InsertedDate).format('YYYY-MM-DD')==dateForFilter1[i]){
        a.push(element.Classification)
        }
      });
      console.log(a);
    }
    this.changeDetectorRef.detectChanges();
    this.chart = new Chart("canvas1", {
      type: "bar",
      data: {
        labels: dateForFilter1,
        datasets: [
          {
            label: "Incipent",
            data: this.screwPredictionDataIncipientCount,
            borderWidth: 1,
            backgroundColor: "#FFA500",
          }, {
            label: "Normal",
            data: this.screwPredictionDataNormalCount,
            borderWidth: 1,
            backgroundColor: "#008000",
          },
          {
            label: "Degrade",
            data: this.screwPredictonDataDegradeCount,
            borderWidth: 2,
            backgroundColor: "#FF0000",
          }
        ]
      },
      options: {
        scales: {
          xAxes: [{
            stacked: true,
          }],
          yAxes: [{
            stacked: true,
          }]
        }
      }
    });
  }

  PredictionAllRecordDonught() {
    this.chart = new Chart('PredictioncanvasClass', {
      type: 'doughnut',
      data: {
        labels: ["Normal", "incipient", "Degrade"],
        datasets: [
          {
            backgroundColor: ["#008000", "#FFA500", "#FF0000"],
            data: [this.PredictionNormalcount, this.PredictionIncipientcount, this.PredictionDegradecount]
          }
        ]
      },
    });
  }

  PredictionAllRecordPie() {
    this.chart = new Chart('PredictionPie', {
      type: 'pie',
      data: {
        labels: ["Normal", "incipient", "Degrade"],
        datasets: [
          {
            backgroundColor: ["#008000", "#FFA500", "#FF0000"],
            data: [this.PredictionNormalcount, this.PredictionIncipientcount, this.PredictionDegradecount]
          }
        ]
      },
    });
  }

  PredictionOfAllpolarchart() {
    this.chart = new Chart('PredictionpolarArea', {
      type: 'polarArea',
      data: {
        labels: ["Normal", "incipient", "Degrade"],
        datasets: [
          {
            backgroundColor: ["#008000", "#FFA500", "#FF0000"],
            data: [this.PredictionNormalcount, this.PredictionIncipientcount, this.PredictionDegradecount]
          }
        ]
      },
    });
  }

  // ComponentCriticalityFactorBar() {
  //   this.chart = new Chart('ComponentCriticalityFactor', {
  //     type: 'doughnut',
  //     data: {
  //       datasets: [
  //         {
  //           backgroundColor: ["#12239E",],
  //           data: [this.ComponentCriticalityFactor],
  //         }
  //       ]
  //     },
  //     options: {
  //       cutoutPercentage: 50,
  //       text: 'this.ComponentCriticalityFactor',
  //     }
  //   });
  // }


  // PredictionOfAllRecordbar() {
  //   this.changeDetectorRef.detectChanges();
  //   let dateForFilter = [];
  //   for (var i = 0; i < this.ScrewPredictionAllData.length; i++) {
  //    if (!this.isDateInArray(new Date(this.ScrewPredictionAllData[i].InsertedDate), dateForFilter)) {
  //      dateForFilter.push(new Date(this.ScrewPredictionAllData[i].InsertedDate));
  //    }
  //  }
  //  let dateForFilter1 = [];
  //  dateForFilter .forEach((value) => {
  //    var Date = moment(value).format('YYYY-MM-DD');
  //    dateForFilter1.push(Date);
  //  });
  //   this.chart = new Chart('Predictionbarline', {
  //     type: 'bar',
  //     data: {
  //        labels:dateForFilter1,
  //       datasets: [
  //         {
  //           backgroundColor: ["#008000"],
  //           data: [ this.PredictionNormalcount]
  //         },
  //         { 
  //           backgroundColor: [ "#FFA500",],
  //           data: [this.PredictionIncipientcount]
  //         },
  //         { 
  //           backgroundColor: [ "#FF0000"],
  //           data: [this.PredictionDegradecount]
  //         },
  //       ]
  //     },
  //   });

  // }


  // PredictionAllRecordBarcharts(){
  //   this.changeDetectorRef.detectChanges();
  //    let dateForFilter = [];
  //    for (var i = 0; i < this.ScrewPredictionAllData.length; i++) {
  //     if (!this.isDateInArray(new Date(this.ScrewPredictionAllData[i].InsertedDate), dateForFilter)) {
  //       dateForFilter.push(new Date(this.ScrewPredictionAllData[i].InsertedDate));
  //     }
  //   }
  //   let dateForFilter11 = [];
  //   dateForFilter .forEach((value) => {
  //     var Date = moment(value).format('YYYY-MM-DD');
  //     dateForFilter11.push(Date);
  //   });
  //   this.chart = new Chart("Predictioncanvas1", {
  //     type: "bar",
  //     data: {
  //       labels: dateForFilter11,
  //       fill: true,
  //       datasets: [
  //         {
  //           label: "Normal",
  //           data: [this.PredictionNormalcount],
  //           borderWidth: 1,
  //           borderColor: "#008000",
  //           backgroundColor: '#008000',
  //           fill: true,
  //         }, {
  //           label: "Incipent",
  //           data: [this.PredictionIncipientcount],
  //           borderWidth: 1,
  //           borderColor: "#FFA500",
  //           backgroundColor: '#FFA500',
  //           fill: true,
  //         },
  //         {
  //           label: "Degrade",
  //           data: [this.PredictionDegradecount],
  //           borderWidth: 1,
  //           borderColor: " #FF0000",
  //           backgroundColor: '#FF0000',
  //           fill: true,
  //         }
  //       ]
  //     },
  //     options: {
  //       scales: {
  //             xAxes: [{
  //                 stacked: true,
  //             }],
  //             yAxes: [{
  //                 stacked: true,
  //             }]
  //         }
  //     }
  //   });
  //  } 
}
