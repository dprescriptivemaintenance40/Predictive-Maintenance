import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { UserService } from '../Services/user.services';
import { Title } from '@angular/platform-browser';
import { float } from 'html2canvas/dist/types/css/property-descriptors/float';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  providers: [MessageService]
})

export class ReportComponent implements OnInit {
  private closeResult: string;

  private reportVisible : boolean= false;
  private reportHide : boolean= true;
  private AFPVisible : boolean= false;
  private AFPNotVisible: boolean=false;

  private classificationDetails: any = []
  private user: any = [];
  private companyDetail: any = []
  private TagNumber: string;
  private EquipmentType: string = "";
  private Date = new Date();
  private DOA = new Date();
  private ACC: string;
  private AFP: string;
  private RK: any = "L/M/H= M | HSECES= Y | CRIT= II";
  private DAB: any;

  private incipient : number = 0;
  private degrade : number = 0;
  private normal : number = 0;

  private AFPincipient : number = 0;
  private AFPdegrade : number = 0;
  private AFPnormal : number = 0;

  private FinalAFPincipient : number = 0;
  private FinalAFPdegrade : number = 0;
  private FinalAFPnormal : number = 0;

  private totalCount : number= 0;
  private AFPtotalCount : number= 0;
  private FinalAFPTotalCount : number= 0;

  private incipientPerentage : number = 0
  private degradePercentage : number= 0
  private normalpercentage : number= 0
  private PerformanceNumber: any = 0
  
  private AFPincipientPerentage : number = 0
  private AFPdegradePercentage : number= 0
  private AFPnormalpercentage : number= 0

  private finalPerformanceNumber : number= 0
  private finalACCCalculation : number=0;
  private FinalAFCCalcuation : number=0;
  private screwWithPredictionDetails : any=[]
  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }


  constructor(private http: HttpClient,
              private service: UserService,
              private messageService: MessageService,
              private title: Title) {

  }

  ngOnInit() {
    this.title.setTitle('DPM | Report');

    this.http.get<any>("api/ScrewCompressureAPI").subscribe(
      res => { this.classificationDetails = res }, error => console.log(error)
    );

    this.service.getUserProfile().subscribe(
      res => {
        this.user = res;
      },
      err => {
        console.log(err);
      },
    );

   
    this.http.get<any>('api/ScrewCompressureAPI/GetPrediction', this.headers)
    .subscribe(res => {
      this.screwWithPredictionDetails = res;
      if(this.screwWithPredictionDetails.length==0){
        this.AFPNotVisible=true;
        this.AFPVisible=false;
        this.messageService.add({severity:'info', summary: 'Info',  detail: 'Still You have not done Prediction. Do Prediction & Generate Report', sticky: true});
      } else {
        this.AFPNotVisible=false;
        this.AFPVisible=true;
      }
    }, err => {
      console.log(err.error);
    });



  }


//----------------Modal ------------------------

  // open(content) {
  //   this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
  //     this.closeResult = `Closed with: ${result}`;
  //   }, (reason) => {
  //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  // }
  
  // private getDismissReason(reason: any): string {
  //   if (reason === ModalDismissReasons.ESC) {
  //     return 'by pressing ESC';
  //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //     return 'by clicking on a backdrop';
  //   } else {
  //     return  `with: ${reason}`;
  //   }
  // }
  

//-----------------Modal End----------------------




  public GenerateReport() {
        this.reportVisible = true;
        this.reportHide = false;
        console.log(this.TagNumber)
        console.log(this.EquipmentType)

        /// ************************************OUTPUT OF REPORT************************************************

        /// ------------------Assets Current Condition Calculation--------------------------------------


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

        if( this.classificationDetails != 0){

        this.classificationDetails.forEach(function (o) {
          Object.keys(o).forEach(function (k) {
            result[k] = result[k] || {};
            result[k][o[k]] = (result[k][o[k]] || 0) + 1;
          });
        });
        this.incipient = result.Classification.incipient;
        if (this.incipient == undefined) {
          this.incipient = 0;
        }
        this.degrade = result.Classification.degrade;
        if (this.degrade == undefined) {
          this.degrade = 0;
        }
        this.normal = result.Classification.normal;
        if (this.normal == undefined) {
          this.normal = 0;
        }
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


        // Asset current condition  = ACC

        var ACCCalculation: any = [((this.normalpercentage / 100) * 1) + ((this.incipientPerentage / 100) * 5) + ((this.degradePercentage / 100) * 10)];
        console.log(ACCCalculation);
       
        if(ACCCalculation == NaN){
          ACCCalculation=0;
        }
 
        this.finalACCCalculation = parseFloat(ACCCalculation);

        

   }

 //---------------------END of Assets Current Condition Calculation -------------------------

          


//---------------------Start Of Assets Forecast Condition Calculations------------------------------------------




      // AssestForecastPerformance = AFP
  var AFPcountKey = Object.keys(this.screwWithPredictionDetails).length;
  console.log(AFPcountKey);// find number of length of json object
  this.AFPtotalCount = AFPcountKey
  console.log('AFP total count', this.AFPtotalCount)

  var AFPuniqueNames = [];
  var AFPuniqueObj = [];

  for (var i = 0; i < this.screwWithPredictionDetails.length; i++) {

    if (AFPuniqueNames.indexOf(this.screwWithPredictionDetails[i].Classification) === -1) {
      AFPuniqueObj.push(this.screwWithPredictionDetails[i])
      AFPuniqueNames.push(this.screwWithPredictionDetails[i].Classification);
    }

  }

  console.log("AFP unique count :", AFPuniqueObj)


  var result: any = [];

 if( this.screwWithPredictionDetails.length != 0){


  this.screwWithPredictionDetails.forEach(function (o) {
    Object.keys(o).forEach(function (k) {
      result[k] = result[k] || {};
      result[k][o[k]] = (result[k][o[k]] || 0) + 1;
    });
  });

  this.AFPincipient = result.Prediction.incipient;
  if (this.AFPincipient == undefined) {
    this.AFPincipient = 0;
  }
  this.AFPdegrade = result.Prediction.degrade;
  if (this.AFPdegrade == undefined) {
    this.AFPdegrade = 0;
  }
  this.AFPnormal = result.Prediction.normal;
  if (this.AFPnormal == undefined) {
    this.AFPnormal = 0;
  }
  console.log('AFP Normal Count :', this.AFPnormal)
  console.log('AFP Incipient Count', this.AFPincipient)
  console.log('AFP Degrade Count :', this.AFPdegrade)


  // Assets Forecast Condition is combination of Assets Current Condition plus total count of
  // of normal incipient and degrade in prediction
  // AFPnormal, AFPincipient, AFPdegrade is of Prediction
  // normal, incipient, degrade is of Train or Assets Current Condition
  

  this.FinalAFPnormal = ( this.AFPnormal + this.normal );
  this.FinalAFPincipient = ( this.AFPincipient + this.incipient );
  this.FinalAFPdegrade = ( this.AFPdegrade + this.degrade );

  this.FinalAFPTotalCount = this.totalCount + this.AFPtotalCount



  this.AFPnormalpercentage = ( this.FinalAFPnormal / this.FinalAFPTotalCount * 100 )
  console.log('AFP Normal Percentage : ', this.AFPnormalpercentage);

  this.AFPincipientPerentage = ( this.FinalAFPincipient / this.FinalAFPTotalCount * 100 )
  console.log('AFP Incipient Percentage : ', this.AFPincipientPerentage)

  this.AFPdegradePercentage = ( this.FinalAFPdegrade / this.FinalAFPTotalCount * 100  )
  console.log('AFP Degrade Percentage : ', this.AFPdegradePercentage)

  /// 

  var AFCCalcuation: any = [((this.AFPnormalpercentage / 100) * 1) + ((this.AFPincipientPerentage / 100) * 5) + ((this.AFPdegradePercentage / 100) * 10)];
  
  this.FinalAFCCalcuation = parseFloat(AFCCalcuation);
  console.log(this.FinalAFCCalcuation);
  if(AFCCalcuation == NaN){
    this.FinalAFCCalcuation=0;
  }
  this.messageService.add({severity:'success', summary: 'success', detail: ' To Download Report, Click Download Report Button '});

}else{
  // this.messageService.add({severity:'warning',  detail: 'Prediction have not done yet, Asset Forecast will not Generate ', sticky: true});
  this.messageService.add({severity:'warn', summary: 'Warn', detail: 'Prediction have not done yet, Asset Forecast will not Generate '});
}
//----------------------End of Of Assets Forecast Condition Calculations-----------------------------------------





        //Initially Forecast and ACC same
        //======================
          // var b: any = [((this.normalpercentage / 100) * 1) + ((this.incipientPerentage / 100) * 5) + ((this.degradePercentage / 100) * 10)];
          // console.log(b);

        ///=======END=======
        var LMH: any = [(0 * 1) + (1 * 5) + (0 * 10)]
        console.log(LMH)
        var HSECES: any = [(0 * 1) + (1 * 10)]
        console.log(HSECES)
        var CRIT: any = [(0 * 10) + (1 * 5) + (0 * 1)]
        console.log(CRIT)

        this.PerformanceNumber = [this.finalACCCalculation + this.FinalAFCCalcuation +
          parseFloat(LMH) + parseFloat(HSECES)
          + parseFloat(CRIT)];

        this.finalPerformanceNumber = parseFloat(this.PerformanceNumber);

        console.log(this.PerformanceNumber);
        if (this.PerformanceNumber > 10) {
          this.DAB = "Y"
        } else {
          this.DAB = "N"
        }


        // ******************************End of OUTPUT REPORT*******************************

  }


  public DownloadPDF() {
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
