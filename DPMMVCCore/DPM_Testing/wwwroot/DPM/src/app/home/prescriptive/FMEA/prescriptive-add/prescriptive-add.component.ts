import { HttpClient, HttpHeaders, HttpParams, JsonpClientBackend } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
import { Title } from '@angular/platform-browser';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';
import { Router } from '@angular/router';
import { CentrifugalPumpPrescriptiveModel } from './prescriptive-model'
import { CanComponentDeactivate } from 'src/app/auth.guard';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import * as Chart from 'chart.js';
import { OverlayPanel } from "primeng/overlaypanel";
import { PrescriptiveContantAPI } from '../../Shared/prescriptive.constant';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';

@Component({
  selector: 'app-prescriptive-add',
  templateUrl: './prescriptive-add.component.html',
  styleUrls: ['./prescriptive-add.component.scss', '../../../../../assets/orgchart.scss'],
  providers: [MessageService],
})
export class PrescriptiveAddComponent implements OnInit, CanComponentDeactivate {

  public MachineType: string = "";
  private FMCount: number = 0;
  private FMCount1: number = 0;
  private FMLSConsequenceName: string = "";
  private activeIndex: number;
  public InsertLSEffect: any;
  public failureModeDataBind: any;
  public val: any;
  public failureModeData: any = []
  public data1: TreeNode[];
  public data1Clone: any;
  public data2: TreeNode[];
  public ConsequenceNode: TreeNode[];
  public selectedNode: TreeNode;
  public items: MenuItem[];
  public functionFailuerInput: any = [];
  public failuerModeInput: any = [];
  public failuerModeLocalEffects: string = "";
  public failuerModeSystemEffects: string = "";
  public prescriptiveTreeSubmitEnable: boolean = false;
  public prescriptiveSelect: boolean = true;
  public prescriptiveFuntion: boolean = false;
  public prescriptiveFunctionFailure: boolean = false;
  public prescriptiveFailureMode: boolean = false;
  public prescriptiveSteps: boolean = false;
  public prescriptiveTree: boolean = false;
  public prescriptiveEffect: boolean = false;
  public effectFooter: boolean = true;
  public EquipmentType: string = "";
  public EquipmentList: any = []
  public TagNumber: string = "";
  public dropDownData: any = [];
  public treeResponseData: any = [];

  public FunctionFluidType: string = "";
  public FunctionRatedHead: string = "";
  public FunctionPeriodType: string = "";

  private functionFailureData: any = [];
  private functionModeData: any = [];
  private consequenceTreeColorNodeA = 'p-person1'
  private consequenceTreeColorNodeB = 'p-person'
  private consequenceTreeColorNodeC = 'p-person'
  private consequenceTreeColorNodeD = 'p-person'
  private consequenceA;
  private consequenceB;
  private consequenceC;
  private consequenceD;
  private consequenceE;
  private finalConsequence;
  public functionfailure: any = [];
  public failuerMode: any = [];

  public dropedFailure = [];
  public dropedMode = [];

  public dragedColor = null;
  public dragedFunctionMode = null;
  public dragedFunctionfailure = null;
  public treeData: any = [];
  public prescriptiveTreeUpdateEnable: boolean = false;
  public prescriptiveTreeNextEnable: boolean = false;
  public prescriptiveTreeBackEnable: boolean = false;
  public prescriptiveEffect1: boolean = false;

  public draggedConsequencesYesNO: any = ['YES', 'NO']
  public droppedYesNo = null;
  public dropedConsequenceFailureMode = []

  public droppedYesNo1 = null;
  public dropedConsequenceEffectFailureMode = []

  public droppedYesNo2 = null;
  public dropedConsequenceCombinationFailureMode = []
  public droppedYesNo3 = null;
  public dropedConsequenceAffectFailureMode = []
  public ADDFailureLSEDiasble: boolean = false;
  public NextFailureLSEDiasble: boolean = false;
  public Consequences1: boolean = false;
  public Consequences2: boolean = false;
  public Consequences3: boolean = false;
  public Consequences4: boolean = false;
  public ConsequencesTree: boolean = false;
  public SaveConcequencesEnable: boolean = false;
  public ConsequencesAnswer: any = [];
  public FMChild = []
  public FMLSEffectModeName: string = ""

  public DownTimeFactor: number = 0;
  public ScrapeFactor: number = 0;
  public SafetyFactor: number = 0;
  public ProtectionFactor: number = 0;
  public FrequencyFactor: number = 0;
  private FactoryToAddInFM: any = []
  public fullPath: string = ""
  public fileUpload: string = "";
  public dbPath: string = "";
  public Remark: string = "";
  public FileId: string = "";
  public fileAttachmentEnable: boolean = false;
  public centrifugalPumpPrescriptiveOBJ: CentrifugalPumpPrescriptiveModel = new CentrifugalPumpPrescriptiveModel();
  public selectedModeData: any;
  public FCAdata1: TreeNode[];
  public FMPattern = ['Pattern 1', 'Pattern 2', 'Pattern 3', 'Pattern 4', 'Pattern 5', 'Pattern 6'];
  public Pattern: string = ""
  public PatternPathEnable: boolean = false;
  public PatternNextOnPrescriptiveTree: boolean = false;
  public FailureModePatternTree: boolean = false;
  public PattenNode1: string;
  public PattenNode2: string;
  public PattenNode4: string;
  public PattenAnsNode4: string;
  public PattenNode7: string;
  public PattenAnsNode6P1: string;
  public PattenAnsNode5: string;
  public PattenNode5: string;
  public PattenAnsNode3P1: string;
  public PattenAnsNode2P1: string;
  public PattenNode3: string;
  public PattenAnsNode1: string;
  public PattenNode6: string;
  public PattenAnsNode2P2: string;
  public PattenNode8: string;
  public PattenAnsNode6P2: string;
  public PattenAnsNode3P2: string;
  public PatternEnable: boolean;
  public PatternPath: string = "";
  public PatternFMName: any;
  public PatternCounter: number = 0;
  public EditdbPath: string = "";
  public EditdbPathURL: SafeUrl;
  public ADDdbPathURL: SafeUrl;
  public extensionPDF: boolean = false;
  public extensionAddImage: boolean = false;
  public extensionAddPDF: boolean = false;
  public extensionImage: boolean = false;
  private isNewEntity: boolean = false;
  public uploadedAttachmentList: any[] = [];
  public ViewPatterns: boolean = false;
  public FCAViewEnabled : boolean = false;
  public FCAView: any;

  public PatternFailuerAll: boolean  = false
  public interval: string = ""
  public intervalValue: number = 0;
   
  public ffInterval: string = ""
  public ffIntervalValue: number = 0;

  public FailuerRate: boolean = false
  public FailureWarning: boolean = false
  public WarningSign: boolean = false
  public IntervalDeteacting: boolean = false
  public FailuerEvident: boolean = false
  public FailuerMaintenance: boolean = false
  public FailuerComments: boolean = false

 public failuerrate: boolean  = true
 public failurewarning: boolean  = true
 public warningsign: boolean = true
 public intervaldeteacting: boolean  = true
 public failuerevident: boolean  = true
 public failuermaintenance: boolean  = true
 public failuercomments: boolean  = true

 
 public FCAInterval : number = 0
 public FCAComment : any = []
 public FCACondition : any = []
 public FCAFFInterval : number = 0

 public FCAData : any = []
 public FCAFreeText : string = ""
 public Vibration : string = ""
 public Noice : string = ""
 public Leakage : string = ""
 public PerformanceDrop : string = ""
 public TempratureChange : string = ""
 public EmmisionChange : string = ""
 public IncreaseLubricantConsumption : string = ""
 public Other : string = ""

 public HumanSenses : string = ""
 public ExistingInstumentation : string = ""
 public NewInstumentation : string = ""
 public ProcessCondtions : string = ""
 public SampleAnyalysis : string = ""

 public CommentFIEYN : string = ""
 public CommentFIEYN2 : string = ""
 
 public Interval : boolean = true;
 public Condition : boolean = true;
 public FCAFFI : boolean = true;

 public FCAFreeTextCancel1: boolean  = true
 public FCAFreeTextSave1: boolean  = true

 public patternaddshow: boolean  = false

 


  constructor(private messageService: MessageService,
    public formBuilder: FormBuilder,
    public title: Title,
    public router: Router,
    public commonLoadingDirective: CommonLoadingDirective,
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef,
    private prescriptiveBLService : CommonBLService,
    private prescriptiveContantAPI : PrescriptiveContantAPI) { }



  CanDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
    if (this.isNewEntity) {
      if (confirm('Are you sure you want to go back. You have have pending changes')) {
        if (this.MachineType.length > 2) {
          this.treeSave()
        } else if (this.SaveConcequencesEnable == true) {
          this.SaveConsequences();
        }
        return true;
      } else {
        return true;
      };
    } else {
      return true;
    }
  };

  ngOnInit() {
    this.title.setTitle('DPM | Prescriptive ');
    this.data1 = JSON.parse(localStorage.getItem('TestingOBj'))
    setInterval(() => {
      this.dynamicDroppedPopup();
    }, 2000);

    this.items = [{
      styleClass: 'p-person',
      expanded: true,
      label: 'Function',
      command: (event: any) => {
        this.activeIndex = 0;
      }
    },
    {
      label: 'Function Failure',

      command: (event: any) => {
        this.activeIndex = 1;

      }
    },
    {
      label: 'Failure Mode',
      command: (event: any) => {
        this.activeIndex = 2;
      }
    },
    {
      label: 'Effects',
      command: (event: any) => {
        this.activeIndex = 3;
      }
    },

    {
      label: 'Tree',
      command: (event: any) => {
        this.activeIndex = 4;

      }
    },

    {
      label: 'Consequences',
      command: (event: any) => {
        this.activeIndex = 5;

      }
    }
    ];

  }



  async ngOnDestroy() {
    await localStorage.removeItem('PrescriptiveObject');
  }

  public uploadFile(event) {
    if (event.target.files.length > 0) {
      if (event.target.files[0].type === 'application/pdf'
        || event.target.files[0].type === 'image/png'
        || event.target.files[0].type === 'image/jpeg') {
        let filedata = this.uploadedAttachmentList.find(a => a.FileId === this.FileId);
        let fileToUpload = event.target.files[0];
        const formData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);
        formData.append('removePath', !!filedata ? filedata.dbPath : "");
        this.fileUpload = fileToUpload.name;
        var url : string =  this.prescriptiveContantAPI.FMEAFileUpload
        this.prescriptiveBLService.postWithoutHeaders(url,formData)
          .subscribe((res: any) => {
            this.dbPath = res.dbPath;
            this.fullPath = res.fullPath;
            this.fileUpload = res.fileName;
            this.FileId = res.FileId;
            this.uploadedAttachmentList.push(res)
            this.fileAttachmentEnable = true;
          }, err => { console.log(err.err) });
      } else {
        this.messageService.add({ severity: 'warn', summary: 'Warn', detail: "Only Pdf's and Images are allowed" })
      }
    }
  }



  CloseAttachmentModal() {
    if (this.fullPath.length > 4) {
      const params = new HttpParams()
        .set("fullPath", this.fullPath)
      var url : string =  this.prescriptiveContantAPI.FMEADeleteFileUpload
      this.prescriptiveBLService.DeleteWithParam(url,params).subscribe(
        res => {
          this.fileUpload = ""
          this.fileAttachmentEnable = false
        }
      )
    }

  }

  AttachmentDoneModal() {
    this.fileAttachmentEnable = false;
    this.fileUpload = ""
  }

  dynamicDroppedPopup() {
    //faliure droped popup
    if (this.dropedFailure.length > 1) {
      for (let index = 0; index < this.dropedFailure.length - 1; index++) {
        var elementIndex = this.dropedFailure[this.dropedFailure.length];
        this.dropedFailure.splice(elementIndex, 1)

      }

    }
    if (this.dropedConsequenceFailureMode.length > 1) {
      for (let index = 0; index < this.dropedConsequenceFailureMode.length - 1; index++) {
        var elementIndex = this.dropedConsequenceFailureMode[this.dropedConsequenceFailureMode.length];
        this.dropedConsequenceFailureMode.splice(elementIndex, 1)

      }

    }

    if (this.dropedConsequenceEffectFailureMode.length > 1) {
      for (let index = 0; index < this.dropedConsequenceEffectFailureMode.length - 1; index++) {
        var elementIndex = this.dropedConsequenceEffectFailureMode[this.dropedConsequenceEffectFailureMode.length];
        this.dropedConsequenceEffectFailureMode.splice(elementIndex, 1)

      }

    }
    if (this.dropedConsequenceCombinationFailureMode.length > 1) {
      for (let index = 0; index < this.dropedConsequenceCombinationFailureMode.length - 1; index++) {
        var elementIndex = this.dropedConsequenceCombinationFailureMode[this.dropedConsequenceCombinationFailureMode.length];
        this.dropedConsequenceCombinationFailureMode.splice(elementIndex, 1)

      }

    }
    if (this.dropedConsequenceAffectFailureMode.length > 1) {
      for (let index = 0; index < this.dropedConsequenceAffectFailureMode.length - 1; index++) {
        var elementIndex = this.dropedConsequenceAffectFailureMode[this.dropedConsequenceAffectFailureMode.length];
        this.dropedConsequenceAffectFailureMode.splice(elementIndex, 1)

      }

    }


  }

  MachineEquipmentSelect(event) {
    if (this.MachineType == "Pump") {
      this.EquipmentList = null
      this.EquipmentList = ["Centrifugal Pump"]
    }
    if (this.MachineType == "Compressor") {
      this.EquipmentList = null
      this.EquipmentList = ["Compressor"]
    }
    console.log(this.EquipmentType)
  }


  getDropDownLookMasterData() {
    const params = new HttpParams()
      .set('MachineType', this.MachineType)
      .set('EquipmentType', this.EquipmentType)
    var url : string = this.prescriptiveContantAPI.FMEADropdownData;
    this.prescriptiveBLService.getWithParameters( url ,params).subscribe(
      res => {
        console.log(res)
        this.dropDownData = res;

        this.dropDownData.forEach(element => {
          if (element.Function == "Function Failure") {
            this.functionFailureData.push(element)
          } else if (element.Function == "Function Mode") {
            this.functionModeData.push(element)
          }

        });
        console.log(this.functionFailureData)
        console.log(this.functionModeData)

        this.functionfailure = this.functionFailureData;
        this.failuerMode = this.functionModeData;
      })
  }

 
    async GeneratePrescription() {
        if (this.EquipmentType.length > 0 && this.TagNumber.length > 0) {

              var url : string =  this.prescriptiveContantAPI.FMEATagCheck
          await this.prescriptiveBLService.getWithoutParameters(url).subscribe(
                (res: any) => {
                  var check = 0;
                  res.forEach(element => {
                    if(element.TagNumber == this.TagNumber){
                        check = 1;
                    }
                  });
        
                  if(check === 0){
                    this.getDropDownLookMasterData();
                    this.prescriptiveSelect = false;
                    this.prescriptiveSteps = true;
                    this.prescriptiveFuntion = true;
                    this.prescriptiveFunctionFailure = false;
                    this.prescriptiveFailureMode = false;
                    this.prescriptiveEffect = false;
                    this.prescriptiveEffect1 = false
                    this.prescriptiveTree = false;
                    this.activeIndex = 0;
                  }else{
                    this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Tag Number is already Existing, if you want to add something you can update it from Assets List' });
                  }

                }, err => {
                  console.log(err.error);
                }
              )
            
        } else if (this.EquipmentType.length == 0) {
          this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Equipment Type is missing' });

        } else if (this.TagNumber.length == 0) {
          this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'TagNumber is missing' });
        }
      }

  FunctionNext() {
    if (this.FunctionFluidType.length > 0 && this.FunctionRatedHead.length > 0 && this.FunctionPeriodType.length > 0) {
      this.prescriptiveFuntion = false;
      this.prescriptiveFunctionFailure = true;
      this.activeIndex = 1;

    } else if (this.FunctionFluidType.length == 0) {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'FluidType is missing' });

    } else if (this.FunctionRatedHead.length == 0) {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'RatedHead is missing' });

    } else if (this.FunctionPeriodType.length == 0) {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'PeriodType is missing' });

    }
  }

  FunctionFailuerInput(e) {
    this.dropedFailure.pop();
    this.dropedFailure.push(this.functionFailuerInput);

  }
  FunctionFailureBack() {
    this.prescriptiveFuntion = true;
    this.prescriptiveFunctionFailure = false;
    this.activeIndex = 0;
  }
  FunctionFailureNext() {
    if (this.dropedFailure.length > 0) {
      this.functionFailuerInput = []
    }
    if (this.dropedFailure.length > 0 && this.functionFailuerInput.length > 1) {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Data overloaded on both fields, please select any one option' });
    } else if (this.dropedFailure.length == 0 && this.functionFailuerInput.length > 0) {
      this.prescriptiveFunctionFailure = false;
      this.prescriptiveFailureMode = true;
      this.activeIndex = 2;

    } else if (this.dropedFailure.length > 0 && this.functionFailuerInput.length == 0) {
      this.prescriptiveFunctionFailure = false;
      this.prescriptiveFailureMode = true;
      this.activeIndex = 2;

    } else if (this.dropedFailure.length == 0) {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please Add Function failure' });
    } else if (this.dropedFailure.length == 1) {
      this.prescriptiveFunctionFailure = false;
      this.prescriptiveFailureMode = true;
      this.activeIndex = 2;
    }
  }

  FailuerModeInput($event) {
    this.dropedMode.pop();
    this.dropedMode.push(this.failuerModeInput);

  }

  FailureModeBack() {
    this.prescriptiveFunctionFailure = true;
    this.prescriptiveFailureMode = false;
    this.activeIndex = 1;
  }


  GenrationTree() {
    var funFailure;
    if (this.dropedFailure[0].Description == undefined) {
      funFailure = this.dropedFailure[0]
    } else {
      funFailure = this.dropedFailure[0].Description
    }


    this.data1 = [
      {
        label: "Function",
        type: "person",
        styleClass: "p-person",
        expanded: true,
        data: { name: "Fluid Type : " + this.FunctionFluidType + ", " + "Rated Head : " + this.FunctionRatedHead + " m " + ", " + "Duration Of : " + this.FunctionPeriodType + " days" },
        children: [
          {
            label: "Function Failure",
            type: "person",
            styleClass: "p-person",
            expanded: true,
            data: { name: funFailure },
            children: this.InsertLSEffect
          }
        ]
      }
    ];

  }

  FailureModeDropped(c) {
    var findIndexOF = c.PrescriptiveLookupMasterId
    var index = -1;
    var filteredObj = this.dropedMode.find(function (item, i) {
      if (item.PrescriptiveLookupMasterId === findIndexOF) {
        index = i;
        return i;
      }
    });

    this.dropedMode.splice(index, 1)
  }

  FailureModeNext() {
    if (this.dropedMode.length > 0) {
      this.FMChild = []
      this.FactoryToAddInFM = []
      this.NextFailureLSEDiasble = false

      var Data = [], FMName
      this.dropedMode.forEach(element => {
        Data.push(element.Description)
      });
      for (let index = 0; index < Data.length; index++) {
        FMName = Data[index]
        var FMEALABEL: number = index + 1
        this.FMChild.push(
          {
            label: index + 1,
            type: "person",
            styleClass: "p-person",
            expanded: true,
            data: { name: FMName },
            children: [
              {
                label: FMEALABEL,
                type: "person",
                styleClass: "p-person",
                expanded: true,
                data: { name: 'FMEA' },
                children: []
              }
            ]
          }
        )
      }

      this.prescriptiveEffect = true
      this.prescriptiveEffect1 = true
      this.prescriptiveFailureMode = false;
      this.activeIndex = 3
      this.FMCount = 0;

      this.InsertLSEffect = [
        {
          label: "Failure Mode",
          styleClass: "department-cto",
          expanded: true,
          children: this.FMChild
        }
      ]
      this.ADDFailureLSEDiasble = true
      this.FMLSEffectModeName = this.FMChild[this.FMCount].data.name
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please Add Failure Modes' });
    }
    const element = document.querySelector("#scolltoAddConsequence")
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
 async ADDFailuerEffect() {
    //&& this.dbPath.length > 0 
    if (this.failuerModeLocalEffects !== ''
      && this.failuerModeSystemEffects !== '' && this.DownTimeFactor !== 0
      && this.ScrapeFactor !== 0 && this.SafetyFactor !== 0
      && this.ProtectionFactor !== 0 && this.FrequencyFactor !== 0) {

      let LFNode = {
        label: "Local Effect",
        type: "person",
        styleClass: "p-person",
        expanded: true,
        data: {
          name: this.failuerModeLocalEffects
        }
      }
      let SFNode = {
        label: "System Effect",
        type: "person",
        styleClass: "p-person",
        expanded: true,
        data: {
          name: this.failuerModeSystemEffects
        }
      }
      this.changeDetectorRef.detectChanges();
      this.FMChild[this.FMCount].children[0].children.push(LFNode);
      this.FMChild[this.FMCount].children[0].children.push(SFNode);
      let obj = {}
      obj['DownTimeFactor'] = this.DownTimeFactor;
      obj['ScrapeFactor'] = this.ScrapeFactor;
      obj['SafetyFactor'] = this.SafetyFactor;
      obj['ProtectionFactor'] = this.ProtectionFactor;
      obj['FrequencyFactor'] = this.FrequencyFactor;
      obj['AttachmentDBPath'] = this.dbPath;
      obj['AttachmentFullPath'] = this.fullPath;
      obj['Remark'] = this.Remark;
      obj['FileId'] = this.FileId;
      obj['fileName'] = this.fileUpload;

      this.FactoryToAddInFM.push(obj)
      if (this.FMCount == this.FMChild.length - 1) {
        this.ADDFailureLSEDiasble = false;
        this.FMLSEffectModeName = ""
        this.NextFailureLSEDiasble = true;
        this.ADDFailureLSEDiasble = false;
        this.prescriptiveEffect = false
        this.FMLSConsequenceName = this.FMChild[this.FMCount1].data.name
      }
      this.onLSEffectAddedUpdateMessage(this.FMChild[this.FMCount], 'Added');
      this.failuerModeLocalEffects = ""
      this.failuerModeSystemEffects = ""
      this.DownTimeFactor = 0
      this.ScrapeFactor = 0
      this.SafetyFactor = 0
      this.ProtectionFactor = 0
      this.FrequencyFactor = 0
      this.FMCount += 1;
      if (this.FMCount <= this.FMChild.length - 1) {
        this.FMLSEffectModeName = this.FMChild[this.FMCount].data.name
      }
      this.dbPath = "";
      this.fullPath = "";
      this.Remark = "";
      this.fileUpload = "";
      this.FileId = "";
    } else {
      this.messageService.add({ severity: 'info', summary: 'info', detail: 'Please fill all Fields' });
    }
    const element = document.querySelector("#FactorstoLocal")
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  UPDATEFailuerEffect() {
    this.ADDFailureLSEDiasble = true;
    this.selectedModeData.children[0].data.name = this.failuerModeLocalEffects;
    this.selectedModeData.children[1].data.name = this.failuerModeSystemEffects;
    let obj = {}
    obj['DownTimeFactor'] = this.DownTimeFactor;
    obj['ScrapeFactor'] = this.ScrapeFactor
    obj['SafetyFactor'] = this.SafetyFactor
    obj['ProtectionFactor'] = this.ProtectionFactor
    obj['FrequencyFactor'] = this.FrequencyFactor
    obj['AttachmentDBPath'] = this.dbPath
    obj['AttachmentFullPath'] = this.fullPath
    obj['Remark'] = this.Remark;
    obj['FileId'] = this.FileId;
    obj['fileName'] = this.fileUpload;

    this.FactoryToAddInFM[this.selectedModeData.label - 1] = obj;
    if (this.selectedModeData.label - 1 == this.FMChild.length - 1) {
      this.ADDFailureLSEDiasble = false;
      this.FMLSEffectModeName = ""
      this.NextFailureLSEDiasble = true;
      this.ADDFailureLSEDiasble = false;
      this.prescriptiveEffect = false
      this.FMLSConsequenceName = this.FMChild[this.FMCount1].data.name
    }
    this.onLSEffectAddedUpdateMessage(this.FMChild[this.selectedModeData.label - 1], 'Updated');
    this.failuerModeLocalEffects = "";
    this.failuerModeSystemEffects = "";
    this.DownTimeFactor = 0;
    this.ScrapeFactor = 0;
    this.SafetyFactor = 0;
    this.ProtectionFactor = 0;
    this.FrequencyFactor = 0;
    if (this.selectedModeData.label <= this.FMChild.length - 1) {
      this.FMLSEffectModeName = this.FMChild[this.selectedModeData.label].data.name;
    }
    let isCheck = false;
    this.FMChild.forEach(row => {
      if (row.children.length > 0) {
        isCheck = true;
      } else {
        isCheck = false;
      }
    });
    if (isCheck) {
      this.prescriptiveEffect = false;
    }
    this.dbPath = "";
    this.fullPath = "";
    this.Remark = "";
    this.fileUpload = "";
    this.FileId = "";
  }

  SaveConsequences() {
    var temp: string = JSON.stringify(this.data1Clone)
    var temp2 = JSON.parse(temp)
    this.isNewEntity = false
    this.data1[0].children[0].children.forEach((res: any) => {
      res.Consequence = temp2
    })
    this.centrifugalPumpPrescriptiveOBJ.centrifugalPumpPrescriptiveFailureModes = []
    this.centrifugalPumpPrescriptiveOBJ.CFPPrescriptiveId = this.treeResponseData.CFPPrescriptiveId;
    this.centrifugalPumpPrescriptiveOBJ.FMWithConsequenceTree = JSON.stringify(this.data1);
    localStorage.setItem('TestingOBj', JSON.stringify(this.data1))
    for (let index = 0; index < this.FMChild.length; index++) {
      let obj = {};
      obj['CPPFMId'] = this.treeResponseData.centrifugalPumpPrescriptiveFailureModes[index].CPPFMId;
      obj['CFPPrescriptiveId'] = this.treeResponseData.centrifugalPumpPrescriptiveFailureModes[index].CFPPrescriptiveId;
      obj['FunctionMode'] = this.FMChild[index].data.name;
      obj['LocalEffect'] = this.FMChild[index].children[0].children[0].data.name;
      obj['SystemEffect'] = this.FMChild[index].children[0].children[1].data.name;;
      obj['Consequence'] = this.FMChild[index].children[0].children[2].data.name;
      obj['DownTimeFactor'] = this.FactoryToAddInFM[index].DownTimeFactor
      obj['ScrapeFactor'] = this.FactoryToAddInFM[index].ScrapeFactor
      obj['SafetyFactor'] = this.FactoryToAddInFM[index].SafetyFactor
      obj['ProtectionFactor'] = this.FactoryToAddInFM[index].ProtectionFactor
      obj['FrequencyFactor'] = this.FactoryToAddInFM[index].FrequencyFactor
      obj['CriticalityFactor'] = this.treeResponseData.centrifugalPumpPrescriptiveFailureModes[index].CriticalityFactor;
      obj['Rating'] = this.treeResponseData.centrifugalPumpPrescriptiveFailureModes[index].Rating;
      obj['MaintainenancePractice'] = this.treeResponseData.centrifugalPumpPrescriptiveFailureModes[index].MaintainenancePractice;
      obj['FrequencyMaintainenance'] = this.treeResponseData.centrifugalPumpPrescriptiveFailureModes[index].FrequencyMaintainenance;
      obj['ConditionMonitoring'] = this.treeResponseData.centrifugalPumpPrescriptiveFailureModes[index].ConditionMonitoring;
      obj['AttachmentDBPath'] = this.FactoryToAddInFM[index].AttachmentDBPath
      obj['AttachmentFullPath'] = this.FactoryToAddInFM[index].AttachmentFullPath
      obj['Remark'] = this.FactoryToAddInFM[index].Remark
      this.centrifugalPumpPrescriptiveOBJ.centrifugalPumpPrescriptiveFailureModes.push(obj)
    }
  var url : string =  this.prescriptiveContantAPI.FMEASaveConsequence
  this.prescriptiveBLService.PutData(url,this.centrifugalPumpPrescriptiveOBJ).subscribe(
     res => {
        console.log(res);
        this.messageService.add({ severity: 'success', summary: 'Sucess', detail: 'Successfully Done' });
        this.router.navigateByUrl('/Home/Prescriptive/List');
        this.SaveConcequencesEnable = false;
        this.PatternNextOnPrescriptiveTree = true;
      }, err => { console.log(err.err) }
    )
    const element = document.querySelector("#prescriptive")
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  treeSave() {
    this.isNewEntity = false;
    this.prescriptiveTreeBackEnable = false
    this.centrifugalPumpPrescriptiveOBJ.MachineType = this.MachineType
    this.MachineType = "";
    this.isNewEntity = false;
    this.centrifugalPumpPrescriptiveOBJ.EquipmentType = this.EquipmentType
    this.centrifugalPumpPrescriptiveOBJ.TagNumber = this.TagNumber
    this.centrifugalPumpPrescriptiveOBJ.FunctionFluidType = this.FunctionFluidType
    this.centrifugalPumpPrescriptiveOBJ.FunctionRatedHead = this.FunctionRatedHead
    this.centrifugalPumpPrescriptiveOBJ.FunctionPeriodType = this.FunctionPeriodType
    this.centrifugalPumpPrescriptiveOBJ.FunctionFailure = this.dropedFailure[0].Description
    this.centrifugalPumpPrescriptiveOBJ.FailureModeWithLSETree = JSON.stringify(this.data1)
    for (let index = 0; index < this.FMChild.length; index++) {
      let obj = {};
      obj['CPPFMId'] = 0;
      obj['CFPPrescriptiveId'] = 0;
      obj['FunctionMode'] = this.FMChild[index].data.name;
      obj['LocalEffect'] = this.FMChild[index].children[0].children[0].data.name;
      obj['SystemEffect'] = this.FMChild[index].children[0].children[1].data.name;
      obj['Consequence'] = "";
      obj['DownTimeFactor'] = this.FactoryToAddInFM[index].DownTimeFactor
      obj['ScrapeFactor'] = this.FactoryToAddInFM[index].ScrapeFactor
      obj['SafetyFactor'] = this.FactoryToAddInFM[index].SafetyFactor
      obj['ProtectionFactor'] = this.FactoryToAddInFM[index].ProtectionFactor
      obj['FrequencyFactor'] = this.FactoryToAddInFM[index].FrequencyFactor
      obj['AttachmentDBPath'] = this.FactoryToAddInFM[index].AttachmentDBPath
      obj['AttachmentFullPath'] = this.FactoryToAddInFM[index].AttachmentFullPath
      obj['Remark'] = this.FactoryToAddInFM[index].Remark
      this.centrifugalPumpPrescriptiveOBJ.centrifugalPumpPrescriptiveFailureModes.push(obj)
    }

  var url :string =  this.prescriptiveContantAPI.FMEATreeSave
  this.prescriptiveBLService.postWithoutHeaders(url, this.centrifugalPumpPrescriptiveOBJ)
    .subscribe(
      res => {
        console.log(res);
        this.treeResponseData = res;
        localStorage.setItem('PrescriptiveObject', JSON.stringify(this.treeResponseData))
        this.prescriptiveTreeNextEnable = true
        this.prescriptiveTreeUpdateEnable = false;
        this.prescriptiveTreeSubmitEnable = false;
        this.prescriptiveTreeBackEnable = false

      },
      err => { console.log(err.Message) }
    )
  }

  PushConcequences() {
    this.FMChild[this.FMCount1].children[0].children.push(
      {
        label: "Consequence",
        type: "person",
        styleClass: "p-person",
        expanded: true,
        data: {
          name: this.finalConsequence
        }
      }
    )

    this.data1Clone[0].children[0].children[0].children[this.FMCount1].children.push(
      {
        label: "Consequence",
        type: "person",
        styleClass: "p-person",
        expanded: true,
        data: {
          name: this.finalConsequence
        }
      }
    )
    this.FMCount1 += 1;
    if (this.FMCount1 <= this.FMChild.length - 1) {
      this.FMLSConsequenceName = this.FMChild[this.FMCount1].data.name
    }
    if (this.FMCount1 == this.FMChild.length) {
      this.prescriptiveTreeNextEnable = false;
      this.SaveConcequencesEnable = true;
      this.isNewEntity = true
    }

    this.activeIndex = 4
    this.prescriptiveTree = true;
    this.Consequences1 = false;
    this.ConsequencesTree = false;
    this.dropedConsequenceEffectFailureMode = []
    this.dropedConsequenceFailureMode = []
    this.dropedConsequenceCombinationFailureMode = []
    this.dropedConsequenceAffectFailureMode = []
    this.ConsequenceNode = []
    this.consequenceA = 'p-person1'
    this.consequenceB = 'p-person'
    this.consequenceC = 'p-person'
    this.consequenceD = 'p-person'
    this.consequenceE = 'p-person'

    this.consequenceTreeColorNodeA = 'p-person1'
    this.consequenceTreeColorNodeB = 'p-person'
    this.consequenceTreeColorNodeC = 'p-person'
    this.consequenceTreeColorNodeD = 'p-person'

    this.changeDetectorRef.detectChanges();
    // const element = document.querySelector("#scolltoAddConsequence")
    // if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    const element = document.querySelector("#prescriptive")
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    
  }
  FailureEffectNext() {
    this.prescriptiveFailureMode = false;
    this.prescriptiveEffect = false;
    this.prescriptiveEffect1 = false
    this.prescriptiveTree = true;
    this.prescriptiveTreeBackEnable = true
    this.activeIndex = 4;
    this.prescriptiveTreeSubmitEnable = true;
    // var SubmitedTree = JSON.parse(localStorage.getItem('PrescriptiveObject'))
    // if (SubmitedTree == null) {
    //   this.prescriptiveTreeSubmitEnable = true;
    // }
    this.isNewEntity = true
    this.GenrationTree()
    var temp2;
    var temp: string = JSON.stringify(this.data1)
    temp2 = JSON.parse(temp)

    var i: number = 0
    temp2[0].children[0].children[0].children.forEach((res: any) => {
      var abc: any[] = res.children[0].children
      temp2[0].children[0].children[0].children[i].children.pop()
      temp2[0].children[0].children[0].children[i].children = abc
      i = i + 1;
    });
    this.data1Clone = temp2
    this.data1[0].children[0].children.forEach((res: any) => {
      res.FMEA = temp2
    })
    const element = document.querySelector("#scrollToTop")
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }


  FailuerEffectBack() {
    if (this.FMChild[0].children.length > 0) {
      if (confirm("Are you sure want to go back? Yes then your recently added changes will get deleted.")) {
        this.prescriptiveEffect = false;
        this.prescriptiveEffect1 = false
        this.prescriptiveFailureMode = true;
        this.activeIndex = 2;
        this.failuerModeLocalEffects = "";
        this.failuerModeSystemEffects = "";
        this.DownTimeFactor = 0;
        this.ScrapeFactor = 0;
        this.SafetyFactor = 0;
        this.ProtectionFactor = 0;
        this.FrequencyFactor = 0;
        this.prescriptiveEffect = false;
        this.ADDFailureLSEDiasble = true;
        this.selectedModeData = "";
        this.fullPath = "";
        this.Remark = "";
        this.dbPath = "";
        this.fileUpload = "";
      }
    } else {
      this.prescriptiveEffect = false;
      this.prescriptiveEffect1 = false
      this.prescriptiveFailureMode = true;
      this.activeIndex = 2;
    }
  }

  treeBack() {
    this.prescriptiveEffect = true;
    this.prescriptiveEffect1 = true
    this.prescriptiveTree = false;
  }



  async treeNext() {
    this.prescriptiveTree = true;
    this.Consequences1 = true;
    this.activeIndex = 5
    this.changeDetectorRef.detectChanges();
    const element = document.querySelector("#ScrollUpdateTree1")
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }


  Consequence1Back() {
    this.activeIndex = 4
    this.prescriptiveTree = true;
    this.Consequences1 = false;

  }
  Consequence1Next() {
    if (this.dropedConsequenceFailureMode.length == 1) {
      if (this.dropedConsequenceFailureMode[0] == 'YES') {
        this.ConsequencesAnswer.push(this.dropedConsequenceFailureMode[0])
        console.log(this.ConsequencesAnswer)
        this.Consequences2 = true;
        this.Consequences1 = false;
        this.Consequences3 = false;
        this.Consequences4 = false;
      } else {
        this.ConsequencesAnswer.push(this.dropedConsequenceFailureMode[0])
        console.log(this.ConsequencesAnswer)
        this.Consequences3 = true;
        this.Consequences2 = false;
        this.Consequences1 = false;
        this.Consequences4 = false;
      }
    } else {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Field is Empty, Drag and drop inside field' });
    }


  }
  Consequence2Back() {
    this.Consequences1 = true;
    this.Consequences2 = false;

  }
  Consequence2Next() {
    if (this.dropedConsequenceEffectFailureMode.length == 1) {
      if (this.dropedConsequenceEffectFailureMode[0] == 'YES') {
        this.ConsequencesAnswer.push(this.dropedConsequenceEffectFailureMode[0])
        this.consequenceA = 'p-person'
        this.consequenceB = 'p-person1'
        this.consequenceC = 'p-person'
        this.consequenceD = 'p-person'
        this.consequenceE = 'p-person'
        this.finalConsequence = ""
        this.finalConsequence = "B"
        console.log(this.ConsequencesAnswer)
        this.Consequences3 = false;
        this.Consequences2 = false;
        this.Consequences1 = false;
        this.Consequences4 = false;
        this.ConsequencesTree = true;
        this.colorConsequenceTree()
      } else {
        this.ConsequencesAnswer.push(this.dropedConsequenceEffectFailureMode[0])
        console.log(this.ConsequencesAnswer)
        this.Consequences3 = false;
        this.Consequences2 = false;
        this.Consequences1 = false;
        this.Consequences4 = true;
      }
    } else {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Field is Empty, Drag and drop inside field' });
    }

  }
  Consequence3Back() {
    this.Consequences1 = true
    this.Consequences3 = false;
  }
  Consequence3Next() {
    if (this.dropedConsequenceCombinationFailureMode.length == 1) {
      if (this.dropedConsequenceCombinationFailureMode[0] == 'YES') {
        this.ConsequencesAnswer.push(this.dropedConsequenceCombinationFailureMode[0])
        this.finalConsequence = ""
        this.finalConsequence = "A"
        this.consequenceA = 'p-person1'
        this.consequenceB = 'p-person'
        this.consequenceC = 'p-person'
        this.consequenceD = 'p-person'
        this.consequenceE = 'p-person'
        console.log(this.ConsequencesAnswer)
        this.Consequences3 = false;
        this.Consequences2 = false;
        this.Consequences1 = false;
        this.Consequences4 = false;
        this.ConsequencesTree = true;
        this.colorConsequenceTree()
      } else {
        this.ConsequencesAnswer.push(this.dropedConsequenceCombinationFailureMode[0])
        this.finalConsequence = ""
        this.finalConsequence = "E"
        this.consequenceA = 'p-person'
        this.consequenceB = 'p-person'
        this.consequenceC = 'p-person'
        this.consequenceD = 'p-person'
        this.consequenceE = 'p-person1'
        console.log(this.ConsequencesAnswer)
        this.Consequences3 = false;
        this.Consequences2 = false;
        this.Consequences1 = false;
        this.Consequences4 = false;
        this.ConsequencesTree = true;
        this.colorConsequenceTree()
      }
    } else {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Field is Empty, Drag and drop inside field' });
    }

  }
  Consequence4Back() {
    this.Consequences2 = true
    this.Consequences4 = false;
  }
  Consequence4Next() {
    if (this.dropedConsequenceAffectFailureMode.length == 1) {
      if (this.dropedConsequenceAffectFailureMode[0] == 'YES') {
        this.ConsequencesAnswer.push(this.dropedConsequenceAffectFailureMode[0])
        this.finalConsequence = ""
        this.finalConsequence = "C"
        this.consequenceA = 'p-person'
        this.consequenceB = 'p-person'
        this.consequenceC = 'p-person1'
        this.consequenceD = 'p-person'
        this.consequenceE = 'p-person'
        console.log(this.ConsequencesAnswer)
        this.Consequences3 = false;
        this.Consequences2 = false;
        this.Consequences1 = false;
        this.Consequences4 = false;
        this.ConsequencesTree = true;
        this.colorConsequenceTree()
      } else {
        this.ConsequencesAnswer.push(this.dropedConsequenceAffectFailureMode[0])
        this.finalConsequence = ""
        this.finalConsequence = "D"
        this.consequenceA = 'p-person'
        this.consequenceB = 'p-person'
        this.consequenceC = 'p-person'
        this.consequenceD = 'p-person1'
        this.consequenceE = 'p-person'
        console.log(this.ConsequencesAnswer)
        this.Consequences3 = false;
        this.Consequences2 = false;
        this.Consequences1 = false;
        this.Consequences4 = false;
        this.ConsequencesTree = true;
        this.colorConsequenceTree()
      }
    } else {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Field is Empty, Drag and drop inside field' });
    }

  }

  ConsequenceTreeBack() {
    this.dropedConsequenceAffectFailureMode = [];
    this.dropedConsequenceCombinationFailureMode = [];
    this.dropedConsequenceFailureMode = [];
    this.dropedConsequenceEffectFailureMode = [];
    this.ConsequencesTree = false
    this.Consequences1 = true;
    this.consequenceA = 'p-person'
    this.consequenceB = 'p-person'
    this.consequenceC = 'p-person'
    this.consequenceD = 'p-person'
    this.consequenceE = 'p-person'
    this.consequenceTreeColorNodeA = 'p-person1'
    this.consequenceTreeColorNodeB = 'p-person'
    this.consequenceTreeColorNodeC = 'p-person'
    this.consequenceTreeColorNodeD = 'p-person'
  }

  colorConsequenceTree() {
    if (this.ConsequencesAnswer[0] == 'YES') {
      this.consequenceTreeColorNodeB = 'p-person1'
    }
    else {
      this.consequenceTreeColorNodeC = 'p-person1'
    }
    if (this.ConsequencesAnswer[0] == 'YES' && this.ConsequencesAnswer[1] == 'NO') {
      this.consequenceTreeColorNodeD = 'p-person1'
    }
    this.ConsequenceTreeGeneration();
    this.ConsequencesAnswer = [];
    this.changeDetectorRef.detectChanges();
  }


  ConsequenceTreeGeneration() {
    this.ConsequenceNode = [
      {
        label: "Consequences",
        type: "person",
        styleClass: this.consequenceTreeColorNodeA,
        expanded: true,
        data: {
          name:
            "Will the occurance of the failure mode be evidient to operational stuff during normal operation of the plant?"
        },
        children: [
          {
            label: "Yes",
            type: "person",
            styleClass: this.consequenceTreeColorNodeB,
            expanded: true,
            data: {
              name:
                "Does the effect of the failure mode(or the secondary effect resulting from the failures) have direct adverse effect on operational safety or the environment?"
            },
            children: [
              {
                label: "Yes",
                type: "person",
                styleClass: this.consequenceB,
                expanded: true,
                data: {
                  name: "B"
                }
              },
              {
                label: "No",
                type: "person",
                styleClass: this.consequenceTreeColorNodeD,
                expanded: true,
                data: {
                  name:
                    "Does the Failure mode adversily affect operational capabilities of the plant? "
                },
                children: [
                  {
                    label: "Yes",
                    type: "person",
                    styleClass: this.consequenceC,
                    expanded: true,
                    data: {
                      name: "C"
                    }
                  },
                  {
                    label: "No",
                    type: "person",
                    styleClass: this.consequenceD,
                    expanded: true,
                    data: {
                      name: "D"
                    }
                  }
                ]
              }
            ]
          },

          {
            label: "No",
            type: "person",
            styleClass: this.consequenceTreeColorNodeC,
            expanded: true,
            data: {
              name:
                "Does the combination of the failure mode and one additonal failure or event result in an adverse effect safety of the environment?  "
            },
            children: [
              {
                label: "Yes",
                type: "person",
                styleClass: this.consequenceA,
                expanded: true,
                data: {
                  name: "A "
                }
              },
              {
                label: "No",
                type: "person",
                styleClass: this.consequenceE,
                expanded: true,
                data: {
                  name: "E"
                }
              }
            ]
          }
        ]
      }
    ];
  }

  dragStart(e, f) {
    this.dragedFunctionfailure = f;
  }
  dragStart1(e, c) {
    this.dragedFunctionMode = c;
  }
  dragEnd(e) { }
  dragEnd1(e) { }
  drop(e) {
    if (this.dragedFunctionfailure) {
      this.dropedFailure.push(this.dragedFunctionfailure);
      this.dragedFunctionfailure = null;
    }
  }
  drop1(e) {
    if (this.dragedFunctionMode) {
      this.dropedMode.push(this.dragedFunctionMode);
      this.dragedFunctionMode = null;
    }
  }


  dragStartC1(e, con1) {
    this.droppedYesNo = con1;
  }

  dragEndC1(e) { }
  dropC1(e) {
    if (this.droppedYesNo) {
      this.dropedConsequenceFailureMode = [];
      this.dropedConsequenceFailureMode.push(this.droppedYesNo);
      this.droppedYesNo = null;
    }
  }
  dragStartC2(e, con2) {
    this.droppedYesNo1 = con2;
  }

  dragEndC2(e) { }
  dropC2(e) {
    if (this.droppedYesNo1) {
      this.dropedConsequenceEffectFailureMode = [];
      this.dropedConsequenceEffectFailureMode.push(this.droppedYesNo1);
      this.droppedYesNo1 = null;
    }
  }

  dragStartC3(e, con3) {
    this.droppedYesNo2 = con3;
  }

  dragEndC3(e) { }
  dropC3(e) {
    if (this.droppedYesNo2) {
      this.dropedConsequenceCombinationFailureMode = [];
      this.dropedConsequenceCombinationFailureMode.push(this.droppedYesNo2);
      this.droppedYesNo2 = null;
    }
  }

  dragStartC4(e, con4) {
    this.droppedYesNo3 = con4;
  }

  dragEndC4(e) { }

  dropC4(e) {
    if (this.droppedYesNo3) {
      this.dropedConsequenceAffectFailureMode = [];
      this.dropedConsequenceAffectFailureMode.push(this.droppedYesNo3);
      this.droppedYesNo3 = null;
    }
  }

  onLSEffectAddedUpdateMessage(event, type) {
    this.messageService.add({
      severity: "success",
      summary: `${type} Local and System Effect `,
      detail: `${event.data.name} to local`
    });
  }

  onNodeSelect(event) {
    if (event.node.children.length > 0) {
      this.failuerModeLocalEffects = event.node.children[0].data.name;
      this.failuerModeSystemEffects = event.node.children[1].data.name;
      this.DownTimeFactor = this.FactoryToAddInFM[event.node.label - 1].DownTimeFactor;
      this.ScrapeFactor = this.FactoryToAddInFM[event.node.label - 1].ScrapeFactor;
      this.SafetyFactor = this.FactoryToAddInFM[event.node.label - 1].SafetyFactor;
      this.ProtectionFactor = this.FactoryToAddInFM[event.node.label - 1].ProtectionFactor;
      this.FrequencyFactor = this.FactoryToAddInFM[event.node.label - 1].FrequencyFactor;
      this.dbPath = this.FactoryToAddInFM[event.node.label - 1].AttachmentDBPath;
      this.Remark = this.FactoryToAddInFM[event.node.label - 1].Remark;
      this.fullPath = this.FactoryToAddInFM[event.node.label - 1].AttachmentFullPath;
      this.fileUpload = this.FactoryToAddInFM[event.node.label - 1].fileName;
      this.FileId = this.FactoryToAddInFM[event.node.label - 1].FileId;
      this.FMLSEffectModeName = this.FMChild[event.node.label - 1].data.name
      this.prescriptiveEffect = true;
      this.ADDFailureLSEDiasble = false;
      this.selectedModeData = event.node;
    } else {
      this.messageService.add({
        severity: "info",
        summary: "Note",
        detail: "Record Found! Please add."
      });
    }
  }

 

}
  

