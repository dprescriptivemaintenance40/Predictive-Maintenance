import { ChangeDetectorRef, Component, ElementRef, ViewChild } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { MessageService } from 'primeng/api';
import { CommonBLService } from "src/app/shared/BLDL/common.bl.service";
import { DashboardConstantAPI } from "./dashboard.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import * as Chart from 'chart.js';
import * as moment from "moment";
import { CommonLoadingDirective } from "src/app/shared/Loading/common-loading.directive";
import Dygraph from 'dygraphs'
import { Router } from "@angular/router";
import { Location } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [MessageService]
})
export class DashboardComponent {
  @ViewChild('graph')
  graphdiv: ElementRef;
  chart: any;
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
  public failuerModetype: [];
  public yearlist = [];
  public Predictyearlist = [];
  public FMList = [];
  public PredictionFMList = [];
  public classi: any = [];
  public Prediction: any = [];
  public PredictionFilteredData: any;
  public ScrewCompressorAllData: any;
  public ScrewCompressorFilteredData: any;
  public FailuerModetypeFilteredData: any;
  public FailuerModetypeFilteredData1: any;
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
  public DPMCost: number
  public DPMWithoutCost: number
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

  public selectedYear: string = "";
  public PredictionselectedYear: string = "";
  public fmtype: string = "";
  public predictionfmtype: string = "";
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
  public state: any;
    //For FutuerPrediction
    public FutuerselectedYear: string = "";
    public FutuerPredictedDate = [];
    public FuterPredictyearlist = [];
    public FutuerPredictionData: string = "";
    public FutuerPredictionAllData: any;
    public FutuerPredictionDataNormalCount: any = [];
    public FutuerPredictionDataIncipientCount: any = [];
    public FutuerPredictonDataDegradeCount: any = [];
    public FutuerPredictionDataBadCount: any = [];
    public FutuerPredictionDegradecount: number = 0;
    public FutuerPredictionNormalcount: number = 0;
    public FutuerPredictionIncipientcount: number = 0;
    public FutuerPredictionbadcount: number = 0;
    public FutuerPrediction: any = [];
    public PredictionShow:boolean = true;
    public FuterPredictionShow:boolean = false;

    public td2: any = [];
    public td1: any = [];
    public ts1: any = [];
    public ts2: any = [];
    public TD2Data: any = [];
    public CFPPrescriptiveId : number = 0 ;
    public DatesforCSV : number = 0 ;
    public date: string = "";


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
    public screwWithPredictionDetails: any = []
    public classificationDetails: any = []

    public FinalNormal:any=[]
    public FinalIncipient:any=[]
    public FinaldDegrade:any=[]
    public FinalBad:any=[]

    public ClassDegradepercentage=0
    public ClassIncipientpercentage=0
    public ClassNormalpercentage=0

    public FPFinalNormal:any=[]
    public FPFinalIncipient:any=[]
    public FPFinaldDegrade:any=[]
    public FPFinalBad:any=[]

    public SCFinalNormal:any=[]
    public SCFinalIncipient:any=[]
    public SCFinaldDegrade:any=[]
    public SCFinalBad:any=[]

  constructor(private title: Title,
    private http: HttpClient,
    public router: Router,
    private messageService: MessageService,
    private dashboardBLService: CommonBLService,
    private dashboardContantAPI: DashboardConstantAPI,
    private dashboardContantMethod: CommonBLService,
    private changeDetectorRef: ChangeDetectorRef,
    private location: Location,
    public commonLoadingDirective: CommonLoadingDirective,) {
    this.title.setTitle('Dashboard | Dynamic Prescriptive Maintenence');
    this.state = window.history.state; 
    if (!!this.state.CFPPrescriptiveId) { 
      this.CFPPrescriptiveId= this.state.CFPPrescriptiveId;
      this.ETBF=this.state.ETBF 
      this.CBAWithId(this.CFPPrescriptiveId)
    }
    this.date =  moment().add(1, 'days').format('YYYY-MM-DD');
    this.MachineType="Pump"
    this.EquipmentType="Centrifugal Pump"
    this.SelectedTagNumber="S-98"
  }
  ngOnInit() {
    this.getRecordsByEqui()
    this.showReport()
    this.GetAllRecords()
    this.MachineEquipmentSelect();
    this.getAllRecordsbyTag();
    this.GerAllPredictionRecords();
    this.dygraph()
    this.ComboDates()
  }
  RouteToTrain(){
    this.router.navigateByUrl('/Home/Compressor/ScrewTrain'); 
  }
  RouteToPredict(){
    this.router.navigateByUrl('/Home/Compressor/ScrewPrediction'); 
  }
  RouteToCostBenifit(){
     this.router.navigateByUrl('/Home/CostBenefitAnalysis');
  }
  ComboDates(){
    if(this.date =="1Week"){
      this.date =  moment().add(7, 'days').format('YYYY-MM-DD');
      this.dygraph()
    }else if(this.date =="15days"){
      this.date =  moment().add(15, 'days').format('YYYY-MM-DD');
      this.dygraph()
    }else if(this.date =="1Month"){
      this.date =  moment().add(30, 'days').format('YYYY-MM-DD');
      this.dygraph()
    }
    
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
            let Predictyeardata = { PredictyearId: 0, Predictyearname: '' };

            Predictyeardata.Predictyearname = moment(predict.InsertedDate).format('YYYY')
            this.InsertedDate.push(Predictyeardata);
          })
          this.Predictyearlist = this.InsertedDate.reduce((m, o) => {
            var found = m.find(p => p.Predictyearname === o.Predictyearname);
            if (found) {
            } else {
              m.push(o);
            }
            return m;
          }, []);

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

          this.PredictionAllRecordDonught();
          this.PredictionAllRecordBarcharts();
           this.PredictionAllRecordPie();
           this.GenerateReport()
        }, error => {
          console.log(error.error)
        })
  }
  groupByPredict(list, keyGetter) {
    list.reduce((m, o) => {
      var found = m.find(p => p.Predictyearname === o.Predictyearname);
      if (found) { }
      else {
        m.push(o);
      }
      return m;
    },
      []);
  }
  onPredictionChangeYear() {
    this.ScrewPredictionAllData = this.PredictionFilteredData.filter(val => moment(val.InsertedDate).format('YYYY') === this.PredictionselectedYear.toString());

    this.PredictionDegradecount = 0
    this.PredictionIncipientcount = 0
    this.PredictionNormalcount = 0
    this.Predictionbadcount = 0

    for (var i = 0; i < this.ScrewPredictionAllData.length; i++) {
      if (`${this.ScrewPredictionAllData[i]}.${this.fmtype}` == "degarde") {
        this.PredictionDegradecount = this.PredictionDegradecount + 1
      } else if (`${this.ScrewPredictionAllData[i]}.${this.fmtype}` == "incipient") {
        this.PredictionIncipientcount = this.PredictionIncipientcount + 1
      } else if (`${this.ScrewPredictionAllData[i]}.${this.fmtype}` == "normal") {
        this.PredictionNormalcount = this.PredictionNormalcount + 1
      } else
        this.Predictionbadcount = this.Predictionbadcount + 1
    }
    this.PredictionAllRecordBarcharts()
   // this.PredictionAllRecordDonught()
    // this.PredictionAllRecordPie()
}
  PredictFModeType() {
    this.ScrewPredictionAllData = this.PredictionFilteredData.filter(val => moment(val.InsertedDate).format('YYYY') === this.PredictionselectedYear.toString());
    this.PredictionDegradecount = 0
    this.PredictionIncipientcount = 0
    this.PredictionNormalcount = 0
    this.Predictionbadcount = 0

    for (var i = 0; i < this.ScrewPredictionAllData.length; i++) {
      if (`${this.ScrewPredictionAllData[i]}.${this.fmtype}` == "degarde") {
        this.PredictionDegradecount = this.PredictionDegradecount + 1
      } else if (`${this.ScrewPredictionAllData[i]}.${this.fmtype}` == "incipient") {
        this.PredictionIncipientcount = this.PredictionIncipientcount + 1
      } else if (`${this.ScrewPredictionAllData[i]}.${this.fmtype}` == "normal") {
        this.PredictionNormalcount = this.PredictionNormalcount + 1
      } else
        this.Predictionbadcount = this.Predictionbadcount + 1
    }
    this.PredictionAllRecordBarcharts()
    // this.PredictionAllRecordDonught()
    // this.PredictionAllRecordPie()
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
          this.ScrewCompressorFilteredData = res;
          this.ScrewCompressorAllData = res;
          this.FailuerModetypeFilteredData1 = res

          this.ScrewCompressorAllData.forEach(r => {
            this.ClassificationData = r.Classification;
            r.FailureModeType
            this.FailuerModetypeFilteredData
             this.td2 = r.TD2
              this.TD2Data.push(this.td2 )

            this.FailuerModetypeFilteredData1 = { FMId: 0, FMname: '' };
            this.FailuerModetypeFilteredData1.FMname = r.FailureModeType
            this.XYZ.push(this.FailuerModetypeFilteredData1);

            let newyeardata = { yearId: 0, yearname: '' };
            newyeardata.yearname = moment(r.InsertedDate).format('YYYY')
            this.InsertedDate.push(newyeardata);
          })
          this.yearlist = this.InsertedDate.reduce((m, o) => {
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
          var ClassDegradepercentage
          var ClassIncipientpercentage
          var ClassNormalpercentage
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
          ClassDegradepercentage= ((this.Degradecount/this.ScrewCompressorAllData.length )*100).toFixed(2);
          ClassIncipientpercentage= ((this.Incipientcount/this.ScrewCompressorAllData.length )*100).toFixed(2);
          ClassNormalpercentage= ((this.Normalcount/this.ScrewCompressorAllData.length )*100).toFixed(2);

          this.AllRecordBarcharts();
          this.ClassificationOfAllRecordDonught();
          this.GenerateReport()
           this.ClassificationOfAllpolarchart()
          // this.ScatterChart()
        
        }, error => {
          console.log(error.error)
        }
      )
  }

  groupBy(list, keyGetter) {
    list.reduce((m, o) => {
      var found = m.find(p => p.yearname === o.yearname);
      if (found) { }
      else {
        m.push(o);
      }
      return m;
    },
      []);
  }
  groupBy1(list, keyGetter) {
    list.reduce((s, n) => {
      var found = s.find(p => p.FMname === n.FMname);
      if (found) { }
      else {
        s.push(n);
      }
      return s;
    },
      []);
  }

  onChangeYear() {
    if (this.fmtype == "" && this.selectedYear != "") {
      this.ScrewCompressorAllData = this.ScrewCompressorFilteredData.filter(val => moment(val.InsertedDate).format('YYYY') === this.selectedYear.toString());
    } else if (this.fmtype != "" && this.selectedYear != "") {
      this.ScrewCompressorAllData = this.ScrewCompressorFilteredData.filter(val => (val.FailureModeType === this.fmtype.toString()) && moment(val.InsertedDate).format('YYYY') === this.selectedYear.toString());
    }
    this.Degradecount = 0
    this.Incipientcount = 0
    this.Normalcount = 0
    this.badcount = 0
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
    // this.ClassificationOfAllpolarchart()
    // this.ClassificationOfAllRecordDonught()
  }

  FModeType() {
    if (this.fmtype != "" && this.selectedYear == "") {
      this.ScrewCompressorAllData = this.ScrewCompressorFilteredData.filter(val => (val.FailureModeType === this.fmtype.toString()));
    } else if (this.fmtype != "" && this.selectedYear != "") {
      this.ScrewCompressorAllData = this.ScrewCompressorFilteredData.filter(val => (val.FailureModeType === this.fmtype.toString()) && moment(val.InsertedDate).format('YYYY') === this.selectedYear.toString());
    }
    this.Degradecount = 0
    this.Incipientcount = 0
    this.Normalcount = 0
    this.badcount = 0
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
    // this.ClassificationOfAllpolarchart()
    // this.ClassificationOfAllRecordDonught()
    //  this.ComboChart();
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

  CBAWithId(CFPPrescriptiveId){
    const params = new HttpParams()
    .set("cfprescriptiveId", CFPPrescriptiveId)
    var url: string = this.dashboardContantAPI.CBARecorsWithId
   this.dashboardContantMethod.getWithParameters(url, params)
    .subscribe((res: any) => {
      this.prescriptiveRecords=[]
      this.prescriptiveRecords = res;
      this.DynamicCBA(res)
    }, err => {
      console.log(err.err);
    });
  }

  DynamicCBA(res){
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
      row.EconomicRiskWithoutMaintenance = (row.TotalPONC / row.ETBF).toFixed(3);
      this.DPMWithoutCost = row.EconomicRiskWithoutMaintenance
      row.ResidualRiskWithMaintenance = parseFloat((row.TotalAnnualCostWithMaintenance - row.TotalAnnualPOC).toFixed(3));
      this.DPMCost = row.ResidualRiskWithMaintenance
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
  }

  getRecordsByEqui() {
    if (this.MachineType && this.EquipmentType && this.SelectedTagNumber) { 
      this.prescriptiveRecords = [];
      this.http.get(`api/PrescriptiveAPI/GetPrescriptiveByEquipmentType?machine=${this.MachineType}&Equi=${this.EquipmentType}&TagNumber=${this.SelectedTagNumber}`)
        .subscribe((res: any) => {
          this.prescriptiveRecords=[]
          this.prescriptiveRecords = res;
          this.DynamicCBA(res)
        }, err => {
          console.log(err.err);
        });
    }
    else {
      this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Please select all three fields." })
    }

  }
  gaugechartwithDPM() {
    var x= this.DPMMEI *100
    var y : number = + this.DPMMEI
    var z:number= +this.DPMWithoutMEI
    var w:number= y+z
    var WithDPM_MEI = (x /w).toFixed(0)

    var xcost= this.DPMCost *100
    var ycost : number = + this.DPMCost
    var zcost:number= +this.DPMWithoutCost
    var wcost:number= ycost+zcost
    var WithDPM_Cost= (xcost /wcost).toFixed(0)
    this.changeDetectorRef.detectChanges();

    this.changeDetectorRef.detectChanges();
    this.chart = new Chart('gaugechart', {
      type: 'doughnut',
      data: {
         labels: ['DPM_With_MEI','DPM_Cost'],
        datasets: [
          {
            data: [WithDPM_MEI,WithDPM_Cost],
            backgroundColor: ['purple','blueviolet'],
            fill: false
          },
        ]
      },
      options: {
        circumference: 1 * Math.PI,
        rotation: 1 * Math.PI,
        cutoutPercentage: 70
      }
    });
    // this.chart = new Chart('gaugechart', {
    //   type: 'bar',
    //   data: {
    //     datasets: [
    //       {
    //         label: "DPM_With_MEI (Benefit)",
    //         data: [this.DPMMEI],
    //         backgroundColor: ['purple '],
    //         fill: true,
    //         barPercentage: 2,
    //         barThickness: 20,
    //         maxBarThickness: 28,
    //       }, 
    //       {
    //         label: "Total Cost",
    //         data: [this.DPMCost],
    //         backgroundColor: ['blueviolet'],
    //         fill: true,
    //         barPercentage: 2,
    //         barThickness: 20,
    //         maxBarThickness: 28,
    //       }, 

    //     ],
    //     options: {
    //      scales: {
    //        yAxes: [{
    //          ticks: {
    //           steps: 10,
    //           stepValue: 5,
    //             max: 100,
    //             beginAtZero: true
    //          }
    //        }]
    //      }
    //    }
    //   },
    // });


  }
  gaugechartwithoutDPM() {
    var a= this.DPMWithoutMEI *100
    var b : number = + this.DPMWithoutMEI
    var c:number= +this.DPMMEI
    var d:number= b+c
    var WithoutDPM_MEI = (a /d).toFixed(0)

    var acost= this.DPMWithoutCost *100
    var bcost : number = + this.DPMWithoutCost
    var ccost:number= +this.DPMCost
    var dcost:number= bcost+ccost
    var WithoutDPM_Cost= (acost /dcost).toFixed(0)

    this.changeDetectorRef.detectChanges();
    this.chart = new Chart('canvasDPM', {
      type: 'doughnut',
      data: {
         labels: ['DPM_Without_MEI','WithoutDPM_Cost'],
        datasets: [
          {
            data: [WithoutDPM_MEI,WithoutDPM_Cost],
            backgroundColor: ['purple','blueviolet'],
            fill: false
          },
        ]
      },
      options: {
        circumference: 1 * Math.PI,
        rotation: 1 * Math.PI,
        cutoutPercentage: 70
      }
    });

    // this.chart = new Chart('canvasDPM', {
    //   type: 'bar',
    //   data: {
    //     datasets: [
    //       {
    //         label: "DPM_Without_MEI (Benefit)",
    //         data: [this.DPMWithoutMEI],
    //         backgroundColor: ['purple '],
    //         fill: true,
    //         barPercentage: 2,
    //         barThickness: 20,
    //         maxBarThickness: 28,
    //       }, 
    //       {
    //         label: "Total Cost",
    //         data: [this.DPMWithoutCost],
    //         backgroundColor: ['blueviolet'],
    //         fill: true,
    //         barPercentage: 2,
    //         barThickness: 20,
    //         maxBarThickness: 28,
    //       },
    //     ],
    //     // options: {
    //     //   scales: {
    //     //     yAxes: [{
    //     //       ticks: {
    //     //        steps: 10,
    //     //        stepValue: 5,
    //     //          max: 100,
    //     //          beginAtZero: true
    //     //       }
    //     //     }]
    //     //   }
    //     // }
    //   },
    // });
  }

  ClassificationOfAllRecordDonught() {
    var a: any = [];
    this.Normalcount = 0,
      this.Incipientcount = 0,
      this.Degradecount = 0;
    this.ScrewCompressorAllData.forEach(element => {
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
    this.ClassDegradepercentage= (this.Degradecount/this.ScrewCompressorAllData.length )*100
    this.ClassIncipientpercentage= (this.Incipientcount/this.ScrewCompressorAllData.length )*100
    this.ClassNormalpercentage= (this.Normalcount/this.ScrewCompressorAllData.length )*100

    this.chart = new Chart('canvasClass', {
      type: 'doughnut',
      data: {
        labels: ["Normal", "incipient", "Degrade"],
        datasets: [
          {
            backgroundColor: ["#008000", "#FFA500", "#FF0000"],
            data: [this.ClassNormalpercentage, this.ClassIncipientpercentage, this.ClassDegradepercentage]
          }
        ]
      },
      options: {
        // events: [],
      }
    });

  }

  ClassificationOfAllpolarchart() {
    this.changeDetectorRef.detectChanges();
    this.ScrewCompressorAllData.sort()
    var LabelDates : any = [];
    this.yearlist.forEach(element => {
     LabelDates.push(element.yearname)
    });

    for(var i=0; i < this.yearlist.length; ++i) {
     var SCFPnormal =0
     var SCFPincipient =0
     var SCFPdegrade =0
     var SCFPbad =0
     var SCcounter = 0
     this.ScrewCompressorAllData.forEach(value => {
       var a = moment(value.InsertedDate).format('YYYY')
       if(a == this.yearlist[i].yearname){
         if (value.Classification == 'normal') {
           SCFPnormal = SCFPnormal + 1
         } else if (value.Classification == 'incipient') {
           SCFPincipient = SCFPincipient + 1
         } else if (value.Classification == 'degarde' || value.Classification == 'degrade') {
           SCFPdegrade = SCFPdegrade + 1
         } else {
           SCFPbad = SCFPbad + 1
         }
         SCcounter=SCcounter+1
       }

      });
      SCFPnormal= ((SCFPnormal/SCcounter)*100)
      SCFPincipient=((SCFPincipient/SCcounter)*100)
      SCFPdegrade=((SCFPdegrade/SCcounter)*100)
      SCFPbad=((SCFPbad/SCcounter)*100)

     this.FinalNormal.push(SCFPnormal)
     this.SCFinalIncipient.push(SCFPincipient)
     this.SCFinaldDegrade.push(SCFPdegrade)
     this.SCFinalBad.push(SCFPbad)
    
    }

   this.changeDetectorRef.detectChanges();
   this.chart = new Chart("polarArea", {
     type:"bar",
     data: {
      labels: LabelDates,
       fill: true,
       datasets: [
         {
           label: "Normal",
           data: this.SCFinalNormal,
           borderWidth: 1,
           borderColor: "#008000",
           backgroundColor: '#008000',
           fill: true,
         }, 
         {
           label: "Incipient",
           data: this.SCFinalIncipient,
           borderWidth: 1,
           borderColor: "#FFA500",
           backgroundColor: '#FFA500',
           fill: true,
         }, 
         {
           label: "Degrade",
           data: this.SCFinaldDegrade,
           borderWidth: 1,
           borderColor: "#FF0000",
           backgroundColor: '#FF0000',
           fill: true,
         },
         {
           label: "Bad",
           data: this.SCFinalBad,
           borderWidth: 1,
           borderColor: "blue",
           backgroundColor: 'blue',
           fill: true,
         },  

       ],
     },

   });
  }

  AllRecordBarcharts() {
    this.changeDetectorRef.detectChanges();
    let dateForFilter = [];
    this.TrainDataIncipientCount = []
    this.TrainDataNormalCount = []
    this.TrainDataDegradeCount = []
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
      var normal = 0
      var incipient = 0
      var degrade = 0
      var bad = 0
      a.forEach((value) => {
        if (value == 'normal') {
          normal = normal + 1
        } else if (value == 'incipient') {
          incipient = incipient + 1
        } else if (value == 'degarde' || value == 'degrade') {
          degrade = degrade + 1
        } else {
          bad = bad + 1
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
      // options: {
      //   events: [],
      //   scales: {
      //     yAxes: [{
      //       ticks: {
      //         min:1,
      //         max: 100,
      //       }
      //     }]
      //   }
      // }
      options: {
        events: [],
       scales: {
         xAxes: [{
            stacked: true,
         }],
         yAxes: [{
            stacked: true,
           ticks: {
             
           }
         }]
       }
     }
    });
  }

  PredictionAllRecordDonught() {
    // var a: any = [];
    // this.PredictionNormalcount = 0,
    //   this.PredictionIncipientcount = 0,
    //   this.PredictionDegradecount = 0;
    // this.ScrewPredictionAllData.forEach(element => {
    //   if (this.fmtype != "") {
    //     if (this.fmtype == "SSRB") {
    //       a.push(element.SSRB)
    //     } else if (this.fmtype == "CF") {
    //       a.push(element.CF)
    //     } if (this.fmtype == "RD") {
    //       a.push(element.RD)
    //     }
    //   } else {
    //     a.push(element.Prediction)
    //   }

    // });
    // a.forEach(element => {
    //   if (element == 'normal') {
    //     this.PredictionNormalcount = this.PredictionNormalcount + 1;
    //   } else if (element == 'incipient') {
    //     this.PredictionIncipientcount = this.PredictionIncipientcount + 1;
    //   } else if (element == 'degrade' || element == 'degarde') {
    //     this.PredictionDegradecount = this.PredictionDegradecount + 1;
    //   }
    // });
    // this.changeDetectorRef.detectChanges();
    // this.chart = new Chart("PredictioncanvasClass", {
    //   type: 'doughnut',
    //   data: {
    //     labels: ["Normal", "incipient", "Degrade"],
    //     fill: true,
    //     datasets: [
    //       {
    //         backgroundColor: ["#008000", "#FFA500", "#FF0000"],
    //         data: [this.PredictionNormalcount, this.PredictionIncipientcount, this.PredictionDegradecount]
    //       }
    //     ]
    //   },
    //   options: {
    //     events: [],
    //   }
    // });
    this.changeDetectorRef.detectChanges();
     this.ScrewPredictionAllData.sort()
     var LabelDates : any = [];
     this.Predictyearlist.forEach(element => {
      LabelDates.push(element.Predictyearname)
     });
 
     for(var i=0; i < this.Predictyearlist.length; ++i) {
      var FPnormal =0
      var FPincipient =0
      var FPdegrade =0
      var FPbad =0
      var counter = 0
      this.ScrewPredictionAllData.forEach(value => {
        var a = moment(value.InsertedDate).format('YYYY')
        if(a == this.Predictyearlist[i].Predictyearname){
          if (value.Prediction == 'normal') {
            FPnormal = FPnormal + 1
          } else if (value.Prediction == 'incipient') {
            FPincipient = FPincipient + 1
          } else if (value.Prediction == 'degarde' || value.Prediction == 'degrade') {
            FPdegrade = FPdegrade + 1
          } else {
            FPbad = FPbad + 1
          }
          counter=counter+1
        }

       });
       FPnormal= ((FPnormal/counter)*100)
       FPincipient=((FPincipient/counter)*100)
       FPdegrade=((FPdegrade/counter)*100)
       FPbad=((FPbad/counter)*100)

      this.FinalNormal.push(FPnormal)
      this.FinalIncipient.push(FPincipient)
      this.FinaldDegrade.push(FPdegrade)
      this.FinalBad.push(FPbad)
     
     }

    this.changeDetectorRef.detectChanges();
    this.chart = new Chart("PredictioncanvasClass", {
      type:"bar",
      data: {
       labels: LabelDates,
        fill: true,
        datasets: [
          {
            label: "Normal",
            data: this.FinalNormal,
            borderWidth: 1,
            borderColor: "#008000",
            backgroundColor: '#008000',
            fill: true,
          }, 
          {
            label: "Incipient",
            data: this.FinalIncipient,
            borderWidth: 1,
            borderColor: "#FFA500",
            backgroundColor: '#FFA500',
            fill: true,
          }, 
          {
            label: "Degrade",
            data: this.FinaldDegrade,
            borderWidth: 1,
            borderColor: "#FF0000",
            backgroundColor: '#FF0000',
            fill: true,
          },
          {
            label: "Bad",
            data: this.FinalBad,
            borderWidth: 1,
            borderColor: "blue",
            backgroundColor: 'blue',
            fill: true,
          },  

        ],
      },
      options: {

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
    var Degradepercentage 
    var Incipientpercentage
    var Normalpercentage 
 
    a.forEach(element => {
      if (element == 'normal') {
        this.PredictionNormalcount = this.PredictionNormalcount + 1;
      } else if (element == 'incipient') {
        this.PredictionIncipientcount = this.PredictionIncipientcount + 1;
      } else if (element == 'degrade' || element == 'degarde') {
        this.PredictionDegradecount = this.PredictionDegradecount + 1;
      }
    });
    Degradepercentage= ((this.PredictionDegradecount/a.length )*100).toFixed(2);
    Incipientpercentage= ((this.PredictionIncipientcount/a.length )*100).toFixed(2);
    Normalpercentage= ((this.PredictionNormalcount/a.length )*100).toFixed(2);

    this.changeDetectorRef.detectChanges();
    this.chart = new Chart("PredictionPie", {
      type: 'pie',
      data: {
        labels: ["Normal", "incipient", "Degrade"],
        fill: true,
        datasets: [
          {
            backgroundColor: ["#008000", "#FFA500", "#FF0000"],
            data: [Normalpercentage,Incipientpercentage,Degradepercentage]
          }
        ]
      },
    });

  }

  PredictionAllRecordBarcharts() {
    this.changeDetectorRef.detectChanges();
    let dateForFilter = [];
    this.PredictionDataNormalCount = []
    this.PredictionDataIncipientCount = []
    this.PredictonDataDegradeCount = []
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
        }
      });

      var normal = 0
      var incipient = 0
      var degrade = 0
      var bad = 0

      a.forEach((value) => {
        if (value == 'normal') {
          normal = normal + 1
        } else if (value == 'incipient') {
          incipient = incipient + 1
        } else if (value == 'degarde' || value == 'degrade') {
          degrade = degrade + 1
        } else {
          bad = bad + 1
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
            data: this.PredictionDataIncipientCount,
            borderWidth: 1,
            borderColor: "#FFA500",
            backgroundColor: '#FFA500',
            fill: true,
          },
          {
            label: "Degrade",
            data: this.PredictonDataDegradeCount,
            borderWidth: 1,
            borderColor: " #FF0000",
            backgroundColor: '#FF0000',
            fill: true,
          }
        ]
      },
      options: {
         events: [],
        scales: {
          xAxes: [{
             stacked: true,
          }],
          yAxes: [{
             stacked: true,
            ticks: {
            
            }
          }]
        }
      }
    });
  }

  GerAllFutuerPredictionRecords() {
    this.FutuerPredictionDataNormalCount = null;
    this.FutuerPredictionDataIncipientCount = null;
    this.FutuerPredictonDataDegradeCount = null;
    var FutuerPredictionnormalCount: any = [];
    var FutuerPredictionnormalValuation: number = 0;
    var FutuerPredictionincipientCount: any = [];
    var FutuerPredictionincipientValuation: number = 0;
    var FutuerPredictiondegradeCount: any = [];
    var FutuerPredictiondegradeValuation: number = 0;
    this.dashboardBLService.getWithoutParameters(this.dashboardContantAPI.GetAllFutuerRecords)
      .subscribe(
        res => {
          this.FutuerPredictionAllData = res;
          this.FutuerPredictionAllData.forEach(element => {
            this.FutuerPrediction.push(element.Prediction);
          });
          this.FutuerPrediction.forEach((value) => {
            if (value == 'normal') {
              FutuerPredictionnormalValuation = FutuerPredictionnormalValuation + 1;
              FutuerPredictionnormalCount.push(FutuerPredictionnormalValuation);
              FutuerPredictionincipientCount.push(FutuerPredictionincipientValuation);
              FutuerPredictiondegradeCount.push(FutuerPredictiondegradeValuation)

            } else if (value == 'incipient') {

              FutuerPredictionincipientValuation = FutuerPredictionincipientValuation + 1;
              FutuerPredictionincipientCount.push(FutuerPredictionincipientValuation);
              FutuerPredictionnormalCount.push(FutuerPredictionnormalValuation);
              FutuerPredictiondegradeCount.push(FutuerPredictiondegradeValuation)

            } else {

              FutuerPredictiondegradeValuation = FutuerPredictiondegradeValuation + 1;
              FutuerPredictiondegradeCount.push(FutuerPredictiondegradeValuation)
              FutuerPredictionnormalCount.push(FutuerPredictionnormalValuation);
              FutuerPredictionincipientCount.push(FutuerPredictionincipientValuation);

            }
            this.FutuerPredictionDataNormalCount = FutuerPredictionnormalCount;
            this.FutuerPredictionDataIncipientCount = FutuerPredictionincipientCount;
            this.FutuerPredictonDataDegradeCount = FutuerPredictiondegradeCount;

          });
          this.FutuerPredictionAllData.forEach(Futuerpredict => {
            this.FutuerPredictionData = Futuerpredict.Prediction;
            let FutuerPredictyeardata = { FutuerPredictyearId: 0, FutuerPredictyearname: '' };

            FutuerPredictyeardata.FutuerPredictyearname = moment(Futuerpredict.PredictedDate).format('YYYY')
            this.FutuerPredictedDate.push(FutuerPredictyeardata);
          })
          this.FuterPredictyearlist = this.FutuerPredictedDate.reduce((m, o) => {
            var found = m.find(p => p.FutuerPredictyearname === o.FutuerPredictyearname);
            if (found) {
            } else {
              m.push(o);
            }
            return m;
          }, []);

          for (var i = 0; i < this.FutuerPredictionAllData.length; i++) {
            if (this.FutuerPrediction[i] == "degarde" || this.FutuerPrediction[i] == "degrade") {
              this.FutuerPredictionDegradecount = this.FutuerPredictionDegradecount + 1
            } else if (this.FutuerPrediction[i] == "incipient") {
              this.FutuerPredictionIncipientcount = this.FutuerPredictionIncipientcount + 1
            } else if (this.FutuerPrediction[i] == "normal") {
              this.FutuerPredictionNormalcount = this.FutuerPredictionNormalcount + 1
            } else
              this.FutuerPredictionbadcount = this.FutuerPredictionbadcount + 1
          }
          this.FutuerlineChart()
           this.FutuerdDonughtchart()
          this.Futuerpiechart()
        }, error => {
          console.log(error.error)
        })
  }

  FutuergroupBy(list, keyGetter) {
    list.reduce((m, o) => {
      var found = m.find(p => p.FutuerPredictyearname === o.FutuerPredictyearname);
      if (found) { }
      else {
        m.push(o);
      }
      return m;
    },
      []);
  }

  FutuerDates() {
    let SN = this.FutuerPredictionAllData.filter(val => moment(val.PredictedDate).format('YYYY') === this.FutuerselectedYear.toString());
    this.FutuerPredictionDegradecount = 0
    this.FutuerPredictionIncipientcount = 0
    this.FutuerPredictionNormalcount = 0
    this.FutuerPredictionbadcount = 0

    for (var i = 0; i < this.FutuerPredictionAllData.length; i++) {
      if (`${this.FutuerPredictionAllData[i]}.${this.fmtype}` == "degarde") {
        this.FutuerPredictionDegradecount = this.FutuerPredictionDegradecount + 1
      } else if (`${this.FutuerPredictionAllData[i]}.${this.fmtype}` == "incipient") {
        this.FutuerPredictionIncipientcount = this.FutuerPredictionIncipientcount + 1
      } else if (`${this.FutuerPredictionAllData[i]}.${this.fmtype}` == "normal") {
        this.FutuerPredictionNormalcount = this.FutuerPredictionNormalcount + 1
      } else
        this.FutuerPredictionbadcount = this.FutuerPredictionbadcount + 1
    }

    this.FutuerlineChart()
    // this.FutuerdDonughtchart()
    this.Futuerpiechart()
    }

  FutuerlineChart() {
    this.changeDetectorRef.detectChanges();
    let FutuerdateForFilter = [];
    this.FutuerPredictionDataNormalCount = []
    this.FutuerPredictionDataIncipientCount = []
    this.FutuerPredictonDataDegradeCount = []
    for (var i = 0; i < this.FutuerPredictionAllData.length; i++) {
      if (!this.isDateInArray(new Date(this.FutuerPredictionAllData[i].PredictedDate), FutuerdateForFilter)) {
        FutuerdateForFilter.push(new Date(this.FutuerPredictionAllData[i].PredictedDate));
      }
    }
    let FutuerdateForFilter1 = [];
    FutuerdateForFilter.forEach((value) => {
      var Date = moment(value).format('YYYY-MM-DD');
      FutuerdateForFilter1.push(Date);
    });

    for (var i = 0; i < FutuerdateForFilter1.length; i++) {
      var a = [];
      this.FutuerPredictionAllData.forEach(element => {
        if (moment(element.PredictedDate).format('YYYY-MM-DD') == FutuerdateForFilter1[i]) {
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
        }
      });
      var normal = 0
      var incipient = 0
      var degrade = 0
      var bad = 0

      a.forEach((value) => {
        if (value == 'normal') {
          normal = normal + 1
        } else if (value == 'incipient') {
          incipient = incipient + 1
        } else if (value == 'degarde' || value == 'degrade') {
          degrade = degrade + 1
        } else {
          bad = bad + 1
        }
      });
      this.FutuerPredictionDataNormalCount.push(normal)
      this.FutuerPredictionDataIncipientCount.push(incipient)
      this.FutuerPredictonDataDegradeCount.push(degrade)
      this.FutuerPredictionDataBadCount.push(bad)
    }
    this.changeDetectorRef.detectChanges();
    this.chart = new Chart("BarChart", {
      type: 'bar',
      data: {
        labels: FutuerdateForFilter1,
        fill: true,
        datasets: [
          {
            label: "Normal",
            data: this.FutuerPredictionDataNormalCount,
            borderWidth: 1,
            borderColor: "#008000",
            backgroundColor: '#008000',
          }, {
            label: "Incipent",
            data: this.FutuerPredictionDataIncipientCount,
            borderWidth: 1,
            borderColor: "#FFA500",
            backgroundColor: '#FFA500',
          },
          {
            label: "Degrade",
            data: this.FutuerPredictonDataDegradeCount,
            borderWidth: 1,
            borderColor: " #FF0000",
            backgroundColor: '#FF0000',
          }
        ]
      },
      options: {
        events: [],
        scales: {
          xAxes: [{
            stacked: true,
          }],
          yAxes: [{
            stacked: true,
            ticks: {
             
            }
          }]
        }
      }
      
    });
  }

  FutuerdDonughtchart() {
    // var a: any = [];
    // this.FutuerPredictionNormalcount = 0,
    //   this.FutuerPredictionIncipientcount = 0,
    //   this.FutuerPredictionDegradecount = 0;
    // this.FutuerPredictionAllData.forEach(element => {
    //   if (this.fmtype != "") {
    //     if (this.fmtype == "SSRB") {
    //       a.push(element.SSRB)
    //     } else if (this.fmtype == "CF") {
    //       a.push(element.CF)
    //     } if (this.fmtype == "RD") {
    //       a.push(element.RD)
    //     }
    //   } else {
    //     a.push(element.Prediction)
    //   }

    // });
    // a.forEach(element => {
    //   if (element == 'normal') {
    //     this.FutuerPredictionNormalcount = this.FutuerPredictionNormalcount + 1;
    //   } else if (element == 'incipient') {
    //     this.FutuerPredictionIncipientcount = this.FutuerPredictionIncipientcount + 1;
    //   } else if (element == 'degrade' || element == 'degarde') {
    //     this.FutuerPredictionDegradecount = this.FutuerPredictionDegradecount + 1;
    //   }
    // });
    // this.chart = new Chart('donughtChart', {
    //   type: 'doughnut',
    //   data: {
    //     labels: ["Normal", "incipient", "Degrade"],
    //     datasets: [
    //       {
    //         backgroundColor: ["#008000", "#FFA500", "#FF0000"],
    //         data: [this.FutuerPredictionNormalcount, this.FutuerPredictionIncipientcount, this.FutuerPredictionDegradecount]
    //       }
    //     ]
    //   },
    //   options: {
    //     events: [],
    //   }
    // });
    this.changeDetectorRef.detectChanges();
    this.FutuerPredictionAllData.sort()
    var LabelDates : any = [];
    this.FuterPredictyearlist.forEach(element => {
     LabelDates.push(element.FutuerPredictyearname)
    });

    for(var i=0; i < this.FuterPredictyearlist.length; ++i) {
     var forcastPnormal =0
     var forcastFPincipient =0
     var forcastFPdegrade =0
     var forcastFPbad =0
     var forcastcounter = 0
     this.FutuerPredictionAllData.forEach(value => {
       var a = moment(value.PredictedDate).format('YYYY')
       if(a == this.FuterPredictyearlist[i].FutuerPredictyearname){
         if (value.Prediction == 'normal') {
          forcastPnormal = forcastPnormal + 1
         } else if (value.Prediction == 'incipient') {
          forcastFPincipient = forcastFPincipient + 1
         } else if (value.Prediction == 'degarde' || value.Prediction == 'degrade') {
          forcastFPdegrade = forcastFPdegrade + 1
         } else {
          forcastFPbad = forcastFPbad + 1
         }
         forcastcounter=forcastcounter+1
       }

      });
      forcastPnormal= ((forcastPnormal/forcastcounter)*100)
      forcastFPincipient=((forcastFPincipient/forcastcounter)*100)
      forcastFPdegrade=((forcastFPdegrade/forcastcounter)*100)
      forcastFPbad=((forcastFPbad/forcastcounter)*100)

     this.FPFinalNormal.push(forcastPnormal)
     this.FPFinalIncipient.push(forcastFPincipient)
     this.FPFinaldDegrade.push(forcastFPdegrade)
     this.FPFinalBad.push(forcastFPbad)
    
    }

   this.changeDetectorRef.detectChanges();
   this.chart = new Chart("donughtChart", {
     type:"bar",
     data: {
      labels: LabelDates,
       fill: true,
       datasets: [
         {
           label: "Normal",
           data: this.FPFinalNormal,
           borderWidth: 1,
           borderColor: "#008000",
           backgroundColor: '#008000',
           fill: true,
         }, 
         {
           label: "Incipient",
           data: this.FPFinalIncipient,
           borderWidth: 1,
           borderColor: "#FFA500",
           backgroundColor: '#FFA500',
           fill: true,
         }, 
         {
           label: "Degrade",
           data: this.FPFinaldDegrade,
           borderWidth: 1,
           borderColor: "#FF0000",
           backgroundColor: '#FF0000',
           fill: true,
         },
         {
           label: "Bad",
           data: this.FPFinalBad,
           borderWidth: 1,
           borderColor: "blue",
           backgroundColor: 'blue',
           fill: true,
         },  

       ],
     },

   });

  }


  Futuerpiechart() {
    var a: any = [];
    this.FutuerPredictionNormalcount = 0,
      this.FutuerPredictionIncipientcount = 0,
      this.FutuerPredictionDegradecount = 0;
    this.FutuerPredictionAllData.forEach(element => {
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
    var FPClassDegradepercentage
    var FPClassIncipientpercentage
    var FPClassNormalpercentage
    a.forEach(element => {
      if (element == 'normal') {
        this.FutuerPredictionNormalcount = this.FutuerPredictionNormalcount + 1;
      } else if (element == 'incipient') {
        this.FutuerPredictionIncipientcount = this.FutuerPredictionIncipientcount + 1;
      } else if (element == 'degrade' || element == 'degarde') {
        this.FutuerPredictionDegradecount = this.FutuerPredictionDegradecount + 1;
      }
    });
    FPClassDegradepercentage= ((this.FutuerPredictionDegradecount/a.length )*100).toFixed(2);
    FPClassIncipientpercentage= ((this.FutuerPredictionIncipientcount/a.length )*100).toFixed(2);
    FPClassNormalpercentage= ((this.FutuerPredictionNormalcount/a.length )*100).toFixed(2);

    this.changeDetectorRef.detectChanges();
    this.chart = new Chart('FutuerPredictionPie', {
      type: 'pie',
      data: {
        labels: ["Normal", "incipient", "Degrade"],
        datasets: [
          {
            backgroundColor: ["#008000", "#FFA500", "#FF0000"],
            data: [FPClassNormalpercentage, FPClassIncipientpercentage, FPClassDegradepercentage]
          }
        ]
      },
      options: {
        // events: [],
      }
    });
  }
  FutuerPredictionClick(){
    this.changeDetectorRef.detectChanges();
    this.GerAllFutuerPredictionRecords();
    this.FuterPredictionShow= true;
    this.PredictionShow=false;
    this.PredictionselectedYear=""
    this.fmtype =""

  }
  PredictionOnClick(){
    this.changeDetectorRef.detectChanges();
    this.GerAllPredictionRecords();
    this.FuterPredictionShow=false ;
    this.PredictionShow=true;
    this.FutuerselectedYear=""
    this.fmtype =""
  }

public csvData :any
public mergedarray:any;
public highlight_start:any
public highlight_end:any

   dygraph(){ 

        // this.chart = new Dygraph(
        //   document.getElementById("graph"),"dist/DPM/assets/actualdata.csv",
        //   {
        //     visibility: [true, false, false, true,false,false],
        //     showRangeSelector: true,
        //     connectSeparatedPoints: true,
        //   }) 

          // this.chart = new Dygraph(
          //   document.getElementById("graph1"),"dist/DPM/assets/actualdata.csv",
          //   {
          //     visibility: [false, false, false, false,false,true],
          //     showRangeSelector: true,
          //     connectSeparatedPoints: true,
          //   })



        // this.http.get("dist/DPM/assets/realdatafordygraph.csv",{responseType:'text'}).subscribe((res: any) => {
        //   console.log(res)
         
        //   this.chart = new Dygraph(
        //       document.getElementById("graph"),res,
        //       {
        //         showRangeSelector: true,
        //       })
        // } 
    

        this.http.get("/api/ScrewCompressureAPI/GetPredictionRecordsInCSVFormat").subscribe((res: any) => {
             var prediction = res;
             this.http.get(`/api/ScrewCompressorFuturePredictionAPI/GetFutuerPredictionRecordsInCSVFormat?date=${this.date}`).subscribe((res: any) => {
              var futureData = res 

              this.highlight_start = moment(res[0].date).format('YYYY/MM/DD')
              this.highlight_end = moment(this.date).format('YYYY/MM/DD')


              var result1 : any= futureData.filter(f =>
                prediction.some(d => d.Date == f.Date) 
              );

               result1.forEach(element => {
                 var d = prediction.filter(r=>r.Date === element.Date)
                 element.TD1 = d[0].TD1;
                 element.Residual = element.FTD1 - d[0].TD1            
               });
               futureData.forEach(element => {
                 if(element.TD1 == 0){
                  element.Residual = ''
                 }
               });
               prediction.forEach(element => {
                element.Residual = 0
                for (var i = 0; i < result1.length; i++) {
                  if (result1[i].Date == element.Date) {
                  element.FTD1 = result1[i].FTD1
                  element.TD1 = result1[i].TD1
                  element.Residual = result1[i].Residual
                  }
                }
              });

               const result = futureData.filter(f =>
                !prediction.some(d => d.Date == f.Date)
               );
               result.forEach(element => {
                   prediction.push(element);
               });
              //this.mergedarray = prediction.concat(result);
              prediction.forEach(element => {
                if(element.Residual === 0){
                  element.Residual = ''
                }
                if(element.TD1 === 0){
                  element.TD1 = ''
                }
                if(element.FTD1 === 0){
                  element.FTD1 = ''
                }
                if (element.TD1 > 180 && element.TD1 < 210) {
                  element.alarm = element.TD1

                } else{
                  element.alarm = ''
                }
                 if (element.TD1 > 210) {
                  element.trigger = element.TD1
                }else{
                  element.trigger = ''
                }
                if(element.FTD1 > 190 && element.FTD1 < 210) {
                  element.falarm = element.FTD1
                }
                else {
                  element.falarm = ''
                }
                if(element.FTD1 > 210) {
                  element.ftrigger = element.FTD1
                }
                else {
                  element.ftrigger = ''
                }
               }); 
               this.csvData = this.ConvertToCSV(prediction);
              //  this.csvData = this.ConvertToCSV( this.mergedarray);
               var highlight_start = new Date(this.highlight_start);
               var highlight_end = new Date(this.highlight_end);

               this.chart = new Dygraph(
                document.getElementById("graph"),this.csvData,
                {
                  colors: ['green','green', 'gray', '#FFA500','red','#FFA500','red'],
                  visibility: [true, true, false, true,true,true,true,],
                  showRangeSelector: true,
                  fillGraph:true,
                  fillAlpha: 0.1,
                  connectSeparatedPoints: false,
                  drawPoints: true,
                  strokeWidth: 1.5,
                  stepPlot: false,
                  errorbar: true,
                  drawXGrid: true,
                  valueRange: [150,250],
                  includeZero: false,
                  drawAxesAtZero: false,
                  series: {
                    'TD1': {
                      strokePattern: null,
                      drawPoints: true,
                      pointSize: 2,
                    },
                    'FTD1': {
                      strokePattern: Dygraph.DASHED_LINE,
                      strokeWidth: 2.6,
                      drawPoints: true,
                      pointSize: 3.5
                    },
                    'Residual': {
                    },
                    'alarm': {
                      strokeWidth: 2,
                    },
                    'trigger': {
                      strokePattern: Dygraph.DOT_DASH_LINE,
                      strokeWidth: 2,
                      highlightCircleSize: 3
                    },
                    'falarm': {
                      color: ['#FFA500'],
                      strokePattern: Dygraph.DASHED_LINE1,
                      strokeWidth: 1.6,
                      drawPoints: true,
                      pointSize: 2.5
                    },
                    'ftrigger': {
                      strokePattern: Dygraph.DASHED_LINE,
                      strokeWidth: 1.0,
                      drawPoints: true,
                      pointSize: 1.5
                    },
                  },
                  underlayCallback: function(canvas, area, g) {
                      var bottom_left = g.toDomCoords(highlight_start);
                      var top_right = g.toDomCoords(highlight_end); 
                 
                      var left = bottom_left[0];
                      var right = top_right[0];

                       canvas.fillStyle = "rgba(245, 252, 255)";
                      canvas.fillRect(left, area.y, right - left, area.h);
                  }
                },
                ) 
                // this.chart = new Dygraph(
                //   document.getElementById("graph1"),this.csvData,
                //   {
                //     colors: ['green', '#58508d', 'gray', '#FFA500','red','#FFA500','red',],
                //     showRangeSelector: true,
                //     connectSeparatedPoints: true,
                //     fillGraph: true,
                //     drawPoints: true,
                //     strokeWidth: 5,
                //     drawXGrid: false,
                //     visibility: [false, false, true, false,false,false,false,],
                //   },
                //   ) 

            })}
        )
   }

    ConvertToCSV(objArray) {
      var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
      var str = '';
      var row = "";
  
      for (var index in objArray[0]) {
        row += index + ',';
      }
      row = row.slice(0, -1);
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


    
  public GenerateReport() {
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

        if (ACCCalculation == NaN) {
          ACCCalculation = 0;
        }

        this.finalACCCalculation = parseFloat(ACCCalculation);
      }
      var AFPcountKey = Object.keys(this.screwWithPredictionDetails).length;
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
      }
      var LMH: any = [(0 * 1) + (1 * 5) + (0 * 10)]

      var HSECES: any = [(0 * 1) + (1 * 10)]

      var CRIT: any = [(0 * 10) + (1 * 5) + (0 * 1)]


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
}

