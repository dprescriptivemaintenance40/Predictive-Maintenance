import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { MessageService } from "primeng/api";
import * as XLSX from 'xlsx';

@Component({
    templateUrl: './cost-benefit-analysis.component.html',
    providers: [MessageService]
})
export class CostBenefitAnalysisComponent {

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
    public ETBF: string = '';
    public RiskMatrixLibraryRecords : any = [];
    public EconmicConsequenceClass : string ="";
    public CriticalityRating : string = "";
    constructor(private messageService: MessageService,
        private http: HttpClient) {
        this.MachineEquipmentSelect();
        this.getPrescriptiveRecords();
        this.GetRiskMatrixLibraryRecords();
        this.UserDetails = JSON.parse(localStorage.getItem('userObject'));
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
                    this.getTotalEconomicConsequenceClass(2 , 199);
                }
            }, err=>{ console.log(err.error)}
        )
    }

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

    MachineEquipmentSelect() {
        if (this.MachineType == "Pump") {
            this.EquipmentList = []
            this.EquipmentList = ["Centrifugal Pump"]
        }
        if (this.MachineType == "Compressor") {
            this.EquipmentList = []
            this.EquipmentList = ["Screw Compressor"]
        }
    }
    getPrescriptiveRecords() {
        this.http.get('api/PrescriptiveAPI/GetTagNumber')
            .subscribe((res: any) => {
                res.forEach(element => {
                    this.TagList.push(element.TagNumber)
                });
            });
    }
  async  getPrescriptiveRecordsByEqui() {
        if (this.MachineType && this.EquipmentType && this.SelectedTagNumber) {
            this.prescriptiveRecords = [];
            this.http.get(`api/PrescriptiveAPI/GetPrescriptiveByEquipmentType?machine=${this.MachineType}&Equi=${this.EquipmentType}&TagNumber=${this.SelectedTagNumber}`)
                .subscribe( async (res: any) => {
                    this.prescriptiveRecords = res;
                    this.prescriptiveRecords.centrifugalPumpPrescriptiveFailureModes.forEach( async row => {
                        row.TotalAnnualPOC = 0;
                        row.CentrifugalPumpMssModel.forEach(mss => {
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
                        row.ETBF = this.ETBF ? this.ETBF : 2;
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
}