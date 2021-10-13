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
  public MSSCraftModal : boolean = false;
  public SelectedType : string = "MSS";
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
  public PSRClientContractorData: any = [];
  public PSRClientContractorDataOBJ : any = [];
  public PSRModel: any =[];
  public FilteredPSRModel : any =[]
  public ShowMasterPage : boolean =false;
  public skillLibraryForms: FormArray = this.fb.array([]);
  public notification = null;
  public MaintenanceStrategyList : any = [];
  private SkillLibraryAllrecords : any = [];
  public craftModalData : any = [];
  public SavedPCRRecordsList : any = [];
  public SelectedCraftToEdit : any = [];
  public craftEmployeeMappingList : any = [];
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
    this.GetPSRClientContractorData();
    this.GetCEMappingRecords();
  }

  ngOnInit(): void {
    // this.getPrescriptiveRecords();
    // this.MachineEquipmentSelect();
    this.GetMssStartegyList();
    this.getUserSkillRecords();
  //  this.GetSkillMappedData();
  }

  GetCEMappingRecords(){
    const params = new HttpParams()
          .set('userId', this.userModel.UserId)
    this.commonBLervice.getWithParameters(this.PSRAPIs.CEMGetAllRecords, params).subscribe(
      res => {
        this.craftEmployeeMappingList = [];
        this.craftEmployeeMappingList = res;
      }, err=>{console.log(err.error)}
      )
    }

  GetMssStartegyList(){
    this.commonBLervice.getWithoutParameters(this.PSRAPIs.MSSStrategyGetAllRecords).subscribe( 
      (res : any) => {
        res.forEach(element => {
          if(element.Strategy === 'GEP' || element.Strategy === 'CONSTRAINT' || element.Strategy === 'FMEA'){
            element.TYPE = element.Strategy
          }else{
            element.TYPE = "MSS";
          }
        });
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
        this.PSRClientContractorDataOBJ = res;
      });
  }

  public getLevelOfEmployee(fg : any){
    let emp = [
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
    ]
     var empName = emp.find(r=>r.id ==fg.value.EmpId).name;
     let craft = this.PSRClientContractorData.find(a=>a.PSRClientContractorId === fg.value.Craft);
     let d = this.craftEmployeeMappingList.find(p=>p.Craft === craft.CraftSF);
      if(d !== undefined){
        if(d.CraftEmployeeTaskChild.length > 0){
            d.CraftEmployeeTaskChild.forEach(element => {
              let splitData : any = element.EmployeeId.split(/(\d+)/);
              let e = emp.find(c=>c.id === parseFloat(splitData[1])) ;
              fg.value.EMPList.push(e);
               if(element.EmployeeId === empName){
                   fg.patchValue({MTRecord:[]});
                   let obj = {};
                   obj['EmployeeTaskListId']=0;
                   obj['CETChildId']=element.CETChildId;
                   obj['MaintenanceTaskId']= 0;
                   fg.patchValue({MTRecord:[obj]});
                  if(element.CheckOilLevelTopUp !== null && element.CheckOilLevelTopUp !== 0){
                    fg.value.Level = element.CheckOilLevelTopUp;
                  }else if(element.VibrationCheck !== null && element.VibrationCheck !== 0){
                    fg.value.Level = element.VibrationCheck;
                  }else if(element.ScheduleReplacement !== null && element.ScheduleReplacement !== 0){
                    fg.value.Level = element.ScheduleReplacement;
                  }else if(element.ReplaceOnCondition !== null && element.ReplaceOnCondition !== 0){
                    fg.value.Level = element.ReplaceOnCondition;
                  }else if(element.ScheduleOilChange !== null && element.ScheduleOilChange !== 0){
                    fg.value.Level = element.ScheduleOilChange;
                  }
               }
            });
        }
      }
  }

  public getHourlyRate(r : any){
    this.EmployeeList = [
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
    let Data = this.MaintenanceStrategyList.find(a=>a.MSSStrategyModelId == r.value.Task);
    let craft = this.PSRClientContractorData.find(a=>a.PSRClientContractorId === r.value.Craft);
    if(Data !== undefined && craft !== undefined){
       if(r.value.MTRecord.length > 0){
          r.value.MTRecord[0].MaintenanceTaskId = Data.MSSStrategyModelId;
       }
      if(Data.Strategy === 'GEP' || Data.Strategy === 'CONSTRAINT' || Data.Strategy === 'FMEA'){
         r.value.HourlyRate = craft.ClientHourlyRate;
      }else{
        // for MSS
        r.value.HourlyRate = craft.ClientHourlyRate;
      }
    }

    let d = this.craftEmployeeMappingList.find(p=>p.Craft === craft.CraftSF);
    if(d !== undefined){
      if(d.CraftEmployeeTaskChild.length > 0){
        let empList = [];
        let OldEmpList = this.EmployeeList;
        d.CraftEmployeeTaskChild.forEach(element => {
          let splitData : any = element.EmployeeId.split(/(\d+)/);
          let e = OldEmpList.find(c=>c.id === parseFloat(splitData[1])) ;
          empList.push(e);
        });
        this.EmployeeList = [];
        r.value.EMPList = empList;
      }
    }else{
      this.EmployeeList = [];
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
       this.PSRModel = [];
       this.GetSavedPSRRecords();
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
            obj['TYPE']= MSSData.TYPE;
            obj['TaskDuration']= 0 ;
            obj['MaterialCost']= 0 ;
            obj['POC']= 0 ;
            obj['SkillPSRMappingMSS'] = null;
            this.PSRModel.push(obj);
          });
        }else{
          if(MaintenanceTask.length > res.length){
            res.forEach(element => {
              if(element.Strategy !== 'GEP' && element.Strategy !== 'CONSTRAINT' && element.Strategy !=='FMEA'){
                element.TYPE = 'MSS';
              }
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
            obj['TYPE']= MSSData.TYPE;
            obj['HourlyRate']= 0;
            obj['TaskDuration']= 0 ;
            obj['MaterialCost']= 0 ;
            obj['SkillPSRMappingMSS'] = null;
            obj['POC']= 0 ;
            this.PSRModel.push(obj);
           });
          }else if(MaintenanceTask.length === res.length){
            res.forEach(element => {
              if(element.Strategy !== 'GEP' && element.Strategy !== 'CONSTRAINT' && element.Strategy !=='FMEA'){
                element.TYPE = 'MSS';
              }else{
                element.TYPE = element.Strategy;
              }              
              this.PSRModel.push(element);
            });
          }
        }
        this.getFilteredPSRModel();
        this.showPSR = true;
      }, err =>{ console.log(err.error)}
    )
  }

  getFilteredPSRModel(){
    this.FilteredPSRModel = this.PSRModel.filter(r=>r.TYPE === this.SelectedType)
  }


  skillLibraryForm() {
    this.skillLibraryForms.push(this.fb.group({
      SKillLibraryId: [0],
      UserId:[this.userModel.UserId],
      Craft: [0, Validators.required],
      EmpId: [0, Validators.required],
      Task: [0, Validators.required],
      Level: [0, Validators.required],
      HourlyRate: [0, Validators.required],
      EMPList :[[]],
      MTRecord : [[]]
    }));
    this.EmployeeList = [
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
  }

  recordSubmit(fg: FormGroup) {
    if (fg.value.SKillLibraryId == 0){;
      this.commonBLervice.postWithoutHeaders('/CraftEmployeeTaskMappingAPI/PostEmployeeTask',fg.get('MTRecord').value[0])
      .subscribe(
        res => {
          this.commonBLervice.postWithoutHeaders('/SkillLibraryAPI', fg.value).subscribe(
            (res: any) => {
              fg.patchValue({ SKillLibraryId: res.SKillLibraryId });
              this.showNotification('insert');
              this.GetSavedPSRRecords();
            });
        }, err=> {console.log(err.error)}
      )
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
      if(PSRData.Craft !== 0){
        var craft = this.getCraftValue(PSRData);
      }
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
    const params = new HttpParams()
          .set('UserId', this.userModel.UserId)
    this.commonBLervice.getWithParameters('/SkillLibraryAPI/GetAllConfigurationRecords', params).subscribe(
      (res : any) => {
        this.SkillLibraryAllrecords =res;
        if (res.length == 0)
          this.skillLibraryForm();
        else { 
          (res as []).forEach((SKillLibraryModel: any) => { 
            let emp = [
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
            ]
            
            let empList = [];
            var empName = emp.find(r=>r.id ==SKillLibraryModel.EmpId).name;
               let craft = this.PSRClientContractorData.find(a=>a.PSRClientContractorId === SKillLibraryModel.Craft);
               let d = this.craftEmployeeMappingList.find(p=>p.Craft === craft.CraftSF);
                if(d !== undefined){
                  if(d.CraftEmployeeTaskChild.length > 0){
                    d.CraftEmployeeTaskChild.forEach(element => {
                      let splitData : any = element.EmployeeId.split(/(\d+)/);
                      let e = emp.find(c=>c.id === parseFloat(splitData[1])) ;
                      empList.push(e);
                    });
                  }
                }
            this.skillLibraryForms.push(this.fb.group({
              SKillLibraryId: [SKillLibraryModel.SKillLibraryId],
              Craft: [SKillLibraryModel.Craft, Validators.required],
              EmpId: [SKillLibraryModel.EmpId, Validators.required],
              Task: [SKillLibraryModel.Task, Validators.required],
              Level: [SKillLibraryModel.Level, Validators.required],
              HourlyRate: [SKillLibraryModel.HourlyRate, Validators.required],
              EMPList:[empList]
            }));
          });

          this.GetSavedPSRRecords();
        }
      }
    );
  }

  AddCraft(v){
    let tempEmpList = [
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
    ]
    this.SelectedCraftToEdit = v;
    if(v.TYPE !== 'MSS'){
      if(v.TaskDuration !== 0){
        // v.TaskDuration =  v.TaskDuration*52;
         this.generateTaskDuration(v);
       }
       if(this.SelectedCraftToEdit.Craft === 0){
         var data = this.SkillLibraryAllrecords.filter(r=>r.Task === v.MaintenanceTaskId);
         this.craftModalData = [];
         data.forEach(element => {
           var cf = this.PSRClientContractorData.find(r=>r.PSRClientContractorId === element.Craft);
           var em = tempEmpList.find(r=>r.id === element.EmpId);
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
           var em = tempEmpList.find(r=>r.id === element.EmpId);
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
           obj['EmployeeId'] = em.id;
           obj['Level'] = element.Level
           obj['HR'] = element.HourlyRate;
           this.craftModalData.push(obj);
         });
   
       }    
    }
    
    if(v.TYPE == 'MSS'){
      this.MSSCraftModal = true;
      this.PSRClientContractorDataOBJ.forEach(element => {
        element.checked = false
      });
      if(this.SelectedCraftToEdit.SkillPSRMappingMSS !== null){
        this.SelectedCraftToEdit.SkillPSRMappingMSS.forEach(element => {
          let index1 = -1;
          this.PSRClientContractorDataOBJ.find((item, i) => {
            if (item.PSRClientContractorId === element.CraftOriginalId) {
              index1 = i;
              return i;
            }
          });
          this.PSRClientContractorDataOBJ[index1].checked = true;
        });
      }
    }else{
      this.CraftModal = true
    }
    
  }

  MSSCraftSelection(r, e){
    if(e.target.checked === true){
      var fIO = r.PSRClientContractorId
      var index1 = -1;
      var filtObj = this.PSRClientContractorDataOBJ.find((item, i) => {
        if (item.PSRClientContractorId === fIO) {
          index1 = i;
          return i;
        }
      });
      this.PSRClientContractorDataOBJ[index1].checked = true;

      let obj = {}
      obj['SkillPSRMappingMSSId']=0
      if(this.SelectedCraftToEdit.PSRId === undefined){
        obj['PSRId']= 0;
      }else{
        obj['PSRId']=this.SelectedCraftToEdit.PSRId
      }      
      obj['CraftOriginalId']=this.PSRClientContractorDataOBJ[index1].PSRClientContractorId
      obj['HourlyRate'] = 0
      obj['TaskDuration'] = 0
      obj['MaterialCost'] = 0
      obj['POC'] = 0
      obj['MaintenanceTaskId']= this.SelectedCraftToEdit.MaintenanceTaskId;
      obj['EmployeeName'] ='';
      obj['Craft'] = 0;
      if(this.SelectedCraftToEdit.SkillPSRMappingMSS == null){
        this.SelectedCraftToEdit.SkillPSRMappingMSS = []
      }else if(this.SelectedCraftToEdit.SkillPSRMappingMSS == undefined){
        this.SelectedCraftToEdit.SkillPSRMappingMSS = []
      }
      this.SelectedCraftToEdit.SkillPSRMappingMSS.push(obj)
    }
    if(e.target.checked === false){
      var findIndexOF = r.PSRClientContractorId
      var index = -1;
      var filteredObj = this.SelectedCraftToEdit.SkillPSRMappingMSS.find((item, i) => {
        if (item.CraftOriginalId === findIndexOF) {
          index = i;
          return i;
        }
      });
      this.PSRClientContractorDataOBJ[index].checked = false;
      this.SelectedCraftToEdit.SkillPSRMappingMSS.splice(index, 1)
    }

  }

  public ADDMSSCraftTask : any = [];

  AddCraftForMSS(v){
    let tempEmpList = [
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
    ]
    this.ADDMSSCraftTask = v;
    if(v.TaskDuration !== 0){
      this.generateTaskDuration(v);
    }
      var data = this.SkillLibraryAllrecords.filter(r=>r.Task === v.MaintenanceTaskId && r.Craft == v.CraftOriginalId);
      this.craftModalData = [];
      data.forEach(element => {
        var cf = this.PSRClientContractorData.find(r=>r.PSRClientContractorId === element.Craft);
        var em = tempEmpList.find(r=>r.id === element.EmpId);
        let obj = {}
        obj['SKillLibraryId']=element.SKillLibraryId
        if(element.SKillLibraryId === v.Craft){
          obj['Craft'] = cf.CraftSF
          obj['Selected'] = true;
        }else{
          obj['Craft'] = cf.CraftSF
          obj['Selected'] = false;
        }        
        obj['Employee'] = em.name;
        obj['EmployeeId'] = em.id;
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
     if(this.SelectedCraftToEdit.TYPE !== 'MSS'){
      this.SelectedCraftToEdit.Craft = a.SKillLibraryId;
      this.SelectedCraftToEdit.HourlyRate = a.HR;
      this.SelectedCraftToEdit.EmployeeName = a.Employee
     }
     if(this.SelectedCraftToEdit.TYPE === 'MSS'){  
      this.ADDMSSCraftTask.Craft = a.SKillLibraryId;
      this.ADDMSSCraftTask.HourlyRate = a.HR;
      this.ADDMSSCraftTask.EmployeeName = a.Employee
      }  
   }
   if(e.target.checked === false){
     e.Selected = false
     if(this.SelectedCraftToEdit.TYPE !== 'MSS'){
      this.SelectedCraftToEdit.Craft = 0;
      this.SelectedCraftToEdit.HourlyRate = 0;
      this.SelectedCraftToEdit.EmployeeName  = '';
     }
     if(this.SelectedCraftToEdit.TYPE === 'MSS'){ 
      this.ADDMSSCraftTask.Craft = 0;
      this.ADDMSSCraftTask.HourlyRate = 0;
      this.ADDMSSCraftTask.EmployeeName  = '';
     }
     
  }
  if(this.SelectedCraftToEdit.TYPE !== 'MSS'){
    if(this.SelectedCraftToEdit.TaskDuration !== 0){
       this.generateTaskDuration(this.SelectedCraftToEdit);
      }
  }
  if(this.SelectedCraftToEdit.TYPE === 'MSS'){ 
    this.generateTaskDuration(this.ADDMSSCraftTask);
  }
  
  }

  getCraftValue(d){
    var skillData = this.SkillLibraryAllrecords.find(r=>r.SKillLibraryId === d.Craft);
    var craft = this.PSRClientContractorData.find(r=>r.PSRClientContractorId === skillData.Craft);
    return craft.CraftSF;
  }

  getCraftForMSSSelection(d){
    var craft = this.PSRClientContractorData.find(r=>r.PSRClientContractorId === d.CraftOriginalId);
    return craft.CraftSF;
  }


}
