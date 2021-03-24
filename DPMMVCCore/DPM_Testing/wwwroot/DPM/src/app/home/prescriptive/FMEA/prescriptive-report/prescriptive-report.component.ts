import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { MessageService } from 'primeng/api';

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
  public attachmentRemarkTable: boolean = false; 
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

  public DownloadPDF(){ 
   let printContents = document.getElementById('contentToConvert').innerHTML;
   let originalContents = document.body.innerHTML;
   document.body.innerHTML = printContents;
   window.print();
   document.body.innerHTML = originalContents;
  // window.print();
  
  }
  

  // public DownloadPDF() {
  //   var data = document.getElementById('contentToConvert');
  //   html2canvas(data, { scrollY: -window.scrollY, scale: 1 }).then(canvas => {
  //     for (var i = 0; i <= data.clientHeight/980; i++) {
  //        var imgWidth = 190;
  //       var pageHeight = 220;
  //       var imgHeight = canvas.height * imgWidth / canvas.width;
  //       var heightLeft = imgHeight;
  //       const contentDataURL = canvas.toDataURL('image/png')
  //       var pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
  //       var position = 2;
  //       pdf.addImage(contentDataURL, 'PNG', 10, position, imgWidth, imgHeight)
  //       pdf.setPage(i+1);
  //     }
  //     pdf.addPage();
  //     pdf.save('PrescriptiveFMEA Report.pdf'); // Generated PDF
  //   });
  // } 

  // DownloadPDF() {
  //   var HTML_Width = 190;
  //   var HTML_Height = 220;
  //   var top_left_margin = 15;
  //   var PDF_Width: number = HTML_Width + (top_left_margin * 2);
  //   var PDF_Width1: any = HTML_Width + (top_left_margin * 2)
  //   var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
  //   var PDF_Height1: any = (PDF_Width * 1.5) + (top_left_margin * 2);
  //   var canvas_image_width = HTML_Width;
  //   var canvas_image_height = HTML_Height;

  //   var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

  //   var data = document.getElementById('contentToConvert');
  //   html2canvas(data, { allowTaint: true }).then(function (canvas) {
  //     canvas.getContext('2d');
  //     console.log(canvas.height + "  " + canvas.width);
  //     var imgData = canvas.toDataURL("image/jpeg", 1.0);
  //     var pdf = new jspdf('p', 'mm', 'a4',);
  //     pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
  
  //     for (var i = 1; i <= totalPDFPages; i++) {
  //       pdf.addPage(PDF_Width1, PDF_Height1);
  //       pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height); 
  //     }
  //     pdf.save("PrescriptiveFMEA Report.pdf");
  //   });
  // };

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
