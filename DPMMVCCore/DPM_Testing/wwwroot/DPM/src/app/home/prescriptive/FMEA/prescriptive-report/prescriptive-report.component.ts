import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import html2canvas from 'html2canvas';
import jspdf, { jsPDF } from 'jspdf';
import { MessageService } from 'primeng/api';
import { PDFDocument } from 'pdf-lib';
import * as Chart from 'chart.js';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';

@Component({
  selector: 'app-prescriptive-report',
  templateUrl: './prescriptive-report.component.html',
  styleUrls: ['./prescriptive-report.component.scss', '../../../../../assets/orgchart.scss'],
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
  public hide: boolean = false;
  public TypeMethodology: string = "";
  public TypeCurrentandfuture: string = "";
  public ParentAttachmentFile: string = ""
  public ReportRCMType: string = ""
  public NewTree: any;
  public FCAPatternEnable: boolean = false
  constructor(public datepipe: DatePipe,
    private change: ChangeDetectorRef,
    public sanitizer: DomSanitizer,
    private messageService: MessageService,
    private changeDetectorRef: ChangeDetectorRef,
    private commonLoadingDirective: CommonLoadingDirective) {
  }

  ngOnInit() {
    this.data = JSON.parse(localStorage.getItem('ReportObj'))
    if (this.data.CAttachmentDBPath != null) {
      var FileExt = this.getFileExtension(this.data.CAttachmentDBPath)
      if (FileExt.toLowerCase() == 'pdf') {
        let obj = {}
        obj['Link'] = this.data.CAttachmentDBPath;
        this.PDFURL.push(obj)
      }
    }
    this.attachmentRemark = this.data.centrifugalPumpPrescriptiveFailureModes
    this.BrowserURl = window.location.href
    this.BrowserURl = window.location.href.split('#')[0]
    this.data.Date = this.datepipe.transform(this.data.Date, 'dd/MM/YYYY')
    var ConsequenceTree = JSON.parse(this.data.FMWithConsequenceTree)
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
    if (this.Time && this.TypeMethodology && this.TypeCurrentandfuture) {
      this.hide = true;
      this.change.detectChanges();
      this.commonLoadingDirective.showLoading(true, 'Downloading....');
      var data = document.getElementById('contentToConvert');
      var pdfdata = html2canvas(data).then(canvas => {
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
        this.commonLoadingDirective.showLoading(false, '');
      });
      this.hide = false;
    } else {
      this.messageService.add({ severity: 'info', summary: 'Note', detail: 'Fill the mandatory fields' });
    }
  }

  async mergePdfs(pdfsToMerges: ArrayBuffer) {
    const mergedPdf = await PDFDocument.create();
    const pdf = await PDFDocument.load(pdfsToMerges);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => {
      mergedPdf.addPage(page);
    });

    let pdfsToMerge = [];
    if (this.PDFURL.length > 0) {
      this.PDFURL.forEach(item => {
        pdfsToMerge.push(`${this.BrowserURl}${item.Link}`);
      });
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
    this.hide = false;
    this.change.detectChanges();
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
    if (this.Time && this.TypeMethodology && this.TypeCurrentandfuture) {
      this.hide = true;
      this.change.detectChanges();
      let popupWinindow;
      let printContents = document.getElementById('contentToConvert').innerHTML;
      popupWinindow = window.open('', '_blank', 'width=1600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
      popupWinindow.document.open();
      let documentContent = "<html><head>";
      documentContent += '<link rel="stylesheet" href="/dist/DPM/assets/css/bootstrap.css">';
      documentContent += '<link rel="stylesheet" href="/dist/DPM/assets/vendor/fontawesome-free/css/all.min.css">';
      documentContent += '<link rel="stylesheet" href="/dist/DPM/assets/css/primeng/primeicons/primeicons.css">';
      documentContent += '<link rel="stylesheet" href="/dist/DPM/assets/css/primeng/resources/themes/saga-blue/theme.css">';
      documentContent += '<link rel="stylesheet" href="/dist/DPM/assets/css/primeng/resources/primeng.min.css">';
      documentContent += '<link rel="stylesheet" href="/dist/DPM/assets/css/print.css">';
      documentContent += '<link rel="stylesheet" href="/dist/DPM/assets/css/Chart.min.css">';
      documentContent += '</head>';
      documentContent += '<body onload="window.print()">' +
        '<script  src="/dist/DPM/assets/css/Chart.min.js"></script>' + printContents + '</body></html>'
      popupWinindow.document.write(documentContent);
      popupWinindow.document.close();
      this.hide = false;
      this.change.detectChanges();
    } else {
      this.messageService.add({ severity: 'info', summary: 'Note', detail: 'Fill the mandatory fields' });
    }
  }

  GeneratePrescriptionReport() {
    if (this.ChairPerson.length > 0 && this.Participants.length > 0) {
      this.prescriptveReportSelect = false
      this.ReportSelect = true
      this.ChairPerson = this.ChairPerson.toUpperCase()
      this.Participants = this.Participants.toUpperCase()
      if (this.PDFURL.length > 0) {
        this.ReportSelect1 = true
      }
      this.changeDetectorRef.detectChanges();
      this.GenerateTypeReport();
    } else {
      this.messageService.add({ severity: 'info', summary: 'Note', detail: 'Fields are missing' });
    }
  }

  GenerateTypeReport() {
    this.changeDetectorRef.detectChanges();
    if (this.ReportRCMType == 'FMEA') {
      this.NewTree = JSON.parse(this.data.FMWithConsequenceTree)
      // this.NewTree[0].children[0].children[0].children.forEach((res: any) => {
      this.NewTree[0].children[0].children[0].FMEA[0].children[0].children[0].children.forEach((res: any) => {
        for (let index = 0; index < this.attachmentRemark.length; index++) {
          if (res.data.name == this.attachmentRemark[index].FunctionMode) {
            var extn = this.getFileExtension(this.attachmentRemark[index].AttachmentDBPath)
            this.FCAPatternEnable = false
            this.changeDetectorRef.detectChanges()
            if (extn.toLowerCase() == 'pdf') {
              let obj = {}
              obj['FM'] = res.data.name;
              obj['Remark'] = this.attachmentRemark[index].Remark;
              obj['Link'] = this.attachmentRemark[index].AttachmentDBPath;
              this.PDFURL.push(obj)
            }

            if (extn.toLowerCase() == 'jpg' || extn.toLowerCase() == 'jpeg' || extn.toLowerCase() == 'png') {
              res.imgPath = this.sanitizer.bypassSecurityTrustResourceUrl(this.attachmentRemark[index].AttachmentDBPath);
              res.Remark = this.attachmentRemark[index].Remark
            } else if (extn.toLowerCase() == 'pdf') {
              res.pdfPath = `${this.BrowserURl}${this.attachmentRemark[index].AttachmentDBPath}`;
              res.pdfRemark = this.attachmentRemark[index].Remark
            }
          }
        }
        this.AnnexuresTreeList.push([res]);
      });
    } else if (this.ReportRCMType == 'FCA') {
      var patternIds: any = []
      for (let index = 0; index < this.attachmentRemark.length; index++) {
        var id = "ViewPattern"
        var i = index + 1
        patternIds.push(`${id}${i}`)
      }
      this.NewTree = JSON.parse(this.data.FMWithConsequenceTree)
      // this.NewTree[0].children[0].children[0].children.forEach((res: any) => {
      this.NewTree[0].children[0].children[0].FCA[0].children[0].children[0].children.forEach((res: any) => {
        for (let index = 0; index < this.attachmentRemark.length; index++) {
          if (res.data.name == this.attachmentRemark[index].FunctionMode) {
            var extn = this.getFileExtension(this.attachmentRemark[index].AttachmentDBPath)
            this.FCAPatternEnable = true
            this.changeDetectorRef.detectChanges()
            res.Pattern = patternIds[index];
            if (extn.toLowerCase() == 'pdf') {
              let obj = {}
              obj['FM'] = res.data.name;
              obj['Remark'] = this.attachmentRemark[index].Remark;
              obj['Link'] = this.attachmentRemark[index].AttachmentDBPath;
              this.PDFURL.push(obj)
            }

            if (extn.toLowerCase() == 'jpg' || extn.toLowerCase() == 'jpeg' || extn.toLowerCase() == 'png') {
              res.imgPath = this.sanitizer.bypassSecurityTrustResourceUrl(this.attachmentRemark[index].AttachmentDBPath);
              res.Remark = this.attachmentRemark[index].Remark
            } else if (extn.toLowerCase() == 'pdf') {
              res.pdfPath = `${this.BrowserURl}${this.attachmentRemark[index].AttachmentDBPath}`;
              res.pdfRemark = this.attachmentRemark[index].Remark
            }
          }
        }
        this.AnnexuresTreeList.push([res]);
        this.changeDetectorRef.detectChanges();
        for (let index = 0; index < this.attachmentRemark.length; index++) {
          var ChartId = patternIds[index]
          var p = this.attachmentRemark[index].Pattern
          if (p == 'Pattern 1') {
            const patternLabel1 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
            const patternData1 = [20, 10, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 10, 20];
            this.getChartTree(patternLabel1, patternData1, ChartId, p);
          } else if (p == 'Pattern 2') {
            const patternLabel2 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
            const patternData2 = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 6, 8, 10, 20];
            this.getChartTree(patternLabel2, patternData2, ChartId, p);
          } else if (p == 'Pattern 3') {
            const patternLabel3 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
            const patternData3 = [0, 0, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 14, 15, 20];
            this.getChartTree(patternLabel3, patternData3, ChartId, p);
          } else if (p == 'Pattern 4') {
            const patternLabel4 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
            const patternData4 = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1, 1, 1, 1, 1];
            this.getChartTree(patternLabel4, patternData4, ChartId, p);
          } else if (p == 'Pattern 5') {
            const patternLabel5 = ["20", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "20"];
            const patternData5 = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
            this.getChartTree(patternLabel5, patternData5, ChartId, p);
          } else if (p == 'Pattern 6') {
            const patternLabel6 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
            const patternData6 = [20, 10, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8];
            this.getChartTree(patternLabel6, patternData6, ChartId, p);
          }

        }
      });
    }
  }


  private getChartTree(labels: any[], data: any[], id: string, title: string) {
    let patternCharts = new Chart(id, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Time',
          data: data,
          fill: true,
          borderColor: '#2196f3',
          backgroundColor: '#2196f3',
          borderWidth: 1
        }]
      },
      options: {
        elements: {
          point: {
            radius: 0
          }
        },
        title: {
          display: true,
          text: title
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            ticks: {
              beginAtZero: true,
              display: false
            },
            scaleLabel: {
              display: true,
              labelString: 'Time'
            }
          }],
          yAxes: [{
            gridLines: {
              display: true,
              color: 'rgba(219,219,219,0.3)',
              zeroLineColor: 'rgba(219,219,219,0.3)',
              drawBorder: false,
              lineWidth: 27,
              zeroLineWidth: 1
            },
            ticks: {
              beginAtZero: true,
              display: false
            },
            scaleLabel: {
              display: true,
              labelString: 'Failure probability'
            }
          }]
        }
      }
    });
    this.changeDetectorRef.detectChanges();
  }



}
