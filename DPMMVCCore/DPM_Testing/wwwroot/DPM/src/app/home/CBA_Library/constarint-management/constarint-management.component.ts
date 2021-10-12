import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';

@Component({
  selector: 'app-constarint-management',
  templateUrl: './constarint-management.component.html',
  styleUrls: ['./constarint-management.component.scss']
})
export class ConstarintManagementComponent implements OnInit {

  public manPower : boolean = false;
  public competancyAdequate : boolean = false;
  public competancyAdequateMSGList : any = [];
  public SavedPCRRecordsList : any = [];
  public userModel : any;
  public SkillLibraryAllrecords: any;
  constructor(private commonBLservice : CommonBLService) { 
    this.userModel = JSON.parse(localStorage.getItem('userObject'));
    this.getUserSkillRecords()
  }

  ngOnInit(): void {
    this.GetSavedPSRRecords();
  }
  private GetSavedPSRRecords(){
    const params = new HttpParams()
          .set('userId', this.userModel.UserId)
    this.commonBLservice.getWithParameters('/PSRClientContractorAPI/GetSkillPSRMapping', params)
    .subscribe(
      (res : any) =>{
        this.competancyAdequateMSGList = [];
        res.forEach(element => {
          if(element.Strategy !== 'GEP' && element.Strategy !== 'CONSTRAINT' && element.Strategy !=='FMEA'){
            element.TYPE = 'MSS';
          }else{
            element.TYPE = element.Strategy;
          } 

          if(element.TYPE == 'MSS' && element.SkillPSRMappingMSS.length === 0){
            element.message = `${element.MaintenanceTask} does not have any employee to carry out the task.`;
          }else if(element.TYPE !== 'MSS' && (element.EmployeeName == null || element.EmployeeName == "")){
            element.message = `${element.MaintenanceTask} does not have any employee to carry out the task.`;
          }else{
            element.message = ""
          }

          if(element.TYPE == 'MSS' && element.SkillPSRMappingMSS.length > 0){
             element.SkillPSRMappingMSS.forEach(r => {
               if(r.Craft > 0){
                var skillData = this.SkillLibraryAllrecords.find(r=>r.SKillLibraryId === r.Craft);
                r.LEVEL = skillData.Level;
                if(r.LEVEL < 100){
                  this.competancyAdequateMSGList.push(`${element.MaintenanceTask} does not have 100% skill employee`);
                }
               }else{
                r.LEVEL = 0;
               }
             });
          }else if(element.TYPE !== 'MSS'){
              if(element.Craft > 0){
                var skillData = this.SkillLibraryAllrecords.find(r=>r.SKillLibraryId === element.Craft);
                element.LEVEL = skillData.Level;
                if(element.LEVEL < 100){
                  this.competancyAdequateMSGList.push(`${element.MaintenanceTask} does not have 100% skill employee`);
                }
              }else{
                element.LEVEL = 0;
              }
            }
        });
        this.SavedPCRRecordsList = res;
      }, err => { console.log(err.error) }
    )
  }

  getUserSkillRecords(){
    const params = new HttpParams()
          .set('UserId', this.userModel.UserId)
    this.commonBLservice.getWithParameters('/SkillLibraryAPI/GetAllConfigurationRecords', params).subscribe(
      (res : any) => {
        this.SkillLibraryAllrecords =res;
      },err =>{ console.log(err.error)}
    )
  }

  ManPower(e){
    if(e.originalEvent.currentTarget.innerText === "Man power N.A."){
      this.manPower = true; 
    }else if(e.originalEvent.currentTarget.innerText =="Competancy not adequate"){
      this.competancyAdequate = true;
    }
   
  }

}
