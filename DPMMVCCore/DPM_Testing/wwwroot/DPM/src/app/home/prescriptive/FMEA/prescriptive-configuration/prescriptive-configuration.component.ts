import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { PrescriptiveBLService } from '../../Shared/prescritpive.bl.service';

@Component({
  selector: 'app-prescriptive-configuration',
  templateUrl: './prescriptive-configuration.component.html',
  styleUrls: ['./prescriptive-configuration.component.scss']
})
export class PrescriptiveConfigurationComponent implements OnInit {


  prescriptiveLookUpForms: FormArray = this.fb.array([]);

  public notification = null;
  public MachineTypeSelect: any;
  public EquipmentTypeSelect: boolean = true;
  public EquipmentTypeCompressor: boolean = false;
  public EquipmentTypePump: boolean = false;

  constructor(public fb: FormBuilder,
    public title: Title,
    private prescriptiveBLService: PrescriptiveBLService) {

  }

  ngOnInit() {
    this.title.setTitle('DPM | Prescriptive Configuration');
    this.getPrescriptiveLookupMasterList();
  }
  private getPrescriptiveLookupMasterList() {
    var url : string =  this.prescriptiveBLService.FMEAConfiguration
    this.prescriptiveBLService.getWithoutParameters(url)
      .subscribe(res => {
        if (res == []) {
          this.prescriptiveLookUpForm();
        }
        else {
          (res as []).forEach((prescriptiveLookUpModel: any) => {

            this.prescriptiveLookUpForms.push(this.fb.group({
              prescriptiveLookupMasterId: [prescriptiveLookUpModel.PrescriptiveLookupMasterId],
              // tagNumber: [prescriptiveLookUpModel.TagNumber, Validators.required],
              machineType: [prescriptiveLookUpModel.MachineType, Validators.required],
              equipmentType: [prescriptiveLookUpModel.EquipmentType, Validators.required],
              function: [prescriptiveLookUpModel.Function, Validators.required],
              description: [prescriptiveLookUpModel.Description, Validators.required]
            }));
          });
          this.EquipmentTypeSelect = false
          this.EquipmentTypePump = true
        }
      }, err => {
        console.log(err.error);
      });
  }

  SelectMachineType(fg: FormGroup) {
    if (fg.value.machineType == 'Pump') {
      this.EquipmentTypePump = true;
      this.EquipmentTypeCompressor = false;
      this.EquipmentTypeSelect = false;
    } else {
      this.EquipmentTypePump = false;
      this.EquipmentTypeCompressor = true;
      this.EquipmentTypeSelect = false;
    }
  }


  prescriptiveLookUpForm() {
    this.prescriptiveLookUpForms.push(this.fb.group({
      prescriptiveLookupMasterId: [0],
      // tagNumber: ['', Validators.required],
      machineType: ['', Validators.required],
      equipmentType: ['', Validators.required],
      function: ['', Validators.required],
      description: ['', Validators.required]
    }));
  }

  recordSubmit(fg: FormGroup) {
    if (fg.value.prescriptiveLookupMasterId == 0){
      var url : string =  this.prescriptiveBLService.FMEAConfiguration
      this.prescriptiveBLService.postWithoutHeaders(url, fg.value).subscribe(
        (res: any) => {
          fg.patchValue({ prescriptiveLookupMasterId: res.prescriptiveLookupMasterId });
          this.showNotification('insert');
        });
      }   
    else{
      var url : string =  this.prescriptiveBLService.FMEAConfiguration
      this.prescriptiveBLService.PutData(url,fg.value).subscribe(
        (res: any) => {
          this.showNotification('update');
        });
    }   
  }

  onDelete(prescriptiveLookupMasterId, i) {
    if (prescriptiveLookupMasterId == 0)
      this.prescriptiveLookUpForms.removeAt(i);
    else if (confirm('Are you sure to delete this record ?')){
      var url : string =  this.prescriptiveBLService.FMEAConfiguration
      this.prescriptiveBLService.DeleteWithID(url, prescriptiveLookupMasterId).subscribe(
        res => {
          this.prescriptiveLookUpForms.removeAt(i);
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
