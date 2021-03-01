import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import {TreeNode} from 'primeng/api';
import {MessageService} from 'primeng/api';
import {MenuItem} from 'primeng/api';
import { Title } from '@angular/platform-browser';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';
import { Router } from '@angular/router';



@Component({
  selector: 'app-prescriptive-update',
  templateUrl: './prescriptive-update.component.html',
  styleUrls: ['./prescriptive-update.component.scss'],
  providers: [MessageService]
})
export class PrescriptiveUpdateComponent implements OnInit {

  private activeIndex: number;
  public failureModeDataBind : any;
  public val : any;
  public failureModeData : any = []
  public data1: TreeNode[];
  public data2: TreeNode[];
  public selectedNode: TreeNode;
  public items: MenuItem[];
  public functionFailuerInput : any = [];
  public failuerModeInput  : any = [];
  public failuerModeLocalEffects : any = []; 
  public failuerModeSystemEffects : any = []; 
  public prescriptiveTreeSubmitEnable : boolean = false;
  public prescriptiveSelect : boolean = true;
  public prescriptiveFuntion : boolean = false;
  public prescriptiveFunctionFailure : boolean = false;
  public prescriptiveFailureMode : boolean = false;
  public prescriptiveSteps : boolean = false;
  public prescriptiveTree : boolean = false;
  public prescriptiveEffect : boolean = false;
  public effectFooter : boolean = true;
  public EquipmentType : string = "";
  public TagNumber  : string = "";
  public dropDownData: any = [];

  public FunctionFluidType : string = "";
  public FunctionRatedHead : string = "";
  public FunctionPeriodType : string = "";
  
  private functionFailureData : any = [];
  private functionModeData : any = [];

  private FM1: any;
  private FM2: any;
  private FM3: any;
  private FM4: any;
  private FM5: any;
  private FM6: any;

  public functionfailure : any =[];
  public failuerMode : any = [];
  
  public dropedFailure = [];
  public dropedMode = [];

  public dragedColor = null;
  public dragedFunctionMode = null;
  public dragedFunctionfailure = null;
  public treeData :any =[];
  public prescriptiveTreeUpdateEnable : boolean = false;
 

  constructor(private messageService: MessageService,
             public formBuilder: FormBuilder,
             public title: Title,
             public commonLoadingDirective: CommonLoadingDirective,
             private router : Router,
             private http : HttpClient) {}

  ngOnInit() {
    this.title.setTitle('DPM | Prescriptive ');
    this.commonLoadingDirective.showLoading(true, "Please wait....");
    this.treeData = JSON.parse(localStorage.getItem('PrescriptiveUpdateObject'))
    setInterval(() => { 
          if(this.prescriptiveTreeUpdateEnable == true){
            this.prescriptiveTreeSubmitEnable = false;
          }
          this.dynamicDroppedPopup();
        }, 4000);
      
        if(this.treeData != null){
          this.commonLoadingDirective.showLoading(true, "Please wait until tree chart get ready....");
          this.failuerModeLocalEffects = this.treeData.LocalEffect
          this.failuerModeSystemEffects = this.treeData.SystemEffect
          this.dropedMode[0] =  { Description:this.treeData.FunctionMode }
          this.dropedFailure[0] =  { Description:this.treeData.FunctionFailure }

          this.FunctionFluidType = this.treeData.FunctionFluidType;
          this.FunctionRatedHead = this.treeData.FunctionRatedHead;
          this.FunctionPeriodType  = this.treeData.FunctionPeriodType;
          this.getDropDownLookMasterData();
       
           this.prescriptiveTree = true
           this.prescriptiveSelect = false
           this.effectFooter = false
          this.GenrationTree();
          this.prescriptiveTreeUpdateEnable = true;
          this.commonLoadingDirective.showLoading(false, "");
        }
      
    this.commonLoadingDirective.showLoading(false, "");



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
    label: 'Consequence',
    command: (event: any) => {
        this.activeIndex = 5;
       
    }
 }

    ];   
  }


  async ngOnDestroy() {
    await localStorage.removeItem('PrescriptiveUpdateObject');
  }


  onNodeSelect(event) {
    this.messageService.add({
      severity: "success",
      summary: "Selected data",
      detail: event.node.data.name
    });
  }


  dynamicDroppedPopup(){
    //faliure droped popup
   if(this.dropedFailure.length > 1){
    for (let index = 0; index < this.dropedFailure.length-1; index++) {
      var elementIndex = this.dropedFailure[this.dropedFailure.length];
      this.dropedFailure.splice(elementIndex, 1)
        
      }
  
   }
  // failure mode popup
  if(this.dropedMode.length > 1){
    for (let index = 0; index < this.dropedMode.length-1; index++) {
      var elementIndex = this.dropedMode[this.dropedMode.length];
      this.dropedMode.splice(elementIndex, 1)
        
      }
  
   }
    
  }


getDropDownLookMasterData(){
  const params = new HttpParams()
  .set('MachineType', "Pump")
  .set('EquipmentType', this.treeData.EquipmentType) 

  this.http.get('api/PrescriptiveLookupMasterAPI/GetRecords', {params}).subscribe(
    res => {
      console.log(res)
      this.dropDownData = res;

      this.dropDownData.forEach(element => {
        if(element.Function == "Function Failure"){
          this.functionFailureData.push(element)
        }else{
          this.functionModeData.push(element)
        }

      });
      console.log(this.functionFailureData)
      console.log(this.functionModeData)
      
      this.functionfailure= this.functionFailureData;
      this.failuerMode = this.functionModeData;
    })



}



  FunctionNext(){
    if(this.FunctionFluidType.length > 0 && this.FunctionRatedHead.length > 0 && this.FunctionPeriodType.length > 0){
      this.prescriptiveFuntion = false;
      this.prescriptiveFunctionFailure = true;
      this.activeIndex = 1;

    }else if(this.FunctionFluidType.length == 0){
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'FluidType is missing', sticky: true });
     
    }else if(this.FunctionRatedHead.length == 0){
    
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'RatedHead is missing', sticky: true });
    
    }else if(this.FunctionPeriodType.length == 0){
     
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'PeriodType is missing', sticky: true });
     
  }
  }
 
  FunctionFailuerInput(){
   for (var i = 0; i < this.dropedFailure.length ; i++ ){
     this.dropedFailure.pop();
   }
   this.dropedFailure.push(this.functionFailuerInput);
  }
  FunctionFailureBack(){
    this.prescriptiveFuntion = true;
    this.prescriptiveFunctionFailure = false;
    this.activeIndex = 0;
  }
  FunctionFailureNext(){
    if(this.dropedFailure.length > 1 && this.functionFailuerInput.length > 1){
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Data overloaded on both fields, please select any one option', sticky: true });
    } else if(this.dropedFailure.length == 0 && this.functionFailuerInput.length > 0 ){
    this.prescriptiveFunctionFailure = false;
    this.prescriptiveFailureMode = true;
    this.activeIndex = 2;

    }else if(this.dropedFailure.length > 0 && this.functionFailuerInput.length == 0){
    this.prescriptiveFunctionFailure = false;
    this.prescriptiveFailureMode = true;
    this.activeIndex = 2;

    }   else if(this.dropedFailure.length == 0 ){
    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Please Add Function failure', sticky: true });
    }
    }

  FailuerModeInput($event){
    for (var i = 0; i < this.dropedMode.length ; i++ ){
      this.dropedMode.pop();
    }
    this.dropedMode.push(this.failuerModeInput);

  }

  FailureModeBack(){
    this.prescriptiveFunctionFailure = true;
    this.prescriptiveFailureMode = false;
    this.activeIndex = 1;
  }


GenrationTree(){
  this.FM1= [
    {
      label: "Local Effect",
      type: "person",
      styleClass: "p-person",
      expanded: true,
      data: {
        name:this.failuerModeLocalEffects
      }
    },
    {
      label: "System Effect",
      type: "person",
      styleClass: "p-person",
      expanded: true,
      data: {
        name:this.failuerModeSystemEffects
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
        name:this.failuerModeLocalEffects
      }
    },
    {
      label: "System Effect",
      type: "person",
      styleClass: "p-person",
      expanded: true,
      data: {
        name:this.failuerModeSystemEffects,
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
   if(this.dropedMode[0].Description == "Bearing damaged"){
   this.FM2 = null;
   this.FM3 = null;
   this.FM4 = null;
   this.FM5 = null;
   this.FM6 = null;
 } else if(this.dropedMode[0].Description == " Flow beyond accepted range at corresponding head, possibly due to high wear ring clerance"){
   this.FM1 = null;
   this.FM3 = null;
   this.FM4 = null;
   this.FM5 = null;
   this.FM6 = null;
 }else if(this.dropedMode[0].Description == "Mech seal leakage"){
   this.FM1 = null;
   this.FM2 = null;
   this.FM4 = null;
   this.FM5 = null;
   this.FM6 = null;
 }else if(this.dropedMode[0].Description == "Coupling failure"){
   this.FM1 = null;
   this.FM2 = null;
   this.FM3 = null;
   this.FM5 = null;
   this.FM6 = null;
 }else if(this.dropedMode[0].Description == "Impeller damage / Shaft damage"){
   this.FM1 = null;
   this.FM2 = null;
   this.FM3 = null;
   this.FM4 = null;
   this.FM6 = null;
 }else{
  this.FM1 = null;
  this.FM2 = null;
  this.FM3 = null;
  this.FM4 = null;
  this.FM5 = null;

 }

 this.data1 = [
   {
     label: "Function",
     type: "person",
     styleClass: "p-person",
     expanded: true,
     data: { name: "Fluid Type : " + this.treeData.FunctionFluidType + ", "+"Rated Head : "+ this.treeData.FunctionRatedHead+" m "+ ", "+"Duration Of : "+ this.treeData.FunctionPeriodType+ " days" },
     children: [
       {
         label: "Function Failure",
         type: "person",
         styleClass: "p-person",
         expanded: true,
         data: { name: this.treeData.FunctionFailure },
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


TreeUpdate(){
  
  var funFailure , funMode
  if(this.dropedFailure.length > 0){
     funFailure =this.dropedFailure[0].Description
   }

   if(this.functionFailuerInput.length > 0){
    funFailure = null;
    funFailure =this.functionFailuerInput
  }
  if(this.dropedMode.length > 0){
    funMode =this.dropedMode[0].Description
  }

  if(this.failuerModeInput.length > 0){
    funMode = null;
    funMode =this.failuerModeInput
 };
  let PrescriptiveModel = {
    PrescriptiveId : this.treeData[0].PrescriptiveId,
    UserId : this.treeData.UserId,
    MachineType : this.treeData.MachineType,
    EquipmentType: this.treeData.EquipmentType,
    TagNumber : this.TagNumber,
    FunctionFluidType : this.FunctionFluidType,
    FunctionRatedHead : this.FunctionRatedHead,
    FunctionPeriodType : this.FunctionPeriodType,
    FunctionFailure : funFailure,
    FunctionMode :funMode,
    LocalEffect : this.failuerModeLocalEffects,
    SystemEffect : this.failuerModeSystemEffects,
    Date : this.treeData.Date
  }
  this.http.put('api/PrescriptiveAPI/' + PrescriptiveModel.PrescriptiveId, PrescriptiveModel).subscribe(
    res =>{
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Updated Sucessfully', sticky: true });
      
    }
  )
  this.router.navigateByUrl('/Home/Dashboard');
}

FailureEffectNext(){
  

if (this.failuerModeLocalEffects.length > 0 && this.failuerModeSystemEffects.length > 0){ 

this.GenrationTree();
if(this.failuerModeLocalEffects.length > 0 && this.failuerModeSystemEffects.length > 0){
 this.prescriptiveFailureMode = false;
 this.prescriptiveEffect = false;
 this.prescriptiveTree = true;
 this.activeIndex = 4;
 this.prescriptiveTreeSubmitEnable = true;
}else if(this.failuerModeLocalEffects.length == 0){
  this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Please type Local Effect', sticky: true });

  
}else if(this.failuerModeSystemEffects.length == 0){
  this.messageService.add({  severity: 'info', summary: 'Info', detail: 'Please type System Effect', sticky: true });
}
  }else {
    this.messageService.add({  severity: 'info', summary: 'Info', detail: 'Please fill data in all fieldsg', sticky: true });
  }
}

  FailureModeNext(){
    if (this.dropedMode.length > 1){ 
      this.messageService.add({  severity: 'info', summary: 'Info', detail: 'Please enter only one mode', sticky: true });  
   } else if(this.failuerModeInput.length > 1 && this.dropedMode.length > 1){
     
       this.messageService.add({  severity: 'info', summary: 'Info', detail: 'Data overloaded on both field, please choose any one option', sticky: true });

   }else if(this.dropedMode.length  == 0  ){
     this.messageService.add({  severity: 'info', summary: 'Info', detail: 'Please selct any mode', sticky: true });
   }
  else {
    this.prescriptiveEffect = true
    this.prescriptiveFailureMode = false; 
    this.activeIndex = 3
  }
  }
  FailuerEffectBack(){
    this.prescriptiveEffect = false;
    this.prescriptiveFailureMode = true;
    this.activeIndex = 2
  }
 
  treeBack(){
    this.prescriptiveEffect = true;
    this.prescriptiveTree = false;
    
      
  }
  UpdateTree(){}
  dragStart(e, f ) {
    
    this.dragedFunctionfailure = f;
    
  }
  dragStart1(e, c) {
    this.dragedFunctionMode = c;
  }
 
   dragEnd(e) {}
   dragEnd1(e) {}
   
  
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
  

}

