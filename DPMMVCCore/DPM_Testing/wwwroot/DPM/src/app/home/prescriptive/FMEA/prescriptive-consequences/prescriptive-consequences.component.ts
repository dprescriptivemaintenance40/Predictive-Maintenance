import { HttpClient, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MessageService, TreeNode } from 'primeng/api';
import { Observable } from 'rxjs';
import { CanComponentDeactivate } from 'src/app/auth.guard';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';
import { PrescriptiveContantAPI } from '../../Shared/prescriptive.constant';
import { CentrifugalPumpPrescriptiveModel } from '../prescriptive-add/prescriptive-model';

@Component({
  selector: 'app-prescriptive-consequences',
  templateUrl: './prescriptive-consequences.component.html',
  styleUrls: ['./prescriptive-consequences.component.scss','../../../../../assets/orgchart.scss'],
  providers: [MessageService],
})
export class PrescriptiveConsequencesComponent implements OnInit, CanComponentDeactivate {

  public draggedConsequencesYesNO: any = ['YES', 'NO']
  public droppedYesNo = null;
  public dropedConsequenceFailureMode = []

  public droppedYesNo1 = null;
  public dropedConsequenceEffectFailureMode = []

  public droppedYesNo2 = null;
  public dropedConsequenceCombinationFailureMode = []

  public droppedYesNo3 = null;
  public dropedConsequenceAffectFailureMode = []

  public ConsequenceNode = []
  public Consequences1: boolean = false;
  public Consequences2: boolean = false;
  public Consequences3: boolean = false;
  public Consequences4: boolean = false;
  public ConsequencesTree: boolean = false;
  public prescriptiveTree: boolean = false;
  public ConsequencesAnswer: any = [];
  private consequenceTreeColorNodeA = 'p-person1'
  private consequenceTreeColorNodeB = 'p-person'
  private consequenceTreeColorNodeC = 'p-person'
  private consequenceTreeColorNodeD = 'p-person'
  private consequenceA = 'p-person';
  private consequenceB = 'p-person';
  private consequenceC = 'p-person';
  private consequenceD = 'p-person';
  private consequenceE = 'p-person';
  private finalConsequence;
  private ConsequencesData;
  public StartConsequences : boolean = false;
  public RadioValue : string = ''

  public prescriptiveTreeNextEnable: boolean = false;
  public SaveConcequencesEnable: boolean = false;
  public FMLSConsequenceName: string = ""
  public data1: any;
  public data1Clone: any;
  public selectedNode: TreeNode;
  private FMCount: number = 0;
  private FMTree: any;

  centrifugalPumpPrescriptiveOBJ: CentrifugalPumpPrescriptiveModel = new CentrifugalPumpPrescriptiveModel();

  constructor(public messageService: MessageService,
    public formBuilder: FormBuilder,
    public title: Title,
    public commonLoadingDirective: CommonLoadingDirective,
    private router: Router,
    private http: HttpClient,
    private changeDetectorRef:ChangeDetectorRef,
    private prescriptiveBLService: CommonBLService,
    private prescriptiveContantAPI : PrescriptiveContantAPI) { }

  private isNewEntity: boolean = false;
  CanDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
    if (this.isNewEntity) {
      if (confirm('Are you sure you want to go back. You have have pending changes')) {
        if (this.SaveConcequencesEnable == true) {
          this.SubmitConsequenceTree()
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
    this.title.setTitle('Consequence Update | Dynamic Prescriptive Maintenence');
    this.ConsequencesData = JSON.parse(localStorage.getItem('PrescriptiveUpdateObject'))
    var FailureModeWithLSETree = JSON.parse(this.ConsequencesData.FailureModeWithLSETree)
    this.data1 = FailureModeWithLSETree
    this.data1Clone = this.data1[0].children[0].children[0].FMEA
    this.prescriptiveTreeNextEnable = true
    this.prescriptiveTree = true
    this.FMTree = this.data1[0].children[0].children[0].children

  }
  async ngOnDestroy() {
    await localStorage.removeItem('PrescriptiveUpdateObject');
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

  async treeNext() {
    this.prescriptiveTree = false;
    this.StartConsequences = true;
    this.Consequences1 = true;
    this.FMLSConsequenceName = this.FMTree[this.FMCount].data.name
    this.changeDetectorRef.detectChanges();
    const element = document.querySelector("#ScrollUpdateTree2")
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  async ADDConsequence() {
    var CNode = {
      label: "Consequence",
      type: "person",
      styleClass: "p-person",
      expanded: true,
      data: {
        name: this.finalConsequence
      }
    }
    this.FMTree[this.FMCount].children[0].children.push(CNode)
    this.data1Clone[0].children[0].children[0].children[this.FMCount].children.push(
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
    this.FMCount += 1;
    if (this.FMCount <= this.FMTree.length - 1) {
      this.FMLSConsequenceName = this.FMTree[this.FMCount].data.name
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Add Next Consequences, So click on +Consequence button' });
    }else{
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Save Consequence' });
    }
    if (this.FMCount == this.FMTree.length) {
      this.prescriptiveTreeNextEnable = false;
      this.SaveConcequencesEnable = true;
      this.isNewEntity = true;
    }
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

    const element = document.querySelector("#BackToNext")
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  onNodeSelect(event) {
    this.messageService.add({
      severity: "success",
      summary: "Selected data",
      detail: event.node.data.name
    });
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
        this.RadioValue = ""
      } else {
        this.ConsequencesAnswer.push(this.dropedConsequenceFailureMode[0])
        console.log(this.ConsequencesAnswer)
        this.Consequences3 = true;
        this.Consequences2 = false;
        this.Consequences1 = false;
        this.Consequences4 = false;
        this.RadioValue = ""
      }
    } else {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Field is Empty, please select any one' });
    }


  }
  Consequence2Back() {
    this.Consequences1 = true;
    this.Consequences2 = false;
    this.RadioValue = ""

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
        this.finalConsequence = "B (Failure Mode:Evident, Failure Mode with Condition : Direct only, Failure Mode Consequences : Safety and/or environmental hazard)"
        console.log(this.ConsequencesAnswer)
        this.Consequences3 = false;
        this.Consequences2 = false;
        this.Consequences1 = false;
        this.Consequences4 = false;
        this.StartConsequences = false;
        this.ConsequencesTree = true;
        this.RadioValue = ""
        this.colorConsequenceTree()
      } else {
        this.ConsequencesAnswer.push(this.dropedConsequenceEffectFailureMode[0])
        console.log(this.ConsequencesAnswer)
        this.Consequences3 = false;
        this.Consequences2 = false;
        this.Consequences1 = false;
        this.Consequences4 = true;
        this.RadioValue = ""
      }
    } else {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Field is Empty, please select any one' });
    }

  }
  Consequence3Back() {
    this.Consequences1 = true
    this.Consequences3 = false;
    this.RadioValue = ""
  }
  Consequence3Next() {
    if (this.dropedConsequenceCombinationFailureMode.length == 1) {
      if (this.dropedConsequenceCombinationFailureMode[0] == 'YES') {
        this.ConsequencesAnswer.push(this.dropedConsequenceCombinationFailureMode[0])
        this.finalConsequence = ""
        this.finalConsequence = "A (Failure Mode:Hidden, Failure Mode with Condition : Combined with one or other failure mode events, Failure Mode Consequences : Safety and/or environmental hazard)"
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
        this.StartConsequences = false;
        this.ConsequencesTree = true;
        this.RadioValue = ""
        this.colorConsequenceTree()
      } else {
        this.ConsequencesAnswer.push(this.dropedConsequenceCombinationFailureMode[0])
        this.finalConsequence = ""
        this.finalConsequence = "E (Failure Mode:Hidden, Failure Mode with Condition : Combined with one or other failure mode events, Failure Mode Consequences : No effect on safety or environment)"
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
        this.StartConsequences = false;
        this.ConsequencesTree = true;
        this.RadioValue = ""
        this.colorConsequenceTree()
      }
    } else {

      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Field is Empty, please select any one' });
    }

  }

  Consequence4Next() {
    if (this.dropedConsequenceAffectFailureMode.length == 1) {
      if (this.dropedConsequenceAffectFailureMode[0] == 'YES') {
        this.ConsequencesAnswer.push(this.dropedConsequenceAffectFailureMode[0])
        this.finalConsequence = ""
        this.finalConsequence = "C (Failure Mode:Evident, Failure Mode with Condition : Direct only, Failure Mode Consequences : Operational capability adversly affected but no effect on safety or environment)"
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
        this.StartConsequences = false;
        this.ConsequencesTree = true;
        this.RadioValue = ""
        this.colorConsequenceTree()
      } else {
        this.ConsequencesAnswer.push(this.dropedConsequenceAffectFailureMode[0])
        this.finalConsequence = ""
        this.finalConsequence = "D (Failure Mode:Evident, Failure Mode with Condition : Direct only, Failure Mode Consequences : No effect on safety or environment operation)"
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
        this.StartConsequences = false;
        this.ConsequencesTree = true;
        this.RadioValue = ""
        this.colorConsequenceTree()
      }
    } else {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Field is Empty, please select any one' });
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
    this.RadioValue = "";
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

  ConsequenceTreeGeneration() {
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

  SubmitConsequenceTree() {
    this.isNewEntity = false;
    var temp: string = JSON.stringify(this.data1Clone)
    var temp2 = JSON.parse(temp)
    this.data1[0].children[0].children.forEach((res : any) =>{
      res.Consequence = temp2
    })
    this.centrifugalPumpPrescriptiveOBJ.centrifugalPumpPrescriptiveFailureModes = []
    this.centrifugalPumpPrescriptiveOBJ.CFPPrescriptiveId = this.ConsequencesData.CFPPrescriptiveId;
    this.centrifugalPumpPrescriptiveOBJ.FMWithConsequenceTree = JSON.stringify(this.data1);
    for (let index = 0; index < this.FMTree.length; index++) {
      let obj = {};
      obj['CPPFMId'] = this.ConsequencesData.centrifugalPumpPrescriptiveFailureModes[index].CPPFMId;
      obj['CFPPrescriptiveId'] = this.ConsequencesData.centrifugalPumpPrescriptiveFailureModes[index].CFPPrescriptiveId;
      obj['FunctionMode'] = this.FMTree[index].data.name;
      obj['LocalEffect'] =  this.FMTree[index].children[0].children[0].data.name;;
      obj['SystemEffect'] = this.FMTree[index].children[0].children[1].data.name;
      obj['Consequence'] =  this.FMTree[index].children[0].children[2].data.name;
      obj['DownTimeFactor'] = this.ConsequencesData.centrifugalPumpPrescriptiveFailureModes[index].DownTimeFactor;
      obj['ScrapeFactor'] =   this.ConsequencesData.centrifugalPumpPrescriptiveFailureModes[index].ScrapeFactor;
      obj['SafetyFactor'] =   this.ConsequencesData.centrifugalPumpPrescriptiveFailureModes[index].SafetyFactor;
      obj['ProtectionFactor'] = this.ConsequencesData.centrifugalPumpPrescriptiveFailureModes[index].ProtectionFactor;
      obj['FrequencyFactor'] =  this.ConsequencesData.centrifugalPumpPrescriptiveFailureModes[index].FrequencyFactor;
      obj['CriticalityFactor'] =this.ConsequencesData.centrifugalPumpPrescriptiveFailureModes[index].CriticalityFactor;
      obj['Rating'] = this.ConsequencesData.centrifugalPumpPrescriptiveFailureModes[index].Rating;
      obj['MaintainenancePractice'] =  this.ConsequencesData.centrifugalPumpPrescriptiveFailureModes[index].MaintainenancePractice;
      obj['FrequencyMaintainenance'] = this.ConsequencesData.centrifugalPumpPrescriptiveFailureModes[index].FrequencyMaintainenance;
      obj['ConditionMonitoring'] = this.ConsequencesData.centrifugalPumpPrescriptiveFailureModes[index].ConditionMonitoring;
      obj['AttachmentDBPath'] =    this.ConsequencesData.centrifugalPumpPrescriptiveFailureModes[index].AttachmentDBPath
      obj['AttachmentFullPath'] =  this.ConsequencesData.centrifugalPumpPrescriptiveFailureModes[index].AttachmentFullPath
      obj['Remark'] = this.ConsequencesData.centrifugalPumpPrescriptiveFailureModes[index].Remark
      this.centrifugalPumpPrescriptiveOBJ.centrifugalPumpPrescriptiveFailureModes.push(obj)

    }
    var url : string =  this.prescriptiveContantAPI.FMEASaveConsequence
    this.prescriptiveBLService.PutData(url,this.centrifugalPumpPrescriptiveOBJ ).subscribe(
      res => {
        console.log(res);
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Successfully Done' });
        this.router.navigateByUrl('/Home/Prescriptive/List');
      }, err => { console.log(err.err) }
    )
  }

  ConsequenceSelected(a){
    if(this.Consequences1 === true){
      this.dropedConsequenceFailureMode = []
      this.dropedConsequenceFailureMode.push(a)
    }else if(this.Consequences2 === true){
      this.dropedConsequenceEffectFailureMode = []
      this.dropedConsequenceEffectFailureMode.push(a)
    }else if(this.Consequences3 === true){
      this.dropedConsequenceCombinationFailureMode = []
      this.dropedConsequenceCombinationFailureMode.push(a)
    }else if(this.Consequences4 === true){
      this.dropedConsequenceAffectFailureMode = []
      this.dropedConsequenceAffectFailureMode.push(a)
    }

  }

}
