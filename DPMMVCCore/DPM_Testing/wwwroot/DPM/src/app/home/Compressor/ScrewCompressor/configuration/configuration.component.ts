import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, Validators, FormGroup } from '@angular/forms';
import { MessageService, TreeNode } from 'primeng/api';
import { Title } from '@angular/platform-browser';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';
import { SCConstantsAPI } from '../shared/ScrewCompressorAPI.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
  providers: [MessageService],
})
export class ConfigurationComponent {
  addRuleResponse:any=["Presssure Suction stage 1",
     "Presssure Discharge stage 1",
     "Presssure Suction stage 2",
     "Presssure Discharge stage 2",
     "Temperature Suction stage 1",
     "Temperature Discharge stage 1",
     "Temperature Suction stage 2",
    "Temperature Discharge stage 2"];
  addRuleForms: FormArray = this.fb.array([]);

  public MachineTypeSelect: any;
  public EquipmentTypeSelect: boolean = true;
  public EquipmentTypeCompressor: boolean = false;
  public EquipmentTypePump: boolean = false;
  public AssetList: boolean = true;
  public configurationrecords: boolean = false;
  public AssetListBack: boolean = false;
  public notification = null;
  public Image=false;
  public enableImage =true;  
  public CancelImage=false;
  public FailureMode : string ="";
  public FailureModeList: any = [];

  public MachineType: string = "";
  public EquipmentType: string = "";
  public EquipmentList: any = []
  
  constructor(public fb: FormBuilder,
              private screwCompressorAPIName : SCConstantsAPI,
              private screwCompressorMethod : CommonBLService,
              public title: Title,
              public router: Router,) {
     
     }

  ngOnInit() {
    this.title.setTitle('Screw Configuration | Dynamic Prescriptive Maintenence');

  }
 
  compressorImage(){
    this.enableImage=false;
    this.CancelImage=true;
    this.Image=true;
  }
  compressorImageCancel(){
    this.enableImage=true;
    this.Image=false;
    this.CancelImage=false;
    
  }

  imgDowd(){
    let link = document.createElement("a");
    link.download = "Compressor Image";
    link.href = "/dist/DPM/assets/img/compressor.JPG";
    link.click();
  }

  addRuleForm() {
    this.addRuleForms.push(this.fb.group({
      addRuleId: [0],
      machineType: [this.MachineType, Validators.required],
      equipmentType: [this.EquipmentType, Validators.required],
      failureModeType: [this.FailureMode, Validators.required],
      columns: ['', Validators.required],
      alarm: ['', Validators.required],
      trigger: ['', Validators.required],
      condition: ['', Validators.required]
    }));
  }

  recordSubmit(fg: FormGroup) {
    if (fg.value.addRuleId == 0){
      var url : string =  this.screwCompressorAPIName.ADDRuleAPIbyID;
      this.screwCompressorMethod.postWithoutHeaders(url, fg.value).subscribe(
        (res: any) => {
          fg.patchValue({ addRuleId: res.addRuleId });
          this.showNotification('insert');
        });
    }else{
      var url : string =  this.screwCompressorAPIName.ADDRuleAPIbyID;
      this.screwCompressorMethod.PutData(url, fg.value).subscribe(
        (res: any) => {
          this.showNotification('update');
        });
    }    
  }

  onDelete(addRuleId, i) {
    if (addRuleId == 0)
      this.addRuleForms.removeAt(i);
    else if (confirm('Are you sure to delete this record ?')){
      var url :string =  this.screwCompressorAPIName.ADDRuleAPIbyID;
      this.screwCompressorMethod.DeleteWithID(url, addRuleId).subscribe(
        res => {
          this.addRuleForms.removeAt(i);
          this.showNotification('delete');
        });
    }    
  }

  showNotification(category) {
    switch (category) {
      case 'insert':
        this.notification = { class: 'text-success', message: 'saved!' };
        break;
      case 'update':
        this.notification = { class: 'text-primary', message: 'updated!' };
        break;
      case 'delete':
        this.notification = { class: 'text-danger', message: 'deleted!' };
        break;

      default:
        break;
    }
    setTimeout(() => {
      this.notification = null;
    }, 3000);
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
    console.log(this.EquipmentType)
  }

  FailureModeSelect(){
    if (this.MachineType == "Pump" && this.EquipmentType=="Centrifugal Pump") {
      this.FailureModeList = []
      this.FailureModeList = [
      {'id': 0, 'value':'FM1', 'name':'Failure Mode1'},
    ]
    }
    if (this.MachineType == "Compressor" && this.EquipmentType == 'Screw Compressor') {
      this.FailureModeList = []
      this.FailureModeList = [
        {'id': 0, 'value':'RotarDamage', 'name':'Rotar Damage'},
        {'id': 1, 'value':'SSRB', 'name':'Second stage rotar breakdown'},
        {'id': 2, 'value':'CoolerFailure', 'name':'Cooler Failure'}
      ]
    }
  }

  BackToConfiglist(){
    this.AssetList= true
    this.configurationrecords= false
    this.AssetListBack= false
    this.MachineType = ""
    this.EquipmentType=""
  }

  GenerateConfiguration(){
    this.addRuleForms = this.fb.array([]);
    var url : string = this.screwCompressorAPIName.ADDRuleAPI;
    const params = new HttpParams()
                .set('machineType',this.MachineType)
                .set('equipmentType',this.EquipmentType)
                .set('failureMode',this.FailureMode)
    this.screwCompressorMethod.getWithParameters(url, params).subscribe(
      res => {
        if (res == [])
          this.addRuleForm();
        else { 
          (res as []).forEach((addRuleModel: any) => { 
            this.addRuleForms.push(this.fb.group({
              addRuleId: [addRuleModel.AddRuleId],
              machineType: [addRuleModel.MachineType, Validators.required],
              equipmentType: [addRuleModel.EquipmentType, Validators.required],
              failureModeType: [addRuleModel.FailureModeType, Validators.required],
              columns: [addRuleModel.Columns, Validators.required],
              alarm: [addRuleModel.Alarm, Validators.required],
              trigger: [addRuleModel.Trigger, Validators.required],
              condition: [addRuleModel.Condition, Validators.required]
            }));
          });
        }
        this.AssetListBack = true;
        this.configurationrecords = true;
      }
    );
  
  }
}
