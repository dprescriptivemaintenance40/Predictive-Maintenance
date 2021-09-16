import { HttpParams, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';
import { DesignationModel } from '../../models/designation-access.model';
import { RegistrationModel } from '../../models/Registration.model';
import { AdminConstantAPIs } from '../admin.constantAPI';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss'],
  providers : [MessageService]
})
export class StaffComponent implements OnInit {
  public UserDetails: any;
  public designationObjList : Array<DesignationModel> = new Array<DesignationModel>();
  public staffObj = new RegistrationModel();
  public staffList:Array<RegistrationModel> = new Array<RegistrationModel>();
  public staffForm: FormGroup = null;
  public notification: any;
  public value3 ="Shivani";
  constructor(private commonBLService : CommonBLService,
    public fb: FormBuilder,
    private http : HttpClient,
    private APINames : AdminConstantAPIs,
    private messageService : MessageService) {
      this.UserDetails = JSON.parse(localStorage.getItem('userObject'));
      this.InitStaffForm();
      this.getDesignations();
      this.getStaff();
     }

  ngOnInit(): void {
  }

  private getDesignations(){
    const params = new HttpParams()
          .set('UserId', this.UserDetails.UserId)
    this.commonBLService.getWithParameters(this.APINames.GetAllDesignation,params)
    .subscribe(
      (res : any)=>{
        this.designationObjList = new Array<DesignationModel>();
        this.designationObjList =res;
      },
      err => {console.log(err.error)}
    )
  }

  InitStaffForm() {
    this.staffForm = this.fb.group({
      UserName : ['', Validators.required],
      FirstName : ['', Validators.required],
      LastName : ['', Validators.required],
      Company : [this.UserDetails.Company],
      Email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      PhoneNumber: ['', [Validators.required, Validators.pattern(("^((\\+91-?)|0)?[0-9]{10}$"))]],
      DesignationId : [0, Validators.required],
      Password : ['', Validators.required],
      UserType :[2],
      Enable:[false],
    })
  }

  private getStaff(){
    const params = new HttpParams()
          .set('UserId', this.UserDetails.UserId)
    this.commonBLService.getWithParameters(this.APINames.GetAllStaffRecord, params)
    .subscribe((res: any) => { 
     this.staffList = res;
      
    }, err => { console.log(err.error)})
  }

 
  public onEdit(a : RegistrationModel){
    this.staffForm.reset();
    this.staffObj = new RegistrationModel();
    this.staffObj = a;
    this.staffForm.get('UserName').setValue(a.UserName);
    this.staffForm.get('FirstName').setValue(a.FirstName);
    this.staffForm.get('LastName').setValue(a.LastName);
    this.staffForm.get('Company').setValue(a.Company);
    this.staffForm.get('Email').setValue(a.Email);
    this.staffForm.get('PhoneNumber').setValue(a.PhoneNumber);
    this.staffForm.get('DesignationId').setValue(a.DesignationId);
    this.staffForm.get('Password').setValue(a.Password);
    this.staffForm.get('UserType').setValue(a.UserType);
    this.staffForm.get('Enable').setValue(a.Enable == 1 ? true : false);
  }
  public onDelete(r){

  }
  public recordSubmit(){
    var checkIsValid = true;
    if (!this.staffForm.valid) {
      for (var b in this.staffForm.controls) {
        this.staffForm.controls[b].markAsDirty();
        this.staffForm.controls[b].updateValueAndValidity();
        checkIsValid = false;
      }
    }
    if (checkIsValid) {
      if (this.staffForm.value.Password.length >= 8) {
            this.messageService.add({ severity: 'info', summary: 'info', detail: 'Enter correct Password' });   
      }
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please fill all mandatory fields' });
    }
    this.staffObj.UserName = this.staffForm.value.UserName;
    this.staffObj.FirstName = this.staffForm.value.FirstName;
    this.staffObj.LastName = this.staffForm.value.LastName;
    this.staffObj.Company = this.staffForm.value.Company;
    this.staffObj.Email = this.staffForm.value.Email;
    this.staffObj.PhoneNumber = this.staffForm.value.PhoneNumber;
    this.staffObj.Password   = this.staffForm.value.Password;
    this.staffObj.UserType = this.staffForm.value.UserType;
    this.staffObj.ImageUrl = this.staffForm.value.ImageUrl;
    this.staffObj.DesignationId= this.staffForm.value.DesignationId;
    this.staffObj.CreatedBy = this.UserDetails.UserId;
    this.staffObj.ModifiedBy = this.staffForm.value.ModifiedBy;
    this.staffObj.Enable = this.staffForm.value.Enable == true ? 1:0;
    if(this.staffObj.UserId === ""){
      this.commonBLService.postWithoutHeaders(this.APINames.RegistrationAPI, this.staffObj)
        .subscribe((res: any) => {
            this.staffForm.reset();
            this.staffObj = new RegistrationModel();
            this.InitStaffForm();
            this.messageService.add({ severity: 'success', summary: 'success', detail:'Staff Added' });
            this.getStaff();
        }, (err: any) => {
          this.messageService.add({ severity: 'warn', summary: 'warn', detail: err.error })
        })
    }
    if(this.staffObj.UserId !== ""){ 
      this.commonBLService.PutData(this.APINames.UpdateStaff, this.staffObj)
      .subscribe((res: any) => {
          this.staffForm.reset();
          this.staffObj = new RegistrationModel();
          this.InitStaffForm();
          this.messageService.add({ severity: 'success', summary: 'success', detail:'Staff Updated' });
          this.getStaff();
      }, (err: any) => {
        this.messageService.add({ severity: 'warn', summary: 'warn', detail: err.error })
      })
    }
  }

  onCancel(){
    this.staffForm.reset();
    this.staffObj = new RegistrationModel();
    this.InitStaffForm();
  }

}
