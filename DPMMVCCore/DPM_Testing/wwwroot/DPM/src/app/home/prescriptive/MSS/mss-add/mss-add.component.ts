import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MessageService} from 'primeng/api';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';
import { CentrifugalPumpPrescriptiveModel } from './../../FMEA/prescriptive-add/prescriptive-model'
import * as XLSX from 'xlsx';
import { PrescriptiveContantAPI } from '../../Shared/prescriptive.constant';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';

@Component({
  selector: 'app-mss-add',
  templateUrl: './mss-add.component.html',
  styleUrls: ['./mss-add.component.scss', '../../../../../assets/orgchart.scss'],
  providers: [MessageService],
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
  public AvailabilityCheck: number = 0;
  public AddMSSSave: boolean = false
  public AvailabilityCalculations: boolean = false
  public AvailabilityYNCheck: boolean = false
  public AvailabilityTaskObj : any =[] 

 public expectedAvailability: boolean = false
 public AvailabilityPlantStoppage: boolean = false
 public AvailabilityPlantStoppageTime: boolean = false

 public AvailabilityResult : number = 0
 public stoppageDays: string = "";
 public stoppageDaysValue: number = 0;
 public stoppageDaysTime: string = "";
 public stoppageDaysTimeValue: number = 0;

 public stoppageValue : number
 public stoppageDuration : number
 public MSSIntervalSelectionCriteria : string = ""
 public PlantStoppage: boolean  = true
 public PlantStoppageTime: boolean  = true
 public MSSLibraryData : any = []
 public MSSLibraryJsonData : any = [] 
  constructor(private messageService: MessageService,
    public title: Title,
    public router: Router,
    public commonLoadingDirective: CommonLoadingDirective,
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef,
    private prescriptiveBLService : CommonBLService,
    private prescriptiveContantAPI : PrescriptiveContantAPI) { }

  ngOnInit() {
    this.title.setTitle('MSS | Dynamic Prescriptive Maintenence');
    this.getMSSLibraryData();
    this.getMSSLibraryDataInJSon();
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

  getMSSLibraryDataInJSon(){
    this.http.get<any>('dist/DPM/assets/MSS_Library/mss_library.json').subscribe(
      res => {
       this.MSSLibraryJsonData = res;
      }, error =>{ console.log(error.error)}
    )
  }

  getMSSLibraryData(){
    this.prescriptiveBLService.GetMSSLibrary().subscribe((res: any) => {
      let fileReader = new FileReader();
      fileReader.readAsArrayBuffer(res);
      fileReader.onload = (e) => {
        var arrayBuffer : any = fileReader.result;
        var data = new Uint8Array(arrayBuffer);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, { type: "binary", cellDates: true });
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        this.MSSLibraryData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
        console.log(this.MSSLibraryData);
      }
  
    })
  }

  getPrescriptiveRecords() {
    this.SelectBoxEnabled = true;
    var url : string =  this.prescriptiveContantAPI.PrescriptiveRecordsForMSS
    this.prescriptiveBLService.getWithoutParameters(url).subscribe(
      (res: any) => {
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
  if(this.MSSStratergy.length >0){
  if(this.AvailabilityY.length > 0  && this.AvailabilityY.length >0){
    var MSSTree = {
      label: this.MSSADDCounter,
      type: "person",
      styleClass: 'p-person',
      expanded: true,
      editMSS: true,
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
  }else{
    this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Fill the data" }) 
  }
      var availablility: number = 0;
      if(this.AvailabilityResult == 0){
          availablility = this.AvailabilityCheck
      }
      if(this.AvailabilityResult != 0){
        availablility = this.AvailabilityResult
      }
      var FMName = this.TreeUptoFCA[0].children[0].children[0].children[this.MSSADDCounter - 1].data.name ;
      var dataFromLibrary = this.MSSLibraryJsonData.find(a => a['name'] === FMName);
      var MTBF = dataFromLibrary.mtbf;
      var LN =  Math.log((2*(availablility/100))-1) 
      var INTERVAl : number =  -(MTBF*LN) 
      var intervalWeek = (INTERVAl*365)/7;

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
            obj['MSSAvailability'] = availablility
            obj['MSSStartergy'] = this.MSSStratergy
            obj['MSSIntervalSelectionCriteria'] = this.MSSIntervalSelectionCriteria
            this.MSSTaskObj.push(obj)
          } else{

            var ocmHours = this.TreeUptoFCA[0].children[0].children[0].children[this.MSSADDCounter - 1].children[1].FCAData.children[2].data.name
            var ocmWeek : number = ocmHours.split(" ")[0]
                ocmWeek = Math.round((ocmWeek / 24) / 7)
              var strategy = this.MSSStratergy.split('-')[1];
              let obj = {}
            if(this.MSSStratergy == 'A-FFT'){
              obj['MSSMaintenanceInterval'] = `${intervalWeek.toFixed(2)} weeks`;
              obj['MSSMaintenanceTask'] = 'Function Check'
              obj['MSSStartergy'] = this.MSSStratergy
              obj['MSSAvailability'] = availablility
              obj['MSSIntervalSelectionCriteria'] = this.MSSIntervalSelectionCriteria
              this.MSSTaskObj.push(obj)
            }else{
              if(strategy == 'FFT'){
                obj['MSSMaintenanceInterval'] = 'Not Applicable';
                obj['MSSMaintenanceTask'] = 'Not Applicable'
                obj['MSSStartergy'] = this.MSSStratergy
                obj['MSSAvailability'] = availablility
                obj['MSSIntervalSelectionCriteria'] = this.MSSIntervalSelectionCriteria
                this.MSSTaskObj.push(obj)

              }else if(strategy == 'OCM'){
                obj['MSSMaintenanceInterval'] = `${ocmWeek}${" "}${"Week"}` 
                obj['MSSMaintenanceTask'] = 'Carry out talks based on on-condition maintenance recommendation'
                obj['MSSStartergy'] = this.MSSStratergy
                obj['MSSAvailability'] = availablility
                obj['MSSIntervalSelectionCriteria'] = this.MSSIntervalSelectionCriteria
                this.MSSTaskObj.push(obj)

              }else if(strategy == 'SO'){
                obj['MSSMaintenanceInterval'] = `${this.SelectedPrescriptiveTree[0].centrifugalPumpPrescriptiveFailureModes[this.MSSADDCounter - 1].FCASafeLife}${" "}${"Week"}` 
                obj['MSSMaintenanceTask'] = 'Remove, overhaul, and rectify'
                obj['MSSStartergy'] = this.MSSStratergy
                obj['MSSAvailability'] = availablility
                obj['MSSIntervalSelectionCriteria'] = this.MSSIntervalSelectionCriteria
                this.MSSTaskObj.push(obj)

              }else if(strategy == 'SR'){
                obj['MSSMaintenanceInterval'] = `${ this.SelectedPrescriptiveTree[0].centrifugalPumpPrescriptiveFailureModes[this.MSSADDCounter - 1].FCASafeLife}${" "}${"Week"}` 
                obj['MSSMaintenanceTask'] = 'Remove, replace, and recommission'
                obj['MSSStartergy'] = this.MSSStratergy
                obj['MSSAvailability'] = availablility
                obj['MSSIntervalSelectionCriteria'] = this.MSSIntervalSelectionCriteria
                this.MSSTaskObj.push(obj)

              }else if(strategy == 'RED'){
                obj['MSSMaintenanceInterval'] = 'NA'
                obj['MSSMaintenanceTask'] = 'Modification, or redesign required since no task is effective'
                obj['MSSStartergy'] = this.MSSStratergy
                obj['MSSAvailability'] = availablility
                obj['MSSIntervalSelectionCriteria'] = this.MSSIntervalSelectionCriteria
                this.MSSTaskObj.push(obj)

              }
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
                  obj['MSSAvailability'] = availablility
                  obj['MSSStartergy'] = this.MSSStratergy
                  obj['MSSIntervalSelectionCriteria'] = this.MSSIntervalSelectionCriteria
                  this.MSSTaskObj.push(obj)
                } else{

                    var ocmHours = this.TreeUptoFCA[0].children[0].children[0].children[this.MSSADDCounter - 1].children[1].FCAData.children[2].data.name
                    var ocmWeek : number = ocmHours.split(" ")[0]
                    ocmWeek = Math.round((ocmWeek / 24) / 7)
              
                    var strategy = this.MSSStratergy.split('-')[1];
                    let obj = {}
                    if(strategy == 'FFT'){
                      obj['MSSMaintenanceInterval'] = 'NA'
                      obj['MSSMaintenanceTask'] = 'Function check'
                      obj['MSSStartergy'] = this.MSSStratergy
                      obj['MSSAvailability'] = availablility
                      obj['MSSIntervalSelectionCriteria'] = this.MSSIntervalSelectionCriteria
                      this.MSSTaskObj.push(obj)
                    }else if(strategy == 'OCM'){
                      obj['MSSMaintenanceInterval'] = `${ocmWeek}${" "}${"Week"}` 
                      obj['MSSMaintenanceTask'] = 'Carry out talks based on on-condition maintenance recommendation'
                      obj['MSSStartergy'] = this.MSSStratergy
                      obj['MSSAvailability'] = availablility
                      obj['MSSIntervalSelectionCriteria'] = this.MSSIntervalSelectionCriteria
                      this.MSSTaskObj.push(obj)

                    }else if(strategy == 'SO'){
                      obj['MSSMaintenanceInterval'] = `${this.SelectedPrescriptiveTree[0].centrifugalPumpPrescriptiveFailureModes[this.MSSADDCounter - 1].FCAUsefulLife}${" "}${"Week"}` 
                      obj['MSSMaintenanceTask'] = 'Remove, overhaul, and rectify'
                      obj['MSSStartergy'] = this.MSSStratergy
                      obj['MSSAvailability'] = availablility
                      obj['MSSIntervalSelectionCriteria'] = this.MSSIntervalSelectionCriteria
                      this.MSSTaskObj.push(obj)

                    }else if(strategy == 'SR'){
                      obj['MSSMaintenanceInterval'] = `${this.SelectedPrescriptiveTree[0].centrifugalPumpPrescriptiveFailureModes[this.MSSADDCounter - 1].FCAUsefulLife}${" "}${"Week"}`  
                      obj['MSSMaintenanceTask'] = 'Remove, replace, and recommission'
                      obj['MSSStartergy'] = this.MSSStratergy
                      obj['MSSAvailability'] = availablility
                      obj['MSSIntervalSelectionCriteria'] = this.MSSIntervalSelectionCriteria
                      this.MSSTaskObj.push(obj)

                    }else if(strategy == 'RED'){
                      obj['MSSMaintenanceInterval'] = 'NA'
                      obj['MSSMaintenanceTask'] = 'Modification, or redesign required since no task is effective'
                      obj['MSSStartergy'] = this.MSSStratergy
                      obj['MSSAvailability'] = availablility
                      obj['MSSIntervalSelectionCriteria'] = this.MSSIntervalSelectionCriteria
                      this.MSSTaskObj.push(obj)

                    }
                    else if(strategy == 'OFM'){
                      obj['MSSMaintenanceInterval'] = 'NA'
                      obj['MSSMaintenanceTask'] = 'No Task'
                      obj['MSSStartergy'] = this.MSSStratergy
                      obj['MSSAvailability'] = availablility
                      obj['MSSIntervalSelectionCriteria'] = this.MSSIntervalSelectionCriteria
                      this.MSSTaskObj.push(obj)

                    }
              }
      }

      const element = document.querySelector("#Availability")
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' }) 
      this.AvailabilityYNCheck= false;
      this.expectedAvailability= false;
      this.AvailabilityPlantStoppage= false;
      this.AvailabilityPlantStoppageTime= false;
      this.AvailabilityY = ""
      this.AvailabilityCheck = 0
      this.AvailabilityResult = 0
      this.stoppageDays = ""
      this.MSSStratergy = ""
      this.stoppageDaysValue = 0
      this.stoppageDaysTime = ""
      this.stoppageDaysTimeValue = 0
      this.PlantStoppage = true
      this.PlantStoppageTime = true
      this.AddMSSSave = false
      this.MSSIntervalSelectionCriteria = ""
    }else{
      this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'fill the data' });
    }
  
    

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
    CPObj.centrifugalPumpPrescriptiveFailureModes = this.MSSTaskObj
    var url : string =  this.prescriptiveContantAPI.MSSSave
    this.prescriptiveBLService.PutData(url, CPObj).subscribe(
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
    if( this.MSSIntervalSelectionCriteria != "" && (this.AvailabilityY == 'Yes' || this.AvailabilityY == 'No')){
      this.changeDetectorRef.detectChanges()

      if(this.AvailabilityY == 'Yes'){
        this.expectedAvailability = true
        this.AvailabilityPlantStoppage = false
        this.AvailabilityPlantStoppageTime = false
       }else if(this.AvailabilityY == 'No') { 
        this.expectedAvailability = false
        this.AvailabilityPlantStoppage = true
        this.AvailabilityPlantStoppageTime = true
       }
       this.changeDetectorRef.detectChanges()
       const element = document.querySelector("#PlantStoppage")
       if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }else{
      this.messageService.add({ severity: 'warn', summary: 'warn', detail: "fill the data" })
    }
    
   }

 async AvailabilityYes(){
     if(this.AvailabilityCheck != 0){
      this.AddMSSSave = true
      const element = document.querySelector("#Consequence")
     if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
     }else{
       this.messageService.add({ severity: 'warn', summary: 'warn', detail: "fill the data" })
     }
     
   }

 async StoppageDays(){
    if(this.stoppageDays == 'Days'){
      this.stoppageValue = this.stoppageDaysValue * 1 
    } else if(this.stoppageDays == 'Week'){ 
      this.stoppageValue =  this.stoppageDaysValue * 7 
    } else if(this.stoppageDays == 'Month'){ 
      this.stoppageValue =  this.stoppageDaysValue * 30 
    } else if(this.stoppageDays == 'Year'){ 
      this.stoppageValue =  this.stoppageDaysValue * 365 
    }
    this.PlantStoppageTime = !this.PlantStoppageTime;
    const element = document.querySelector("#PlantStoppagetime")
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
   }

  async StoppageDuration(){
    if (this.stoppageDaysTime == 'Days') {
      this.stoppageDuration = this.stoppageDaysTimeValue * 1
    } else if (this.stoppageDaysTime == 'Week') {
      this.stoppageDuration = this.stoppageDaysTimeValue * 7
    } else if (this.stoppageDaysTime == 'Month') {
      this.stoppageDuration = this.stoppageDaysTimeValue * 30
    } else if (this.stoppageDaysTime == 'Year') {
      this.stoppageDuration = this.stoppageDaysTimeValue * 365
    }
   this.AddMSSSave = true
   this.AvailabilityResult = (1-(this.stoppageDuration / this.stoppageValue  ))*100
   const element = document.querySelector("#Consequence")
   if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

}
