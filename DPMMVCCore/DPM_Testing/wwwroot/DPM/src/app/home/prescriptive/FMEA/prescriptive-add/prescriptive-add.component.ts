import { HttpClient, HttpParams, JsonpClientBackend } from '@angular/common/http';
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


  constructor(private messageService: MessageService,
    public formBuilder: FormBuilder,
    public title: Title,
    public router: Router,
    public commonLoadingDirective: CommonLoadingDirective,
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef) { }



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
    this.PatternTree()
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
    },
    {
      label: 'FCA',
      command: (event: any) => {
        this.activeIndex = 6;

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
        this.http.post('api/PrescriptiveAPI/UploadFile', formData)
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
      this.http.delete('api/PrescriptiveAPI/UpdateFileUpload', { params }).subscribe(
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

    this.http.get('api/PrescriptiveLookupMasterAPI/GetRecords', { params }).subscribe(
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



  GeneratePrescription() {
    if (this.EquipmentType.length > 0 && this.TagNumber.length > 0) {
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
  }
  ADDFailuerEffect() {
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

    this.isNewEntity = false
    this.data1[0].children[0].children.forEach((res: any) => {
      res.Consequence = this.data1Clone
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

    this.http.put('api/PrescriptiveAPI/CFPrescriptiveAdd', this.centrifugalPumpPrescriptiveOBJ).subscribe(
      res => {
        console.log(res);
        this.messageService.add({ severity: 'success', summary: 'Sucess', detail: 'Successfully Done' });
        // this.router.navigateByUrl('/Home/Prescriptive/List');
        this.SaveConcequencesEnable = false;
        this.PatternNextOnPrescriptiveTree = true;
      }, err => { console.log(err.err) }
    )

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


    this.http.post('api/PrescriptiveAPI/PostCentrifugalPumpPrescriptiveData', this.centrifugalPumpPrescriptiveOBJ).subscribe(
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

  PatternTree() {
    this.FCAdata1 = [
      {
        label: "Pattern",
        type: "person",
        styleClass: this.PattenNode1,
        // node:"Node1",
        expanded: true,
        data: { name: "Are Failures caused by wear elments" },
        children: [
          {
            label: "No",
            type: "person",
            styleClass: this.PattenNode2,
            // node:"Node2",
            expanded: true,
            data: {
              name:
                "Are failures caused by envrionmental chemical or stress reaction?"
            },
            children: [
              {
                label: "No",
                type: "person",
                styleClass: this.PattenNode4,
                // node:"Node4",
                expanded: true,
                data: {
                  name:
                    "Are failures mostly random with only a few early life failures"
                },
                children: [
                  {
                    label: "Yes",
                    type: "person",
                    styleClass: this.PattenAnsNode4,
                    expanded: true,
                    data: {
                      name: "Pattern 4"
                    }
                  },
                  {
                    label: "No",
                    type: "person",
                    styleClass: this.PattenNode7,
                    // node:"Node7",
                    expanded: true,
                    data: {
                      name:
                        "Do more failures Occur Shortly after Installation repair or overhaul"
                    },
                    children: [
                      {
                        label: "Yes",
                        type: "person",
                        styleClass: this.PattenAnsNode6P1,
                        expanded: true,
                        data: {
                          name: "Pattern 6"
                        }
                      },
                      {
                        label: "No",
                        type: "person",
                        styleClass: this.PattenAnsNode5,
                        expanded: true,
                        data: {
                          name: "Pattern 5"
                        }
                      }
                    ]
                  }
                ]
              },
              {
                label: "Yes",
                type: "person",
                styleClass: this.PattenNode5,
                // node:"Node5",
                expanded: true,
                data: {
                  name:
                    "Do failures increase steadily with time but without a discernable sudden increase?"
                },
                children: [
                  {
                    label: "Yes",
                    type: "person",
                    styleClass: this.PattenAnsNode3P1,
                    expanded: true,
                    data: {
                      name: "Pattern 3"
                    }
                  },
                  {
                    label: "No",
                    type: "person",
                    styleClass: this.PattenAnsNode2P1,
                    expanded: true,
                    data: {
                      name: "Pattern 2"
                    }
                  }
                ]
              }
            ]
          },
          {
            label: "Yes",
            type: "person",
            styleClass: this.PattenNode3,
            // node:"Node3",
            expanded: true,
            data: {
              name:
                "Are failures a combination Of early life random and late life"
            },
            children: [
              {
                label: "Yes",
                type: "person",
                styleClass: this.PattenAnsNode1,
                expanded: true,
                data: {
                  name: "Pattern1"
                }
              },
              {
                label: "No",
                type: "person",
                styleClass: this.PattenNode6,
                // node:"Node6",
                expanded: true,
                data: {
                  name:
                    "Do high Percentage failures occuer at a reasonably consistent age"
                },
                children: [
                  {
                    label: "Yes",
                    type: "person",
                    styleClass: this.PattenAnsNode2P2,
                    expanded: true,
                    data: {
                      name: "Pattern 2"
                    }
                  },
                  {
                    label: "No",
                    type: "person",
                    styleClass: this.PattenNode8,
                    // node:"Node8",
                    expanded: true,
                    data: {
                      name:
                        "Do more failures Occur Shortly after Installation repair or overhaul"
                    },
                    children: [
                      {
                        label: "Yes",
                        type: "person",
                        styleClass: this.PattenAnsNode6P2,
                        expanded: true,
                        data: {
                          name: "Pattern 6"
                        }
                      },
                      {
                        label: "No",
                        type: "person",
                        styleClass: this.PattenAnsNode3P2,
                        expanded: true,
                        data: {
                          name: "Pattern 3"
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ];
  }



  SelectPatternForFailureMode(value: string) {
    this.Pattern = value;
    this.changeDetectorRef.detectChanges();
    this.PattenNode1 = 'p-person'
    this.PattenNode2 = 'p-person'
    this.PattenNode3 = 'p-person'
    this.PattenNode4 = 'p-person'
    this.PattenNode5 = 'p-person'
    this.PattenNode6 = 'p-person'
    this.PattenNode7 = 'p-person'
    this.PattenNode8 = 'p-person'
    this.PattenAnsNode1 = 'p-person'
    this.PattenAnsNode2P2 = 'p-person'
    this.PattenAnsNode2P1 = 'p-person'
    this.PattenAnsNode3P1 = 'p-person'
    this.PattenAnsNode3P2 = 'p-person'
    this.PattenAnsNode4 = 'p-person'
    this.PattenAnsNode5 = 'p-person'
    this.PattenAnsNode6P1 = 'p-person'
    this.PattenAnsNode6P2 = 'p-person'
    this.PatternPathEnable = false

    if (value === 'Pattern 1') {
      this.PattenNode1 = 'StylePattern'
      this.PattenNode2 = 'p-person'
      this.PattenNode3 = 'StylePattern'
      this.PattenNode4 = 'p-person'
      this.PattenNode5 = 'p-person'
      this.PattenNode6 = 'p-person'
      this.PattenNode7 = 'p-person'
      this.PattenNode8 = 'p-person'
      this.PattenAnsNode1 = 'StylePattern'
      this.changeDetectorRef.detectChanges();
      this.PatternTree()

    } else if (value === 'Pattern 2') {
      this.PatternPathEnable = true
      this.PattenNode2 = 'StylePattern1'
      this.PattenNode5 = 'StylePattern1'
      this.PattenAnsNode2P1 = 'StylePattern1'

      this.PattenNode1 = 'StylePattern'
      this.PattenNode3 = 'StylePattern2'
      this.PattenNode4 = 'p-person'
      this.PattenNode6 = 'StylePattern2'
      this.PattenNode7 = 'p-person'
      this.PattenNode8 = 'p-person'
      this.PattenAnsNode2P2 = 'StylePattern2'
      this.changeDetectorRef.detectChanges();
      this.PatternTree()



    } else if (value === 'Pattern 3') {
      this.PatternPathEnable = true
      this.PattenNode1 = 'StylePattern'
      this.PattenNode2 = 'StylePattern1'
      this.PattenNode5 = 'StylePattern1'
      this.PattenAnsNode3P1 = 'StylePattern1'
      this.PattenNode3 = 'StylePattern2'
      this.PattenNode6 = 'StylePattern2'
      this.PattenNode8 = 'StylePattern2'
      this.PattenAnsNode3P2 = 'StylePattern2'
      this.changeDetectorRef.detectChanges();
      this.PatternTree()


    } else if (value === 'Pattern 4') {
      this.PattenNode1 = 'StylePattern'
      this.PattenNode2 = 'StylePattern'
      this.PattenNode4 = 'StylePattern'
      this.PattenAnsNode4 = 'StylePattern'
      this.changeDetectorRef.detectChanges();
      this.PatternTree()

    } else if (value === 'Pattern 5') {
      this.PattenNode1 = 'StylePattern'
      this.PattenNode2 = 'StylePattern'
      this.PattenNode4 = 'StylePattern'
      this.PattenNode7 = 'StylePattern'
      this.PattenAnsNode5 = 'StylePattern'
      this.changeDetectorRef.detectChanges();
      this.PatternTree()
      this.PatternEnable = true;

    } else if (value === 'Pattern 6') {
      this.PatternPathEnable = true
      this.PattenNode1 = 'StylePattern'
      this.PattenNode2 = 'StylePattern1'
      this.PattenNode4 = 'StylePattern1'
      this.PattenNode7 = 'StylePattern1'
      this.PattenAnsNode6P1 = 'StylePattern1'

      this.PattenNode3 = 'StylePattern2'
      this.PattenNode6 = 'StylePattern2'
      this.PattenNode8 = 'StylePattern2'
      this.PattenAnsNode6P2 = 'StylePattern2'

      this.changeDetectorRef.detectChanges();
      this.PatternTree()

    } else if (value === "") {
      this.PattenNode1 = 'p-person'
      this.PattenNode2 = 'p-person'
      this.PattenNode3 = 'p-person'
      this.PattenNode4 = 'p-person'
      this.PattenNode5 = 'p-person'
      this.PattenNode6 = 'p-person'
      this.PattenNode7 = 'p-person'
      this.PattenNode8 = 'p-person'
      this.PattenAnsNode1 = 'p-person'
      this.PattenAnsNode2P2 = 'p-person'
      this.PattenAnsNode2P1 = 'p-person'
      this.PattenAnsNode3P1 = 'p-person'
      this.PattenAnsNode3P2 = 'p-person'
      this.PattenAnsNode4 = 'p-person'
      this.PattenAnsNode5 = 'p-person'
      this.PattenAnsNode6P1 = 'p-person'
      this.PattenAnsNode6P2 = 'p-person'
      this.PatternPathEnable = false
      this.Pattern = ""
      this.PatternPath = ""
      this.changeDetectorRef.detectChanges();
    }

    const element = document.querySelector("#ScrollToFCATree")
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })

  }

  ADDFMToFCA() {
    this.prescriptiveTree = false
    this.FailureModePatternTree = true
    this.activeIndex = 6

    this.PattenNode1 = 'p-person'
    this.PattenNode2 = 'p-person'
    this.PattenNode3 = 'p-person'
    this.PattenNode4 = 'p-person'
    this.PattenNode5 = 'p-person'
    this.PattenNode6 = 'p-person'
    this.PattenNode7 = 'p-person'
    this.PattenNode8 = 'p-person'
    this.PattenAnsNode1 = 'p-person'
    this.PattenAnsNode2P2 = 'p-person'
    this.PattenAnsNode2P1 = 'p-person'
    this.PattenAnsNode3P1 = 'p-person'
    this.PattenAnsNode3P2 = 'p-person'
    this.PattenAnsNode4 = 'p-person'
    this.PattenAnsNode5 = 'p-person'
    this.PattenAnsNode6P1 = 'p-person'
    this.PattenAnsNode6P2 = 'p-person'
    this.PatternPathEnable = false
    this.Pattern = ""
    this.PatternPath = ""
    this.changeDetectorRef.detectChanges();
    this.PatternFMName = this.data1[0].children[0].children[0].children[0].data.name
    this.PatternNextOnPrescriptiveTree = false
    this.GetChartData();
  }
  PatternBack() {
    this.prescriptiveTree = true
    this.FailureModePatternTree = false
    this.activeIndex = 5
    if (this.PatternCounter == 0) {
      this.PatternNextOnPrescriptiveTree = true;
    }
  }

  PatternAdd() {
    if (this.Pattern === 'Pattern 2' || this.Pattern === 'Pattern 3' || this.Pattern === 'Pattern 6') {
      if ((this.Pattern === 'Pattern 2' || this.Pattern === 'Pattern 3'
        || this.Pattern === 'Pattern 6')
        && this.PatternPath != "") {
        var path;
        if (this.Pattern === 'Pattern 2' && this.PatternPath == "1") {
          path = {
            Node1: 'StylePattern1',
            Node2: 'StylePattern1',
            Node5: 'StylePattern1',
            AnsNode2P1: 'StylePattern1'
          }
        } else if (this.Pattern === 'Pattern 2' && this.PatternPath == "2") {
          path = {
            Node1: 'StylePattern2',
            Node3: 'StylePattern2',
            Node6: 'StylePattern2',
            AnsNode2P2: 'StylePattern2'
          }

        } else if (this.Pattern === 'Pattern 3' && this.PatternPath == "1") {
          path = {
            Node1: 'StylePattern1',
            Node2: 'StylePattern1',
            Node5: 'StylePattern1',
            AnsNode3P1: 'StylePattern1'
          }

        } else if (this.Pattern === 'Pattern 3' && this.PatternPath == "2") {
          path = {
            Node1: 'StylePattern2',
            Node3: 'StylePattern2',
            Node6: 'StylePattern2',
            Node8: 'StylePattern2',
            AnsNode3P2: 'StylePattern2'
          }

        } else if (this.Pattern === 'Pattern 6' && this.PatternPath == "1") {
          path = {
            Node1: 'StylePattern1',
            Node2: 'StylePattern1',
            Node4: 'StylePattern1',
            Node7: 'StylePattern1',
            AnsNode6P1: 'StylePattern1'
          }
        } else if (this.Pattern === 'Pattern 6' && this.PatternPath == "2") {
          path = {
            Node1: 'StylePattern2',
            Node3: 'StylePattern2',
            Node6: 'StylePattern2',
            Node8: 'StylePattern2',
            AnsNode6P2: 'StylePattern2'
          }
        }



        var FCATreeClone = {
          label: this.data1Clone[0].children[0].children[0].children[this.PatternCounter].label,
          type: "person",
          styleClass: 'p-person',
          editFCA: true,
          viewFCA: true,
          expanded: true,
          nodePath: path,
          data: { name: "FCA" },
          children: [
            {
              label: "Pattern",
              type: "person",
              styleClass: 'p-person',
              expanded: true,
              data: {
                name: this.Pattern
              }
            }
          ]
        }
  
  
  
        var FCATree = {
          label: this.data1Clone[0].children[0].children[0].children[this.PatternCounter].label,
          type: "person",
          styleClass: 'p-person',
          editFCA: true,
          viewFCA: true,
          FCAData: FCATreeClone,
          nodePath: path,
          data: { name: "FCA" }
        }
  
        this.data1Clone[0].children[0].children[0].children[this.PatternCounter].children = []
        this.data1Clone[0].children[0].children[0].children[this.PatternCounter].children.push(
          {
            label: "Pattern",
            type: "person",
            styleClass: 'p-person',
            expanded: true,
            data: {
              name: this.Pattern
            }
          }
        )

        this.data1[0].children[0].children[0].children[this.PatternCounter].children.push(FCATree)
        if (this.PatternCounter < this.data1[0].children[0].children[0].children.length - 1) {
          this.PatternFMName = this.data1[0].children[0].children[0].children[this.PatternCounter + 1].data.name

        }
        this.PatternCounter = this.PatternCounter + 1
        if (this.PatternCounter == this.data1[0].children[0].children[0].children.length) {
          this.Pattern = ""
          this.SaveFCAEnable = true
        }
        this.FailureModePatternTree = false;
        this.prescriptiveTree = true
        this.PatternPath = ""

      } else {
        this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Please Select any one color path" })
      }

    } else if (this.Pattern === 'Pattern 1' || this.Pattern === 'Pattern 4' || this.Pattern === 'Pattern 5') {

      if (this.Pattern === 'Pattern 1') {
        path = {
          Node1: 'StylePattern',
          Node3: 'StylePattern',
          AnsNode1: 'StylePattern'
        }

      } else if (this.Pattern === 'Pattern 4') {
        path = {
          Node1: 'StylePattern',
          Node2: 'StylePattern',
          Node4: 'StylePattern',
          AnsNode4: 'StylePattern'
        }

      } else if (this.Pattern === 'Pattern 5') {
        path = {
          Node1: 'StylePattern',
          Node2: 'StylePattern',
          Node4: 'StylePattern',
          Node7: 'StylePattern',
          AnsNode5: 'StylePattern'
        }

      }

      var FCATree1Clone = {
        label: this.data1Clone[0].children[0].children[0].children[this.PatternCounter].label,
        type: "person",
        styleClass: 'p-person',
        editFCA: true,
        viewFCA: true,
        expanded: true,
        nodePath: path,
        data: { name: "FCA" },
        children: [
          {
            label: "Pattern",
            type: "person",
            styleClass: 'p-person',
            expanded: true,
            data: {
              name: this.Pattern
            }
          }
        ]
      }



      var FCATree1 = {
        label: this.data1Clone[0].children[0].children[0].children[this.PatternCounter].label,
        type: "person",
        styleClass: 'p-person',
        editFCA: true,
        viewFCA: true,
        FCAData: FCATree1Clone,
        nodePath: path,
        data: { name: "FCA" }
      }



      this.data1Clone[0].children[0].children[0].children[this.PatternCounter].children = []
      this.data1Clone[0].children[0].children[0].children[this.PatternCounter].children.push(
        {
          label: "Pattern",
          type: "person",
          styleClass: 'p-person',
          expanded: true,
          data: {
            name: this.Pattern
          }
        }
      )



      this.data1[0].children[0].children[0].children[this.PatternCounter].children.push(FCATree1)
      if (this.PatternCounter < this.data1[0].children[0].children[0].children.length - 1) {
        this.PatternFMName = this.data1[0].children[0].children[0].children[this.PatternCounter + 1].data.name
      }
      this.PatternCounter = this.PatternCounter + 1
      if (this.PatternCounter == this.data1[0].children[0].children[0].children.length) {
        this.Pattern = ""
        this.SaveFCAEnable = true
      }
      this.FailureModePatternTree = false;
      this.prescriptiveTree = true
    }
    else {
      this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Please Select any Pattern" })

    }

  }


  ADDNextFCA() {
    this.PattenNode1 = ''
    this.PattenNode2 = ''
    this.PattenNode3 = ''
    this.PattenNode4 = ''
    this.PattenNode5 = ''
    this.PattenNode6 = ''
    this.PattenNode7 = ''
    this.PattenNode8 = ''
    this.PattenAnsNode1 = ''
    this.PattenAnsNode2P2 = ''
    this.PattenAnsNode2P1 = ''
    this.PattenAnsNode3P1 = ''
    this.PattenAnsNode3P2 = ''
    this.PattenAnsNode4 = ''
    this.PattenAnsNode5 = ''
    this.PattenAnsNode6P1 = ''
    this.PattenAnsNode6P2 = ''

    this.PattenNode1 = 'p-person'
    this.PattenNode2 = 'p-person'
    this.PattenNode3 = 'p-person'
    this.PattenNode4 = 'p-person'
    this.PattenNode5 = 'p-person'
    this.PattenNode6 = 'p-person'
    this.PattenNode7 = 'p-person'
    this.PattenNode8 = 'p-person'
    this.PattenAnsNode1 = 'p-person'
    this.PattenAnsNode2P2 = 'p-person'
    this.PattenAnsNode2P1 = 'p-person'
    this.PattenAnsNode3P1 = 'p-person'
    this.PattenAnsNode3P2 = 'p-person'
    this.PattenAnsNode4 = 'p-person'
    this.PattenAnsNode5 = 'p-person'
    this.PattenAnsNode6P1 = 'p-person'
    this.PattenAnsNode6P2 = 'p-person'
    this.prescriptiveTree = false
    this.PatternNextOnPrescriptiveTree = false
    this.changeDetectorRef.detectChanges();
    this.PatternPathEnable = false
    this.FailureModePatternTree = true
    this.changeDetectorRef.detectChanges();
    this.GetChartData();

  }

  public SaveFCAEnable: boolean = false
  SaveFCA() {
    var centrifugalPumpOBJ: CentrifugalPumpPrescriptiveModel = new CentrifugalPumpPrescriptiveModel();
    this.data1[0].children[0].children.forEach((res: any) => {
      res.FCA = this.data1Clone
    })
    centrifugalPumpOBJ.CFPPrescriptiveId = this.treeResponseData.CFPPrescriptiveId;
    centrifugalPumpOBJ.FMWithConsequenceTree = JSON.stringify(this.data1)
    centrifugalPumpOBJ.FCAAdded = "1";

    for (let index = 0; index < this.data1[0].children[0].children[0].children.length; index++) {
      let obj = {};
      obj['CPPFMId'] = 0;
      obj['CFPPrescriptiveId'] = 0;
      obj['FunctionMode'] = "";
      obj['LocalEffect'] = "";
      obj['SystemEffect'] = "";
      obj['Consequence'] = "";
      obj['DownTimeFactor'] = 0;
      obj['ScrapeFactor'] = 0
      obj['SafetyFactor'] = 0
      obj['ProtectionFactor'] = 0
      obj['FrequencyFactor'] = 0
      obj['CriticalityFactor'] = 0
      obj['Rating'] = "";
      obj['MaintainenancePractice'] = "";
      obj['FrequencyMaintainenance'] = "";
      obj['ConditionMonitoring'] = "";
      obj['AttachmentDBPath'] = ""
      obj['AttachmentFullPath'] = ""
      obj['Remark'] = ""
      obj['Pattern'] = this.data1Clone[0].children[0].children[0].children[index].children[0].data.name
      centrifugalPumpOBJ.centrifugalPumpPrescriptiveFailureModes.push(obj)
    }

    this.http.put('api/PrescriptiveAPI/PrespectivePattern', centrifugalPumpOBJ).subscribe(
      res => {
        this.messageService.add({ severity: 'Success', summary: 'Success', detail: "Succssfully FCA Added" })
        this.SaveFCAEnable = false
        this.router.navigateByUrl('/Home/Prescriptive/List');
      }, err => console.log(err.error)
    )


  }


  SelectNodeToView(p){
    this.FCAView = []
    this.FCAView.push(p.FCAData)
    this.FCAViewEnabled = true
    this.changeDetectorRef.detectChanges();
    this.GetChartToView(this.FCAView[0].children[0].data.name)
    const element = document.querySelector("#FCATreeShow")
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })

  }


  
  GetChartToView(p : string){
    this.FCAViewEnabled = true
    if (p == 'Pattern 1') {
      const patternLabel1 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
      const patternData1 = [20, 10, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 10, 20];
      this.getChartTree(patternLabel1, patternData1, 'ViewPattern',p);
    } else if (p == 'Pattern 2') {
      const patternLabel2 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
      const patternData2 = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 6, 8, 10, 20];
      this.getChartTree(patternLabel2, patternData2, 'ViewPattern',p);
    } else if (p == 'Pattern 3') {
      const patternLabel3 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
      const patternData3 = [0, 0, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 14, 15, 20];
      this.getChartTree(patternLabel3, patternData3, 'ViewPattern',p);
    } else if (p == 'Pattern 4') {
      const patternLabel4 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
      const patternData4 = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1, 1, 1, 1, 1];
      this.getChartTree(patternLabel4, patternData4,'ViewPattern',p);
    } else if (p == 'Pattern 5') {
      const patternLabel5 = ["20", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "20"];
      const patternData5 = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
      this.getChartTree(patternLabel5, patternData5, 'ViewPattern',p);
    } else if (p == 'Pattern 6') {
      const patternLabel6 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
      const patternData6 = [20, 10, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8];
      this.getChartTree(patternLabel6, patternData6, 'ViewPattern', p);
    }
  }


  CloseFCAView(){
    this.FCAViewEnabled = false
    const element = document.querySelector("#prescriptive")
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })

  }


  
  
  private GetChartData() {
    const patternLabel1 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
    const patternData1 = [20, 10, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 10, 20];
    this.getChartTree(patternLabel1, patternData1, 'pattern1', 'Pattern 1');

    const patternLabel2 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
    const patternData2 = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 6, 8, 10, 20];
    this.getChartTree(patternLabel2, patternData2, 'pattern2', 'Pattern 2');

    const patternLabel3 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
    const patternData3 = [0, 0, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 14, 15, 20];
    this.getChartTree(patternLabel3, patternData3, 'pattern3', 'Pattern 3');

    const patternLabel4 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
    const patternData4 = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1, 1, 1, 1, 1];
    this.getChartTree(patternLabel4, patternData4, 'pattern4', 'Pattern 4');

    const patternLabel5 = ["20", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "20"];
    const patternData5 = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
    this.getChartTree(patternLabel5, patternData5, 'pattern5', 'Pattern 5');

    const patternLabel6 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
    const patternData6 = [20, 10, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8];
    this.getChartTree(patternLabel6, patternData6, 'pattern6', 'Pattern 6');
  }

  private getChartTree(labels: any[], data: any[], id: string, title: string) {
    let patternCharts = new Chart(id, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Time',
          data: data,
          fill: true,
          borderColor: '#2196f3',
          backgroundColor: '#2196f3',
          borderWidth: 1
        }]
      },
      options: {
        elements: {
          point: {
            radius: 0
          }
        },
        title: {
          display: true,
          text: title
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            ticks: {
              beginAtZero: true,
              display: false
            },
            scaleLabel: {
              display: true,
              labelString: 'Time'
            }
          }],
          yAxes: [{
            gridLines: {
              display: true,
              color: 'rgba(219,219,219,0.3)',
              zeroLineColor: 'rgba(219,219,219,0.3)',
              drawBorder: false,
              lineWidth: 27,
              zeroLineWidth: 1
            },
            ticks: {
              beginAtZero: true,
              display: false
            },
            scaleLabel: {
              display: true,
              labelString: 'Failure probability'
            }
          }]
        }
      }
    });
    this.changeDetectorRef.detectChanges();
  }


}


