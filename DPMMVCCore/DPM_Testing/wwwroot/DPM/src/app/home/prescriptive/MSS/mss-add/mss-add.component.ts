import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MessageService, TreeNode } from 'primeng/api';
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
  public PrescriptiveTreeList: any = [];
  public TagList: any = [];
  public SelectedTagNumber: string = ""
  public SelectedPrescriptiveTree: any = [];
  public TreeUptoFCA: any = [];
  public SelectBoxEnabled: boolean = false
  public PrescriptiveTree: boolean = false
  public AddBtnEnable: boolean = false
  public SaveBtnEnable: boolean = false
  public MSSADDCounter: number = 0
  public FailureModeName: string = ""
  public ConsequenceBasedMSS: string = ""
  public MSSStratergy: string = ""
  public data1Clone: any;
  public CFPPrescriptiveId: number = 0;
  public data1: any;
  public FailuerEvident: boolean = false
  public MSSTaskObj : any =[] 
  public AvailabilityY : string = ""
  public AvailabilityYN : string = ""
  public AvailabilityN : string = ""
  public AvailabilityCheck: string = "";
 
  public AvailabilityCalculations: boolean = false
  public AvailabilityYNCheck: boolean = false
  public AvailabilityTaskObj : any =[] 

 public expectedAvailability: boolean = false
 public AvailabilityPlantStoppage: boolean = false
 public AvailabilityPlantStoppageTime: boolean = false


 public stoppageDays: string = "";
 public stoppageDaysValue: number = 0;
 public stoppageDaysTime: string = "";
 public stoppageDaysTimeValue: number = 0;
  
  constructor(private messageService: MessageService,
    public title: Title,
    public router: Router,
    public commonLoadingDirective: CommonLoadingDirective,
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.title.setTitle('DPM | MSS');
    var MSSData = JSON.parse(localStorage.getItem('MSSObject'))
    if (MSSData !== null) {
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
    } else {
      this.getPrescriptiveRecords()
    }
  }
  async ngOnDestroy() {
    await localStorage.removeItem('MSSObject');
  }

  getPrescriptiveRecords() {
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

  TagNumberSelect() {
    if (this.SelectedTagNumber != "") {
      this.PrescriptiveTreeList.forEach((res: any) => {
        if (res.TagNumber === this.SelectedTagNumber) {
          this.SelectedPrescriptiveTree.push(res);
          this.TreeUptoFCA = JSON.parse(res.FMWithConsequenceTree);
          this.data1Clone = JSON.parse(res.FMWithConsequenceTree);
          this.data1Clone[0].children[0].children[0].children.forEach(element => {
            element.children = [];
          });
          this.PrescriptiveTree = true;
          this.SelectBoxEnabled = false
          this.SaveBtnEnable = false;
          this.AddBtnEnable = true;
        }
      });
    }
  }

  async ADDMSS() {
    this.FailureModeName = this.SelectedPrescriptiveTree[0].centrifugalPumpPrescriptiveFailureModes[this.MSSADDCounter].FunctionMode
    this.ConsequenceBasedMSS = this.SelectedPrescriptiveTree[0].centrifugalPumpPrescriptiveFailureModes[this.MSSADDCounter].Consequence
    this.PrescriptiveTree = false
    this.AvailabilityYNCheck = true
    this.AvailabilityCalculations = false
    this.MSSADDCounter = this.MSSADDCounter + 1
    if (this.MSSADDCounter == this.SelectedPrescriptiveTree[0].centrifugalPumpPrescriptiveFailureModes.length) {
      this.SaveBtnEnable = true;
      this.AddBtnEnable = false;
    }
  
    const element = document.querySelector("#GoToTheSaveMSS")
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

async ADDMSSToTree() {
    var MSSTree = {
      label: this.MSSADDCounter,
      type: "person",
      styleClass: 'p-person',
      expanded: true,
      data: { name: "MSS" },
      children: [
        {
          label: "Stratergy",
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
    this.AvailabilityYNCheck= false;
    this.expectedAvailability= false;
    this.AvailabilityPlantStoppage= false;
    this.AvailabilityPlantStoppageTime= false;
    // Logic for Maintenance Tasks and Interval
    // first IF condition for Consequence A and B
   if(this.MSSStratergy == 'A-FFT'    ||  this.MSSStratergy == 'A-OCM' || this.MSSStratergy == 'A-SO'
       || this.MSSStratergy == 'A-SR' ||  this.MSSStratergy == 'A-RED' || this.MSSStratergy == 'A-OFM'
       || this.MSSStratergy == 'B-FFT'||  this.MSSStratergy == 'B-OCM' || this.MSSStratergy == 'B-SO'
       || this.MSSStratergy == 'B-SR' ||  this.MSSStratergy == 'B-RED' || this.MSSStratergy == 'B-OFM' ){

        if(this.MSSStratergy == 'A-OFM' ||     this.MSSStratergy == 'B-FFT'){
          let obj = {}
          obj['MSSMaintenanceInterval'] = 'Not Applicable'
          obj['MSSMaintenanceTask'] = 'Not Applicable'
          this.MSSTaskObj.push(obj)
        } else{

           var ocmHours = this.TreeUptoFCA[0].children[0].children[0].children[this.MSSADDCounter - 1].children[1].FCAData.children[2].data.name
           var ocmWeek : number = ocmHours.split(" ")[0]
               ocmWeek = Math.round((ocmWeek / 24) / 7)

            var strategy = this.MSSStratergy.split('-')[1];
            let obj = {}
            if(strategy == 'FFT'){
              obj['MSSMaintenanceInterval'] = 'NA'
              obj['MSSMaintenanceTask'] = 'NA'
              this.MSSTaskObj.push(obj)

            }else if(strategy == 'OCM'){
              obj['MSSMaintenanceInterval'] = ocmWeek
              obj['MSSMaintenanceTask'] = 'Carry out talks based on on-condition maintenance recommendation'
              this.MSSTaskObj.push(obj)

            }else if(strategy == 'SO'){
              obj['MSSMaintenanceInterval'] = 'NA'
              obj['MSSMaintenanceTask'] = 'Remove, overhaul, and rectify'
              this.MSSTaskObj.push(obj)

            }else if(strategy == 'SR'){
              obj['MSSMaintenanceInterval'] = 'NA'
              obj['MSSMaintenanceTask'] = 'Remove, replace, and recommission'
              this.MSSTaskObj.push(obj)

            }else if(strategy == 'RED'){
              obj['MSSMaintenanceInterval'] = 'NA'
              obj['MSSMaintenanceTask'] = 'Modification, or redesign required since no task is effective'
              this.MSSTaskObj.push(obj)

            }
        }  

   }else if(this.MSSStratergy == 'C-FFT'    ||  this.MSSStratergy == 'C-OCM' || this.MSSStratergy == 'C-SO'
             || this.MSSStratergy == 'C-SR' ||  this.MSSStratergy == 'C-RED' || this.MSSStratergy == 'C-OFM'
             || this.MSSStratergy == 'D-FFT'||  this.MSSStratergy == 'D-OCM' || this.MSSStratergy == 'D-SO'
             || this.MSSStratergy == 'D-SR' ||  this.MSSStratergy == 'D-RED' || this.MSSStratergy == 'D-OFM'
             || this.MSSStratergy == 'E-FFT'||  this.MSSStratergy == 'E-OCM' || this.MSSStratergy == 'E-SO'
             || this.MSSStratergy == 'E-SR' ||  this.MSSStratergy == 'E-RED' || this.MSSStratergy == 'E-OFM'){

              if(this.MSSStratergy == 'C-FFT' ||     this.MSSStratergy == 'D-FFT'){
                let obj = {}
                obj['MSSMaintenanceInterval'] = 'Not Applicable'
                obj['MSSMaintenanceTask'] = 'Not Applicable'
                this.MSSTaskObj.push(obj)
              } else{
             
                  var strategy = this.MSSStratergy.split('-')[1];
                  let obj = {}
                  if(strategy == 'FFT'){
                    obj['MSSMaintenanceInterval'] = 'NA'
                    obj['MSSMaintenanceTask'] = 'Function check'
                    this.MSSTaskObj.push(obj)
                  }else if(strategy == 'OCM'){
                    obj['MSSMaintenanceInterval'] = 'NA'
                    obj['MSSMaintenanceTask'] = 'Carry out talks based on on-condition maintenance recommendation'
                    this.MSSTaskObj.push(obj)

                  }else if(strategy == 'SO'){
                    obj['MSSMaintenanceInterval'] = 'NA'
                    obj['MSSMaintenanceTask'] = 'Remove, overhaul, and rectify'
                    this.MSSTaskObj.push(obj)

                  }else if(strategy == 'SR'){
                    obj['MSSMaintenanceInterval'] = 'NA'
                    obj['MSSMaintenanceTask'] = 'Remove, replace, and recommission'
                    this.MSSTaskObj.push(obj)

                  }else if(strategy == 'RED'){
                    obj['MSSMaintenanceInterval'] = 'NA'
                    obj['MSSMaintenanceTask'] = 'Modification, or redesign required since no task is effective'
                    this.MSSTaskObj.push(obj)

                  }
                  else if(strategy == 'OFM'){
                    obj['MSSMaintenanceInterval'] = 'NA'
                    obj['MSSMaintenanceTask'] = 'No Task'
                    this.MSSTaskObj.push(obj)

                  }
            }
   }

   const element = document.querySelector("#Availability")
   if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' }) 

  }

  async SaveMSS() {
    var temp: string = JSON.stringify(this.data1Clone)
    var temp2 = JSON.parse(temp)
    var CPObj: CentrifugalPumpPrescriptiveModel = new CentrifugalPumpPrescriptiveModel();
    this.TreeUptoFCA[0].children[0].children.forEach((res: any) => {
      res.MSS = temp2
    })
    CPObj.CFPPrescriptiveId = this.SelectedPrescriptiveTree[0].CFPPrescriptiveId
    CPObj.FMWithConsequenceTree = JSON.stringify(this.TreeUptoFCA)

    this.http.put('api/PrescriptiveAPI/UpdatePrespectiveMSS', CPObj).subscribe(
      res => {
        this.messageService.add({ severity: 'success', summary: 'success', detail: 'Successfully Updated MSS' });
        this.router.navigateByUrl('/Home/Prescriptive/List')
      }, err => {
        console.log(err.error)
        this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'Something went wrong while updating, please try again later' });
      }
    )
    this.AvailabilityYNCheck= false;
    this.AvailabilityCalculations= false;
    const element = document.querySelector("#GoToTheSaveMSS1")
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  
 async Availability(){
    if( this.AvailabilityY.length >0 && this.AvailabilityY.length >0){
      this.changeDetectorRef.detectChanges()
    }else{
      alert("fill the data")
      this.messageService.add({ severity: 'warn', summary: 'warn', detail: "fill the data" })
    }
    if(this.AvailabilityY == 'Yes'){
      this.expectedAvailability = true
      this.AvailabilityPlantStoppage = false
      this.AvailabilityPlantStoppageTime = false
     }else if(this.AvailabilityY == 'No') { 
      this.expectedAvailability = false
      this.AvailabilityPlantStoppage = true
      this.AvailabilityPlantStoppageTime = true
     }
     const element = document.querySelector("#PlantStoppage")
     if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
   }

 async  AvailabilityYes(){
     if(this.AvailabilityCheck.length >0){

     }else{
       alert("Fill the data")
     }
   }

 async StoppageDays(){
    if(this.stoppageDays == 'Days'){
       this.stoppageDaysValue * 1 * 24
    } else if(this.stoppageDays == 'Week'){ 
     this.stoppageDaysValue * 7 * 24
    } else if(this.stoppageDays == 'Month'){ 
     this.stoppageDaysValue * 30 * 24
    } else if(this.stoppageDays == 'Year'){ 
      this.stoppageDaysValue * 365 * 24
    }

    // const element = document.querySelector("#PlantStoppage")
    // if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
   }

  async StoppageDuration(){
    if(this.stoppageDaysTime == 'Days'){
      this.stoppageDaysTimeValue * 1 * 24
   } else if(this.stoppageDaysTime == 'Week'){ 
    this.stoppageDaysTimeValue * 7 * 24
   } else if(this.stoppageDaysTime == 'Month'){ 
    this.stoppageDaysTimeValue * 30 * 24
   } else if(this.stoppageDaysTime == 'Year'){ 
     this.stoppageDaysTimeValue * 365 * 24
   }
     
  }
}
