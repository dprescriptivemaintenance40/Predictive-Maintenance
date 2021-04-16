import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MessageService} from 'primeng/api';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';
@Component({
  selector: 'app-mss-add',
  templateUrl: './mss-add.component.html',
  styleUrls: ['./mss-add.component.scss'],
  providers: [MessageService],
})
export class MSSAddComponent implements OnInit {

  public ConsequenceA : boolean = true;
  public ConsequenceB : boolean = true;
  public ConsequenceC : boolean = true;
  public ConsequenceD : boolean = true;
  public ConsequenceE : boolean = true;

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
     this.MSSTree = this.data1[0].children[0].children[0].children
    // this.data1Clone = this.data1[0].children[0].children[0].Consequence;
  }

  async ngOnDestroy() {
    await localStorage.removeItem('MSSObject');
  }

  ConsequenceFirst(){

    // this.ConsequenceA = true;
    // this.ConsequenceB = false;
    // this.ConsequenceC = false;
    // this.ConsequenceD = false;
    // this.ConsequenceE = false;

   if(this.AOCM.length >0 || this.ASO.length >0 || this.ASR.length >0 || this.AFFT.length >0 || this.AFromAbove.length >0 || this.ARED.length >0 ){
    this.changeDetectorRef.detectChanges()
   }else{
    this.messageService.add({ severity: 'warn', summary: 'warn', detail: "fill the data" })
   }
  }
  ConsequenceSecond(){
    if(this.BOCM.length >0 || this.BSO.length >0 || this.BSR.length >0 || this.BFromAbove.length >0 || this.BRED.length >0 ){
      this.changeDetectorRef.detectChanges()
    }else{
     this.messageService.add({ severity: 'warn', summary: 'warn', detail: "fill the data" })
    }

  }
  ConsequenceThird(){
    if(this.COCM.length >0 || this.CSO.length >0 || this.CSR.length >0 || this.COFM.length >0 ||  this.CRED.length >0 ){
      this.changeDetectorRef.detectChanges()
    }else{
     this.messageService.add({ severity: 'warn', summary: 'warn', detail: "fill the data" })
    }

  }
  ConsequenceFourth(){
    if(this.DOCM.length >0 || this.DSO.length >0 || this.DSR.length >0 || this.DOFM.length >0 || this.DRED.length >0 ){
      this.changeDetectorRef.detectChanges()
    }else{
     this.messageService.add({ severity: 'warn', summary: 'warn', detail: "fill the data" })
    }

  }
  ConsequenceFive(){
    if(this.EOCM.length >0 || this.ESO.length >0 || this.ESR.length >0 || this.EFFT.length >0 || this.EOFM.length >0 || this.ERED.length >0 ){
      this.changeDetectorRef.detectChanges()
    }else{
     this.messageService.add({ severity: 'warn', summary: 'warn', detail: "fill the data" })
    }

  }

}
