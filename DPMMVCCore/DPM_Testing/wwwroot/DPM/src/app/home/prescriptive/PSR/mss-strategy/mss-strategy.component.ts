import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';
import { PrescriptiveContantAPI } from '../../Shared/prescriptive.constant';
import * as XLSX from 'xlsx'

@Component({
  selector: 'app-mss-strategy',
  templateUrl: './mss-strategy.component.html',
  styleUrls: ['./mss-strategy.component.scss']
})
export class MssStrategyComponent implements OnInit {
  public mssStrategyForms: FormArray = this.fb.array([]);
  public notification = null;
  constructor(public fb: FormBuilder,
    private commonBlService : CommonBLService,
    private PCRAPI : PrescriptiveContantAPI) {
      this.MSSStrategyGetAllRecords();
     }

  ngOnInit(): void {
  }

  mssStrategyForm() {
    this.mssStrategyForms.push(this.fb.group({
      MSSStrategyModelId: [0],
      Strategy: ['', Validators.required],
      MaintenanceTask: ['', Validators.required],
    }));
  }

  recordSubmit(fg: FormGroup) {
    if (fg.value.MSSStrategyModelId == 0){;
      this.commonBlService.postWithoutHeaders(this.PCRAPI.MSSStartegyAPI, fg.value).subscribe(
        (res: any) => {
          fg.patchValue({ MSSStrategyModelId: res.MSSStrategyModelId });
          this.showNotification('insert');
        });
    }else{
      this.commonBlService.PutData(this.PCRAPI.MSSStartegyAPI, fg.value).subscribe(
        (res: any) => {
          this.showNotification('update');
        });
    }    
  }

  onDelete(MSSStrategyModelId, i) {
    if (MSSStrategyModelId == 0)
      this.mssStrategyForms.removeAt(i);
    else if (confirm('Are you sure to delete this record ?')){
      this.commonBlService.DeleteWithID(this.PCRAPI.MSSStartegyAPI, MSSStrategyModelId).subscribe(
        res => {
          this.mssStrategyForms.removeAt(i);
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


//   addfile(event) {
//     var file : any = event.target.files[0];
//     var fileReader = new FileReader();
//     fileReader.readAsArrayBuffer(file);
//     fileReader.onload = (e) => {
//       var arrayBuffer : any = fileReader.result;
//       var data = new Uint8Array(arrayBuffer);
//       var arr = new Array();
//       for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
//       var bstr = arr.join("");
//       var workbook = XLSX.read(bstr, { type: "binary", cellDates: true });
//       var first_sheet_name = workbook.SheetNames[0];
//       var worksheet = workbook.Sheets[first_sheet_name];
//       console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
//       var UploadCompDetailList = XLSX.utils.sheet_to_json(worksheet, { raw: true });
//       this.commonBlService.postWithHeaders('/MSSStartegyAPI/PostMSSStratgyList', UploadCompDetailList)
//       .subscribe(async res => {
//       }, err => {
//       })
// }
//   }


  MSSStrategyGetAllRecords(){
    this.mssStrategyForms = this.fb.array([]);
    this.commonBlService.getWithoutParameters(this.PCRAPI.MSSStrategyGetAllRecords).subscribe(
      res => {
        if (res == [])
          this.mssStrategyForm();
        else { 
          (res as []).forEach((mssStrategyForm: any) => { 
            this.mssStrategyForms.push(this.fb.group({
              MSSStrategyModelId: [mssStrategyForm.MSSStrategyModelId],
              Strategy: [mssStrategyForm.Strategy, Validators.required],
              MaintenanceTask: [mssStrategyForm.MaintenanceTask, Validators.required],
            }));
          });
        }
      }
    );
  }

}
