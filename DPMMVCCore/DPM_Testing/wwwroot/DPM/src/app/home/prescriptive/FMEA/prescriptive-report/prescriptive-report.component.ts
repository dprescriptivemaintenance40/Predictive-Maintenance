import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
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

   public data: any = []
   public data1: any = []
   public AnnexuresTreeList : Array<any> = [] ;
   public SingleFailuerTree : any =[]
  

  constructor( public datepipe: DatePipe,
    private messageService: MessageService,) {  }

  ngOnInit(){  
   this.data= JSON.parse(localStorage.getItem('ReportObj'))
   this.data.Date = this.datepipe.transform(this.data.Date,'dd/MM/YYYY')
   var ConsequenceTree = JSON.parse(this.data.FMWithConsequenceTree)
   var NewTree = JSON.parse(this.data.FMWithConsequenceTree)
   ConsequenceTree[0].children[0].children[0].children = []
    NewTree[0].children[0].children[0].children.forEach(element => {
    ConsequenceTree[0].children[0].children[0].children = []
    ConsequenceTree[0].children[0].children[0].children.push(element)
    let data = ConsequenceTree
    this.AnnexuresTreeList.push(data)
   });

   console.log(this.SingleFailuerTree)
   }

   async ngOnDestroy(){
    await localStorage.removeItem('ReportObj')
  }

  // public DownloadPDF(){
  //   //window.print() 
  // }

  // public DownloadPDF() {
  //   var data = document.getElementById('contentToConvert');
  //   html2canvas(data, { scrollY: -window.scrollY, scale: 1 }).then(canvas => {
  //     for (var i = 0; i <= data.clientHeight/980; i++) {
  //       var imgWidth = 190;
  //       var pageHeight = 220;
  //       var imgHeight = canvas.height * imgWidth / canvas.width;
  //       var heightLeft = imgHeight;
  //       const contentDataURL = canvas.toDataURL('image/png')
  //       var pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
  //       var position = 2;
  //       pdf.addImage(contentDataURL, 'PNG', 10, position, imgWidth, imgHeight)
  //       pdf.setPage(i+1);
  //     }
  //    // pdf.addPage();
  //     pdf.save('PrescriptiveFMEA Report.pdf'); // Generated PDF
  //   });
  // } 


  DownloadPDF(){
		var HTML_Width = 190 ;
		var HTML_Height = 220;
		var top_left_margin = 15;
		var PDF_Width : number = HTML_Width+(top_left_margin*2);
    var PDF_Width1 : any = HTML_Width+(top_left_margin*2)
		var PDF_Height = (PDF_Width*1.5)+(top_left_margin*2);
    var PDF_Height1 : any =  (PDF_Width*1.5)+(top_left_margin*2);
		var canvas_image_width = HTML_Width;
		var canvas_image_height = HTML_Height;
		
		var totalPDFPages = Math.ceil(HTML_Height/PDF_Height)-1;
		
    var data = document.getElementById('contentToConvert');
		html2canvas(data,{allowTaint:true}).then(function(canvas) {
			canvas.getContext('2d');	
			console.log(canvas.height+"  "+canvas.width);
			var imgData = canvas.toDataURL("image/jpeg", 1.0);
			var pdf = new jspdf('p', 'mm', 'a4',);
		    pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin,canvas_image_width,canvas_image_height);
			
			for (var i = 1; i <= totalPDFPages; i++) { 
				pdf.addPage(PDF_Width1, PDF_Height1);
				pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height*i)+(top_left_margin*4),canvas_image_width,canvas_image_height);
			}
		    pdf.save("PrescriptiveFMEA Report.pdf");
        });
	};
}
