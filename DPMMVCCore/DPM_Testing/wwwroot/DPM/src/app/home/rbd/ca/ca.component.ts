import { Component, OnInit } from '@angular/core';
import { CriticalityAssessmentModel } from '../../models/CriticalityAssessment.model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ca',
  templateUrl: './ca.component.html',
  styleUrls: ['./ca.component.scss']
})
export class CAComponent implements OnInit {
  public criticalityAssessmentObjlist : Array<CriticalityAssessmentModel> =  new Array<CriticalityAssessmentModel>();

 
   public cAForms: FormArray = this.fb.array([]);
  constructor(public fb:FormBuilder) { }

  ngOnInit(): void {
  }

 cAForm() {
   let caobj:CriticalityAssessmentModel=new CriticalityAssessmentModel();
   this.criticalityAssessmentObjlist.push(caobj);

//  this.cAForms.push(this.fb.group({
//     CAId: [0],
//       Asset: ['', Validators.required],
//       Location: ['', Validators.required],
//       AssetDescription: ['', Validators.required],
//       LocationDescription: ['', Validators.required],
//       FailureClass: ['', Validators.required],
//       LocationParent: ['', Validators.required],
//       CriticalityProjectStage: ['', Validators.required],
//       GeneralLedgerAccount: ['', Validators.required],
//       Area: ['', Validators.required],
//       Status: ['', Validators.required],
//       SE: [0, Validators.required],
//       PLE: [0, Validators.required],
//       EE: [0, Validators.required],
//       RE: [0, Validators.required],
//       RF: [0, Validators.required],
//       RFE: [0, Validators.required],
//       Criticality: ['', Validators.required],
//       RiskRanking: ['', Validators.required],
//       RiskRankingMatrix: ['', Validators.required],
//       HSECESAsset: ['', Validators.required],
//       OriginalCriticality: ['', Validators.required],
//       AssetCost: [0, Validators.required],
//       RepairCost: [0, Validators.required],
      
      
//     }));

  }
  RecordSubmit(p){
  
  }

}
