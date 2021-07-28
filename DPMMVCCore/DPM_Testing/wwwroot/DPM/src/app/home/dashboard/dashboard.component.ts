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
  public PredictionData: string = "";
  public ClassificationData: string = "";
  public FailuerModes: string = ""
  public InsertedDate = [];
  public XYZ = [];
  public PredictFMMode = [];
  public InsertedDateForMonth = [];
  public abc = [];
  public ab = [];
  public failuerModetype:[];
  public yearlist = [];
  public Predictyearlist = [];
  public FMList = [];
  public PredictionFMList = [];
  public Monthlist = [];
  public classi: any = [];
  public Prediction: any = [];
  public PredictionFilteredData:any;
  public ScrewCompressorAllData: any;
  public ScrewCompressorFilteredData:any;
  public FailuerModetypeFilteredData:any;
  public FailuerModetypeFilteredData1:any;
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
  public selectedMode: string;
 
  selectionModel = {}
  public selectedYear: string ="";
  public PredictionselectedYear: string="";
  public fmtype: string="";
  public predictionfmtype: string="";
  public ComponentCriticalityFactor: string = "";
  public ComponentRating: string = "";
  public CConditionMonitoring: string = ""
  public CFrequencyMaintainenance: string = "";
  public PrescriptiveMaintenance: boolean = false;
  //For Train
  public TrainDataNormalCount: any = [];
  public TrainDataIncipientCount: any = [];
  public TrainDataDegradeCount: any = [];
  public TrainDataBadCount: any = [];
  //For Prediction
  public PredictionDataNormalCount: any = [];
  public PredictionDataIncipientCount: any = [];
  public PredictonDataDegradeCount: any = [];
  public PredictionDataBadCount: any = [];
  
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
    this.GerAllPredictionRecords()
 
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
    this.dashboardBLService.getWithoutParameters(this.dashboardContantAPI.PredictionDataList)
      .subscribe(
        res => {
          this.ScrewPredictionAllData = res;
          this.PredictionFilteredData = res;
          this.ScrewPredictionAllData.forEach(element => {
            this.Prediction.push(element.Prediction);
          });
          this.Prediction.forEach((value) => {
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
          this.ScrewPredictionAllData.forEach(predict => {
            this.PredictionData = predict.Prediction;
            let Predictyeardata = { PredictyearId:0,Predictyearname: '' };

            Predictyeardata.Predictyearname = moment(predict.InsertedDate).format('YYYY')
            this.InsertedDate.push(Predictyeardata);
          }) 
          this.Predictyearlist =  this.InsertedDate.reduce((m, o) => {
                                                      var found = m.find(p => p.Predictyearname === o.Predictyearname);
                                                      if (found) { 
                                                      } else {
                                                          m.push(o);
                                                      }
                                                      return m;
                                                  }, []);

          for (var i = 0; i < this.ScrewPredictionAllData.length; i++) {
            if (this.Prediction[i] == "degarde"|| this.Prediction[i] == "degrade") {
              this.PredictionDegradecount = this.PredictionDegradecount + 1
            } else if (this.Prediction[i] == "incipient") {
              this.PredictionIncipientcount = this.PredictionIncipientcount + 1
            } else if (this.Prediction[i] == "normal") {
              this.PredictionNormalcount = this.PredictionNormalcount + 1
            } else
              this.Predictionbadcount = this.Predictionbadcount + 1
          }

          this.PredictionAllRecordDonught();
           this.PredictionAllRecordBarcharts()
          this.PredictionAllRecordPie()
        }, error => {
          console.log(error.error)
        })
  }
  groupByPredict(list, keyGetter) {
    list.reduce((m, o) => {
      var found = m.find(p => p.Predictyearname === o.Predictyearname);
      if (found) {}  
      else{
        m.push(o);
      }
      return m;
  }, 
  []);
}
onPredictionChangeYear(){
 this.ScrewPredictionAllData = this.PredictionFilteredData.filter(val=> moment(val.InsertedDate).format('YYYY')  === this.PredictionselectedYear.toString());
 
 this.PredictionDegradecount =0
  this.PredictionIncipientcount=0
  this.PredictionNormalcount=0
  this.Predictionbadcount=0

  for (var i = 0; i < this.ScrewPredictionAllData.length; i++) {
    if (`${this.ScrewPredictionAllData[i]}.${this.fmtype}`== "degarde") {
      this.PredictionDegradecount = this.PredictionDegradecount + 1
    } else if (`${this.ScrewPredictionAllData[i]}.${this.fmtype}` == "incipient") {
      this.PredictionIncipientcount = this.PredictionIncipientcount + 1
    } else if (`${this.ScrewPredictionAllData[i]}.${this.fmtype}` == "normal") {
      this.PredictionNormalcount = this.PredictionNormalcount + 1
    } else
      this.Predictionbadcount = this.Predictionbadcount + 1
  }
  this.PredictionAllRecordBarcharts()
  this.PredictionAllRecordDonught()
  this.PredictionAllRecordPie()
}
PredictFModeType(){
   this.ScrewPredictionAllData = this.PredictionFilteredData.filter(val=>moment(val.InsertedDate).format('YYYY') === this.PredictionselectedYear.toString()  );
    this.PredictionDegradecount =0
    this.PredictionIncipientcount=0
    this.PredictionNormalcount=0
    this.Predictionbadcount=0

    // for (var i = 0; i < this.ScrewPredictionAllData.length; i++) {
    //   if (`${this.ScrewPredictionAllData[i].Prediction}.${this.fmtype}`== "degarde") {
    //     this.PredictionDegradecount = this.PredictionDegradecount + 1
    //   } else if (`${this.ScrewPredictionAllData[i].Prediction}.${this.fmtype}` == "incipient") {
    //     this.PredictionIncipientcount = this.PredictionIncipientcount + 1
    //   } else if (`${this.ScrewPredictionAllData[i].Prediction}.${this.fmtype}` == "normal") {
    //     this.PredictionNormalcount = this.PredictionNormalcount + 1
    //   } else
    //     this.Predictionbadcount = this.Predictionbadcount + 1
    // }

for (var i = 0; i < this.ScrewPredictionAllData.length; i++) {
  if (`${this.ScrewPredictionAllData[i]}.${this.fmtype}`== "degarde") {
    this.PredictionDegradecount = this.PredictionDegradecount + 1
  } else if (`${this.ScrewPredictionAllData[i]}.${this.fmtype}` == "incipient") {
    this.PredictionIncipientcount = this.PredictionIncipientcount + 1
  } else if (`${this.ScrewPredictionAllData[i]}.${this.fmtype}` == "normal") {
    this.PredictionNormalcount = this.PredictionNormalcount + 1
  } else
    this.Predictionbadcount = this.Predictionbadcount + 1
}
 this.PredictionAllRecordBarcharts()
 this.PredictionAllRecordDonught()
 this.PredictionAllRecordPie()
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

    this.dashboardBLService.getWithoutParameters(this.dashboardContantAPI.GetAllRecords)
      .subscribe(
        res => {
          this.ScrewCompressorFilteredData = res; // actual data
          this.ScrewCompressorAllData = res;
          this.FailuerModetypeFilteredData1= res

          this.ScrewCompressorAllData.forEach(r => {
            this.ClassificationData = r.Classification;
            r.FailureModeType
            this.FailuerModetypeFilteredData 
       
           this.FailuerModetypeFilteredData1 = { FMId:0,FMname: '' };
           this.FailuerModetypeFilteredData1.FMname =  r.FailureModeType
            this.XYZ.push(this.FailuerModetypeFilteredData1);

            let newyeardata = { yearId:0,yearname: '' };
            newyeardata.yearname = moment(r.InsertedDate).format('YYYY')
            this.InsertedDate.push(newyeardata);
          }) 
          this.yearlist =  this.InsertedDate.reduce((m, o) => {
                                                      var found = m.find(p => p.yearname === o.yearname);
                                                      if (found) { 
                                                      } else {
                                                          m.push(o);
                                                      }
                                                      return m;
                                                  }, []);
          this.FMList = this.XYZ.reduce((s, n) => {
                                                    var found = s.find(p => p.FMname === n.FMname);
                                                    if (found) { 
                                                    } else {
                                                        s.push(n);
                                                    }
                                                    return s;
                                                }, []);

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
            if (this.classi[i] == "degarde" ||this.classi[i]  =="degrade") {
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
        }, error => {
          console.log(error.error)
        }
      )
  }

  groupBy(list, keyGetter) {
    list.reduce((m, o) => {
      var found = m.find(p => p.yearname === o.yearname);
      if (found) {}  
      else{
        m.push(o);
      }
      return m;
  }, 
  []);
}
 groupBy1(list, keyGetter) {
  list.reduce((s, n) => {
    var found = s.find(p => p.FMname === n.FMname);
    if (found) {}  
    else{
      s.push(n);
    }
    return s;
}, 
[]);
}

  onChangeYear() {
    // this.ScrewCompressorAllData = this.ScrewCompressorFilteredData.filter(val=> moment(val.InsertedDate).format('YYYY')  === this.selectedYear.toString());
    if(this.fmtype == ""&& this.selectedYear !=""){
      this.ScrewCompressorAllData = this.ScrewCompressorFilteredData.filter(val=> moment(val.InsertedDate).format('YYYY')  === this.selectedYear.toString());
    }else  if(this.fmtype != ""&& this.selectedYear !=""){
      this.ScrewCompressorAllData = this.ScrewCompressorFilteredData.filter(val=> (val.FailureModeType === this.fmtype.toString()) && moment(val.InsertedDate).format('YYYY') === this.selectedYear.toString());
    }
    this.Degradecount =0
    this.Incipientcount=0
    this.Normalcount=0
    this.badcount=0
    for (var i = 0; i < this.ScrewCompressorAllData.length; i++) {
      if (this.ScrewCompressorAllData[i].Classification == "degarde" || this.ScrewCompressorAllData[i].Classification == "degrade") {
        this.Degradecount = this.Degradecount + 1
      } else if (this.ScrewCompressorAllData[i].Classification == "incipient") {
        this.Incipientcount = this.Incipientcount + 1
      } else if (this.ScrewCompressorAllData[i].Classification == "normal") {
        this.Normalcount = this.Normalcount + 1
      } else
        this.badcount = this.badcount + 1
    }
    this.AllRecordBarcharts();
    this.ClassificationOfAllpolarchart()
    this.ClassificationOfAllRecordDonught()
  }

  FModeType() {
    if(this.fmtype != ""&& this.selectedYear ==""){
      this.ScrewCompressorAllData = this.ScrewCompressorFilteredData.filter(val=> (val.FailureModeType === this.fmtype.toString()));
    }else  if(this.fmtype != ""&& this.selectedYear !=""){
      this.ScrewCompressorAllData = this.ScrewCompressorFilteredData.filter(val=> (val.FailureModeType === this.fmtype.toString()) && moment(val.InsertedDate).format('YYYY') === this.selectedYear.toString());
    }

    this.Degradecount =0
    this.Incipientcount=0
    this.Normalcount=0
    this.badcount=0
    for (var i = 0; i < this.ScrewCompressorAllData.length; i++) {
      if (this.ScrewCompressorAllData[i].Classification == "degarde"|| this.ScrewCompressorAllData[i].Classification == "degrade") {
        this.Degradecount = this.Degradecount + 1
      } else if (this.ScrewCompressorAllData[i].Classification == "incipient") {
        this.Incipientcount = this.Incipientcount + 1
      } else if (this.ScrewCompressorAllData[i].Classification == "normal") {
        this.Normalcount = this.Normalcount + 1
      } else
        this.badcount = this.badcount + 1
    }
    this.AllRecordBarcharts();
    this.ClassificationOfAllpolarchart()
    this.ClassificationOfAllRecordDonught()
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
      options: {
         events:[],
      }
    });

  }


  ClassificationOfAllpolarchart() {
    this.changeDetectorRef.detectChanges();
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
      options: {
        events:[],
      }
    });
  }

  AllRecordBarcharts() {
    this.changeDetectorRef.detectChanges();
    let dateForFilter = [];
    this.TrainDataIncipientCount=[]
    this.TrainDataNormalCount =[]
    this.TrainDataDegradeCount=[]
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
        if (moment(element.InsertedDate).format('YYYY-MM-DD') == dateForFilter1[i]) {
          a.push(element.Classification)
        }
      });
      console.log(a);
      var normal =0
      var incipient =0
      var degrade =0
      var bad =0
      a.forEach((value) => {
        if (value == 'normal') {
          normal=normal+1
        } else if (value == 'incipient') {
          incipient=incipient+1
        }else if (value == 'degarde'||value == 'degrade') {
          degrade=degrade+1
        }else{
          bad=bad+1
        }
      });
      this.TrainDataIncipientCount.push(incipient)
      this.TrainDataNormalCount.push(normal)
      this.TrainDataDegradeCount.push(degrade)
      this.TrainDataBadCount.push(bad)

    }
    this.changeDetectorRef.detectChanges();
    this.chart = new Chart("canvas1", {
      type: "bar",
      data: {
        labels: dateForFilter1,
        datasets: [
          {
            label: "Incipent",
            data: this.TrainDataIncipientCount,
            borderWidth: 1,
            backgroundColor: "#FFA500",
          }, {
            label: "Normal",
            data: this.TrainDataNormalCount,
            borderWidth: 1,
            backgroundColor: "#008000",
          },
          {
            label: "Degrade",
            data: this.TrainDataDegradeCount,
            borderWidth: 2,
            backgroundColor: "#FF0000",
          }, 
          {
            label: "Bad",
            data: this.TrainDataBadCount,
            borderWidth: 1,
            backgroundColor: "blue",
          }
        ]
      },
      options: {
        events:[],
        scales: {
          xAxes: [{
            stacked: true,
          }],
          yAxes: [{
            stacked: true,
            ticks: {
              max: 30,
            }
          }]
        }
      }
    });
  }

  PredictionAllRecordDonught() {
    this.changeDetectorRef.detectChanges();
    let dateForFilter = [];
    this.PredictionDataNormalCount=[]
    this.PredictionDataIncipientCount =[]
    this.PredictonDataDegradeCount=[]
    for (var i = 0; i < this.ScrewPredictionAllData.length; i++) {
     if (!this.isDateInArray(new Date(this.ScrewPredictionAllData[i].InsertedDate), dateForFilter)) {
       dateForFilter.push(new Date(this.ScrewPredictionAllData[i].InsertedDate));
     }
   }
   let dateForFilter1 = [];
   dateForFilter.forEach((value) => {
     var Date = moment(value).format('YYYY-MM-DD');
     dateForFilter1.push(Date);
   });
   for (var i = 0; i < dateForFilter1.length; i++) {
     var a = [];
     this.ScrewPredictionAllData.forEach(element => {
       if (moment(element.InsertedDate).format('YYYY-MM-DD') == dateForFilter1[i]) {
         if(this.fmtype !=""){
           if(this.fmtype =="SSRB"){
             a.push(element.SSRB)
           }else if(this.fmtype =="CF"){
             a.push(element.CF)
           }  if(this.fmtype =="RD"){
             a.push(element.RD)
           }
         }else{
           a.push(element.Prediction)
         }
       }
     });
  
     console.log(a);
     var normal =0
     var incipient =0
     var degrade =0
     var bad =0
  
     a.forEach((value) => {
       if (value == 'normal') {
         normal=normal+1
       } else if (value == 'incipient') {
         incipient=incipient+1
       }else if (value == 'degarde'||value == 'degrade') {
         degrade=degrade+1
       }else{
         bad=bad+1
       }
     });
     this.PredictionDataNormalCount.push(normal)
     this.PredictionDataIncipientCount.push(incipient) 
     this.PredictonDataDegradeCount.push(degrade)
     this.PredictionDataBadCount.push(bad)
   }
   this.changeDetectorRef.detectChanges();
    this.chart = new Chart('PredictioncanvasClass', {
      type: 'bar',
      data: {
        labels: dateForFilter1,
        datasets: [
          {
            label: "Normal",
            data: this.PredictionDataNormalCount,
            borderWidth: 1,
            borderColor: "#008000",
            backgroundColor: '#008000',
          }, {
            label: "Incipent",
            data:  this.PredictionDataIncipientCount,
            borderWidth: 1,
            borderColor: "#FFA500",
            backgroundColor: '#FFA500',
          },
          {
            label: "Degrade",
            data:  this.PredictonDataDegradeCount,
            borderWidth: 1,
            borderColor: " #FF0000",
            backgroundColor: '#FF0000',
          }
        ]
      },
      options: {
          events:[],
      }
    });
  }

  PredictionAllRecordPie() {
    var a: any = [];
    this.PredictionNormalcount = 0,
      this.PredictionIncipientcount = 0,
      this.PredictionDegradecount = 0;
    this.ScrewPredictionAllData.forEach(element => {
      if (this.fmtype != "") {
        if (this.fmtype == "SSRB") {
          a.push(element.SSRB)
        } else if (this.fmtype == "CF") {
          a.push(element.CF)
        } if (this.fmtype == "RD") {
          a.push(element.RD)
        }
      } else {
        a.push(element.Prediction)
      }
 
    });
    a.forEach(element => {
      if (element == 'normal') {
        this.PredictionNormalcount = this.PredictionNormalcount + 1;
      } else if (element == 'incipient') {
        this.PredictionIncipientcount = this.PredictionIncipientcount + 1;
      } else if (element == 'degrade' || element == 'degarde') {
        this.PredictionDegradecount = this.PredictionDegradecount + 1;
      }
    });
    this.changeDetectorRef.detectChanges();
    this.chart = new Chart("PredictionPie", {
      type: 'pie',
      data: {
        labels: ["Normal", "incipient", "Degrade"],
        fill: true,
        datasets: [
          {
            backgroundColor: ["#008000", "#FFA500", "#FF0000"],
            data: [this.PredictionNormalcount, this.PredictionIncipientcount, this.PredictionDegradecount]
          }
        ]
      },
      options: {
        events: [],
      }
    });

  }

  PredictionAllRecordBarcharts(){
    this.changeDetectorRef.detectChanges();
     let dateForFilter = [];
     this.PredictionDataNormalCount=[]
     this.PredictionDataIncipientCount =[]
     this.PredictonDataDegradeCount=[]
     for (var i = 0; i < this.ScrewPredictionAllData.length; i++) {
      if (!this.isDateInArray(new Date(this.ScrewPredictionAllData[i].InsertedDate), dateForFilter)) {
        dateForFilter.push(new Date(this.ScrewPredictionAllData[i].InsertedDate));
      }
    }
    let dateForFilter1 = [];
    dateForFilter.forEach((value) => {
      var Date = moment(value).format('YYYY-MM-DD');
      dateForFilter1.push(Date);
    });
    for (var i = 0; i < dateForFilter1.length; i++) {
      var a = [];
      this.ScrewPredictionAllData.forEach(element => {
        if (moment(element.InsertedDate).format('YYYY-MM-DD') == dateForFilter1[i]) {
          if(this.fmtype !=""){
            if(this.fmtype =="SSRB"){
              a.push(element.SSRB)
            }else if(this.fmtype =="CF"){
              a.push(element.CF)
            }  if(this.fmtype =="RD"){
              a.push(element.RD)
            }
          }else{
            a.push(element.Prediction)
          }
        }
      });

      console.log(a);
      var normal =0
      var incipient =0
      var degrade =0
      var bad =0

      a.forEach((value) => {
        if (value == 'normal') {
          normal=normal+1
        } else if (value == 'incipient') {
          incipient=incipient+1
        }else if (value == 'degarde'||value == 'degrade') {
          degrade=degrade+1
        }else{
          bad=bad+1
        }
      });
      this.PredictionDataNormalCount.push(normal)
      this.PredictionDataIncipientCount.push(incipient) 
      this.PredictonDataDegradeCount.push(degrade)
      this.PredictionDataBadCount.push(bad)
    }
    this.changeDetectorRef.detectChanges();
    this.chart = new Chart("Predictionbarline", {
      type: "bar",
      data: {
        labels: dateForFilter1,
        fill: true,
        datasets: [
          {
            label: "Normal",
            data: this.PredictionDataNormalCount,
            borderWidth: 1,
            borderColor: "#008000",
            backgroundColor: '#008000',
            fill: true,
          }, {
            label: "Incipent",
            data:  this.PredictionDataIncipientCount,
            borderWidth: 1,
            borderColor: "#FFA500",
            backgroundColor: '#FFA500',
            fill: true,
          },
          {
            label: "Degrade",
            data:  this.PredictonDataDegradeCount,
            borderWidth: 1,
            borderColor: " #FF0000",
            backgroundColor: '#FF0000',
            fill: true,
          }
        ]
      },
      options: {
          events:[],
        scales: {
              xAxes: [{
                  stacked: true,
              }],
              yAxes: [{
                stacked: true,
                ticks: {
                  max: 50,
                }
              }]
          }
      }
    });
   } 
   
}
