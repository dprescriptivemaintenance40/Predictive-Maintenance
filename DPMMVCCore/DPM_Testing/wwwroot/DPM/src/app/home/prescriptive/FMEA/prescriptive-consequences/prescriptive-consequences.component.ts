import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';

@Component({
  selector: 'app-prescriptive-consequences',
  templateUrl: './prescriptive-consequences.component.html',
  styleUrls: ['./prescriptive-consequences.component.scss'],
  providers: [MessageService],
})
export class PrescriptiveConsequencesComponent implements OnInit {

  public draggedConsequencesYesNO : any =['YES', 'NO']
   public droppedYesNo = null;
   public dropedConsequenceFailureMode = []

   public droppedYesNo1 = null;
   public dropedConsequenceEffectFailureMode = []
   
   public droppedYesNo2 = null;
   public dropedConsequenceCombinationFailureMode = []
   
   public droppedYesNo3 = null;
   public dropedConsequenceAffectFailureMode = []

   public ConsequenceNode = []
   public Consequences1 : boolean = false;
   public Consequences2 : boolean = false;
   public Consequences3 : boolean = false;
   public Consequences4 : boolean = false;
   public ConsequencesTree : boolean = false;
   public ConsequencesAnswer: any = [];
   private consequenceTreeColorNodeA = 'p-person1'
   private consequenceTreeColorNodeB = 'p-person'
   private consequenceTreeColorNodeC = 'p-person'
   private consequenceTreeColorNodeD = 'p-person'
   private consequenceA = 'p-person';
   private consequenceB = 'p-person' ;
   private consequenceC = 'p-person' ;
   private consequenceD = 'p-person';
   private consequenceE = 'p-person' ;
   private finalConsequence;
   private ConsequencesData;
   
  

  constructor( public messageService: MessageService,
              public formBuilder: FormBuilder,
              public title: Title,
              public commonLoadingDirective: CommonLoadingDirective,
              private router : Router,
              private http : HttpClient) {}

  ngOnInit(){
    this.title.setTitle('DPM | Consequence Update');
    this.ConsequencesData = JSON.parse(localStorage.getItem('PrescriptiveUpdateObject'))

  if(this.ConsequencesData.Consequence != null){
    this.ConsequencesTree = true 
    if(this.ConsequencesData.Consequence == 'B'){
      this.consequenceTreeColorNodeB = 'p-person1'
      this.consequenceB = 'p-person1'
    }else if(this.ConsequencesData.Consequence == 'C' ){
      this.consequenceTreeColorNodeB = 'p-person1'
      this.consequenceTreeColorNodeD = 'p-person1'
      this.consequenceC = 'p-person1'
    }else if(this.ConsequencesData.Consequence == 'D'){
      this.consequenceTreeColorNodeB = 'p-person1'
      this.consequenceTreeColorNodeD = 'p-person1'
      this.consequenceD = 'p-person1'
    }else if(this.ConsequencesData.Consequence == 'E'){
      this.consequenceTreeColorNodeC = 'p-person1'
      this.consequenceE = 'p-person1'
    }else if(this.ConsequencesData.Consequence == 'A'){
      this.consequenceTreeColorNodeC = 'p-person1'
      this.consequenceA = 'p-person1'
    }
    this.ConsequenceTreeGeneration()

    }else {
      this.Consequences1 = true;
      
    }

  }

 
  async ngOnDestroy() {
    await localStorage.removeItem('PrescriptiveUpdateObject');
  }




  dragStartC1(e, con1) {
    this.droppedYesNo = con1;
  }

  dragEndC1(e) {}


  dropC1(e) {
    if (this.droppedYesNo) {
      this.dropedConsequenceFailureMode.push(this.droppedYesNo);
      this.droppedYesNo = null;
    }
  }

  
  dragStartC2(e, con2) {
    this.droppedYesNo1 = con2;
  }

  dragEndC2(e) {}


  dropC2(e) {
    if (this.droppedYesNo1) {
      this.dropedConsequenceEffectFailureMode.push(this.droppedYesNo1);
      this.droppedYesNo1 = null;
    }
  }


  
  dragStartC3(e, con3) {
    this.droppedYesNo2 = con3;
  }

  dragEndC3(e) {}


  dropC3(e) {
    if (this.droppedYesNo2) {
      this.dropedConsequenceCombinationFailureMode.push(this.droppedYesNo2);
      this.droppedYesNo2 = null;
    }
  }

  
  dragStartC4(e, con4) {
    this.droppedYesNo3 = con4;
  }

  dragEndC4(e) {}


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
   


  Consequence1Next(){
   if(this.dropedConsequenceFailureMode.length ==1){
      if(this.dropedConsequenceFailureMode[0] == 'YES'){
        this.ConsequencesAnswer.push(this.dropedConsequenceFailureMode[0])
        console.log( this.ConsequencesAnswer)
        this.Consequences2 = true;
        this.Consequences1 = false;
        this.Consequences3 = false;
        this.Consequences4 = false;
      }else{
        this.ConsequencesAnswer.push(this.dropedConsequenceFailureMode[0])
        console.log( this.ConsequencesAnswer)
        this.Consequences3 = true;
        this.Consequences2 = false;
        this.Consequences1 = false;
        this.Consequences4 = false;
      }
    }else{
    
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Field is Empty, Drag and drop inside field', sticky: true });
    }
    
    
  }
  Consequence2Back(){
    this.Consequences1 = true;
    this.Consequences2 = false;

  }
  Consequence2Next(){
    if(this.dropedConsequenceEffectFailureMode.length ==1){
      if(this.dropedConsequenceEffectFailureMode[0] == 'YES'){
        this.ConsequencesAnswer.push(this.dropedConsequenceEffectFailureMode[0])
        this.consequenceA = 'p-person'
        this.consequenceB = 'p-person1'
        this.consequenceC = 'p-person'
        this.consequenceD = 'p-person'
        this.consequenceE = 'p-person'

        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'B', sticky: true });
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Please click Update to Save changes', sticky: true });
        this.finalConsequence = ""
        this.finalConsequence ="B"
        console.log( this.ConsequencesAnswer)
        this.Consequences3 = false;
        this.Consequences2 = false;
        this.Consequences1 = false;
        this.Consequences4 = false;
        this.ConsequencesTree = true;
        this.colorConsequenceTree()
      }else{
        this.ConsequencesAnswer.push(this.dropedConsequenceEffectFailureMode[0])
        console.log( this.ConsequencesAnswer)
        this.Consequences3 = false;
        this.Consequences2 = false;
        this.Consequences1 = false;
        this.Consequences4 = true;
      }
    }else{
     
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Field is Empty, Drag and drop inside field', sticky: true });
    }

  }
  Consequence3Back(){
    this.Consequences1 = true
    this.Consequences3 = false;
  }
  Consequence3Next(){
    if(this.dropedConsequenceCombinationFailureMode.length ==1){
      if(this.dropedConsequenceCombinationFailureMode[0] == 'YES'){
        this.ConsequencesAnswer.push(this.dropedConsequenceCombinationFailureMode[0])
       
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'A', sticky: true });
        this.finalConsequence = ""
        this.finalConsequence ="A"
        this.consequenceA = 'p-person1'
        this.consequenceB = 'p-person'
        this.consequenceC = 'p-person'
        this.consequenceD = 'p-person'
        this.consequenceE = 'p-person'
        console.log( this.ConsequencesAnswer)
        this.Consequences3 = false;
        this.Consequences2 = false;
        this.Consequences1 = false;
        this.Consequences4 = false;
        this.ConsequencesTree = true;
        this.colorConsequenceTree()
      }else{
        this.ConsequencesAnswer.push(this.dropedConsequenceCombinationFailureMode[0])
      
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'E', sticky: true });
        this.finalConsequence = ""
        this.finalConsequence ="E"
        this.consequenceA = 'p-person'
        this.consequenceB = 'p-person'
        this.consequenceC = 'p-person'
        this.consequenceD = 'p-person'
        this.consequenceE = 'p-person1'
        console.log( this.ConsequencesAnswer)
        this.Consequences3 = false;
        this.Consequences2 = false;
        this.Consequences1 = false;
        this.Consequences4 = false;
        this.ConsequencesTree = true;
        this.colorConsequenceTree()
      }
   }else{
    
     this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Field is Empty, Drag and drop inside field', sticky: true });
   }
    
  }
  Consequence4Back(){
    this.Consequences2 = true
    this.Consequences4 = false;
  }
  Consequence4Next(){
    if(this.dropedConsequenceAffectFailureMode.length ==1){
      if(this.dropedConsequenceAffectFailureMode[0] == 'YES'){
        this.ConsequencesAnswer.push(this.dropedConsequenceAffectFailureMode[0])
       
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'C', sticky: true });
        this.finalConsequence = ""
        this.finalConsequence ="C"
        this.consequenceA = 'p-person'
        this.consequenceB = 'p-person'
        this.consequenceC = 'p-person1'
        this.consequenceD = 'p-person'
        this.consequenceE = 'p-person'
        console.log( this.ConsequencesAnswer)
        this.Consequences3 = false;
        this.Consequences2 = false;
        this.Consequences1 = false;
        this.Consequences4 = false;
        this.ConsequencesTree = true;
        this.colorConsequenceTree()
      }else{
        this.ConsequencesAnswer.push(this.dropedConsequenceAffectFailureMode[0])

        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'D', sticky: true });
        this.finalConsequence = ""
        this.finalConsequence ="D"
        this.consequenceA = 'p-person'
        this.consequenceB = 'p-person'
        this.consequenceC = 'p-person'
        this.consequenceD = 'p-person1'
        this.consequenceE = 'p-person'
        console.log( this.ConsequencesAnswer)
        this.Consequences3 = false;
        this.Consequences2 = false;
        this.Consequences1 = false;
        this.Consequences4 = false;
        this.ConsequencesTree = true;
        this.colorConsequenceTree()
      }
   }else{
     this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Field is Empty, Drag and drop inside field', sticky: true });
   }
    
  }

  ConsequenceTreeBack(){
    this.dropedConsequenceAffectFailureMode = [];
    this.dropedConsequenceCombinationFailureMode = [];
    this.dropedConsequenceFailureMode= [];
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

  colorConsequenceTree(){
  if(this.ConsequencesAnswer[0]== 'YES'){ 
    this.consequenceTreeColorNodeB = 'p-person1'
    }
    else{
       this.consequenceTreeColorNodeC = 'p-person1'}
  if(this.ConsequencesAnswer[0]== 'YES' && this.ConsequencesAnswer[1]== 'NO'){
    this.consequenceTreeColorNodeD = 'p-person1'
  }
  this.ConsequenceTreeGeneration();
  this.ConsequencesAnswer = []

  }


  ConsequenceTreeUpdate(){
    var conse;
    if(this.finalConsequence != null){
        conse = this.finalConsequence
    }else{
       conse = this.ConsequencesData.Consequence
    }
    let Data = {
      PrescriptiveId : this.ConsequencesData.PrescriptiveId,
      UserId : this.ConsequencesData.UserId,
      EquipmentType: this.ConsequencesData.EquipmentType,
      MachineType: this.ConsequencesData.MachineType,
      TagNumber : this.ConsequencesData.TagNumber,
      FunctionFluidType : this.ConsequencesData.FunctionFluidType,
      FunctionRatedHead : this.ConsequencesData.FunctionRatedHead,
      FunctionPeriodType : this.ConsequencesData.FunctionPeriodType,
      FunctionFailure : this.ConsequencesData.FunctionFailure,
      FunctionMode :this.ConsequencesData.FunctionMode,
      LocalEffect : this.ConsequencesData.LocalEffect,
      SystemEffect : this.ConsequencesData.SystemEffect,
      Date : this.ConsequencesData.Date,
      Consequence : conse
    }
    this.http.put('api/PrescriptiveAPI/'+ Data.PrescriptiveId, Data).subscribe(
      res =>{ console.log(res);
       
        
         this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Succesfully Done', sticky: true });
        }, 
      err =>{ console.log(err.Message); alert(err.Nessage)}
    )
    this.router.navigateByUrl('/Home/Dashboard');
  }


  SubmitConsequenceTree(){
    var conse;
    if(this.finalConsequence != null){
        conse = this.finalConsequence
    }else{
       conse = this.ConsequencesData.Consequence
    }
    let Data = {
      PrescriptiveId : this.ConsequencesData.PrescriptiveId,
      UserId : this.ConsequencesData.UserId,
      EquipmentType: this.ConsequencesData.EquipmentType,
      MachineType: this.ConsequencesData.MachineType,
      TagNumber : this.ConsequencesData.TagNumber,
      FunctionFluidType : this.ConsequencesData.FunctionFluidType,
      FunctionRatedHead : this.ConsequencesData.FunctionRatedHead,
      FunctionPeriodType : this.ConsequencesData.FunctionPeriodType,
      FunctionFailure : this.ConsequencesData.FunctionFailure,
      FunctionMode :this.ConsequencesData.FunctionMode,
      LocalEffect : this.ConsequencesData.LocalEffect,
      SystemEffect : this.ConsequencesData.SystemEffect,
      Date : this.ConsequencesData.Date,
      Consequence : conse
    }
    this.http.put('api/PrescriptiveAPI/'+ Data.PrescriptiveId, Data).subscribe(
      res =>{ console.log(res);
       
        
         this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Succesfully Done', sticky: true });
        }, 
      err =>{ console.log(err.Message); alert(err.Nessage)}
    )
    this.router.navigateByUrl('/Home/Dashboard');

  }

 ConsequenceTreeGeneration(){

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



}
