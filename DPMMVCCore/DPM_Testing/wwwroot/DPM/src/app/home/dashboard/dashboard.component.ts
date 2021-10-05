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
import { DatePipe, Location } from '@angular/common';
import { SCConstantsAPI } from "../Compressor/ScrewCompressor/shared/ScrewCompressorAPI.service";
import { ProfileConstantAPI } from "../profile/profileAPI.service";
import { PrescriptiveContantAPI } from "../prescriptive/Shared/prescriptive.constant";
import { element, } from "protractor";
import { ConfigService } from "src/app/shared/config.service";
import { MenuItem } from 'primeng/api';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [MessageService, DatePipe]
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
  public Pyearlist =[];
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
  public PredictionselectedYear1: any = [];
  public PselectedYear: string = "";
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

  public RecommendationAlertMessage: string = "";
  public RecommendationAlertEnable: boolean = false;
  public RecommendationAlertMessagelength
  public Degrademessagecount: number = 0;
  public Normalemessagecount: number = 0;
  public Incipientemessagecount: number = 0;

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

  public CBI_etbf: number = 0;
  public totalPONC:number=0
  public ETBFWithConstraint: number = 0;
  public MEIWithDPMWithConstraint: number = 0;
  public MEIWithDPMWithoutConstraint: number = 0;
  public MEIWithoutDPM: number = 0;
  public OverallETBC: number = 0;
  public TotalAnnualCostWithMaintenance: number = 0;
  public TotalAnnualPOC: number = 0;
  public TotalPONC: number = 0;
  public VendorETBC: number = 0;
  public VendorPOC: any = [];

  public EconomicRiskWithDPM: number = 0;
  public EconomicRiskWithOutDPM: number = 0;
  public EconomicRiskWithConstraintDPM: number = 0;

  public ResidualRiskWithDPM: number = 0;
  public ResidualRiskWithOutDPM: number = 0;
  public ResidualRiskWithConstraintDPMCR: number = 0;
  public fullCBAobject: any = []

  public EconomicRiskWithDPMCR: string = "";
  displayModal: boolean;
  displayBasic: boolean;

  public SelectTagNumbers: string = "";
  public PredictiongraphShow: boolean = true;
  public PredictiongraphShow1: boolean = true;
  public myObj: any = [];
  public centrifugalmssmodel: any = []
  public centrifugalmssmodelFilter: any = []
  public MSSCount: any = []
  public GDECount: number = 0
  public notification = null
  public etbf_Values: number = 0
  public PrescriptiveRecordsList: any = [];
  public predictionDegradeMessage: any = []
  public predictionIncipientMessage: any = []
  public predictionNormalMessage: any = []
  public CBAReportDetails: any;
  public allCBI: boolean = false;
  public user: any = [];

  public GoodEnggiPractice: any = []
  public CMaintainenancePractice: string = "";
  public CPPrescriptiveTagNumber: string = "";
  public FunctionFailure: string = ""
  public FunctionMode: string = ""
  public MSSStartergy: string = ""
  public Consequence: string = ""
  public DownTimeFactor: string = ""
  public ProtectionFactor: string = ""
  public AnnualPOC: string = ""
  public MSSIntervalSelectionCriteria: string = ""
  public MSSMaintenanceInterval: string = ""
  public Craft: string = ""
  public MSSMaintenanceTask: string = ""
  public Level: string = ""
  public Hours: string = ""
  public Table1: boolean = false;
  public MitigatingActionshow: boolean = true;
  public mssmodelFilter: any = []
  public RiskGraphList: any = []
  public fakeriskandMetigateActions: any = [];
  public prediction: any = [];
  public forcast: any = [];
  public allCBAdata:any=[]
  public CBAOBJ : any ={};
  public CBAdataForRisk:any=[]
  public CompleteStatus: number = 0
  public Ongoingstatus: number = 0
  public Overduestatus: number = 0
  public LevelCount:any=[]
  public notifications = null
  public MSSTaskList:any=[]
  public ConstraintTaskList:any=[]
  public EconomicRiskWithOutDPMCR: string = "";
  public EconomicRiskWithDPMConstraintCR: string = "";
  public  tagnumbers:any =[]
  public  tag:any =[]
  public combinationList:any = []
  public dashboardshow:string = ""
  public ExecutorShow:boolean = false
  public PrescriptiveShow:boolean = false
  public ManagmentShow:boolean = false
  public mergerecords: any = [];
  public PTagNumberList = [];
  public tagnumbershow: string = ""
  public Degradepercentage:any=[]
  public Incipientpercentage:any=[]
  public Normalpercentage:any=[]
  public selctedtagnymbers: string = "";
  
  public forcastPnormal: number = 0;
  public forcastFPincipient: number = 0;
  public forcastFPdegrade: number = 0;
  public forcastFPbad: number = 0;
  public forcastcounter: number = 0;

  public Predictionstatus: string = ""
  public PredictionDatesList: any = [];
  public Forcaststatus: string = ""
  public assetselection:boolean=false;
  public dofuturePredictionDisabled: boolean = true;
  public doPredictionDisabled: boolean = true;
  public futurePredictionList: any = [];
  public futurePredictionDatesList: any = [];
  public SelectedDateFromList: any = [];
  public futurePredictionDate: any = [];
  public PredictionDate: any = [];
  public predictions:any=[];
  public forcasts:any=[];
  public forcastPredictionDatesList:any=[];
  public PredictionDataTableList: any = [];
  public futurePredictionDataTableList: any = [];
  public futurePredictionDatesToShow: any = ["After One Day", "After a week", "After 15 Days", "After 30 Days",];
  public PredictionDatesToShow: any = ["Previous 1 week", "Previous 15 Days", "Previous 1 Month","Previous 3 Month","Previous 1 Year"];
  public activeIndex: number;
  public riskhelp: boolean = false;
  public mittigationhelp: boolean = false;
  public riskanalysishelp: boolean = false;
  public helpboxshow:boolean = true;
  public gotit:boolean =false
  public pname:any=[]
  public multiselectarray:any=[]
  public result:any
  public task :string = ""
  public selctedtasktagno:string = ""
  public forststuspredictionyearlist:string= ""
  public Assetperformance: any;
  
  public screwWithPrediction: any = [];
  public AssetTagNumber:string=""
  public AssetEquipmentType:string=""
  public items: MenuItem[];

  public RadioValue : string = '';
  public radioshowmittigation:boolean=false;
  public profile_riskshow:boolean=false;
  public AssociatedFailuerMode:boolean=false;

  constructor(private title: Title,
    private http: HttpClient,
    public router: Router,
    public datepipe: DatePipe,
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
    // this.GetReportRecords()
    this.userModel = JSON.parse(localStorage.getItem('userObject'));
    this.Assetperformance=JSON.parse(localStorage.getItem('predictionAssetPerformance'));
    this.getPrescriptiveRecords()
    this.getUserDetails()
    this.FullCBAObject()
    this.fakeriskandMetigateActions = [
      { 'FunctionMode': 'Second stage rotor breakdown', 'RiskRank': 'N', 'FinancialRisk': 2029, 'TagNumber': 'K100' },
      { 'FunctionMode': 'Cooler Failure', 'RiskRank': 'L', 'FinancialRisk': 2035, 'TagNumber': 'K101' },
      { 'FunctionMode': 'Rotar Damage', 'RiskRank': 'H', 'FinancialRisk': 1029, 'TagNumber': 'K102' },
      { 'FunctionMode': 'Second stage rotor breakdown', 'RiskRank': 'MH', 'FinancialRisk': 2000, 'TagNumber': 'K103' },
      { 'FunctionMode': 'Second stage rotor breakdown', 'RiskRank': 'M', 'FinancialRisk': 2029, 'TagNumber': 'K104' },
  ]
  }

  ngOnInit() {
    this.getprescriptive()
    this.GetAllRecords()
    this.MachineEquipmentSelect();
    //  this.dygraph()
    //  this.GetALLCBA()
    this.getPredictedListRecordsByDate()
    this.items = [{
      expanded: true,
      command: (event: any) => {
        this.activeIndex = 0;
      }
    },
    {
      command: (event: any) => {
        this.activeIndex = 1;

      }
    },
    {
      command: (event: any) => {
        this.activeIndex = 2;
      }
    },
    {
      command: (event: any) => {
        this.activeIndex = 3;
      }
    },
    ];
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
//  assetperformanceobj(){
//   this.DAB = this.Assetperformance.DAB
//   this.AssetTagNumber = this.Assetperformance.TagNumber
//   this.AssetEquipmentType = this.Assetperformance.EquipmentType
//   this.finalPerformanceNumber = this.Assetperformance.finalPerformanceNumber
//  }

  Dashboardshowcriteria(){
   if(this.dashboardshow=="Prescription"){
    this.PrescriptiveShow=true;
    this.assetselection= true;
    this.AssociatedFailuerMode= false
    this.ManagmentShow=false
    this.GerAllPredictionRecords();
    this.GerAllFutuerPredictionRecords()
    this.ExecutorShow=false;
   }else if(this.dashboardshow=="Management"){
    this.ManagmentShow=true
    this.criticalityAssesment()
    this.ExecutorShow=false;
    this.PrescriptiveShow=false;
    this.AssociatedFailuerMode= false
  }else if(this.dashboardshow=="Executor"){
     this.ExecutorShow=true;
     this.AssociatedFailuerMode=true;
     this.allCBI= true
    //  this.showcbi=true;
    this.ManagmentShow=false
     this.PrescriptiveShow=false;
     this.GerAllPredictionRecords();
    //  this.CBICharts()
     this.FakeRiskMetigateactions()
     this.RiskProfile()
    //  this. ALLGraphCBA()
     this.ComboDates()
     this.dygraphForJson()
     this.fakePredictionWithTagNumber()
      // this.assetperformanceobj()
      // this.getFuturePredictionRecords()
  }
  }
  getUserDetails() {
    if (!!localStorage.getItem('CBAOBJ')) {
      this.UserData = JSON.parse(localStorage.getItem('CBAOBJ'));
      this.showcbi = true;

    }
  }

  RiskTable(){
    this.showcbi=true
    this.MitigatingActionshow=false;
  }

  getFuturePredictionRecords() {
    var url: string = this.screwCompressorAPIName.GetScrewCompressorForecastRecords;
    this.screwCompressorMethod.getWithoutParameters(url)
      .subscribe(
        (res: any) => {
          this.futurePredictionList = res;
          var Dates: any = [];
          if (res.length > 0) {
            this.futurePredictionList.forEach(element => {
              this.futurePredictionDatesList.push(this.datepipe.transform(element.Date, 'dd/MM/YYYY'));
            });
          }
        }
      )
  }

  FuturePredictionDates() {
    if (this.futurePredictionDate == 'After One Day') {
      this.dofuturePredictionDisabled = true;
      var fromDays = this.futurePredictionDatesList[0];
      var toDays = this.futurePredictionDatesList[0]
      const params = new HttpParams()
        .set('FromDate', moment(fromDays, 'DD/MM/YYYY').format('YYYY-MM-DD'))
        .set('ToDate', moment(toDays, 'DD/MM/YYYY').format('YYYY-MM-DD'));
      var url: string = this.screwCompressorAPIName.getForcastRecords;
      this.screwCompressorMethod.getWithParameters(url, params)
        .subscribe(
          res => {
            this.futurePredictionDataTableList = null;
            this.futurePredictionDataTableList = res;
            this.dygraphForJson()
          }, err => {
            this.messageService.add({ severity: 'warn', detail: 'There is no data for this Dates', sticky: true });
          }
        )
    } else if (this.futurePredictionDate == 'After a week') {
      var fromDays = this.futurePredictionDatesList[0];
      var toDays = this.futurePredictionDatesList[6];
      const params2 = new HttpParams()
      
        .set('FromDate', moment(fromDays, 'DD/MM/YYYY').format())
        .set('ToDate', moment(toDays, 'DD/MM/YYYY').format('YYYY-MM-DD'));
      var url2: string = this.screwCompressorAPIName.getForcastRecords;
      this.screwCompressorMethod.getWithParameters(url2, params2)
        .subscribe(
          res => {
            this.futurePredictionDataTableList = null;
            this.futurePredictionDataTableList = res;
            this.dygraphForJson()
          }, err => {
            this.messageService.add({ severity: 'warn', detail: 'There is no data for this Datesr', sticky: true });
          }
        )

    } else if (this.futurePredictionDate == 'After 15 Days') {
      var fromDays = this.futurePredictionDatesList[0];
      var toDays = this.futurePredictionDatesList[14]
      const params3 = new HttpParams()
        .set('FromDate', moment(fromDays, 'DD/MM/YYYY').format('YYYY-MM-DD'))
        .set('ToDate', moment(toDays, 'DD/MM/YYYY').format('YYYY-MM-DD'));
      var url3: string = this.screwCompressorAPIName.getForcastRecords;
      this.screwCompressorMethod.getWithParameters(url3, params3)
        .subscribe(
          res => {
            this.futurePredictionDataTableList = null;
            this.futurePredictionDataTableList = res;
            this.dygraphForJson()
          }, err => {
            this.messageService.add({ severity: 'warn', detail: 'There is no data for this Dates', sticky: true });
          }
        )
 
    } else if (this.futurePredictionDate == 'After 30 Days') {
      var fromDays = this.futurePredictionDatesList[0];
      var toDays = this.futurePredictionDatesList[29]
      const params4 = new HttpParams()
        .set('FromDate', moment(fromDays, 'DD/MM/YYYY').format('YYYY-MM-DD'))
        .set('ToDate', moment(toDays, 'DD/MM/YYYY').format('YYYY-MM-DD'));
      var url4: string = this.screwCompressorAPIName.getForcastRecords;
      this.screwCompressorMethod.getWithParameters(url4, params4)
        .subscribe(
          res => {
            this.futurePredictionDataTableList = null;
            this.futurePredictionDataTableList = res;
            this.dygraphForJson()
          }, err => {
            this.messageService.add({ severity: 'warn', detail: 'There is no data for this Dates', sticky: true });
          }
        )

    }
    else {
      this.futurePredictionDataTableList = [];
    }
  }


  FullCBAObject() {
    // this.fullCBAobject = JSON.parse(localStorage.getItem('CBAOBJ')).FullObject;
    // this.myObj = JSON.parse(this.fullCBAobject);
    // this.ComponentCriticalityFactor = this.myObj.CriticalityFactor
    // this.DownTimeFactor = this.myObj.DownTimeFactor
    // this.CFrequencyMaintainenance = this.myObj.FrequencyMaintainenance
    // this.CConditionMonitoring = this.myObj.ConditionMonitoring
    // this.ProtectionFactor = this.myObj.ProtectionFactor
    // this.ComponentRating = this.myObj.Rating
    // this.CMaintainenancePractice = this.myObj.MaintainenancePractice
    // this.CPPrescriptiveTagNumber = this.myObj.TagNumber
    // this.FunctionMode = this.myObj.FunctionMode
    // this.Consequence = this.myObj.Consequence
    
    // this.centrifugalmssmodel = this.myObj.CentrifugalPumpMssModel
  }

  groupByKey(array, key) {
    return array
      .reduce((hash, obj) => {
        if (obj[key] === undefined) return hash;
        return Object.assign(hash, { [obj[key]]: (hash[obj[key]] || []).concat(obj) })
      }, {})
  }

  showBasicDialog() {
    this.displayBasic = true;
  }

  getPrescriptiveRecords() {
    this.http.get('api/PrescriptiveAPI/GetTagNumber')
      .subscribe((res: any) => {
        res.forEach(element => {
          this.TagList.push(element.TagNumber)
        });
        this.PrescriptiveRecordsList = [];
        this.PrescriptiveRecordsList = res;
        this.MachineType = this.PrescriptiveRecordsList[0].MachineType
        this.EquipmentType = this.PrescriptiveRecordsList[0].EquipmentType
        this.SelectedTagNumber = this.PrescriptiveRecordsList[0].TagNumber
        this.getRecordsByEqui()
        this.GetALLCBA()
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
     if (this.date == "1Day") {
      this.date = moment().add(1, 'days').format('YYYY-MM-DD');
      this.dygraphForJson()
    }else if (this.date == "1Week") {
      this.date = moment().add(7, 'days').format('YYYY-MM-DD');
      this.dygraphForJson()
    } else if (this.date == "15days") {
      this.date = moment().add(15, 'days').format('YYYY-MM-DD');
      this.dygraphForJson()
    } else if (this.date == "1Month") {
      this.date = moment().add(30, 'days').format('YYYY-MM-DD');
      this.dygraphForJson()
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

  // showReport() {
  //   let embedUrl = 'https://app.powerbi.com/reportEmbed?reportId=8229f0b7-523d-46d9-9a54-b53438061991&autoAuth=true&ctid=606acdf9-2783-4b1f-9afc-a0919c38927d&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXdlc3QtZXVyb3BlLWUtcHJpbWFyeS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D';
  // }

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
  public predictreccomandation:any=[]
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
        (res: any) => {
          this.ScrewPredictionAllData = res;
          this.predictreccomandation =this.ScrewPredictionAllData
          if (res.length > 0) {
            this.ScrewPredictionAllData.forEach(element => {
              this.PredictionDatesList.push(this.datepipe.transform(element.InsertedDate, 'dd/MM/YYYY'));
            });
          }
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
                this.Degrademessagecount = this.Degrademessagecount + 1
                this.RecommendationAlertEnable = true;
              } else if (incipient > 6) {
                this.RecommendationAlertMessage = 'RCM is recomended';
                this.Incipientemessagecount = this.Incipientemessagecount + 1
                this.RecommendationAlertEnable = true;
              } else {
                this.RecommendationAlertEnable = false;
              }
              break;
            }
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
            let Predictyeardata = { PredictyearId: 0, Predictyearname: '', };
            Predictyeardata.Predictyearname = moment(predict.InsertedDate).format('YYYY')
            this.PInsertedDate.push(Predictyeardata);
          })
          this.Pyearlist = this.PInsertedDate.reduce((m, o) => {
            var found = m.find(s => s.Predictyearname === o.Predictyearname);
            if (found) {
            } else {
              m.push(o);
            }
            return m;
          }, []);
          this.ScrewPredictionAllData.forEach(predict => {
            this.PredictionData = predict.Prediction;
            let Predictyeardata = { PredictTagId: 0, PredictyTagnumber: '' };
            Predictyeardata.PredictyTagnumber = predict.TagNumber
            this.PTagNumberList.push(Predictyeardata);
          })
          this.Predictyearlist = this.PTagNumberList.reduce((m, o) => {
            var found = m.find(s => s.PredictyTagnumber === o.PredictyTagnumber);
            if (found) {
            } else {
              m.push(o);
            }
            return m;
          }, []);


          const ids = this.Predictyearlist.map(o => o.PredictyTagnumber)
          this.Predictyearlist = this.Predictyearlist.filter(({ PredictyTagnumber }, index) => !ids.includes(PredictyTagnumber, index + 1))
          this.Predictyearlist =   this.Predictyearlist.filter(r => r.PredictyTagnumber !== null)
          
          this.Predictyearlist.forEach(element=>{
            this.tag.push(element.PredictyTagnumber) 
          })

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
            } else if (this.Prediction[i] == "bad")
              this.Predictionbadcount = this.Predictionbadcount + 1
          }
          Degradepercentage = (this.Degradecount / this.ScrewPredictionAllData.length) * 100
          Incipientpercentage = (this.Incipientcount / this.ScrewPredictionAllData.length) * 100
          Normalpercentage = (this.Normalcount / this.ScrewPredictionAllData.length) * 100

          
          // this.PredictionAllRecordBarcharts();
           this.PredictionAllRecordPie();
          // this.GenerateReport()
          // this.PredictionWithTagNumber()
          this.PredictionWithTagNumber1()
          // this.PredictionAllRecordDonught();
          this.PredictionWithActionPieChart()
          this.IndicationGraphSSRB()
          this.IndicationGraphRD()
          this.IndicationGraphCF()
        }, error => {
          console.log(error.error)
        })
  }

  groupByPredict(list,) {
    list.reduce((m, o) => {
      var found1 = m.find(s => s.PredictyTagnumber === o.PredictyTagnumber);
      if (found1) { }
      else {
        m.push(o);
      }
      return m;
    },
      []);
  }

  onPredictionChangeYear() {
     this.ScrewPredictionAllData = this.PredictionFilteredData.filter(val => (val.TagNumber) === this.selctedtagnymbers.toString() && moment(val.InsertedDate).format('YYYY') === this.PredictionselectedYear.toString());
     this.CompleteStatus=0
     this.Ongoingstatus=0
     this.Overduestatus=0
     this.centrifugalmssmodel.forEach((element) => {
      if(this.CBATagnumber === this.selctedtagnymbers.toString()){
      if (element.Progress === 1) {
        this.CompleteStatus = this.CompleteStatus + 1
      } else if (element.Progress === 2) {
        this.Ongoingstatus = this.Ongoingstatus + 1
      }
      else if (element.Progress === 3) {
        this.Overduestatus = this.Overduestatus + 1
      }
    }
    })

    this.PredictionWithTagNumber1()
    this.PredictionWithActionPieChart()    
  }

  onPredictionChangeYear1() {
     this.ScrewPredictionAllData = this.PredictionFilteredData.filter(val => (val.TagNumber) === this.forststuspredictionyearlist.toString() && this.PredictionDate=="bydefault"
     ||this.PredictionDate=="Previous 1 week" || this.PredictionDate=="Previous 15 Days" || this.PredictionDate=="Previous 1 Month" || this.PredictionDate=="Previous 3 Month" || this.PredictionDate=="Previous 1 Year");
     this.combinationList=[];
     this.PredictionDegradecount = 0
    this.PredictionIncipientcount = 0
    this.PredictionNormalcount = 0
    this.Predictionbadcount = 0

    for (var i = 0; i < this.ScrewPredictionAllData.length; i++) {
      if (`${this.ScrewPredictionAllData[i]}.${this.fmtype == "SSRB" || this.fmtype == "CF" || this.fmtype == "RD"}` == "degarde") {
        this.PredictionDegradecount = this.PredictionDegradecount + 1
      } else if (`${this.ScrewPredictionAllData[i]}.${this.fmtype == "SSRB" || this.fmtype == "CF" || this.fmtype == "RD"}` == "incipient") {
        this.PredictionIncipientcount = this.PredictionIncipientcount + 1
      } else if (`${this.ScrewPredictionAllData[i]}.${this.fmtype == "SSRB" || this.fmtype == "CF" || this.fmtype == "RD"}` == "normal") {
        this.PredictionNormalcount = this.PredictionNormalcount + 1
      } else
        this.Predictionbadcount = this.Predictionbadcount + 1
    }

     this.PredictionDates()

  }

  PredictFModeType() {
    // this.ScrewPredictionAllData = this.PredictionFilteredData.filter(val => moment(val.InsertedDate).format('YYYY') === this.PredictionselectedYear.toString()); //for only years
    // this.ScrewPredictionAllData = this.PredictionFilteredData.filter(val => (val.TagNumber) === this.PredictionselectedYear.toString()); //for tag numbers
    // this.ScrewPredictionAllData = this.PredictionFilteredData.filter(val => (`${moment(val.InsertedDate).format('YYYY')}-${val.TagNumber}`) === this.PredictionselectedYear.toString());
    this.PredictionselectedYear1.forEach(val => {
      this.pname = val.Predictyearname 
     })
 
     this.ScrewPredictionAllData= this.PredictionFilteredData.filter(val => (val.TagNumber) === this.selctedtagnymbers.toString() && moment(val.InsertedDate).format('YYYY') === this.pname);
     this.multiselectarray.push(this.ScrewPredictionAllData)
      this.result = this.multiselectarray.reduce((r, e) => (r.push(...e), r), [])
 
    this.PredictionDegradecount = 0
    this.PredictionIncipientcount = 0
    this.PredictionNormalcount = 0
    this.Predictionbadcount = 0

    for (var i = 0; i < this.result.length; i++) {
      if (`${this.result[i]}.${this.fmtype == "SSRB" || this.fmtype == "CF" || this.fmtype == "RD"}` == "degarde") {
        this.PredictionDegradecount = this.PredictionDegradecount + 1
      } else if (`${this.result[i]}.${this.fmtype == "SSRB" || this.fmtype == "CF" || this.fmtype == "RD"}` == "incipient") {
        this.PredictionIncipientcount = this.PredictionIncipientcount + 1
      } else if (`${this.result[i]}.${this.fmtype == "SSRB" || this.fmtype == "CF" || this.fmtype == "RD"}` == "normal") {
        this.PredictionNormalcount = this.PredictionNormalcount + 1
      } else
        this.Predictionbadcount = this.Predictionbadcount + 1
    }
      this.PredictionWithTagNumber2()
  }

  public PredictionDegradeTascount: number = 0;
  public PredictionNormalTaskcount: number = 0;
  public PredictionIncipientTaskcount: number = 0;
  public PredictionbadTaskcount: number = 0;
  PredictTask() {
   this.ScrewPredictionAllData = this.PredictionFilteredData.filter(val => moment(val.InsertedDate).format('YYYY') === this.task.toString() && (val.TagNumber) === this.selctedtasktagno.toString()); 

   this.PredictionDegradecount = 0
   this.PredictionIncipientcount = 0
   this.PredictionNormalcount = 0
   this.Predictionbadcount = 0
     var counter = 0
  for (var i = 0; i < this.ScrewPredictionAllData.length; i++) {
    if(this.ScrewPredictionAllData[i].SSRB=="degarde" || this.ScrewPredictionAllData[i].CF=="degarde" ||this.ScrewPredictionAllData[i].RD=="degarde")
   {
      this.PredictionDegradecount = this.PredictionDegradecount + 1
    } else if(this.ScrewPredictionAllData[i].SSRB=="incipient" || this.ScrewPredictionAllData[i].CF=="incipient" ||this.ScrewPredictionAllData[i].RD=="incipient") {
      this.PredictionIncipientcount = this.PredictionIncipientcount + 1
    } else if(this.ScrewPredictionAllData[i].SSRB=="normal" || this.ScrewPredictionAllData[i].CF=="normal" ||this.ScrewPredictionAllData[i].RD=="normal") {
      this.PredictionNormalcount = this.PredictionNormalcount + 1
    } else{
      this.Predictionbadcount = this.Predictionbadcount + 1
    }
    counter = counter + 1 
  }
 
   this.IndicationGraphSSRB()
   this.IndicationGraphRD()
   this.IndicationGraphCF()
 }
  PredictionDates() {
    if (this.PredictionDate == 'bydefault') {
      this.doPredictionDisabled = true;
      var fromerDays= this.PredictionDatesList.slice(-1)
      var torDay= this.PredictionDatesList.slice(-1)
      const params = new HttpParams()
        .set('FromDate', moment(fromerDays, 'DD/MM/YYYY').format('YYYY-MM-DD'))
         .set('ToDate', moment(torDay, 'DD/MM/YYYY').format('YYYY-MM-DD'));
      var url: string = this.screwCompressorAPIName.getPredictiontRecords;
      this.screwCompressorMethod.getWithParameters(url, params)
        .subscribe(
          res => {
            this.PredictionNormalcount=0
            this.PredictionIncipientcount=0
            this.PredictionDegradecount=0
            this.PredictionDataTableList = null;
            this.PredictionDataTableList = res;  
            for (var i = 0; i < this.unique.length; ++i) {
            this.PredictionDataTableList.forEach(element => {
              var a = `${moment(element.InsertedDate).format('YYYY')}-${element.TagNumber}`
              if (a == this.unique[i]) {
              if (element.Prediction == 'normal') {
                this.PredictionNormalcount = this.PredictionNormalcount + 1;
              } else if (element.Prediction == 'incipient') {
                this.PredictionIncipientcount = this.PredictionIncipientcount + 1;
              } else if (element.Prediction == 'degrade' || element == 'degarde') {
                this.PredictionDegradecount = this.PredictionDegradecount + 1;
              }
            }
            });
            this.Degradepercentage = ((this.PredictionDegradecount /  this.PredictionDataTableList.length) * 100).toFixed(2);
            this.Incipientpercentage = ((this.PredictionIncipientcount /  this.PredictionDataTableList.length) * 100).toFixed(2);
            this.Normalpercentage = ((this.PredictionNormalcount /  this.PredictionDataTableList.length) * 100).toFixed(2);
          }
          }, err => {
            this.messageService.add({ severity: 'warn', detail: 'There is no data for this Dates', sticky: true });

            this.commonLoadingDirective.showLoading(false, " ");
          }
        )

    } else if (this.PredictionDate == 'Previous 1 week') {
      this.doPredictionDisabled = true;
      var fromerDays= this.PredictionDatesList.slice(-1)
      var torDay= this.PredictionDatesList.slice(-7)
      const params = new HttpParams()
        .set('FromDate', moment(fromerDays, 'DD/MM/YYYY').format('YYYY-MM-DD'))
         .set('ToDate', moment(torDay, 'DD/MM/YYYY').format('YYYY-MM-DD'));
      var url: string = this.screwCompressorAPIName.getPredictiontRecords;
      this.screwCompressorMethod.getWithParameters(url, params)
        .subscribe(
          res => {
            this.PredictionNormalcount=0
            this.PredictionIncipientcount=0
            this.PredictionDegradecount=0
            this.PredictionDataTableList = null;
            this.PredictionDataTableList = res;  
            for (var i = 0; i < this.unique.length; ++i) {
            this.PredictionDataTableList.forEach(element => {
              var a = `${moment(element.InsertedDate).format('YYYY')}-${element.TagNumber}`
              if (a == this.unique[i]) {
              if (element.Prediction == 'normal') {
                this.PredictionNormalcount = this.PredictionNormalcount + 1;
              } else if (element.Prediction == 'incipient') {
                this.PredictionIncipientcount = this.PredictionIncipientcount + 1;
              } else if (element.Prediction == 'degrade' || element == 'degarde') {
                this.PredictionDegradecount = this.PredictionDegradecount + 1;
              }
            }
            });
            this.Degradepercentage = ((this.PredictionDegradecount /  this.PredictionDataTableList.length) * 100).toFixed(2);
            this.Incipientpercentage = ((this.PredictionIncipientcount /  this.PredictionDataTableList.length) * 100).toFixed(2);
            this.Normalpercentage = ((this.PredictionNormalcount /  this.PredictionDataTableList.length) * 100).toFixed(2);
          }
          }, err => {
            this.messageService.add({ severity: 'warn', detail: 'There is no data for this Dates', sticky: true });

            this.commonLoadingDirective.showLoading(false, " ");
          }
        )
        
    } else if (this.PredictionDate == 'Previous 15 Days') {
      var fromerDays= this.PredictionDatesList.slice(-1)
      var torDay= this.PredictionDatesList.slice(-15)
      const params2 = new HttpParams()
      .set('FromDate', moment(fromerDays, 'DD/MM/YYYY').format('YYYY-MM-DD'))
      .set('ToDate', moment(torDay, 'DD/MM/YYYY').format('YYYY-MM-DD'));
      var url2: string = this.screwCompressorAPIName.getPredictiontRecords;
      this.screwCompressorMethod.getWithParameters(url2, params2)
        .subscribe(
          res => {
            this.PredictionNormalcount=0
            this.PredictionIncipientcount=0
            this.PredictionDegradecount=0
            this.PredictionDataTableList = null;
            this.PredictionDataTableList = res;
            for (var i = 0; i < this.unique.length; ++i) {
              this.PredictionDataTableList.forEach(element => {
                var a = `${moment(element.InsertedDate).format('YYYY')}-${element.TagNumber}`
                if (a == this.unique[i]) {
                if (element.Prediction == 'normal') {
                  this.PredictionNormalcount = this.PredictionNormalcount + 1;
                } else if (element.Prediction == 'incipient') {
                  this.PredictionIncipientcount = this.PredictionIncipientcount + 1;
                } else if (element.Prediction == 'degrade' || element == 'degarde') {
                  this.PredictionDegradecount = this.PredictionDegradecount + 1;
                }
              }
              });
              this.Degradepercentage = ((this.PredictionDegradecount /  this.PredictionDataTableList.length) * 100).toFixed(2);
              this.Incipientpercentage = ((this.PredictionIncipientcount /  this.PredictionDataTableList.length) * 100).toFixed(2);
              this.Normalpercentage = ((this.PredictionNormalcount /  this.PredictionDataTableList.length) * 100).toFixed(2);
            }
            }, err => {
              this.messageService.add({ severity: 'warn', detail: 'There is no data for this Dates', sticky: true });
  
              this.commonLoadingDirective.showLoading(false, " ");
            }
          )

    } else if (this.PredictionDate == 'Previous 1 Month') {
      var fromerDays= this.PredictionDatesList.slice(-1)
      var torDay= this.PredictionDatesList.slice(-30)
      const params3 = new HttpParams()
      .set('FromDate', moment(fromerDays, 'DD/MM/YYYY').format('YYYY-MM-DD'))
      .set('ToDate', moment(torDay, 'DD/MM/YYYY').format('YYYY-MM-DD'));
      var url3: string = this.screwCompressorAPIName.getPredictiontRecords;
      this.screwCompressorMethod.getWithParameters(url3, params3)
        .subscribe(
          res => {
            this.PredictionNormalcount=0
            this.PredictionIncipientcount=0
            this.PredictionDegradecount=0
            this.PredictionDataTableList = null;
            this.PredictionDataTableList = res;
            for (var i = 0; i < this.unique.length; ++i) {
              this.PredictionDataTableList.forEach(element => {
                var a = `${moment(element.InsertedDate).format('YYYY')}-${element.TagNumber}`
                if (a == this.unique[i]) {
                if (element.Prediction == 'normal') {
                  this.PredictionNormalcount = this.PredictionNormalcount + 1;
                } else if (element.Prediction == 'incipient') {
                  this.PredictionIncipientcount = this.PredictionIncipientcount + 1;
                } else if (element.Prediction == 'degrade' || element == 'degarde') {
                  this.PredictionDegradecount = this.PredictionDegradecount + 1;
                }
              }
              });
              this.Degradepercentage = ((this.PredictionDegradecount /  this.PredictionDataTableList.length) * 100).toFixed(2);
              this.Incipientpercentage = ((this.PredictionIncipientcount /  this.PredictionDataTableList.length) * 100).toFixed(2);
              this.Normalpercentage = ((this.PredictionNormalcount /  this.PredictionDataTableList.length) * 100).toFixed(2);
            }
            }, err => {
              this.messageService.add({ severity: 'warn', detail: 'There is no data for this Dates', sticky: true });
  
              this.commonLoadingDirective.showLoading(false, " ");
            }
          )

    } else if (this.PredictionDate == 'Previous 3 Month') {
      var fromerDays= this.PredictionDatesList.slice(-1)
      var torDay= this.PredictionDatesList.slice(-90)
      const params4 = new HttpParams()
      .set('FromDate', moment(fromerDays, 'DD/MM/YYYY').format('YYYY-MM-DD'))
      .set('ToDate', moment(torDay, 'DD/MM/YYYY').format('YYYY-MM-DD'));
      var url4: string = this.screwCompressorAPIName.getPredictiontRecords;
      this.screwCompressorMethod.getWithParameters(url4, params4)
        .subscribe(
          res => {
            this.PredictionNormalcount=0
            this.PredictionIncipientcount=0
            this.PredictionDegradecount=0
            this.PredictionDataTableList = null;
            this.PredictionDataTableList = res;
            for (var i = 0; i < this.unique.length; ++i) {
              this.PredictionDataTableList.forEach(element => {
                var a = `${moment(element.InsertedDate).format('YYYY')}-${element.TagNumber}`
                if (a == this.unique[i]) {
                if (element.Prediction == 'normal') {
                  this.PredictionNormalcount = this.PredictionNormalcount + 1;
                } else if (element.Prediction == 'incipient') {
                  this.PredictionIncipientcount = this.PredictionIncipientcount + 1;
                } else if (element.Prediction == 'degrade' || element == 'degarde') {
                  this.PredictionDegradecount = this.PredictionDegradecount + 1;
                }
              }
              });
              this.Degradepercentage = ((this.PredictionDegradecount /  this.PredictionDataTableList.length) * 100).toFixed(2);
              this.Incipientpercentage = ((this.PredictionIncipientcount /  this.PredictionDataTableList.length) * 100).toFixed(2);
              this.Normalpercentage = ((this.PredictionNormalcount /  this.PredictionDataTableList.length) * 100).toFixed(2);
            }
            }, err => {
              this.messageService.add({ severity: 'warn', detail: 'There is no data for this Dates', sticky: true });
  
              this.commonLoadingDirective.showLoading(false, " ");
            }
          )

    }
    else if (this.PredictionDate == 'Previous 1 Year') {
      var fromerDays= this.PredictionDatesList.slice(-1)
      var torDay= this.PredictionDatesList.slice(-365)
      const params4 = new HttpParams()
      .set('FromDate', moment(fromerDays, 'DD/MM/YYYY').format('YYYY-MM-DD'))
      .set('ToDate', moment(torDay, 'DD/MM/YYYY').format('YYYY-MM-DD'));
      var url4: string = this.screwCompressorAPIName.getPredictiontRecords;
      this.screwCompressorMethod.getWithParameters(url4, params4)
        .subscribe(
          res => {
            this.PredictionNormalcount=0
            this.PredictionIncipientcount=0
            this.PredictionDegradecount=0
            this.PredictionDataTableList = null;
            this.PredictionDataTableList = res;
            for (var i = 0; i < this.unique.length; ++i) {
              this.PredictionDataTableList.forEach(element => {
                var a = `${moment(element.InsertedDate).format('YYYY')}-${element.TagNumber}`
                if (a == this.unique[i]) {
                if (element.Prediction == 'normal') {
                  this.PredictionNormalcount = this.PredictionNormalcount + 1;
                } else if (element.Prediction == 'incipient') {
                  this.PredictionIncipientcount = this.PredictionIncipientcount + 1;
                } else if (element.Prediction == 'degrade' || element == 'degarde') {
                  this.PredictionDegradecount = this.PredictionDegradecount + 1;
                }
              }
              });
              this.Degradepercentage = ((this.PredictionDegradecount /  this.PredictionDataTableList.length) * 100).toFixed(2);
              this.Incipientpercentage = ((this.PredictionIncipientcount /  this.PredictionDataTableList.length) * 100).toFixed(2);
              this.Normalpercentage = ((this.PredictionNormalcount /  this.PredictionDataTableList.length) * 100).toFixed(2);
            }
            }, err => {
              this.messageService.add({ severity: 'warn', detail: 'There is no data for this Dates', sticky: true });
  
              this.commonLoadingDirective.showLoading(false, " ");
            }
          )

    }
    else {
      this.PredictionDataTableList = [];

    }
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
          this.FMList.forEach(item => {
            if(item.FMname === "SSRB"){
              item.FMname="Second stage rotar breakdown"
              item.chartID ="indication_barSSRB"
            }else  if(item.FMname === "RD"){
              item.FMname="Rotar Damage"
              item.chartID ="indication_barRD"
            }else  if(item.FMname === "CF"){
              item.FMname="Cooler Failure"
              item.chartID ="indication_barCF"
            }
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

          // this.AllRecordBarcharts();
          // this.ClassificationOfAllRecordDonught();
          // this.ClassificationOfAllpolarchart()
          // this.GenerateReport()
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
    // this.AllRecordBarcharts();
    // this.ClassificationOfAllpolarchart()
    // this.ClassificationOfAllRecordDonught()
  }

  FModeType() {
    if (this.fmtype == "SSRB" || this.fmtype == "CF" || this.fmtype == "RD" && this.selectedYear == "") {
      this.ScrewCompressorAllData = this.ScrewCompressorFilteredData.filter(val => (val.FailureModeType === "SSRB") || (val.FailureModeType === "CF") || (val.FailureModeType === "RD"));
    } else if (this.fmtype != "SSRB" && this.selectedYear != "") {
      this.ScrewCompressorAllData = this.ScrewCompressorFilteredData.filter(val => (val.FailureModeType === "SSRB") && moment(val.InsertedDate).format('YYYY') === this.selectedYear.toString());
    } else if (this.fmtype != "RD" && this.selectedYear != "") {
      this.ScrewCompressorAllData = this.ScrewCompressorFilteredData.filter(val => (val.FailureModeType === "RD") && moment(val.InsertedDate).format('YYYY') === this.selectedYear.toString());
    } else if (this.fmtype != "CF" && this.selectedYear != "") {
      this.ScrewCompressorAllData = this.ScrewCompressorFilteredData.filter(val => (val.FailureModeType === "CF") && moment(val.InsertedDate).format('YYYY') === this.selectedYear.toString());
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
    // this.AllRecordBarcharts();
    // this.ClassificationOfAllpolarchart()
    // this.ClassificationOfAllRecordDonught()
    //  this.ComboChart();
  }

 assetSelection(){
   this.assetselection= true;
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

    var list = this.PrescriptiveRecordsList.filter(r => r.EquipmentType === this.EquipmentType)
    this.TagList = []
    list.forEach(element => {
      this.TagList.push(element.TagNumber)
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

  DynamicCBA(res) {
    this.ComponentCriticalityFactor = res.ComponentCriticalityFactor
    this.CFrequencyMaintainenance = res.CFrequencyMaintainenance
    this.prescriptiveRecords.centrifugalPumpPrescriptiveFailureModes.forEach(row => {
      row.TotalAnnualPOC = 0;
      row.CentrifugalPumpMssModel.forEach(mss => {
        this.MSSStartergy = mss.MSSStartergy
        if (!mss.MSSMaintenanceInterval || mss.MSSMaintenanceInterval === 'NA' || mss.MSSMaintenanceInterval === 'Not Applicable') {
          mss.POC = 0;
          mss.AnnualPOC = 0;
          mss.Status = '';
          mss.MSSStartergy
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

    // this.CBICharts()
    // this.ALLGraphCBA()
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

  // ClassificationOfAllRecordDonught() {
  //   var a: any = [];
  //   this.Normalcount = 0,
  //     this.Incipientcount = 0,
  //     this.Degradecount = 0;
  //   this.ScrewCompressorAllData.forEach(element => {
  //     if (this.fmtype != "") {
  //       if (this.fmtype == "SSRB") {
  //         a.push(element.SSRB)
  //       } else if (this.fmtype == "CF") {
  //         a.push(element.CF)
  //       } if (this.fmtype == "RD") {
  //         a.push(element.RD)
  //       }
  //     } else {
  //       a.push(element.Classification)
  //     }

  //   });

  //   var precetagedegrade
  //   var precetageincipient
  //   var precetagenornal
  //   var precetagebad
  //   for (var i = 0; i < this.yearlist.length; ++i) {
  //     var SCcounter = 0
  //     this.ScrewCompressorAllData.forEach(value => {
  //       var a = moment(value.InsertedDate).format('YYYY')
  //       if (a == this.yearlist[i].yearname) {
  //         if (value.Classification == 'normal') {
  //           this.Normalcount = this.Normalcount + 1
  //         } else if (value.Classification == 'incipient') {
  //           this.Incipientcount = this.Incipientcount + 1
  //         } else if (value.Classification == 'degarde' || value.Classification == 'degrade') {
  //           this.Degradecount = this.Degradecount + 1
  //         } else {
  //           this.badcount = this.badcount + 1
  //         }
  //         SCcounter = SCcounter + 1
  //       }

  //     });
  //     this.ClassDegradepercentage = (this.Degradecount / this.ScrewCompressorAllData.length) * 100
  //     this.ClassIncipientpercentage = (this.Incipientcount / this.ScrewCompressorAllData.length) * 100
  //     this.ClassNormalpercentage = (this.Normalcount / this.ScrewCompressorAllData.length) * 100
  //     this.Classbadpercentage = (this.badcount / this.ScrewCompressorAllData.length) * 100

  //     this.ClassDegradepercentageForMessage = this.ClassDegradepercentage
  //     this.ClassIncipientpercentageForMessage = this.ClassIncipientpercentage
  //     this.ClassNormalpercentageForMessage = this.ClassNormalpercentage
  //     this.ClassbadpercentageForMessage = this.Classbadpercentage

  //     precetagedegrade = this.ClassDegradepercentage.toFixed()
  //     precetageincipient = this.ClassIncipientpercentage.toFixed()
  //     precetagenornal = this.ClassNormalpercentage.toFixed()
  //     precetagebad = this.Classbadpercentage.toFixed()
  //   }



  //   this.chart = new Chart('canvasClass', {
  //     type: 'doughnut',
  //     data: {
  //       labels: ["Normal", "Incipient", "Degrade", "Bad"],
  //       datasets: [
  //         {
  //           backgroundColor: ["#20c997", "#fa8b0c", "#ff3a7a", "blue"],
  //           data: [precetagenornal, precetageincipient, precetagedegrade, precetagebad],
  //         }
  //       ]
  //     },
  //     options: {
  //       // events: [],
  //       animation: {
  //         duration: 500,
  //         easing: "easeOutQuart",
  //         onComplete: function () {
  //           var ctx = this.chart.ctx;
  //           ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
  //           ctx.textAlign = 'center';
  //           ctx.textBaseline = 'bottom';

  //           this.data.datasets.forEach(function (dataset) {
  //             for (var i = 0; i < dataset.data.length; i++) {
  //               var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
  //                 total = dataset._meta[Object.keys(dataset._meta)[0]].total,
  //                 mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius) / 2,
  //                 start_angle = model.startAngle,
  //                 end_angle = model.endAngle,
  //                 mid_angle = start_angle + (end_angle - start_angle) / 2;

  //               var x = mid_radius * Math.cos(mid_angle);
  //               var y = mid_radius * Math.sin(mid_angle);

  //               ctx.fillStyle = '#fff';
  //               if (i == 3) {
  //                 ctx.fillStyle = '#444';
  //               }
  //               var percent = String(Math.round(dataset.data[i] / total * 100)) + "%";
  //               ctx.fillText(percent, model.x + x, model.y + y + 15);
  //             }
  //           });
  //         }
  //       }
  //     }
  //   });

  // }

  // ClassificationOfAllpolarchart() {
  //   this.changeDetectorRef.detectChanges();
  //   this.ScrewCompressorAllData.sort()
  //   var LabelDates: any = [];
  //   this.yearlist.forEach(element => {
  //     LabelDates.push(element.yearname)
  //     LabelDates.sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
  //   });

  //   var a: any = [];
  //   this.Normalcount = 0,
  //     this.Incipientcount = 0,
  //     this.Degradecount = 0;
  //   this.ScrewCompressorAllData.forEach(element => {
  //     if (this.fmtype != "") {
  //       if (this.fmtype == "SSRB") {
  //         a.push(element.SSRB)
  //       } else if (this.fmtype == "CF") {
  //         a.push(element.CF)
  //       } if (this.fmtype == "RD") {
  //         a.push(element.RD)
  //       }
  //     } else {
  //       a.push(element.Classification)
  //     }

  //   });

  //   for (var i = 0; i < this.yearlist.length; ++i) {
  //     var SCFPnormal = 0
  //     var SCFPincipient = 0
  //     var SCFPdegrade = 0
  //     var SCFPbad = 0
  //     var SCcounter = 0

  //     this.ScrewCompressorAllData.forEach(value => {
  //       var a = moment(value.InsertedDate).format('YYYY')
  //       if (a == this.yearlist[i].yearname) {
  //         if (value.Classification == 'normal') {
  //           SCFPnormal = SCFPnormal + 1
  //         } else if (value.Classification == 'incipient') {
  //           SCFPincipient = SCFPincipient + 1
  //         } else if (value.Classification == 'degarde' || value.Classification == 'degrade') {
  //           SCFPdegrade = SCFPdegrade + 1
  //         } else {
  //           SCFPbad = SCFPbad + 1
  //         }
  //         SCcounter = SCcounter + 1
  //       }

  //     });
  //     var precetagedegrade
  //     var precetageincipient
  //     var precetagenornal
  //     var precetagebad

  //     SCFPnormal = ((SCFPnormal / SCcounter) * 100)
  //     SCFPincipient = ((SCFPincipient / SCcounter) * 100)
  //     SCFPdegrade = ((SCFPdegrade / SCcounter) * 100)
  //     SCFPbad = ((SCFPbad / SCcounter) * 100)

  //     precetagedegrade = SCFPdegrade.toFixed()
  //     precetageincipient = SCFPincipient.toFixed()
  //     precetagenornal = SCFPnormal.toFixed()
  //     precetagebad = SCFPbad.toFixed()

  //     this.SCFinalNormal.push(precetagenornal)
  //     this.SCFinalIncipient.push(precetageincipient)
  //     this.SCFinaldDegrade.push(precetagedegrade)
  //     this.SCFinalBad.push(precetagebad)
  //   }

  //   this.changeDetectorRef.detectChanges();
  //   this.chart = new Chart("polarArea", {
  //     type: "bar",
  //     data: {
  //       labels: LabelDates,
  //       fill: true,
  //       datasets: [
  //         {
  //           label: "Normal",
  //           data: this.SCFinalNormal,
  //           borderWidth: 1,
  //           borderColor: "#20c997",
  //           backgroundColor: '#20c997',
  //           fill: true,
  //         },
  //         {
  //           label: "Incipient",
  //           data: this.SCFinalIncipient,
  //           borderWidth: 1,
  //           borderColor: "#fa8b0c",
  //           backgroundColor: '#fa8b0c',
  //           fill: true,
  //         },
  //         {
  //           label: "Degrade",
  //           data: this.SCFinaldDegrade,
  //           borderWidth: 1,
  //           borderColor: "#ff3a7a",
  //           backgroundColor: '#ff3a7a',
  //           fill: true,
  //         },
  //         {
  //           label: "Bad",
  //           data: this.SCFinalBad,
  //           borderWidth: 1,
  //           borderColor: "blue",
  //           backgroundColor: 'blue',
  //           fill: true,
  //         },

  //       ],
  //     },
  //     options: {
  //       scales: {
  //         xAxes: [{
  //           scaleLabel: {
  //             display: true,
  //             labelString: 'Years'
  //           },
  //           gridLines: {
  //             display: false,
  //             labelString: 'Years'
  //           },
  //         }],
  //         yAxes: [
  //           {
  //             scaleLabel: {
  //               display: true,
  //               labelString: 'Percentage'
  //             },
  //             ticks: {
  //               beginAtZero: true
  //             },
  //             gridLines: {
  //               display: false
  //             },
  //           }
  //         ]
  //       },
  //       "animation": {
  //         "duration": 1,
  //         "onComplete": function () {
  //           var chartInstance = this.chart,
  //             ctx = chartInstance.ctx;
  //           this.data.datasets.forEach(function (dataset, i) {
  //             var meta = chartInstance.controller.getDatasetMeta(i);
  //             meta.data.forEach(function (bar, index) {
  //               var data = dataset.data[index];
  //               if (data > 0) {
  //                 ctx.fillText(data, bar._model.x, bar._model.y - 5);
  //               }
  //             });
  //           });
  //         }
  //       },
  //     }
  //   });
  // }

  // AllRecordBarcharts() {
  //   this.changeDetectorRef.detectChanges();
  //   if (this.state.TrainnNavigate == 2) {
  //     var elmnt = document.getElementById("Trainnavigate");
  //     elmnt.scrollIntoView();
  //   }
  //   let dateForFilter = [];
  //   this.TrainDataIncipientCount = []
  //   this.TrainDataNormalCount = []
  //   this.TrainDataDegradeCount = []
  //   for (var i = 0; i < this.ScrewCompressorAllData.length; i++) {
  //     if (!this.isDateInArray(new Date(this.ScrewCompressorAllData[i].InsertedDate), dateForFilter)) {
  //       dateForFilter.push(new Date(this.ScrewCompressorAllData[i].InsertedDate));
  //     }
  //   }
  //   let dateForFilter1 = [];
  //   dateForFilter.forEach((value) => {
  //     var Date = moment(value).format('YYYY-MM-DD');
  //     dateForFilter1.push(Date);
  //     dateForFilter1.sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
  //   });
  //   var SCcounter = 0
  //   for (var i = 0; i < dateForFilter1.length; i++) {
  //     var a = [];
  //     this.ScrewCompressorAllData.forEach(element => {
  //       if (moment(element.InsertedDate).format('YYYY-MM-DD') == dateForFilter1[i]) {
  //         a.push(element.Classification)
  //       }
  //       SCcounter = SCcounter + 1
  //     });
  //     var normal = 0
  //     var incipient = 0
  //     var degrade = 0
  //     var bad = 0
  //     a.forEach((value) => {
  //       if (value == 'normal') {
  //         normal = normal + 1
  //       } else if (value == 'incipient') {
  //         incipient = incipient + 1
  //       } else if (value == 'degarde' || value == 'degrade') {
  //         degrade = degrade + 1
  //       } else {
  //         bad = bad + 1
  //       }
  //     });

  //     this.TrainDataIncipientCount.push(incipient)
  //     this.TrainDataNormalCount.push(normal)
  //     this.TrainDataDegradeCount.push(degrade)
  //     this.TrainDataBadCount.push(bad)

  //   }
  //   this.changeDetectorRef.detectChanges();
  //   this.chart = new Chart("canvas1", {
  //     type: "bar",
  //     data: {
  //       labels: dateForFilter1,
  //       datasets: [
  //         {
  //           label: "Incipent",
  //           data: this.TrainDataIncipientCount,
  //           borderWidth: 1,
  //           backgroundColor: "#fa8b0c",
  //         }, {
  //           label: "Normal",
  //           data: this.TrainDataNormalCount,
  //           borderWidth: 1,
  //           backgroundColor: "#20c997",
  //         },
  //         {
  //           label: "Degrade",
  //           data: this.TrainDataDegradeCount,
  //           borderWidth: 2,
  //           backgroundColor: "#ff3a7a",
  //         },
  //         {
  //           label: "Bad",
  //           data: this.TrainDataBadCount,
  //           borderWidth: 1,
  //           backgroundColor: "blue",
  //         }
  //       ]
  //     },
  //     options: {
  //       events: [],
  //       scales: {
  //         xAxes: [{
  //           scaleLabel: {
  //             display: true,
  //             labelString: 'Days'
  //           },
  //           gridLines: {
  //             display: false,
  //           },
  //           stacked: true,
  //         }],
  //         yAxes: [
  //           {
  //             scaleLabel: {
  //               stacked: true,
  //               display: true,
  //               labelString: 'Recoreded Data In Numbers'
  //             },
  //             ticks: {
  //               beginAtZero: true,
  //               max: 12,
  //             },
  //             gridLines: {
  //               display: false
  //             },
  //           }
  //         ]
  //       },
  //       // "animation": {
  //       //   "duration": 1,
  //       //   "onComplete": function () {
  //       //     var chartInstance = this.chart,
  //       //       ctx = chartInstance.ctx;
  //       //     this.data.datasets.forEach(function (dataset, i) {
  //       //       var meta = chartInstance.controller.getDatasetMeta(i);
  //       //       meta.data.forEach(function (bar, index) {
  //       //         var data = dataset.data[index];
  //       //         if (data > 0) {
  //       //           ctx.fillText(data, bar._model.x, bar._model.y - 5);
  //       //        }
  //       //       });
  //       //     });
  //       //   }
  //       // },
  //     }

  //   });
  // }

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
    this.Degradepercentage = ((this.PredictionDegradecount / a.length) * 100).toFixed(2);
    this.Incipientpercentage = ((this.PredictionIncipientcount / a.length) * 100).toFixed(2);
    this.Normalpercentage = ((this.PredictionNormalcount / a.length) * 100).toFixed(2);


    this.changeDetectorRef.detectChanges();
    this.chart = new Chart("PredictionPie", {
      type: 'pie',
      data: {
        labels: ["Normal", "Incipient", "Degrade"],
        fill: true,
        datasets: [
          {
            backgroundColor: ["#20c997", "#fa8b0c", "#ff3a7a"],
            data: [this.Normalpercentage, this.Incipientpercentage, this.Degradepercentage]
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
                  mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius) / 2,
                  start_angle = model.startAngle,
                  end_angle = model.endAngle,
                  mid_angle = start_angle + (end_angle - start_angle) / 2;

                var x = mid_radius * Math.cos(mid_angle);
                var y = mid_radius * Math.sin(mid_angle);

                ctx.fillStyle = '#fff';
                if (i == 3) {
                  ctx.fillStyle = '#444';
                }
                var percent = String(Math.round(dataset.data[i] / total * 100)) + "%";
                ctx.fillText(percent, model.x + x, model.y + y + 15);
              }
            });
          }
        }
      }
    });

  }
//  PredictionAllRecordDonught() {
//     this.changeDetectorRef.detectChanges();
//     this.ScrewPredictionAllData.sort()

//     var LabelDatess: any = [];
//     this.Pyearlist.forEach(element => {
//       LabelDatess = LabelDatess.filter(function (element) {
//         return element !== undefined;
//       });
//       LabelDatess.push(element.Predictyearname)
//       LabelDatess.sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
//     });

//     for (var i = 0; i < this.Pyearlist.length; ++i) {
//       var FPnormal = 0
//       var FPincipient = 0
//       var FPdegrade = 0
//       var FPbad = 0
//       var counter = 0
//       this.ScrewPredictionAllData.forEach(value => {
//         var a = moment(value.InsertedDate).format('YYYY')
//         if (a == this.Pyearlist[i].Predictyearname) {
//           if (value.Prediction == 'normal') {
//             FPnormal = FPnormal + 1
//           } else if (value.Prediction == 'incipient') {
//             FPincipient = FPincipient + 1
//           } else if (value.Prediction == 'degarde' || value.Prediction == 'degrade') {
//             FPdegrade = FPdegrade + 1
//           } else {
//             FPbad = FPbad + 1
//           }
//           counter = counter + 1
//         }

//       });
//       var fperc_Incipient
//       var fperc_Normal
//       var fperc_Degrade
//       var fperc_Bad
//       FPnormal = ((FPnormal / counter) * 100)
//       FPincipient = ((FPincipient / counter) * 100)
//       FPdegrade = ((FPdegrade / counter) * 100)
//       FPbad = ((FPbad / counter) * 100)

//       fperc_Incipient = FPnormal.toFixed()
//       fperc_Normal = FPincipient.toFixed()
//       fperc_Degrade = FPdegrade.toFixed()
//       fperc_Bad = FPbad.toFixed()

//       this.FPFinalNormal.push(fperc_Normal)
//       this.FPFinalIncipient.push(fperc_Incipient)
//       this.FPFinaldDegrade.push(fperc_Degrade)
//       this.FPFinalBad.push(fperc_Bad)

//     }

//     this.changeDetectorRef.detectChanges();
//     this.chart = new Chart("PredictioncanvasClass", {
//       type: "bar",
//       data: {
//         labels: LabelDatess,
//         fill: true,
//         datasets: [
//           {
//             label: "Normal",
//             data: this.FPFinalNormal,
//             borderWidth: 1,
//             borderColor: "#20c997",
//             backgroundColor: '#20c997',
//             fill: true,

//           },
//           {
//             label: "Incipient",
//             data: this.FPFinalIncipient,
//             borderWidth: 1,
//             borderColor: "#fa8b0c",
//             backgroundColor: '#fa8b0c',
//             fill: true,

//           },
//           {
//             label: "Degrade",
//             data: this.FPFinaldDegrade,
//             borderWidth: 1,
//             borderColor: "#ff3a7a",
//             backgroundColor: '#ff3a7a',
//             fill: true,

//           },
//           {
//             label: "Bad",
//             data: this.FPFinalBad,
//             borderWidth: 1,
//             borderColor: "blue",
//             backgroundColor: 'blue',
//             fill: true,
//           },

//         ],
//       },
//       options: {
//         events: [],
//         scales: {
//           xAxes: [{
//             stacked: true,
//             gridLines: {
//               display: false
//             },
//           }],
//           yAxes: [
//             {
//               stacked: true,
//               scaleLabel: {
//                 display: true,
//                 labelString: 'In_Percentage'
//               },
//               ticks: {
//                 beginAtZero: true,
//                 gridLines: {
//                   display: false
//                 },
//               }
//             }
//           ]
//         },
//         "animation": {
//           "duration": 1,
//           "onComplete": function () {
//             var chartInstance = this.chart,
//               ctx = chartInstance.ctx;
//             this.data.datasets.forEach(function (dataset, i) {
//               var meta = chartInstance.controller.getDatasetMeta(i);
//               meta.data.forEach(function (bar, index) {
//                 var data = dataset.data[index];
//                 if (data > 0) {
//                   ctx.fillText(data, bar._model.x, bar._model.y - 5);
//                 }
//               });
//             });
//           }
//         },
//       }

//     });
//   }
  // PredictionAllRecordBarcharts() {
  //   this.changeDetectorRef.detectChanges();
  //   if (this.state.PredictionNavigate == 1) {
  //     var elmnt = document.getElementById("Predictionnavigate");
  //     elmnt.scrollIntoView();
  //   }

  //   let dateForFilter = [];
  //   this.PredictionDataNormalCount = []
  //   this.PredictionDataIncipientCount = []
  //   this.PredictonDataDegradeCount = []
  //   for (var i = 0; i < this.ScrewPredictionAllData.length; i++) {
  //     if (!this.isDateInArray(new Date(this.ScrewPredictionAllData[i].InsertedDate), dateForFilter)) {
  //       dateForFilter.push(new Date(this.ScrewPredictionAllData[i].InsertedDate));
  //     }
  //   }
  //   let dateForFilter1 = [];
  //   dateForFilter.forEach((value) => {
  //     var Date = moment(value).format('YYYY-MM-DD');
  //     dateForFilter1.push(Date);
  //     dateForFilter1.sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
  //   });
  //   for (var i = 0; i < dateForFilter1.length; i++) {
  //     var a = [];
  //     this.ScrewPredictionAllData.forEach(element => {
  //       if (moment(element.InsertedDate).format('YYYY-MM-DD') == dateForFilter1[i]) {
  //         if (this.fmtype != "") {
  //           if (this.fmtype == "SSRB") {
  //             a.push(element.SSRB)
  //           } else if (this.fmtype == "CF") {
  //             a.push(element.CF)
  //           } if (this.fmtype == "RD") {
  //             a.push(element.RD)
  //           }
  //         } else {
  //           a.push(element.Prediction)
  //         }
  //       }
  //     });

  //     var normal = 0
  //     var incipient = 0
  //     var degrade = 0
  //     var bad = 0

  //     a.forEach((value) => {
  //       if (value == 'normal') {
  //         normal = normal + 1
  //       } else if (value == 'incipient') {
  //         incipient = incipient + 1
  //       } else if (value == 'degarde' || value == 'degrade') {
  //         degrade = degrade + 1
  //       } else {
  //         bad = bad + 1
  //       }
  //     });
  //     this.PredictionDataNormalCount.push(normal)
  //     this.PredictionDataIncipientCount.push(incipient)
  //     this.PredictonDataDegradeCount.push(degrade)
  //     this.PredictionDataBadCount.push(bad)
  //   }
  //   this.changeDetectorRef.detectChanges();
  //   this.chart = new Chart("Predictionbarline", {
  //     type: "bar",
  //     data: {
  //       labels: dateForFilter1,
  //       fill: true,
  //       datasets: [
  //         {
  //           label: "Normal",
  //           data: this.PredictionDataNormalCount,
  //           borderWidth: 1,
  //           borderColor: "#20c997",
  //           backgroundColor: '#20c997',
  //           fill: true,
  //         }, {
  //           label: "Incipent",
  //           data: this.PredictionDataIncipientCount,
  //           borderWidth: 1,
  //           borderColor: "#fa8b0c",
  //           backgroundColor: '#fa8b0c',
  //           fill: true,
  //         },
  //         {
  //           label: "Degrade",
  //           data: this.PredictonDataDegradeCount,
  //           borderWidth: 1,
  //           borderColor: " #ff3a7a",
  //           backgroundColor: '#ff3a7a',
  //           fill: true,
  //         }
  //       ]
  //     },
  //     options: {
  //       events: [],
  //       scales: {
  //         xAxes: [{
  //           gridLines: {
  //             display: false
  //           },
  //           stacked: true,
  //         }],
  //         yAxes: [{
  //           stacked: true,
  //           ticks: {
  //             beginAtZero: true,
  //             max: 3,
  //           },
  //           gridLines: {
  //             display: false
  //           },
  //         }]
  //       },
  //       // "animation": {
  //       //   "duration": 1,
  //       //   "onComplete": function () {
  //       //     var chartInstance = this.chart,
  //       //       ctx = chartInstance.ctx;
  //       //     this.data.datasets.forEach(function (dataset, i) {
  //       //       var meta = chartInstance.controller.getDatasetMeta(i);
  //       //       meta.data.forEach(function (bar, index) {
  //       //         var data = dataset.data[index];
  //       //         if (data > 0) {
  //       //           ctx.fillText(data, bar._model.x, bar._model.y - 5);
  //       //        }
  //       //       });
  //       //     });
  //       //   }
  //       // },

  //     }
  //   });
  // }

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
            var counter = 0
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
            this.FutuerPredictionDataNormalCount = (FutuerPredictionnormalCount)
            this.FutuerPredictionDataIncipientCount = (FutuerPredictionincipientCount)
            this.FutuerPredictonDataDegradeCount = (FutuerPredictiondegradeCount)

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
          // this.FutuerlineChart()
           this.FutuerdDonughtchart()
          // this.Futuerpiechart()
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
      if (`${this.FutuerPredictionAllData[i]}.${this.fmtype == "SSRB" || this.fmtype == "CF" || this.fmtype == "RD"}` == "degarde") {
        this.FutuerPredictionDegradecount = this.FutuerPredictionDegradecount + 1
      } else if (`${this.FutuerPredictionAllData[i]}.${this.fmtype == "SSRB" || this.fmtype == "CF" || this.fmtype == "RD"}` == "incipient") {
        this.FutuerPredictionIncipientcount = this.FutuerPredictionIncipientcount + 1
      } else if (`${this.FutuerPredictionAllData[i]}.${this.fmtype == "SSRB" || this.fmtype == "CF" || this.fmtype == "RD"}` == "normal") {
        this.FutuerPredictionNormalcount = this.FutuerPredictionNormalcount + 1
      } else
        this.FutuerPredictionbadcount = this.FutuerPredictionbadcount + 1
    }

    // this.FutuerlineChart()
    // this.FutuerdDonughtchart()
    // this.Futuerpiechart()
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

      this.FutuerPredictionAllData.forEach(value => {
        var a = moment(value.PredictedDate).format('YYYY')
        if (a == this.FuterPredictyearlist[i].FutuerPredictyearname) {
          if (value.Prediction == 'normal') {
            this.forcastPnormal =  this.forcastPnormal + 1
          } else if (value.Prediction == 'incipient') {
            this.forcastFPincipient =  this.forcastFPincipient + 1
          } else if (value.Prediction == 'degarde' || value.Prediction == 'degrade') {
            this.forcastFPdegrade =  this.forcastFPdegrade + 1
          } else {
            this.forcastFPbad =  this.forcastFPbad + 1
          }
          this.forcastcounter =  this.forcastcounter + 1
        }

      });
      var a: any = [];
      var b: any = [];
      var c: any = [];
      var d: any = [];
      this.forcastPnormal = (( this.forcastPnormal /  this.forcastcounter) * 100)
      this.forcastFPincipient = (( this.forcastFPincipient /  this.forcastcounter) * 100)
      this.forcastFPdegrade = (( this.forcastFPdegrade /  this.forcastcounter) * 100)
      this.forcastFPbad = (( this.forcastFPbad /  this.forcastcounter) * 100)


      a.push(this.forcastPnormal)
      b.push(this.forcastFPincipient)
      c.push(this.forcastFPdegrade)
      d.push(this.forcastFPbad)

      this.forcastFinalNormal= parseFloat(a).toFixed(1)
      this.forcastFinalIncipient= parseFloat(b).toFixed(1)
      this.forcastFinaldDegrade= parseFloat(c).toFixed(1)
      this.forcastFinalBad= parseFloat(d).toFixed(1)

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
            borderColor: "#20c997",
            backgroundColor: '#20c997',
            fill: true,
          },
          {
            label: "Incipient",
            data: this.forcastFinalIncipient,
            borderWidth: 1,
            borderColor: "#fa8b0c",
            backgroundColor: '#fa8b0c',
            fill: true,
          },
          {
            label: "Degrade",
            data: this.forcastFinaldDegrade,
            borderWidth: 1,
            borderColor: "#ff3a7a",
            backgroundColor: '#ff3a7a',
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

  // Futuerpiechart() {
  //   var a: any = [];
  //   this.FutuerPredictionNormalcount = 0,
  //     this.FutuerPredictionIncipientcount = 0,
  //     this.FutuerPredictionDegradecount = 0;
  //   var FPClassDegradepercentage
  //   var FPClassIncipientpercentage
  //   var FPClassNormalpercentage
  //   this.FutuerPredictionAllData.forEach(element => {
  //     if (this.fmtype != "") {
  //       if (this.fmtype == "SSRB") {
  //         a.push(element.SSRB)
  //       } else if (this.fmtype == "CF") {
  //         a.push(element.CF)
  //       } if (this.fmtype == "RD") {
  //         a.push(element.RD)
  //       }
  //     } else {
  //       a.push(element.Prediction)
  //     }

  //   });
  //   a.forEach(element => {
  //     if (element == 'normal') {
  //       this.FutuerPredictionNormalcount = this.FutuerPredictionNormalcount + 1;
  //     } else if (element == 'incipient') {
  //       this.FutuerPredictionIncipientcount = this.FutuerPredictionIncipientcount + 1;
  //     } else if (element == 'degrade' || element == 'degarde') {
  //       this.FutuerPredictionDegradecount = this.FutuerPredictionDegradecount + 1;
  //     }
  //   });
  //   FPClassDegradepercentage = ((this.FutuerPredictionDegradecount / a.length) * 100).toFixed(2);
  //   FPClassIncipientpercentage = ((this.FutuerPredictionIncipientcount / a.length) * 100).toFixed(2);
  //   FPClassNormalpercentage = ((this.FutuerPredictionNormalcount / a.length) * 100).toFixed(2);

  //   this.changeDetectorRef.detectChanges();
  //   this.chart = new Chart('FutuerPredictionPie', {
  //     type: 'pie',
  //     data: {
  //       labels: ["Normal", "Incipient", "Degrade"],
  //       datasets: [
  //         {
  //           backgroundColor: ["#20c997", "#fa8b0c", "#ff3a7a"],
  //           data: [FPClassNormalpercentage, FPClassIncipientpercentage, FPClassDegradepercentage]
  //         }
  //       ]
  //     },
  //     options: {
  //       // events: [],
  //     }
  //   });
  // }


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
  //   //           // colors: ['green','green', 'gray', '#fa8b0c','red','#fa8b0c','red'],
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
  //   //             //   color: ['#fa8b0c'],
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
  //   //         //     colors: ['green', '#58508d', 'gray', '#fa8b0c','red','#fa8b0c','red',],
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

  // dygraph() {
  //   this.chart = new Dygraph(
  //     document.getElementById("graph"),"dist/DPM/assets/dygraph145records.csv",
  //     {
  //       visibility: [true, true, true,],
  //       colors: ['green', 'blue',],
  //       showRangeSelector: true,
  //       valueRange: [160],
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
  //           pointSize: 2.5,
  //         },
  //       }
  //     })
  // }

  // public GenerateReport() {
  //   var countKey = Object.keys(this.classificationDetails).length;
  //   this.totalCount = countKey
  //   var uniqueNames = [];
  //   var uniqueObj = [];

  //   for (var i = 0; i < this.classificationDetails.length; i++) {

  //     if (uniqueNames.indexOf(this.classificationDetails[i].Classification) === -1) {
  //       uniqueObj.push(this.classificationDetails[i])
  //       uniqueNames.push(this.classificationDetails[i].Classification);
  //     }

  //   }

  //   var result: any = [];

  //   if (this.classificationDetails != 0) {

  //     this.classificationDetails.forEach(function (o) {
  //       Object.keys(o).forEach(function (k) {
  //         result[k] = result[k] || {};
  //         result[k][o[k]] = (result[k][o[k]] || 0) + 1;
  //       });
  //     });
  //     this.incipient = result.Classification.incipient;
  //     if (this.incipient == undefined) {
  //       this.incipient = 0;
  //     }
  //     this.degrade = result.Classification.degrade;
  //     if (this.degrade == undefined) {
  //       this.degrade = 0;
  //     }
  //     this.normal = result.Classification.normal;
  //     if (this.normal == undefined) {
  //       this.normal = 0;
  //     }
  //     this.normalpercentage = this.normal / this.totalCount * 100
  //     this.incipientPerentage = this.incipient / this.totalCount * 100
  //     this.degradePercentage = this.degrade / this.totalCount * 100

  //     var ACCCalculation: any = [((this.normalpercentage / 100) * 1) + ((this.incipientPerentage / 100) * 5) + ((this.degradePercentage / 100) * 10)];

  //     if (ACCCalculation == NaN) {
  //       ACCCalculation = 0;
  //     }

  //     this.finalACCCalculation = parseFloat(ACCCalculation);
  //   }
  //   var AFPcountKey = Object.keys(this.screwWithPredictionDetails).length;
  //   this.AFPtotalCount = AFPcountKey


  //   var AFPuniqueNames = [];
  //   var AFPuniqueObj = [];

  //   for (var i = 0; i < this.screwWithPredictionDetails.length; i++) {

  //     if (AFPuniqueNames.indexOf(this.screwWithPredictionDetails[i].Classification) === -1) {
  //       AFPuniqueObj.push(this.screwWithPredictionDetails[i])
  //       AFPuniqueNames.push(this.screwWithPredictionDetails[i].Classification);
  //     }

  //   }
  //   var result: any = [];

  //   if (this.screwWithPredictionDetails.length != 0) {
  //     this.screwWithPredictionDetails.forEach(function (o) {
  //       Object.keys(o).forEach(function (k) {
  //         result[k] = result[k] || {};
  //         result[k][o[k]] = (result[k][o[k]] || 0) + 1;
  //       });
  //     });

  //     this.AFPincipient = result.Prediction.incipient;
  //     if (this.AFPincipient == undefined) {
  //       this.AFPincipient = 0;
  //     }
  //     this.AFPdegrade = result.Prediction.degrade;
  //     if (this.AFPdegrade == undefined) {
  //       this.AFPdegrade = 0;
  //     }
  //     this.AFPnormal = result.Prediction.normal;
  //     if (this.AFPnormal == undefined) {
  //       this.AFPnormal = 0;
  //     }
  //     this.FinalAFPnormal = (this.AFPnormal + this.normal);
  //     this.FinalAFPincipient = (this.AFPincipient + this.incipient);
  //     this.FinalAFPdegrade = (this.AFPdegrade + this.degrade);

  //     this.FinalAFPTotalCount = this.totalCount + this.AFPtotalCount

  //     this.AFPnormalpercentage = (this.FinalAFPnormal / this.FinalAFPTotalCount * 100)

  //     this.AFPincipientPerentage = (this.FinalAFPincipient / this.FinalAFPTotalCount * 100)

  //     this.AFPdegradePercentage = (this.FinalAFPdegrade / this.FinalAFPTotalCount * 100)

  //     var AFCCalcuation: any = [((this.AFPnormalpercentage / 100) * 1) + ((this.AFPincipientPerentage / 100) * 5) + ((this.AFPdegradePercentage / 100) * 10)];

  //     this.FinalAFCCalcuation = parseFloat(AFCCalcuation);
  //   }
  //   var LMH: any = [(0 * 1) + (1 * 5) + (0 * 10)]

  //   var HSECES: any = [(0 * 1) + (1 * 10)]

  //   var CRIT: any = [(0 * 10) + (1 * 5) + (0 * 1)]


  //   this.PerformanceNumber = [this.finalACCCalculation + this.FinalAFCCalcuation +
  //     parseFloat(LMH) + parseFloat(HSECES)
  //     + parseFloat(CRIT)];

  //   this.finalPerformanceNumber = parseFloat(this.PerformanceNumber);

  //   if (this.PerformanceNumber > 10) {
  //     this.DAB = "Yes"
  //   } else {
  //     this.DAB = "No"
  //   }
  // }

  // GetReportRecords() {
  //   const url: string = this.screwCompressorAPIName.getTrainList
  //   this.screwCompressorMethod.getWithoutParameters(this.screwCompressorAPIName.GetAllRecords)
  //     .subscribe(res => {
  //       this.classificationDetails = res;
  //       this.commonLoadingDirective.showLoading(false, '');
  //     },
  //       error => {
  //         console.log(error);
  //       }
  //     );
  //   this.commonLoadingDirective.showLoading(false, '');
  //   const url11 = this.profileAPIName.ProfileAPI
  //   this.screwCompressorMethod.getWithoutParameters(url11)
  //     .subscribe(
  //       res => {
  //         this.user = res;
  //         this.commonLoadingDirective.showLoading(false, '');
  //       },
  //       err => {
  //         this.commonLoadingDirective.showLoading(false, '');
  //         console.log(err);
  //       },
  //     );

  //   const url2: string = this.screwCompressorAPIName.getPredictedList;
  //   this.screwCompressorMethod.getWithoutParameters(url2)
  //     .subscribe(res => {
  //       this.screwWithPredictionDetails = res;
  //       if (this.screwWithPredictionDetails.length == 0) {
  //         this.commonLoadingDirective.showLoading(false, '');
  //       } else {
  //         this.commonLoadingDirective.showLoading(false, '');
  //       }
  //     }, err => {
  //       this.commonLoadingDirective.showLoading(false, '');
  //       console.log(err.error);
  //     });
  // }

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
    } 
    else if (this.CBIGraphs == "MEI") {
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
                 barThickness: 10,  
              maxBarThickness: 10 ,
                display: true,
                labelString: 'In_Percentage'
              },
              ticks: {
                beginAtZero: true
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

  // ResidualRiskGraph() {
  //   this.changeDetectorRef.detectChanges();
  //   var residualcostWithoutDPM: number = + (this.ResidualRiskWithOutDPM)
  //   var residualCostDPMWithoutConstraint: number = + (this.ResidualRiskWithDPM)
  //   var residualCostWithDPMConstraint: number = + (this.ResidualRiskWithConstraintDPMCR)
  //   var residualtotal = (residualcostWithoutDPM + residualCostDPMWithoutConstraint + residualCostWithDPMConstraint)

  //   var resdualtWithoutDPM = ((residualcostWithoutDPM / residualtotal) * 100).toFixed(2)
  //   var residualcostwithDPM = ((residualCostDPMWithoutConstraint / residualtotal) * 100).toFixed(2)
  //   var residualwithConstraint = ((residualCostWithDPMConstraint / residualtotal) * 100).toFixed(2)

  //   this.chart = new Chart("residual_risk", {
  //     type: "bar",
  //     data: {
  //       labels: ["Residual Risk"],
  //       datasets: [
  //         {
  //           label: "Without DPM",
  //           backgroundColor: "#d72631",
  //           borderColor: "#d72631",
  //           borderWidth: 1,
  //           data: [resdualtWithoutDPM,]
  //         },
  //         {
  //           label: "With DPM",
  //           backgroundColor: "#039fbe",
  //           borderColor: "#039fbe",
  //           borderWidth: 1,
  //           data: [residualcostwithDPM,]
  //         },
  //         {
  //           label: "With Constraint",
  //           backgroundColor: "#5c3c92",
  //           borderColor: "#5c3c92",
  //           borderWidth: 1,
  //           data: [residualwithConstraint]
  //         },
  //       ]
  //     },
  //     options: {
  //       scales: {
  //         yAxes: [
  //           {
  //             scaleLabel: {
  //               display: true,
  //               labelString: 'In_Percentage'
  //             },
  //             ticks: {
  //               beginAtZero: true
  //             }
  //           }
  //         ]
  //       },
  //       "animation": {
  //         "duration": 1,
  //         "onComplete": function () {
  //           var chartInstance = this.chart,
  //             ctx = chartInstance.ctx;
  //           this.data.datasets.forEach(function (dataset, i) {
  //             var meta = chartInstance.controller.getDatasetMeta(i);
  //             meta.data.forEach(function (bar, index) {
  //               var data = dataset.data[index];
  //               if (data > 0) {
  //                 ctx.fillText(data, bar._model.x, bar._model.y - 5);
  //               }
  //             });
  //           });
  //         }
  //       },
  //     }
  //   });

  // }

  MEIGraph() {
    this.changeDetectorRef.detectChanges();
    var meicostWithoutDPM: number = +  (this.MEIWithoutDPM)
    var meiCostDPMWithoutConstraint: number = + (this.MEIWithDPMWithoutConstraint)
    var meiCostWithDPMConstraint: number 
    if(this.EconomicRiskWithConstraintDPM >0){
       meiCostWithDPMConstraint = this.MEIWithDPMWithConstraint
    }else{
      meiCostWithDPMConstraint=0
    }
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

  ALLGraphCBA() {
    var eonomicriskwithoutDPM: number = +(this.EconomicRiskWithOutDPM)
    var eonomicriskwithDPM: number = +(this.EconomicRiskWithDPM)
    var eonomicriskwithConstraint: number = +(this.EconomicRiskWithConstraintDPM)
    var total: number = (eonomicriskwithoutDPM + eonomicriskwithDPM + eonomicriskwithConstraint)

    var economiccostWithoutDPM = ((eonomicriskwithoutDPM / total) * 100).toFixed(2)
    var economiccostWithDPM = ((eonomicriskwithDPM / total) * 100).toFixed(2)
    var economiccostwithConstraint = ((eonomicriskwithConstraint / total) * 100).toFixed(2)

    // var residualcostWithoutDPM: number = + (this.ResidualRiskWithOutDPM)
    // var residualCostDPMWithoutConstraint: number = + (this.ResidualRiskWithDPM)
    // var residualCostWithDPMConstraint: number = + (this.ResidualRiskWithConstraintDPMCR)
    // var residualtotal = (residualcostWithoutDPM + residualCostDPMWithoutConstraint + residualCostWithDPMConstraint)

    // var resdualtWithoutDPM = ((residualcostWithoutDPM / residualtotal) * 100).toFixed(2)
    // var residualcostwithDPM = ((residualCostDPMWithoutConstraint / residualtotal) * 100).toFixed(2)
    // var residualwithConstraint = ((residualCostWithDPMConstraint / residualtotal) * 100).toFixed(2)

    var meicostWithoutDPM: number = +  (this.MEIWithoutDPM)
    var meiCostDPMWithoutConstraint: number = + (this.MEIWithDPMWithoutConstraint)
    var meiCostWithDPMConstraint: number 
    if(this.EconomicRiskWithConstraintDPM >0){
       meiCostWithDPMConstraint = this.MEIWithDPMWithConstraint
    }else{
      meiCostWithDPMConstraint=0
    }
   
   
    var meitotal: number = + (meicostWithoutDPM + meiCostDPMWithoutConstraint + meiCostWithDPMConstraint)

    var meicostwithoutDPM = ((meicostWithoutDPM / meitotal) * 100).toFixed(2)
    var meicostwithDPM = ((meiCostDPMWithoutConstraint / meitotal) * 100).toFixed(2)
    var meicostwithConstraint = ((meiCostWithDPMConstraint / meitotal) * 100).toFixed(2)

    this.changeDetectorRef.detectChanges();

    this.chart = new Chart("allGraphCBI", {
      type: "horizontalBar",
      // data: {
      //   labels: ["Economic Risk", "Residual Risk","MEI"],
      //   datasets: [
      //     {
      //       label: "Without DPM",
      //       backgroundColor: "#d72631",
      //       borderColor: "#d72631",
      //       borderWidth: 1,
      //       data: [economiccostWithoutDPM, resdualtWithoutDPM ,meicostwithoutDPM,]
      //     },
      //     {
      //       label: "With DPM",
      //       backgroundColor: "#039fbe",
      //       borderColor: "#039fbe",
      //       borderWidth: 1,
      //       data: [economiccostWithDPM, residualcostwithDPM,meicostwithDPM,]
      //     },
      //     {
      //       label: "With Constraint",
      //       backgroundColor: "#5c3c92",
      //       borderColor: "#5c3c92",
      //       borderWidth: 1,
      //       data: [economiccostwithConstraint, residualwithConstraint, meicostwithConstraint]
      //     },
      //   ]
      // },
      data: {
        labels: ["Economic Risk","MEI"],
        datasets: [
          {
            label: "Without DPM",
            backgroundColor: "#d72631",
            borderColor: "#d72631",
            borderWidth: 1,
            data: [economiccostWithoutDPM ,meicostwithoutDPM,]
          },
          {
            label: "With DPM",
            backgroundColor: "#039fbe",
            borderColor: "#039fbe",
            borderWidth: 1,
            data: [economiccostWithDPM, meicostwithDPM,]
          },
          {
            label: "With Constraint",
            backgroundColor: "#5c3c92",
            borderColor: "#5c3c92",
            borderWidth: 1,
            data: [economiccostwithConstraint,  meicostwithConstraint]
          },
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                 barThickness: 30,  
              maxBarThickness: 30 ,
                // labelString: 'In_Percentage'
              },
              ticks: {
                beginAtZero: true
              }
            }
          ],
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'In_Percentage',
                 barThickness: 30,  
              maxBarThickness: 30 ,
              },
              ticks: {
                beginAtZero: true
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
  public unique:any
  PredictionWithTagNumber1() {
    this.changeDetectorRef.detectChanges();
    this.FPFinalNormal=[];
    this.FPFinalIncipient=[];
    this.FPFinaldDegrade=[];
    this.changeDetectorRef.detectChanges();
    this.ScrewPredictionAllData.sort()
    const ids = this.ScrewPredictionAllData.map(o => o.TagNumber)
    this.PTagNumberList = this.ScrewPredictionAllData.filter(({ TagNumber }, index) => !ids.includes(TagNumber, index + 1))
    this.PTagNumberList = this.PTagNumberList.filter(r => r.TagNumber !== null)
  
    // this.PTagNumberList.forEach(element=>{
    //   this.tagnumbers.push(element.TagNumber) 
    // })
    // var LabelDatess: any = [];
    // var combo: any = [];
    // this.Pyearlist.forEach(element => {
    //   LabelDatess = LabelDatess.filter(function (element) {
    //     return element !== undefined;
    //   });
    //   LabelDatess.push(element.Predictyearname)
    //   LabelDatess.sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
    //   this.Pyearlist.sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
    // });
    // this.Pyearlist.forEach(element => {
    //   this.Predictyearlist.forEach(value => {
    //     combo= `${element.Predictyearname}-${value.PredictyTagnumber}`
    //   });
    //   this.combinationList.push(combo)
    //   this.combinationList.sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
    // })
    var s:any=[]
  var t:any=[]
  var y:any=[]
  let datetagnumberlist=[]
    this.ScrewPredictionAllData.forEach(value => {
      s = moment(value.InsertedDate).format('YYYY')
      t= value.TagNumber
      y = s+ '-' + t
     datetagnumberlist.push(y)
     this.unique = [...new Set(datetagnumberlist)]; 
     this.unique.sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
    })
    for (var i = 0; i < this.unique.length; ++i) {
      var FPnormal = 0
      var FPincipient = 0
      var FPdegrade = 0
      var FPbad = 0
      var counter = 0
      this.ScrewPredictionAllData.forEach(value => {
        var a = `${moment(value.InsertedDate).format('YYYY')}-${value.TagNumber}`
        if (a == this.unique[i]) {
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

      fperc_Incipient =  ((FPincipient / counter) * 100).toFixed()
      fperc_Normal =  ((FPnormal / counter) * 100).toFixed()
      fperc_Degrade =  ((FPdegrade / counter) * 100).toFixed()
      fperc_Bad =  ((FPbad / counter) * 100).toFixed()

      this.FPFinalNormal.push(fperc_Normal)
      this.FPFinalIncipient.push(fperc_Incipient)
      this.FPFinaldDegrade.push(fperc_Degrade)
      this.FPFinalBad.push(fperc_Bad)
    }
    this.changeDetectorRef.detectChanges();
    this.chart = new Chart("PredictionbarWithYear", {
      type: "bar",
      data: {
        labels: this.unique,
        fill: true,
        datasets: [
          {
            label: "Normal",
            data: this.FPFinalNormal,
            borderWidth: 1,
            borderColor: "#20c997",
            backgroundColor: '#20c997',
            fill: true,

          },
          {
            label: "Incipient",
            data: this.FPFinalIncipient,
            borderWidth: 1,
            borderColor: "#fa8b0c",
            backgroundColor: '#fa8b0c',
            fill: true,

          },
          {
            label: "Degrade",
            data: this.FPFinaldDegrade,
            borderWidth: 1,
            borderColor: "#ff3a7a",
            backgroundColor: '#ff3a7a',
            fill: true,

          },

        ],
      },
      options: {
        events: [],
        scales: {
          xAxes: [{
              stacked: true,
              barThickness: 30,  
              maxBarThickness: 30 ,
            gridLines: {
              display: false
            },
          }],
          yAxes: [
            {
               stacked: true,
              scaleLabel: {
                display: true,
                labelString: 'In_Percentage'
              },
              ticks: {
                beginAtZero: true,
                gridLines: {
                  display: false
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

  PredictionWithTagNumber2() {
    this.changeDetectorRef.detectChanges();
    this.FPFinalNormal=[];
    this.FPFinalIncipient=[];
    this.FPFinaldDegrade=[];
    this.changeDetectorRef.detectChanges();
   
    var s:any=[]
  var t:any=[]
  var y:any=[]
  let datetagnumberlist=[]
    this.result.forEach(value => {
      s = moment(value.InsertedDate).format('YYYY')
      t= value.TagNumber
      y = s+ '-' + t
     datetagnumberlist.push(y)
     this.unique = [...new Set(datetagnumberlist)]; 
     this.unique.sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
    })
    for (var i = 0; i < this.unique.length; ++i) {
      var FPnormal = 0
      var FPincipient = 0
      var FPdegrade = 0
      var FPbad = 0
      var counter = 0
      this.result.forEach(value => {
        var a = `${moment(value.InsertedDate).format('YYYY')}-${value.TagNumber}`
        if (a == this.unique[i]) {
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

      fperc_Incipient =  ((FPincipient / counter) * 100).toFixed()
      fperc_Normal =  ((FPnormal / counter) * 100).toFixed()
      fperc_Degrade =  ((FPdegrade / counter) * 100).toFixed()
      fperc_Bad =  ((FPbad / counter) * 100).toFixed()

      this.FPFinalNormal.push(fperc_Normal)
      this.FPFinalIncipient.push(fperc_Incipient)
      this.FPFinaldDegrade.push(fperc_Degrade)
      this.FPFinalBad.push(fperc_Bad)
    }
    this.changeDetectorRef.detectChanges();
    this.chart = new Chart("PredictionbarWithYear", {
      type: "bar",
      data: {
        labels: this.unique,
        fill: true,
        datasets: [
          {
            label: "Normal",
            data: this.FPFinalNormal,
            borderWidth: 1,
            borderColor: "#20c997",
            backgroundColor: '#20c997',
            fill: true,

          },
          {
            label: "Incipient",
            data: this.FPFinalIncipient,
            borderWidth: 1,
            borderColor: "#fa8b0c",
            backgroundColor: '#fa8b0c',
            fill: true,

          },
          {
            label: "Degrade",
            data: this.FPFinaldDegrade,
            borderWidth: 1,
            borderColor: "#ff3a7a",
            backgroundColor: '#ff3a7a',
            fill: true,

          },

        ],
      },
      options: {
        events: [],
        scales: {
          xAxes: [{
              stacked: true,
              barThickness: 120,  
              maxBarThickness: 118 ,
            gridLines: {
              display: false
            },
          }],
          yAxes: [
            {
               stacked: true,
              scaleLabel: {
                display: true,
                labelString: 'In_Percentage'
              },
              ticks: {
                beginAtZero: true,
                gridLines: {
                  display: false
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

  PredictionWithActionPieChart() {
    this.changeDetectorRef.detectChanges();
    this.chart = new Chart("PredictionActionPiechart", {
      type: 'doughnut',
      data: {
        labels: ["Complete", "Ongoing", "Overdue"],
        fill: true,
        datasets: [
          {
            backgroundColor: ["#20c997", "#fa8b0c", "#ff3a7a"],
            data: [this.CompleteStatus, this.Ongoingstatus, this.Overduestatus]
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
                  mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius) / 2,
                  start_angle = model.startAngle,
                  end_angle = model.endAngle,
                  mid_angle = start_angle + (end_angle - start_angle) / 2;

                var x = mid_radius * Math.cos(mid_angle);
                var y = mid_radius * Math.sin(mid_angle);

                ctx.fillStyle = '#fff';
                if (i == 3) {
                  ctx.fillStyle = '#444';
                }
                // if (i > 0) {
                  var percent = String(Math.round(dataset.data[i] / total * 100)) + "%";
                  ctx.fillText(percent, model.x + x, model.y + y + 15);
                // }

              }
            });
          }
        }
      }
    });
  }

  IndicationGraphSSRB() {
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
    var counter = 0
    for (var i = 0; i < this.Pyearlist.length; ++i) {
    this.ScrewPredictionAllData.forEach(element => {
      var b = moment(element.InsertedDate).format('YYYY')
               if (b == this.Pyearlist[i].Predictyearname) {
      if (element.SSRB == 'normal') {
        this.PredictionNormalcount = this.PredictionNormalcount + 1;
      } else if (element.SSRB == 'incipient') {
        this.PredictionIncipientcount = this.PredictionIncipientcount + 1;
      } else if (element.SSRB == 'degrade' || element == 'degarde') {
        this.PredictionDegradecount = this.PredictionDegradecount + 1;
      }else{
        this.Predictionbadcount = this.Predictionbadcount + 1;
      }
      counter = counter + 1
   }
    });
    Degradepercentage = ((this.PredictionDegradecount /counter) * 100).toFixed();
    Incipientpercentage = ((this.PredictionIncipientcount /counter) * 100).toFixed();
    Normalpercentage = ((this.PredictionNormalcount /counter) * 100).toFixed();

    this.predictionDegradeMessage = Degradepercentage
    this.predictionIncipientMessage = Incipientpercentage
    this.predictionNormalMessage = Normalpercentage
  }
    this.changeDetectorRef.detectChanges();
    this.chart = new Chart("indication_barSSRB", {
      type: "horizontalBar",
      data: {
        labels: [],
        datasets: [{
          data: [Normalpercentage],
          backgroundColor: "#20c997",
          hoverBackgroundColor: "#20c997"
        }, {
          data: [Incipientpercentage],
          backgroundColor: "#fa8b0c",
          hoverBackgroundColor: "#fa8b0c"
        }, {
          data: [Degradepercentage],
          backgroundColor: "#ff3a7a",
          hoverBackgroundColor: "#ff3a7a"
        }]
      },
      options: {
         events: [],
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        },
        scales: {
          xAxes: [{
            display: false,
            stacked: true
          }],
          yAxes: [{
            display: false,
            stacked: true
          }],
        },
        animation: {
          duration: 1,
            onComplete: function() {
              let chartInstance = this.chart,
                  ctx = chartInstance.ctx;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'bottom';

              Chart.helpers.each(this.data.datasets.forEach(function(dataset, i) {
                var meta = chartInstance.controller.getDatasetMeta(i);
                Chart.helpers.each(meta.data.forEach(function(bar, index) {
                  var data = String((dataset.data[index])) + "%";
                  ctx.fillStyle = 'white';
                   var barWidth = bar._model.x - bar._model.base;
                   var centerX = bar._model.base + barWidth / 2;
                   if (i == 0) {
                      ctx.fillText(data, centerX, bar._model.y + 4);
                   } else {
                      ctx.fillText(data, centerX, bar._model.y + 4);
                   }
                }), this);
             }), this);
            }
        }
      },

    });
  }

  IndicationGraphRD() {
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

    this.ScrewPredictionAllData.forEach(element => {
      if (element.RD == 'normal') {
        this.PredictionNormalcount = this.PredictionNormalcount + 1;
      } else if (element.RD == 'incipient') {
        this.PredictionIncipientcount = this.PredictionIncipientcount + 1;
      } else if (element.RD == 'degrade' || element == 'degarde') {
        this.PredictionDegradecount = this.PredictionDegradecount + 1;
      }
    
    });
    Degradepercentage = ((this.PredictionDegradecount / a.length) * 100).toFixed();
    Incipientpercentage = ((this.PredictionIncipientcount / a.length) * 100).toFixed();
    Normalpercentage = ((this.PredictionNormalcount / a.length) * 100).toFixed();

    this.predictionDegradeMessage = Degradepercentage
    this.predictionIncipientMessage = Incipientpercentage
    this.predictionNormalMessage = Normalpercentage
    this.changeDetectorRef.detectChanges();
    this.chart = new Chart("indication_barRD", {
      type: "horizontalBar",
      data: {
        labels: [],
        datasets: [{
          data: [Normalpercentage],
          backgroundColor: "#20c997",
          hoverBackgroundColor: "#20c997"
        }, {
          data: [Incipientpercentage],
          backgroundColor: "#fa8b0c",
          hoverBackgroundColor: "#fa8b0c"
        }, {
          data: [Degradepercentage],
          backgroundColor: "#ff3a7a",
          hoverBackgroundColor: "#ff3a7a"
          
        }]
      },
      options: {
        events: [],
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        },
        scales: {
          xAxes: [{
            display: false,
            stacked: true
          }],
          yAxes: [{
            display: false,
            stacked: true
          }],
        },
        animation: {
          duration: 1,
            onComplete: function() {
              let chartInstance = this.chart,
                  ctx = chartInstance.ctx;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'bottom';

              // this.data.datasets.forEach(function(dataset, i){
              //   let meta = chartInstance.controller.getDatasetMeta(i);
              //   meta.data.forEach(function(bar, index) {
              //     var data = String((dataset.data[index])) + "%";
              //     ctx.fillStyle = 'white';
              //     if (i == 0) {
              //       ctx.fillText(data, 50, bar._model.y + 4);
              //     } else {
              //       ctx.fillText(data, bar._model.x-25, bar._model.y+4);
              //     }
              //   });
              // });
              Chart.helpers.each(this.data.datasets.forEach(function(dataset, i) {
                var meta = chartInstance.controller.getDatasetMeta(i);
                Chart.helpers.each(meta.data.forEach(function(bar, index) {
                  var data = String((dataset.data[index])) + "%";
                  ctx.fillStyle = 'white';
                   var barWidth = bar._model.x - bar._model.base;
                   var centerX = bar._model.base + barWidth / 2;
                   if (i == 0) {
                      ctx.fillText(data, centerX, bar._model.y + 4);
                   } else {
                      ctx.fillText(data, centerX, bar._model.y + 4);
                   }
                }), this);
             }), this);
            }
        }
      },

    });
  }

  IndicationGraphCF() {
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

    this.ScrewPredictionAllData.forEach(element => {
      if (element.CF == 'normal') {
        this.PredictionNormalcount = this.PredictionNormalcount + 1;
      } else if (element.CF == 'incipient') {
        this.PredictionIncipientcount = this.PredictionIncipientcount + 1;
      } else if (element.CF == 'degrade' || element == 'degarde') {
        this.PredictionDegradecount = this.PredictionDegradecount + 1;
      }
    
    });
    Degradepercentage = ((this.PredictionDegradecount / a.length) * 100).toFixed();
    Incipientpercentage = ((this.PredictionIncipientcount / a.length) * 100).toFixed();
    Normalpercentage = ((this.PredictionNormalcount / a.length) * 100).toFixed();

    this.predictionDegradeMessage = Degradepercentage
    this.predictionIncipientMessage = Incipientpercentage
    this.predictionNormalMessage = Normalpercentage
    this.changeDetectorRef.detectChanges();
    this.chart = new Chart("indication_barCF", {
      type: "horizontalBar",
      data: {
        labels: [],
        datasets: [{
          data: [Normalpercentage],
          backgroundColor: "#20c997",
          hoverBackgroundColor: "#20c997"
        }, {
          data: [Incipientpercentage],
          backgroundColor: "#fa8b0c",
          hoverBackgroundColor: "#fa8b0c"
        }, {
          data: [Degradepercentage],
          backgroundColor: "#ff3a7a",
          hoverBackgroundColor: "#ff3a7a"
        }]
      },
      options: {
        events: [],
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        },
        scales: {
          xAxes: [{
            display: false,
            stacked: true
          }],
          yAxes: [{
            display: false,
            stacked: true
          }],
        },
        animation: {
          duration: 1,
            onComplete: function() {
              let chartInstance = this.chart,
                  ctx = chartInstance.ctx;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'bottom';

              Chart.helpers.each(this.data.datasets.forEach(function(dataset, i) {
                var meta = chartInstance.controller.getDatasetMeta(i);
                Chart.helpers.each(meta.data.forEach(function(bar, index) {
                  var data = String((dataset.data[index])) + "%";
                  ctx.fillStyle = 'white';
                   var barWidth = bar._model.x - bar._model.base;
                   var centerX = bar._model.base + barWidth / 2;
                   if (i == 0) {
                      ctx.fillText(data, centerX, bar._model.y + 4);
                   } else {
                      ctx.fillText(data, centerX, bar._model.y + 4);
                   }
                }), this);
             }), this);
            }
        }
      },

    });
  }

  RiskProfile(){
    this.changeDetectorRef.detectChanges();
      var residualcostWithoutDPM: number = + (this.ResidualRiskWithDPM)
      var residualCostDPMWithoutConstraint: number = + (this.ResidualRiskWithOutDPM)
      var residualCostWithDPMConstraint: number
      if(this.EconomicRiskWithConstraintDPM >0){
         residualCostWithDPMConstraint =  this.ResidualRiskWithConstraintDPMCR
      }else{
        residualCostWithDPMConstraint =0
      }
     
      var residualtotal = (residualcostWithoutDPM + residualCostDPMWithoutConstraint + residualCostWithDPMConstraint)
  
      var resdualtWithoutDPM = ((residualcostWithoutDPM / residualtotal) * 100).toFixed(2)
      var residualcostwithDPM = ((residualCostDPMWithoutConstraint / residualtotal) * 100).toFixed(2)
      var residualwithConstraint = ((residualCostWithDPMConstraint / residualtotal) * 100).toFixed(2)
       
      if(this.ResidualRiskWithConstraintDPMCR== 1||this.ResidualRiskWithConstraintDPMCR== 2||this.ResidualRiskWithConstraintDPMCR== 3
        ||this.ResidualRiskWithConstraintDPMCR== 4||this.ResidualRiskWithConstraintDPMCR== 5 ||this.ResidualRiskWithConstraintDPMCR== 6){
       var mittigated= 740
      }
      var yLabels = {
          100 : 'Low',
          300 : 'Normal',
          500 : 'Medium ',
          700 : 'Medium-High',
          900 : 'High',
      }
      this.chart = new Chart("profile_risk", {
      type: "bar",
      data: {
        labels: ["Risk"],
        datasets: [
          {
            label: "With DPM",
            backgroundColor: "#ffb801",
            borderColor: "#ffb801",
            data:[resdualtWithoutDPM]
          },
          {
            label: "Without DPM",
            backgroundColor: "#fe4c61",
            borderColor: "#fe4c61",
            data: [residualcostwithDPM]
          },
          {
            label: "With Constraint",
            backgroundColor: "#039fbe",
            borderColor: "#039fbe",
            data: [residualwithConstraint]
          },
          {
            label: "Miigated",
            type: 'bubble',
            backgroundColor: "white",
            borderColor: "white",
            borderWidth: 6,
             data: [mittigated],
          },
        ]
      },
      options: {
        responsive: true,
        title: {
            display: true,
            text: 'Risk Analysis'
        },

        backgroundRules: [
          {
            yAxisID: 'B',
            backgroundColor: "#d0f0c0",
            yAxisSegement: 100
          },
          {
            yAxisID: 'B',
            backgroundColor: "#d9ffb3",
            yAxisSegement: 300
          },
          {
            yAxisID: 'B',
            backgroundColor: "#ffffb3",
            yAxisSegement: 500,
            
          }, {
            yAxisID: 'B',
            backgroundColor: "#ffc2b3",
            yAxisSegement: 700
          },
          {
            yAxisID: 'B',
            backgroundColor: "#D10000",
            yAxisSegement: 800
          }

      ],
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                min: 1, 
                max: 750, 
                labelString: 'Risk Rank'
              },
              ticks: {
                beginAtZero: 0,
                gridLines: {
                  display: false
                },
              }
            },
            {
              id: 'B',
               type: 'linear',
              position: 'right',
              ticks: {
                gridLines: {
                  display: false
                },
                beginAtZero: true,
                 max:1000,
                callback: function(value,) {
                    return yLabels[value];
                }
            }
            },
          ],
          xAxes: [{
            barPercentage: 0.4,
            gridLines: {
              display: false
            },
        }]
        },
      },
      plugins: [{
        beforeDraw: function (chart) {
            var ctx = chart.chart.ctx;
            var ruleIndex = 0;
            var rules = chart.chart.options.backgroundRules;
            var yaxis = chart.chart.scales["y-axis-0"];
            var xaxis = chart.chart.scales["x-axis-0"];
            var partPercentage = 1 / (yaxis.ticksAsNumbers.length - 1);
            for (var i = yaxis.ticksAsNumbers.length - 1; i > 0; i--) {
                if (yaxis.ticksAsNumbers[i] < rules[ruleIndex].yAxisSegement) {
                    ctx.fillStyle = rules[ruleIndex].backgroundColor;
                    ctx.fillRect(xaxis.left, yaxis.top + ((i - 1) * (yaxis.height * partPercentage)), xaxis.width, yaxis.height * partPercentage);
                } else {
                    ruleIndex++;
                    i++;
                }
            }
        },
    }]
    });
  }

  FakeRiskMetigateactions(){
    this.changeDetectorRef.detectChanges();  
  this.allCBAdata.forEach((r,index) =>{
    if(r.EconomicRiskWithDPMCR ==="N"){
       r.rankgraphId=`risk${index+1}`
      const patternData2 = [1,0.5,0.5,0.5];
      this.getChartTree( patternData2, r.rankgraphId, 'N');
    }else if(r.EconomicRiskWithDPMCR ==="H"){
      r.rankgraphId=`risk${index+1}`
      const patternData4 = [0.5,0.5,1,0.5];
      this.getChartTree( patternData4, r.rankgraphId, 'H');
    }
    else if(r.EconomicRiskWithDPMCR ==="M"){
      r.rankgraphId=`risk${index+1}`
      const patternData3 = [0.5,1,0.5,0.5];
      this.getChartTree( patternData3, r.rankgraphId, 'M');
    } else  if(r.EconomicRiskWithDPMCR ==="L"){
      r.rankgraphId=`risk${index+1}`
      const patternData1 = [1,0.5,0.5,0.5];
      this.getChartTree(patternData1, r.rankgraphId, 'L');
    } else  if(r.EconomicRiskWithDPMCR ==="MH"){
      r.rankgraphId=`risk${index+1}`
      const patternData5 = [0.5,0.5,0.5,1];
      this.getChartTree( patternData5, r.rankgraphId, 'MH');
    }
  })
  }

  private getChartTree( data: any[], id: string, title: string) {
    this.changeDetectorRef.detectChanges();
    this.chart = new Chart(id, {
      type: 'horizontalBar',
      data: {
        labels: [],
        datasets: [{
          data: data,
          backgroundColor: "#47d147",
          hoverBackgroundColor: " #47d147"
        }, {
          data: data,
          backgroundColor: "#ffff99",
          hoverBackgroundColor: "#ffff99"
        },
        {
          data: data,
          backgroundColor: "#ffff00",
          hoverBackgroundColor: "#ffff00"
        },
         {
          data: data,
          backgroundColor: "red",
          hoverBackgroundColor: "red"
        }]
      },
      options: {
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        },
        scales: {
          xAxes: [{
            display: false,
            stacked: true
          }],
          yAxes: [{
            display: false,
            stacked: true
          }],
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
                if (data == 1) {
                  ctx.fillText(data, 50, bar._model.y+4);
                }
              });
            });
          }
        },
      },

    });
    this.changeDetectorRef.detectChanges();
  }

public CBATagnumber:any=[]
public CBAId:number = 0
public CBATaskId:number = 0
   GetALLCBA(){
    const params = new HttpParams()
    .set('UserId',this.userModel.UserId)
    this.http.get('api/PSRClientContractorAPI/GetSavedCBA', {params})
   .subscribe((res: any) => {
     this.allCBAdata = res;
    //  this.FakeRiskMetigateactions()
      this.CBAdataForRisk = this.allCBAdata
     for (var i = 0; i < this.allCBAdata.length; i++) {
       this.CBAId = this.allCBAdata[i].CBAId
      this.centrifugalmssmodel=  this.allCBAdata[i].CBATaskModel
      this.CBATagnumber= this.allCBAdata[i].TagNumber
      this.CBI_etbf = this.allCBAdata[i].ETBF;
      this.OverallETBC = this.allCBAdata[i].OverallETBC;
      this.TotalAnnualPOC = this.allCBAdata[i].TotalAnnualPOC;
      this.TotalPONC = this.allCBAdata[i].TotalPONC;
      this.VendorETBC = this.allCBAdata[i].VendorETBC;
      this.VendorPOC = this.allCBAdata[i].VendorPOC;
      this.EconomicRiskWithDPMCR = this.allCBAdata[i].EconomicRiskWithDPMCR;
      this.EconomicRiskWithOutDPMCR = this.allCBAdata[i].EconomicRiskWithOutDPMCR;
      this.EconomicRiskWithDPMConstraintCR = this.allCBAdata[i].EconomicRiskWithDPMConstraintCR;
      this.EconomicRiskWithDPM = this.allCBAdata[i].EconomicRiskWithDPM
      this.EconomicRiskWithOutDPM = this.allCBAdata[i].EconomicRiskWithOutDPM
      this.EconomicRiskWithConstraintDPM = this.allCBAdata[i].EconomicRiskWithDPMConstraint
      this.MEIWithDPMWithoutConstraint =this.allCBAdata[i].MEIWithDPM
      this.MEIWithDPMWithConstraint =this.allCBAdata[i].MEIWithDPMConstraint
      this.MEIWithoutDPM = this.allCBAdata[i].MEIWithoutDPM
     }
   
     this.Ecoriskvalue()
     this.allCBAdata .forEach((element) => {
         var a:number = element.LevelCount
         this.LevelCount = a*100
         if(this.LevelCount <50){
          this.notifications = { class: 'text-danger', };
         }else if(this.LevelCount > 50 || this.LevelCount <80){
          this.notifications = { class: 'text-warning', };
         }else if(this.LevelCount >81){
          this.notifications = { class: 'text-success', };
         }
     })
  
    this.centrifugalmssmodel.forEach((element) => {
      this.CBATaskId= element.CBAId
      this.AnnualPOC = element.AnnualPOC
      this.MSSIntervalSelectionCriteria = element.MSSIntervalSelectionCriteria
      this.MSSMaintenanceInterval = element.MSSMaintenanceInterval
      this.Craft = element.Craft
      this.MSSMaintenanceTask = element.MSSMaintenanceTask
      this.Level = element.Level
      this.Hours = element.Hours
      if (element.CentrifugalPumpMssId === "MSS") {
        this.notification = { class: 'text-warning', };
      } else if (element.CentrifugalPumpMssId === "GDE") {
        this.GDECount = this.GDECount + 1
        this.notification = { class: 'text-warning', };
      }
        if (element.Progress === 1) {
          this.CompleteStatus = this.CompleteStatus + 1
        } else if (element.Progress === 2) {
          this.Ongoingstatus = this.Ongoingstatus + 1
        }
        else if (element.Progress === 3) {
          this.Overduestatus = this.Overduestatus + 1
        }
    }
    )

    this.centrifugalmssmodel.forEach(element => {
      if(element.CentrifugalPumpMssId=="MSS"){
        let obj ={}
        obj['AnnualPOC'] = element.AnnualPOC
        obj['Level']= element.Level;
        obj['MSSIntervalSelectionCriteria']=element.MSSIntervalSelectionCriteria
        obj['MSSMaintenanceTask']=element.MSSMaintenanceTask;
        obj['Hours']= element.Hours;
        obj['Craft']= element.Craft;
        obj['MSSMaintenanceInterval']=element.MSSMaintenanceInterval;
        this.MSSTaskList.push(obj)
      }
      if(element.CentrifugalPumpMssId=="CONSTRAINT"){
        let obj ={}
        obj['AnnualPOC'] = element.AnnualPOC
        obj['Level']= element.Level;
        obj['MSSIntervalSelectionCriteria']=element.MSSIntervalSelectionCriteria
        obj['MSSMaintenanceTask']=element.MSSMaintenanceTask;
        obj['Hours']= element.Hours;
        obj['Craft']= element.Craft;
        obj['MSSMaintenanceInterval']=element.MSSMaintenanceInterval;
        this.ConstraintTaskList.push(obj)
      }
    })
    var result = this.groupByKey(this.centrifugalmssmodel, 'MSSIntervalSelectionCriteria');
    var newarray =[];
     Object.keys(result).map(function (personNamedIndex) {
       let newobj ={MSSIntervalSelectionCriteria:personNamedIndex,centrifugalmssmodel:[]}
      newarray.push(newobj);

    });
     newarray.forEach(itm=>{
      this.centrifugalmssmodel.forEach(res=>{
       if(res.MSSIntervalSelectionCriteria == itm.MSSIntervalSelectionCriteria){
        itm.centrifugalmssmodel.push(res);
       }
     })
   }); 
     this.centrifugalmssmodelFilter = newarray;
     const ids = this.centrifugalmssmodel.map(o => o.MSSIntervalSelectionCriteria)
     this.mssmodelFilter= this.centrifugalmssmodel.filter(({MSSIntervalSelectionCriteria}, index) => !ids.includes(MSSIntervalSelectionCriteria, index + 1))
   });

  }
 public blinkriskclick:boolean = false;
 public blinkmittigationclick:boolean = false;
 public blinkprofilerisk: boolean =false;
  RadioValueselection(){
   if(this.CBATaskId == this.CBAId){
      this.radioshowmittigation= true;
      this.blinkriskclick= true
      this.blinkmittigationclick= true
      this.profile_riskshow= true;
      this.blinkprofilerisk=true;
      this.showcbi=true;
      this.RiskProfile()
      this. ALLGraphCBA()
      this.FakeRiskMetigateactions()
   }else{
    this.radioshowmittigation= false;
    this.profile_riskshow= false;
    this.blinkprofilerisk=false;
    this.showcbi=false;
   }
  }

  public async Ecoriskvalue(){
    var WD: number = await this.getValue(this.EconomicRiskWithDPMCR);
    var WOD: number = await this.getValue(this.EconomicRiskWithOutDPMCR);
    var WDC : number= await this.getValue(this.EconomicRiskWithDPMConstraintCR);
    this.allCBAdata.forEach(element=>{
      element.ResidualRiskWithDPM = WD;
      element.ResidualRiskWithOutDPM = WOD
      element.ResidualRiskWithConstraintDPMCR = WDC
    })
    for (var i = 0; i < this.allCBAdata.length; i++) {
      this.ResidualRiskWithDPM = this.allCBAdata[i].ResidualRiskWithDPM
      this.ResidualRiskWithOutDPM = this.allCBAdata[i].ResidualRiskWithOutDPM
      this.ResidualRiskWithConstraintDPMCR = this.allCBAdata[i].ResidualRiskWithConstraintDPMCR
    }
  }
  public async getValue(r: string) {
    if (r === "N") {
        return await 1;
    } else if (r === "L") {
        return await 2;
    } else if (r === "M") {
        return await 3;
    } else if (r === "MH") {
        return await 4;
    } else if (r === "H") {
        return await 5;
    } else if (r === "E") {
        return await 6;
    } else {
        return await 0;
    }
}

dygraphForJson() {
  this.http.get("/api/ScrewCompressureAPI/GetPredictionRecordsInCSVFormat").subscribe((res: any) => {
    this.predictions = res;
    this.http.get("/api/ScrewCompressorFuturePredictionAPI/GetForcastRecordsInCSVFormat").subscribe((res: any) => {
      this.forcasts = res
      this.predictions.forEach(element => {
        this.forcasts.forEach(val => {
          if (element.InsertedDate == val.Date) {
            element.InsertedDate
            element.TD1
            element.FTD1 = val.TD1
          }
          if (element.FTD1 == 0) {
            element.FTD1 = ''
          }
        })
      });

      const result = this.forcasts.filter(f =>
        !this.predictions.some(d => d.InsertedDate == f.Date)
      );
      result.forEach(element => {
        element.InsertedDate
        element.FTD1 = element.TD1
        element.TD1 = ''
        // this.predictions.push(element.FTD1);
      });
         this.mergedarray = this.predictions.concat(result);
        this.csvData = this.ConvertToCSV(this.mergedarray);
        this.chart = new Dygraph(
         document.getElementById("my-first-chart"),this.csvData,
         {
           colors: ['green', 'blue',],
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
         },
         )
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
fakePredictionWithTagNumber(){
  this.chart = new Chart("FakePredictionbarWithTage", {
    type: "bar",
    data: {
      labels: ["K100-2016", "K100-2017", "K100-2018","K100-2019","K100-2020","K100-2020","K101-2018","K101-2019","K101-2020","K102-2020",],
      fill: true,
      datasets: [
        {
          label: "Normal",
          data: [50,55,56,57,60,63,56,69,15,25],
          borderWidth: 1,
          borderColor: "#20c997",
          backgroundColor: '#20c997',
          fill: true,

        },
        {
          label: "Incipient",
          data: [15,20,23,28,31,34,39,4,77,25],
          borderWidth: 1,
          borderColor: "#fa8b0c",
          backgroundColor: '#fa8b0c',
          fill: true,

        },
        {
          label: "Degrade",
          data: [7,9,11,12,8,7,12,0,4,17],
          borderWidth: 1,
          borderColor: "#ff3a7a",
          backgroundColor: '#ff3a7a',
          fill: true,

        },

      ],
    },
    options: {
      tooltips: {
        mode: 'index',
      },
      scales: {
        xAxes: [{
          stacked: true,
          barPercentage: 0.2,
          scaleLabel: {
            display: true,
            labelString: 'Tag Numbers & Years'
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
        }],
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
    }
  });
}

riskclick(){
  this.activeIndex=1;
  this.riskhelp= true 
  this.gotit=true
  this.helpboxshow=true
  var elmnt = document.getElementById("pid");
  elmnt.scrollIntoView();
 
}
mittigatioclick(){
  this.activeIndex=2;
  this.riskhelp= true
  this.gotit=true
  this.helpboxshow=true
  this.mittigationhelp= true
   var elmnt = document.getElementById("riskhelpid");
   elmnt.scrollIntoView();
}
riskanalysclick(){
  this.activeIndex=3;
  this.riskhelp= true
  this.gotit=true
  this.mittigationhelp= true
  this.riskanalysishelp= true
  this.helpboxshow=true
  var elmnt = document.getElementById("mittigationhelp");
  elmnt.scrollIntoView();
}
Previous(){
  if(this.activeIndex==3){
    this.riskanalysishelp= false
    this.mittigationhelp= true
    this.riskhelp= true
    this.activeIndex=2;
  } else if(this.activeIndex==2){
    this.mittigationhelp= false
    this.riskhelp= true
    this.activeIndex=1;
  } else if(this.activeIndex==1){
    this.riskhelp= false
    this.activeIndex=0;
  }
}
helpbox(){
  this.helpboxshow= false
}
criticalityAssesment() {
  this.changeDetectorRef.detectChanges();
  new Chart('criticalityAssesmentgraph', {
    type: 'doughnut',
    plugins: [
      {
        afterDraw: (chart) => {
          var needleValue = chart.chart.config.data.datasets[0].needleValue;
          var dataTotal = chart.chart.config.data.datasets[0].data.reduce(
            (a, b) => a + b
          );
          var angle = Math.PI + (1 / dataTotal) * needleValue * Math.PI;
          var ctx = chart.chart.ctx;
          var cw = chart.chart.canvas.offsetWidth;
          var ch = chart.chart.canvas.offsetHeight;
          var cx = cw / 2;
          var cy = ch - 6;
          ctx.translate(cx, cy);
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.moveTo(0, -3);
          ctx.lineTo(ch - 20, 0);
          ctx.lineTo(0, 3);
          ctx.fillStyle = 'rgb(0, 0, 0)';
          ctx.fill();
          ctx.rotate(-angle);
          ctx.translate(-cx, -cy);
          ctx.beginPath();
          ctx.arc(cx, cy, 5, 0, Math.PI * 2);
          ctx.fill();
        },
      },
    ],
    data: {
      labels: [],
      datasets: [
        {
          data: [ 1, this.semiCriticalasset, this.Criticalasset],
          needleValue: 27,
          backgroundColor: ['green', 'yellow', 'red'],
        },
      ],
    },
    options: {
      events: [],
      layout: {
        padding: {
          bottom: 3,
        },
      },
      rotation: -Math.PI,
      cutoutPercentage: 30,
      circumference: Math.PI,
      legend: {
        position: 'left',
      },
    },
  });
}
public criticalityasset:any=[]
public PrescagNumberList:any=[]
public prescriptivetagnumberlistdata:any=[]
public prescriptivefilterlistdata:any=[]
public selectprescriptiveno:string=""
public semiCriticalasset:number=0
public Criticalasset:number=0
public normalasset:number=0
getprescriptive(){
this.http.get("/api/PrescriptiveAPI/").subscribe((res: any) => {
this.criticalityasset = res
this.criticalityasset.forEach(val=>{
  if(val.Type=="CA"){
     this.Criticalasset = 3
  }else if(val.Type=="SCA"){
    this.semiCriticalasset = 2
  }else  if(val.Type=="NA"){
    this.normalasset = 1
  }
  this.criticalityAssesment()
  let prescriptivetagnumbers = { PrescriptiveTagId: 0, prescriptiveTagnumber: '' };
  prescriptivetagnumbers.prescriptiveTagnumber = val.TagNumber
            this.PrescagNumberList.push(prescriptivetagnumbers)
})
this.prescriptivetagnumberlistdata = this.PrescagNumberList.reduce((m, o) => {
  var found = m.find(s => s.prescriptiveTagnumber === o.prescriptiveTagnumber);
  if (found) {
  } else {
    m.push(o);
  }
  return m;
}, []);
})
}
prescriptivetagselect(){
  this.prescriptivefilterlistdata = this.criticalityasset.filter(val => (val.TagNumber) === this.selectprescriptiveno.toString()); 
  this.semiCriticalasset = 0
  this.Criticalasset = 0
  this.normalasset = 0
  this.prescriptivefilterlistdata.forEach(val=>{
    if(val.Type=="CA"){
       this.Criticalasset = 3
    }else  if(val.Type=="SCA"){
      this.semiCriticalasset  = 2
    }else  if(val.Type=="NA"){
      this.normalasset = 1
    }
  })
  this.criticalityAssesment()
}

}

