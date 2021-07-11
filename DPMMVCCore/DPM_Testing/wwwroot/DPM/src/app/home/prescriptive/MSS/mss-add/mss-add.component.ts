import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';
import { CentrifugalPumpPrescriptiveModels } from './../../Shared/prescriptive-model';
import { CentrifugalPumpPrescriptiveFailureMode } from './../../Shared/prescriptive-model';
import * as XLSX from 'xlsx';
import { PrescriptiveContantAPI } from '../../Shared/prescriptive.constant';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';

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
  public MSSTaskObj: any = []
  public MSSTaskObjList: any = []
  public AvailabilityY: string = ""
  public AvailabilityYN: string = ""
  public AvailabilityN: string = ""
  public AvailabilityCheck: number = 0;
  public AddMSSSave: boolean = false
  public AvailabilityCalculations: boolean = false
  public AvailabilityYNCheck: boolean = false
  public AvailabilityTaskObj: any = []

  public expectedAvailability: boolean = false
  public AvailabilityPlantStoppage: boolean = false
  public AvailabilityPlantStoppageTime: boolean = false

  public AvailabilityResult: number = 0
  public stoppageDays: string = "";
  public stoppageDaysValue: number = 0;
  public stoppageDaysTime: string = "";
  public stoppageDaysTimeValue: number = 0;

  public stoppageValue: number
  public stoppageDuration: number
  public MSSIntervalSelectionCriteria: string = ""
  public PlantStoppage: boolean = true
  public PlantStoppageTime: boolean = true
  public MSSLibraryData: any = []
  public MSSLibraryJsonData: any = []
  public FinalAvailability: any = []
  public FinalBack: boolean = false;

  public OCM: boolean = false;
  public SO: boolean = false;
  public SR: boolean = false;
  public FFT: boolean = false;
  public RED: boolean = false;
  public OFM: boolean = false;
  public StrategyList: any = [];
  public StrategyTemp: any = [];
  public CentrifugalPumpPrescriptiveModels = new CentrifugalPumpPrescriptiveModels();
  public FMObj: CentrifugalPumpPrescriptiveFailureMode = new CentrifugalPumpPrescriptiveFailureMode();
  constructor(private messageService: MessageService,
    public title: Title,
    public router: Router,
    public commonLoadingDirective: CommonLoadingDirective,
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef,
    private prescriptiveBLService: CommonBLService,
    private prescriptiveContantAPI: PrescriptiveContantAPI) { }

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
      this.FinalBack = true
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

  getMSSLibraryDataInJSon() {
    this.http.get<any>('dist/DPM/assets/Library/mss_library.json').subscribe(
      res => {
        this.MSSLibraryJsonData = res;
      }, error => { console.log(error.error) }
    )
  }

  getMSSLibraryData() {
    this.prescriptiveBLService.GetMSSLibrary()
      .subscribe((res: any) => {
        let fileReader = new FileReader();
        fileReader.readAsArrayBuffer(res);
        fileReader.onload = (e) => {
          var arrayBuffer: any = fileReader.result;
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

      });
  }

  getPrescriptiveRecords() {
    this.SelectBoxEnabled = true;
    var url: string = this.prescriptiveContantAPI.PrescriptiveRecordsForMSS;
    this.prescriptiveBLService.getWithoutParameters(url)
      .subscribe((res: any) => {
        this.PrescriptiveTreeList = res;
        res.forEach(element => {
          this.TagList.push(element.TagNumber)
        });
      });
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
          this.FinalBack = true
        }
      });
    }
  }

  BaxkToAssetList() {
    this.router.navigateByUrl('/Home/Prescriptive/List');
  }

  async ADDMSS() {
    this.OCM = false;
    this.SO = false;
    this.SR = false;
    this.FFT = false;
    this.RED = false;
    this.OFM = false;
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

  SelectMssStrategy() {
    let obj = {}
    if (this.ConsequenceBasedMSS == 'A (Failure Mode:Hidden, Failure Mode with Condition : Combined with one or other failure mode events, Failure Mode Consequences : Safety and/or environmental hazard)') {
      this.StrategyTemp = []
      if (this.OCM == true) {
        obj['OCM'] = "A-OCM (On Condition Maintainenance Task)"
        this.StrategyTemp.push("A-OCM (On Condition Maintainenance Task)")
      }
      if (this.SO == true) {
        obj['SO'] = "A-SO (Scheduled Overhaul Task)"
        this.StrategyTemp.push("A-SO (Scheduled Overhaul Task)")
      }
      if (this.SR == true) {
        obj['SR'] = "A-SR (Scheduled Replacement Task)"
        this.StrategyTemp.push("A-SR (Scheduled Replacement Task)")
      }
      if (this.FFT == true) {
        obj['FFT'] = "A-FFT (Failure Finding Task)"
        this.StrategyTemp.push("A-FFT (Failure Finding Task)")
      }
      if (this.RED == true) {
        obj['RED'] = "A-RED (Redsigned Mandatory)"
        this.StrategyTemp.push("A-RED (Redsigned Mandatory)")
      }
      if (this.OFM == true) {
        obj['OFM'] = "A-OFM (On Failure Maintainenance)"
        this.StrategyTemp.push("A-OFM (On Failure Maintainenance)")
      }
      this.StrategyList.push(obj)
    } else if (this.ConsequenceBasedMSS == "B (Failure Mode:Evident, Failure Mode with Condition : Direct only, Failure Mode Consequences : Safety and/or environmental hazard)") {
      this.StrategyTemp = []
      if (this.OCM == true) {
        obj['OCM'] = "B-OCM (On condition Maintainenance Task)"
        this.StrategyTemp.push("B-OCM (On Condition Maintainenance Task)")
      }
      if (this.SO == true) {
        obj['SO'] = "B-SO (Scheduled Overhaul Task)"
        this.StrategyTemp.push("B-SO (Scheduled Overhaul Task)")
      }
      if (this.SR == true) {
        obj['SR'] = "B-SR (Scheduled Replacement Task)"
        this.StrategyTemp.push("B-SR (Scheduled Replacement Task)")
      }
      if (this.RED == true) {
        obj['RED'] = "B-RED (Redsigned Mandatory)"
        this.StrategyTemp.push("B-RED (Redsigned Mandatory)")
      }
      this.StrategyList.push(obj)
    }
    else if (this.ConsequenceBasedMSS == "C (Failure Mode:Evident, Failure Mode with Condition : Direct only, Failure Mode Consequences : Operational capability adversly affected but no effect on safety or environment)C (Failure Mode:Evident, Failure Mode with Condition : Direct only, Failure Mode Consequences : Operational capability adversly affected but no effect on safety or environment)") {
      this.StrategyTemp = []
      if (this.OCM == true) {
        obj['OCM'] = "C-OCM (On condition Maintainenance Task)"
        this.StrategyTemp.push("C-OCM (On Condition Maintainenance Task)")
      }
      if (this.SO == true) {
        obj['SO'] = "C-SO (Scheduled Overhaul Task)"
        this.StrategyTemp.push("C-SO (Scheduled Overhaul Task)")
      }
      if (this.SR == true) {
        obj['SR'] = "C-SR (Scheduled Replacement Task)"
        this.StrategyTemp.push("C-SR (Scheduled Replacement Task)")
      }
      if (this.RED == true) {
        obj['RED'] = "C-RED (Redsigned Mandatory)"
        this.StrategyTemp.push("C-RED (Redsigned Mandatory)")
      }
      if (this.OFM == true) {
        obj['OFM'] = "C-OFM (On Failure Maintainenance)"
        this.StrategyTemp.push("C-OFM (On Failure Maintainenance)")
      }
      this.StrategyList.push(obj)
    } else if (this.ConsequenceBasedMSS == "D (Failure Mode:Evident, Failure Mode with Condition : Direct only, Failure Mode Consequences : No effect on safety or environment operation)") {
      this.StrategyTemp = []
      if (this.OCM == true) {
        obj['OCM'] = "D-OCM (On condition Maintainenance Task)"
        this.StrategyTemp.push("D-OCM (On Condition Maintainenance Task)")
      }
      if (this.SO == true) {
        obj['SO'] = "D-SO (Scheduled Overhaul Task)"
        this.StrategyTemp.push("D-SO (Scheduled Overhaul Task)")
      }
      if (this.SR == true) {
        obj['SR'] = "D-SR (Scheduled Replacement Task)"
        this.StrategyTemp.push("D-SR (Scheduled Replacement Task)")
      }
      if (this.RED == true) {
        obj['RED'] = "D-RED (Redsigned Mandatory)"
        this.StrategyTemp.push("D-RED (Redsigned Mandatory)")
      }
      if (this.OFM == true) {
        obj['OFM'] = "D-OFM (On Failure Maintainenance)"
        this.StrategyTemp.push("D-OFM (On Failure Maintainenance)")
      }
      this.StrategyList.push(obj)
    }
    else if (this.ConsequenceBasedMSS == "E (Failure Mode:Hidden, Failure Mode with Condition : Combined with one or other failure mode events, Failure Mode Consequences : No effect on safety or environment)") {
      this.StrategyTemp = []
      if (this.OCM == true) {
        obj['OCM'] = "E-OCM (On condition Maintainenance Task)"
        this.StrategyTemp.push("E-OCM (On Condition Maintainenance Task)")
      }
      if (this.SO == true) {
        obj['SO'] = "E-SO (Scheduled Overhaul Task)"
        this.StrategyTemp.push("E-SO (Scheduled Overhaul Task)")
      }
      if (this.SR == true) {
        obj['SR'] = "E-SR SR (Scheduled Replacement Task)"
        this.StrategyTemp.push("E-SR (Scheduled Replacement Task)")
      }
      if (this.FFT == true) {
        obj['FFT'] = "E-FFT (Failure Findind Task)"
        this.StrategyTemp.push("E-FFT (Failure Findind Task)")
      }
      if (this.RED == true) {
        obj['RED'] = "E-RED (Redsigned Mandatory)"
        this.StrategyTemp.push("E-RED (Redsigned Mandatory)")
      }
      if (this.OFM == true) {
        obj['OFM'] = "E-OFM (On Failure Maintainenance)"
        this.StrategyTemp.push("E-OFM (On Failure Maintainenance)")
      }
      this.StrategyList.push(obj)
    }

    this.ADDMSSToTree();
  }

  async ADDMSSToTree() {
    if (this.StrategyTemp.length > 0) {
      if (this.AvailabilityY.length > 0 && this.AvailabilityY.length > 0) {
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
        //name: `${this.OCM} ${this.SO} ${this.SR} ${this.FFT} ${this.RED} ${this.OFM}`
      } else {
        this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Stratergy is Missing" })
      }
      var availablility: number = 0;
      if (this.AvailabilityResult == 0) {
        availablility = this.AvailabilityCheck
      }
      if (this.AvailabilityResult != 0) {
        availablility = this.AvailabilityResult
      }
      this.FinalAvailability.push(availablility)
      var FMName = this.TreeUptoFCA[0].children[0].children[0].children[this.MSSADDCounter - 1].data.name;
      var dataFromLibrary = this.MSSLibraryJsonData.find(a => a['name'] === FMName);
      var MTBF = dataFromLibrary.mtbf;
      var LN = Math.log((2 * (availablility / 100)) - 1)
      var INTERVAl: number = -(MTBF * LN)
      var intervalWeek = (INTERVAl * 365) / 7;

      // Logic for Maintenance Tasks and Interval
      // first IF condition for Consequence A and B
    //  let MSSTaskObj: any = []
      this.StrategyTemp.forEach(element => {
        this.MSSStratergy = element;
        this.FMObj = new CentrifugalPumpPrescriptiveFailureMode();

        if (this.MSSStratergy == 'A-FFT (Failure Finding Task)' || this.MSSStratergy == 'A-OCM (On Condition Maintainenance Task)' || this.MSSStratergy == 'A-SO (Scheduled Overhaul Task)'
          || this.MSSStratergy == 'A-SR (Scheduled Replacement Task)' || this.MSSStratergy == 'A-RED (Redsigned Mandatory)' || this.MSSStratergy == 'A-OFM (On Failure Maintainenance)'
          || this.MSSStratergy == 'B-FFT (Failure Finding Task)' || this.MSSStratergy == 'B-OCM (On condition Maintainenance Task)' || this.MSSStratergy == 'B-SO (Scheduled Overhaul Task)'
          || this.MSSStratergy == 'B-SR (Scheduled Replacement Task)' || this.MSSStratergy == 'B-RED (Redsigned Mandatory)' || this.MSSStratergy == 'B-OFM (On Failure Maintainenance)') {

          if (this.MSSStratergy == 'A-OFM (On Failure Maintainenance)' || this.MSSStratergy == 'B-FFT (Failure Finding Task)') {
            let obj = {}
            obj['CentrifugalPumpMssId'] = 0;
            obj['CFPPrescriptiveId'] = 0;
            obj['CPPFMId'] = 0;
            obj['MSSMaintenanceInterval'] = 'Not Applicable'
            obj['MSSMaintenanceTask'] = 'Not Applicable'
            obj['MSSAvailability'] = JSON.stringify(this.FinalAvailability)
            obj['MSSStartergy'] = this.MSSStratergy
            obj['MSSIntervalSelectionCriteria'] = this.MSSIntervalSelectionCriteria
            // MSSTaskObj.push(obj)
            this.FMObj.CentrifugalPumpMssModel.push(obj)
          } else {

            var ocmHours = this.TreeUptoFCA[0].children[0].children[0].children[this.MSSADDCounter - 1].children[1].FCAData.children[2].data.name
            var ocmWeek: number = ocmHours.split(" ")[0]
            ocmWeek = Math.round((ocmWeek / 24) / 7)
            var strategy = this.MSSStratergy.split('-')[1];
            let obj = {}
            if (this.MSSStratergy == 'A-FFT (Failure Finding Task)') {
              obj['CentrifugalPumpMssId'] = 0;
              obj['CFPPrescriptiveId'] = 0;
              obj['CPPFMId'] = 0;
              obj['MSSMaintenanceInterval'] = `${intervalWeek.toFixed(2)} weeks`;
              obj['MSSMaintenanceTask'] = 'Function Check'
              obj['MSSStartergy'] = this.MSSStratergy
              obj['MSSAvailability'] = JSON.stringify(this.FinalAvailability)
              obj['MSSIntervalSelectionCriteria'] = this.MSSIntervalSelectionCriteria
              // MSSTaskObj.push(obj)
              this.FMObj.CentrifugalPumpMssModel.push(obj)
            } else {
              if (strategy == 'FFT (Failure Finding Task)') {
                obj['CentrifugalPumpMssId'] = 0;
                obj['CFPPrescriptiveId'] = 0;
                obj['CPPFMId'] = 0;
                obj['MSSMaintenanceInterval'] = 'Not Applicable';
                obj['MSSMaintenanceTask'] = 'Not Applicable'
                obj['MSSStartergy'] = this.MSSStratergy
                obj['MSSAvailability'] = JSON.stringify(this.FinalAvailability)
                obj['MSSIntervalSelectionCriteria'] = this.MSSIntervalSelectionCriteria
                // MSSTaskObj.push(obj)
                this.FMObj.CentrifugalPumpMssModel.push(obj)

              } else if (strategy == 'OCM (On Condition Maintainenance Task)') {
                obj['CentrifugalPumpMssId'] = 0;
                obj['CFPPrescriptiveId'] = 0;
                obj['CPPFMId'] = 0;
                obj['MSSMaintenanceInterval'] = `${ocmWeek}${" "}${"Week"}`
                obj['MSSMaintenanceTask'] = 'Carry out talks based on on-condition maintenance recommendation'
                obj['MSSStartergy'] = this.MSSStratergy
                obj['MSSAvailability'] = JSON.stringify(this.FinalAvailability)
                obj['MSSIntervalSelectionCriteria'] = this.MSSIntervalSelectionCriteria
                // MSSTaskObj.push(obj)
                this.FMObj.CentrifugalPumpMssModel.push(obj)

              } else if (strategy == 'SO (Scheduled Overhaul Task)') {
                var safeL: number = 0;
                safeL = this.SelectedPrescriptiveTree[0].centrifugalPumpPrescriptiveFailureModes[this.MSSADDCounter - 1].FCASafeLife;
                safeL = ((safeL * 365) / 7)
                obj['CentrifugalPumpMssId'] = 0;
                obj['CFPPrescriptiveId'] = 0;
                obj['CPPFMId'] = 0;
                obj['MSSMaintenanceInterval'] = `${safeL}${" "}${"Week"}`
                obj['MSSMaintenanceTask'] = 'Remove, overhaul, and rectify'
                obj['MSSStartergy'] = this.MSSStratergy
                obj['MSSAvailability'] = JSON.stringify(this.FinalAvailability)
                obj['MSSIntervalSelectionCriteria'] = this.MSSIntervalSelectionCriteria
                // MSSTaskObj.push(obj)
                this.FMObj.CentrifugalPumpMssModel.push(obj)

              } else if (strategy == 'SR (Scheduled Replacement Task)') {
                var safeL1: number = 0;
                safeL1 = this.SelectedPrescriptiveTree[0].centrifugalPumpPrescriptiveFailureModes[this.MSSADDCounter - 1].FCASafeLife;
                safeL1 = ((safeL1 * 365) / 7)
                obj['CentrifugalPumpMssId'] = 0;
                obj['CFPPrescriptiveId'] = 0;
                obj['CPPFMId'] = 0;
                obj['MSSMaintenanceInterval'] = `${safeL1}${" "}${"Week"}`
                obj['MSSMaintenanceTask'] = 'Remove, replace, and recommission'
                obj['MSSStartergy'] = this.MSSStratergy
                obj['MSSAvailability'] = JSON.stringify(this.FinalAvailability)
                obj['MSSIntervalSelectionCriteria'] = this.MSSIntervalSelectionCriteria
                // MSSTaskObj.push(obj)
                this.FMObj.CentrifugalPumpMssModel.push(obj)

              } else if (strategy == 'RED (Redsigned Mandatory)') {
                obj['CentrifugalPumpMssId'] = 0;
                obj['CFPPrescriptiveId'] = 0;
                obj['CPPFMId'] = 0;
                obj['MSSMaintenanceInterval'] = 'NA'
                obj['MSSMaintenanceTask'] = 'Modification, or redesign required since no task is effective'
                obj['MSSStartergy'] = this.MSSStratergy
                obj['MSSAvailability'] = JSON.stringify(this.FinalAvailability)
                obj['MSSIntervalSelectionCriteria'] = this.MSSIntervalSelectionCriteria
                // MSSTaskObj.push(obj)
                this.FMObj.CentrifugalPumpMssModel.push(obj)

              }
            }
          }
        } else if (this.MSSStratergy == 'C-FFT (Failure Finding Task)' || this.MSSStratergy == 'C-OCM (On condition Maintainenance Task)' || this.MSSStratergy == 'C-SO (Scheduled Overhaul Task)'
          || this.MSSStratergy == 'C-SR (Scheduled Replacement Task)' || this.MSSStratergy == 'C-RED (Redsigned Mandatory)' || this.MSSStratergy == 'C-OFM (On Failure Maintainenance)'
          || this.MSSStratergy == 'D-FFT (Failure Finding Task)' || this.MSSStratergy == 'D-OCM (On condition Maintainenance Task)' || this.MSSStratergy == 'D-SO (Scheduled Overhaul Task)'
          || this.MSSStratergy == 'D-SR (Scheduled Replacement Task)' || this.MSSStratergy == 'D-RED (Redsigned Mandatory)' || this.MSSStratergy == 'D-OFM (On Failure Maintainenance)'
          || this.MSSStratergy == 'E-FFT (Failure Finding Task)' || this.MSSStratergy == 'E-OCM (On condition Maintainenance Task)' || this.MSSStratergy == 'E-SO (Scheduled Overhaul Task)'
          || this.MSSStratergy == 'E-SR (Scheduled Replacement Task)' || this.MSSStratergy == 'E-RED (Redsigned Mandatory)' || this.MSSStratergy == 'E-OFM (On Failure Maintainenance)') {

          if (this.MSSStratergy == 'C-FFT (Failure Finding Task)' || this.MSSStratergy == 'D-FFT (Failure Finding Task)') {
            let obj = {}
            obj['CentrifugalPumpMssId'] = 0;
            obj['CFPPrescriptiveId'] = 0;
            obj['CPPFMId'] = 0;
            obj['MSSMaintenanceInterval'] = 'Not Applicable'
            obj['MSSMaintenanceTask'] = 'Not Applicable'
            obj['MSSAvailability'] = JSON.stringify(this.FinalAvailability)
            obj['MSSStartergy'] = this.MSSStratergy
            obj['MSSIntervalSelectionCriteria'] = this.MSSIntervalSelectionCriteria
            // MSSTaskObj.push(obj)
            this.FMObj.CentrifugalPumpMssModel.push(obj)
          } else {

            var ocmHours = this.TreeUptoFCA[0].children[0].children[0].children[this.MSSADDCounter - 1].children[1].FCAData.children[2].data.name
            var ocmWeek: number = ocmHours.split(" ")[0]
            ocmWeek = Math.round((ocmWeek / 24) / 7)

            var strategy = this.MSSStratergy.split('-')[1];
            let obj = {}
            if (strategy == 'FFT (Failure Finding Task)') {
              obj['CentrifugalPumpMssId'] = 0;
              obj['CFPPrescriptiveId'] = 0;
              obj['CPPFMId'] = 0;
              obj['MSSMaintenanceInterval'] = 'NA'
              obj['MSSMaintenanceTask'] = 'Function check'
              obj['MSSStartergy'] = this.MSSStratergy
              obj['MSSAvailability'] = JSON.stringify(this.FinalAvailability)
              obj['MSSIntervalSelectionCriteria'] = this.MSSIntervalSelectionCriteria
              // MSSTaskObj.push(obj)
              this.FMObj.CentrifugalPumpMssModel.push(obj)
            } else if (strategy == 'OCM (On Condition Maintainenance Task)') {
              obj['CentrifugalPumpMssId'] = 0;
              obj['CFPPrescriptiveId'] = 0;
              obj['CPPFMId'] = 0;
              obj['MSSMaintenanceInterval'] = `${ocmWeek}${" "}${"Week"}`
              obj['MSSMaintenanceTask'] = 'Carry out talks based on on-condition maintenance recommendation'
              obj['MSSStartergy'] = this.MSSStratergy
              obj['MSSAvailability'] = JSON.stringify(this.FinalAvailability)
              obj['MSSIntervalSelectionCriteria'] = this.MSSIntervalSelectionCriteria
              // MSSTaskObj.push(obj)
              this.FMObj.CentrifugalPumpMssModel.push(obj)

            } else if (strategy == 'SO (Scheduled Overhaul Task)') {
              obj['CentrifugalPumpMssId'] = 0;
              obj['CFPPrescriptiveId'] = 0;
              obj['CPPFMId'] = 0;
              obj['MSSMaintenanceInterval'] = `${this.SelectedPrescriptiveTree[0].centrifugalPumpPrescriptiveFailureModes[this.MSSADDCounter - 1].FCAUsefulLife}${" "}${"Week"}`
              obj['MSSMaintenanceTask'] = 'Remove, overhaul, and rectify'
              obj['MSSStartergy'] = this.MSSStratergy
              obj['MSSAvailability'] = JSON.stringify(this.FinalAvailability)
              obj['MSSIntervalSelectionCriteria'] = this.MSSIntervalSelectionCriteria
              // MSSTaskObj.push(obj)
              this.FMObj.CentrifugalPumpMssModel.push(obj)

            } else if (strategy == 'SR (Scheduled Replacement Task)') {
              obj['CentrifugalPumpMssId'] = 0;
              obj['CFPPrescriptiveId'] = 0;
              obj['CPPFMId'] = 0;
              obj['MSSMaintenanceInterval'] = `${this.SelectedPrescriptiveTree[0].centrifugalPumpPrescriptiveFailureModes[this.MSSADDCounter - 1].FCAUsefulLife}${" "}${"Week"}`
              obj['MSSMaintenanceTask'] = 'Remove, replace, and recommission'
              obj['MSSStartergy'] = this.MSSStratergy
              obj['MSSAvailability'] = JSON.stringify(this.FinalAvailability)
              obj['MSSIntervalSelectionCriteria'] = this.MSSIntervalSelectionCriteria
              // MSSTaskObj.push(obj)
              this.FMObj.CentrifugalPumpMssModel.push(obj)

            } else if (strategy == 'RED (Redsigned Mandatory)') {
              obj['CentrifugalPumpMssId'] = 0;
              obj['CFPPrescriptiveId'] = 0;
              obj['CPPFMId'] = 0;
              obj['MSSMaintenanceInterval'] = 'NA'
              obj['MSSMaintenanceTask'] = 'Modification, or redesign required since no task is effective'
              obj['MSSStartergy'] = this.MSSStratergy
              obj['MSSAvailability'] = JSON.stringify(this.FinalAvailability)
              obj['MSSIntervalSelectionCriteria'] = this.MSSIntervalSelectionCriteria
              //MSSTaskObj.push(obj)
              this.FMObj.CentrifugalPumpMssModel.push(obj)

            }
            else if (strategy == 'OFM (On Failure Maintainenance)') {
              obj['CentrifugalPumpMssId'] = 0;
              obj['CFPPrescriptiveId'] = 0;
              obj['CPPFMId'] = 0;
              obj['MSSMaintenanceInterval'] = 'NA'
              obj['MSSMaintenanceTask'] = 'No Task'
              obj['MSSStartergy'] = this.MSSStratergy
              obj['MSSAvailability'] = JSON.stringify(this.FinalAvailability)
              obj['MSSIntervalSelectionCriteria'] = this.MSSIntervalSelectionCriteria
             // MSSTaskObj.push(obj)
              this.FMObj.CentrifugalPumpMssModel.push(obj)

            }
          }
        }

      });
      
      //var Data : any = this.MSSTaskObjList[index];
      // this.FMObj.CentrifugalPumpMssModel.push(MSSTaskObj)
      this.CentrifugalPumpPrescriptiveModels.centrifugalPumpPrescriptiveFailureModes.push(this.FMObj);

      //  this.MSSTaskObjList.push(MSSTaskObj)

      const element = document.querySelector("#Availability")
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      this.AvailabilityYNCheck = false;
      this.expectedAvailability = false;
      this.AvailabilityPlantStoppage = false;
      this.AvailabilityPlantStoppageTime = false;
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
    } else if (this.MSSStratergy.length == 0) {
      this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Stratergy is Missing" })
    }
  }

  async SaveMSS() {
    var temp: string = JSON.stringify(this.data1Clone)
    var temp2 = JSON.parse(temp)
    // var CPObj: CentrifugalPumpPrescriptiveModels = new CentrifugalPumpPrescriptiveModels();
    // var FMObj : CentrifugalPumpPrescriptiveFailureMode = new CentrifugalPumpPrescriptiveFailureMode();
    this.TreeUptoFCA[0].children[0].children.forEach((res: any) => {
      res.MSS = temp2
    })
    this.CentrifugalPumpPrescriptiveModels.CFPPrescriptiveId = this.SelectedPrescriptiveTree[0].CFPPrescriptiveId
    this.CentrifugalPumpPrescriptiveModels.FMWithConsequenceTree = JSON.stringify(this.TreeUptoFCA)
    // for (let index = 0; index < this.MSSTaskObjList.length; index++) {
    // //  CPObj.centrifugalPumpPrescriptiveFailureModes[index]this.MSSTaskObjList[index]
    //     FMObj = new CentrifugalPumpPrescriptiveFailureMode();
    //     var Data : any = this.MSSTaskObjList[index];
    //     FMObj.CentrifugalPumpMssModel.push(Data)
    //     CPObj.CentrifugalPumpPrescriptiveFailureMode.push(FMObj);
    // }

    // CPObj.CentrifugalPumpPrescriptiveFailureMode.push(FMObj);
    //CPObj.centrifugalPumpPrescriptiveFailureModes = this.MSSTaskObj
    var url: string = this.prescriptiveContantAPI.MSSSave
    this.prescriptiveBLService.PutData(url, this.CentrifugalPumpPrescriptiveModels).subscribe(
      res => {
        this.messageService.add({ severity: 'success', summary: 'success', detail: 'Successfully Updated MSS' });
        this.router.navigateByUrl('/Home/Prescriptive/List')
      }, err => {
        console.log(err.error)
        this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'Something went wrong while updating, please try again later' });
      }
    )
    this.AvailabilityYNCheck = false;
    this.AvailabilityCalculations = false;
    const element = document.querySelector("#GoToTheSaveMSS1")
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  async Availability() {
    if (this.MSSIntervalSelectionCriteria != "" && (this.AvailabilityY == 'Yes' || this.AvailabilityY == 'No')) {
      this.changeDetectorRef.detectChanges()
      this.FinalAvailability = []
      if (this.AvailabilityY == 'Yes') {
        this.FinalAvailability = []
        this.stoppageDays = ""
        this.stoppageDaysValue = 0
        this.stoppageDaysTime = ""
        this.stoppageDaysTimeValue = 0
        this.FinalAvailability.push('Yes')
        this.expectedAvailability = true
        this.AvailabilityPlantStoppage = false
        this.AvailabilityPlantStoppageTime = false
      } else if (this.AvailabilityY == 'No') {
        this.FinalAvailability = []
        this.stoppageDays = ""
        this.stoppageDaysValue = 0
        this.stoppageDaysTime = ""
        this.stoppageDaysTimeValue = 0
        this.FinalAvailability.push('No')
        this.expectedAvailability = false
        this.AvailabilityPlantStoppage = true
        this.AvailabilityPlantStoppageTime = true
      }
      this.changeDetectorRef.detectChanges()
      const element = document.querySelector("#PlantStoppage")
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      this.messageService.add({ severity: 'warn', summary: 'warn', detail: " Availability value is missing" });
    }

  }

  async AvailabilityYes() {
    if (this.AvailabilityCheck != 0) {
      this.FinalAvailability.push(this.AvailabilityCheck)
      this.AddMSSSave = true
      const element = document.querySelector("#Consequence")
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      this.messageService.add({ severity: 'warn', summary: 'warn', detail: " Availability value is missing" })
    }

  }

  async StoppageDays() {
    if (this.stoppageDays.length > 0 && this.stoppageDaysValue != 0) {
      if (this.stoppageDays == 'Days') {
        this.stoppageValue = this.stoppageDaysValue * 1
        this.FinalAvailability.push('Days')
      } else if (this.stoppageDays == 'Week') {
        this.stoppageValue = this.stoppageDaysValue * 7
        this.FinalAvailability.push('Week')
      } else if (this.stoppageDays == 'Month') {
        this.stoppageValue = this.stoppageDaysValue * 30
        this.FinalAvailability.push('Month')
      } else if (this.stoppageDays == 'Year') {
        this.stoppageValue = this.stoppageDaysValue * 365
        this.FinalAvailability.push('Year')
      }
      this.FinalAvailability.push(this.stoppageDaysValue)
      this.PlantStoppageTime = !this.PlantStoppageTime;
      const element = document.querySelector("#PlantStoppagetime")
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Stoppage days are missing" })
    }
  }

  async StoppageDuration() {
    if (this.stoppageDaysTime.length > 0 && this.stoppageDaysTimeValue != 0) {
      if (this.stoppageDaysTime == 'Days') {
        this.stoppageDuration = this.stoppageDaysTimeValue * 1
        this.FinalAvailability.push('Days')
      } else if (this.stoppageDaysTime == 'Week') {
        this.stoppageDuration = this.stoppageDaysTimeValue * 7
        this.FinalAvailability.push('Week')
      } else if (this.stoppageDaysTime == 'Month') {
        this.stoppageDuration = this.stoppageDaysTimeValue * 30
        this.FinalAvailability.push('Month')
      } else if (this.stoppageDaysTime == 'Year') {
        this.stoppageDuration = this.stoppageDaysTimeValue * 365
        this.FinalAvailability.push('Year')
      }
      this.FinalAvailability.push(this.stoppageDaysTimeValue)
      this.AddMSSSave = true
      this.AvailabilityResult = (1 - (this.stoppageDuration / this.stoppageValue)) * 100
      const element = document.querySelector("#Consequence")
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Stoppage Duration is missing" })
    }
  }
}
