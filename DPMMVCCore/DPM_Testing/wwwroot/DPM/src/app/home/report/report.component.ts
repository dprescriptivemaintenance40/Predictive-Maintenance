import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { UserService } from '../Services/user.services';
import { Title } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';
import { SCConstantsAPI } from '../Compressor/ScrewCompressor/shared/ScrewCompressorAPI.service';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';
import { ProfileConstantAPI } from '../profile/profileAPI.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  providers: [MessageService]
})

export class ReportComponent {
  public closeResult: string;

  public reportVisible: boolean = false;
  public reportHide: boolean = true;
  public AFPVisible: boolean = false;
  public AFPNotVisible: boolean = false;

  public classificationDetails: any = []
  public user: any = [];
  public companyDetail: any = []
  public TagNumber: string = "";
  public EquipmentType: string = "";
  public Date = new Date();
  public DOA = new Date();
  public ACC: string;
  public AFP: string;
  public RK: any = "L/M/H= M | HSECES= Y | CRIT= II";
  public DAB: any;

  public incipient: number = 0;
  public degrade: number = 0;
  public normal: number = 0;

  public AFPincipient: number = 0;
  public AFPdegrade: number = 0;
  public AFPnormal: number = 0;

  public FinalAFPincipient: number = 0;
  public FinalAFPdegrade: number = 0;
  public FinalAFPnormal: number = 0;

  public totalCount: number = 0;
  public AFPtotalCount: number = 0;
  public FinalAFPTotalCount: number = 0;

  public incipientPerentage: number = 0
  public degradePercentage: number = 0
  public normalpercentage: number = 0
  public PerformanceNumber: any = 0

  public AFPincipientPerentage: number = 0
  public AFPdegradePercentage: number = 0
  public AFPnormalpercentage: number = 0

  public finalPerformanceNumber: number = 0
  public finalACCCalculation: number = 0;
  public FinalAFCCalcuation: number = 0;
  public screwWithPredictionDetails: any = []
  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }


  constructor(public http: HttpClient,
    public service: UserService,
    public messageService: MessageService,
    public title: Title,
    public commonLoadingDirective: CommonLoadingDirective,
    private screwCompressorAPIName: SCConstantsAPI,
    private screwCompressorMethod: CommonBLService,
    private profileAPIName: ProfileConstantAPI) {
    this.title.setTitle('Report | Dynamic Prescriptive Maintenence');
    this.GetRecords();

  }

  GetRecords() {
    this.commonLoadingDirective.showLoading(true, 'Report is getting generated.');
    const url: string = this.screwCompressorAPIName.getTrainList
    this.screwCompressorMethod.getWithoutParameters(url)
      // this.http.get<any>("api/ScrewCompressureAPI")
      .subscribe(res => {
        this.classificationDetails = res;
        this.commonLoadingDirective.showLoading(false, '');
      },
        error => {
          console.log(error);
        }
      );
    this.commonLoadingDirective.showLoading(false, '');
    const url11 = this.profileAPIName.ProfileAPI
    this.screwCompressorMethod.getWithoutParameters(url11)
      .subscribe(
        res => {
          this.user = res;
          this.commonLoadingDirective.showLoading(false, '');
        },
        err => {
          this.commonLoadingDirective.showLoading(false, '');
          console.log(err);
        },
      );

    const url2: string = this.screwCompressorAPIName.getPredictedList;
    this.screwCompressorMethod.getWithoutParameters(url2)
      //  this.http.get<any>('api/ScrewCompressureAPI/GetPrediction', this.headers)
      .subscribe(res => {
        this.screwWithPredictionDetails = res;
        if (this.screwWithPredictionDetails.length == 0) {
          this.AFPNotVisible = true;
          this.AFPVisible = false;
          this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Still You have not done Prediction. Do Prediction & Generate Report', sticky: true });
          this.commonLoadingDirective.showLoading(false, '');
        } else {
          this.AFPNotVisible = false;
          this.AFPVisible = true;
          this.commonLoadingDirective.showLoading(false, '');
        }
      }, err => {
        this.commonLoadingDirective.showLoading(false, '');
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

  // public getDismissReason(reason: any): string {
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
    if (this.TagNumber.length == 0 || this.EquipmentType.length == 0) {
      alert("Fill Data in all Fields")
    } else {
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
      console.log("unique name :", uniqueNames)

      var result: any = [];

      if (this.classificationDetails != 0) {

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

        if (ACCCalculation == NaN) {
          ACCCalculation = 0;
        }

        this.finalACCCalculation = parseFloat(ACCCalculation);
      }

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

      if (this.screwWithPredictionDetails.length != 0) {


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


        this.FinalAFPnormal = (this.AFPnormal + this.normal);
        this.FinalAFPincipient = (this.AFPincipient + this.incipient);
        this.FinalAFPdegrade = (this.AFPdegrade + this.degrade);

        this.FinalAFPTotalCount = this.totalCount + this.AFPtotalCount


        this.AFPnormalpercentage = (this.FinalAFPnormal / this.FinalAFPTotalCount * 100)
        console.log('AFP Normal Percentage : ', this.AFPnormalpercentage);

        this.AFPincipientPerentage = (this.FinalAFPincipient / this.FinalAFPTotalCount * 100)
        console.log('AFP Incipient Percentage : ', this.AFPincipientPerentage)

        this.AFPdegradePercentage = (this.FinalAFPdegrade / this.FinalAFPTotalCount * 100)
        console.log('AFP Degrade Percentage : ', this.AFPdegradePercentage)


        var AFCCalcuation: any = [((this.AFPnormalpercentage / 100) * 1) + ((this.AFPincipientPerentage / 100) * 5) + ((this.AFPdegradePercentage / 100) * 10)];

        this.FinalAFCCalcuation = parseFloat(AFCCalcuation);
        console.log(this.FinalAFCCalcuation);
        if (AFCCalcuation == NaN) {
          this.FinalAFCCalcuation = 0;
        }
        this.messageService.add({ severity: 'success', summary: 'success', detail: ' To Download Report, Click Download Report Button ' });

      } else {
        this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Prediction have not done yet, Asset Forecast will not Generate ' });
      }

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

    }
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
