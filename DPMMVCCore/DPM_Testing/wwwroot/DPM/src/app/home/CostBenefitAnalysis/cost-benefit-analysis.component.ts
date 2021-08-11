import { HttpClient } from "@angular/common/http";
import { ChangeDetectorRef, Component } from "@angular/core";
import { MessageService } from "primeng/api";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CommonLoadingDirective } from "src/app/shared/Loading/common-loading.directive";

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
    public CBAReportDetails: any;
    constructor(private messageService: MessageService,
        private http: HttpClient,
        private CD: ChangeDetectorRef,
        private commonLoadingDirective: CommonLoadingDirective) {
        this.MachineEquipmentSelect();
        this.getPrescriptiveRecords();
        this.UserDetails = JSON.parse(localStorage.getItem('userObject'));
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
    public getPrescriptiveRecordsByEqui() {
        if (this.MachineType && this.EquipmentType && this.SelectedTagNumber) {
            this.prescriptiveRecords = [];
            this.CBAReportDetails = undefined;
            this.http.get(`api/PrescriptiveAPI/GetPrescriptiveByEquipmentType?machine=${this.MachineType}&Equi=${this.EquipmentType}&TagNumber=${this.SelectedTagNumber}`)
                .subscribe((res: any) => {
                    this.prescriptiveRecords = res;
                    this.prescriptiveRecords.centrifugalPumpPrescriptiveFailureModes.forEach(row => {
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
}