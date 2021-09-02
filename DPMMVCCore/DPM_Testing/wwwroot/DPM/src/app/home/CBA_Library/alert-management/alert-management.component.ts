import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';

@Component({
  selector: 'app-alert-management',
  templateUrl: './alert-management.component.html',
  styleUrls: ['./alert-management.component.scss']
})
export class AlertManagementComponent implements OnInit {

  private SavedPCRRecordsList : any = [];
  private userModel : any = [];
  private PSRModel : any = [];
  constructor(private commonBLService : CommonBLService) { }

  ngOnInit(): void {
    this.userModel = JSON.parse(localStorage.getItem('userObject'));
  }

  private GetSavedPSRRecords(){
    const params = new HttpParams()
          .set('userId', this.userModel.UserId)
    this.commonBLService.getWithParameters('/PSRClientContractorAPI/GetSkillPSRMapping', params)
    .subscribe(
      (res : any) =>{
        res.forEach(element => {
          if(element.Strategy !== 'GEP' && element.Strategy !== 'CONSTRAINT' && element.Strategy !=='FMEA'){
            element.TYPE = 'MSS';
          }else{
            element.TYPE = element.Strategy;
          }        
        });
        this.SavedPCRRecordsList = res;
      }
    )
  }

}
