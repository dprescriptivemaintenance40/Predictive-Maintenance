import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';
import { PrescriptiveContantAPI } from '../../Shared/prescriptive.constant';

@Component({
  selector: 'app-craft-employee-task-mapping',
  templateUrl: './craft-employee-task-mapping.component.html',
  styleUrls: ['./craft-employee-task-mapping.component.scss'],
  providers: [MessageService],
})
export class CraftEmployeeTaskMappingComponent implements OnInit {

  public craftEmployeeMappingForms: FormArray = this.fb.array([]);
  public notification = null;
  private UserDetails: any =[];
  public PSRClientContractorData: any;
  public CraftEmployeeMappingList : any =[];
  public EmployeeList : any = [
    {'id': 1 , 'name': 'EMP1'},
    {'id': 2 , 'name': 'EMP2'},
    {'id': 3 , 'name': 'EMP3'},
    {'id': 4 , 'name': 'EMP4'},
    {'id': 5 , 'name': 'EMP5'},
    {'id': 6 , 'name': 'EMP6'},
    {'id': 7 , 'name': 'EMP7'},
    {'id': 8 , 'name': 'EMP8'},
    {'id': 9 , 'name': 'EMP9'},
    {'id': 10, 'name': 'EMP10'},
  ];
  constructor(public fb: FormBuilder,
    private messageService: MessageService,
    private commonBlService : CommonBLService,
    private http : HttpClient,
    private PCRAPI : PrescriptiveContantAPI) {
      this.UserDetails = JSON.parse(localStorage.getItem('userObject'));
      this.GetCEMappingRecords();
      this.GetPSRClientContractorData();
     }

  ngOnInit(): void {
  }

  craftEmployeeMappingForm() {
    this.craftEmployeeMappingForms.push(this.fb.group({
      CETId :[0,Validators.required],
      UserId :[this.UserDetails.UserId,Validators.required],
      Craft :['',Validators.required],
      CraftId:[0,Validators.required],
      CraftEmployeeTaskChild :[[],Validators.required],
    }));
  }

  recordSubmit(fg: FormGroup) {
    if (fg.value.CETId == 0){;
      this.commonBlService.postWithoutHeaders(this.PCRAPI.CEMWholeRecordSave, fg.value).subscribe(
        (res: any) => {
          this.GetCEMappingRecords();
          this.showNotification('insert');
        });
    }else{
      this.commonBlService.PutData(this.PCRAPI.CEMUpdateParent, fg.value).subscribe(
        (res: any) => {
          this.GetCEMappingRecords();
          this.showNotification('update');
        });
    }    
  }

  onDelete(CETId, i) {
    if (CETId == 0)
      this.craftEmployeeMappingForms.removeAt(i);
    else if (confirm('Are you sure to delete this record ?')){
      const params = new HttpParams()
            .set('id',CETId);
      this.commonBlService.DeleteWithParam(this.PCRAPI.CEMWholeRecordDelete, params).subscribe(
        res => {
          this.craftEmployeeMappingForms.removeAt(i);
          this.showNotification('delete');
        },err=>{console.log(err.error)});
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


  GetCEMappingRecords(){
    this.craftEmployeeMappingForms = this.fb.array([]);
    const params = new HttpParams()
          .set('userId', this.UserDetails.UserId)
    this.commonBlService.getWithParameters(this.PCRAPI.CEMGetAllRecords, params).subscribe(
      res => {
        if (res == [])
          this.craftEmployeeMappingForm();
        else { 
          this.CraftEmployeeMappingList = [];
          this.CraftEmployeeMappingList = res;
          (res as []).forEach((CEMModel: any) => { 
            this.craftEmployeeMappingForms.push(this.fb.group({
              CETId :[CEMModel.CETId],
              UserId :[CEMModel.UserId],
              Craft :[CEMModel.Craft],
              CraftId :[CEMModel.CraftId],
              CraftEmployeeTaskChild :[CEMModel.CraftEmployeeTaskChild],
            }));
          });
        }
      }
    );
  }

  private GetPSRClientContractorData() {
    this.http.get('/api/PSRClientContractorAPI/GetAllConfigurationRecords')
      .subscribe((res: any) => {
        this.PSRClientContractorData = res;
      });
  }
  setCraftId(fg:FormGroup,r){
    var data = this.PSRClientContractorData.find(a=>a.PSRClientContractorId === r)
    fg.value.Craft = data.CraftSF;
  }

  public addChildToCEMForm(fg: FormGroup){
    if(fg.value.CraftId !== 0){
      let obj ={
        CETChildId :0,
        CETId: fg.value.CETId,
        EmployeeId :'',
        CheckOilLevelTopUp :0,
        VibrationCheck :0,
        ScheduleReplacement :0,
        ReplaceOnCondition :0,
        ScheduleOilChange :0,
        SupportToMechTask : 0,
        TaskId :'',
        CriticalityRating :'',
      };
      fg.value.CraftEmployeeTaskChild.push(obj);
    }else{
      this.messageService.add({ severity: 'warn', summary: 'warn', detail:'Please select craft first !!!' });
    }    
  }

  public childRecordSubmit(r){
    if(r.CETChildId === 0){
      this.commonBlService.postWithoutHeaders(this.PCRAPI.CEMChildSave, r).subscribe(
        (res: any) => {
          this.GetCEMappingRecords();
          this.showNotification('insert');
        },err=>{console.log(err.error)});
    }else{
      this.commonBlService.PutData(this.PCRAPI.CEMUpdateChild, r).subscribe(
        (res: any) => {
          this.GetCEMappingRecords();
          this.showNotification('update');
        },err=>{console.log(err.error)});
    }    
  }
  onChildDelete(id,parentIndex, childIndex){
    if(id == 0){
      this.craftEmployeeMappingForms.value[parentIndex].CraftEmployeeTaskChild.splice(childIndex, 1);
    }else{
      const params = new HttpParams()
            .set('id',id);
      this.commonBlService.DeleteWithParam(this.PCRAPI.CEMChildDelete, params).subscribe(
        res => {
          this.craftEmployeeMappingForms.value[parentIndex].CraftEmployeeTaskChild.splice(childIndex, 1);
          this.showNotification('delete');
        },err=>{console.log(err.error)});
    }
  }
}
