import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, Validators, FormGroup } from '@angular/forms';
import { AddRuleService } from './add-rule.service';

@Component({
  selector: 'app-add-rule',
  templateUrl: './add-rule.component.html',
  styleUrls: ['./add-rule.component.scss']
})
export class AddRuleComponent{

  

  // addRuleObj:AddRulesModel= new AddRulesModel();

  // constructor( private http:HttpClient) { 
  //   this.addRuleObj=new AddRulesModel();
  // }

  // AddRules(){
  //   let addRule={
  //     Columns:this.addRuleObj.columns,
  //     Alarm:this.addRuleObj.alarm,
  //     Trigger:this.addRuleObj.trigger,
  //     Condition:this.addRuleObj.condition
  //   }
  //   this.http.post('https://localhost:44331/api/AddRuleModeAPI', this.addRuleObj).subscribe(
  //     res=>this.Success(res),
  //     res=>this.Error(res)
  // );

  // }
  // Success(res){
  // alert;
  // }
  // Error(res){ 
  //   alert
  // }
  addRuleResponse:any=["Presssure Suction stage 1",
     "Presssure Discharge stage 1",
     "Presssure Suction stage 2",
     "Presssure Discharge stage 2",
     "Temperature Suction stage 1",
     "Temperature Discharge stage 1",
     "Temperature Suction stage 2",
    "Temperature Discharge stage 2"];
  addRuleForms: FormArray = this.fb.array([]);
  notification = null;

  constructor(private fb: FormBuilder,
    private addRulseService: AddRuleService) {
     
     }

  ngOnInit() {

    this.addRulseService.getAddRuleList().subscribe(
      res => {
        // res= this.addRuleResponse;
        if (res == [])
          this.addRuleForm();
        else {
          
          (res as []).forEach((addRuleModel: any) => {
            
            this.addRuleForms.push(this.fb.group({
              addRuleId: [addRuleModel.AddRuleId],
              columns: [addRuleModel.Columns, Validators.required],
              alarm: [addRuleModel.Alarm, Validators.required],
              trigger: [addRuleModel.Trigger, Validators.required],
              condition: [addRuleModel.Condition, Validators.required]
            }));
          });
        }
      }
    );
  }

  Image=false;
  enableImage =true;
  // DisableImage=false;
  CancelImage=false;
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
    link.href = "assets/img/compressor.JPG";
    link.click();
  }

  addRuleForm() {
    this.addRuleForms.push(this.fb.group({
      addRuleId: [0],
      columns: ['', Validators.required],
      alarm: ['', Validators.required],
      trigger: ['', Validators.required],
      condition: ['', Validators.required]
    }));
  }

  recordSubmit(fg: FormGroup) {
    if (fg.value.addRuleId == 0)
      this.addRulseService.postAddRule(fg.value).subscribe(
        (res: any) => {
          fg.patchValue({ addRuleId: res.addRuleId });
          this.showNotification('insert');
        });
    else
      this.addRulseService.putAddRule(fg.value).subscribe(
        (res: any) => {
          this.showNotification('update');
        });
  }

  onDelete(addRuleId, i) {
    if (addRuleId == 0)
      this.addRuleForms.removeAt(i);
    else if (confirm('Are you sure to delete this record ?'))
      this.addRulseService.deleteAddRule(addRuleId).subscribe(
        res => {
          this.addRuleForms.removeAt(i);
          this.showNotification('delete');
        });
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
