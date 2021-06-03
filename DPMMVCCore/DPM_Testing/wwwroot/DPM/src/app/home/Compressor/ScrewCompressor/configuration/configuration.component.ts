import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, Validators, FormGroup } from '@angular/forms';

import { Title } from '@angular/platform-browser';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';
import { SCConstantsAPI } from '../shared/ScrewCompressorAPI.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
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
  public centrifugalpump: boolean = false;
  public comppressor: boolean = false;
  
  public notification = null;
  public Image=false;
  public enableImage =true;  
  public CancelImage=false;

  public MachineType: string = "";
  public EquipmentType: string = "";
  public EquipmentList: any = []
  
  constructor(public fb: FormBuilder,
              private screwCompressorAPIName : SCConstantsAPI,
              private screwCompressorMethod : CommonBLService,
              public title: Title) {
     
     }

  ngOnInit() {
    this.title.setTitle('Screw Configuration | Dynamic Prescriptive Maintenence');
    var url : string = this.screwCompressorAPIName.ADDRuleAPI;
    this.screwCompressorMethod.getWithoutParameters(url).subscribe(
      res => {
        if (res == [])
          this.addRuleForm();
        else { 
          (res as []).forEach((addRuleModel: any) => { 
            this.addRuleForms.push(this.fb.group({
              addRuleId: [addRuleModel.AddRuleId],
              machineType: [addRuleModel.MachineType, Validators.required],
              equipmentType: [addRuleModel.EquipmentType, Validators.required],
              columns: [addRuleModel.Columns, Validators.required],
              alarm: [addRuleModel.Alarm, Validators.required],
              trigger: [addRuleModel.Trigger, Validators.required],
              condition: [addRuleModel.Condition, Validators.required]
            }));
          });
          this.EquipmentTypeSelect = false
          this.EquipmentTypePump = true
        }
      }
    );
  }
  SelectMachineType(fg: FormGroup) {
    if (fg.value.machineType == 'Pump') {
      this.EquipmentTypePump = true;
      this.EquipmentTypeCompressor = false;
      this.EquipmentTypeSelect = false;
    } else {
      this.EquipmentTypePump = false;
      this.EquipmentTypeCompressor = true;
      this.EquipmentTypeSelect = false;
    }
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
      machineType: ['', Validators.required],
      equipmentType: ['', Validators.required],
      columns: ['', Validators.required],
      alarm: ['', Validators.required],
      trigger: ['', Validators.required],
      condition: ['', Validators.required]
    }));
  }

  recordSubmit(fg: FormGroup) {
    if (fg.value.addRuleId == 0){
      var url : string =  this.screwCompressorAPIName.ADDRuleAPI;
      this.screwCompressorMethod.postWithoutHeaders(url, fg.value).subscribe(
        (res: any) => {
          fg.patchValue({ addRuleId: res.addRuleId });
          this.showNotification('insert');
        });
    }else{
      var url : string =  this.screwCompressorAPIName.ADDRuleAPI;
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
      var url :string =  this.screwCompressorAPIName.ADDRuleAPI;
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
      this.EquipmentList = null
      this.EquipmentList = ["Centrifugal Pump"]
    }
    if (this.MachineType == "Compressor") {
      this.EquipmentList = null
      this.EquipmentList = ["Screw Compressor"]
    }
    console.log(this.EquipmentType)
  }
  GeneratePrescription(){
    if (this.MachineType == "Pump" && this.EquipmentList=="Centrifugal Pump" ){
     this.comppressor= true
     this.centrifugalpump= false
    }else if (this.MachineType == "Compressor"&& this.EquipmentList=="Screw Compressor" ){
      this.centrifugalpump= true
      this.comppressor= false
    }
  }
}
