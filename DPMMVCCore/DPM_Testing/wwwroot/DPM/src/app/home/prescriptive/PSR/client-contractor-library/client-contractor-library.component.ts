import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';
import { PrescriptiveContantAPI } from '../../Shared/prescriptive.constant';

@Component({
  selector: 'app-client-contractor-library',
  templateUrl: './client-contractor-library.component.html',
  styleUrls: ['./client-contractor-library.component.scss']
})
export class ClientContractorLibraryComponent implements OnInit {

  public clientContratorForms: FormArray = this.fb.array([]);
  public notification = null;
  constructor(public fb: FormBuilder,
    private commonBlService : CommonBLService,
    private PCRAPI : PrescriptiveContantAPI) {
      this.getClientContractorRecords();
     }

  ngOnInit(): void {
  }

  clientContratorForm() {
    this.clientContratorForms.push(this.fb.group({
      psrClientContractorId: [0],
      craftSF: ['', Validators.required],
      craftLF: ['', Validators.required],
      clientHourlyRate: ['', Validators.required],
      contractorHourlyRate: ['', Validators.required]
    }));
  }

  recordSubmit(fg: FormGroup) {
    if (fg.value.psrClientContractorId == 0){;
      this.commonBlService.postWithoutHeaders(this.PCRAPI.PSRClientContractorAPI, fg.value).subscribe(
        (res: any) => {
          fg.patchValue({ psrClientContractorId: res.psrClientContractorId });
          this.showNotification('insert');
        });
    }else{
      this.commonBlService.PutData(this.PCRAPI.PSRClientContractorAPI, fg.value).subscribe(
        (res: any) => {
          this.showNotification('update');
        });
    }    
  }

  onDelete(psrClientContractorId, i) {
    if (psrClientContractorId == 0)
      this.clientContratorForms.removeAt(i);
    else if (confirm('Are you sure to delete this record ?')){
      this.commonBlService.DeleteWithID(this.PCRAPI.PSRClientContractorAPI, psrClientContractorId).subscribe(
        res => {
          this.clientContratorForms.removeAt(i);
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


  getClientContractorRecords(){
    this.clientContratorForms = this.fb.array([]);
    this.commonBlService.getWithoutParameters(this.PCRAPI.GetAllConfigurationRecords).subscribe(
      res => {
        if (res == [])
          this.clientContratorForm();
        else { 
          (res as []).forEach((clientContratorModel: any) => { 
            this.clientContratorForms.push(this.fb.group({
              psrClientContractorId: [clientContratorModel.PSRClientContractorId],
              craftSF: [clientContratorModel.CraftSF, Validators.required],
              craftLF: [clientContratorModel.CraftLF, Validators.required],
              clientHourlyRate: [clientContratorModel.ClientHourlyRate, Validators.required],
              contractorHourlyRate: [clientContratorModel.ContractorHourlyRate, Validators.required]
            }));
          });
        }
      }
    );
  }

}
