import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';
import { PrescriptiveContantAPI } from '../../Shared/prescriptive.constant';

@Component({
  selector: 'app-user-production-details',
  templateUrl: './user-production-details.component.html',
  styleUrls: ['./user-production-details.component.scss']
})
export class UserProductionDetailsComponent implements OnInit {

  public userProductionForms: FormArray = this.fb.array([]);
  public notification = null;
  constructor(public fb: FormBuilder,
    private commonBlService : CommonBLService,
    private PCRAPI : PrescriptiveContantAPI) {
      this.GetUserProductionDetailRecords();
     }

  ngOnInit(): void {
  }

  userProductionForm() {
    this.userProductionForms.push(this.fb.group({
      UserProductionId: [0],
      UserId: ['', Validators.required],
      Item: ['', Validators.required],
      TotalHours: [0, Validators.required],
      ProductionLossPercentage: [0, Validators.required],
      TotalCost: [0, Validators.required]
    }));
  }

  recordSubmit(fg: FormGroup) {
    if (fg.value.UserProductionId == 0){;
      this.commonBlService.postWithoutHeaders(this.PCRAPI.UserProductionDetailAPI, fg.value).subscribe(
        (res: any) => {
          fg.patchValue({ UserProductionId: res.UserProductionId });
          this.showNotification('insert');
        });
    }else{
      this.commonBlService.PutData(this.PCRAPI.UserProductionDetailAPI, fg.value).subscribe(
        (res: any) => {
          this.showNotification('update');
        });
    }    
  }

  onDelete(UserProductionId, i) {
    if (UserProductionId == 0)
      this.userProductionForms.removeAt(i);
    else if (confirm('Are you sure to delete this record ?')){
      this.commonBlService.DeleteWithID(this.PCRAPI.UserProductionDetailAPI, UserProductionId).subscribe(
        res => {
          this.userProductionForms.removeAt(i);
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


  GetUserProductionDetailRecords(){
    this.userProductionForms = this.fb.array([]);
    this.commonBlService.getWithoutParameters(this.PCRAPI.GetUserProductionDetail).subscribe(
      res => {
        if (res == [])
          this.userProductionForm();
        else { 
          (res as []).forEach((userProductionModel: any) => { 
            this.userProductionForms.push(this.fb.group({
              UserProductionId: [userProductionModel.UserProductionId],
              UserId: [userProductionModel.UserId, Validators.required],
              Item: [userProductionModel.Item, Validators.required],
              TotalHours: [userProductionModel.TotalHours, Validators.required],
              ProductionLossPercentage: [userProductionModel.ProductionLossPercentage, Validators.required],
              TotalCost: [userProductionModel.TotalCost, Validators.required]
            }));
          });
        }
      }
    );
  }
}
