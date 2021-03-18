import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { PrescriptiveConfigurationService } from './prescriptive-configuration.service';

@Component({
  selector: 'app-prescriptive-configuration',
  templateUrl: './prescriptive-configuration.component.html',
  styleUrls: ['./prescriptive-configuration.component.scss']
})
export class PrescriptiveConfigurationComponent implements OnInit {


  prescriptiveLookUpForms: FormArray = this.fb.array([]);
  
  public notification = null;
  public MachineTypeSelect: any;
  public EquipmentTypeSelect : boolean = true;
  public EquipmentTypeCompressor : boolean = false;
  public EquipmentTypePump : boolean = false;

  constructor(public fb: FormBuilder,
              public prescriptiveLookUpService: PrescriptiveConfigurationService,
              public title: Title) {
     
     }

  ngOnInit() {
    this.title.setTitle('DPM | Prescriptive Configuration');
    this.prescriptiveLookUpService.getPrescriptiveLookupMasterList().subscribe(
      res => {
    
        if (res == []){
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
      }
    );
  }

  SelectMachineType(fg: FormGroup){
    if(fg.value.machineType == 'Pump'){
      this.EquipmentTypePump = true;
      this.EquipmentTypeCompressor = false;
      this.EquipmentTypeSelect  = false;
    }else{
      this.EquipmentTypePump = false;
      this.EquipmentTypeCompressor = true;
      this.EquipmentTypeSelect  = false;
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
    if (fg.value.prescriptiveLookupMasterId == 0)
      this.prescriptiveLookUpService.postPrescriptiveLookupMaster(fg.value).subscribe(
        (res: any) => {
          fg.patchValue({ prescriptiveLookupMasterId: res.prescriptiveLookupMasterId });
          this.showNotification('insert');
        });
    else
      this.prescriptiveLookUpService.putPrescriptiveLookupMaster(fg.value).subscribe(
        (res: any) => {
          this.showNotification('update');
        });
  }

  onDelete(prescriptiveLookupMasterId, i) {
    if (prescriptiveLookupMasterId == 0)
      this.prescriptiveLookUpForms.removeAt(i);
    else if (confirm('Are you sure to delete this record ?'))
      this.prescriptiveLookUpService.deletePrescriptiveLookupMaster(prescriptiveLookupMasterId).subscribe(
        res => {
          this.prescriptiveLookUpForms.removeAt(i);
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
