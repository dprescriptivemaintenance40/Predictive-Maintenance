import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import html2canvas from 'html2canvas';
import jspdf, { jsPDF } from 'jspdf';
import { MessageService } from 'primeng/api';
import { PDFDocument } from 'pdf-lib'

@Component({
  selector: 'app-prescriptive-report',
  templateUrl: './prescriptive-report.component.html',
  styleUrls: ['./prescriptive-report.component.scss'],
  providers: [MessageService, DatePipe]
})
export class PrescriptiveReportComponent implements OnInit {
  public FileUrl: any;
  public data: any = []
  public EditdbPathURL: SafeUrl;
  public data1: any = []
  public AnnexuresTreeList: any = []
  public PDFFile: any = []
  public SingleFailuerTree: any = []
  public Time: string = "";
  public ChairPerson: string = "";
  public Participants: string = "";
  public prescriptveReportSelect: boolean = true;
  public ImageEnable: boolean = true;
  public ReportSelect: boolean = false;
  public ReportSelect1: boolean = false;
  public attachmentRemark: any = []
  public url: string = ""
  public fileUpload: string = "";
  public FileSafeUrl: any;
  public BrowserURl: string = "";
  public PDFURL: any = []
  public path: string = "";


  constructor(public datepipe: DatePipe,
    private change: ChangeDetectorRef,
    public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.data = JSON.parse(localStorage.getItem('ReportObj'))
    this.attachmentRemark = this.data.centrifugalPumpPrescriptiveFailureModes
    this.BrowserURl = window.location.href
    this.BrowserURl = window.location.href.split('#')[0]
    this.data.Date = this.datepipe.transform(this.data.Date, 'dd/MM/YYYY')
    var ConsequenceTree = JSON.parse(this.data.FMWithConsequenceTree)
    var NewTree = JSON.parse(this.data.FMWithConsequenceTree)
    var NewTree = JSON.parse(this.data.FMWithConsequenceTree)
    NewTree[0].children[0].children[0].children.forEach((res: any) => {
      for (let index = 0; index < this.attachmentRemark.length; index++) {
        if (res.data.name == this.attachmentRemark[index].FunctionMode) {
          var extn = this.getFileExtension(this.attachmentRemark[index].AttachmentDBPath)
          if (extn == 'jpg' || extn == 'png') {
            res.imgPath = this.sanitizer.bypassSecurityTrustResourceUrl(this.attachmentRemark[index].AttachmentDBPath);
            res.Remark = this.attachmentRemark[index].Remark
          } else {
            let obj = {}
            obj['FM'] = res.data.name;
            obj['Remark'] = this.attachmentRemark[index].Remark;
            obj['Link'] = this.attachmentRemark[index].AttachmentDBPath;
            this.PDFURL.push(obj)
          }

        }
      }
      this.AnnexuresTreeList.push([res]);
    });
    ConsequenceTree[0].children[0].children[0].children = [];
    this.SingleFailuerTree = ConsequenceTree;
    this.data1 = JSON.parse(this.data.FMWithConsequenceTree)
    this.data1[0].children[0].children[0].children.forEach(element => {
      element.data.name = ""
      element.children = []
    });
    this.change.detectChanges();
    this.FileUrl = this.attachmentRemark;
    console.log(this.FileUrl)
    var str = this.data.centrifugalPumpPrescriptiveFailureModes[0].AttachmentDBPath
    var remark = this.data.centrifugalPumpPrescriptiveFailureModes[0].Remark
    this.EditdbPathURL = this.sanitizer.bypassSecurityTrustResourceUrl(str);
    var extension = this.getFileExtension(str);
    if (extension.toLowerCase() == 'jpg' || extension.toLowerCase() == 'jpeg' || extension.toLowerCase() == 'png') {
      this.ImageEnable = true;
    } else if (extension.toLowerCase() == 'pdf') {
      this.ImageEnable = false;
    }
    console.log(extension)
  }
  async ngOnDestroy() {
    await localStorage.removeItem('ReportObj')
  }

  getFileExtension(filename) {
    const extension = filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename;
    return extension;
  }

  public DownloadPDF() {
    var data = document.getElementById('contentToConvert');
    var  pdfdata =  html2canvas(data).then(canvas => {
      var imgData = canvas.toDataURL('image/png');
      var imgWidth = 190;
      var pageHeight = 298;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
      var doc = new jsPDF('p', 'mm', "a4");
      var position = 0;
      doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight + 90);
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight + 90);
        heightLeft -= pageHeight;
      }
      const arrbf = doc.output("arraybuffer");
      this.mergePdfs(arrbf);

    });
  }

  async mergePdfs(pdfsToMerges: ArrayBuffer) {
    const mergedPdf = await PDFDocument.create();    
    const pdf = await PDFDocument.load(pdfsToMerges);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => {
      mergedPdf.addPage(page);
      });
    
    let pdfsToMerge = [];
    for (let i = 0; i < this.attachmentRemark.length; i++) {
      let pdf = this.BrowserURl + this.attachmentRemark[i].AttachmentDBPath;
      pdfsToMerge.push(pdf);
    }
    for (const pdfCopyDoc of pdfsToMerge) {
      const pdfBytes = await fetch(pdfCopyDoc).then(res => res.arrayBuffer())
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => {
        mergedPdf.addPage(page);
      });
    }
    const savedpdf = await mergedPdf.save();
    this.saveByteArray("FMEA Analysis Report", savedpdf);    
  }

  saveByteArray(reportName, byte) {
    var blob = new Blob([byte], { type: "application/pdf" });
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = reportName;
    link.download = fileName;
    link.click();
  };

  printPage() {
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
      if(this.PDFURL.length > 0 ){
        this.ReportSelect1 = true
      }
    } else {
      alert("Fields are missing")
    }
  }
}
