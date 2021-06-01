import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';
import { CentrifugalPumpConstantAPI } from '../centrifugal-pump.API';

@Component({
  selector: 'app-pump-configuration',
  templateUrl: './pump-configuration.component.html',
  styleUrls: ['./pump-configuration.component.scss']
})
export class PumpConfigurationComponent  {

  addRuleResponse:any=["Presssure Suction stage 1",
     "Presssure Discharge stage 1",
     "Presssure Suction stage 2",
     "Presssure Discharge stage 2",
     "Temperature Suction stage 1",
     "Temperature Discharge stage 1",
     "Temperature Suction stage 2",
    "Temperature Discharge stage 2"];
  addPumpRuleForms: FormArray = this.fb.array([]);
  
  public notification = null;
  constructor(public fb: FormBuilder,
             private CPConfigAPIName: CentrifugalPumpConstantAPI,
             private CPConfigAPIMethod: CommonBLService,
              public title: Title) {
     
     }

  ngOnInit() {
    this.title.setTitle('Centrifugal-pump Configuration| Dynamic Prescriptive Maintenence');
    var url : string = this.CPConfigAPIName.ADDPumpRuleAPI;
    this.CPConfigAPIMethod.getWithoutParameters(url).subscribe(
      res => {
        if (res == [])
          this.addRuleForm();
        else { 
          (res as []).forEach((addPumpRuleModel: any) => { 
            this.addPumpRuleForms.push(this.fb.group({
              addPumpRuleId: [addPumpRuleModel.AddPumpRuleId],
              columns: [addPumpRuleModel.Columns, Validators.required],
              alarm: [addPumpRuleModel.Alarm, Validators.required],
              trigger: [addPumpRuleModel.Trigger, Validators.required],
              condition: [addPumpRuleModel.Condition, Validators.required]
            }));
          });
        }
      }
    );
  }

  addRuleForm() {
    this.addPumpRuleForms.push(this.fb.group({
      addPumpRuleId: [0],
      columns: ['', Validators.required],
      alarm: ['', Validators.required],
      trigger: ['', Validators.required],
      condition: ['', Validators.required]
    }));
  }

  recordSubmit(fg: FormGroup) {
    if (fg.value.AddPumpRuleId == 0){
      var url : string =  this.CPConfigAPIName.ADDPumpRuleAPI;
      this.CPConfigAPIMethod.postWithoutHeaders(url, fg.value).subscribe(
        (res: any) => {
          fg.patchValue({ AddPumpRuleId: res.AddPumpRuleId });
          this.showNotification('insert');
        });
    }else{
      var url : string =  this.CPConfigAPIName.ADDPumpRuleAPI;
      this.CPConfigAPIMethod.PutData(url, fg.value).subscribe(
        (res: any) => {
          this.showNotification('update');
        });
    }    
  }

  onDelete(AddPumpRuleId, i) {
    if (AddPumpRuleId == 0)
      this.addPumpRuleForms.removeAt(i);
    else if (confirm('Are you sure to delete this record ?')){
      var url :string =  this.CPConfigAPIName.ADDPumpRuleAPI;
      this.CPConfigAPIMethod.DeleteWithID(url, AddPumpRuleId).subscribe(
        res => {
          this.addPumpRuleForms.removeAt(i);
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
}
