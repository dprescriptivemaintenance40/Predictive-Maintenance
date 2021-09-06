import { HttpClient, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';

@Component({
  selector: 'app-alert-management',
  templateUrl: './alert-management.component.html',
  styleUrls: ['./alert-management.component.scss']
})
export class AlertManagementComponent implements OnInit {

  private SavedPCRRecordsList : any = [];
  private userModel : any = [];
  public MSSPendingList : any = [];
  public FMEAPendingList : any = [];
  public GEPPendingList : any = [];
  public ConstraintPendingList : any = [];
  public PSRClientContractorData : any = [];
  public MSSCraftModal :boolean= false;
  public CraftModal :boolean = false;
  public SelectedType : string = '';
  public showPSR : boolean = false;
  public FilteredPSRModel : any = [];
  public SelectedCraftToEdit : any = [];
  public SelectedCraftToEditFGC : any = [];
  public craftModalData : any = [];
  public SkillLibraryAllrecords : any = [];
  public EmployeeList : any = [
    {'id': 1 , 'name': 'EMP1'},
    {'id': 2 , 'name': 'EMP2'},
    {'id': 3 , 'name': 'EMP3'},
    {'id': 4 , 'name': 'EMP4'},
    {'id': 5 , 'name': 'EMP5'},
    {'id': 6 , 'name': 'EMP6'},
  ]
  constructor(private commonBLService : CommonBLService,
    private http : HttpClient,
    private cdr : ChangeDetectorRef) { }

  ngOnInit(): void {
    this.userModel = JSON.parse(localStorage.getItem('userObject'));
    this.GetPSRClientContractorData();
    this.getUserSkillRecords();
    this.GetSavedPSRRecords();
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
        var MSSTaskList = this.SavedPCRRecordsList.filter(r=>r.TYPE === 'MSS');
        var FMEATaskList = this.SavedPCRRecordsList.filter(r=>r.TYPE === 'FMEA');
        var GEPTaskList = this.SavedPCRRecordsList.filter(r=>r.TYPE === 'GEP');
        var CONTaskList = this.SavedPCRRecordsList.filter(r=>r.TYPE === 'CONSTRAINT');
        this.MSSPendingList =[];
        this.FMEAPendingList = [];
        this.ConstraintPendingList = [];
        this.GEPPendingList = [];
        MSSTaskList.forEach(element => {
          if(element.SkillPSRMappingMSS.length != 0){
            element.SkillPSRMappingMSS.forEach( async r => {
                if(r.EmployeeName === '' || r.EmployeeName === null){
                  var craft1 = await this.getCraftForMSSSelection(r);
                  r.Route = '';
                  r.message = `Employee with craft is not assigned to ${craft1} of ${element.MaintenanceTask} (MSS Maintenance task)`
                  this.MSSPendingList.push(r);
                }else if((r.EmployeeName !== '' || r.EmployeeName !== null) && r.TaskDuration === 0 ){
                  r.Route = '';
                  var craft = await this.getCraftForMSSSelection(r);
                  r.message = `Yearly Task Duration is not added to craft ${craft} of ${element.MaintenanceTask} (MSS Maintenance task)`
                  this.MSSPendingList.push(r);
                }
              });
          }else{
            element.Route = '#/Home/Prescriptive/SkillLibrary';
            element.message = `Nothing is added to ${element.MaintenanceTask} (MSS Maintenance task)`
            this.MSSPendingList.push(element);
          }
        });

         FMEATaskList.forEach(element => {
           if(element.EmployeeName === ''){
             element.message = `Employee with craft is not assigned to ${element.MaintenanceTask} (FMEA task)`
             this.FMEAPendingList.push(element);
            }else if(element.TaskDuration == 0){
            element.message = `Yearly Task Duration is not added to ${element.MaintenanceTask} (FMEA task)`
            this.FMEAPendingList.push(element);
          }
          
        });

        GEPTaskList.forEach(element => {
          if(element.EmployeeName === ''){
            element.message = `Employee with craft is not assigned to ${element.MaintenanceTask} (FMEA task)`
            this.GEPPendingList.push(element);
           }else if(element.TaskDuration == 0){
           element.message = `Yearly Task Duration is not added to ${element.MaintenanceTask} (FMEA task)`
           this.GEPPendingList.push(element);
         }
         
       });

       CONTaskList.forEach(element => {
        if(element.EmployeeName === ''){
          element.message = `Employee with craft is not assigned to ${element.MaintenanceTask} (FMEA task)`
          this.ConstraintPendingList.push(element);
         }else if(element.TaskDuration == 0){
         element.message = `Yearly Task Duration is not added to ${element.MaintenanceTask} (FMEA task)`
         this.ConstraintPendingList.push(element);
       }
       
     });
        
      }
    )
  }

  public getCraftValue(d){
    var skillData = this.SkillLibraryAllrecords.find(r=>r.SKillLibraryId === d.Craft);
    var craft = this.PSRClientContractorData.find(r=>r.PSRClientContractorId === skillData.Craft);
    return craft.CraftSF;
  }
  
  private GetPSRClientContractorData() {
    this.http.get('/api/PSRClientContractorAPI/GetAllConfigurationRecords')
      .subscribe((res: any) => {
        this.PSRClientContractorData = res;
      });
  }

  private getCraftForMSSSelection(d){
    var craft = this.PSRClientContractorData.find(r=>r.PSRClientContractorId === d.CraftOriginalId);
    return craft.CraftSF;
  }
  public generateTaskDuration(r){
    if(r.TaskDuration !== 0){
      r.POC = ((r.TaskDuration * r.HourlyRate)).toFixed(3)
    }else{
      r.TaskDuration = 0;
      r.POC = 0;
    }
  }

  public EditMSSAlertTask(r){
    this.SelectedCraftToEdit = [];
    var ParentMSSData = this.SavedPCRRecordsList.find(a=>a.PSRId === r.PSRId);
    if(r.TYPE !== undefined){
        // this.MSSCraftModal = true;
        // this.cdr.detectChanges();
        // this.SelectedType = ParentMSSData.TYPE;
        //  var d = ParentMSSData.SkillPSRMappingMSS.find(p=>p.SkillPSRMappingMSSId === r.EditChildId)
        // this.SelectedCraftToEdit.push(d);
    }else{
      this.MSSCraftModal = true;
      this.cdr.detectChanges();
      this.SelectedCraftToEdit.push(r);
      this.SelectedCraftToEditFGC = ParentMSSData;
    }
  }

  getUserSkillRecords(){
    this.commonBLService.getWithoutParameters('/SkillLibraryAPI/GetAllConfigurationRecords').subscribe(
      (res : any) => {
        this.SkillLibraryAllrecords =res;
      }
    )
  }

  public ADDMSSCraftTask : any = [];
  AddCraftForMSS(v){
    this.ADDMSSCraftTask = v;
    if(v.TaskDuration !== 0){
      this.generateTaskDuration(v);
    }
      var data = this.SkillLibraryAllrecords.filter(r=>r.Task === v.MaintenanceTaskId && r.Craft == v.CraftOriginalId);
      this.craftModalData = [];
      data.forEach(element => {
        var cf = this.PSRClientContractorData.find(r=>r.PSRClientContractorId === element.Craft);
        var em = this.EmployeeList.find(r=>r.id === element.EmpId);
        let obj = {}
        obj['SKillLibraryId']=element.SKillLibraryId
        if(element.SKillLibraryId === v.Craft){
          obj['Craft'] = cf.CraftSF
          obj['Selected'] = true;
        }else{
          obj['Craft'] = cf.CraftSF
          obj['Selected'] = false;
        }        
        obj['Employee'] = em.name
        obj['Level'] = element.Level
        obj['HR'] = element.HourlyRate;
        this.craftModalData.push(obj);
      });
      this.CraftModal = true
    
  }

  PSRCraftSelected(a, e){
    if(e.target.checked === true){
     this.craftModalData.forEach(element => {
        element.Selected =false;
      });
      a.Selected = true;
      if(this.SelectedCraftToEditFGC.TYPE !== 'MSS'){
       this.SelectedCraftToEditFGC.Craft = a.SKillLibraryId;
       this.SelectedCraftToEditFGC.HourlyRate = a.HR;
       this.SelectedCraftToEditFGC.EmployeeName = a.Employee
      }
      if(this.SelectedCraftToEditFGC.TYPE === 'MSS'){  
       this.ADDMSSCraftTask.Craft = a.SKillLibraryId;
       this.ADDMSSCraftTask.HourlyRate = a.HR;
       this.ADDMSSCraftTask.EmployeeName = a.Employee
       }  
    }
    if(e.target.checked === false){
      e.Selected = false
      if(this.SelectedCraftToEditFGC.TYPE !== 'MSS'){
       this.SelectedCraftToEditFGC.Craft = 0;
       this.SelectedCraftToEditFGC.HourlyRate = 0;
       this.SelectedCraftToEditFGC.EmployeeName  = '';
      }
      if(this.SelectedCraftToEditFGC.TYPE === 'MSS'){ 
       this.ADDMSSCraftTask.Craft = 0;
       this.ADDMSSCraftTask.HourlyRate = 0;
       this.ADDMSSCraftTask.EmployeeName  = '';
      }
      
   }
   if(this.SelectedCraftToEditFGC.TYPE !== 'MSS'){
     if(this.SelectedCraftToEditFGC.TaskDuration !== 0){
        this.generateTaskDuration(this.SelectedCraftToEditFGC);
       }
   }
   if(this.SelectedCraftToEditFGC.TYPE === 'MSS'){ 
     this.generateTaskDuration(this.ADDMSSCraftTask);
   }
   
   }
  
  AddCraft(v){
    this.SelectedCraftToEditFGC = v;
    if(v.TYPE !== 'MSS'){
      if(v.TaskDuration !== 0){
         this.generateTaskDuration(v);
       }
       if(this.SelectedCraftToEdit.Craft === 0){
         var data = this.SkillLibraryAllrecords.filter(r=>r.Task === v.MaintenanceTaskId);
         this.craftModalData = [];
         data.forEach(element => {
           var cf = this.PSRClientContractorData.find(r=>r.PSRClientContractorId === element.Craft);
           var em = this.EmployeeList.find(r=>r.id === element.EmpId);
           let obj = {}
           obj['SKillLibraryId']=element.SKillLibraryId
           obj['Craft'] = cf.CraftSF
           obj['Employee'] = em.name
           obj['Level'] = element.Level
           obj['Selected'] = false;
           obj['HR'] = element.HourlyRate;
           this.craftModalData.push(obj);
         });
       }else{
         var data = this.SkillLibraryAllrecords.filter(r=>r.Task === v.MaintenanceTaskId);
         this.craftModalData = [];
         data.forEach(element => {
           var cf = this.PSRClientContractorData.find(r=>r.PSRClientContractorId === element.Craft);
           var em = this.EmployeeList.find(r=>r.id === element.EmpId);
           let obj = {}
           obj['SKillLibraryId']=element.SKillLibraryId
           if(element.SKillLibraryId === this.SelectedCraftToEdit.Craft){
             obj['Craft'] = cf.CraftSF
             obj['Selected'] = true;
           }else{
             obj['Craft'] = cf.CraftSF
             obj['Selected'] = false;
           }        
           obj['Employee'] = em.name
           obj['Level'] = element.Level
           obj['HR'] = element.HourlyRate;
           this.craftModalData.push(obj);
         });
   
       }    
    }
      this.CraftModal = true
  
    
  }

  SaveMSSPSRUpdate(){
    this.MSSCraftModal =false;
    this.commonBLService.PutData('/PSRClientContractorAPI/UpdateSkillPSRMSSMapping',this.SelectedCraftToEdit[0])
    .subscribe(
      res => {
        this.GetSavedPSRRecords();
      }, err =>{ console.log(err.error)}
    )
  }

  SaveFGCPSRUpdate(){
    this.MSSCraftModal =false;
    this.commonBLService.PutData('/PSRClientContractorAPI/UpdateSkillPSRMSSMapping',this.FilteredPSRModel[0])
    .subscribe(
      res => {
        this.GetSavedPSRRecords();
      }, err =>{ console.log(err.error)}
    )
  }

  EditFMEAGEPCONEdit(r){
    this.FilteredPSRModel = [];
    this.FilteredPSRModel.push(r);
    this.showPSR = true;
  }

}
