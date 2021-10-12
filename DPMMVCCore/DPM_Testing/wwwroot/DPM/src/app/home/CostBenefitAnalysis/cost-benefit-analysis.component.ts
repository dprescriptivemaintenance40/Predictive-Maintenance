import { ChangeDetectorRef, Component } from "@angular/core";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CommonLoadingDirective } from "src/app/shared/Loading/common-loading.directive";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { CommonBLService } from "src/app/shared/BLDL/common.bl.service";
import * as XLSX from 'xlsx';
import { PrescriptiveContantAPI } from "../prescriptive/Shared/prescriptive.constant";

@Component({
    templateUrl: './cost-benefit-analysis.component.html',
    providers: [MessageService]
})
export class CostBenefitAnalysisComponent {
    public CFPPrescriptiveId : number =0
    public MachineType: string = "";
    public EquipmentType: string = "";
    public TagNumber: string = "";
    public EquipmentList: any = []
    public prescriptiveRecords: any = [];
    public TagList: any = [];
    public FMList: any = [];
    public FMSelected: string = "";
    public SelectedTagNumber: string = "";
    public showPrescriptive: boolean = false;
    public UserDetails: any;
    public showCostBenefitAnalysis: boolean = false;
    public Site: string = '';
    public Plant: string = '';
    public Unit: string = '';
    public ETBF: string;
    public VendorETBF: number=0;
    public MSSETBF: number = 0;
    public CBAReportDetails: any;
    public PrescriptiveRecordsList : any=[]; 
    public CBASavedRecordsList : any=[]; 
    public MSSTaskDetailList : any = [];
    public showDashboard: boolean = false;
    public AddMEIPopup : boolean = false;         
    public RiskMatrixLibraryRecords : any = [];
    public EconmicConsequenceClass : string ="";
    public CriticalityRating : string = "";
    public MaintenanceStrategyList : any =[];
    public SavedPCRRecordsList : any =[];
    public SkillLibraryAllrecords : any =[];
    public PSRClientContractorData : any = [];
    public UserProductionCost : number = 0;
    public GoodEngineeringTaskList : any = [];
    public FMEATaskList : any = [];
    public CBAOBJ : any ={};
    private MSSStrategyReplacePSR : any =[];
    public AlreadySaved : string = "";
    public TagNumberToSave : string = "";
    constructor(private messageService: MessageService,
        private commonLoadingDirective: CommonLoadingDirective,
        private CD: ChangeDetectorRef,
        private commonBLervice : CommonBLService,
        private PSRAPIs : PrescriptiveContantAPI,
        public router: Router,
        private http: HttpClient) {
        this.UserDetails = JSON.parse(localStorage.getItem('userObject'));
        this.GetSavedPSRRecords();
        this.GetUserProductionDetailRecords();
        this.GetPSRClientContractorData();
        this.getUserSkillRecords();
        this.MachineEquipmentSelect();
        this.GetMssStartegyList();
        this.getPrescriptiveRecords();
        this.GetRiskMatrixLibraryRecords();
        // this.MSSTaskDetailList = [
        //     { 'Hours': 48, 'HR': 22.7, 'Craft': 'MEC','Level': 0, 'Status':'Retained' },
        //     { 'Hours': 48, 'HR': 11.4, 'Craft': 'HEL','Level': 25, 'Status':'Retained' },
        //     { 'Hours': 4, 'HR': 22.7, 'Craft': 'ELE' ,'Level': 75, 'Status':'Retained' },
        //     { 'Hours': 24, 'HR': 22.7, 'Craft': 'CTL','Level': 100, 'Status':'Retained' }
        // ]
    }

    public getCheckResult(m : any){
        if(m === true || m === "true"){
            return true;
        }else if(m === false || m === "false"){
            false;
        }
    }

    GetRiskMatrixLibraryRecords(){
        this.http.get('dist/DPM/assets/RiskMatrixLibrary.xlsx', {responseType: 'blob'}).subscribe(
            res=>{
                this.RiskMatrixLibraryRecords = [];
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
                    this.RiskMatrixLibraryRecords =  XLSX.utils.sheet_to_json(worksheet, { raw: true });
                   // this.getTotalEconomicConsequenceClass(2 , 199);
                }
            }, err=>{ console.log(err.error)}
        )
    }

  // function for getting criticality rating
   async getTotalEconomicConsequenceClass(Etbf , value){
        var ClassData : any =[], ETBFCase : any = [];
        this.RiskMatrixLibraryRecords.forEach(element => {
            if(element.Economy === "< 10K"){
                if(value < 10){
                    ClassData = element
                }
            }else if(element.Economy === "10 - 100K"){
                if((value > 10) && (value < 100)){
                    ClassData = element
                }
            }else if(element.Economy === "0.1 - 1M"){
                if((value > 100) && (value < 1000)){
                    ClassData = element
                }
            }else if(element.Economy === "1 - 10M"){
                if((value > 1000) && (value < 10000)){
                    ClassData = element
                }
            }else if(element.Economy === "> 10M"){
                if(value >= 10000){
                    ClassData = element
                }
            }
        });
        ETBFCase.push(this.RiskMatrixLibraryRecords[0])
        ETBFCase.forEach(element => {
            if(element.Medium === "0.5-4 y"){
                if(Etbf >= 0.5 && Etbf < 4){
                    this.EconmicConsequenceClass = "M";
                    this.CriticalityRating = ClassData.Medium;
                }
            }
            if(element.Low === "4-20 y"){
                if((Etbf >= 4) && (Etbf < 20)){
                    this.EconmicConsequenceClass = "L";
                    this.CriticalityRating = ClassData.Low;
                }
            }
            if(element.Negligible === ">20 y"){
                if(Etbf >= 20){
                    this.EconmicConsequenceClass = "N";
                    this.CriticalityRating = ClassData.Negligible;
                }
            }
        });

      return  await { 'EconmicConsequenceClass':this.EconmicConsequenceClass, 'CriticalityRating':this.CriticalityRating}
    }

    private GetSavedPSRRecords(){
        const params = new HttpParams()
              .set('userId', this.UserDetails.UserId)
        this.commonBLervice.getWithParameters('/PSRClientContractorAPI/GetSkillPSRMapping', params)
        .subscribe(
          (res : any) =>{
            this.SavedPCRRecordsList = res;
          })
    }
    private GetMssStartegyList(){
        this.commonBLervice.getWithoutParameters(this.PSRAPIs.MSSStrategyGetAllRecords).subscribe( 
          res => {
            this.MaintenanceStrategyList = res;
            this.GoodEngineeringTaskList = [];
            this.MSSStrategyReplacePSR = [];
            this.FMEATaskList = [];
            this.SavedPCRRecordsList.forEach(element => {
               var Data = this.MaintenanceStrategyList.find(r=>r.MaintenanceTask === element.MaintenanceTask)
               if(Data !== undefined && Data.Strategy === "GEP"){
                  this.GoodEngineeringTaskList.push(element)
               }else if(Data !== undefined && Data.Strategy === "CONSTRAINT"){
                this.MSSStrategyReplacePSR.push(element);
               }else if(Data !== undefined && Data.Strategy === "FMEA"){
                this.FMEATaskList.push(element);
               }else{
                this.MSSTaskDetailList.push(element)
               }
            });
          }
        )
      }

    RouteTodashboard(){
        this.router.navigateByUrl('/Home/Dashboard', { state: { CFPPrescriptiveId: this.CFPPrescriptiveId, ETBF : this.ETBF, CBANAV:3}})
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

        if(this.AlreadySaved === 'N'){
            var list = this.PrescriptiveRecordsList.filter(r=>r.EquipmentType === this.EquipmentType)
            this.TagList = []
            list.forEach(element => {
                this.TagList.push(element.TagNumber)
            });
        }else if(this.AlreadySaved === 'Y'){
            var list = this.CBASavedRecordsList.filter(r=>r.EquipmentType === this.EquipmentType)
            this.TagList = []
            list.forEach(element => {
                this.TagList.push(element.TagNumber)
            });
        }

        if(this.SelectedTagNumber !== ''){
           var list = this.CBASavedRecordsList.filter(r=>r.EquipmentType === this.EquipmentType && r.TagNumber === this.SelectedTagNumber)
            this.FMList = []
            list.forEach(element => {
                this.FMList.push(element.FailureMode)
            }); 
        }
        
    }
    getPrescriptiveRecords() {
            this.http.get('api/PrescriptiveAPI/GetTagNumber')
            .subscribe((res: any) => {
                this.PrescriptiveRecordsList =[]
                this.PrescriptiveRecordsList = res;
            });
        
            const params = new HttpParams()
                  .set('UserId',this.UserDetails.UserId)
            this.http.get('api/PSRClientContractorAPI/GetSavedCBA', {params})
            .subscribe((res: any) => {
                this.CBASavedRecordsList =[]
                this.CBASavedRecordsList = res;
            });
        
    }

    public async getUncheckedTask(p , e){
        if(e.target.checked === true){
            p.Checked = true
            if(p.CentrifugalPumpMssId === "MSS"){
                this.CBAReportDetails.CentrifugalPumpMssModel.forEach((element, index) => { 
                    if(element.CentrifugalPumpMssId === "MSS"){
                        element.Checked = true;
                    }
                })

                for (let index = 0; index < this.CBAReportDetails.CentrifugalPumpMssModel.length; index++) {
                    this.CBAReportDetails.CentrifugalPumpMssModel.forEach((element, index) => { 
                        if(element.CentrifugalPumpMssId === "CONSTRAINT"){
                            this.CBAReportDetails.CentrifugalPumpMssModel.splice(index,1);
                         }
                     })
                     var fil = this.CBAReportDetails.CentrifugalPumpMssModel.filter(r=>r.CentrifugalPumpMssId === "CONSTRAINT")
                     if(fil.length === 0){
                         break;
                     }
                }
            }
        }else if(e.target.checked === false){
            p.Checked = false
            if(p.CentrifugalPumpMssId === "MSS"){
                this.CBAReportDetails.CentrifugalPumpMssModel.forEach(element => { 
                    if(element.CentrifugalPumpMssId === "MSS"){
                        element.Checked = false;
                    }
                })
                var d =  this.CBAReportDetails.CentrifugalPumpMssModel.filter(r=>r.CentrifugalPumpMssId === 'NEW');
                if(d.length === 0){
                    this.MSSStrategyReplacePSR.forEach(element => {
                        let CRAFT = this.getCraftValue(element);
                        let LEVEL = this.getEmployeeLevelValue(element);
                        let obj ={}
                        obj['CentrifugalPumpMssId']="CONSTRAINT";
                        obj['Checked']= true;
                        obj['MSSMaintenanceTask']=element.MaintenanceTask;
                        this.MaintenanceStrategyList
                        obj['Progress']= 0;
                        if(element.MaintenanceTask == "Modify piping to Purge dry air to 1st stage outlet to prevent moisture ingress during standstill"){
                            obj['Hours']= '2 hrs';
                            obj['AnnualPOC']= (parseFloat(element.MaterialCost) + parseFloat(element.POC)).toFixed(3);
                            obj['Status']= 'New';
                            obj['MSSMaintenanceInterval']="20 Years";
                        }else if(element.MaintenanceTask == "Change-over @3-4 days between Operating and standby compressors"){
                            obj['Hours']= '0.25 hrs';
                            obj['AnnualPOC']=(parseFloat(element.MaterialCost) + parseFloat(element.POC)).toFixed(3);
                            obj['Status']= 'New'; 
                            obj['MSSMaintenanceInterval']="3 Days";
                        }else if( element.MaintenanceTask == "Defer rotor assembly replacement when predction clasification sharply moves from incipient to degraded state - MEC"){
                            obj['Hours']= '48 hrs';
                            obj['AnnualPOC']= (parseFloat(element.MaterialCost) + parseFloat(element.POC)).toFixed(3);
                            obj['Status']= 'New'; 
                            obj['MSSMaintenanceInterval']="10 Years"; 
                        }else if(element.MaintenanceTask == "Defer rotor assembly replacement when predction clasification sharply moves from incipient to degraded state - HEL"){
                            obj['Hours']= '24 hrs';
                            obj['AnnualPOC']= (parseFloat(element.MaterialCost) + parseFloat(element.POC)).toFixed(3);
                            obj['Status']= 'New'; 
                            obj['MSSMaintenanceInterval']="10 Years";
                        }else if(element.MaintenanceTask == "Defer rotor assembly replacement when predction clasification sharply moves from incipient to degraded state - CTL"){
                            obj['Hours']= '12 hrs';
                            obj['AnnualPOC']= (parseFloat(element.MaterialCost) + parseFloat(element.POC)).toFixed(3);
                            obj['Status']= 'New'; 
                            obj['MSSMaintenanceInterval']="10 Years";
                        }else if(element.MaintenanceTask == "Defer rotor assembly replacement when predction clasification sharply moves from incipient to degraded state - ELE"){
                            obj['Hours']= '4 hrs';
                            obj['AnnualPOC']= (parseFloat(element.MaterialCost) + parseFloat(element.POC)).toFixed(3);
                            obj['Status']= 'New'; 
                            obj['MSSMaintenanceInterval']="10 Years";
                        }
                        obj['Craft']= CRAFT;
                        obj['Level']= LEVEL;
                        obj['MSSIntervalSelectionCriteria']='Resource Leveling Recommendation';
                        this.CBAReportDetails.CentrifugalPumpMssModel.push(obj)
                    });
                }
                
            }
        }

        var levelCount : number = 0;
        var WithDPMConstraint : number= 0;
        var TotalAnnualPOC : number = 0;
        var counter =0;
        this.CBAReportDetails.CentrifugalPumpMssModel.forEach(element => {
            if(element.Checked === true){
                counter = counter +1;
                levelCount = levelCount + parseFloat(element.Level)
                if(element.CentrifugalPumpMssId === 'GDE'  || element.CentrifugalPumpMssId === 'MSS' || element.CentrifugalPumpMssId === 'CONSTRAINT' || element.CentrifugalPumpMssId === 'FMEA'){
                    if(element.CentrifugalPumpMssId === 'CONSTRAINT'){
                        if(element.Status == "Retained"){
                            WithDPMConstraint = WithDPMConstraint + parseFloat(element.AnnualPOC);
                        }else if(element.Status == "New"){
                            WithDPMConstraint = WithDPMConstraint + parseFloat(element.AnnualPOC);
                        }
                    }                
                    TotalAnnualPOC = TotalAnnualPOC + parseFloat(element.AnnualPOC); 
                }
            }
            
        });
        
            levelCount = levelCount / (counter * 100); 
            this.CBAReportDetails.WithDPMConstraint = WithDPMConstraint.toFixed(0);
            this.CBAReportDetails.TotalAnnualPOC =TotalAnnualPOC.toFixed(3);

            var WithDPMConstraintCR =  await this.getTotalEconomicConsequenceClass((this.MSSETBF * levelCount), (WithDPMConstraint /1000).toFixed(0));
            this.CBAReportDetails.EconomicRiskWithDPMConstraintCR = WithDPMConstraintCR.CriticalityRating;
            this.CBAOBJ.LevelCount = levelCount;
            this.CBAOBJ.TotalAnnualPOC = TotalAnnualPOC.toFixed(3);;
            this.CBAOBJ.TotalPONC = this.UserProductionCost;
            this.CBAOBJ.ETBF = this.ETBF;
            this.CBAOBJ.VendorETBC = this.VendorETBF;
            this.CBAOBJ.OverallETBC = this.MSSETBF;
            this.CBAOBJ.EconomicRiskWithDPMConstraintCR = WithDPMConstraintCR.CriticalityRating;  
            this.CBAOBJ.EconomicRiskWithDPMConstraint = WithDPMConstraint.toFixed(0);
            var WDC : number= await this.getValue(WithDPMConstraintCR.CriticalityRating);
            this.CBAOBJ.EconomicRiskWithDPMConstraintCRValue = WDC;
            this.CBAOBJ.CBATaskModel = []
            this.CBAOBJ.CBATaskModel = this.CBAReportDetails.CentrifugalPumpMssModel;
            localStorage.removeItem('CBAOBJ');
            localStorage.setItem('CBAOBJ', JSON.stringify(this.CBAOBJ));
            this.getMEI();
    }

    onlyNumbers(event) {
        const pattern = /[0-9]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
          event.preventDefault();
    
        }
      }
    GetUserProductionDetailRecords(){
        const params = new HttpParams()
              .set('UserId', this.UserDetails.UserId)
        this.commonBLervice.getWithParameters(this.PSRAPIs.GetUserProductionDetail, params).subscribe(
         (res : any) => { 
            this.UserProductionCost = 0;
            var labor = 0;
             res.forEach(element => {
                 if(element.Item === 'Craftsmen' || element.Item === 'Operator' || element.Item === 'Staff' || element.Item === 'Contractor'){
                    labor = labor + element.TotalCost;
                 }else  if(element.Item !== 'Craftsmen' || element.Item !== 'Operator' || element.Item !== 'Staff' || element.Item !== 'Contractor'){
                    this.UserProductionCost = this.UserProductionCost + element.TotalCost;
                 }
                
             });
             this.UserProductionCost = this.UserProductionCost + (labor/1000);
             this.UserProductionCost = this.UserProductionCost * 1000
          }, err=> {console.log(err.error)})
    }
  async  getPrescriptiveRecordsByEqui() {
    if(this.AlreadySaved === 'N'){
        if (this.MachineType && this.EquipmentType && this.SelectedTagNumber) {
            this.prescriptiveRecords = [];
            this.CBAReportDetails = undefined;
            this.http.get(`api/PrescriptiveAPI/GetPrescriptiveByEquipmentType?machine=${this.MachineType}&Equi=${this.EquipmentType}&TagNumber=${this.SelectedTagNumber}`)
                .subscribe( async (res: any) => {
                    this.prescriptiveRecords = res;
                    this.TagNumberToSave = res.TagNumber;
                    this.showPrescriptive = true;
                }, err => {
                    console.log(err.err);
                });
        } else {
            this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Please select all three fields." })
        }
    }
    if(this.AlreadySaved === 'Y'){
        var list = this.CBASavedRecordsList.filter(r=>r.EquipmentType === this.EquipmentType && r.TagNumber === this.SelectedTagNumber && r.FailureMode == this.FMSelected)
        this.prescriptiveRecords = [];
        this.CBAReportDetails = [];
        this.showPrescriptive = true;
        this.CBAReportDetails.VendorPOC = list[0].VendorPOC.toFixed(2);
        this.CBAReportDetails.ResidualRiskWithMaintenance = list[0].ResidualRiskWithMaintenance.toFixed(2);
        this.CBAReportDetails.WithDPM = list[0].EconomicRiskWithDPM.toFixed(2);
        this.CBAReportDetails.WithOutDPM = list[0].EconomicRiskWithOutDPM.toFixed(2);
        this.CBAReportDetails.WithDPMConstraint = list[0].EconomicRiskWithDPMConstraint.toFixed(2);
        this.CBAReportDetails.TotalAnnualPOC = list[0].TotalAnnualPOC.toFixed(2);
        this.CBAReportDetails.FunctionMode = list[0].FailureMode
        this.CBAReportDetails.CentrifugalPumpMssModel = [];
        list[0].CBATaskModel.forEach(element => {
            this.CBAReportDetails.CentrifugalPumpMssModel.push(element)
        });
        this.CBAOBJ =[];
        this.CBAOBJ = list[0]
        this.MSSETBF = list[0].OverallETBC;
        this.VendorETBF = list[0].VendorETBC;
    }
    }

    public GenerateCostBenefitReport() {
        if (this.Site && this.Plant && this.Unit && this.AlreadySaved) {
            this.showCostBenefitAnalysis = true;
        } else {
            this.messageService.add({ severity: 'info', summary: 'note', detail: "Please fill all four fields Already saved, Site, Plant, Unit. " })
        }
    }

    public async OpenCBAReport(row) {
        this.CBAReportDetails = []
        this.CBAReportDetails = row;
        var TotalAnuualPOC : number = 0;
        var count : number= 0;
        // var VendorPONC : number = 0;
        var levelCount : number = 0;
        //************************* */
        var WithDPM : number= 0;
        var WithOutDPM : number= 0;
        var TotalAnnualPOC : number = 0
        var vendorPOC : number = 0;
        var Exist = this.CBAReportDetails.CentrifugalPumpMssModel.find(r => r.CentrifugalPumpMssId === "GDE");
        if(Exist === undefined){
            this.CBAReportDetails.CentrifugalPumpMssModel.forEach(element => {
                if(element.CentrifugalPumpMssId == "GDE"){
                    count = count + 1;
                }else{
                    if(this.prescriptiveRecords.Type === "CA"){
                        this.MSSTaskDetailList.forEach(r => {
                            if(row.CentrifugalPumpMssModel[0].MSSMaintenanceTask === r.MaintenanceTask){
                                if(r.SkillPSRMappingMSS.length > 0){
                                    r.SkillPSRMappingMSS.forEach(a => {
                                        let obj ={}
                                        var CRAFTData = this.PSRClientContractorData.find(res=>res.PSRClientContractorId === a.CraftOriginalId);
                                        var LEVELData = this.SkillLibraryAllrecords.find(res=>res.SKillLibraryId === a.Craft);
                                        obj['Craft']= CRAFTData.CraftSF;
                                        var weeks = element.MSSMaintenanceInterval.split(" ")[0];
                                        var Years = (parseFloat(weeks)/52).toFixed(0);
                                        if(parseFloat(Years) < 1){
                                            Years = "1"; 
                                        }
                                       // obj['AnnualPOC']= ((parseFloat(a.TaskDuration) * parseFloat(a.HourlyRate)) / parseFloat(Years)).toFixed(3) 
                                        var abc = ((parseFloat(a.TaskDuration) * parseFloat(a.HourlyRate)) / parseFloat(Years)).toFixed(3)
                                        obj['AnnualPOC'] = (parseFloat(abc) + parseFloat(a.MaterialCost)).toFixed(2) 
                                        obj['Level']= LEVELData.Level;
                                        obj['MSSIntervalSelectionCriteria']=element.MSSIntervalSelectionCriteria
                                        obj['CentrifugalPumpMssId']="MSS";
                                        obj['Checked']= true;
                                        obj['MSSMaintenanceTask']=element.MSSMaintenanceTask;
                                        obj['Hours']= `${a.TaskDuration} hrs`;
                                        obj['Status']= 'Retained';
                                        obj['Progress']= 0;
                                        obj['MSSMaintenanceInterval']=element.MSSMaintenanceInterval;
                                        this.CBAReportDetails.CentrifugalPumpMssModel.push(obj)
                                        WithDPM = WithDPM + ((parseFloat(a.TaskDuration) * parseFloat(a.HourlyRate)) / parseFloat(Years))
                                        TotalAnnualPOC = TotalAnnualPOC + (parseFloat(abc) + parseFloat(a.MaterialCost));
                                        levelCount = levelCount + parseFloat(LEVELData.Level);
                                    });
                                }
                            }
                        });
                        // TotalAnuualPOC = TotalAnuualPOC + element.AnnualPOC;
                        // levelCount = levelCount + element.Level
                        // WithDPM = WithDPM + parseFloat(element.AnnualPOC);
                    }
                }
            });
            if(this.prescriptiveRecords.Type === "SCA"){
                var PM = [
                    {'id':'FMEA', 'MT':'PM - MEC', 'HR':'6 hrs'},
                    {'id':'FMEA', 'MT':'PM - ELE', 'HR':'3 hrs'},
                    {'id':'FMEA', 'MT':'PM - CTL', 'HR':'4 hrs'},
                    {'id':'FMEA', 'MT':'PM - HEL', 'HR':'3 hrs'},
                    {'id':'FMEA', 'MT':'PM - OPS', 'HR':'1 hr'},
                ];
                var BD = [
                    {'id':'FMEA', 'MT':'Breakdown Maintenance - MEC', 'HR':'24 hrs'},
                    {'id':'FMEA', 'MT':'Breakdown Maintenance - ELE', 'HR':'12 hrs'},
                    {'id':'FMEA', 'MT':'Breakdown Maintenance - CTL', 'HR':'16 hrs'},
                    {'id':'FMEA', 'MT':'Breakdown Maintenance - HEL', 'HR':'12 hrs'},
                    {'id':'FMEA', 'MT':'Breakdown Maintenance - OPS', 'HR':'4 hr'},
                ];
                if(this.CBAReportDetails.MaintainenancePractice === "CBM and OBM Both"){
                    let obj = {};
                    obj['CentrifugalPumpMssId']="FMEA";
                    obj['MSSIntervalSelectionCriteria']= "FMEA";
                    obj['Checked']= true;
                    obj['Hours']=  '0.25 hrs';  
                    obj['MSSMaintenanceTask'] = this.CBAReportDetails.MaintainenancePractice ;
                    var data = this.FMEATaskList.find(r=>r.MaintenanceTask ===  this.CBAReportDetails.MaintainenancePractice)
                    let CRAFT = this.getCraftValue(data);
                    let LEVEL = this.getEmployeeLevelValue(data);
                    obj['Craft']= CRAFT;
                    obj['Level']= LEVEL;
                    obj['AnnualPOC']= (parseFloat(data.MaterialCost) + parseFloat(data.POC)).toFixed(3);
                    obj['Status']= 'Retained';
                    obj['Progress']= 0;
                    obj['MSSMaintenanceInterval']="Daily";
                    WithDPM = WithDPM + (parseFloat(data.MaterialCost) + parseFloat(data.POC));
                    WithOutDPM = WithOutDPM + (parseFloat(data.MaterialCost) + parseFloat(data.POC));
                    TotalAnnualPOC = TotalAnnualPOC + parseFloat(data.POC) + parseFloat(data.MaterialCost);
                    vendorPOC = vendorPOC + parseFloat(data.POC) + parseFloat(data.MaterialCost);
                    this.CBAReportDetails.CentrifugalPumpMssModel.push(obj)

                    obj = {};
                    obj['CentrifugalPumpMssId']="FMEA";
                    obj['MSSIntervalSelectionCriteria']= "FMEA";
                    obj['Checked']= true;
                    obj['Hours']=  '0.5 hrs';  
                    obj['MSSMaintenanceTask'] = this.CBAReportDetails.MaintainenancePractice ;
                    data = this.FMEATaskList.find(r=>r.MaintenanceTask ===  this.CBAReportDetails.MaintainenancePractice)
                    CRAFT = this.getCraftValue(data);
                    LEVEL = this.getEmployeeLevelValue(data);
                    obj['Craft']= CRAFT;
                    obj['Level']= LEVEL;
                    obj['AnnualPOC']= (parseFloat(data.MaterialCost) + parseFloat(data.POC)).toFixed(3);
                    obj['Status']= 'Retained';
                    obj['Progress']= 0;
                    obj['MSSMaintenanceInterval']="1 Week";
                    WithDPM = WithDPM + (parseFloat(data.MaterialCost) + parseFloat(data.POC));
                    WithOutDPM = WithOutDPM + (parseFloat(data.MaterialCost) + parseFloat(data.POC));
                    TotalAnnualPOC = TotalAnnualPOC + parseFloat(data.POC) + parseFloat(data.MaterialCost);
                    vendorPOC = vendorPOC + parseFloat(data.POC) + parseFloat(data.MaterialCost);
                    this.CBAReportDetails.CentrifugalPumpMssModel.push(obj)

                    obj = {};
                    obj['CentrifugalPumpMssId']="FMEA";
                    obj['MSSIntervalSelectionCriteria']= "FMEA";
                    obj['Checked']= true;
                    obj['Hours']=  '1 hr';  
                    obj['MSSMaintenanceTask'] = 'Vibration Monitoring' ;
                    var data = this.FMEATaskList.find(r=>r.MaintenanceTask ===  'Vibration Monitoring')
                    CRAFT = this.getCraftValue(data);
                    LEVEL = this.getEmployeeLevelValue(data);
                    obj['Craft']= CRAFT;
                    obj['Level']= LEVEL;
                    obj['AnnualPOC']= (parseFloat(data.MaterialCost) + parseFloat(data.POC)).toFixed(3);
                    obj['Status']= 'Retained';
                    obj['Progress']= 0;
                    obj['MSSMaintenanceInterval']="4 Week";
                    WithDPM = WithDPM + (parseFloat(data.MaterialCost) + parseFloat(data.POC));
                    WithOutDPM = WithOutDPM + (parseFloat(data.MaterialCost) + parseFloat(data.POC));
                    TotalAnnualPOC = TotalAnnualPOC + parseFloat(data.POC) + parseFloat(data.MaterialCost);
                    vendorPOC = vendorPOC + parseFloat(data.POC) + parseFloat(data.MaterialCost);
                    this.CBAReportDetails.CentrifugalPumpMssModel.push(obj)
                    
                }else if(this.CBAReportDetails.MaintainenancePractice === 'PM'){
                    PM.forEach(element => {
                        let obj = {};
                        obj['CentrifugalPumpMssId']="FMEA";
                        obj['MSSIntervalSelectionCriteria']= "FMEA";
                        obj['Checked']= true;
                        obj['Hours']=  element.HR;  
                        obj['MSSMaintenanceTask'] = element.MT ;
                        var data = this.FMEATaskList.find(r=>r.MaintenanceTask ===  element.MT)
                        let CRAFT = this.getCraftValue(data);
                        let LEVEL = this.getEmployeeLevelValue(data);
                        obj['Craft']= CRAFT;
                        obj['Level']= LEVEL;
                        obj['AnnualPOC']= (parseFloat(data.MaterialCost) + parseFloat(data.POC)).toFixed(3);
                        obj['Status']= 'Retained';
                        obj['Progress']= 0;
                        obj['MSSMaintenanceInterval']="26 Week";
                        WithDPM = WithDPM + (parseFloat(data.MaterialCost) + parseFloat(data.POC));
                        WithOutDPM = WithOutDPM + (parseFloat(data.MaterialCost) + parseFloat(data.POC));
                        TotalAnnualPOC = TotalAnnualPOC + parseFloat(data.POC) + parseFloat(data.MaterialCost);
                        vendorPOC = vendorPOC + parseFloat(data.POC) + parseFloat(data.MaterialCost);
                        this.CBAReportDetails.CentrifugalPumpMssModel.push(obj)
                    });
                    let obj = {};
                    obj['CentrifugalPumpMssId']="FMEA";
                    obj['MSSIntervalSelectionCriteria']= "FMEA";
                    obj['Checked']= true;
                    obj['Hours']=  '1 hr';  
                    obj['MSSMaintenanceTask'] = 'Vibration Monitoring' ;
                    var data = this.FMEATaskList.find(r=>r.MaintenanceTask ===  'Vibration Monitoring')
                    let CRAFT = this.getCraftValue(data);
                    let LEVEL = this.getEmployeeLevelValue(data);
                    obj['Craft']= CRAFT;
                    obj['Level']= LEVEL;
                    obj['AnnualPOC']= (parseFloat(data.MaterialCost) + parseFloat(data.POC)).toFixed(3);
                    obj['Status']= 'Retained';
                    obj['Progress']= 0;
                    obj['MSSMaintenanceInterval']="4 Week";
                    WithDPM = WithDPM + (parseFloat(data.MaterialCost) + parseFloat(data.POC));
                    WithOutDPM = WithOutDPM + (parseFloat(data.MaterialCost) + parseFloat(data.POC));
                    TotalAnnualPOC = TotalAnnualPOC + parseFloat(data.POC) + parseFloat(data.MaterialCost);
                    vendorPOC = vendorPOC + parseFloat(data.POC) + parseFloat(data.MaterialCost);
                    this.CBAReportDetails.CentrifugalPumpMssModel.push(obj)

                }else if(this.CBAReportDetails.MaintainenancePractice === "Breakdown Maintenance"){
                    BD.forEach(element => {
                        let obj = {};
                        obj['CentrifugalPumpMssId']="FMEA";
                        obj['MSSIntervalSelectionCriteria']= "FMEA";
                        obj['Checked']= true;
                        obj['Hours']=  element.HR;  
                        obj['MSSMaintenanceTask'] = element.MT ;
                        var data = this.FMEATaskList.find(r=>r.MaintenanceTask ===  element.MT)
                        let CRAFT = this.getCraftValue(data);
                        let LEVEL = this.getEmployeeLevelValue(data);
                        obj['Craft']= CRAFT;
                        obj['Level']= LEVEL;
                        obj['AnnualPOC']= (parseFloat(data.MaterialCost) + parseFloat(data.POC)).toFixed(3);
                        obj['Status']= 'Retained';
                        obj['Progress']= 0;
                        obj['MSSMaintenanceInterval']="26 Week";
                        WithDPM = WithDPM + (parseFloat(data.MaterialCost) + parseFloat(data.POC));
                        WithOutDPM = WithOutDPM + (parseFloat(data.MaterialCost) + parseFloat(data.POC));
                        TotalAnnualPOC = TotalAnnualPOC + parseFloat(data.POC) + parseFloat(data.MaterialCost);
                        vendorPOC = vendorPOC + parseFloat(data.POC) + parseFloat(data.MaterialCost);
                        this.CBAReportDetails.CentrifugalPumpMssModel.push(obj)
                    });
                }else if(this.CBAReportDetails.MaintainenancePractice === "TBM"){
                    let obj = {};
                    obj['CentrifugalPumpMssId']="FMEA";
                    obj['MSSIntervalSelectionCriteria']= "FMEA";
                    obj['Checked']= true;
                    obj['Hours']=  '2 hrs';  
                    obj['MSSMaintenanceTask'] = this.CBAReportDetails.MaintainenancePractice ;
                    var data = this.FMEATaskList.find(r=>r.MaintenanceTask ===  this.CBAReportDetails.MaintainenancePractice)
                    let CRAFT = this.getCraftValue(data);
                    let LEVEL = this.getEmployeeLevelValue(data);
                    obj['Craft']= CRAFT;
                    obj['Level']= LEVEL;
                    obj['AnnualPOC']= (parseFloat(data.MaterialCost) + parseFloat(data.POC)).toFixed(3);
                    obj['Status']= 'Retained';
                    obj['Progress']= 0;
                    obj['MSSMaintenanceInterval']="4 Week";
                    WithDPM = WithDPM + (parseFloat(data.MaterialCost) + parseFloat(data.POC));
                    WithOutDPM = WithOutDPM + (parseFloat(data.MaterialCost) + parseFloat(data.POC));
                    TotalAnnualPOC = TotalAnnualPOC + parseFloat(data.POC) + parseFloat(data.MaterialCost);
                    vendorPOC = vendorPOC + parseFloat(data.POC) + parseFloat(data.MaterialCost);
                    this.CBAReportDetails.CentrifugalPumpMssModel.push(obj)
                }else if(this.CBAReportDetails.MaintainenancePractice === "CBM"){ 
                    let obj = {};
                    obj['CentrifugalPumpMssId']="FMEA";
                    obj['MSSIntervalSelectionCriteria']= "FMEA";
                    obj['Checked']= true;
                    obj['Hours']=  '0.25 hrs';  
                    obj['MSSMaintenanceTask'] = this.CBAReportDetails.MaintainenancePractice ;
                    var data = this.FMEATaskList.find(r=>r.MaintenanceTask ===  this.CBAReportDetails.MaintainenancePractice)
                    let CRAFT = this.getCraftValue(data);
                    let LEVEL = this.getEmployeeLevelValue(data);
                    obj['Craft']= CRAFT;
                    obj['Level']= LEVEL;
                    obj['AnnualPOC']= (parseFloat(data.MaterialCost) + parseFloat(data.POC)).toFixed(3);
                    obj['Status']= 'Retained';
                    obj['Progress']= 0;
                    obj['MSSMaintenanceInterval']="Daily";
                    WithDPM = WithDPM + (parseFloat(data.MaterialCost) + parseFloat(data.POC));
                    WithOutDPM = WithOutDPM + (parseFloat(data.MaterialCost) + parseFloat(data.POC));
                    TotalAnnualPOC = TotalAnnualPOC + parseFloat(data.POC) + parseFloat(data.MaterialCost);
                    vendorPOC = vendorPOC + parseFloat(data.POC) + parseFloat(data.MaterialCost);
                    this.CBAReportDetails.CentrifugalPumpMssModel.push(obj)
                }else if(this.CBAReportDetails.MaintainenancePractice === "OBM"){  
                    let obj = {};
                    obj['CentrifugalPumpMssId']="FMEA";
                    obj['MSSIntervalSelectionCriteria']= "FMEA";
                    obj['Checked']= true;
                    obj['Hours']=  '0.5 hrs';  
                    obj['MSSMaintenanceTask'] = this.CBAReportDetails.MaintainenancePractice ;
                    var data = this.FMEATaskList.find(r=>r.MaintenanceTask ===  this.CBAReportDetails.MaintainenancePractice)
                    let CRAFT = this.getCraftValue(data);
                    let LEVEL = this.getEmployeeLevelValue(data);
                    obj['Craft']= CRAFT;
                    obj['Level']= LEVEL;
                    obj['AnnualPOC']= (parseFloat(data.MaterialCost) + parseFloat(data.POC)).toFixed(3);
                    obj['Status']= 'Retained';
                    obj['Progress']= 0;
                    obj['MSSMaintenanceInterval']="1 Week";
                    WithDPM = WithDPM + (parseFloat(data.MaterialCost) + parseFloat(data.POC));
                    WithOutDPM = WithOutDPM + (parseFloat(data.MaterialCost) + parseFloat(data.POC));
                    TotalAnnualPOC = TotalAnnualPOC + parseFloat(data.POC) + parseFloat(data.MaterialCost);
                    vendorPOC = vendorPOC + parseFloat(data.POC) + parseFloat(data.MaterialCost);
                    this.CBAReportDetails.CentrifugalPumpMssModel.push(obj)

                    obj = {};
                    obj['CentrifugalPumpMssId']="FMEA";
                    obj['MSSIntervalSelectionCriteria']= "FMEA";
                    obj['Checked']= true;
                    obj['Hours']=  '1 hr';  
                    obj['MSSMaintenanceTask'] = 'Vibration Monitoring' ;
                    var data = this.FMEATaskList.find(r=>r.MaintenanceTask ===  'Vibration Monitoring')
                    CRAFT = this.getCraftValue(data);
                    LEVEL = this.getEmployeeLevelValue(data);
                    obj['Craft']= CRAFT;
                    obj['Level']= LEVEL;
                    obj['AnnualPOC']= (parseFloat(data.MaterialCost) + parseFloat(data.POC)).toFixed(3);
                    obj['Status']= 'Retained';
                    obj['Progress']= 0;
                    obj['MSSMaintenanceInterval']="4 Week";
                    WithDPM = WithDPM + (parseFloat(data.MaterialCost) + parseFloat(data.POC));
                    WithOutDPM = WithOutDPM + (parseFloat(data.MaterialCost) + parseFloat(data.POC));
                    TotalAnnualPOC = TotalAnnualPOC + parseFloat(data.POC) + parseFloat(data.MaterialCost);
                    vendorPOC = vendorPOC + parseFloat(data.POC) + parseFloat(data.MaterialCost);
                    this.CBAReportDetails.CentrifugalPumpMssModel.push(obj)
                }
                
            }
                this.GoodEngineeringTaskList.forEach(element => {
                    let CRAFT = this.getCraftValue(element);
                    let LEVEL = this.getEmployeeLevelValue(element);
                    let obj ={}
                    obj['CentrifugalPumpMssId']="GDE";
                    obj['Checked']= true;
                    obj['MSSMaintenanceTask']=element.MaintenanceTask;
                    this.MaintenanceStrategyList
                    if(element.MaintenanceTask == "Weekly site observation as per log sheet - OCM" || element.MaintenanceTask == "Weekly site observation as per log sheet - REL"){
                        obj['Hours']= '0.25 hrs';
                        obj['AnnualPOC']= (element.POC).toFixed(3);
                        obj['Status']= 'Retained';
                        WithDPM = WithDPM + parseFloat(element.POC);
                        WithOutDPM = WithOutDPM + parseFloat(element.POC);
                        obj['MSSMaintenanceInterval']="1 Week";
                        TotalAnnualPOC = TotalAnnualPOC + parseFloat(element.POC);
                        vendorPOC = vendorPOC + parseFloat(element.POC);
                    }else if(element.MaintenanceTask == "Oil Sampling, Oil/Air Filter Replace, Align (Laser), &  clean intake vents"){
                        obj['Hours']= '12 hrs';
                        obj['AnnualPOC']= (element.POC).toFixed(3);
                        obj['Status']= 'Retained'; 
                        WithDPM = WithDPM + parseFloat(element.POC);
                        WithOutDPM = WithOutDPM + parseFloat(element.POC);
                        obj['MSSMaintenanceInterval']="52 Weeks";
                        TotalAnnualPOC = TotalAnnualPOC + parseFloat(element.POC);
                        vendorPOC = vendorPOC + parseFloat(element.POC);
                    }else if( element.MaintenanceTask == "esd system function check"){
                        obj['Hours']= '6 hrs';
                        obj['AnnualPOC']= (element.POC).toFixed(3);
                        obj['Status']= 'Retained'; 
                        WithDPM = WithDPM + parseFloat(element.POC);
                        WithOutDPM = WithOutDPM + parseFloat(element.POC); 
                        obj['MSSMaintenanceInterval']="52 Weeks"; 
                        TotalAnnualPOC = TotalAnnualPOC + parseFloat(element.POC);
                        vendorPOC = vendorPOC + parseFloat(element.POC);
                    }else if(element.MaintenanceTask == "Annual task as per list"){
                        obj['Hours']= '12 hrs';
                        obj['AnnualPOC']= (element.POC).toFixed(3);
                        obj['Status']= 'Retained'; 
                        WithDPM = WithDPM + parseFloat(element.POC);
                        WithOutDPM = WithOutDPM + parseFloat(element.POC);
                        obj['MSSMaintenanceInterval']="52 Weeks";
                        TotalAnnualPOC = TotalAnnualPOC + parseFloat(element.POC);
                        vendorPOC = vendorPOC + parseFloat(element.POC);
                    }else if(element.MaintenanceTask == "Turn around task - MEC"){
                        obj['Hours']= '48 hrs';
                        obj['AnnualPOC']= (parseFloat(element.MaterialCost) + parseFloat(element.POC)).toFixed(3);
                        obj['Status']= 'Deleted'; 
                        WithOutDPM = WithOutDPM + (parseFloat(element.MaterialCost) + parseFloat(element.POC));
                        obj['MSSMaintenanceInterval']="260 Weeks";
                        TotalAnnualPOC = TotalAnnualPOC + parseFloat(element.POC) + parseFloat(element.MaterialCost);
                        var poc : number = (parseFloat(element.POC) + parseFloat(element.MaterialCost)) * (260 / 52);
                        vendorPOC = vendorPOC + (poc/5);
                    }else if(element.MaintenanceTask == "Turn around task - CTL"){
                        obj['Hours']= '24 hrs';
                        obj['AnnualPOC']= (element.POC).toFixed(3);
                        obj['Status']= 'Deleted'; 
                        WithOutDPM = WithOutDPM + parseFloat(element.POC);
                        obj['MSSMaintenanceInterval']="260 Weeks";
                        TotalAnnualPOC = TotalAnnualPOC + parseFloat(element.POC);
                        var poc : number = parseFloat(element.POC) * (260 / 52);
                        vendorPOC = vendorPOC + (poc/5);
                    }else if(element.MaintenanceTask == "Turn around task - HEL"){
                        obj['Hours']= '48 hrs';
                        obj['AnnualPOC']= (element.POC).toFixed(3);
                        obj['Status']= 'Deleted'; 
                        WithOutDPM = WithOutDPM + parseFloat(element.POC);
                        obj['MSSMaintenanceInterval']="260 Weeks";
                        TotalAnnualPOC = TotalAnnualPOC + parseFloat(element.POC);
                        var poc : number = parseFloat(element.POC) * (260 / 52);
                        vendorPOC = vendorPOC + (poc/5);
                    }else if(element.MaintenanceTask == "Turn around task - ELE"){
                        obj['Hours']= '4 hrs';
                        obj['AnnualPOC']= (element.POC).toFixed(3);
                        obj['Status']= 'Deleted'; 
                        WithOutDPM = WithOutDPM + parseFloat(element.POC);
                        obj['MSSMaintenanceInterval']="260 Weeks";
                        TotalAnnualPOC = TotalAnnualPOC + parseFloat(element.POC);
                        var poc : number = parseFloat(element.POC) * (260 / 52);
                        vendorPOC = vendorPOC + (poc/5);
                    }
                    
                    obj['Craft']= CRAFT;
                    obj['Level']= LEVEL;
                    obj['Progress']= 0;
                    levelCount = levelCount + parseFloat(LEVEL);
                    obj['MSSIntervalSelectionCriteria']='Good Engineering Practice';
                    // obj['MSSMaintenanceInterval']="52 Weeks";
                    if(count === 0){
                    this.CBAReportDetails.CentrifugalPumpMssModel.push(obj);
                    }
                
                });
                this.CBAReportDetails.VendorPOC = vendorPOC.toFixed(2);
                this.CBAReportDetails.ResidualRiskWithMaintenance = (TotalAnnualPOC - vendorPOC).toFixed(2)
                this.CBAReportDetails.WithDPM = WithDPM.toFixed(0)
                this.CBAReportDetails.WithOutDPM = WithOutDPM.toFixed(0)
                this.CBAReportDetails.CentrifugalPumpMssModel.splice(0,1)
                levelCount = (levelCount/(this.CBAReportDetails.CentrifugalPumpMssModel.length * 100))
                this.CBAReportDetails.TotalAnnualPOC =TotalAnnualPOC.toFixed(0);
                
                this.CBAOBJ.LevelCount = levelCount;
                this.CBAOBJ.ResidualRiskWithMaintenance = (TotalAnnualPOC - vendorPOC).toFixed(2)
                this.CBAOBJ.VendorPOC = vendorPOC.toFixed(2);
                this.CBAOBJ.TotalAnnualPOC = TotalAnnualPOC.toFixed(3);;
                this.CBAOBJ.TotalPONC = this.UserProductionCost;
                this.CBAOBJ.ETBF = this.ETBF;
                this.CBAOBJ.VendorETBC = this.VendorETBF;
                this.CBAOBJ.OverallETBC = this.MSSETBF;
                this.CBAOBJ.RCMTreeId = row.CFPPrescriptiveId;
                this.CBAOBJ.FailureMode = row.FunctionMode;
                this.CBAOBJ.EconomicRiskWithDPM = WithDPM.toFixed(0);
                this.CBAOBJ.EconomicRiskWithOutDPM= WithOutDPM.toFixed(0);
                this.CBAOBJ.EconomicRiskWithDPMConstraint = 0;
                this.CBAOBJ.MEIWithoutDPM = 0;
                this.CBAOBJ.MEIWithDPM = 0;
                this.CBAOBJ.MEIWithDPMConstraint = 0;
                this.CBAOBJ.EconomicRiskWithDPMCR = "";
                this.CBAOBJ.EconomicRiskWithOutDPMCR = "";
                this.CBAOBJ.EconomicRiskWithDPMConstraintCR = "";
                this.CBAOBJ.EconomicRiskWithDPMCRValue = 0;
                this.CBAOBJ.EconomicRiskWithOutDPMCRValue = 0;
                this.CBAOBJ.EconomicRiskWithDPMConstraintCRValue = 0;
                this.CBAOBJ.CBATaskModel = []
                this.CBAOBJ.UserId = this.UserDetails.UserId;
                this.CBAOBJ.MachineType = this.MachineType;
                this.CBAOBJ.EquipmentType = this.EquipmentType;
                this.CBAOBJ.TagNumber = this.TagNumberToSave;
                this.CBAOBJ.CBATaskModel = this.CBAReportDetails.CentrifugalPumpMssModel;
                localStorage.removeItem('CBAOBJ');
                localStorage.setItem('CBAOBJ', JSON.stringify(this.CBAOBJ));
        }
        
    }

    Save(){
        this.http.post('/api/PSRClientContractorAPI/PostCBATask', this.CBAOBJ)
          .subscribe((res: any) => { 
              if(res.status == undefined && res.status == 1){
                // status code 1 : CBA carryout task changed from No to Yes
              }else if(res.status == undefined && res.status == 2){
                  // status code 1 : CBA carryout task changed from Yes to No
              }
          },
           err => {
            this.messageService.add({ severity: 'warn', summary: 'warn', detail: err.error })   
        });
    }

    public OpenMEI(){
        this.AddMEIPopup = true;
    }

    public async getMEI(){
        if(this.CBAOBJ.LevelCount === undefined){
            this.CBAOBJ.LevelCount = 0
        }
        this.CBAOBJ.MEIWithoutDPM  = (((this.UserProductionCost / parseFloat(this.ETBF)) - (this.UserProductionCost / this.VendorETBF)) / parseFloat(this.CBAOBJ.TotalAnnualPOC))
        this.CBAOBJ.MEIWithDPM = (((this.UserProductionCost / parseFloat(this.ETBF)) - (this.UserProductionCost / this.MSSETBF)) / parseFloat(this.CBAOBJ.TotalAnnualPOC));
        this.CBAOBJ.MEIWithDPMConstraint =  (((this.UserProductionCost / parseFloat(this.ETBF)) - (this.UserProductionCost / (this.MSSETBF * parseFloat(this.CBAOBJ.LevelCount)))) / parseFloat(this.CBAOBJ.TotalAnnualPOC));
        if(this.CBAOBJ.MEIWithDPMConstraint == -Infinity){
            this.CBAOBJ.MEIWithDPMConstraint = 0;
        }
        if(this.CBAOBJ.MEIWithDPM == -Infinity){
            this.CBAOBJ.MEIWithDPM = 0;
        }
        if(this.CBAOBJ.MEIWithoutDPM == -Infinity){
            this.CBAOBJ.MEIWithoutDPM = 0;
        }
        var WithDPMCR =  await this.getTotalEconomicConsequenceClass(this.MSSETBF, (parseFloat( this.CBAOBJ.EconomicRiskWithDPM) / 1000));
        var WithOutDPMCR = await this.getTotalEconomicConsequenceClass(this.VendorETBF, (parseFloat(this.CBAOBJ.EconomicRiskWithOutDPM)/1000));
        this.CBAOBJ.EconomicRiskWithDPMCR = WithDPMCR.CriticalityRating;
        this.CBAOBJ.EconomicRiskWithOutDPMCR = WithOutDPMCR.CriticalityRating;
        this.CBAOBJ.VendorETBC = this.VendorETBF;
        this.CBAOBJ.OverallETBC = this.MSSETBF;
        
        var WD : number = await this.getValue(WithDPMCR.CriticalityRating);
        var WOD : number = await this.getValue(WithOutDPMCR.CriticalityRating);
        
        this.CBAOBJ.EconomicRiskWithDPMCRValue = WD;
        this.CBAOBJ.EconomicRiskWithOutDPMCRValue = WOD;
        localStorage.removeItem('CBAOBJ');
        localStorage.setItem('CBAOBJ', JSON.stringify(this.CBAOBJ));
    }
    
    public async getValue(r : string){
        if(r === "N"){
            return await 1;
        } else if(r === "L"){
            return await 2;
        } else if(r === "M"){
            return await 3;
        } else if(r === "MH"){
            return await 4;
        } else if(r === "H"){
            return await 5;
        } else if(r === "E"){
            return await 6;
        }else{
            return await 0;
        }
    }

    public PDFCBAReport() {
        this.CD.detectChanges();
        const doc = new jsPDF();
        const specialElementHandlers = {
            '#editor': function (element, renderer) {
                return true;
            }
        };
        // const pdfTable2 = this.pdfTable2.nativeElement;
        // doc.fromHTML(pdfTable2.innerHTML, 15, 15, {
        //   width: 190,
        //   'elementHandlers': specialElementHandlers
        // });

        let imageData = document.getElementById('CBAReport');
        var pdfdata = html2canvas(imageData).then(canvas => {
            const imgProps = doc.getImageProperties(canvas);
            var imgWidth = 187;
            var pageHeight = 299;
            var imgHeight = imgProps.height * imgWidth / imgProps.width;
            var heightLeft = imgHeight;
            var position = 0;
            doc.addImage(canvas, 'PNG', 10, position, imgWidth, imgHeight / 1);
            heightLeft -= pageHeight;
            while (heightLeft >= 2) {
                position = heightLeft - imgHeight;
                doc.addImage(canvas, 'PNG', 10, position, imgWidth, imgHeight / 1);
                heightLeft -= pageHeight;
            }
            const arrbf = doc.output("arraybuffer");
            doc.save("Cost Benefit Analysis Report");
            this.commonLoadingDirective.showLoading(false, 'Downloading....');
        });
    }

    saveByteArray(reportName, byte) {
        var blob = new Blob([byte], { type: "application/pdf" });
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        var fileName = reportName;
        link.download = fileName;
        link.click();
      };

    public PrintCBAReport() {
        this.CD.detectChanges();
        let popupWinindow;
        let printContents = document.getElementById('CBAReport').innerHTML;
        popupWinindow = window.open('', '_blank', 'width=1600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
        popupWinindow.document.open();
        let documentContent = "<html><head>";
        documentContent += '<link rel="stylesheet" href="/dist/DPM/assets/css/bootstrap.css">';
        documentContent += '<link rel="stylesheet" href="/dist/DPM/assets/vendor/fontawesome-free/css/all.min.css">';
        documentContent += '<link rel="stylesheet" href="/dist/DPM/assets/css/primeng/primeicons/primeicons.css">';
        documentContent += '<link rel="stylesheet" href="/dist/DPM/assets/css/primeng/resources/themes/saga-blue/theme.css">';
        documentContent += '<link rel="stylesheet" href="/dist/DPM/assets/css/primeng/resources/primeng.min.css">';
        documentContent += '<link rel="stylesheet" href="/dist/DPM/assets/css/print.css">';
        documentContent += '</head>';
        documentContent += '<body onload="window.print()">' + printContents + '</body></html>'
        popupWinindow.document.write(documentContent);
        popupWinindow.document.close();
    }
    private getUserSkillRecords(){
        const params = new HttpParams()
              .set('UserId', this.UserDetails.UserId)
        this.commonBLervice.getWithParameters('/SkillLibraryAPI/GetAllConfigurationRecords', params).subscribe(
          (res : any) => {
            this.SkillLibraryAllrecords =res;
          })
    }
    private GetPSRClientContractorData() {
        this.http.get('/api/PSRClientContractorAPI/GetAllConfigurationRecords')
          .subscribe((res: any) => {
            this.PSRClientContractorData = res;
          });
      }

    getCraftValue(d){
        var skillData = this.SkillLibraryAllrecords.find(r=>r.SKillLibraryId === d.Craft);
        if(skillData !== undefined){
            var craft = this.PSRClientContractorData.find(r=>r.PSRClientContractorId === skillData.Craft);
            return craft.CraftSF;
        }else{
            return 'NA';
        }
    }

    getEmployeeLevelValue(d){
        if(d.Craft !== 0){
            var skillData = this.SkillLibraryAllrecords.find(r=>r.SKillLibraryId === d.Craft);
            return skillData.Level;
        }else{
            return 0;
        }
        
      }

    public getCarryOutTaskValue(r){
        if(r === null || r === ''){
        return null;
        }else{
        return r;
        }
    }

}