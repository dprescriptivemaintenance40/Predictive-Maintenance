import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
import { Title } from '@angular/platform-browser';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prescriptive-add',
  templateUrl: './prescriptive-add.component.html',
  styleUrls: ['./prescriptive-add.component.scss'],
  providers: [MessageService],
})
export class PrescriptiveAddComponent implements OnInit {
  public MachineType: string = "";
  private activeIndex: number;
  public failureModeDataBind: any;
  public val: any;
  public failureModeData: any = []
  public data1: TreeNode[];
  public data2: TreeNode[];
  public ConsequenceNode: TreeNode[];
  public selectedNode: TreeNode;
  public items: MenuItem[];
  public functionFailuerInput: any = [];
  public failuerModeInput: any = [];
  public failuerModeLocalEffects: any = [];
  public failuerModeSystemEffects: any = [];
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

  private FM1: any;
  private FM2: any;
  private FM3: any;
  private FM4: any;
  private FM5: any;
  private FM6: any;

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

  public draggedConsequencesYesNO: any = ['YES', 'NO']
  public droppedYesNo = null;
  public dropedConsequenceFailureMode = []

  public droppedYesNo1 = null;
  public dropedConsequenceEffectFailureMode = []

  public droppedYesNo2 = null;
  public dropedConsequenceCombinationFailureMode = []

  public droppedYesNo3 = null;
  public dropedConsequenceAffectFailureMode = []

  public Consequences1: boolean = false;
  public Consequences2: boolean = false;
  public Consequences3: boolean = false;
  public Consequences4: boolean = false;
  public ConsequencesTree: boolean = false;
  public ConsequencesAnswer: any = [];


  constructor(private messageService: MessageService,
    public formBuilder: FormBuilder,
    public title: Title,
    public router: Router,
    public commonLoadingDirective: CommonLoadingDirective,
    private http: HttpClient) { }

  ngOnInit() {
    this.title.setTitle('DPM | Prescriptive ');
    //   this.getDropDownLookMasterData();
    setInterval(() => {
      this.dynamicDroppedPopup();
    }, 2000);




    this.items = [{
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



  dynamicDroppedPopup() {
    //faliure droped popup
    if (this.dropedFailure.length > 1) {
      for (let index = 0; index < this.dropedFailure.length - 1; index++) {
        var elementIndex = this.dropedFailure[this.dropedFailure.length];
        this.dropedFailure.splice(elementIndex, 1)

      }

    }
    // failure mode popup
    if (this.dropedMode.length > 1) {
      for (let index = 0; index < this.dropedMode.length - 1; index++) {
        var elementIndex = this.dropedMode[this.dropedMode.length];
        this.dropedMode.splice(elementIndex, 1)

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
      this.EquipmentList = ["Centrifugal Pump", "Pump 2"]
    }
    if (this.MachineType == "Compressor") {
      this.EquipmentList = null
      this.EquipmentList = ["Compressor", "Compressor 2"]
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
          } else {
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
      this.prescriptiveTree = false;
      this.activeIndex = 0;
    } else if (this.EquipmentType.length == 0) {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Equipment Type is missing', sticky: true });

    } else if (this.TagNumber.length == 0) {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'TagNumber is missing', sticky: true });
    }
  }

  FunctionNext() {
    if (this.FunctionFluidType.length > 0 && this.FunctionRatedHead.length > 0 && this.FunctionPeriodType.length > 0) {
      this.prescriptiveFuntion = false;
      this.prescriptiveFunctionFailure = true;
      this.activeIndex = 1;

    } else if (this.FunctionFluidType.length == 0) {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'FluidType is missing', sticky: true });

    } else if (this.FunctionRatedHead.length == 0) {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'RatedHead is missing', sticky: true });

    } else if (this.FunctionPeriodType.length == 0) {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'PeriodType is missing', sticky: true });

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
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Data overloaded on both fields, please select any one option', sticky: true });
    } else if (this.dropedFailure.length == 0 && this.functionFailuerInput.length > 0) {
      this.prescriptiveFunctionFailure = false;
      this.prescriptiveFailureMode = true;
      this.activeIndex = 2;

    } else if (this.dropedFailure.length > 0 && this.functionFailuerInput.length == 0) {
      this.prescriptiveFunctionFailure = false;
      this.prescriptiveFailureMode = true;
      this.activeIndex = 2;

    } else if (this.dropedFailure.length == 0) {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please Add Function failure', sticky: true });
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
    this.FM1 = [
      {
        label: "Local Effect",
        type: "person",
        styleClass: "p-person",
        expanded: true,
        data: {
          name: this.failuerModeLocalEffects
        }
      },
      {
        label: "System Effect",
        type: "person",
        styleClass: "p-person",
        expanded: true,
        data: {
          name: this.failuerModeSystemEffects
        }
      }
    ];
    this.FM2 = [
      {
        label: "Local Effect",
        type: "person",
        styleClass: "p-person",
        expanded: true,
        data: {
          name: this.failuerModeLocalEffects
        }
      },
      {
        label: "System Effect",
        type: "person",
        styleClass: "p-person",
        expanded: true,
        data: {
          name: this.failuerModeSystemEffects,
        }
      }
    ];
    this.FM3 = [
      {
        label: "Local Effect",
        type: "person",
        styleClass: "p-person",
        expanded: true,
        data: {
          name: this.failuerModeLocalEffects,
        }
      },
      {
        label: "System Effect",
        type: "person",
        styleClass: "p-person",
        expanded: true,
        data: {
          name: this.failuerModeSystemEffects,
        }
      }
    ];
    this.FM4 = [
      {
        label: "Local Effect",
        type: "person",
        styleClass: "p-person",
        expanded: true,
        data: {
          name: this.failuerModeLocalEffects
        }
      },
      {
        label: "System Effect",
        type: "person",
        styleClass: "p-person",
        expanded: true,
        data: {
          name: this.failuerModeSystemEffects
        }
      }
    ];
    this.FM5 = [
      {
        label: "Local Effect",
        type: "person",
        styleClass: "p-person",
        expanded: true,
        data: {
          name: this.failuerModeLocalEffects
        }
      },
      {
        label: "System Effect",
        type: "person",
        styleClass: "p-person",
        expanded: true,
        data: {
          name: this.failuerModeSystemEffects
        }
      }
    ];
    this.FM6 = [
      {
        label: "Local Effect",
        type: "person",
        styleClass: "p-person",
        expanded: true,
        data: {
          name: this.failuerModeLocalEffects
        }
      },
      {
        label: "System Effect",
        type: "person",
        styleClass: "p-person",
        expanded: true,
        data: {
          name: this.failuerModeSystemEffects
        }
      }
    ];
    if (this.dropedMode[0].Description == "Bearing damaged") {
      this.FM2 = null;
      this.FM3 = null;
      this.FM4 = null;
      this.FM5 = null;
      this.FM6 = null;
    } else if (this.dropedMode[0].Description == " Flow beyond accepted range at corresponding head, possibly due to high wear ring clerance") {
      this.FM1 = null;
      this.FM3 = null;
      this.FM4 = null;
      this.FM5 = null;
      this.FM6 = null;
    } else if (this.dropedMode[0].Description == "Mech seal leakage") {
      this.FM1 = null;
      this.FM2 = null;
      this.FM4 = null;
      this.FM5 = null;
      this.FM6 = null;
    } else if (this.dropedMode[0].Description == "Coupling failure") {
      this.FM1 = null;
      this.FM2 = null;
      this.FM3 = null;
      this.FM5 = null;
      this.FM6 = null;
    } else if (this.dropedMode[0].Description == "Impeller damage / Shaft damage") {
      this.FM1 = null;
      this.FM2 = null;
      this.FM3 = null;
      this.FM4 = null;
      this.FM6 = null;
    } else {
      this.FM1 = null;
      this.FM2 = null;
      this.FM3 = null;
      this.FM4 = null;
      this.FM5 = null;

    }


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
            children: [
              {
                label: "Failure Mode",
                styleClass: "department-cto",
                expanded: true,
                children: [
                  {
                    label: "1",
                    type: "person",
                    styleClass: "p-person",
                    expanded: true,
                    data: { name: "Bearing damaged" },
                    children: this.FM1
                  },
                  {
                    label: "2",
                    type: "person",
                    styleClass: "p-person",
                    expanded: true,
                    data: {
                      name:
                        "Flow beyond accepted range at corresponding head, possibly due to high wear ring clerance"
                    },
                    children: this.FM2
                  },
                  {
                    label: "3",
                    type: "person",
                    styleClass: "p-person",
                    expanded: true,
                    data: { name: "Mech seal leakage" },
                    children: this.FM3
                  },
                  {
                    label: "4",
                    type: "person",
                    styleClass: "p-person",
                    expanded: true,
                    data: { name: "Coupling failure" },
                    children: this.FM4
                  },
                  {
                    label: "5",
                    type: "person",
                    styleClass: "p-person",
                    expanded: true,
                    data: { name: "Impeller damage / Shaft damage" },
                    children: this.FM5
                  },
                  {
                    label: "6",
                    type: "person",
                    styleClass: "p-person",
                    expanded: true,
                    data: { name: "Other" },
                    children: this.FM6
                  },

                ]
              }
            ]
          }
        ]
      }
    ];

  }


  treeSave() {


    var funFailure, funMode;
    if (this.dropedFailure[0].Description == undefined) {
      funFailure = this.dropedFailure[0]
    } else {
      funFailure = this.dropedFailure[0].Description
    }

    if (this.dropedMode[0].Description == undefined) {
      funMode = this.dropedMode[0]
    } else {
      funMode = this.dropedMode[0].Description
    }
    let PrescriptiveModel = {
      MachineType: this.MachineType,
      EquipmentType: this.EquipmentType,
      TagNumber: this.TagNumber,
      FunctionFluidType: this.FunctionFluidType,
      FunctionRatedHead: this.FunctionRatedHead,
      FunctionPeriodType: this.FunctionPeriodType,
      FunctionFailure: funFailure,
      FunctionMode: funMode,
      LocalEffect: this.failuerModeLocalEffects,
      SystemEffect: this.failuerModeSystemEffects
    }
    this.http.post('api/PrescriptiveAPI', PrescriptiveModel).subscribe(
      res => {
        console.log(res);
        this.treeResponseData = res;
        this.prescriptiveTreeNextEnable = true
        this.prescriptiveTreeUpdateEnable = true;
        this.prescriptiveTreeSubmitEnable = false;
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Please click Next button to add consequence', sticky: true });

      },
      err => { console.log(err.Message) }
    )


  }

  TreeUpdate() {


    var funFailure, funMode
    if (this.dropedFailure.length > 0) {
      funFailure = this.dropedFailure[0].Description
    }

    if (this.functionFailuerInput.length > 0) {
      funFailure = null;
      funFailure = this.functionFailuerInput
    }
    if (this.dropedMode.length > 0) {
      funMode = this.dropedMode[0].Description
    }

    if (this.failuerModeInput.length > 0) {
      funMode = null;
      funMode = this.failuerModeInput
    }
    let PrescriptiveModel = {
      PrescriptiveId: this.treeResponseData.PrescriptiveId,
      UserId: this.treeResponseData.UserId,
      EquipmentType: this.treeResponseData.EquipmentType,
      MachineType: this.treeResponseData.MachineType,
      TagNumber: this.treeResponseData.TagNumber,
      FunctionFluidType: this.FunctionFluidType,
      FunctionRatedHead: this.FunctionRatedHead,
      FunctionPeriodType: this.FunctionPeriodType,
      FunctionFailure: funFailure,
      FunctionMode: funMode,
      LocalEffect: this.failuerModeLocalEffects,
      SystemEffect: this.failuerModeSystemEffects,
      Date: this.treeResponseData.Date,
    }
    this.http.put('api/PrescriptiveAPI/' + PrescriptiveModel.PrescriptiveId, PrescriptiveModel).subscribe()
  }

  FailureEffectNext() {


    if (this.failuerModeLocalEffects.length > 0 && this.failuerModeSystemEffects.length > 0) {

      this.GenrationTree();
      if (this.failuerModeLocalEffects.length > 0 && this.failuerModeSystemEffects.length > 0) {
        this.prescriptiveFailureMode = false;
        this.prescriptiveEffect = false;
        this.prescriptiveTree = true;
        this.activeIndex = 4;
        this.prescriptiveTreeSubmitEnable = true;
      } else if (this.failuerModeLocalEffects.length == 0) {
        this.messageService.add({ severity: 'warn', summary: 'Warn', detail: ' Please type Local Effect', sticky: true });

      } else if (this.failuerModeSystemEffects.length == 0) {
        this.messageService.add({ severity: 'warn', summary: 'Warn', detail: ' Please type System Effect', sticky: true });
      }
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please fill data in all fields', sticky: true });
    }
  }

  FailureModeNext() {
    if (this.dropedMode.length == 1) {
      this.failuerModeInput = []
    }
    if (this.dropedMode.length > 1) {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please enter only one mode', sticky: true });
    } else if (this.failuerModeInput.length > 1 && this.dropedMode.length > 1) {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Data overloaded on both field, please choose any one option', sticky: true });

    } else if (this.dropedMode.length == 0) {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please selct any mode', sticky: true });
    }
    else if (this.dropedMode.length == 1) {
      this.prescriptiveEffect = true
      this.prescriptiveFailureMode = false;
      this.activeIndex = 3
    }
  }
  FailuerEffectBack() {
    this.prescriptiveEffect = false;
    this.prescriptiveFailureMode = true;
    this.activeIndex = 2
  }

  treeBack() {
    this.prescriptiveEffect = true;
    this.prescriptiveTree = false;

  }

  treeNext() {
    this.prescriptiveTree = false;
    this.Consequences1 = true;
    this.activeIndex = 5
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
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Field is Empty, Drag and drop inside field', sticky: true });
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
        // alert("B")
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Consequence B', sticky: true });

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
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Field is Empty, Drag and drop inside field', sticky: true });
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
        // alert("A") 
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Consequence A', sticky: true });

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
        // alert("E")
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Consequence E', sticky: true });

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
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Field is Empty, Drag and drop inside field', sticky: true });
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
        // alert("C")
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Consequence C', sticky: true });

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
        // alert("D")
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Consequence D', sticky: true });

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

      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Field is Empty, Drag and drop inside field', sticky: true });
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
    this.ConsequencesAnswer = []

  }


  UpdateTree() { }


  ConsequenceTreeUpdate() {
    let Data = {
      PrescriptiveId: this.treeResponseData.PrescriptiveId,
      UserId: this.treeResponseData.UserId,
      EquipmentType: this.treeResponseData.EquipmentType,
      MachineType: this.treeResponseData.MachineType,
      TagNumber: this.treeResponseData.TagNumber,
      FunctionFluidType: this.treeResponseData.FunctionFluidType,
      FunctionRatedHead: this.treeResponseData.FunctionRatedHead,
      FunctionPeriodType: this.treeResponseData.FunctionPeriodType,
      FunctionFailure: this.treeResponseData.FunctionFailure,
      FunctionMode: this.treeResponseData.FunctionMode,
      LocalEffect: this.treeResponseData.LocalEffect,
      SystemEffect: this.treeResponseData.SystemEffect,
      Date: this.treeResponseData.Date,
      Consequence: this.finalConsequence
    }
    this.http.put('api/PrescriptiveAPI/' + Data.PrescriptiveId, Data).subscribe(
      res => {
        console.log(res);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Succesfully Done', sticky: true });

      },
      err => { console.log(err.Message); alert(err.Nessage) }
    )
    this.router.navigateByUrl('/Home/Dashboard');
  }



  ConsequenceTreeGeneration() {

    this.messageService.add({ severity: 'info', summary: 'Info', detail: ' To save consequences please click save button', sticky: true });

    this.ConsequenceNode = [
      {
        label: "Concequences",
        type: "person",
        styleClass: this.consequenceTreeColorNodeA,
        expanded: true,
        data: {
          name:
            "Will the occurance of the failuer mode be evidient to operational stuff during normal operation of the plant?"
        },
        children: [
          {
            label: "Yes",
            type: "person",
            styleClass: this.consequenceTreeColorNodeB,
            expanded: true,
            data: {
              name:
                "Does the effect of the failure mode(or the secondary effect resulting from the failuer) have direct adverse effect on operational safety or the environment?"
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
      this.dropedConsequenceAffectFailureMode.push(this.droppedYesNo3);
      this.droppedYesNo3 = null;
    }
  }



  onNodeSelect(event) {
    this.messageService.add({
      severity: "success",
      summary: "Selected data",
      detail: event.node.data.name
    });
  }
}


