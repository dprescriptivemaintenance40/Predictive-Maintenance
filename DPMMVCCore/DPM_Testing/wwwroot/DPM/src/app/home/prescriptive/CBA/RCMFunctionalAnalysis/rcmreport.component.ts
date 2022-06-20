import { Component } from "@angular/core";
import { PDFDocument } from 'pdf-lib';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';



@Component({
    selector: 'app-rcmreport',
    templateUrl: './rcmreport.component.html',
    styleUrls: ['./rcmreport.component.css'],
})
export class RCMFunctionalAnalysis {
    public cols = [{
        task:'Replace oil pump',
        freq:'Y4',
        rwc:'MEC',
        poc:'0.273',	
        annpoc:'0.068',
        status:'New'
    },
    {
        task:'Vibration Monitoring',
        freq:'W1',
        rwc:'REL',
        poc:'0.091',	
        annpoc:'4.732',
        status:'Retained'
    },
    {
        task:'Overhauling oil pump',
        freq:'Y1',
        rwc:'MEC',
        poc:'0.182',	
        annpoc:'0.182',
        status:'Retained'
    },
    {
        task:'Lube Oil Condition Monitoring',
        freq:'W1',
        rwc:'REL',
        poc:'0.011',	
        annpoc:'0.572',
        status:'Deleted'
    }
];
    constructor() {

    }
    DownloadPDF() {
        
            
            
        // html2canvas(document.getElementById("pdfTable1")!).then(canvas => {
        //     // Few necessary setting options

        //     const contentDataURL = canvas.toDataURL('image/png')
        //     let pdf = new jsPDF('p', 'mm', 'a6'); // A4 size page of PDF
        //     var width = pdf.internal.pageSize.getWidth();
        //     var height = canvas.height * width / canvas.width;
        //     pdf.addImage(contentDataURL, 'PNG', 0, 0, width, height)
        //     pdf.save('output.pdf'); // Generated PDF
        // });
    }
}