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
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
import { SCConstantsAPI } from "../Compressor/ScrewCompressor/shared/ScrewCompressorAPI.service";
import { ProfileConstantAPI } from "../profile/profileAPI.service";
import { PrescriptiveContantAPI } from "../prescriptive/Shared/prescriptive.constant";
import { element } from "protractor";
import { ConfigService } from "src/app/shared/config.service";
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
  public PInsertedDate = [];
  public FInsertedDate = [];
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
  public ScrewCompressorAllData: any = [];
  public ScrewCompressorFilteredData: any;
  public FailuerModetypeFilteredData: any;
  public FailuerModetypeFilteredData1: any;
  public ScrewPredictionAllData: any = [];
  public getAllFilterData: any;
  public MachineType: string = "";
  public EquipmentType: string = "";
  public TagNumber: string = "";
  public EquipmentList: any = []
  public prescriptiveRecords: any = [];
  public TagList: any = [];
  // public ETBF: string = '';
  public ETBF: number = 0;
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
  public state1: any;
  //For FutuerPrediction
  public FutuerselectedYear: string = "";
  public FutuerPredictedDate = [];
  public FuterPredictyearlist = [];
  public FutuerPredictionData: string = "";
  public FutuerPredictionAllData: any = [];
  public FutuerPredictionDataNormalCount: any = [];
  public FutuerPredictionDataIncipientCount: any = [];
  public FutuerPredictonDataDegradeCount: any = [];
  public FutuerPredictionDataBadCount: any = [];
  public FutuerPredictionDegradecount: number = 0;
  public FutuerPredictionNormalcount: number = 0;
  public FutuerPredictionIncipientcount: number = 0;
  public FutuerPredictionbadcount: number = 0;
  public FutuerPrediction: any = [];
  public PredictionShow: boolean = true;
  public FuterPredictionShow: boolean = false;

  public td2: any = [];
  public td1: any = [];
  public ts1: any = [];
  public ts2: any = [];
  public TD2Data: any = [];
  public CFPPrescriptiveId: number = 0;
  public DatesforCSV: number = 0;
  public date: string = "";
  public CBIGraphs: string = "";


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

  public FinalNormal: any = []
  public FinalIncipient: any = []
  public FinaldDegrade: any = []
  public FinalBad: any = []


  public FPFinalNormal: any = []
  public FPFinalIncipient: any = []
  public FPFinaldDegrade: any = []
  public FPFinalBad: any = []

  public forcastFinalNormal: any = []
  public forcastFinalIncipient: any = []
  public forcastFinaldDegrade: any = []
  public forcastFinalBad: any = []


  public ClassDegradepercentageForMessage: any = []
  public ClassIncipientpercentageForMessage: any = []
  public ClassNormalpercentageForMessage: any = []
  public ClassbadpercentageForMessage: any = []  

  public ClassDegradepercentage = 0
  public ClassIncipientpercentage = 0
  public ClassNormalpercentage = 0
  public Classbadpercentage = 0

  public csvData: any
  public mergedarray: any;
  public highlight_start: any
  public highlight_end: any

  public SCFinalNormal: any = []
  public SCFinalIncipient: any = []
  public SCFinaldDegrade: any = []
  public SCFinalBad: any = []
  public RiskMatrixLibraryRecords: any = [];
  public EconmicConsequenceClass: string = "";
  public CriticalityRating: string = "";
  public MaintenanceStrategyList: any = [];
  public SavedPCRRecordsList: any = [];
  public SkillLibraryAllrecords: any = [];
  public PSRClientContractorData: any = [];
  public UserProductionCost: number = 0;

  public Skill_risk_Graph: boolean = false;
  public MEI_risk_Graph: boolean = false;
  public residual_risk_Graph: boolean = false;
  public ecomomic_risk_Graph: boolean = false;
  public UserData: any = []
  private userModel: any;
  private SkillLibraryData: any = [];
  public PSRModel: any = [];
  public showcbi: boolean = false;


  constructor(private title: Title,
    private http: HttpClient,
    public router: Router,
    private messageService: MessageService,
    private dashboardBLService: CommonBLService,
    private dashboardContantAPI: DashboardConstantAPI,
    private dashboardContantMethod: CommonBLService,
    private changeDetectorRef: ChangeDetectorRef,
    private screwCompressorAPIName: SCConstantsAPI,
    private screwCompressorMethod: CommonBLService,
    private profileAPIName: ProfileConstantAPI,
    private commonBLervice: CommonBLService,
    private PSRAPIs: PrescriptiveContantAPI,
    private configService: ConfigService,
    private location: Location,
    private route: ActivatedRoute,

    public commonLoadingDirective: CommonLoadingDirective,) {
    this.title.setTitle('Dashboard | Dynamic Prescriptive Maintenence');
    this.state = window.history.state;
    if (!!this.state.CFPPrescriptiveId) {
      this.CFPPrescriptiveId = this.state.CFPPrescriptiveId;
      this.ETBF = this.state.ETBF
      this.CBAWithId(this.CFPPrescriptiveId)
    }
    this.date = moment().add(1, 'days').format('YYYY-MM-DD');
    this.GetReportRecords()
    this.userModel = JSON.parse(localStorage.getItem('userObject'));
    this.GetPSRClientContractorData();
    this.getUserSkillRecords();
    this.getPrescriptiveRecords()
    this.getUserDetails()
    this.FullCBAObject()
    
  }


  ngOnInit() {
    // this.getRecordsByEqui()
    this.showReport()
    this.GetAllRecords()
    this.MachineEquipmentSelect();
    this.getAllRecordsbyTag();
    this.GerAllPredictionRecords();
    this.dygraph()
    this.ComboDates()
    this.CBICharts()
    // this.PredictionAllRecordBarcharts1()

  }

  public CBI_etbf: number = 0;
  public ETBFWithConstraint: number = 0;
  public MEIWithDPMWithConstraint: number = 0;
  public MEIWithDPMWithoutConstraint: number = 0;
  public MEIWithoutDPM: number = 0;
  public OverallETBC: number = 0;
  public TotalAnnualCostWithMaintenance: number = 0;
  public TotalAnnualPOC: number = 0;
  public TotalPONC: number = 0;
  public VendorETBC: number = 0;

  public EconomicRiskWithDPM: number = 0;
  public EconomicRiskWithOutDPM: number = 0;
  public EconomicRiskWithConstraintDPM: number = 0;

  public ResidualRiskWithDPM: number = 0;
  public ResidualRiskWithOutDPM: number = 0;
  public ResidualRiskWithConstraintDPMCR: number = 0;
  public fullCBAobject:any=[]

  public EconomicRiskWithDPMCR: string = "";
  displayModal: boolean;
  displayBasic: boolean;
  getUserDetails() {
    if (!!localStorage.getItem('CBAOBJ')) {
      this.UserData = JSON.parse(localStorage.getItem('CBAOBJ'));
      this.CBI_etbf = JSON.parse(localStorage.getItem('CBAOBJ')).ETBF;
      this.OverallETBC = JSON.parse(localStorage.getItem('CBAOBJ')).OverallETBC;
      this.TotalAnnualPOC = JSON.parse(localStorage.getItem('CBAOBJ')).TotalAnnualPOC;
      this.TotalPONC = JSON.parse(localStorage.getItem('CBAOBJ')).TotalPONC;
      this.VendorETBC = JSON.parse(localStorage.getItem('CBAOBJ')).VendorETBC;
      this.EconomicRiskWithDPMCR = JSON.parse(localStorage.getItem('CBAOBJ')).EconomicRiskWithDPMCR;

      this.EconomicRiskWithDPM = JSON.parse(localStorage.getItem('CBAOBJ')).EconomicRiskWithDPM;
      this.EconomicRiskWithOutDPM = JSON.parse(localStorage.getItem('CBAOBJ')).EconomicRiskWithOutDPM;
      this.EconomicRiskWithConstraintDPM = JSON.parse(localStorage.getItem('CBAOBJ')).EconomicRiskWithDPMConstraint;

      this.MEIWithDPMWithoutConstraint = JSON.parse(localStorage.getItem('CBAOBJ')).MEIWithDPM;
      this.MEIWithDPMWithConstraint = JSON.parse(localStorage.getItem('CBAOBJ')).MEIWithDPMConstraint;
      this.MEIWithoutDPM = JSON.parse(localStorage.getItem('CBAOBJ')).MEIWithoutDPM;

      this.ResidualRiskWithDPM = JSON.parse(localStorage.getItem('CBAOBJ')).EconomicRiskWithDPMCRValue;
      this.ResidualRiskWithOutDPM = JSON.parse(localStorage.getItem('CBAOBJ')).EconomicRiskWithOutDPMCRValue;
      this.ResidualRiskWithConstraintDPMCR = JSON.parse(localStorage.getItem('CBAOBJ')).EconomicRiskWithDPMConstraintCRValue;
    
      this.showcbi = true;

    }
  }
  public SelectTagNumbers: string = "";
  public PredictiongraphShow:boolean=false;
  public PredictiongraphShow1:boolean=false;
  public myObj : any =[];
  public centrifugalmssmodel:any =[]
  public centrifugalmssmodelFilter:any =[]
  public MSSCount:any = []
  public GDECount:number =0
  public notification = null
  FullCBAObject(){
      this.fullCBAobject = JSON.parse(localStorage.getItem('CBAOBJ')).FullObject;
       this.myObj = JSON.parse(this.fullCBAobject);
       this.centrifugalmssmodel= this.myObj.CentrifugalPumpMssModel
       var MSScount:number=0
       var GDEcount:number=0
          this.centrifugalmssmodel.forEach((element) => { 
            if(element.CentrifugalPumpMssId === "MSS"){
               MSScount= MSScount + 1
            }else if(element.CentrifugalPumpMssId === "GDE"){
               this.GDECount = this.GDECount+1
            }
          
        }
        )
       this.MSSCount.push(MSScount)
       const ids = this.centrifugalmssmodel.map(o => o.MSSIntervalSelectionCriteria)
       this.centrifugalmssmodelFilter= this.centrifugalmssmodel.filter(({MSSIntervalSelectionCriteria}, index) => !ids.includes(MSSIntervalSelectionCriteria, index + 1))
       this.centrifugalmssmodel.forEach((element) => { 
       if(element.CentrifugalPumpMssId= "MSS"){
        this.notification = { class: 'text-warning', };
       }else  if(element.CentrifugalPumpMssId= "GDE"){
        this.notification = { class: 'text-warning', };
       }
       })
    }

   

    // showNotification(notification) {
    //   switch (notification) {
    //     case '':
    //        this.notification = { class: '',};
    //       break; 
    //     case 'MSS':
    //        this.notification = { class: 'text-success', };
    //       break;
    //     case 'GDE':
    //        this.notification = { class: 'text-success',  };
    //       break;
    //     case 'New':
    //        this.notification = { class: 'text-primary', };
    //       break;
    //     case 'FMEA':
    //        this.notification = { class: 'text-danger', };
    //       break;
    //     default:
    //       break;
    //   }
      
  
    // }
  TagNumberSelsection(){
    if(this.SelectTagNumbers =="K100"){
      this.PredictiongraphShow=true;
      this.PredictiongraphShow1=true;
      this.PredictionWithTagNumber()
      this.PredictionWithActionPieChart()
      this.PredictionWithAlertPieChart ()  
    }
  }
  showBasicDialog() {
    this.displayBasic = true;
  }
  getPrescriptiveRecords() {
    this.http.get('api/PrescriptiveAPI/GetTagNumber')
      .subscribe((res: any) => {
        this.PrescriptiveRecordsList = res;
        this.MachineType = this.PrescriptiveRecordsList[0].MachineType
        this.EquipmentType = this.PrescriptiveRecordsList[0].EquipmentType
        this.SelectedTagNumber = this.PrescriptiveRecordsList[0].TagNumber
        // this.SelectedTagNumber= this.PrescriptiveRecordsList[11].TagNumber
        this.getRecordsByEqui()
      });
  }
  RouteToTrain() {
    this.router.navigateByUrl('/Home/Compressor/ScrewTrain');
  }
  RouteToPredict() {
    this.router.navigateByUrl('/Home/Compressor/ScrewPrediction');
  }
  RouteToCostBenifit() {
    this.router.navigateByUrl('/Home/CostBenefitAnalysis');
  }
  ComboDates() {
    if (this.date == "1Week") {
      this.date = moment().add(7, 'days').format('YYYY-MM-DD');
      this.dygraph()
    } else if (this.date == "15days") {
      this.date = moment().add(15, 'days').format('YYYY-MM-DD');
      this.dygraph()
    } else if (this.date == "1Month") {
      this.date = moment().add(30, 'days').format('YYYY-MM-DD');
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
  public RecommendationAlertMessage : string = "";
  public RecommendationAlertEnable : boolean = false;
  public RecommendationAlertMessagelength
  public Degrademessagecount: number = 0;
  public Normalemessagecount: number = 0;
  public Incipientemessagecount: number = 0;
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
          var Data: any = []
          Data = res;
          Data.sort((a, b) => (moment(a.InsertedDate) > moment(b.InsertedDate) ? 1 : -1));
          Data.reverse();
          var incipient = 0, degrade = 0, normal = 0;
          var counter: number = 0;
          for (let index = 0; index < Data.length; index++) {
            if ((Data[index].Prediction).toLowerCase() === 'normal') {
              normal = normal + 1;
            } else if ((Data[index].Prediction).toLowerCase() === 'incipient') {
              incipient = incipient + 1;
            } else if ((Data[index].Prediction).toLowerCase() === 'degrade' || (Data[index].Prediction).toLowerCase() === 'degarde') {
              degrade = degrade + 1;
            }
            counter = counter + 1;
            if (counter === 97) {
              if (degrade > 6) {
                this.RecommendationAlertMessage = 'Machine starts degrading, RCA is recomended';
                this.Degrademessagecount = this.Degrademessagecount+1
                this.RecommendationAlertEnable = true;
              } else if (incipient > 6) {
                this.RecommendationAlertMessage ='RCM is recomended';
                 this.Incipientemessagecount = this.Incipientemessagecount+1
                this.RecommendationAlertEnable = true;
              }else{
                this.RecommendationAlertEnable = false;
              }
             break;
            }
            this.PredictionWithAlertPieChart()
          }
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
            this.PInsertedDate.push(Predictyeardata);
          })
          this.Predictyearlist = this.PInsertedDate.reduce((m, o) => {
            var found = m.find(s => s.Predictyearname === o.Predictyearname);
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
          Degradepercentage = (this.Degradecount / this.ScrewPredictionAllData.length) * 100
          Incipientpercentage = (this.Incipientcount / this.ScrewPredictionAllData.length) * 100
          Normalpercentage = (this.Normalcount / this.ScrewPredictionAllData.length) * 100

          this.PredictionAllRecordDonught();
          this.PredictionAllRecordBarcharts();
          this.PredictionAllRecordPie();
          this.GenerateReport()
          this.TagNumberSelsection()
          // this.PredictionWithTagNumber()
          // this.PredictionWithActionPieChart()
        }, error => {
          console.log(error.error)
        })
  }
  groupByPredict(list,) {
    list.reduce((m, o) => {
      var found1 = m.find(s => s.Predictyearname === o.Predictyearname);
      if (found1) { }
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

    // for (var i = 0; i < this.ScrewPredictionAllData.length; i++) {
    //   if (`${this.ScrewPredictionAllData[i]}.${this.fmtype}` == "degarde") {
    //     this.PredictionDegradecount = this.PredictionDegradecount + 1
    //   } else if (`${this.ScrewPredictionAllData[i]}.${this.fmtype}` == "incipient") {
    //     this.PredictionIncipientcount = this.PredictionIncipientcount + 1
    //   } else if (`${this.ScrewPredictionAllData[i]}.${this.fmtype}` == "normal") {
    //     this.PredictionNormalcount = this.PredictionNormalcount + 1
    //   } else
    //     this.Predictionbadcount = this.Predictionbadcount + 1
    // }
    for (var i = 0; i < this.ScrewPredictionAllData.length; i++) {
      if (`${this.ScrewPredictionAllData[i]}.${this.fmtype =="SSRB" || this.fmtype =="CF" || this.fmtype =="RD"}` == "degarde") {
        this.PredictionDegradecount = this.PredictionDegradecount + 1
      } else if (`${this.ScrewPredictionAllData[i]}.${this.fmtype =="SSRB" || this.fmtype =="CF" || this.fmtype =="RD"}` == "incipient") {
        this.PredictionIncipientcount = this.PredictionIncipientcount + 1
      } else if (`${this.ScrewPredictionAllData[i]}.${this.fmtype =="SSRB" || this.fmtype =="CF" || this.fmtype =="RD"}` == "normal") {
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
      if (`${this.ScrewPredictionAllData[i]}.${this.fmtype =="SSRB" || this.fmtype =="CF" || this.fmtype =="RD"}` == "degarde") {
        this.PredictionDegradecount = this.PredictionDegradecount + 1
      } else if (`${this.ScrewPredictionAllData[i]}.${this.fmtype =="SSRB" || this.fmtype =="CF" || this.fmtype =="RD"}` == "incipient") {
        this.PredictionIncipientcount = this.PredictionIncipientcount + 1
      } else if (`${this.ScrewPredictionAllData[i]}.${this.fmtype =="SSRB" || this.fmtype =="CF" || this.fmtype =="RD"}` == "normal") {
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
            this.TD2Data.push(this.td2)

            this.FailuerModetypeFilteredData1 = { FMId: 0, FMname: '' };
            this.FailuerModetypeFilteredData1.FMname = r.FailureModeType
            this.XYZ.push(this.FailuerModetypeFilteredData1);

            let newyeardata = { yearId: 0, yearname: '' };
            newyeardata.yearname = moment(r.InsertedDate).format('YYYY')
            this.InsertedDate.push(newyeardata);
          })
          this.yearlist = this.InsertedDate.reduce((m, k) => {
            var found = m.find(p => p.yearname === k.yearname);
            if (found) {
            } else {
              m.push(k);
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
          ClassDegradepercentage = ((this.Degradecount / this.ScrewCompressorAllData.length) * 100).toFixed(2);
          ClassIncipientpercentage = ((this.Incipientcount / this.ScrewCompressorAllData.length) * 100).toFixed(2);
          ClassNormalpercentage = ((this.Normalcount / this.ScrewCompressorAllData.length) * 100).toFixed(2);

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

  groupBy(list1, keyGetter) {
    list1.reduce((m, k) => {
      var found = m.find(p => p.yearname === k.yearname);
      if (found) { }
      else {
        m.push(k);
      }
      return m;
    },
      []);
  }
  groupBy1(list2, keyGetter) {
    list2.reduce((s, n) => {
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
    // if (this.fmtype != "" && this.selectedYear == "") {
    //   this.ScrewCompressorAllData = this.ScrewCompressorFilteredData.filter(val => (val.FailureModeType === this.fmtype.toString()));
    // } else if (this.fmtype != "" && this.selectedYear != "") {
    //   this.ScrewCompressorAllData = this.ScrewCompressorFilteredData.filter(val => (val.FailureModeType === this.fmtype.toString()) && moment(val.InsertedDate).format('YYYY') === this.selectedYear.toString());
    // }
    if (this.fmtype == "SSRB" || this.fmtype == "CF" || this.fmtype == "RD"  && this.selectedYear == "") {
      this.ScrewCompressorAllData = this.ScrewCompressorFilteredData.filter(val => (val.FailureModeType === "SSRB") || (val.FailureModeType === "CF") || (val.FailureModeType === "RD"));
    } else if (this.fmtype != "SSRB"  && this.selectedYear != "") {
      this.ScrewCompressorAllData = this.ScrewCompressorFilteredData.filter(val => (val.FailureModeType === "SSRB" ) && moment(val.InsertedDate).format('YYYY') === this.selectedYear.toString());
    } else if (this.fmtype != "RD"  && this.selectedYear != "") {
      this.ScrewCompressorAllData = this.ScrewCompressorFilteredData.filter(val => (val.FailureModeType === "RD" ) && moment(val.InsertedDate).format('YYYY') === this.selectedYear.toString());
    } else if (this.fmtype != "CF"  && this.selectedYear != "") {
      this.ScrewCompressorAllData = this.ScrewCompressorFilteredData.filter(val => (val.FailureModeType === "CF" ) && moment(val.InsertedDate).format('YYYY') === this.selectedYear.toString());
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
  public PrescriptiveRecordsList: any = [];
  MachineEquipmentSelect() {
    if (this.MachineType == "Pump") {
      this.EquipmentList = []
      this.EquipmentList = ["Centrifugal Pump"]
    }
    if (this.MachineType == "Compressor") {
      this.EquipmentList = []
      this.EquipmentList = ["Screw Compressor"]
    }

    var list = this.PrescriptiveRecordsList.filter(r => r.EquipmentType === this.EquipmentType)
    this.TagList = []
    list.forEach(element => {
      this.TagList.push(element.TagNumber)
    });
  }
  getAllRecordsbyTag() {
    this.http.get('api/PrescriptiveAPI/GetTagNumber')
      .subscribe((res: any) => {
        res.forEach(element => {
          this.TagList.push(element.TagNumber)
        });
      });
  }

  CBAWithId(CFPPrescriptiveId) {
    const params = new HttpParams()
      .set("cfprescriptiveId", CFPPrescriptiveId)
    var url: string = this.dashboardContantAPI.CBARecorsWithId
    this.dashboardContantMethod.getWithParameters(url, params)
      .subscribe((res: any) => {
        this.prescriptiveRecords = []
        this.prescriptiveRecords = res;
        this.DynamicCBA(res)
      }, err => {
        console.log(err.err);
      });
  }
  public etbf_Values: number = 0
  DynamicCBA(res) {
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
      this.etbf_Values = row.ETBF
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

    // this.CostRisk = true;
    //  this.gaugechartwithDPM()
    //  this.gaugechartwithoutDPM()
    this.CBICharts()
    this.ALLGraphCBA()
  }

  getRecordsByEqui() {
    if (this.MachineType && this.EquipmentType && this.SelectedTagNumber) {
      this.prescriptiveRecords = [];
      this.http.get(`api/PrescriptiveAPI/GetPrescriptiveByEquipmentType?machine=${this.MachineType}&Equi=${this.EquipmentType}&TagNumber=${this.SelectedTagNumber}`)
        .subscribe((res: any) => {
          this.prescriptiveRecords = []
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
    var x = this.DPMMEI * 100
    var y: number = + this.DPMMEI
    var z: number = +this.DPMWithoutMEI
    var w: number = y + z
    var WithDPM_MEI = (x / w).toFixed(0)

    var xcost = this.DPMCost * 100
    var ycost: number = + this.DPMCost
    var zcost: number = +this.DPMWithoutCost
    var wcost: number = ycost + zcost
    var WithDPM_Cost = (xcost / wcost).toFixed(0)
    this.changeDetectorRef.detectChanges();
    // this.chart = new Chart('gaugechart', {
    //   type: 'doughnut',
    //   data: {
    //      labels: ['DPM_With_MEI','DPM_Cost'],
    //     datasets: [
    //       {
    //         data: [WithDPM_MEI,WithDPM_Cost],
    //         backgroundColor: ['purple','blueviolet'],
    //         fill: false
    //       },
    //     ]
    //   },
    //   options: {
    //     circumference: 1 * Math.PI,
    //     rotation: 1 * Math.PI,
    //     cutoutPercentage: 70
    //   }
    // });

    this.chart = new Chart('gaugechart', {
      type: 'bar',
      data: {
        datasets: [
          {
            label: "DPM_With_MEI (Benefit)",
            data: [WithDPM_MEI],
            backgroundColor: ['purple '],
            fill: true,
            barPercentage: 12,
            barThickness: 30,
            maxBarThickness: 38,
          },
          {
            label: "Total Cost",
            data: [WithDPM_Cost],
            backgroundColor: ['blueviolet'],
            fill: true,
            barPercentage: 12,
            barThickness: 30,
            maxBarThickness: 28,
          },
          {
            label: " Economic Risk",
            data: [3,],
            backgroundColor: ['red'],
            fill: true,
            barPercentage: 12,
            barThickness: 30,
            maxBarThickness: 38,
          },

        ],
        options: {
          scales: {
            yAxes: [{
              ticks: {
                steps: 10,
                stepValue: 5,
                max: 100,
                beginAtZero: true
              }
            }]
          }
        }
      },
    });


  }
  gaugechartwithoutDPM() {

    var x = this.DPMMEI * 100
    var y: number = + this.DPMMEI
    var z: number = +this.DPMWithoutMEI
    var w: number = y + z
    var WithDPM_MEI = (x / w).toFixed(0)

    var xcost = this.DPMCost * 100
    var ycost: number = + this.DPMCost
    var zcost: number = +this.DPMWithoutCost
    var wcost: number = ycost + zcost
    var WithDPM_Cost = (xcost / wcost).toFixed(0)
    this.changeDetectorRef.detectChanges();

    var a = this.DPMWithoutMEI * 100
    var b: number = + this.DPMWithoutMEI
    var c: number = +this.DPMMEI
    var d: number = b + c
    var WithoutDPM_MEI = (a / d).toFixed(0)

    var acost = this.DPMWithoutCost * 100
    var bcost: number = + this.DPMWithoutCost
    var ccost: number = +this.DPMCost
    var dcost: number = bcost + ccost
    var WithoutDPM_Cost = (acost / dcost).toFixed(0)

    this.changeDetectorRef.detectChanges();
    // this.chart = new Chart('canvasDPM', {
    //   type: 'doughnut',
    //   data: {
    //        labels: ['DPM_Without_MEI','WithoutDPM_Cost'],
    //     datasets: [
    //       {
    //         label: "DPM_With_MEI",
    //         data: [WithoutDPM_MEI,WithoutDPM_Cost],
    //         backgroundColor: ['purple','blueviolet'],
    //         fill: false
    //       },
    //     ]
    //   },
    //   options: {
    //     circumference: 1 * Math.PI,
    //     rotation: 1 * Math.PI,
    //     cutoutPercentage: 70
    //   }
    // });

    this.chart = new Chart('canvasDPM', {
      type: 'bar',
      data: {
        datasets: [
          {
            label: "WithoutDPM_MEI (Benefit)",
            data: [WithoutDPM_MEI],
            backgroundColor: ['purple '],
            fill: true,
            barPercentage: 12,
            barThickness: 30,
            maxBarThickness: 38,
          },
          {
            label: "Total Cost",
            data: [WithoutDPM_Cost],
            backgroundColor: ['blueviolet'],
            fill: true,
            barPercentage: 12,
            barThickness: 30,
            maxBarThickness: 38,
          },
          {
            label: "Economic Risk",
            data: [9],
            backgroundColor: ['red'],
            fill: true,
            barPercentage: 12,
            barThickness: 30,
            maxBarThickness: 38,
          },

        ],
        options: {
          scales: {
            yAxes: [{
              ticks: {
                steps: 10,
                stepValue: 1,
                max: 100,
                beginAtZero: true
              }
            }]
          }
        }
      },
    });
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
        a.push(element.Classification)
      }

    });

    var precetagedegrade
    var precetageincipient
    var precetagenornal
    var precetagebad
    for (var i = 0; i < this.yearlist.length; ++i) {
      var SCcounter = 0
      this.ScrewCompressorAllData.forEach(value => {
        var a = moment(value.InsertedDate).format('YYYY')
        if (a == this.yearlist[i].yearname) {
          if (value.Classification == 'normal') {
            this.Normalcount = this.Normalcount + 1
          } else if (value.Classification == 'incipient') {
            this.Incipientcount = this.Incipientcount + 1
          } else if (value.Classification == 'degarde' || value.Classification == 'degrade') {
            this.Degradecount = this.Degradecount + 1
          } else {
            this.badcount = this.badcount + 1
          }
          SCcounter = SCcounter + 1
        }

      });
      this.ClassDegradepercentage = (this.Degradecount / this.ScrewCompressorAllData.length) * 100
      this.ClassIncipientpercentage = (this.Incipientcount / this.ScrewCompressorAllData.length) * 100
      this.ClassNormalpercentage = (this.Normalcount / this.ScrewCompressorAllData.length) * 100
      this.Classbadpercentage = (this.badcount / this.ScrewCompressorAllData.length) * 100

       this.ClassDegradepercentageForMessage =this.ClassDegradepercentage
       this.ClassIncipientpercentageForMessage= this.ClassIncipientpercentage
       this.ClassNormalpercentageForMessage =this.ClassNormalpercentage 
       this.ClassbadpercentageForMessage =this.Classbadpercentage 

        precetagedegrade =this.ClassDegradepercentage.toFixed()
        precetageincipient= this.ClassIncipientpercentage.toFixed()
        precetagenornal =this.ClassNormalpercentage.toFixed() 
        precetagebad =this.Classbadpercentage.toFixed() 
    }
    


    this.chart = new Chart('canvasClass', {
      type: 'doughnut',
      data: {
        labels: ["Normal", "Incipient", "Degrade","Bad"],
        datasets: [
          {
            backgroundColor: ["#008000", "#ffb801", "#fe4c61","blue"],
            data: [precetagenornal, precetageincipient, precetagedegrade,precetagebad],
          }
        ]
      },
      options: {
        // events: [],
        animation: {
          duration: 500,
          easing: "easeOutQuart",
          onComplete: function () {
            var ctx = this.chart.ctx;
            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
      
            this.data.datasets.forEach(function (dataset) {
              for (var i = 0; i < dataset.data.length; i++) {
                var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                    total = dataset._meta[Object.keys(dataset._meta)[0]].total,
                    mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius)/2,
                    start_angle = model.startAngle,
                    end_angle = model.endAngle,
                    mid_angle = start_angle + (end_angle - start_angle)/2;
      
                var x = mid_radius * Math.cos(mid_angle);
                var y = mid_radius * Math.sin(mid_angle);
      
                ctx.fillStyle = '#fff';
                if (i == 3){ 
                  ctx.fillStyle = '#444';
                }
                var percent = String(Math.round(dataset.data[i]/total*100)) + "%";
                ctx.fillText(percent, model.x + x, model.y + y + 15);
              }
            });               
          }
        }
      }
    });

  }

  ClassificationOfAllpolarchart() {
    this.changeDetectorRef.detectChanges();
    this.ScrewCompressorAllData.sort()
    var LabelDates: any = [];
    this.yearlist.forEach(element => {
      LabelDates.push(element.yearname)
      LabelDates.sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
    });

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
        a.push(element.Classification)
      }

    });

    for (var i = 0; i < this.yearlist.length; ++i) {
      var SCFPnormal = 0
        var SCFPincipient = 0
        var SCFPdegrade = 0
        var SCFPbad = 0
        var SCcounter = 0
      
      this.ScrewCompressorAllData.forEach(value => {
        var a = moment(value.InsertedDate).format('YYYY')
        if (a == this.yearlist[i].yearname) {
          if (value.Classification == 'normal') {
            SCFPnormal = SCFPnormal + 1
          } else if (value.Classification == 'incipient') {
            SCFPincipient = SCFPincipient + 1
          } else if (value.Classification == 'degarde' || value.Classification == 'degrade') {
            SCFPdegrade = SCFPdegrade + 1
          } else {
            SCFPbad = SCFPbad + 1
          }
          SCcounter = SCcounter + 1
        }

      });
      var precetagedegrade
      var precetageincipient
      var precetagenornal
      var precetagebad

      SCFPnormal = ((SCFPnormal / SCcounter) * 100)
      SCFPincipient = ((SCFPincipient / SCcounter) * 100)
      SCFPdegrade = ((SCFPdegrade / SCcounter) * 100)
      SCFPbad = ((SCFPbad / SCcounter) * 100)

      precetagedegrade  =SCFPdegrade.toFixed()
      precetageincipient =SCFPincipient.toFixed()
      precetagenornal =SCFPnormal.toFixed()
      precetagebad = SCFPbad.toFixed() 

      this.SCFinalNormal.push(precetagenornal)
      this.SCFinalIncipient.push(precetageincipient)
      this.SCFinaldDegrade.push(precetagedegrade)
      this.SCFinalBad.push(precetagebad)
    }

    this.changeDetectorRef.detectChanges();
    this.chart = new Chart("polarArea", {
      type: "bar",
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
            borderColor: "#ffb801",
            backgroundColor: '#ffb801',
            fill: true,
          },
          {
            label: "Degrade",
            data: this.SCFinaldDegrade,
            borderWidth: 1,
            borderColor: "#fe4c61",
            backgroundColor: '#fe4c61',
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
      options: {
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Years'
            },
            gridLines: {
              display: false,
              labelString: 'Years'
            }, 
          }],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Percentage'
              },
              ticks: {
                beginAtZero: true
              },
              gridLines: {
                display: false
              },  
            }
          ]
        },
        "animation": {
          "duration": 1,
          "onComplete": function () {
            var chartInstance = this.chart,
              ctx = chartInstance.ctx;
            this.data.datasets.forEach(function (dataset, i) {
              var meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function (bar, index) {
                var data = dataset.data[index];
                if (data > 0) {
                  ctx.fillText(data, bar._model.x, bar._model.y - 5);
               }
              });
            });
          }
        },
      }
    });
  }

  AllRecordBarcharts() {
    this.changeDetectorRef.detectChanges();
    if (this.state.TrainnNavigate == 2) {
      var elmnt = document.getElementById("Trainnavigate");
      elmnt.scrollIntoView();
    }
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
      dateForFilter1.sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
    });
    var SCcounter = 0
    for (var i = 0; i < dateForFilter1.length; i++) {
      var a = [];
      this.ScrewCompressorAllData.forEach(element => {
        if (moment(element.InsertedDate).format('YYYY-MM-DD') == dateForFilter1[i]) {
          a.push(element.Classification)
        }
        SCcounter = SCcounter + 1
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
            backgroundColor: "#ffb801",
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
            backgroundColor: "#fe4c61",
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
          events: [], 
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Days'
            },
            gridLines: {
              display: false,
            },
            stacked: true, 
          }],
          yAxes: [
            {
              scaleLabel: {
                stacked: true,
                display: true,
                labelString: 'Recoreded Data In Numbers'
              },
              ticks: {
                beginAtZero: true,
                max:12,
              },
              gridLines: {
                display: false
              },  
            }
          ]
        },
        // "animation": {
        //   "duration": 1,
        //   "onComplete": function () {
        //     var chartInstance = this.chart,
        //       ctx = chartInstance.ctx;
        //     this.data.datasets.forEach(function (dataset, i) {
        //       var meta = chartInstance.controller.getDatasetMeta(i);
        //       meta.data.forEach(function (bar, index) {
        //         var data = dataset.data[index];
        //         if (data > 0) {
        //           ctx.fillText(data, bar._model.x, bar._model.y - 5);
        //        }
        //       });
        //     });
        //   }
        // },
      }
 
    });
  }

  PredictionAllRecordDonught() {
    this.changeDetectorRef.detectChanges();
    this.ScrewPredictionAllData.sort()

    var LabelDatess: any = [];
    this.Predictyearlist.forEach(element => {
      LabelDatess = LabelDatess.filter(function (element) {
        return element !== undefined;
      });
      LabelDatess.push(element.Predictyearname)
      LabelDatess.sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
    });

    for (var i = 0; i < this.Predictyearlist.length; ++i) {
      var FPnormal = 0
      var FPincipient = 0
      var FPdegrade = 0
      var FPbad = 0
      var counter = 0
      this.ScrewPredictionAllData.forEach(value => {
        var a = moment(value.InsertedDate).format('YYYY')
        if (a == this.Predictyearlist[i].Predictyearname) {
          if (value.Prediction == 'normal') {
            FPnormal = FPnormal + 1
          } else if (value.Prediction == 'incipient') {
            FPincipient = FPincipient + 1
          } else if (value.Prediction == 'degarde' || value.Prediction == 'degrade') {
            FPdegrade = FPdegrade + 1
          } else {
            FPbad = FPbad + 1
          }
          counter = counter + 1
        }

      });
      var fperc_Incipient  
      var fperc_Normal
      var fperc_Degrade
      var fperc_Bad
      FPnormal = ((FPnormal / counter) * 100)
      FPincipient = ((FPincipient / counter) * 100)
      FPdegrade = ((FPdegrade / counter) * 100)
      FPbad = ((FPbad / counter) * 100)

       fperc_Incipient = FPnormal.toFixed()
       fperc_Normal= FPincipient.toFixed()
       fperc_Degrade= FPdegrade.toFixed()
       fperc_Bad= FPbad.toFixed()

      this.FPFinalNormal.push(fperc_Normal)
      this.FPFinalIncipient.push(fperc_Incipient)
      this.FPFinaldDegrade.push(fperc_Degrade)
      this.FPFinalBad.push(fperc_Bad)

    }

    this.changeDetectorRef.detectChanges();
    this.chart = new Chart("PredictioncanvasClass", {
      type: "bar",
      data: {
        labels: LabelDatess,
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
            borderColor: "#ffb801",
            backgroundColor: '#ffb801',
            fill: true,

          },
          {
            label: "Degrade",
            data: this.FPFinaldDegrade,
            borderWidth: 1,
            borderColor: "#fe4c61",
            backgroundColor: '#fe4c61',
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
      options: {
        scales: {
          xAxes: [{
            gridLines: {
              display: false
            }, 
          }],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'In_Percentage'
              },
              ticks: {
                beginAtZero: true,
                gridLines: {
                  display:false
                },
              }
            }
          ]
        },
        "animation": {
          "duration": 1,
          "onComplete": function () {
            var chartInstance = this.chart,
              ctx = chartInstance.ctx;
            this.data.datasets.forEach(function (dataset, i) {
              var meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function (bar, index) {
                var data = dataset.data[index];
                if (data > 0) {
                  ctx.fillText(data, bar._model.x, bar._model.y - 5);
               }
              });
            });
          }
        },
      }

    });
  }
  
public predictionDegradeMessage:any=[]
public predictionIncipientMessage:any=[]
public predictionNormalMessage:any=[]


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
    Degradepercentage = ((this.PredictionDegradecount / a.length) * 100).toFixed(2);
    Incipientpercentage = ((this.PredictionIncipientcount / a.length) * 100).toFixed(2);
    Normalpercentage = ((this.PredictionNormalcount / a.length) * 100).toFixed(2);

    this.predictionDegradeMessage = Degradepercentage
    this.predictionIncipientMessage = Incipientpercentage
    this.predictionNormalMessage = Normalpercentage

    this.changeDetectorRef.detectChanges();
    this.chart = new Chart("PredictionPie", {
      type: 'pie',
      data: {
        labels: ["Normal", "Incipient", "Degrade"],
        fill: true,
        datasets: [
          {
            backgroundColor: ["#008000", "#ffb801", "#fe4c61"],
            data: [Normalpercentage, Incipientpercentage, Degradepercentage]
          }
        ]
      },
      options: {
        // events: [],
        animation: {
          duration: 500,
          easing: "easeOutQuart",
          onComplete: function () {
            var ctx = this.chart.ctx;
            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
      
            this.data.datasets.forEach(function (dataset) {
              for (var i = 0; i < dataset.data.length; i++) {
                var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                    total = dataset._meta[Object.keys(dataset._meta)[0]].total,
                    mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius)/2,
                    start_angle = model.startAngle,
                    end_angle = model.endAngle,
                    mid_angle = start_angle + (end_angle - start_angle)/2;
      
                var x = mid_radius * Math.cos(mid_angle);
                var y = mid_radius * Math.sin(mid_angle);
      
                ctx.fillStyle = '#fff';
                if (i == 3){ 
                  ctx.fillStyle = '#444';
                }
                var percent = String(Math.round(dataset.data[i]/total*100)) + "%";
                ctx.fillText(percent, model.x + x, model.y + y + 15);
              }
            });               
          }
        }
      }
    });

  }
  PredictionAllRecordBarcharts() {
    this.changeDetectorRef.detectChanges();
    if (this.state.PredictionNavigate == 1) {
      var elmnt = document.getElementById("Predictionnavigate");
      elmnt.scrollIntoView();
    }

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
      dateForFilter1.sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
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
            borderColor: "#ffb801",
            backgroundColor: '#ffb801',
            fill: true,
          },
          {
            label: "Degrade",
            data: this.PredictonDataDegradeCount,
            borderWidth: 1,
            borderColor: " #fe4c61",
            backgroundColor: '#fe4c61',
            fill: true,
          }
        ]
      },
      options: {
        events: [],
        scales: {
          xAxes: [{
            gridLines: {
              display: false
            }, 
             stacked: true,
          }],
          yAxes: [{
           stacked: true,
            ticks: {
              beginAtZero: true,
              max:3,
          }, 
          gridLines: {
            display: false
          }, 
          }]
        },
        // "animation": {
        //   "duration": 1,
        //   "onComplete": function () {
        //     var chartInstance = this.chart,
        //       ctx = chartInstance.ctx;
        //     this.data.datasets.forEach(function (dataset, i) {
        //       var meta = chartInstance.controller.getDatasetMeta(i);
        //       meta.data.forEach(function (bar, index) {
        //         var data = dataset.data[index];
        //         if (data > 0) {
        //           ctx.fillText(data, bar._model.x, bar._model.y - 5);
        //        }
        //       });
        //     });
        //   }
        // },
    
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

  FutuergroupBy(list3, keyGetter) {
    list3.reduce((m, o) => {
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
      if (`${this.FutuerPredictionAllData[i]}.${this.fmtype =="SSRB" || this.fmtype =="CF" || this.fmtype =="RD"}` == "degarde") {
        this.FutuerPredictionDegradecount = this.FutuerPredictionDegradecount + 1
      } else if (`${this.FutuerPredictionAllData[i]}.${this.fmtype =="SSRB" || this.fmtype =="CF" || this.fmtype =="RD"}` == "incipient") {
        this.FutuerPredictionIncipientcount = this.FutuerPredictionIncipientcount + 1
      } else if (`${this.FutuerPredictionAllData[i]}.${this.fmtype =="SSRB" || this.fmtype =="CF" || this.fmtype =="RD"}` == "normal") {
        this.FutuerPredictionNormalcount = this.FutuerPredictionNormalcount + 1
      } else
        this.FutuerPredictionbadcount = this.FutuerPredictionbadcount + 1
    }

    this.FutuerlineChart()
    // this.FutuerdDonughtchart()
    // this.Futuerpiechart()
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
      FutuerdateForFilter1.sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
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
            borderColor: "#ffb801",
            backgroundColor: '#ffb801',
          },
          {
            label: "Degrade",
            data: this.FutuerPredictonDataDegradeCount,
            borderWidth: 1,
            borderColor: " #fe4c61",
            backgroundColor: '#fe4c61',
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
    this.changeDetectorRef.detectChanges();
    this.FutuerPredictionAllData.sort()
    var LabelDates: any = [];
    this.FuterPredictyearlist.forEach(element => {
      LabelDates.push(element.FutuerPredictyearname)
      LabelDates.sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
    });

    for (var i = 0; i < this.FuterPredictyearlist.length; ++i) {
      var forcastPnormal = 0
      var forcastFPincipient = 0
      var forcastFPdegrade = 0
      var forcastFPbad = 0
      var forcastcounter = 0
      this.FutuerPredictionAllData.forEach(value => {
        var a = moment(value.PredictedDate).format('YYYY')
        if (a == this.FuterPredictyearlist[i].FutuerPredictyearname) {
          if (value.Prediction == 'normal') {
            forcastPnormal = forcastPnormal + 1
          } else if (value.Prediction == 'incipient') {
            forcastFPincipient = forcastFPincipient + 1
          } else if (value.Prediction == 'degarde' || value.Prediction == 'degrade') {
            forcastFPdegrade = forcastFPdegrade + 1
          } else {
            forcastFPbad = forcastFPbad + 1
          }
          forcastcounter = forcastcounter + 1
        }

      });
      forcastPnormal = ((forcastPnormal / forcastcounter) * 100)
      forcastFPincipient = ((forcastFPincipient / forcastcounter) * 100)
      forcastFPdegrade = ((forcastFPdegrade / forcastcounter) * 100)
      forcastFPbad = ((forcastFPbad / forcastcounter) * 100)

      this.forcastFinalNormal.push(forcastPnormal)
      this.forcastFinalIncipient.push(forcastFPincipient)
      this.forcastFinaldDegrade.push(forcastFPdegrade)
      this.forcastFinalBad.push(forcastFPbad)

    }

    this.changeDetectorRef.detectChanges();
    this.chart = new Chart("donughtChart", {
      type: "bar",
      data: {
        labels: LabelDates,
        fill: true,
        datasets: [
          {
            label: "Normal",
            data: this.forcastFinalNormal,
            borderWidth: 1,
            borderColor: "#008000",
            backgroundColor: '#008000',
            fill: true,
          },
          {
            label: "Incipient",
            data: this.forcastFinalIncipient,
            borderWidth: 1,
            borderColor: "#ffb801",
            backgroundColor: '#ffb801',
            fill: true,
          },
          {
            label: "Degrade",
            data: this.forcastFinaldDegrade,
            borderWidth: 1,
            borderColor: "#fe4c61",
            backgroundColor: '#fe4c61',
            fill: true,
          },
          {
            label: "Bad",
            data: this.forcastFinalBad,
            borderWidth: 1,
            borderColor: "blue",
            backgroundColor: 'blue',
            fill: true,
          },

        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'In_Percentage'
              },
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });

  }


  Futuerpiechart() {
    var a: any = [];
    this.FutuerPredictionNormalcount = 0,
      this.FutuerPredictionIncipientcount = 0,
      this.FutuerPredictionDegradecount = 0;
    var FPClassDegradepercentage
    var FPClassIncipientpercentage
    var FPClassNormalpercentage
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
    a.forEach(element => {
      if (element == 'normal') {
        this.FutuerPredictionNormalcount = this.FutuerPredictionNormalcount + 1;
      } else if (element == 'incipient') {
        this.FutuerPredictionIncipientcount = this.FutuerPredictionIncipientcount + 1;
      } else if (element == 'degrade' || element == 'degarde') {
        this.FutuerPredictionDegradecount = this.FutuerPredictionDegradecount + 1;
      }
    });
    FPClassDegradepercentage = ((this.FutuerPredictionDegradecount / a.length) * 100).toFixed(2);
    FPClassIncipientpercentage = ((this.FutuerPredictionIncipientcount / a.length) * 100).toFixed(2);
    FPClassNormalpercentage = ((this.FutuerPredictionNormalcount / a.length) * 100).toFixed(2);

    this.changeDetectorRef.detectChanges();
    this.chart = new Chart('FutuerPredictionPie', {
      type: 'pie',
      data: {
        labels: ["Normal", "Incipient", "Degrade"],
        datasets: [
          {
            backgroundColor: ["#008000", "#ffb801", "#fe4c61"],
            data: [FPClassNormalpercentage, FPClassIncipientpercentage, FPClassDegradepercentage]
          }
        ]
      },
      options: {
        // events: [],
      }
    });
  }
  FutuerPredictionClick() {
    this.changeDetectorRef.detectChanges();
    this.GerAllFutuerPredictionRecords();
    this.FuterPredictionShow = true;
    this.PredictionShow = false;
    this.PredictionselectedYear = ""
    this.fmtype = ""

  }
  PredictionOnClick() {
    this.changeDetectorRef.detectChanges();
    this.GerAllPredictionRecords();
    this.FuterPredictionShow = false;
    this.PredictionShow = true;
    this.FutuerselectedYear = ""
    this.fmtype = ""
  }

  // dygraph() {
  //   this.chart = new Dygraph(
  //     // document.getElementById("graph"),"dist/DPM/assets/demoFileDygraphs.csv",
  //     // document.getElementById("graph"),"dist/DPM/assets/Forecast20Record-1.csv",
  //     // document.getElementById("graph"), "dist/DPM/assets/addforcastandprediction.csv",
  //     document.getElementById("graph"), "dist/DPM/assets/Dig_67records.csv",
  //     {
  //       // visibility: [true, false, false, true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],
  //       visibility: [true, true, true, true],
  //       colors: ['green', 'blue',],
  //       showLabelsOnHighlight: false,
  //       showRangeSelector: true,
  //       valueRange: [100],
  //       series: {
  //         'TD1': {
  //           strokePattern: null,
  //           drawPoints: true,
  //           pointSize: 1,
  //         },
  //         'FTD1': {
  //           strokePattern: Dygraph.DASHED_LINE,
  //           strokeWidth: 2.6,
  //           drawPoints: true,
  //           pointSize: 3.5,
  //         },
  //       }
  //     })

  //   // this.http.get("/api/ScrewCompressureAPI/GetPredictionRecordsInCSVFormat").subscribe((res: any) => {
  //   //      var prediction = res;
  //   //       var url: string = this.screwCompressorAPIName.GetScrewCompressorForecastRecords
  //   //   this.screwCompressorMethod.getWithoutParameters(url)
  //   //     .subscribe(
  //   //       (res: any) => {
  //   //         var futureData = res

  //   //       // this.highlight_start = moment(res[0].date).format('YYYY/MM/DD')
  //   //       // this.highlight_end = moment(this.date).format('YYYY/MM/DD')

  //   //       var result1 : any= futureData.filter(f =>
  //   //         prediction.some(d => d.Date == f.Date)
  //   //       );

  //   //        result1.forEach(element => {
  //   //          var d = prediction.filter(r=>r.Date === element.Date)
  //   //          element.TD1 = d[0].TD1;
  //   //           element.Residual = element.FTD1 - d[0].TD1
  //   //         // element.FFTD1 = d[0].TD1
  //   //        });
  //   //        futureData.forEach(element => {
  //   //          if(element.TD1 == 0){
  //   //            element.Residual = ''
  //   //          }
  //   //        });
  //   //        prediction.forEach(element => {
  //   //          element.Residual = 0
  //   //         element.FFTD1 = 0
  //   //         for (var i = 0; i < result1.length; i++) {
  //   //           if (result1[i].Date == element.Date) {
  //   //           element.FTD1 = result1[i].FTD1
  //   //           element.TD1 = result1[i].TD1
  //   //           element.Residual = result1[i].Residual
  //   //           }
  //   //         }
  //   //       });

  //   //        const result = futureData.filter(f =>
  //   //         !prediction.some(d => d.Date == f.Date)
  //   //        );
  //   //        result.forEach(element => {
  //   //            prediction.push(element);
  //   //        });
  //   //       //this.mergedarray = prediction.concat(result);
  //   //       prediction.forEach(element => {
  //   //         if(element.Residual === 0){
  //   //           element.Residual = ''
  //   //         }
  //   //         if(element.TD1 === 0){
  //   //           element.TD1 = ''
  //   //         }
  //   //         if(element.FTD1 === 0){
  //   //           element.FTD1 = ''
  //   //         }
  //   //         // if (element.TD1 > 180 && element.TD1 < 210) {
  //   //         //   element.alarm = element.TD1

  //   //         // } else{
  //   //         //   element.alarm = ''
  //   //         // }
  //   //         //  if (element.TD1 > 210) {
  //   //         //   element.trigger = element.TD1
  //   //         // }else{
  //   //         //   element.trigger = ''
  //   //         // }
  //   //         // if(element.FTD1 > 190 && element.FTD1 < 210) {
  //   //         //   element.falarm = element.FTD1
  //   //         // }
  //   //         // else {
  //   //         //   element.falarm = ''
  //   //         // }
  //   //         // if(element.FTD1 > 210) {
  //   //         //   element.ftrigger = element.FTD1
  //   //         // }
  //   //         // else {
  //   //         //   element.ftrigger = ''
  //   //         // }
  //   //        });
  //   //        this.csvData = this.ConvertToCSV(prediction);
  //   //       //  this.csvData = this.ConvertToCSV( this.mergedarray);
  //   //       //  var highlight_start = new Date(this.highlight_start);
  //   //       //  var highlight_end = new Date(this.highlight_end);

  //   //        this.chart = new Dygraph(
  //   //         document.getElementById("graph"),this.csvData,
  //   //         {
  //   //           // colors: ['green','green', 'gray', '#ffb801','red','#ffb801','red'],
  //   //           colors: ['green','green', 'green',],
  //   //           // visibility: [true, true, false, true,true,true,true,],
  //   //           visibility: [true, true, false,],
  //   //           showRangeSelector: true,
  //   //           fillGraph:true,
  //   //           fillAlpha: 0.1,
  //   //           connectSeparatedPoints: false,
  //   //           drawPoints: true,
  //   //           strokeWidth: 1.5,
  //   //           stepPlot: false,
  //   //           errorbar: true,
  //   //           drawXGrid: true,
  //   //           valueRange: [150,250],
  //   //           includeZero: false,
  //   //           drawAxesAtZero: false,
  //   //           series: {
  //   //             'TD1': {
  //   //               strokePattern: null,
  //   //               drawPoints: true,
  //   //               pointSize: 2,
  //   //             },
  //   //             'FTD1': {
  //   //               strokePattern: Dygraph.DASHED_LINE,
  //   //               strokeWidth: 2.6,
  //   //               drawPoints: true,
  //   //               pointSize: 3.5
  //   //             },
  //   //             // 'Residual': {
  //   //             // },
  //   //             // 'alarm': {
  //   //             //   strokeWidth: 2,
  //   //             // },
  //   //             // 'trigger': {
  //   //             //   strokePattern: Dygraph.DOT_DASH_LINE,
  //   //             //   strokeWidth: 2,
  //   //             //   highlightCircleSize: 3
  //   //             // },
  //   //             // 'falarm': {
  //   //             //   color: ['#ffb801'],
  //   //             //   strokePattern: Dygraph.DASHED_LINE1,
  //   //             //   strokeWidth: 1.6,
  //   //             //   drawPoints: true,
  //   //             //   pointSize: 2.5
  //   //             // },
  //   //             // 'ftrigger': {
  //   //             //   strokePattern: Dygraph.DASHED_LINE,
  //   //             //   strokeWidth: 1.0,
  //   //             //   drawPoints: true,
  //   //             //   pointSize: 1.5
  //   //             // },
  //   //           },
  //   //           // underlayCallback: function(canvas, area, g) {
  //   //           //     var bottom_left = g.toDomCoords(highlight_start);
  //   //           //     var top_right = g.toDomCoords(highlight_end);

  //   //           //     var left = bottom_left[0];
  //   //           //     var right = top_right[0];

  //   //           //      canvas.fillStyle = "rgba(245, 252, 255)";
  //   //           //     canvas.fillRect(left, area.y, right - left, area.h);
  //   //           // }
  //   //         },
  //   //         )
  //   //         // this.chart = new Dygraph(
  //   //         //   document.getElementById("graph1"),this.csvData,
  //   //         //   {
  //   //         //     colors: ['green', '#58508d', 'gray', '#ffb801','red','#ffb801','red',],
  //   //         //     showRangeSelector: true,
  //   //         //     connectSeparatedPoints: true,
  //   //         //     fillGraph: true,
  //   //         //     drawPoints: true,
  //   //         //     strokeWidth: 5,
  //   //         //     drawXGrid: false,
  //   //         //     visibility: [false, false, true, false,false,false,false,],
  //   //         //   },
  //   //         //   )

  //   //     })}
  //   // )
  // }

  // PredictionAllRecordBarcharts1() {
  //   this.http.get("/api/ScrewCompressureAPI/GetPredictionRecordsInCSVFormat").subscribe((res: any) => {
  //        var prediction = res;
  //        prediction.forEach(element => {
  //         if (element.TD1 > 180 && element.TD1 < 210) {
  //           element.alarm = element.TD1
  //         }else{
  //           element.alarm = ''
  //         }
  //          if (element.TD1 > 210) {
  //           element.trigger = element.TD1
  //         }else{
  //           element.trigger = ''
  //         }
  //        });
  //        this.csvData = this.ConvertToCSV(prediction);
  //          this.chart = new Dygraph(
  //           document.getElementById("Predictiongraph"),this.csvData,
  //           {
  //              colors: ['green','#ffb801','red',],
  //             //  visibility: [ true,true, false,, true, true,],
  //             showRangeSelector: true,
  //             fillGraph:true,
  //             fillAlpha: 0.1,
  //             connectSeparatedPoints: false,
  //             drawPoints: true,
  //             strokeWidth: 1.5,
  //             stepPlot: false,
  //             errorbar: true,
  //             drawXGrid: true,
  //             valueRange: [150,250],
  //             includeZero: false,
  //             drawAxesAtZero: false,
  //             series: {
  //               'TD1': {
  //                 strokePattern: null,
  //                 drawPoints: true,
  //                 pointSize: 2,
  //               },
  //               'alarm': {
  //                 strokePattern: null,
  //                 drawPoints: true,
  //                 pointSize: 2,
  //               },
  //               'trigger': {
  //                 strokePattern: null,
  //                 drawPoints: true,
  //                 pointSize: 2,
  //               },
              
  //             },
  //       })}
  //   )
  // }

 
  dygraph() {
    this.chart = new Dygraph(
      // document.getElementById("graph"),"dist/DPM/assets/newDygraphForSensordata.csv",
      // document.getElementById("graph"),"dist/DPM/assets/Forecast20Record-1.csv",
      // document.getElementById("graph"), "dist/DPM/assets/addforcastandprediction.csv",
      //  document.getElementById("graph"), "dist/DPM/assets/sensor200dataforDydraph.csv",
        document.getElementById("graph"), "dist/DPM/assets/dygraph2018-19.csv",
      {
        visibility: [true, true, true,],
        colors: ['green', 'blue',],
        // showLabelsOnHighlight: false,
        showRangeSelector: true,
        valueRange: [120],
        series: {
          'TD1': {
            strokePattern: null,
            drawPoints: true,
            pointSize: 1,
          },
          'FTD1': {
            strokePattern: Dygraph.DASHED_LINE,
            strokeWidth: 2.6,
            drawPoints: true,
            pointSize: 3.5,
          },
        }
      })
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
      this.DAB = "Yes"
    } else {
      this.DAB = "No"
    }
  }
  public CBAReportDetails: any;

  public user: any = [];
  GetReportRecords() {
    const url: string = this.screwCompressorAPIName.getTrainList
    // this.screwCompressorMethod.getWithoutParameters(url)
    this.screwCompressorMethod.getWithoutParameters(this.screwCompressorAPIName.GetAllRecords)
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
          this.commonLoadingDirective.showLoading(false, '');
        } else {
          this.commonLoadingDirective.showLoading(false, '');
        }
      }, err => {
        this.commonLoadingDirective.showLoading(false, '');
        console.log(err.error);
      });
  }
  public allCBI: boolean = true;
  CBICharts() {
    this.changeDetectorRef.detectChanges();
    if (this.state.CBANAV == 3) {
      var elmnt = document.getElementById("CBAnavigate");
      elmnt.scrollIntoView();
    }
    if (this.CBIGraphs == "Ecomomic_Risk") {
      this.ecomomic_risk_Graph = true
      this.residual_risk_Graph = false
      this.MEI_risk_Graph = false
      this.allCBI = false
      this.EcomomicRiskGraph()
    } else if (this.CBIGraphs == "Residual_Risk") {
      this.residual_risk_Graph = true
      this.MEI_risk_Graph = false
      this.ecomomic_risk_Graph = false
      this.allCBI = false
      this.ResidualRiskGraph()
    } else if (this.CBIGraphs == "MEI") {
      this.MEI_risk_Graph = true
      this.ecomomic_risk_Graph = false
      this.residual_risk_Graph = false
      this.allCBI = false
      this.MEIGraph()
    }
    else if (this.CBIGraphs == "") {
      this.MEI_risk_Graph = false
      this.ecomomic_risk_Graph = false
      this.residual_risk_Graph = false
      this.allCBI = true;
      this.ALLGraphCBA()
    }
  }

  EcomomicRiskGraph() {
    this.changeDetectorRef.detectChanges();
    var eonomicriskwithoutDPM: number = +(this.EconomicRiskWithOutDPM)
    var eonomicriskwithDPM: number = +(this.EconomicRiskWithDPM)
    var eonomicriskwithConstraint: number = +(this.EconomicRiskWithConstraintDPM)
    var total: number = (eonomicriskwithoutDPM + eonomicriskwithDPM + eonomicriskwithConstraint)

    var economiccostWithoutDPM = ((eonomicriskwithoutDPM / total) * 100).toFixed(2)
    var economiccostWithDPM = ((eonomicriskwithDPM / total) * 100).toFixed(2)
    var economiccostwithConstraint = ((eonomicriskwithConstraint / total) * 100).toFixed(2)

    this.chart = new Chart("ecomomic_risk", {
      type: "bar",
      data: {
        labels: ["Economic Risk",],
        datasets: [
          {
            label: "Without DPM",
            backgroundColor: "#d72631",
            borderColor: "#d72631",
            borderWidth: 1,
            data: [economiccostWithoutDPM,]
          },
          {
            label: "With DPM",
            backgroundColor: "#039fbe",
            borderColor: "#039fbe",
            borderWidth: 1,
            data: [economiccostWithDPM,]
          },
          {
            label: "With Constraint",
            backgroundColor: "#5c3c92",
            borderColor: "#5c3c92",
            borderWidth: 1,
            data: [economiccostwithConstraint]
          },
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'In_Percentage'
              },
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });
  }

  ResidualRiskGraph() {
    this.changeDetectorRef.detectChanges();
    var residualcostWithoutDPM: number = + (this.ResidualRiskWithOutDPM)
    var residualCostDPMWithoutConstraint: number = + (this.ResidualRiskWithDPM)
    var residualCostWithDPMConstraint: number = + (this.ResidualRiskWithConstraintDPMCR)
    var residualtotal = (residualcostWithoutDPM + residualCostDPMWithoutConstraint + residualCostWithDPMConstraint)

    var resdualtWithoutDPM = ((residualcostWithoutDPM / residualtotal) * 100).toFixed(2)
    var residualcostwithDPM = ((residualCostDPMWithoutConstraint / residualtotal) * 100).toFixed(2)
    var residualwithConstraint = ((residualCostWithDPMConstraint / residualtotal) * 100).toFixed(2)

    this.chart = new Chart("residual_risk", {
      type: "bar",
      data: {
        labels: ["Residual Risk"],
        datasets: [
          {
            label: "Without DPM",
            backgroundColor: "#d72631",
            borderColor: "#d72631",
            borderWidth: 1,
            data: [resdualtWithoutDPM,]
          },
          {
            label: "With DPM",
            backgroundColor: "#039fbe",
            borderColor: "#039fbe",
            borderWidth: 1,
            data: [residualcostwithDPM,]
          },
          {
            label: "With Constraint",
            backgroundColor: "#5c3c92",
            borderColor: "#5c3c92",
            borderWidth: 1,
            data: [residualwithConstraint]
          },
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'In_Percentage'
              },
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });

  }
  MEIGraph() {
    this.changeDetectorRef.detectChanges();
    var meicostWithoutDPM: number = +  (this.MEIWithoutDPM)
    var meiCostDPMWithoutConstraint: number = + (this.MEIWithDPMWithoutConstraint)
    var meiCostWithDPMConstraint: number = + (this.MEIWithDPMWithConstraint)
    var meitotal: number = + (meicostWithoutDPM + meiCostDPMWithoutConstraint + meiCostWithDPMConstraint)

    var meicostwithoutDPM = ((meicostWithoutDPM / meitotal) * 100).toFixed(2)
    var meicostwithDPM = ((meiCostDPMWithoutConstraint / meitotal) * 100).toFixed(2)
    var meicostwithConstraint = ((meiCostWithDPMConstraint / meitotal) * 100).toFixed(2)

    this.chart = new Chart("mei_risk", {
      type: "bar",
      data: {
        labels: ["MEI Risk",],
        datasets: [
          {
            label: "Without DPM",
            backgroundColor: "#d72631",
            borderColor: "#d72631",
            borderWidth: 1,
            data: [meicostwithoutDPM,]
          },
          {
            label: "With DPM",
            backgroundColor: "#039fbe",
            borderColor: "#039fbe",
            borderWidth: 1,
            data: [meicostwithDPM,]
          },
          {
            label: "With Constraint",
            backgroundColor: "#5c3c92",
            borderColor: "#5c3c92",
            borderWidth: 1,
            data: [meicostwithConstraint]
          },
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'In_Percentage'
              },
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });

  }

  ALLGraphCBA() {
    var eonomicriskwithoutDPM: number = +(this.EconomicRiskWithOutDPM)
    var eonomicriskwithDPM: number = +(this.EconomicRiskWithDPM)
    var eonomicriskwithConstraint: number = +(this.EconomicRiskWithConstraintDPM)
    var total: number = (eonomicriskwithoutDPM + eonomicriskwithDPM + eonomicriskwithConstraint)

    var economiccostWithoutDPM = ((eonomicriskwithoutDPM / total) * 100).toFixed(2)
    var economiccostWithDPM = ((eonomicriskwithDPM / total) * 100).toFixed(2)
    var economiccostwithConstraint = ((eonomicriskwithConstraint / total) * 100).toFixed(2)

    var residualcostWithoutDPM: number = + (this.ResidualRiskWithOutDPM)
    var residualCostDPMWithoutConstraint: number = + (this.ResidualRiskWithDPM)
    var residualCostWithDPMConstraint: number = + (this.ResidualRiskWithConstraintDPMCR)
    var residualtotal = (residualcostWithoutDPM + residualCostDPMWithoutConstraint + residualCostWithDPMConstraint)

    var resdualtWithoutDPM = ((residualcostWithoutDPM / residualtotal) * 100).toFixed(2)
    var residualcostwithDPM = ((residualCostDPMWithoutConstraint / residualtotal) * 100).toFixed(2)
    var residualwithConstraint = ((residualCostWithDPMConstraint / residualtotal) * 100).toFixed(2)

    var meicostWithoutDPM: number = +  (this.MEIWithoutDPM)
    var meiCostDPMWithoutConstraint: number = + (this.MEIWithDPMWithoutConstraint)
    var meiCostWithDPMConstraint: number = + (this.MEIWithDPMWithConstraint)
    var meitotal: number = + (meicostWithoutDPM + meiCostDPMWithoutConstraint + meiCostWithDPMConstraint)

    var meicostwithoutDPM = ((meicostWithoutDPM / meitotal) * 100).toFixed(2)
    var meicostwithDPM = ((meiCostDPMWithoutConstraint / meitotal) * 100).toFixed(2)
    var meicostwithConstraint = ((meiCostWithDPMConstraint / meitotal) * 100).toFixed(2)

    this.changeDetectorRef.detectChanges();

    this.chart = new Chart("allGraphCBI", {
      type: "bar",
      data: {
        labels: ["Economic Risk", "MEI", "Residual Risk",],
        datasets: [
          {
            label: "Without DPM",
            backgroundColor: "#d72631",
            borderColor: "#d72631",
            borderWidth: 1,
            data: [economiccostWithoutDPM, meicostwithoutDPM, resdualtWithoutDPM]
          },
          {
            label: "With DPM",
            backgroundColor: "#039fbe",
            borderColor: "#039fbe",
            borderWidth: 1,
            data: [economiccostWithDPM, meicostwithDPM, residualcostwithDPM]
          },
          {
            label: "With Constraint",
            backgroundColor: "#5c3c92",
            borderColor: "#5c3c92",
            borderWidth: 1,
            data: [economiccostwithConstraint, meicostwithConstraint, residualwithConstraint]
          },
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'In_Percentage'
              },
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });
  }

  getUserSkillRecords() {
    this.commonBLervice.getWithoutParameters('/SkillLibraryAPI/GetAllConfigurationRecords').subscribe(
      (res: any) => {
        this.SkillLibraryAllrecords = res;
        this.PSRClientContractorData
        for (var i = 0; i < this.SkillLibraryAllrecords.length; i++) {
          for (var j = 0; j < this.PSRClientContractorData.length; j++) {
            this.SkillLibraryAllrecords.forEach(element => {
              if (this.PSRClientContractorData[j].PSRClientContractorId == this.SkillLibraryAllrecords[i].Craft) {
                element.CraftSF = this.PSRClientContractorData[j].CraftSF
              }
            });
          }
        }

      }, err => { console.log(err.error) }
    );
  }
  GetPSRClientContractorData() {
    this.http.get('/api/PSRClientContractorAPI/GetAllConfigurationRecords')
      .subscribe((res1: any) => {
        this.PSRClientContractorData = res1;

      }, err => { console.log(err.error) }
      );
  }


  PredictionWithTagNumber() {
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
    var Badpercentage
    a.forEach(element => {
      if (element == 'normal') {
        this.PredictionNormalcount = this.PredictionNormalcount + 1;
      } else if (element == 'incipient') {
        this.PredictionIncipientcount = this.PredictionIncipientcount + 1;
      } else if (element == 'degrade' || element == 'degarde') {
        this.PredictionDegradecount = this.PredictionDegradecount + 1;
      }else{
        this.Predictionbadcount = this.Predictionbadcount+1
      }
    });
    Degradepercentage = ((this.PredictionDegradecount / a.length) * 100).toFixed(2);
    Incipientpercentage = ((this.PredictionIncipientcount / a.length) * 100).toFixed(2);
    Normalpercentage = ((this.PredictionNormalcount / a.length) * 100).toFixed(2);
    Badpercentage = ((this.Predictionbadcount / a.length) * 100).toFixed(2);

    this.predictionDegradeMessage = Degradepercentage
    this.predictionIncipientMessage = Incipientpercentage
    this.predictionNormalMessage = Normalpercentage
  

    this.changeDetectorRef.detectChanges();
    this.chart = new Chart("PredictionbarWithTage", {
      type: "bar",
      data: {
        labels: ['K100'],
        fill: true,
        datasets: [
          {
            label: "Normal",
            data: [Normalpercentage],
            borderWidth: 1,
            borderColor: "#008000",
            backgroundColor: '#008000',
            fill: true,

          },
          {
            label: "Incipient",
            data: [Incipientpercentage],
            borderWidth: 1,
            borderColor: "#ffb801",
            backgroundColor: '#ffb801',
            fill: true,

          },
          {
            label: "Degrade",
            data: [Degradepercentage],
            borderWidth: 1,
            borderColor: "#fe4c61",
            backgroundColor: '#fe4c61',
            fill: true,

          },
          {
            label: "Bad",
            data: Badpercentage,
            borderWidth: 1,
            borderColor: "blue",
            backgroundColor: 'blue',
            fill: true,
          },

        ],
      },
      options: {
        scales: {
          xAxes: [{
            stacked: true,
            barPercentage: 0.2,
            scaleLabel: {
              display: true,
              labelString: 'Tag Numbers'
            },
            gridLines: {
              display: false
            },
          }],
          yAxes: [{
            stacked: true,
            scaleLabel: {
              display: true,
              labelString: 'Percentage '
            },
            ticks: {
            },
            gridLines: {
              display: false
            },
          }]
        }
      }

    });
  }

  PredictionWithActionPieChart(){
    this.changeDetectorRef.detectChanges();
    this.chart = new Chart("PredictionActionPiechart", {
      type: 'pie',
      data: {
        labels: ["Complete", "Ongoing", "Overdue"],
        fill: true,
        datasets: [
          {
            backgroundColor: ["#008000", "#ffb801", "#fe4c61"],
            data: [0,  this.MSSCount, 1]
          }
        ]
      },
      options: {
         events: [],
        animation: {
          duration: 500,
          easing: "easeOutQuart",
          onComplete: function () {
            var ctx = this.chart.ctx;
            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
      
            this.data.datasets.forEach(function (dataset) {
              for (var i = 0; i < dataset.data.length; i++) {
                var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                    total = dataset._meta[Object.keys(dataset._meta)[0]].total,
                    mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius)/2,
                    start_angle = model.startAngle,
                    end_angle = model.endAngle,
                    mid_angle = start_angle + (end_angle - start_angle)/2;
      
                var x = mid_radius * Math.cos(mid_angle);
                var y = mid_radius * Math.sin(mid_angle);
      
                ctx.fillStyle = '#fff';
                if (i == 3){ 
                  ctx.fillStyle = '#444';
                }
                if (i >0){ 
                  var percent = String(Math.round(dataset.data[i]/total*100)) + "%";
                  ctx.fillText(percent, model.x + x, model.y + y + 15);
                }
              
              }
            });               
          }
        }
      }
    });
  }

  PredictionWithAlertPieChart(){
    this.changeDetectorRef.detectChanges();
    // this.chart = new Chart("PredictionAlertsPiechart", {
    //   type: 'pie',
    //   data: {
    //     labels: ["Acknowledged", "Not_Acknowledged"],
    //     fill: true,
    //     datasets: [
    //       {
    //         backgroundColor: ["gray", "#ffb801",],
    //         data: [this.Degrademessagecount,this.Incipientemessagecount ]
    //       }
    //     ]
    //   },

    // });
  }

}

