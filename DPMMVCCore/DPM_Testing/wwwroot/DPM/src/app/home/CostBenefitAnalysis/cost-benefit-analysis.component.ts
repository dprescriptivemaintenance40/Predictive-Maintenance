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
    public SelectedTagNumber: string = "";
    public showPrescriptive: boolean = false;
    public UserDetails: any;
    public showCostBenefitAnalysis: boolean = false;
    public Site: string = '';
    public Plant: string = '';
    public Unit: string = '';
    public ETBF: number;
    public VendorETBF: number;
    public MSSETBF: number;
    public CBAReportDetails: any;
    public PrescriptiveRecordsList : any=[]; 
    public MSSTaskDetailList : any = [];
    public showDashboard: boolean = false;

    public RiskMatrixLibraryRecords : any = [];
    public EconmicConsequenceClass : string ="";
    public CriticalityRating : string = "";
    public MaintenanceStrategyList : any =[];
    public SavedPCRRecordsList : any =[];
    public SkillLibraryAllrecords : any =[];
    public PSRClientContractorData : any = [];
    public UserProductionCost : number = 0;
    public GoodEngineeringTaskList : any = [];
    public CBAOBJ : any ={};
    private MSSStrategyReplacePSR : any =[];
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
        this.GetMssStartegyList();
        this.GetPSRClientContractorData();
        this.getUserSkillRecords();
        this.MachineEquipmentSelect();
        this.getPrescriptiveRecords();
        this.GetRiskMatrixLibraryRecords();
        this.MSSTaskDetailList = [
            { 'Hours': 48, 'HR': 22.7, 'Craft': 'MEC','Level': 0, 'Status':'Retained' },
            { 'Hours': 48, 'HR': 11.4, 'Craft': 'HEL','Level': 25, 'Status':'Retained' },
            { 'Hours': 4, 'HR': 22.7, 'Craft': 'ELE' ,'Level': 75, 'Status':'Retained' },
            { 'Hours': 24, 'HR': 22.7, 'Craft': 'CTL','Level': 100, 'Status':'Retained' }
        ]
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
            this.SavedPCRRecordsList.forEach(element => {
               var Data = this.MaintenanceStrategyList.find(r=>r.MaintenanceTask === element.MaintenanceTask)
               if(Data !== undefined && Data.Strategy === "GEP"){
                  this.GoodEngineeringTaskList.push(element)
               }
               if(Data !== undefined && Data.Strategy === "NEW"){
                this.MSSStrategyReplacePSR.push(element);
               }
            });
          }
        )
      }

    RouteTodashboard(){
        this.router.navigateByUrl('/Home/Dashboard', { state: { CFPPrescriptiveId: this.CFPPrescriptiveId, ETBF : this.ETBF}})
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

        var list = this.PrescriptiveRecordsList.filter(r=>r.EquipmentType === this.EquipmentType)
        this.TagList = []
        list.forEach(element => {
            this.TagList.push(element.TagNumber)
        });
    }
    getPrescriptiveRecords() {
        this.http.get('api/PrescriptiveAPI/GetTagNumber')
            .subscribe((res: any) => {
                this.PrescriptiveRecordsList =[]
                this.PrescriptiveRecordsList = res;
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
                        if(element.CentrifugalPumpMssId === "NEW"){
                            this.CBAReportDetails.CentrifugalPumpMssModel.splice(index,1);
                         }
                     })
                     var fil = this.CBAReportDetails.CentrifugalPumpMssModel.filter(r=>r.CentrifugalPumpMssId === "NEW")
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
                        obj['CentrifugalPumpMssId']="NEW";
                        obj['Checked']= true;
                        obj['MSSMaintenanceTask']=element.MaintenanceTask;
                        this.MaintenanceStrategyList
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
                            WithOutDPM = WithOutDPM + (parseFloat(element.MaterialCost) + parseFloat(element.POC));
                            obj['MSSMaintenanceInterval']="10 Years";
                        }
                        obj['Craft']= CRAFT;
                        obj['Level']= LEVEL;
                        obj['MSSIntervalSelectionCriteria']='None';
                        this.CBAReportDetails.CentrifugalPumpMssModel.push(obj)
                    });
                }
                
            }
        }

        var levelCount : number = 0;
        var WithDPM : number= 0;
        var WithOutDPM : number= 0;
        var TotalAnnualPOC : number = 0;
        var counter =0;
        this.CBAReportDetails.CentrifugalPumpMssModel.forEach(element => {
            if(element.Checked === true){
                counter = counter +1;
                levelCount = levelCount + parseFloat(element.Level)
                if(element.CentrifugalPumpMssId === 'GDE'  || element.CentrifugalPumpMssId === 'MSS' || element.CentrifugalPumpMssId === 'NEW'){
                    levelCount = levelCount + parseFloat(element.Level);
                    if(element.Status == "Retained"){
                        WithDPM = WithDPM + parseFloat(element.AnnualPOC);
                        WithOutDPM = WithOutDPM + parseFloat(element.AnnualPOC)
                    }else if(element.Status == "New"){
                        WithDPM = WithDPM + parseFloat(element.AnnualPOC);
                    }else if(element.Status == "Deleted"){
                        WithOutDPM = WithOutDPM + parseFloat(element.AnnualPOC);
                    }
                    TotalAnnualPOC = TotalAnnualPOC + parseFloat(element.AnnualPOC); 
                }
            }
            
        });
        
            levelCount = levelCount / (counter * 100); 
            this.CBAReportDetails.WithDPM = WithDPM.toFixed(0);
            this.CBAReportDetails.WithOutDPM = WithOutDPM.toFixed(0);
            this.CBAReportDetails.TotalAnnualPOC =TotalAnnualPOC.toFixed(3);

            var m =  await this.getTotalEconomicConsequenceClass((this.MSSETBF * levelCount), WithDPM.toFixed(0));
            this.CBAReportDetails.EconomicRiskWithConstraintDPMCR = m.CriticalityRating;

            this.CBAOBJ.TotalAnnualPOC = TotalAnnualPOC.toFixed(3);;
            this.CBAOBJ.TotalPONC = this.UserProductionCost;
            this.CBAOBJ.ETBF = this.ETBF;
            this.CBAOBJ.VendorETBC = this.VendorETBF;
            this.CBAOBJ.OverallETBC = this.MSSETBF;
            this.CBAOBJ.EconomicRiskWithDPM = WithDPM.toFixed(0);
            this.CBAOBJ.EconomicRiskWithOutDPM= WithOutDPM.toFixed(0);
            this.CBAOBJ.EconomicRiskWithConstraintDPMCR = m.CriticalityRating;  
    //    this.CBAOBJ.TotalAnnualCostWithMaintenance = VendorPONC;      
    //    this.CBAReportDetails.VendorPONC = (VendorPONC).toFixed(3);
    //   // TotalAnuualPOC = VendorPONC + TotalAnuualPOC;
    //    this.CBAReportDetails.TotalAnnualPOC = (TotalAnuualPOC).toFixed(3);
    //    var v  =  await this.getTotalEconomicConsequenceClass(this.VendorETBF, VendorPONC);
    //    this.CBAReportDetails.VendorCR = v.CriticalityRating;
    //    var m =  await this.getTotalEconomicConsequenceClass(this.MSSETBF, TotalAnuualPOC);
    //    this.CBAReportDetails.MSSCR = m.CriticalityRating;
    //    let WithETBCAndPONC = this.UserProductionCost / this.VendorETBF;
    //    let WithoutETBCAndPONC = this.UserProductionCost / this.MSSETBF;
    //    this.CBAReportDetails.WithMEI = (((this.UserProductionCost / this.ETBF) - (this.UserProductionCost / this.VendorETBF)) / WithETBCAndPONC).toFixed(2);
    //    this.CBAReportDetails.WithOutMEI = (((this.UserProductionCost / this.ETBF) - (this.UserProductionCost / this.MSSETBF)) / WithoutETBCAndPONC).toFixed(2);
    // //    this.CBAReportDetails.ResidualRiskWithMaintenance = parseFloat((row.TotalAnnualCostWithMaintenance - row.TotalAnnualPOC).toFixed(3));
    //    this.CBAReportDetails.ResidualRiskWithMaintenance = parseFloat(( VendorPONC - TotalAnuualPOC).toFixed(3));
    //    if(this.CBAReportDetails.ResidualRiskWithMaintenance < 0){
    //     this.CBAReportDetails.ResidualRiskWithMaintenance = 0;
    //    }
    //    this.CBAReportDetails.ETBFWithConstraint = this.MSSETBF * levelCount
    //    var c =  await this.getTotalEconomicConsequenceClass(this.CBAReportDetails.ETBFWithConstraint, TotalAnuualPOC);
    //    this.CBAReportDetails.ETBFWithConstraintCR = c.CriticalityRating;
    //    this.CD.detectChanges();
    //    this.CBAReportDetails.MEIWithoutDPM = (((this.UserProductionCost /this.ETBF) -   (this.UserProductionCost / this.MSSETBF))    /  TotalAnuualPOC ).toFixed(3);
    //    // 4 yrs calculation
    //    this.CBAReportDetails.MEIWithDPMWithoutConstraint = (((this.UserProductionCost /this.ETBF) -   (this.UserProductionCost / this.VendorETBF))    /  TotalAnuualPOC ).toFixed(3);
      
    //    // with constarint
    //    this.CBAReportDetails.MEIWithDPMWithConstraint = (((this.UserProductionCost /this.ETBF) -   (this.UserProductionCost / parseFloat(this.CBAReportDetails.ETBFWithConstraint)))    /  TotalAnuualPOC ).toFixed(3);
       
    //    this.CBAOBJ.TotalAnnualPOC = TotalAnnualPOC.toFixed(3);;
    //    this.CBAOBJ.TotalPONC = this.UserProductionCost;
    //    this.CBAOBJ.ETBF = this.ETBF;
    //    this.CBAOBJ.VendorETBC = this.VendorETBF;
    //    this.CBAOBJ.OverallETBC = this.MSSETBF;
    //    this.CBAOBJ.EconomicRiskWithDPM = WithDPM.toFixed(0);
    //    this.CBAOBJ.EconomicRiskWithOutDPM= WithOutDPM.toFixed(0);
    //    this.CBAOBJ.ETBFWithConstraint = this.CBAReportDetails.ETBFWithConstraint;
    //    this.CBAOBJ.MEIWithDPMWithoutConstraint = this.CBAReportDetails.MEIWithDPMWithoutConstraint;
    //    this.CBAOBJ.MEIWithoutDPM = this.CBAReportDetails.MEIWithoutDPM;
    //    this.CBAOBJ.MEIWithDPMWithConstraint = this.CBAReportDetails.MEIWithDPMWithConstraint;
       localStorage.removeItem('CBAOBJ');
       localStorage.setItem('CBAOBJ', JSON.stringify(this.CBAOBJ));
    }

    onlyNumbers(event) {
        const pattern = /[0-9]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
          event.preventDefault();
    
        }
      }
    GetUserProductionDetailRecords(){
        this.commonBLervice.getWithoutParameters(this.PSRAPIs.GetUserProductionDetail).subscribe(
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
          }, err=> {console.log(err.error)})
    }
  async  getPrescriptiveRecordsByEqui() {
        if (this.MachineType && this.EquipmentType && this.SelectedTagNumber) {
            this.prescriptiveRecords = [];
            this.CBAReportDetails = undefined;
            this.http.get(`api/PrescriptiveAPI/GetPrescriptiveByEquipmentType?machine=${this.MachineType}&Equi=${this.EquipmentType}&TagNumber=${this.SelectedTagNumber}`)
                .subscribe( async (res: any) => {
                    this.prescriptiveRecords = res;
                    // this.prescriptiveRecords.centrifugalPumpPrescriptiveFailureModes.forEach( async row => {
                    //     row.TotalAnnualPOC = this.UserProductionCost;
                    //     var levelCount : number =0;
                    //     row.CentrifugalPumpMssModel.forEach(mss => {
                    //       //  var MSSTaskList = this.MaintenanceStrategyList.find(r=>r.MaintenanceTask == mss.MSSMaintenanceTask);
                    //         let PSRData = this.SavedPCRRecordsList.find(r=>r.MaintenanceTask == mss.MSSMaintenanceTask);
                    //         let CRAFT = this.getCraftValue(PSRData);
                    //         let LEVEL = this.getEmployeeLevelValue(PSRData);
                    //         mss.Checked= true;
                    //         if (!mss.MSSMaintenanceInterval || mss.MSSMaintenanceInterval === 'NA' || mss.MSSMaintenanceInterval === 'Not Applicable') {
                    //             mss.POC = 0;
                    //             mss.AnnualPOC = 0;
                    //             mss.Status = '';
                    //         } else {
                    //             let annu = mss.MSSMaintenanceInterval.split(' ');
                    //             if (mss.MSSMaintenanceInterval.toLowerCase().includes('week')) {
                    //                // mss.POC = 0.00025;
                    //                 mss.POC = PSRData.POC;
                    //                 mss.Craft = CRAFT;
                    //                 mss.Level = LEVEL;
                    //                 mss.EmployeeName = PSRData.EmployeeName
                    //                 mss.AnnualPOC = parseFloat((parseFloat(annu[0]) * mss.POC).toFixed(3));
                    //             } else if (mss.MSSMaintenanceInterval.toLowerCase().includes('month')) {
                    //                 mss.POC = PSRData.POC;
                    //                 mss.Craft = CRAFT;
                    //                 mss.Level = LEVEL;
                    //                 mss.EmployeeName = PSRData.EmployeeName
                    //                 mss.AnnualPOC = parseFloat((parseFloat(annu[0]) * mss.POC * 4.345).toFixed(3));
                    //             }
                    //             mss.MSSMaintenanceInterval = `${parseFloat(annu[0]).toFixed(1)} ${annu[1]}`;
                    //             mss.Status = 'New';
                    //             row.TotalAnnualPOC += mss.AnnualPOC;
                    //         }
                    //         levelCount = levelCount+LEVEL;
                    //     });
                    //     row.LevelPercentage = (levelCount / (row.CentrifugalPumpMssModel.length * 100)).toFixed(2)
                    //     //row.ETBC = 10;
                    //    // row.TotalPONC = 20796;
                    //     row.TotalPONC = this.UserProductionCost;
                    //     row.ETBF = this.ETBF ? this.ETBF : 2;
                    //     row.ETBC = (this.ETBF *  row.LevelPercentage).toFixed(2)
                    //     var d = await this.getTotalEconomicConsequenceClass(this.ETBF,this.UserProductionCost);
                    //     row.IntialCR = d.CriticalityRating;
                    //     row.TotalAnnualCostWithMaintenance = 1.777;
                    //     row.EconomicRiskWithoutMaintenance = row.TotalPONC / row.ETBF;
                    //     // row.ResidualRiskWithMaintenance = parseFloat((row.TotalAnnualCostWithMaintenance - row.TotalAnnualPOC).toFixed(3));
                    //     var Data = await this.getTotalEconomicConsequenceClass(this.ETBF, this.UserProductionCost);
                    //     row.InitialCR = Data.CriticalityRating
                    //     // var Data1 = await this.getTotalEconomicConsequenceClass(row.ETBF,row.EconomicRiskWithoutMaintenance);
                    //     // row.EconomicRiskWithoutMaintenanceCR = Data1.CriticalityRating
                    //     let WithETBCAndPONC = row.TotalPONC / row.ETBC;
                    //     let WithoutETBCAndPONC = row.TotalPONC / 5;
                        // row.WithMEI = (((row.TotalPONC / row.ETBF) - (row.TotalPONC / row.ETBC)) / WithETBCAndPONC).toFixed(0);
                        // row.WithOutMEI = (((row.TotalPONC / row.ETBF) - (row.TotalPONC / 5)) / WithoutETBCAndPONC).toFixed(0);
                    //     row.ConsequenceCategory = row.Consequence.split(' ')[0];
                    // });
                    this.showPrescriptive = true;
                }, err => {
                    console.log(err.err);
                });
        } else {
            this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Please select all three fields." })
        }

    }

    public GenerateCostBenefitReport() {
        if (this.Site && this.Plant && this.Unit) {
            this.showCostBenefitAnalysis = true;
        } else {
            this.messageService.add({ severity: 'info', summary: 'note', detail: "Please fill all three fields Site, Plant, Unit. " })
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
        this.CBAReportDetails.CentrifugalPumpMssModel.forEach(element => {
            if(element.CentrifugalPumpMssId == "GDE"){
                count = count + 1;
            }else{

                this.MSSTaskDetailList.forEach(r => {
                    let obj ={}
                    obj['Craft']= r.Craft;
                    var weeks = element.MSSMaintenanceInterval.split(" ")[0];
                    var Years = (parseFloat(weeks)/52).toFixed(0);
                    obj['AnnualPOC']= ((parseFloat(r.Hours) * parseFloat(r.HR)) / parseFloat(Years)).toFixed(3)
                    var abc = ((parseFloat(r.Hours) * parseFloat(r.HR)) / parseFloat(Years)).toFixed(3)
                    if(r.Craft === "MEC"){
                        obj['AnnualPOC'] = parseFloat(abc) + 1000
                    }
                    obj['Level']= r.Level;
                    obj['MSSIntervalSelectionCriteria']=element.MSSIntervalSelectionCriteria
                    obj['CentrifugalPumpMssId']="MSS";
                    obj['Checked']= true;
                    obj['MSSMaintenanceTask']=element.MSSMaintenanceTask;
                    obj['Hours']= `${r.Hours} hrs`;
                    obj['Status']= r.Status;
                    
                    obj['MSSMaintenanceInterval']=element.MSSMaintenanceInterval;
                    this.CBAReportDetails.CentrifugalPumpMssModel.push(obj)
                    WithDPM = WithDPM + ((parseFloat(r.Hours) * parseFloat(r.HR)) / parseFloat(Years))
                    if(r.Craft === "MEC"){
                        TotalAnnualPOC = TotalAnnualPOC + (parseFloat(abc) + 1000);
                    }else{
                        TotalAnnualPOC = TotalAnnualPOC + ((parseFloat(r.Hours) * parseFloat(r.HR)) / parseFloat(Years));
                    }
                   
                    levelCount = levelCount + r.Level;
                });
                // TotalAnuualPOC = TotalAnuualPOC + element.AnnualPOC;
                // levelCount = levelCount + element.Level
                // WithDPM = WithDPM + parseFloat(element.AnnualPOC);
            }
        });
            this.GoodEngineeringTaskList.forEach(element => {
                let CRAFT = this.getCraftValue(element);
                let LEVEL = this.getEmployeeLevelValue(element);
                let obj ={}
                obj['CentrifugalPumpMssId']="GDE";
                obj['Checked']= true;
                obj['MSSMaintenanceTask']=element.MaintenanceTask;
                this.MaintenanceStrategyList
                if(element.MaintenanceTask == "Daily site observation as per log sheet - OCM" || element.MaintenanceTask == "Daily site observation as per log sheet - REL"){
                    obj['Hours']= '0.25 hrs';
                    obj['AnnualPOC']= (element.POC).toFixed(3);
                    obj['Status']= 'Retained';
                    WithDPM = WithDPM + parseFloat(element.POC);
                    WithOutDPM = WithOutDPM + parseFloat(element.POC);
                    obj['MSSMaintenanceInterval']="1 Week";
                }else if(element.MaintenanceTask == "Oil Sampling, Oil/Air Filter Replace, Align (Laser), &  clean intake vents"){
                    obj['Hours']= '12 hrs';
                    obj['AnnualPOC']= (element.POC).toFixed(3);
                    obj['Status']= 'Retained'; 
                    WithDPM = WithDPM + parseFloat(element.POC);
                    WithOutDPM = WithOutDPM + parseFloat(element.POC);
                    obj['MSSMaintenanceInterval']="52 Weeks";
                }else if( element.MaintenanceTask == "esd system function check"){
                    obj['Hours']= '6 hrs';
                    obj['AnnualPOC']= (element.POC).toFixed(3);
                    obj['Status']= 'Retained'; 
                    WithDPM = WithDPM + parseFloat(element.POC);
                    WithOutDPM = WithOutDPM + parseFloat(element.POC); 
                    obj['MSSMaintenanceInterval']="52 Weeks"; 
                }else if(element.MaintenanceTask == "Annual task as per list"){
                    obj['Hours']= '12 hrs';
                    obj['AnnualPOC']= (element.POC).toFixed(3);
                    obj['Status']= 'Retained'; 
                    WithDPM = WithDPM + parseFloat(element.POC);
                    WithOutDPM = WithOutDPM + parseFloat(element.POC);
                    obj['MSSMaintenanceInterval']="52 Weeks";
                }else if(element.MaintenanceTask == "Turn around task - MEC"){
                    obj['Hours']= '48 hrs';
                    obj['AnnualPOC']= (parseFloat(element.MaterialCost) + parseFloat(element.POC)).toFixed(3);
                    obj['Status']= 'Deleted'; 
                    WithOutDPM = WithOutDPM + (parseFloat(element.MaterialCost) + parseFloat(element.POC));
                    obj['MSSMaintenanceInterval']="260 Weeks";
                }else if(element.MaintenanceTask == "Turn around task - CTL"){
                    obj['Hours']= '24 hrs';
                    obj['AnnualPOC']= (element.POC).toFixed(3);
                    obj['Status']= 'Deleted'; 
                    WithOutDPM = WithOutDPM + parseFloat(element.POC);
                    obj['MSSMaintenanceInterval']="260 Weeks";
                }else if(element.MaintenanceTask == "Turn around task - HEL"){
                    obj['Hours']= '48 hrs';
                    obj['AnnualPOC']= (element.POC).toFixed(3);
                    obj['Status']= 'Deleted'; 
                    WithOutDPM = WithOutDPM + parseFloat(element.POC);
                    obj['MSSMaintenanceInterval']="260 Weeks";
                }else if(element.MaintenanceTask == "Turn around task - ELE"){
                    obj['Hours']= '4 hrs';
                    obj['AnnualPOC']= (element.POC).toFixed(3);
                    obj['Status']= 'Deleted'; 
                    WithOutDPM = WithOutDPM + parseFloat(element.POC);
                    obj['MSSMaintenanceInterval']="260 Weeks";
                }
                TotalAnnualPOC = TotalAnnualPOC + parseFloat(element.POC);
                obj['Craft']= CRAFT;
                obj['Level']= LEVEL;
                levelCount = levelCount + LEVEL;
                obj['MSSIntervalSelectionCriteria']='None';
                // obj['MSSMaintenanceInterval']="52 Weeks";
                if(count === 0){
                this.CBAReportDetails.CentrifugalPumpMssModel.push(obj);
                }
                
            });

            this.CBAReportDetails.WithDPM = WithDPM.toFixed(0)
            this.CBAReportDetails.WithOutDPM = WithOutDPM.toFixed(0)
            this.CBAReportDetails.CentrifugalPumpMssModel.splice(0,1)
            levelCount = levelCount *(levelCount/(this.CBAReportDetails.CentrifugalPumpMssModel.length * 100))
            this.CBAReportDetails.TotalAnnualPOC =TotalAnnualPOC.toFixed(0);
            var m =  await this.getTotalEconomicConsequenceClass((this.MSSETBF * levelCount), WithDPM.toFixed(0));
            this.CBAReportDetails.EconomicRiskWithConstraintDPMCR = m.CriticalityRating;

            this.CBAOBJ.TotalAnnualPOC = TotalAnnualPOC.toFixed(3);;
            this.CBAOBJ.TotalPONC = this.UserProductionCost;
            this.CBAOBJ.ETBF = this.ETBF;
            this.CBAOBJ.VendorETBC = this.VendorETBF;
            this.CBAOBJ.OverallETBC = this.MSSETBF;
            this.CBAOBJ.EconomicRiskWithDPM = WithDPM.toFixed(0);
            this.CBAOBJ.EconomicRiskWithOutDPM= WithOutDPM.toFixed(0);
            this.CBAOBJ.EconomicRiskWithConstraintDPMCR = m.CriticalityRating;

            
    //   this.CBAOBJ.TotalAnnualCostWithMaintenance = VendorPONC;

    //    levelCount = levelCount / (this.CBAReportDetails.CentrifugalPumpMssModel.length * 100);       
    //    this.CBAReportDetails.VendorPONC = (VendorPONC).toFixed(3);
    //    this.CBAReportDetails.TotalAnnualPOC = (TotalAnuualPOC).toFixed(3);
    //    var v  =  await this.getTotalEconomicConsequenceClass(this.VendorETBF, VendorPONC);
    //    this.CBAReportDetails.VendorCR = v.CriticalityRating;
    //    var m =  await this.getTotalEconomicConsequenceClass(this.MSSETBF, TotalAnuualPOC);
    //    this.CBAReportDetails.MSSCR = m.CriticalityRating;
    //    let WithETBCAndPONC = this.UserProductionCost / this.VendorETBF;
    //    let WithoutETBCAndPONC = this.UserProductionCost / this.MSSETBF;
    //    this.CBAReportDetails.WithMEI = (((this.UserProductionCost / this.ETBF) - (this.UserProductionCost / this.VendorETBF)) / WithETBCAndPONC).toFixed(2);
    //    this.CBAReportDetails.WithOutMEI = (((this.UserProductionCost / this.ETBF) - (this.UserProductionCost / this.MSSETBF)) / WithoutETBCAndPONC).toFixed(2);
    // //    this.CBAReportDetails.ResidualRiskWithMaintenance = parseFloat((row.TotalAnnualCostWithMaintenance - row.TotalAnnualPOC).toFixed(3));
    //    this.CBAReportDetails.ResidualRiskWithMaintenance = parseFloat(( VendorPONC - TotalAnuualPOC).toFixed(3));
    //    if(this.CBAReportDetails.ResidualRiskWithMaintenance < 0){
    //     this.CBAReportDetails.ResidualRiskWithMaintenance = 0;
    //    }
    //    this.CBAReportDetails.ETBFWithConstraint = this.MSSETBF * levelCount
    //    var c =  await this.getTotalEconomicConsequenceClass(this.CBAReportDetails.ETBFWithConstraint, TotalAnuualPOC);
    //    this.CBAReportDetails.ETBFWithConstraintCR = c.CriticalityRating;
    //    // 8 yrs calculation
    //    this.CBAReportDetails.MEIWithoutDPM = (((this.UserProductionCost /this.ETBF) -   (this.UserProductionCost / this.MSSETBF))    /  TotalAnuualPOC ).toFixed(3);
    //    // 4 yrs calculation
    //    this.CBAReportDetails.MEIWithDPMWithoutConstraint = (((this.UserProductionCost /this.ETBF) -   (this.UserProductionCost / this.VendorETBF))    /  TotalAnuualPOC ).toFixed(3);
      
    //    // with constarint
    //    this.CBAReportDetails.MEIWithDPMWithConstraint = (((this.UserProductionCost /this.ETBF) -   (this.UserProductionCost / parseFloat(this.CBAReportDetails.ETBFWithConstraint)))    /  TotalAnuualPOC ).toFixed(3);
       
    //    this.CBAOBJ.TotalAnnualPOC = TotalAnuualPOC;
    //    this.CBAOBJ.TotalPONC = this.UserProductionCost;
    //    this.CBAOBJ.ETBF = this.ETBF;
    //    this.CBAOBJ.VendorETBC = this.VendorETBF;
    //    this.CBAOBJ.OverallETBC = this.MSSETBF;
    //    this.CBAOBJ.ETBFWithConstraint = this.CBAReportDetails.ETBFWithConstraint;
    //    this.CBAOBJ.MEIWithDPMWithoutConstraint = this.CBAReportDetails.MEIWithDPMWithoutConstraint;
    //    this.CBAOBJ.MEIWithoutDPM = this.CBAReportDetails.MEIWithoutDPM;
    //    this.CBAOBJ.MEIWithDPMWithConstraint = this.CBAReportDetails.MEIWithDPMWithConstraint;
       localStorage.removeItem('CBAOBJ');
       localStorage.setItem('CBAOBJ', JSON.stringify(this.CBAOBJ));
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
        this.commonBLervice.getWithoutParameters('/SkillLibraryAPI/GetAllConfigurationRecords').subscribe(
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
}