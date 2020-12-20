import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';

interface ProfileData {
  ProfileID: Number;
  Company: String;
  Email: String;
  Contact: String;
  FocalPersonName: String;
}

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})

export class ReportComponent implements OnInit {


  constructor(private http: HttpClient) {

  }

  ngOnInit() {

    this.http.get<any>("api/CompressureDetailsAPI").subscribe(
      res => { this.classificationDetails = res }, error => console.log(error)
    );



  }


  reportVisible = false;
  reportHide = true
  Select() {
    this.reportVisible = true;
    this.reportHide = false;
    console.log(this.TagNumber)
    console.log(this.EquipmentType)
  }

  classificationDetails: any = []
  companyDetail: any = []
  Company: string = " COMPANY ABC";
  FocalPersonName: string = "XYZ"
  Email: string = "abc@example.com"
  Contact: string = "9011335781"
  TagNumber: string;
  EquipmentType: string = "";
  Date: string = "16-Dec-2020";
  DOA: string = "16-Dec-2020";
  ACC: string;
  AFP: string;
  RK: any = "L/M/H= M | HSECES= Y | CRIT= II";
  DAB: any;

  incipient;
  degrade;
  normal;
  totalCount;
  incipientPerentage;
  degradePercentage;
  normalpercentage;
  PerformanceNumber: any;



  public GenerateReport() {
    ///**************************Start of Input report***************** */
    // this.http.get<any>('api/ProfileAPI').subscribe(
    //     res=>{ var companyDetail:any=res} ,error => console.log(error)

    //   );

    // var companyDetail:ProfileData[]
    // this.Company = companyDetail.Company
    // this.FocalPersonName= this.companyDetail.FocalPersonName;
    // this.Email=this.companyDetail.Email;
    // this.Contact=this.companyDetail.Contact;


    ///****************************End of INPUT REPORT*********************** */

    /// ************************************OUTPUT OF REPORT************************************************
    var countKey = Object.keys(this.classificationDetails).length;
    console.log(countKey);// find number of length of json object
    this.totalCount = countKey
    console.log('total count', this.totalCount)

    var uniqueNames = [];
    var uniqueObj = [];

    for (var i = 0; i < this.classificationDetails.length; i++) {

      if (uniqueNames.indexOf(this.classificationDetails[i].Classification) === -1) {
        uniqueObj.push(this.classificationDetails[i])
        uniqueNames.push(this.classificationDetails[i].Classification);
      }

    }

    console.log("unique count :", uniqueObj)


    var result: any = [];

    this.classificationDetails.forEach(function (o) {
      Object.keys(o).forEach(function (k) {
        result[k] = result[k] || {};
        result[k][o[k]] = (result[k][o[k]] || 0) + 1;
      });
    });
    this.incipient = result.Classification.incipient;
    this.degrade = result.Classification.degrade;
    this.normal = result.Classification.normal;
    console.log('Normal Count :', this.normal)
    console.log('Incipient Count', this.incipient)
    console.log('Degrade Count :', this.degrade)


    /// percentage calculation

    this.normalpercentage = this.normal / this.totalCount * 100
    console.log('Normal Percentage : ', this.normalpercentage);

    this.incipientPerentage = this.incipient / this.totalCount * 100
    console.log('Incipient Percentage : ', this.incipientPerentage)

    this.degradePercentage = this.degrade / this.totalCount * 100
    console.log('Degrade Percentage : ', this.degradePercentage)

    var a: any = [((this.normalpercentage / 100) * 1) + ((this.incipientPerentage / 100) * 5) + ((this.degradePercentage / 100) * 10)];
    console.log(a);
    var b: any = [((this.normalpercentage / 100) * 1) + ((this.incipientPerentage / 100) * 5) + ((this.degradePercentage / 100) * 10)];
    console.log(b);
    var LMH: any = [(0 * 1) + (1 * 5) + (0 * 10)]
    console.log(LMH)
    var HSECES: any = [(0 * 1) + (1 * 10)]
    console.log(HSECES)
    var CRIT: any = [(0 * 10) + (1 * 5) + (0 * 1)]
    console.log(CRIT)

    this.PerformanceNumber = [parseFloat(a) + parseFloat(b) +
      parseFloat(LMH) + parseFloat(HSECES)
      + parseFloat(CRIT)];

    console.log(this.PerformanceNumber);
    if (this.PerformanceNumber > 50) {
      this.DAB = "Y"
    } else {
      this.DAB = "N"
    }


    // ******************************End of OUTPUT REPORT*******************************

  }


  public DownloadPDF() {
    //   var countKey = Object.keys(this.classificationDetails).length;
    //   console.log(countKey);// find number of length of json object
    //   this.totalCount=countKey
    //   console.log('total count', this.totalCount )

    //   var uniqueNames = [];
    //   var uniqueObj = [];

    //   for( var i = 0; i< this.classificationDetails.length; i++){    

    //       if(uniqueNames.indexOf(this.classificationDetails[i].Classification) === -1){
    //           uniqueObj.push(this.classificationDetails[i])
    //           uniqueNames.push(this.classificationDetails[i].Classification);        
    //       }       

    //   }

    //   console.log("unique count :",uniqueObj)


    //  var result:any=[];

    //  this.classificationDetails.forEach(function (o) {
    //       Object.keys(o).forEach(function (k) {
    //           result[k] = result[k] || {};
    //           result[k][o[k]] = (result[k][o[k]] || 0) + 1;
    //       });
    //   });
    //   this.incipient= result.Classification.incipient;
    //   this.degrade= result.Classification.degrade;
    //   this.normal=result.Classification.normal;
    //   console.log('Normal Count :',this.normal)
    //   console.log('Incipient Count',this.incipient)
    //   console.log('Degrade Count :',this.degrade)


    //  /// percentage calculation

    //  this.normalpercentage = this.normal/this.totalCount
    //  console.log('Normal Percentage : ', this.normalpercentage);

    //  this.incipientPerentage = this.incipient/this.totalCount 
    //  console.log('Incipient Percentage : ',this.incipientPerentage)

    //  this.degradePercentage = this.degrade/this.totalCount 
    //  console.log('Degrade Percentage : ',this.degradePercentage)


    // var a:any = [(this.normalpercentage*1) + (this.incipientPerentage*5) + (this.degradePercentage*10)];
    // console.log(a);
    // var b:any =[(this.normalpercentage*1) + (this.incipientPerentage*5) + (this.degradePercentage*10)] ;
    // console.log(b);
    // var LMH:any =[(0*1)+(1*5)+(0*10)]
    // console.log(LMH)
    // var HSECES:any=[(0*1)+(1*10)] 
    // console.log(HSECES)
    // var CRIT:any =[(0*10)+(1*5)+(0*1)]
    // console.log(CRIT)

    // this.PerformanceNumber = [parseFloat(a) + parseFloat(b) + 
    //                           parseFloat(LMH) + parseFloat( HSECES)
    //                            + parseFloat( CRIT )];

    // console.log(this.PerformanceNumber);







    var data = document.getElementById('contentToConvert');
    html2canvas(data, { scrollY: -window.scrollY, scale: 1 }).then(canvas => {
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 2;
      var margin = 2;
      pdf.addImage(contentDataURL, 'PNG', 10, position, imgWidth, imgHeight)
      pdf.save('Compressor Report.pdf'); // Generated PDF  

    });
  }



}
