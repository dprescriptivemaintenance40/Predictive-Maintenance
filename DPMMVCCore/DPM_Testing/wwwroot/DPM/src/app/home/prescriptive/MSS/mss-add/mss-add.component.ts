import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MessageService, TreeNode} from 'primeng/api';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';
import { CentrifugalPumpPrescriptiveModel } from './../../FMEA/prescriptive-add/prescriptive-model'

@Component({
  selector: 'app-mss-add',
  templateUrl: './mss-add.component.html',
  styleUrls: ['./mss-add.component.scss', '../../../../../assets/orgchart.scss'],
  providers: [MessageService]
})
export class MSSAddComponent implements OnInit {
  public Pattern: string = ""
  public PrescriptiveTreeList : any = [];
  public TagList : any = [];
  public SelectedTagNumber : string = ""
  public SelectedPrescriptiveTree : any = [];
  public TreeUptoFCA : any = [];
  public SelectBoxEnabled : boolean = false
  public PrescriptiveTree : boolean = false
  public AddBtnEnable : boolean = false
  public SaveBtnEnable : boolean = false
  public MSSADDCounter : number = 0
  public FailureModeName : string = ""
  public ConsequenceBasedMSS : string = ""
  public MSSStratergy : string = ""
  public data1Clone: any;
  public CFPPrescriptiveId: number = 0;
  public data1: any;
  constructor(private messageService: MessageService,
    public title: Title,
    public router: Router,
    public commonLoadingDirective: CommonLoadingDirective,
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.title.setTitle('DPM | MSS');
    var MSSData = JSON.parse(localStorage.getItem('MSSObject'))
    if(MSSData !== null) {
      this.TreeUptoFCA = JSON.parse(MSSData.FMWithConsequenceTree)
      this.SelectedPrescriptiveTree.push(MSSData)
      this.SelectBoxEnabled = false
      this.PrescriptiveTree = true
      this.AddBtnEnable = true
      this.SaveBtnEnable = false
      this.data1Clone = JSON.parse(MSSData.FMWithConsequenceTree);
      this.data1Clone[0].children[0].children[0].children.forEach(element => {
        element.children = [];
      });
    }else{
      this.getPrescriptiveRecords()  
    }
    }
    async ngOnDestroy() {
    await localStorage.removeItem('MSSObject');
    }

  getPrescriptiveRecords(){
    this.SelectBoxEnabled = true;
    this.http.get<any>('api/PrescriptiveAPI/GetPrescriptiveRecordsForMSS').subscribe(
      res => {
        this.PrescriptiveTreeList = res;
        res.forEach(element => {
          this.TagList.push(element.TagNumber) 
        });
      }
    )
  }

  TagNumberSelect(){
    if(this.SelectedTagNumber != ""){
      this.PrescriptiveTreeList.forEach((res: any) => {
        if(res.TagNumber === this.SelectedTagNumber){
           this.SelectedPrescriptiveTree.push(res)
           this.TreeUptoFCA = JSON.parse(res.FMWithConsequenceTree)
           this.PrescriptiveTree = true;
           this.SelectBoxEnabled = false
           this.SaveBtnEnable = false;
           this.AddBtnEnable = true;
        } 
      });
    }
  }

  async ADDMSS(){
   this.FailureModeName = this.SelectedPrescriptiveTree[0].centrifugalPumpPrescriptiveFailureModes[this.MSSADDCounter].FunctionMode
   this.ConsequenceBasedMSS = this.SelectedPrescriptiveTree[0].centrifugalPumpPrescriptiveFailureModes[this.MSSADDCounter].Consequence
   this.PrescriptiveTree = false
   this.MSSADDCounter = this.MSSADDCounter + 1
   if(this.MSSADDCounter == this.SelectedPrescriptiveTree[0].centrifugalPumpPrescriptiveFailureModes.length ){
     this.SaveBtnEnable = true;
     this.AddBtnEnable = false;
   }
   this.data1Clone[0].children[0].children[0].children.forEach(element => {
    element.children = [];
  });
   const element = document.querySelector("#GoToTheSaveMSS")
   if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  ADDMSSToTree(){  
    var MSSTree = {
      label: this.MSSADDCounter,
      type: "person",
      styleClass: 'p-person',
      expanded: true,
      data: { name: "MSS" },
      children: [
        {
          label: "Pattern",
          type: "person",
          styleClass: 'p-person',
          expanded: true,
          data: {
            name: this.MSSStratergy
          }
        }
      ]
    } 
 
    this.TreeUptoFCA[0].children[0].children[0].children[this.MSSADDCounter - 1].children.push(MSSTree)
    this.ConsequenceBasedMSS = ""  
    this.PrescriptiveTree = true 
    this.data1Clone[0].children[0].children[0].children[this.MSSADDCounter - 1].children.push(
      {
        label: "MSS",
        type: "person",
        styleClass: 'p-person',
        expanded: true,
        data: {
          name: this.MSSStratergy
        }
      }
    ) 
  }


 async SaveMSS(){
  var temp: string = JSON.stringify(this.data1Clone)
  var temp2 = JSON.parse(temp)
    var CPObj : CentrifugalPumpPrescriptiveModel = new CentrifugalPumpPrescriptiveModel();
    this.TreeUptoFCA[0].children[0].children.forEach((res: any) => {
      res.MSS = temp2
    })
    CPObj.CFPPrescriptiveId = this.SelectedPrescriptiveTree[0].CFPPrescriptiveId
    CPObj.FMWithConsequenceTree = JSON.stringify(this.TreeUptoFCA)
  
    this.http.put('api/PrescriptiveAPI/UpdatePrespectiveMSS', CPObj).subscribe(
      res =>{
        this.messageService.add({ severity: 'success', summary: 'success', detail: 'Successfully Updated MSS' });
        this.router.navigateByUrl('/Home/Prescriptive/List')
      }, err => { 
        console.log(err.error)
        this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'Something went wrong while updating, please try again later' }); 
      }
    )
    const element = document.querySelector("#GoToTheSaveMSS1")
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
