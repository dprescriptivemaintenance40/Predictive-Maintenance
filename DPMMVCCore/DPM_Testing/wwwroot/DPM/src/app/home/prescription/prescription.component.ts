import { HttpClient, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';
import * as XLSX from 'xlsx';
import { PrescriptiveContantAPI } from '../prescriptive/Shared/prescriptive.constant';

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.scss']
})
export class PrescriptionComponent implements OnInit {

  public files: TreeNode[];
  public cols: any[];
  public totalRecords: number;
  public loading: boolean;
  private name: any = [];
  public MachineType: string = "";
  public EquipmentType: string = "";
  public TagNumber: string = "";
  public EquipmentList: any = []
  public TagList: any = [];
  public SelectedTagNumber: string = "";
  public SelectionEnable: boolean = false;
  public InputsEnable: boolean = false;
  public prescriptiveRecords: any = []
  private CBADataList: any = [];
  private RCARecords : any = [];
  public displayModal : boolean = false;
  public CraftList :any = [];
  public CalculatedPOC : number = 0;
  public TaskDuration : number = 0;
  public SelectedCraft : number = 0;
  public MaintenanceTaskList : any= [];
  private PrescriptiveRecordsList : any = [];
  public SkillLibrary: boolean = false;
  public SkillLibraryHeaders : any = [];
  public SkillLibraryRows : any = [];
  public SkillData : any = [];
  public GoodEnginerringRecordsList : any = [];
  public clientContratorForms: FormArray = this.fb.array([]);
  constructor(private http: HttpClient,
    public fb: FormBuilder,
    private commonBLervice : CommonBLService,
    private prescriptiveAPIS : PrescriptiveContantAPI,
    private cdr : ChangeDetectorRef) {
    this.SelectionEnable = true
    this.MachineEquipmentSelect();
    this.getPrescriptiveRecords();
  }

  ngOnInit() {
    this.GetCraftRecords();
    this.getGoodEngineeringRecords();
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'discription', header: 'Description' }
    ];
    this.name = [
      { name: 'Prediction' },
      { name: 'Future Prediction' },
      { name: 'FMEA' },
      { name: 'FCA' },
      { name: 'MSS' },
      { name: 'RCA' },
      { name: 'CBA' },
      // { name: 'PSR' },
      // { name: 'Skill Library' }

    ]

    this.totalRecords = 10;

    this.loading = true;
  }
  // clientContratorForm() {
  //   this.clientContratorForms.push(this.fb.group({
  //     MT: [0],
  //     MI: [''],
  //     Craft: [''],
  //     TD: [],
  //     HR: [],
  //     MatC: [],
  //     POC: []
  //   }));
  // }
  GetCraftRecords(){
    this.commonBLervice.getWithoutParameters(this.prescriptiveAPIS.GetAllConfigurationRecords)
    .subscribe(
      (res : any)=>{
        this.CraftList = [];
        this.CraftList = res;
      }, err => {console.log(err.error)}
    )
  }

  getGoodEngineeringRecords(){
    this.http.get('dist/DPM/assets/GoodEngineeringPratice.xlsx',{responseType:'blob'}).subscribe(
      (res : any) => {
        let fileReader = new FileReader();
                fileReader.readAsArrayBuffer(res);
                fileReader.onload = async (e) => {
                    var arrayBuffer: any = fileReader.result;
                    var data = new Uint8Array(arrayBuffer);
                    var arr = new Array();
                    for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
                    var bstr = arr.join("");
                    var workbook = XLSX.read(bstr, { type: "binary", cellDates: true });
                    var first_sheet_name = workbook.SheetNames[0];
                    var worksheet = workbook.Sheets[first_sheet_name];
                    this.GoodEnginerringRecordsList = await XLSX.utils.sheet_to_json(worksheet, { raw: true });
                }
      }
    )
  }

  gernrateTaskDuration(){
    this.TaskDuration = this.TaskDuration/60;
    var CHR = this.CraftList.filter(f=>f.PSRClientContractorId == this.SelectedCraft)
    this.CalculatedPOC = this.TaskDuration*CHR[0].ClientHourlyRate/1000
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
    var rec : any = this.PrescriptiveRecordsList.filter(res=>res.MachineType === this.MachineType && res.MSSAdded === "1")
      rec.forEach(element => {
        this.TagList.push(element.TagNumber)
      });
  }
  getPrescriptiveRecords() {
    this.http.get('api/PrescriptiveAPI/GetTagNumber')
      .subscribe((res: any) => {
        this.PrescriptiveRecordsList =res;
      });
  }

  getRCARecordsByTagNumber(){
    const params = new HttpParams()
          .set('tagNumber',this.SelectedTagNumber)
    this.http.get('api/RCAAPI/GetRCARecordByTagNumber', {params}).subscribe(
      res =>{
        this.RCARecords = res;
        var RCAQuantitiveTree = JSON.parse(res[0].RCAQuantitiveTree);
      }, err => {
        console.log(err.error)
      }
    )
  }
  goBack(){
    this.InputsEnable = false;
    this.SelectionEnable =true;
  }
  getPrescriptiveRecordsByEqui() {
    if (this.MachineType && this.EquipmentType && this.SelectedTagNumber) {
      this.prescriptiveRecords = [];
      this.http.get(`api/PrescriptiveAPI/GetPrescriptiveByEquipmentType?machine=${this.MachineType}&Equi=${this.EquipmentType}&TagNumber=${this.SelectedTagNumber}`)
        .subscribe((res: any) => {
          this.getRCARecordsByTagNumber();
          this.prescriptiveRecords = res;
          this.MaintenanceTaskList = [];
          this.prescriptiveRecords.centrifugalPumpPrescriptiveFailureModes.forEach(row => {
            row.TotalAnnualPOC = 0;
            row.CentrifugalPumpMssModel.forEach(mss => {
              this.MaintenanceTaskList.push(mss);
              if (!mss.MSSMaintenanceInterval || mss.MSSMaintenanceInterval === 'NA' || mss.MSSMaintenanceInterval === 'Not Applicable') {
                mss.POC = 0;
                mss.AnnualPOC = 0;
                mss.Status = '';
              } else {
                let annu = mss.MSSMaintenanceInterval.split(' ');
                if (mss.MSSMaintenanceInterval.toLowerCase().includes('week')) {
                  mss.POC = 0.00025;
                  mss.AnnualPOC = parseFloat((parseFloat(annu[0]) * 0.00025).toFixed(3));
                } else if (mss.MSSMaintenanceInterval.toLowerCase().includes('month')) {
                  mss.POC = 0.02;
                  mss.AnnualPOC = parseFloat((parseFloat(annu[0]) * 0.02).toFixed(3));
                }
                mss.MSSMaintenanceInterval = `${parseFloat(annu[0]).toFixed(1)} ${annu[1]}`;
                mss.Status = 'Retained';
                row.TotalAnnualPOC += mss.AnnualPOC;
              }
            });
            row.ETBC = 10;
            row.TotalPONC = 20796;
            // row.ETBF = this.ETBF ? this.ETBF : 2;
            row.TotalAnnualCostWithMaintenance = 1.777;
            row.EconomicRiskWithoutMaintenance = row.TotalPONC / row.ETBF;
            row.ResidualRiskWithMaintenance = parseFloat((row.TotalAnnualCostWithMaintenance - row.TotalAnnualPOC).toFixed(3));
            let WithETBCAndPONC = row.TotalPONC / row.ETBC;
            let WithoutETBCAndPONC = row.TotalPONC / 5;
            row.WithMEI = (((row.TotalPONC / row.ETBF) - (row.TotalPONC / row.ETBC)) / WithETBCAndPONC).toFixed(0);
            row.WithOutMEI = (((row.TotalPONC / row.ETBF) - (row.TotalPONC / 5)) / WithoutETBCAndPONC).toFixed(0);
            row.ConsequenceCategory = row.Consequence.split(' ')[0];
          });
          // this.MaintenanceTaskList.forEach((clientContratorModel: any) => { 
          //   this.clientContratorForms.push(this.fb.group({
          //     MT: [clientContratorModel.MSSMaintenanceTask],
          //     MI: [clientContratorModel.MSSMaintenanceInterval],
          //     Craft: [''],
          //     TD: [0],
          //     HR: [0],
          //     MatC: [0],
          //     POC: [0]
          //   }));
          // });
          this.http.get('/api/MSSStartegyAPI/GetAllConfigurationRecords').subscribe(
            (res : any) => {
              this.SkillLibraryHeaders = [];
              var col : number = 3 // 3 because we have 2 fix columns 1- craft and 2- Employee
              this.MaintenanceTaskList.forEach(element => {
                var strategy = element.MSSStartergy.split(' ')[0]
                var abc : any = res.filter(r=>r.Strategy == strategy)
                if(abc.length !== 0){
                  abc[0].CentrifugalPumpMssId = element.CentrifugalPumpMssId;
                  abc[0].CFPPrescriptiveId = element.CFPPrescriptiveId;
                  abc[0].CPPFMId = element.CPPFMId;
                  abc[0].col = col;
                  col = col +1;
                }
                this.SkillLibraryHeaders.push(abc[0]);
              });
            })
            this.http.get('/api/PSRClientContractorAPI/GetAllConfigurationRecords').subscribe(
              (res:any)=>{
                this.SkillLibraryRows = [];
                this.SkillLibraryRows = res;
                this.SelectionEnable = false;
                this.InputsEnable = true;
              }
            )
        }, err => { })
    }
  }

  
  SaveSkillData(){
    this.commonBLervice.postWithHeaders('/PSRClientContractorAPI/PostSkillData', this.SkillData).subscribe(
      res=>{

      }, err=>{}
    )

  }
  getSkillData(row : any, event, col : any){

    var data : any =[];
    if(row !== undefined && col !== undefined && col.MSSStrategyModelId !== undefined && row.PSRClientContractorId !== undefined ){
      data= this.SkillData.filter(r=>r.MSSStrategyModelId == col.MSSStrategyModelId || r.PSRClientContractorId == row.PSRClientContractorId )
    }
    if( col !== undefined && col.MSSStrategyModelId !== undefined){
      data= this.SkillData.filter(r=>r.MSSStrategyModelId == col.MSSStrategyModelId) 
    }
    if( row !== undefined && row.PSRClientContractorId !== undefined ){
    data= this.SkillData.filter(r=>r.PSRClientContractorId == row.PSRClientContractorId )
    }
    if(data.length !== 0){
      var index = -1;
      index = this.SkillData.findIndex(r=>r.CFPPrescriptiveId === data[0].CFPPrescriptiveId)
      this.SkillData[index].MapId= 0
      row !== undefined ? this.SkillData[index].PSRClientContractorId= row.PSRClientContractorId : ''
      row !== undefined ? this.SkillData[index].Employee = row.EmployeeCode : ''
      col !== undefined ? this.SkillData[index].MSSStrategyModelId = col.MSSStrategyModelId : ''
      col !== undefined ? this.SkillData[index].CentrifugalPumpMssId = col.CentrifugalPumpMssId : ''
      col !== undefined ? this.SkillData[index].CFPPrescriptiveId = col.CFPPrescriptiveId : ''
      col !== undefined ? this.SkillData[index].CPPFMId = col.CPPFMId : ''
    }
    else{
      let obj = {}
      obj['MapId'] = 0
      row !== undefined ? obj['PSRClientContractorId'] = row.PSRClientContractorId :''
      row !== undefined ? obj['Employee'] = row.EmployeeCode : ''
      col !== undefined ? obj['CentrifugalPumpMssId'] = col.CentrifugalPumpMssId : ''
      col !== undefined ? obj['CFPPrescriptiveId'] = col.CFPPrescriptiveId : ''
      col !== undefined ? obj['MSSStrategyModelId'] = col.MSSStrategyModelId : ''
      col !== undefined ? obj['CPPFMId'] = col.CPPFMId : ''
      this.SkillData.push(obj)
    }
    row = undefined
    col = undefined
    
  }

  loadNodes(event) {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.files = [];

      for (let i = 0; i < this.name.length; i++) {
        let node = {
          data: {
            name: this.name[i].name,
            discription: 'Type '
          },
          leaf: false
        };

        this.files.push(node);
      }
    }, 1000);
  }

async onNodeExpand(event) {
    this.loading = true;

    setTimeout(() => {
      this.loading = false;
      const node = event.node;
      if(node.data.name == "PSR"){
        this.displayModal = true
      }
      if(node.data.name === "Skill Library"){
        this.SkillLibrary = true
      }
      if (node.data.name === 'CBA' || node.data.name === 'MSS'|| node.data.name === 'FCA'|| node.data.name === 'FMEA') {
        let children = []
        if(this.EquipmentType == 'Screw Compressor'){
          if(node.data.name === 'MSS'){
            children.push(
              { data: { name: 'Good Engineering Practice : Task List' , type:'GEP', discription: 'Maintenance Interval' }, leaf: false  },
            );
          }
        }        
        for (let index = 0; index < this.prescriptiveRecords.centrifugalPumpPrescriptiveFailureModes.length; index++) {
          let d = this.prescriptiveRecords.centrifugalPumpPrescriptiveFailureModes[index]
          children.push(
            { data: { name: `${d.FunctionMode}`, type: node.data.name, discription: 'Failure Mode' }, leaf: false },
          )

        }
        node.children = children;
      }
      if (node.data.name === 'Prediction') {
        node.children = [
          { data: { name:  'Last 7 Days',  discription: 'Normal 80%, Incipient 15%, Degrade 5% ' } },
          { data: { name:  'Last 30 Days',  discription: 'Normal 70%, Incipient 25%, Degrade 5% ' } },
        ]
      }
      if (node.data.name === 'Future Prediction') {
        node.children = [
          { data: { name:  'Last 7 Days',  discription: 'Normal 80%, Incipient 15%, Degrade 5% ' } },
          { data: { name:  'Last 30 Days',  discription: 'Normal 70%, Incipient 25%, Degrade 5% ' } },
        ]
      }
      if (node.data.name === 'RCA') {
        let children = []
        for (let index = 0; index < this.RCARecords.length; index++) {
          children.push(
            { data: { name: `Label : ${this.RCARecords[index].RCALabel}  &  Type : ${JSON.parse(this.RCARecords[index].RCAQuantitiveTree) !== 'None'? 'Quantitative' : 'Qualitative'}`, type: node.data.name, label :`${this.RCARecords[index].RCALabel}`, discription: `Tag Number :${this.RCARecords[index].TagNumber}` }, leaf: false },
          )
        }
        node.children = children;
      }
      if (node.data.name !== 'CBA' || node.data.name !== 'RCA' || node.data.name !== 'FCA' || node.data.name !== 'FMEA' || node.data.name !== 'MSS' || node.data.name !== 'Prediction' || node.data.name !== 'Future Prediction') {
        if(node.data.type === 'RCA'){
          let children = [];
          this.RCARecords.forEach(element => {
              let Availabilty;
              let Year;
              if((element.RCALabel === node.data.label) && (JSON.parse(element.RCAQuantitiveTree) !== 'None')){
                Availabilty =  JSON.parse(element.RCAQuantitiveTree)[0].Availability;
                Year =  JSON.parse(element.RCAQuantitiveTree)[0].years;
                children.push(
                  { data: { name:  'Availabilty',  discription: Availabilty } },
                  { data: { name:  'Years',  discription: Year } },
                )
              }
          });
          node.children = children;
        }
        if (node.data.type === 'CBA') {
          let children = [];
          this.prescriptiveRecords.centrifugalPumpPrescriptiveFailureModes.forEach(element => {
            if (element.FunctionMode === node.data.name) {
              children.push(
                { data: { name: 'ETBC', discription: `${element.ETBC}` } },
                { data: { name: 'Total Annual Cost With Maintenance', discription: `${element.TotalAnnualCostWithMaintenance}` } },
                { data: { name: 'Residual Risk With Maintenance', discription: `${element.ResidualRiskWithMaintenance}` } },
                // { data: { name: '' ,  discription: `${element.TotalPONC}` } },
                { data: { name: 'Total PONC', discription: `${element.TotalPONC}` } },
                { data: { name: 'Total Annual POC', discription: `${element.TotalAnnualPOC}` } },
                { data: { name: 'Total PONC', discription: `${element.TotalPONC}` } }
              )
            }
          });
          node.children = children;
        } else if (node.data.type === 'MSS') {
          let children = [];
          this.prescriptiveRecords.centrifugalPumpPrescriptiveFailureModes.forEach(element => {
            if (element.FunctionMode === node.data.name) {
                element.CentrifugalPumpMssModel.forEach(event => {
                  children.push(
                    { data: { name: 'MSS Startergy' , type:'MSSStartergy', failureMode :element.FunctionMode, strategy :event.MSSStartergy ,  discription: `${event.MSSStartergy}` }, leaf: false  },
                  )
                });
                children.push(
                    { data: { name: 'MSS Avalability' ,  discription: `${element.CentrifugalPumpMssModel[0].MSSFinalAvaliability}` } },
                  )
            }
          });
          node.children = children;
        }else if (node.data.type === 'FCA') {
          let children = [];
          this.prescriptiveRecords.centrifugalPumpPrescriptiveFailureModes.forEach(element => {
            if (element.FunctionMode === node.data.name) {
                  children.push(
                    { data: { name: 'Alpha', discription: `${element.FCAAlpha}` } },
                    { data: { name: 'Beta', discription: `${element.FCABeta}` } },
                    { data: { name: 'FCA Interval', discription: `${element.FCAInterval}` } },
                    { data: { name: 'FCA FFI', discription: `${element.FCAFFI}` } },
                    element.FCAUsefulLife !== 0? { data: { name: 'Useful Life', discription: `${element.FCAUsefulLife}` } } : { data: { name: 'Safe Life', discription: `${element.FCASafeLife}` } },
                  )
            }
          });
          node.children = children;
        }else if (node.data.type === 'FMEA') {
          let children = [];
          this.prescriptiveRecords.centrifugalPumpPrescriptiveFailureModes.forEach(element => {
            if (element.FunctionMode === node.data.name) {
                  children.push(
                    { data: { name: 'Rating', discription: `${element.Rating}` } },
                    { data: { name: 'MaintainenancePractice', discription: `${element.MaintainenancePractice}` } },
                    { data: { name: 'Frequency Maintainenance', discription: `${element.FrequencyMaintainenance}` } },
                    { data: { name: 'Condition Monitoring', discription: `${element.ConditionMonitoring}` } }
                  )
            }
          });
          node.children = children;
        }else if (node.data.type === 'MSSStartergy') {
          let children = [];
          this.prescriptiveRecords.centrifugalPumpPrescriptiveFailureModes.forEach(element => {
            if (element.FunctionMode === node.data.failureMode) {
                element.CentrifugalPumpMssModel.forEach(event => {
                  if(node.data.strategy === event.MSSStartergy){
                    children.push(
                      { data: { name: 'MSS MaintenanceInterval' , discription: `${event.MSSMaintenanceInterval}`} },
                      { data: { name: 'MSS MaintenanceTask' , discription: `${event.MSSMaintenanceTask}`} },
                    )
                  }
                });
            }
          });
          node.children = children;
        }else if (node.data.type === 'GEP') {
          let children = []
          children.push(
            { data: { name: 'Daily' , type:'daily' }, leaf: false  },
            { data: { name: 'Yearly' , type:'yearly' }, leaf: false  },
            { data: { name: 'Half Yearly' , type:'half-yearly' }, leaf: false  },
            { data: { name: '5 Yearly' , type:'5-yearly' }, leaf: false  },
           
          )
          node.children = children;
          this.cdr.detectChanges();          
        }else if (node.data.type === 'daily' || node.data.type === 'yearly' || node.data.type === 'half-yearly' || node.data.type === '5-yearly' ) {
          let children = [] 
          var i =1;
          this.GoodEnginerringRecordsList.forEach(element => {
            if(element.MaintenanceInterval === node.data.type){
              children.push(
                { data: { name: `${i}. ${element.MaintenanceTask}`  , discription: `${element.MaintenanceInterval}`} },
              )
              i = i+1
            }
          });
          node.children = children;
          this.cdr.detectChanges();
          
        }
      }


      // node.children = [
      //   {
      //     data: {
      //       name: node.data.name + ' - 0',
      //       discription: 'File'
      //     },
      //   },
      //   {
      //     data: {
      //       name: node.data.name + ' - 1',
      //       discription: 'File'
      //     }
      //   }
      // ];

      this.files = [...this.files];
    }, 250);

  }
}
