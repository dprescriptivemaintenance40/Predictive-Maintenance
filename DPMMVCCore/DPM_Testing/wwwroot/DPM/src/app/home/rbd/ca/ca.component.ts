import { Component, OnInit } from '@angular/core';
import { CriticalityAssessmentModel } from '../../models/CriticalityAssessment.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';

@Component({
  selector: 'app-ca',
  templateUrl: './ca.component.html',
  styleUrls: ['./ca.component.scss']
})
export class CAComponent implements OnInit {
  public criticalityAssessmentObjlist : Array<CriticalityAssessmentModel> =  new Array<CriticalityAssessmentModel>();

 
   public cAForms: FormArray = this.fb.array([]);
  constructor(public fb:FormBuilder,
              private commonBLService : CommonBLService) { }

  ngOnInit(): void {
    this.getCriticalityAssesmentRecordList();
  }

 cAForm() {
      let caobj:CriticalityAssessmentModel=new CriticalityAssessmentModel();
      this.criticalityAssessmentObjlist.push(caobj);
  }

  private getCriticalityAssesmentRecordList(){
    this.commonBLService.getWithoutParameters('/CriticalityAssesmentAPI/GetAllCARecords')
    .subscribe(
      (res :any)=> {
        this.criticalityAssessmentObjlist = new Array<CriticalityAssessmentModel>();
        this.criticalityAssessmentObjlist = res;
      }
    )
  }
  public RecordSubmit(p : CriticalityAssessmentModel){
    if(p.CAId === 0){
      this.commonBLService.postWithoutHeaders('/CriticalityAssesmentAPI/CASingleRecordPost',p)
      .subscribe(
        res => {
          this.getCriticalityAssesmentRecordList();
        }, err=>{}
      )
    }else if(p.CAId !== 0){
      this.commonBLService.PutData('/CriticalityAssesmentAPI/UpdateCA',p)
      .subscribe(
        res => {
          this.getCriticalityAssesmentRecordList();
        }, err=>{}
      )
    }
      
  }

  public onDelete(id, i){
      if(id !== 0){
        this.criticalityAssessmentObjlist.splice(i,1);
       }else if (confirm('Are you sure to delete this record ?')){
            this.commonBLService.DeleteWithID('/CriticalityAssesmentAPI',id)
            .subscribe(
              res => {
                this.getCriticalityAssesmentRecordList();
              }, err=>{console.log(err.error)}
            ) 
      }
    }

}
