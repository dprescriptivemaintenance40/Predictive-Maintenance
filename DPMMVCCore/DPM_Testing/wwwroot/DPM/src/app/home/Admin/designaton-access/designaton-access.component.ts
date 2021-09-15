import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';
import { DesignationModel } from '../../models/designation-access.model';
import { AdminConstantAPIs } from '../admin.constantAPI';

@Component({
  selector: 'app-designaton-access',
  templateUrl: './designaton-access.component.html',
  styleUrls: ['./designaton-access.component.scss'],
  providers: [MessageService],
})
export class DesignatonAccessComponent implements OnInit {

  public designationObj = new DesignationModel();
  public designationObjList:Array<DesignationModel> = new Array<DesignationModel>();
  public designationForm: FormGroup = null;
  public notification: any;
  public UserDetails: any;
  constructor(private APIName : AdminConstantAPIs,
    private messageService: MessageService,
    public fb: FormBuilder,
    private commonBLService : CommonBLService) { }

  ngOnInit(): void {
    this.InitDesignationForm();
    this.UserDetails = JSON.parse(localStorage.getItem('userObject'));
    this.getDesignationRecords();
  }

  InitDesignationForm() {
    this.designationForm = this.fb.group({
      DAId : [0],
      DesignationName : ['', Validators.required],
      Dashborad : [false],
      TrainConfiguration: [false],
      ScrewTrain : [false],
      ScrewPrediction : [false],
      FMEA : [false],
      RCM : [false],
      RCMConfiguration : [false],
      RCA : [false],
      CBA : [false],
      AssesmentReport : [false],
      SkillLibrary : [false],
      UPD : [false],
      CCL : [false],
      RecycleBin : [false],
    })
  }

  AddDesignation() {
    var checkedIsValid = true;
    if (!this.designationForm.valid) {
      for (var a in this.designationForm.controls) {
        this.designationForm.controls[a].markAsDirty();
        this.designationForm.controls[a].updateValueAndValidity();
        checkedIsValid = false;
      }
    }
    if (!checkedIsValid) {
      this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'Please fill all required fields' })
    }
    if (checkedIsValid) {
      this.designationObj.DAId = this.designationForm.value.DAId;
      this.designationObj.CompanyUserId = this.UserDetails.UserId;
      this.designationObj.DesignationName = this.designationForm.value.DesignationName.trim();
      this.designationObj.Dashborad = this.designationForm.value.Dashborad === true ? 1 : 0 ;
      this.designationObj.TrainConfiguration = this.designationForm.value.TrainConfiguration === true ? 1 : 0 ;
      this.designationObj.ScrewTrain = this.designationForm.value.ScrewTrain === true ? 1 : 0 ;
      this.designationObj.ScrewPrediction = this.designationForm.value.ScrewPrediction === true ? 1 : 0 ;
      this.designationObj.FMEA = this.designationForm.value.FMEA === true ? 1 : 0 ;
      this.designationObj.RCM = this.designationForm.value.RCM === true ? 1 : 0 ;
      this.designationObj.RCMConfiguration = this.designationForm.value.RCMConfiguration === true ? 1 : 0 ;
      this.designationObj.RCA = this.designationForm.value.RCA === true ? 1 : 0 ;
      this.designationObj.CBA = this.designationForm.value.CBA === true ? 1 : 0 ;
      this.designationObj.AssesmentReport = this.designationForm.value.AssesmentReport === true ? 1 : 0 ;
      this.designationObj.SkillLibrary = this.designationForm.value.SkillLibrary === true ? 1 : 0 ;
      this.designationObj.UPD = this.designationForm.value.UPD === true ? 1 : 0 ;
      this.designationObj.CCL = this.designationForm.value.CCL === true ? 1 : 0 ;
      this.designationObj.RecycleBin = this.designationForm.value.RecycleBin === true ? 1 : 0 ;
      if(this.designationObj.DAId === 0){
        this.commonBLService.postWithoutHeaders(this.APIName.DesignationAccessAPI, this.designationObj)
        .subscribe((res: any) => {
          if (res.message !== undefined) {
            this.messageService.add({ severity: 'warn', summary: 'warn', detail: res.message });
   
          } else {
            this.designationForm.reset();
            this.designationObj = new DesignationModel();
            this.InitDesignationForm();
            this.messageService.add({ severity: 'success', summary: 'success', detail:'Designation Added' });
          }
          this.getDesignationRecords();

        }, (err: any) => {
          this.messageService.add({ severity: 'warn', summary: 'warn', detail: err.error })
        })
      }
      if(this.designationObj.DAId > 0){ 
          this.commonBLService.PutData(this.APIName.DesignationAccessAPI,this.designationObj)
          .subscribe(
            (res:any)=>{
              this.designationForm.reset();
              this.designationObj = new DesignationModel();
              this.InitDesignationForm();
              this.messageService.add({ severity: 'success', summary: 'success', detail:'Designation Updated' })
              this.getDesignationRecords();
            }, err =>{console.log(err.error)}
          )
      }
      
    }
  }

  onCancel(){
    this.designationForm.reset();
    this.designationObj = new DesignationModel();
    this.InitDesignationForm();
  }

  getDesignationRecords(){
    const params = new HttpParams()
          .set('UserId', this.UserDetails.UserId)
    this.commonBLService.getWithParameters(this.APIName.GetAllDesignation, params)
    .subscribe(
      (res: any) =>{
          this.designationObjList = res;
      },err => {
        console.log(err.error)
      }
    )
  }

  onEdit(r){
    this.designationForm.reset();
    this.designationObj = new DesignationModel();
    this.designationObj = r;
    this.designationForm.get('DAId').setValue(r.DAId);
    this.designationForm.get('DesignationName').setValue(r.DesignationName);
    this.designationForm.get('Dashborad').setValue(r.Dashborad === 1 ? true : false);
    this.designationForm.get('TrainConfiguration').setValue(r.TrainConfiguration === 1 ? true : false);
    this.designationForm.get('ScrewTrain').setValue(r.ScrewTrain === 1 ? true : false);
    this.designationForm.get('ScrewPrediction').setValue(r.ScrewPrediction === 1 ? true : false);
    this.designationForm.get('FMEA').setValue(r.FMEA === 1 ? true : false);
    this.designationForm.get('RCM').setValue(r.RCM === 1 ? true : false);
    this.designationForm.get('RCMConfiguration').setValue(r.RCMConfiguration === 1 ? true : false);
    this.designationForm.get('RCA').setValue(r.RCA === 1 ? true : false);
    this.designationForm.get('CBA').setValue(r.CBA === 1 ? true : false);
    this.designationForm.get('AssesmentReport').setValue(r.AssesmentReport === 1 ? true : false);
    this.designationForm.get('SkillLibrary').setValue(r.SkillLibrary === 1 ? true : false);
    this.designationForm.get('UPD').setValue(r.UPD === 1 ? true : false);
    this.designationForm.get('CCL').setValue(r.CCL === 1 ? true : false);
    this.designationForm.get('RecycleBin').setValue(r.RecycleBin === 1 ? true : false);
  }

  onDelete(r) {
      this.commonBLService.DeleteWithID(this.APIName.DesignationAccessAPI, r.DAId)
      .subscribe(
        res =>{
          this.getDesignationRecords();
          this.onCancel();
          this.messageService.add({ severity: 'success', summary: 'success', detail:'Designation Deleted Successfully' })
        },err => {
          console.log(err.error)
        }
      )
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
