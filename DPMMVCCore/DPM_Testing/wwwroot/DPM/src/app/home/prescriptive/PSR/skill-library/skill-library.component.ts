import { HttpClient, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';
import { PrescriptiveContantAPI } from '../../Shared/prescriptive.constant';

@Component({
  selector: 'app-skill-library',
  templateUrl: './skill-library.component.html',
  styleUrls: ['./skill-library.component.scss']
})
export class SkillLibraryComponent implements OnInit {
  public MachineType: string = "";
  public EquipmentType: string = "";
  public TagNumber: string = "";
  public EquipmentList: any = []
  public TagList: any = [];
  public SelectedTagNumber: string = "";
  public SelectionEnable: boolean = true;
  public PrescriptiveRecordsList: any = []
  public prescriptiveRecords: any = [];
  public MaintenanceTaskList: any = []
  public SkillLibrary: boolean = false;
  public SkillLibraryHeaders: any = [];
  public SkillLibraryRows: any = [];
  public SkillData: any = [];
  public CraftModal : boolean = false;
  public EmployeeList : any = [
    {'id': 1 , 'name': 'EMP1'},
    {'id': 2 , 'name': 'EMP2'},
    {'id': 3 , 'name': 'EMP3'},
    {'id': 4 , 'name': 'EMP4'},
    {'id': 5 , 'name': 'EMP5'},
    {'id': 6 , 'name': 'EMP6'},
  ]
  public MaintenanceTasks: any = [
    { Name: "Function Check", Strategy: "A-FFT, E-FFT" },
    { Name: "Carry out talks based on on-condition maintenance recommendation", Strategy: "OCM, B-OFM" },
    { Name: "Remove, overhaul, and rectify", Strategy: "SO" },
    { Name: "Remove, replace, and recommission", Strategy: "SR" },
    { Name: "Modification, or redesign required since no task is effective", Strategy: "RED" },
    { Name: "Not Applicable", Strategy: "B-FFT, C-FFT, D-FFT, A-OFM" },
    { Name: "No Task", Strategy: "OCM, C-OFM, D-OFM, E-OFM" }
  ]
  public showPSR: boolean = false;
  public PSRDetails: any = [];
  public SkillLibraryColumns: any = [];
  private userModel: any;
  private SkillLibraryData: any = [];
  private PSRClientContractorData: any = [];
  public PSRModel: any =[];
  public ShowMasterPage : boolean =false;
  public skillLibraryForms: FormArray = this.fb.array([]);
  public notification = null;
  public MaintenanceStrategyList : any = [];
  private SkillLibraryAllrecords : any = [];
  public craftModalData : any = [];
  public SavedPCRRecordsList : any = [];
  public SelectedCraftToEdit : any;
  constructor(private http: HttpClient,
    public fb: FormBuilder,
    private commonBLervice: CommonBLService,
    private PSRAPIs : PrescriptiveContantAPI,
    private cdr: ChangeDetectorRef) {
    this.SkillLibraryColumns.push(
      { field: 'Craft', header: 'Craft', width: '5em', inputtype: false },
      { field: 'EmployeeCode', header: 'Employee Code', width: '10em', inputtype: true, placeholder: 'Code', type: 'text' },
    );
    this.MaintenanceTasks.forEach((row, index) => {
      this.SkillLibraryColumns.push(
        { field: `SkillPercent${index}`, header: row.Name, width: '10em', inputtype: true, placeholder: 'Skill Percent', type: 'number' },
      );
    });
    this.userModel = JSON.parse(localStorage.getItem('userObject'));
  }

  ngOnInit(): void {
    // this.getPrescriptiveRecords();
    // this.MachineEquipmentSelect();
    this.GetMssStartegyList();
    this.GetPSRClientContractorData();
    this.getUserSkillRecords();
  //  this.GetSkillMappedData();
  }

  GetMssStartegyList(){
    this.commonBLervice.getWithoutParameters(this.PSRAPIs.MSSStrategyGetAllRecords).subscribe( 
      res => {
        this.MaintenanceStrategyList = res;
      }
    )
  }

  getPrescriptiveRecords() {
    this.http.get('api/PrescriptiveAPI/GetTagNumber')
      .subscribe((res: any) => {
        this.PrescriptiveRecordsList = res;
      });
  }

  public GetSkillMappedData() {
    this.http.get(`api/PSRClientContractorAPI/GetSkillMappedData?UserId=${this.userModel.UserId}`)
      .subscribe((res: any) => {
        this.SkillLibraryData = res;
        if(res.length !== 0){
          this.showPSR = true;
        }
        this.generatePSR();
        this.getPrescriptiveRecordsByEqui();
      });
  }

  private generatePSR(){
     this.PSRModel =[]
     this.SkillLibraryData.forEach(element => {
      var TaskData = this.MaintenanceTasks.find(r => r.Strategy === element.Strategy)
       if(element.Strategy === TaskData.Strategy){
          var PSR = this.PSRClientContractorData.find(r=>r.CraftSF === element.Craft)
          let obj ={}
          obj['PSRId']=0;
          obj['UserId']= this.userModel.UserId;
          obj['MaintenanceTask']= TaskData.Name;
          obj['Strategy']= element.Strategy;
          obj['Craft']= PSR.CraftSF;
          obj['HourlyRate']= PSR.ClientHourlyRate;
          obj['TaskDuration']= 0 ;
          obj['MaterialCost']= 0 ;
          obj['POC']= 0 ;
          this.PSRModel.push(obj);
       }
     });
  }


  MachineEquipmentSelect() {
    if (this.MachineType == "Pump") {
      this.EquipmentList = []
      this.EquipmentList = ["Centrifugal Pump"]
    }
    if (this.MachineType == "Compressor") {
      this.EquipmentList = []
      this.EquipmentList = ["Screw Compressor"]
    }
    this.TagList = []
    var rec: any = this.PrescriptiveRecordsList.filter(res => res.MachineType === this.MachineType && res.MSSAdded === "1")
    rec.forEach(element => {
      this.TagList.push(element.TagNumber)
    });
  }

  getPrescriptiveRecordsByEqui() {
    this.http.get('/api/PSRClientContractorAPI/GetAllConfigurationRecords')
      .subscribe((res: any) => {
        this.SkillLibraryRows = [];
        res.forEach(row => {
          let obj = {}
          const checkSkillData = this.SkillLibraryData.find(a => a.Craft === row.CraftSF);
          if (checkSkillData) {
            obj = {
              MapId: checkSkillData.MapId,
              Craft: checkSkillData.Craft,
              EmployeeCode: checkSkillData.EmployeeCode
            }
            this.MaintenanceTasks.forEach((task, index) => {
              let test = {};
              if (checkSkillData.Strategy && task.Strategy === checkSkillData.Strategy) {
                test[`SkillPercent${index}`] = checkSkillData.SkillPercent;
                test[`Strategy${index}`] = task.Strategy;
              }
              else {
                test[`SkillPercent${index}`] = undefined;
                test[`Strategy${index}`] = task.Strategy;
              }
              Object.assign(obj, test);
            });
          } else {
            obj = {
              MapId: 0,
              Craft: row.CraftSF,
              EmployeeCode: ''
            }
            this.MaintenanceTasks.forEach((task, index) => {
              let test = {};
              test[`SkillPercent${index}`] = undefined;
              test[`Strategy${index}`] = task.Strategy;
              Object.assign(obj, test);
            });
          }
          this.SkillLibraryRows.push(obj);
        });
        this.SelectionEnable = false;
        this.SkillLibrary = true;
      });
  }

  private GetPSRClientContractorData() {
    this.http.get('/api/PSRClientContractorAPI/GetAllConfigurationRecords')
      .subscribe((res: any) => {
        this.PSRClientContractorData = res;
      });
  }

  public getHourlyRate(r : any){
    var Data = this.MaintenanceStrategyList.find(a=>a.MSSStrategyModelId == r.value.Task);
    var craft = this.PSRClientContractorData.find(a=>a.PSRClientContractorId === r.value.Craft);
    if(Data !== undefined && craft !== undefined){
      if(Data.Strategy === 'GEP' || Data.Strategy === 'NEW' || Data.Strategy === 'FMEA' ){
         r.value.HourlyRate = craft.ClientHourlyRate;
      }
    }
  }

  BackSkillData() {
    this.SelectionEnable = true;
    this.SkillLibrary = false;
    this.cdr.detectChanges();
  }

  SaveSkillData() {
    this.SkillLibraryRows.forEach(skill => {
      for (let i = 2; i <= Object.keys(skill).length; i++) {
        if (skill.EmployeeCode && skill[`SkillPercent${i - 2}`]) {
          this.SkillData.push({
            MapId: skill.MapId !== 0 ? skill.MapId : 0,
            UserId: this.userModel.UserId,
            EmployeeCode: skill.EmployeeCode,
            Craft: skill.Craft,
            Strategy: skill[`Strategy${i - 2}`],
            SkillPercent: skill[`SkillPercent${i - 2}`],
          });
        }
      }
    });
    if (this.SkillData.length > 0) {
      this.commonBLervice.postWithHeaders('/PSRClientContractorAPI/PostSkillData', this.SkillData)
        .subscribe(res => {
          this.GetSkillMappedData();
          this.showPSR = true;
        }, err => {
          console.log(err.error);
        });
    } else {
      alert('No mapping for Craft and maintenance')
    }

  }

  onlyNumbers(event) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();

    }
  }
  RemovePreviousVal(row, col, index) {
    for (let i = 2; i <= Object.keys(row).length; i++) {
      if (`SkillPercent${i - 2}` !== col && row[`SkillPercent${i - 2}`]) {
        this.SkillLibraryRows[index][`SkillPercent${i - 2}`] = undefined;
      }
    }
  }

  public generateTaskDuration(r){
    if(r.TaskDuration !== 0){
      // r.TaskDuration = (r.TaskDuration/52).toFixed(3);
      // r.POC = ((r.TaskDuration * r.HourlyRate)/1000).toFixed(3);
      r.POC = ((r.TaskDuration * r.HourlyRate)).toFixed(3)
    }else{
      r.TaskDuration = 0;
      r.POC = 0;
    }
    this.cdr.detectChanges;
  }

  public SavePSR(){
    this.commonBLervice.postWithHeaders('/PSRClientContractorAPI/PostSkillPSRMapping', this.PSRModel)
    .subscribe(
      (res : any)=>{

      }, err => { console.log(err.error) }
    )
  }

  private GetSavedPSRRecords(){
    const params = new HttpParams()
          .set('userId', this.userModel.UserId)
    this.commonBLervice.getWithParameters('/PSRClientContractorAPI/GetSkillPSRMapping', params)
    .subscribe(
      (res : any) =>{
        this.SavedPCRRecordsList = res;
        const MaintenanceTask = [...new Set(this.SkillLibraryAllrecords.map(item => item.Task))];
        this.PSRModel =[]
        if(res.length === 0){
          MaintenanceTask.forEach(element => {
            var MSSData = this.MaintenanceStrategyList.find(r=>r.MSSStrategyModelId == element)
            let obj ={}
            obj['PSRId']=0;
            obj['UserId']= this.userModel.UserId;
            obj['MaintenanceTaskId']=element;
            obj['EmployeeName']='';
            obj['MaintenanceTask']= MSSData.MaintenanceTask;
            obj['Strategy']= MSSData.Strategy;
            obj['Craft']= 0;
            obj['HourlyRate']= 0;
            obj['TaskDuration']= 0 ;
            obj['MaterialCost']= 0 ;
            obj['POC']= 0 ;
            this.PSRModel.push(obj);
          });
        }else{
          if(MaintenanceTask.length > res.length){
            res.forEach(element => {
              this.PSRModel.push(element);
            }); 
            const addedMTinDB = [...new Set(res.map(item => item.MaintenanceTaskId))];
            const NotSavedMT = MaintenanceTask.filter(f => !addedMTinDB.includes(f));
           // const maxId = Math.max(...this.SkillLibraryAllrecords.map(o => o.SKillLibraryId), 0);
           NotSavedMT.forEach(element => {
            var MSSData = this.MaintenanceStrategyList.find(r=>r.MSSStrategyModelId == element)
            let obj ={}
            obj['PSRId']=0;
            obj['UserId']= this.userModel.UserId;
            obj['MaintenanceTaskId']=element;
            obj['EmployeeName']='';
            obj['MaintenanceTask']= MSSData.MaintenanceTask;
            obj['Strategy']= MSSData.Strategy;
            obj['Craft']= 0;
            obj['HourlyRate']= 0;
            obj['TaskDuration']= 0 ;
            obj['MaterialCost']= 0 ;
            obj['POC']= 0 ;
            this.PSRModel.push(obj);
           });

          }else if(MaintenanceTask.length === res.length){
            res.forEach(element => {
              this.PSRModel.push(element);
            });
          }
        }
        this.showPSR = true;
      }, err =>{ console.log(err.error)}
    )
  }


  skillLibraryForm() {
    this.skillLibraryForms.push(this.fb.group({
      SKillLibraryId: [0],
      Craft: [0, Validators.required],
      EmpId: [0, Validators.required],
      Task: [0, Validators.required],
      Level: [0, Validators.required],
      HourlyRate: [0, Validators.required],
    }));
  }

  recordSubmit(fg: FormGroup) {
    if (fg.value.SKillLibraryId == 0){;
      this.commonBLervice.postWithoutHeaders('/SkillLibraryAPI', fg.value).subscribe(
        (res: any) => {
          fg.patchValue({ SKillLibraryId: res.SKillLibraryId });
          this.showNotification('insert');
        });
    }else{
      this.commonBLervice.PutData('/SkillLibraryAPI', fg.value).subscribe(
        (res: any) => {
          this.showNotification('update');
        });
    }    
  }

  onDelete(SKillLibraryId, i) {
    if (SKillLibraryId == 0)
      this.skillLibraryForms.removeAt(i);
    else if (confirm('Are you sure to delete this record ?')){
      var Data = this.SkillLibraryAllrecords.find(r=>r.SKillLibraryId === SKillLibraryId);
      var PSRData : any = this.PSRModel.find(r=>r.MaintenanceTaskId === Data.Task);
      var EmployeeData = this.EmployeeList.find(r=>r.id === Data.EmpId);
      var craftData = this.PSRClientContractorData.find(r=>r.PSRClientContractorId === Data.Craft)
      var craft = this.getCraftValue(PSRData);
      if((Data.Task === PSRData.MaintenanceTaskId) 
          && (PSRData.EmployeeName === EmployeeData.name)
          && (craftData.CraftSF === craft) ){
            PSRData.Craft = 0;
            PSRData.EmployeeName = ''
            PSRData.HourlyRate = 0;
            PSRData.POC = 0;
            this.SavePSR();
          }
      this.commonBLervice.DeleteWithID('/SkillLibraryAPI', SKillLibraryId).subscribe(
        res => {
          this.skillLibraryForms.removeAt(i);
          this.showNotification('delete');
          this.getUserSkillRecords();
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


  getUserSkillRecords(){
    this.skillLibraryForms = this.fb.array([]);
    this.commonBLervice.getWithoutParameters('/SkillLibraryAPI/GetAllConfigurationRecords').subscribe(
      (res : any) => {
        this.SkillLibraryAllrecords =res;
        if (res.length == 0)
          this.skillLibraryForm();
        else { 
          (res as []).forEach((SKillLibraryModel: any) => { 
            this.skillLibraryForms.push(this.fb.group({
              SKillLibraryId: [SKillLibraryModel.SKillLibraryId],
              Craft: [SKillLibraryModel.Craft, Validators.required],
              EmpId: [SKillLibraryModel.EmpId, Validators.required],
              Task: [SKillLibraryModel.Task, Validators.required],
              Level: [SKillLibraryModel.Level, Validators.required],
              HourlyRate: [SKillLibraryModel.HourlyRate, Validators.required],
            }));
          });

          this.GetSavedPSRRecords();
        }
      }
    );
  }

  AddCraft(v){
    this.SelectedCraftToEdit = v;
    if(v.TaskDuration !== 0){
     // v.TaskDuration =  v.TaskDuration*52;
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
    this.CraftModal = true
  }

  PSRCraftSelected(a, e){
   if(e.target.checked === true){
    this.craftModalData.forEach(element => {
       element.Selected =false;
     });
     a.Selected = true;
     this.SelectedCraftToEdit.Craft = a.SKillLibraryId;
     this.SelectedCraftToEdit.HourlyRate = a.HR;
     this.SelectedCraftToEdit.EmployeeName = a.Employee
   }
   if(e.target.checked === false){
     e.Selected = false
     this.SelectedCraftToEdit.Craft = 0;
     this.SelectedCraftToEdit.HourlyRate = 0;
     this.SelectedCraftToEdit.EmployeeName  = '';
  }
  if(this.SelectedCraftToEdit.TaskDuration !== 0){
   // this.SelectedCraftToEdit.TaskDuration =  this.SelectedCraftToEdit.TaskDuration*52;
    this.generateTaskDuration(this.SelectedCraftToEdit);
   }
  }

  getCraftValue(d){
    var skillData = this.SkillLibraryAllrecords.find(r=>r.SKillLibraryId === d.Craft);
    var craft = this.PSRClientContractorData.find(r=>r.PSRClientContractorId === skillData.Craft);
    return craft.CraftSF;
  }


}
