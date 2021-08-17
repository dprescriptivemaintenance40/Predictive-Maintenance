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
    public ETBF: number = 0;
    public CBAReportDetails: any;
    public PrescriptiveRecordsList : any=[]; 
    
    public showDashboard: boolean = false;

    public RiskMatrixLibraryRecords : any = [];
    public EconmicConsequenceClass : string ="";
    public CriticalityRating : string = "";
    public MaintenanceStrategyList : any =[];
    public SavedPCRRecordsList : any =[];
    public SkillLibraryAllrecords : any =[];
    public PSRClientContractorData : any = [];
    public UserProductionCost : number = 0;
    constructor(private messageService: MessageService,
        private commonLoadingDirective: CommonLoadingDirective,
        private CD: ChangeDetectorRef,
        private commonBLervice : CommonBLService,
        private PSRAPIs : PrescriptiveContantAPI,
        public router: Router,
        private http: HttpClient) {
        this.UserDetails = JSON.parse(localStorage.getItem('userObject'));
        this.GetSavedPSRRecords();
        this.GetMssStartegyList();
        this.GetPSRClientContractorData();
        this.getUserSkillRecords();
        this.MachineEquipmentSelect();
        this.getPrescriptiveRecords();
        this.GetRiskMatrixLibraryRecords();
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

    GetUserProductionDetailRecords(){
        this.commonBLervice.getWithoutParameters(this.PSRAPIs.GetUserProductionDetail).subscribe(
         (res : any) => { 
            this.UserProductionCost = 0;
             res.forEach(element => {
                this.UserProductionCost = this.UserProductionCost + element.TotalCost;
             });
            
          }, err=> {console.log(err.error)})
    }
  async  getPrescriptiveRecordsByEqui() {
        if (this.MachineType && this.EquipmentType && this.SelectedTagNumber) {
            this.prescriptiveRecords = [];
            this.CBAReportDetails = undefined;
            this.http.get(`api/PrescriptiveAPI/GetPrescriptiveByEquipmentType?machine=${this.MachineType}&Equi=${this.EquipmentType}&TagNumber=${this.SelectedTagNumber}`)
                .subscribe( async (res: any) => {
                    this.prescriptiveRecords = res;
                    this.prescriptiveRecords.centrifugalPumpPrescriptiveFailureModes.forEach( async row => {
                        row.TotalAnnualPOC = 0;
                        var levelCount : number =0;
                        row.CentrifugalPumpMssModel.forEach(mss => {
                          //  var MSSTaskList = this.MaintenanceStrategyList.find(r=>r.MaintenanceTask == mss.MSSMaintenanceTask);
                            let PSRData = this.SavedPCRRecordsList.find(r=>r.MaintenanceTask == mss.MSSMaintenanceTask);
                            let CRAFT = this.getCraftValue(PSRData);
                            let LEVEL = this.getEmployeeLevelValue(PSRData);
                            if (!mss.MSSMaintenanceInterval || mss.MSSMaintenanceInterval === 'NA' || mss.MSSMaintenanceInterval === 'Not Applicable') {
                                mss.POC = 0;
                                mss.AnnualPOC = 0;
                                mss.Status = '';
                            } else {
                                let annu = mss.MSSMaintenanceInterval.split(' ');
                                if (mss.MSSMaintenanceInterval.toLowerCase().includes('week')) {
                                   // mss.POC = 0.00025;
                                    mss.POC = PSRData.POC;
                                    mss.Craft = CRAFT;
                                    mss.Level = LEVEL;
                                    mss.EmployeeName = PSRData.EmployeeName
                                    mss.AnnualPOC = parseFloat((parseFloat(annu[0]) * mss.POC).toFixed(3));
                                } else if (mss.MSSMaintenanceInterval.toLowerCase().includes('month')) {
                                    mss.POC = PSRData.POC;
                                    mss.Craft = CRAFT;
                                    mss.Level = LEVEL;
                                    mss.EmployeeName = PSRData.EmployeeName
                                    mss.AnnualPOC = parseFloat((parseFloat(annu[0]) * mss.POC * 4.345).toFixed(3));
                                }
                                mss.MSSMaintenanceInterval = `${parseFloat(annu[0]).toFixed(1)} ${annu[1]}`;
                                mss.Status = 'Retained';
                                row.TotalAnnualPOC += mss.AnnualPOC;
                            }
                            levelCount = levelCount+LEVEL;
                        });
                        row.LevelPercentage = (levelCount / (row.CentrifugalPumpMssModel.length * 100)).toFixed(2)
                        //row.ETBC = 10;
                       // row.TotalPONC = 20796;
                        row.TotalPONC = this.UserProductionCost;
                        row.ETBF = this.ETBF ? this.ETBF : 2;
                        row.ETBC = (this.ETBF *  row.LevelPercentage).toFixed(2)
                        row.TotalAnnualCostWithMaintenance = 1.777;
                        row.EconomicRiskWithoutMaintenance = row.TotalPONC / row.ETBF;
                        row.ResidualRiskWithMaintenance = parseFloat((row.TotalAnnualCostWithMaintenance - row.TotalAnnualPOC).toFixed(3));
                        var Data = await this.getTotalEconomicConsequenceClass(row.ETBF,row.ResidualRiskWithMaintenance);
                        row.ResidualRiskWithMaintenanceCR = Data.CriticalityRating
                        var Data1 = await this.getTotalEconomicConsequenceClass(row.ETBF,row.EconomicRiskWithoutMaintenance);
                        row.EconomicRiskWithoutMaintenanceCR = Data1.CriticalityRating
                        let WithETBCAndPONC = row.TotalPONC / row.ETBC;
                        let WithoutETBCAndPONC = row.TotalPONC / 5;
                        row.WithMEI = (((row.TotalPONC / row.ETBF) - (row.TotalPONC / row.ETBC)) / WithETBCAndPONC).toFixed(0);
                        row.WithOutMEI = (((row.TotalPONC / row.ETBF) - (row.TotalPONC / 5)) / WithoutETBCAndPONC).toFixed(0);
                        row.ConsequenceCategory = row.Consequence.split(' ')[0];
                    });
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

    public OpenCBAReport(row) {
        this.CBAReportDetails = row;
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
        var craft = this.PSRClientContractorData.find(r=>r.PSRClientContractorId === skillData.Craft);
        return craft.CraftSF;
    }

    getEmployeeLevelValue(d){
        var skillData = this.SkillLibraryAllrecords.find(r=>r.SKillLibraryId === d.Craft);
        return skillData.Level;
      }
}