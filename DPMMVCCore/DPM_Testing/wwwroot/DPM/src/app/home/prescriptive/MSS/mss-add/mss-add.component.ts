import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MessageService} from 'primeng/api';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';
import { CentrifugalPumpPrescriptiveModel } from './../../FMEA/prescriptive-add/prescriptive-model'

@Component({
  selector: 'app-mss-add',
  templateUrl: './mss-add.component.html',
  styleUrls: ['./mss-add.component.scss'],
  providers: [MessageService]
})
export class MSSAddComponent implements OnInit {
  public MSS : any = []
  public ConsequenceA : boolean = false;
  public ConsequenceB : boolean = false;
  public ConsequenceC : boolean = false;
  public ConsequenceD : boolean = false;
  public ConsequenceE : boolean = false;

  public AOCM : string = ""
  public ASO : string = ""
  public ASR : string = ""
  public AFFT : string = ""
  public AFromAbove : string = ""
  public ARED : string = ""

  public BOCM : string = ""
  public BSO : string = ""
  public BSR : string = ""
  public BFromAbove : string = ""
  public BRED : string = ""

  public COCM : string = ""
  public CSO : string = ""
  public CSR : string = ""
  public COFM : string = ""
  public CRED : string = ""

  public DOCM : string = ""
  public DSO : string = ""
  public DSR : string = ""
  public DOFM : string = ""
  public DRED : string = ""

  public EOCM : string = ""
  public ESO : string = ""
  public ESR : string = ""
  public EFFT : string = ""
  public EOFM : string = ""
  public ERED : string = ""
  public MSSData: any = [];
  public data1: any = [];
  public MSSTree: any = [];
  public CFPPrescriptiveId: number = 0;
  public data1Clone: any;

  constructor(private messageService: MessageService,
    public title: Title,
    public router: Router,
    public commonLoadingDirective: CommonLoadingDirective,
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.title.setTitle('DPM | MSS');
    var MSSData = JSON.parse(localStorage.getItem('MSSObject'))
     this.data1 = JSON.parse(MSSData.FMWithConsequenceTree)
      this.MSSTree = this.data1[0].children[0].children[0].Consequence[0].children[0].children[0].children[0].children[2].data.name
      this.ShowConsequence()
    }

  async ngOnDestroy() {
    await localStorage.removeItem('MSSObject');
  }

  ShowConsequence(){
    if( this.MSSTree == 'A'){
      this.ConsequenceA = true;
      this.ConsequenceB = false;
      this.ConsequenceC = false;
      this.ConsequenceD = false;
      this.ConsequenceE = false;

   } else if( this.MSSTree == 'B'){
    this.ConsequenceA = false;
    this.ConsequenceB = true;
    this.ConsequenceC = false;
    this.ConsequenceD = false;
    this.ConsequenceE = false;

   }else if( this.MSSTree == 'C'){
    this.ConsequenceA = false;
    this.ConsequenceB = false;
    this.ConsequenceC = true;
    this.ConsequenceD = false;
    this.ConsequenceE = false;

  }else if( this.MSSTree == 'D'){
    this.ConsequenceA = false;
    this.ConsequenceB = false;
    this.ConsequenceC = false;
    this.ConsequenceD = true;
    this.ConsequenceE = false;

  }else if( this.MSSTree == 'E'){
    this.ConsequenceA = false;
    this.ConsequenceB = false;
    this.ConsequenceC = false;
    this.ConsequenceD = false;
    this.ConsequenceE = true;
  }
  
  }
  ConsequenceFirst(){
    if(this.AOCM != ""){
      this.AOCM = "AOCM"
      this.MSS.push(this.AOCM)
   
    }
    if(this.ASO != ""){
      this.ASO = "ASO"
      this.MSS.push(this.ASO)
      
    }
    if(this.ASR != ""){
      this.ASR = "ASR"
      this.MSS.push(this.ASR)
      
    }
    if(this.AFFT != ""){
      this.AFFT = "AFFT"
      this.MSS.push(this.AFFT)
      
    }
    if(this.AFromAbove != ""){
      this.AFromAbove = "AFromAbove"
      this.MSS.push(this.AFromAbove)
      
    }
    if(this.ARED != ""){
      this.ARED = "ARED"
      this.MSS.push(this.ARED)
      
    }
   if(this.AOCM.length >0 || this.ASO.length >0 || this.ASR.length >0 || this.AFFT.length >0 || this.AFromAbove.length >0 || this.ARED.length >0 ){
    this.changeDetectorRef.detectChanges()
   }else{
    alert("fill the data")
   }
  }
  ConsequenceSecond(){
    if(this.BOCM != ""){
      this.BOCM = "BOCM"
      this.MSS.push(this.BOCM)
   
    }
    if(this.BSO != ""){
      this.BSO = "BSO"
      this.MSS.push(this.BSO)
      
    }
    if(this.BSR != ""){
      this.BSR = "BSR"
      this.MSS.push(this.BSR)
      
    }
    if(this.BFromAbove != ""){
      this.BFromAbove = "BFromAbove"
      this.MSS.push(this.BFromAbove)
      
    }
    if(this.BRED != ""){
      this.BRED = "BRED"
      this.MSS.push(this.BRED)
      
    }
 
    if(this.BOCM.length >0 || this.BSO.length >0 || this.BSR.length >0 || this.BFromAbove.length >0 || this.BRED.length >0 ){
      this.changeDetectorRef.detectChanges()
    }else{
      alert("fill the data")
    }
  }
  ConsequenceThird(){
    if(this.COCM != ""){
      this.COCM = "COCM"
      this.MSS.push(this.COCM)
   
    }
    if(this.CSO != ""){
      this.CSO = "CSO"
      this.MSS.push(this.CSO)
      
    }
    if(this.CSR != ""){
      this.CSR = "CSR"
      this.MSS.push(this.CSR)
      
    }
    if(this.COFM != ""){
      this.COFM = "COFM"
      this.MSS.push(this.COFM)
      
    }
    if(this.CRED != ""){
      this.CRED = "CRED"
      this.MSS.push(this.CRED)
      
    }
    if(this.COCM.length >0 || this.CSO.length >0 || this.CSR.length >0 || this.COFM.length >0 ||  this.CRED.length >0 ){
      this.changeDetectorRef.detectChanges()
    }else{
      alert("fill the data")
    }

  }
  ConsequenceFourth(){
    if(this.DOCM != ""){
      this.DOCM = "COCM"
      this.MSS.push(this.DOCM)
   
    }
    if(this.DSO != ""){
      this.DSO = "DSO"
      this.MSS.push(this.DSO)
      
    }
    if(this.DSR != ""){
      this.DSR = "DSR"
      this.MSS.push(this.DSR)
      
    }
    if(this.DOFM != ""){
      this.DOFM = "DOFM"
      this.MSS.push(this.DOFM)
      
    }
    if(this.DRED != ""){
      this.DRED = "DRED"
      this.MSS.push(this.DRED)
      
    }
    if(this.DOCM.length >0 || this.DSO.length >0 || this.DSR.length >0 || this.DOFM.length >0 || this.DRED.length >0 ){
      this.changeDetectorRef.detectChanges()
    }else{
      alert("fill the data")
    }

  }
  ConsequenceFive(){
    if(this.EOCM != ""){
      this.EOCM = "EOCM"
      this.MSS.push(this.EOCM)
   
    }
    if(this.ESO != ""){
      this.ESO = "ESO"
      this.MSS.push(this.ESO)
   
    }
    if(this.ESR != ""){
      this.ESR = "ESR"
      this.MSS.push(this.ESR)
      
    }
    if(this.EFFT != ""){
      this.EFFT = "EFFT"
      this.MSS.push(this.EFFT)
      
    }
    if(this.EOFM != ""){
      this.EOFM = "EOFM"
      this.MSS.push(this.EOFM)
      
    }
    if(this.ERED != ""){
      this.ERED = "ERED"
      this.MSS.push(this.ERED)
      
    }
    if(this.EOCM.length >0 || this.ESO.length >0 || this.ESR.length >0 || this.EFFT.length >0 || this.EOFM.length >0 || this.ERED.length >0 ){
      this.changeDetectorRef.detectChanges()
    }else{
      alert("fill the data")
    }

  }
  SaveMSS(){
    var temp: string = JSON.stringify(this.MSSTree)
    var temp2 = JSON.parse(temp)
    var centrifugalPumpOBJ: CentrifugalPumpPrescriptiveModel = new CentrifugalPumpPrescriptiveModel();
    let obj = {};
    obj['CPPFMId'] = 0;
    obj['CFPPrescriptiveId'] = 0;
    // obj['MSS'] = 
    centrifugalPumpOBJ.centrifugalPumpPrescriptiveFailureModes.push(obj)
    this.http.put('api/PrescriptiveAPI/PrespectiveMSS', centrifugalPumpOBJ).subscribe(
      res => {
        this.messageService.add({ severity: 'Success', summary: 'Success', detail: "Succssfully MSS Added" })
        this.router.navigateByUrl('/Home/Prescriptive/List');
      }, err => console.log(err.error)
    )
  }

}
