import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import jspdf, { jsPDF } from 'jspdf';
// import{} from '../../../../../assets/print/printFile.scss'


import { MessageService } from 'primeng/api';
import { from } from 'rxjs';

@Component({
  selector: 'app-prescriptive-report',
  templateUrl: './prescriptive-report.component.html',
  styleUrls: ['./prescriptive-report.component.scss'],
  providers: [MessageService, DatePipe]
})
export class PrescriptiveReportComponent implements OnInit {
  public FileUrl: any;
  public data: any = []
  public data1: any = []
  public AnnexuresTreeList: any = []
  public SingleFailuerTree: any = []
  public Time: string = "";
  public ChairPerson: string = "";
  public Participants: string = "";
  public prescriptveReportSelect: boolean = true;
  public ReportSelect: boolean = false;
  public attachmentRemark : any =[]
  public url : string =""

  constructor(public datepipe: DatePipe,
    private change: ChangeDetectorRef) { }

  ngOnInit() {
    this.data = JSON.parse(localStorage.getItem('ReportObj'))
    this.attachmentRemark = this.data.centrifugalPumpPrescriptiveFailureModes
    var BrowserURl  = window.location.href
    var BrowserURl = window.location.href.split('#')[0]
    this.data.Date = this.datepipe.transform(this.data.Date, 'dd/MM/YYYY')
    var ConsequenceTree = JSON.parse(this.data.FMWithConsequenceTree)
    var NewTree = JSON.parse(this.data.FMWithConsequenceTree)
    NewTree[0].children[0].children[0].children.forEach((res: any) => {
      this.AnnexuresTreeList.push([res]);
    });
    ConsequenceTree[0].children[0].children[0].children = [];
    this.SingleFailuerTree = ConsequenceTree;
    this.data1 = JSON.parse(this.data.FMWithConsequenceTree)
    console.log(this.data1)
    this.data1[0].children[0].children[0].children.forEach(element => {
      element.data.name = ""
      element.children = []
    });
    this.change.detectChanges();
  }

  async ngOnDestroy() {
    await localStorage.removeItem('ReportObj')
  }

  public DownloadPDF() {
    var data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
    var imgData = canvas.toDataURL('image/png');
    var imgWidth = 190;
    var pageHeight = 290;
    var imgHeight = canvas.height * imgWidth / canvas.width;
    var heightLeft = imgHeight;
    var doc = new jsPDF('p', 'mm', "a4");
    var position = 0;
    doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight+90);
    heightLeft -= pageHeight;
    while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight+90);
        heightLeft -= pageHeight;
    }
  doc.save("PrescriptiveFMEA Report.pdf");
});
  }


  // printPage() {
  //   let printContents = document.getElementById('contentToConvert').innerHTML;
  //   let originalContents = document.body.innerHTML;
  //   document.body.innerHTML = printContents;
  //   window.print();
  //   document.body.innerHTML = originalContents;  
  
  // }


  printPage() {
    // let printContents = document.getElementById('contentToConvert').innerHTML;
    // let documentContent = "<html><head>";
    // documentContent += '<link rel="stylesheet" type="text/css" href="../../../../../assets/printFile.scss"/>';
    // documentContent += '</head>';
    // documentContent += '<body onload="window.print()">' + printContents + '</body></html>' 

      // let popupWinindow;
      // var printContents = document.getElementById("contentToConvert").innerHTML;
      // popupWinindow = window.open('', '_blank', 'width=1600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
      // popupWinindow.document.open();
      // popupWinindow.document.write(`<html>
      //       <head>
      //         <title></title>
      //         <link rel="stylesheet" type="text/css" media="screen,print" href="assets/printFile.scss">

      //       </head>
      //   <body onload="window.print();window.close()">`
      //       + printContents + `</body>
      //     </html>`
      //   );
        
      // popupWinindow.document.close();

      // const printContent = document.getElementById("contentToConvert");
      // const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
      // WindowPrt.document.write(printContent.innerHTML);
      //  WindowPrt.document.write('<link rel="stylesheet" type="text/scss" href="../../../assets/printFile.scss">');
      //  WindowPrt.document.close();
      //  WindowPrt.focus();
      //  WindowPrt.print();
      // WindowPrt.close();
      
    let popupWinindow;
    let printContents = document.getElementById('contentToConvert').innerHTML;
    popupWinindow = window.open('', '_blank', 'width=1600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
    popupWinindow.document.open();
    let documentContent = "<html><head>";
    documentContent += '<link rel="stylesheet" href="/dist/DPM/assets/printFile.scss">';
    documentContent += '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css">';
    documentContent += '</head>';
    documentContent += '<body onload="window.print()">' + printContents + '</body></html>'
    popupWinindow.document.write(documentContent);
    popupWinindow.document.close();
    
  }

  GeneratePrescriptionReport() {
    if (this.ChairPerson.length > 0 && this.Participants.length > 0) {
      this.prescriptveReportSelect = false
      this.ReportSelect = true
      this.ChairPerson = this.ChairPerson.toUpperCase()
      this.Participants = this.Participants.toUpperCase()
    } else {
      alert("Fields are missing")
    }
  }


}
