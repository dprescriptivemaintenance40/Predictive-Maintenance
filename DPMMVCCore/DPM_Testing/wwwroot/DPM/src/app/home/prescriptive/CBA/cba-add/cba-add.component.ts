import { Component, ViewChild, ElementRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';
import { PrescriptiveContantAPI } from '../../Shared/prescriptive.constant';
import { CBAFailureMode, PrescriptiveCbaModel, CBAMaintenanceTask, CBAMaintenanceInterval } from '../../Shared/CBA/cba-model';
import * as jspreadsheet from "jspreadsheet-ce";
import { HomeComponent } from 'src/app/home/home.component';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cba',
  templateUrl: './cba-add.component.html',
  styleUrls: ['./cba-add.component.css'],
})

export class CBAComponent implements OnInit {
  public cbaSheet: boolean = true;
  @ViewChild("spreadsheet", { static: false }) spreadsheet: ElementRef;
  public SelectBoxEnabled: boolean = false;
  public SheetData: any = [];
  public MSSIndexId: number;
  public SelectedTagNumber: string = "";
  public TagList: any = [];
  public PrescriptiveTreeList: any = [];
  public SelectedPrescriptiveTree: any = [];
  public jspreadsheet: any = [];
  public PrescriptiveCBA: boolean = false;
  public columns: any = [];
  public SetTagNumber: string = "";
  public SetFailureMode: string = "";
  public SetEquipmentType: string = "";
  public SetFunctionFailure: string = "";
  public SetAgeRelated: string = "";
  public FCAConsequence: string = "";
  public SetConsequence: string = "";
  public DescribeScenario: string = "";
  public DisableScenario: boolean = true;
  public RiskMatrix: string = "";
  public SetMSSStratergy: string = "";
  public ScenarioYN: string = "";
  public Economics: boolean = false;
  public setData: any = [];
  public MSSIndex: number = 0;
  public FCAPattern: string = "";
  public SheetValue: Array<any> = [];
  public RiskMatrix5: boolean = false;
  public RiskMatrix6: boolean = false;
  public AnnualCostIndex: number = 0;

  public CBAClientJSONData: any = [];
  public CBAContractorJSONData: any = [];
  public CBAFrequencyJSONData: any = [];

  public ResourceCost: number;
  public RWC: number;
  public TaskDuration: number = 1;
  public totalAnnualPOC: number = 0;
  public AnnualPOcIndex: number = 0;
  public TotalAnnualPocIndex: number = 0;

  public TotalRetained: number = 0;
  public TotalDeleted: number = 0;
  public DeletedTaskDuration: number = 0;
  public annualcostwithmaintenance: number = 0;
  public ResidualRisk: number = 0;

  public x: string = "";
  public y: string = "";

  public PLE: string = "";
  public DownTimeHr: number = 0;
  public DownTime: number = 0;
  public ReducedThroughPutHr: number = 0;
  public ReducedThroughPutHr1: number = 0;
  public ReducedThroughput: number = 0;
  public MISC: number = 0;
  public TotalProductionLoss: number = 0;

  public MaterialsEquipment: number = 0;
  public ContractPayments: number = 0;
  public Misc: number = 0;
  public MISCHr: number = 0;
  public TotalRepairCosts: number = 0;

  public PONCList: any = [];
  public TotalLabour: number = 0;
  public TotalRepairCostsList: any = [];

  public TotalResourceCost: number = 0;
  public TotalEconomicConsequences: number = 0;
  public DisplayEconomics: boolean = false;
  public DisplaySave: boolean = false;
  public DisplayUpdate: boolean = false;
  public Economicsy: number = 0;
  public noofrows: number;
  public RedMatrix5: any = ['5C', '5D', '5E', '4D', '4E', '3E'];
  public DarkyellowMatrix5: any = ['5B', '4C', '3D', '2E'];
  public YellowMatrix5: any = ['5A', '4A', '4B', '3B', '3C', '2C', '2D', '1D', '1E'];
  public GreenMatrix5: any = ['3A', '2A', '2B', '1A', '1B', '1C'];

  public RedMatrixvalue: string = "";
  public Darkyellowvalue: string = "";
  public YellowMatrixvalue: string = "";
  public GreenMatrixvalue: string = "";

  public RedMatrix6: any = ['6B', '6C', '6D', '6E', '6F', '5C', '5D', '5E', '5F', '4D', '4E', '4F', '3F'];
  public DarkyellowMatrix6: any = ['6A', '5B', '4C', '3D', '3E', '2F'];
  public YellowMatrix6: any = ['5A', '4A', '4B', '3B', '3C', '2C', '2D', '2E', '1E', '1F'];
  public GreenMatrix6: any = ['3A', '2A', '2B', '1A', '1B', '1C', '1D'];

  public FailureModeId: number = 0;

  ngOnInit() {
    this.cbaSheet = false;
    this.getPrescriptiveRecords();
    this.homeComponent.MenuClosed();
    this.getCBAClientCraftInJSon();
    this.getCBAContractorCraftInJSon();
    this.getCBAFrequencyInJSon();
  }

  constructor(private prescriptiveContantAPI: PrescriptiveContantAPI,
    private prescriptiveBLService: CommonBLService,
    private homeComponent: HomeComponent,
    private http: HttpClient,
    private messageService: MessageService,
    public router: Router,
    private cdr: ChangeDetectorRef) {
  }

  async getPrescriptiveRecords() {
    this.SelectBoxEnabled = true;
    this.PrescriptiveCBA = false;
    var url: string = this.prescriptiveContantAPI.PrescriptiveRecordsForCBA
    await this.prescriptiveBLService.getWithoutParameters(url).subscribe(
      (res: any) => {
        this.PrescriptiveTreeList = res
        if (this.PrescriptiveTreeList.length != 0) {
          this.PrescriptiveTreeList.forEach(element => {
            this.TagList.push(element.TagNumber)
          });
        }
      })
  }

  public getCBAClientCraftInJSon() {
    this.http.get<any>('dist/DPM/assets/Library/CBALibrary/cba_clientcrafts.json').subscribe(
      res => {
        this.CBAClientJSONData = res;
      }, error => { console.log(error.error) }
    )
  }

  public getCBAContractorCraftInJSon() {
    this.http.get<any>('dist/DPM/assets/Library/CBALibrary/cba_contractorcrafts.json').subscribe(
      res => {
        this.CBAContractorJSONData = res;
      }, error => { console.log(error.error) }
    )
  }

  public getCBAFrequencyInJSon() {
    this.http.get<any>('dist/DPM/assets/Library/CBALibrary/cba_frequency.json').subscribe(
      res => {
        this.CBAFrequencyJSONData = res;
      }, error => { console.log(error.error) }
    )
  }

  public TagNumberSelect() {
    if (this.SelectedTagNumber != "") {
      this.PrescriptiveTreeList.forEach((res: any) => {
        if (res.TagNumber === this.SelectedTagNumber) {
          this.SelectedPrescriptiveTree.push(res);
          console.log(this.SelectedPrescriptiveTree)
          this.cbasheet();
        }
      });
    }
  }

  public cbasheet() {
    this.MSSIndex = 0;
    this.SelectBoxEnabled = false;
    this.PrescriptiveCBA = true;
    this.cbaSheet = true;
    this.cdr.detectChanges()
    this.Economics = true;
    this.createColumns();
    this.SelectedPrescriptiveTree[0].centrifugalPumpPrescriptiveFailureModes.forEach(failuremodes => {
      failuremodes.CentrifugalPumpMssModel.forEach(MSSData => {
        this.MSSIndex++;
      });
      this.MSSIndexId = this.MSSIndex;
    });
    this.noofrows = 5;
    this.jspreadsheet = jspreadsheet(this.spreadsheet.nativeElement, {
      data: [[]],
      columns: this.columns,
      tableOverflow: true,
      tableWidth: "1350px",
      tableHeight: "600px",
      onchange: this.changed,
      onselection: this.selectionActive,
      minDimensions: [, this.MSSIndexId]
    });
    this.SetCBAData();
  }

  createColumns() {
    this.columns.push({ type: 'text', title: 'Failure Mode', wordWrap: true, width: "140" }),
      this.columns.push({ type: 'text', title: 'Maintenance Task', wordWrap: true, width: "140" }),
      this.columns.push({ type: 'text', title: 'Strategy', width: "160", wordWrap: true }),
      this.columns.push({ type: 'text', title: 'Maintenance Interval', width: "150" }),
      this.columns.push({ type: 'dropdown', title: 'Maintenance Library', width: "130", source: ['Client', 'Contractor'] }),
      this.columns.push({ type: 'dropdown', title: 'RWC', width: "70", source: ['OPS', 'REL', 'MEC', 'ELE', 'CTL', 'AUT', 'HEL', 'RIG', 'DRV'] }),
      this.columns.push({ type: 'numeric', title: 'Task duration, h', width: "80" }),
      this.columns.push({ type: 'numeric', title: 'Resource cost annual Total, k$', width: "200" }),
      this.columns.push({ type: 'numeric', title: 'Material cost annual Total, k$', width: "200" }),
      this.columns.push({ type: 'numeric', title: 'POC,K', width: "70" }),
      this.columns.push({ type: 'numeric', title: 'Annual Poc', width: "100" }),
      this.columns.push({ type: 'text', title: 'Workcenter', width: "80" }),
      this.columns.push({ type: 'dropdown', title: 'On stream', width: "80", source: ['Yes', 'No'] }),
      this.columns.push({ type: 'dropdown', title: 'Status', width: "60", source: ['New', 'Retained', 'Deleted'] }),
      this.columns.push({ type: 'numeric', title: 'Etbf', width: "40" }),
      this.columns.push({ type: 'numeric', title: 'Ponc', width: "60" }),
      this.columns.push({ type: 'text', title: 'Ec', width: "40" }),
      this.columns.push({ type: 'text', title: 'Hs', width: "40" }),
      this.columns.push({ type: 'text', title: 'Ev', width: "40" }),
      this.columns.push({ type: 'text', title: 'Criticality assessment', width: "140" }),
      this.columns.push({ type: 'numeric', title: 'Etbc', width: "40" }),
      this.columns.push({ type: 'numeric', title: 'Total annual poc', width: "100" }),
      this.columns.push({ type: 'numeric', title: 'Total annualcost with maintenance', width: "200" })
    this.columns.push({ type: 'numeric', title: 'Residual risk  with maintenance ', width: "200" })
    this.columns.push({ type: 'numeric', title: 'Mei', width: "80" })
  }

  changed = async (instance, cell, x, y, value) => {
    this.SheetValue = this.jspreadsheet.getData();
    if (x == 3 || x == 4 || x == 5) {
      if (this.SheetValue[y][3] != "" && this.SheetValue[y][4] != "" && this.SheetValue[y][5] != "") {
        this.SetResourceCost(x, y);
      }
      else if (this.SheetValue[y][4] != "" && this.SheetValue[y][3] == "") {
        this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'Please Enter Frequency' });
      }
      else if (this.SheetValue[y][5] != "" && this.SheetValue[y][3] == "") {
        this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'Please Enter Frequency' });
      }
      else if (this.SheetValue[y][5] != "" && this.SheetValue[y][4] == "") {
        this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'Please Enter Library' });
      }

    }

    if (x == 6) {
      if (this.SheetValue[y][5] == "") {
        var TaskDuration = value;
        this.jspreadsheet.setValueFromCoords(7, y, TaskDuration, true);
      }
      else if (this.SheetValue[y][5] != "") {
        this.SetResourceCost(x, y);
        var TaskDuration = value;
        this.ResourceCost = this.SheetValue[y][7] * TaskDuration;
        this.jspreadsheet.setValueFromCoords(7, y, this.ResourceCost.toFixed(3), true);
      }
    }

    if (x == 7) {
      if (this.SheetValue[y][7] != "") {
        var ResourceCost = this.SheetValue[y][7];
        this.TotalResourceCost += Number(ResourceCost);
      }
      this.TotalRepairCost();
    }
    if (this.SheetValue[y][5] != "" && this.SheetValue[y][6] != "") {
      if (x == "5" || x == "6") {
        var duration = this.SheetValue[y][6];
        var rwc = this.SheetValue[y][5];
        var dataforPOC = this.CBAClientJSONData.find(a => a['craft'] === rwc);
        var freqValue = dataforPOC.hourlyrate;
        var POC = freqValue * duration / 1000;
        this.jspreadsheet.setValueFromCoords(9, y, POC.toFixed(3), true);
      }
    }

    if (x == 9) {
      var poc = value;
      var freq = this.SheetValue[y][3];
      var freqData = this.CBAFrequencyJSONData.find(a => a['frequency'] === freq);
      var freqValue = freqData.frequencyvalue;
      var AnnualPOC = poc * freqValue;
      this.jspreadsheet.setValueFromCoords(10, y, AnnualPOC.toFixed(3), true);
    }
    if (x == 13) {
      this.TotalAnnualPOC(x, y);
      this.TotalAnnualCostWithMaintenance(x, y);
    }
    if (x == 14 || x == 15 || x == 20) {
      if (this.SheetValue[y][14] != "" && this.SheetValue[y][15] != "" && this.SheetValue[y][20] != "" && this.SheetValue[y][21] != "") {
        var MEI = ((this.SheetValue[y][15] / this.SheetValue[y][14]) - (this.SheetValue[y][15] / this.SheetValue[y][20])) / this.SheetValue[y][21];
        this.jspreadsheet.setValueFromCoords(24, y, MEI.toFixed(3), true);
      }
      else if (this.SheetValue[y][20] != "" && this.SheetValue[y][15] == "") {
        this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'Please Enter PONC' });
      }
      else if (this.SheetValue[y][20] != "" && this.SheetValue[y][14] == "") {
        this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'Please Enter ETBF' });
      }
      else if (this.SheetValue[y][15] != "" && this.SheetValue[y][14] == "") {
        this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'Please Enter ETBF' });
      }
    }

    if (x == 16 || x == 17 || x == 18) {
      if (this.SheetValue[y][16] != "" && this.SheetValue[y][17] != "" && this.SheetValue[y][18] != "") {
        var EC = this.SheetValue[y][16][0];
        var HS = this.SheetValue[y][17][0];
        var EV = this.SheetValue[y][18][0];
        this.RedMatrixvalue = "";
        this.Darkyellowvalue = "";
        this.YellowMatrixvalue = "";
        this.GreenMatrixvalue = "";

        if (this.RiskMatrix == '5*5 matrix') {
          this.RedMatrix5.forEach(red => {
            if (red == EC || red == HS || red == EV) {
              this.RedMatrixvalue = "HIGH / CAT 1"
            }
          });
          this.DarkyellowMatrix5.forEach(dyellow => {
            if (dyellow == EC || dyellow == HS || dyellow == EV) {
              this.Darkyellowvalue = "HIGH-MEDIUM / CAT 2"
            }
          });
          this.YellowMatrix5.forEach(yellow => {
            if (yellow == EC || yellow == HS || yellow == EV) {
              this.YellowMatrixvalue = "MEDIUM / CAT 3"
            }
          });
          this.GreenMatrix5.forEach(green => {
            if (green == EC || green == HS || green == EV) {
              this.GreenMatrixvalue = "LOW / CAT 4"
            }
          });
        }
        else if (this.RiskMatrix == '6*6 matrix') {
          this.RedMatrix6.forEach(red => {
            if (red == EC || red == HS || red == EV) {
              this.RedMatrixvalue = "HIGH / CAT 1"
            }
          });
          this.DarkyellowMatrix6.forEach(dyellow => {
            if (dyellow == EC || dyellow == HS || dyellow == EV) {
              this.Darkyellowvalue = "HIGH-MEDIUM / CAT 2"
            }
          });
          this.YellowMatrix6.forEach(yellow => {
            if (yellow == EC || yellow == HS || yellow == EV) {
              this.YellowMatrixvalue = "MEDIUM / CAT 3"
            }
          });
          this.GreenMatrix6.forEach(green => {
            if (green == EC || green == HS || green == EV) {
              this.GreenMatrixvalue = "LOW / CAT 4"
            }
          });
        }
        if (this.RedMatrixvalue != "") {
          this.jspreadsheet.setValueFromCoords(19, y, this.RedMatrixvalue, true);
        }
        else if (this.Darkyellowvalue != "") {
          this.jspreadsheet.setValueFromCoords(19, y, this.Darkyellowvalue, true);
        }
        else if (this.YellowMatrixvalue != "") {
          this.jspreadsheet.setValueFromCoords(19, y, this.YellowMatrixvalue, true);
        }
        else if (this.GreenMatrixvalue != "") {
          this.jspreadsheet.setValueFromCoords(19, y, this.GreenMatrixvalue, true);
        }
      }
    }
    if (x == 21 || x == 22) {
      if (this.SheetValue[y][21] != "" && this.SheetValue[y][22] != "") {
        this.ResidualRisk = this.SheetValue[y][22] - this.SheetValue[y][21];
        this.jspreadsheet.setValueFromCoords(23, this.TotalAnnualPocIndex, this.ResidualRisk.toFixed(3), true)
      }
    }
  }

  selectionActive = async (instance, x1, y1, x2, y2, origin) => {
    if (x1 == 15 && this.SheetValue[y1][0] != "" && this.SheetValue[y1][15] == "") {
      this.Economicsy = y1;
      this.DisplayEconomics = true;
      this.DisplayUpdate = true;
      this.DisplaySave = false;
      this.PLE = "";
      this.DownTimeHr = 0;
      this.DownTime = 0;
      this.ReducedThroughPutHr = 0;
      this.ReducedThroughPutHr1 = 0;
      this.ReducedThroughput = 0;
      this.MISC = 0;
      this.TotalProductionLoss = 0;
      this.MaterialsEquipment = 0;
      this.ContractPayments = 0;
      this.Misc = 0;
      this.MISCHr = 0;
      this.TotalRepairCosts = 0;
      this.TotalEconomicConsequences = 0;
      this.TotalRepairCostsList.forEach(resourcecosts => {
        if (resourcecosts.RepairCostIndex == y1 && this.SheetValue[y1][0] == resourcecosts.FailureMode) {
          this.TotalLabour = resourcecosts.TotalRepairCosts;
        }
      })
    }
    else if (x1 == 15 && this.SheetValue[y1][0] != "" && this.SheetValue[y1][15] != "") {
      this.Economicsy = y1;
      this.DisplayEconomics = true;
      this.DisplaySave = true;
      this.DisplayUpdate = false;
      var failuremode = this.SheetValue[this.Economicsy][0];
      var PONCData = this.PONCList.find(a => a['FailureMode'] === failuremode);
      this.PLE = PONCData.PLE;
      this.DownTimeHr = PONCData.DownTimeHr;
      this.DownTime = PONCData.DownTime;
      this.ReducedThroughPutHr = PONCData.ReducedThroughPutHr;
      this.ReducedThroughPutHr1 = PONCData.ReducedThroughPutHr1;
      this.ReducedThroughput = PONCData.ReducedThroughput
      this.MISC = PONCData.MISC;
      this.TotalProductionLoss = PONCData.TotalProductionLoss;
      this.MaterialsEquipment = PONCData.MaterialsEquipment;
      this.ContractPayments = PONCData.ContractPayments;
      this.Misc = PONCData.Misc;
      this.MISCHr = PONCData.MISCHr;
      this.TotalRepairCosts = PONCData.TotalRepairCosts
      this.TotalEconomicConsequences = PONCData.TotalEconomicConsequences
    }
    if ((x1 == 16 && this.SheetValue[y1][0] != "") || (x1 == 17 && this.SheetValue[y1][0] != "") || (x1 == 18 && this.SheetValue[y1][0] != "")) {
      this.x = x1;
      this.y = y1;
      if (this.RiskMatrix == '5*5 matrix') {
        this.RiskMatrix5 = true;
      }
      else if (this.RiskMatrix == '6*6 matrix') {
        this.RiskMatrix6 = true;
      }
    }
  }

  public SetResourceCost(x, y) {
    if (this.SheetValue[y][4] != "") {
      this.RWC = this.SheetValue[y][5];
      if (this.SheetValue[y][4] == 'Client') {
        var dataFromLibrary = this.CBAClientJSONData.find(a => a['craft'] === this.RWC);
        var hourlyRate = dataFromLibrary.hourlyrate;
      }
      else if (this.SheetValue[y][4] == 'Contractor') {
        var dataFromLibrary = this.CBAContractorJSONData.find(a => a['craft'] === this.RWC);
        var hourlyRate = dataFromLibrary.hourlyrate;
      }
      var MSSFrequency = this.SheetValue[y][3];
      var datafromFrequency = this.CBAFrequencyJSONData.find(a => a['frequency'] === MSSFrequency);
      var frequencyValue = datafromFrequency.frequencyvalue;
      this.ResourceCost = hourlyRate * frequencyValue;
      this.jspreadsheet.setValueFromCoords(7, y, this.ResourceCost.toFixed(3), true);
    }
    else if (this.SheetValue[y][4] == "") {
    }
  }

  public TotalAnnualPOC(x, y) {
    for (let sheet = 0; sheet < this.SheetValue.length; sheet++) {
      if (this.SheetValue[sheet][0] != "") {
        this.TotalAnnualPocIndex = sheet;
        this.totalAnnualPOC = 0;
        if (this.SheetValue[sheet][13] != 'Deleted' && this.SheetValue[sheet][13] != "") {
          var annualPOC = (this.SheetValue[sheet][10]);
          this.totalAnnualPOC = Number(annualPOC);
        }
      }
      else if (this.SheetValue[sheet][0] == "") {
        if (this.SheetValue[sheet][13] != 'Deleted' && this.SheetValue[sheet][13] != "") {
          var annualPOC = this.SheetValue[sheet][10];
          this.totalAnnualPOC += Number(annualPOC);
        }
      }

      this.jspreadsheet.setValueFromCoords(21, this.TotalAnnualPocIndex, this.totalAnnualPOC.toFixed(3), true);
    }
  }

  public TotalAnnualCostWithMaintenance(x, y) {
    for (let sheet = 0; sheet < this.SheetValue.length; sheet++) {
      if (this.SheetValue[sheet][0] != "") {
        this.TotalDeleted = 0;
        this.DeletedTaskDuration = 0;
        this.TotalRetained = 0;
        this.annualcostwithmaintenance = 0;
        this.AnnualCostIndex = sheet;
        if (this.SheetValue[sheet][13] == 'Retained' && this.SheetValue[sheet][13] != 'New' && this.SheetValue[sheet][13] != "") {
          var Retained = this.SheetValue[sheet][10];
          this.TotalRetained = Number(Retained);
        }
        if (this.SheetValue[sheet][13] == 'Deleted') {
          var Deleted = this.SheetValue[sheet][9];
          this.TotalDeleted = Number(Deleted);
          this.DeletedTaskDuration = 0;
          var DeletedDuration = this.SheetValue[sheet][6];
          this.DeletedTaskDuration = Number(DeletedDuration)
        }
      }
      else if (this.SheetValue[sheet][0] == "" && this.SheetValue[sheet][13] != 'New' && this.SheetValue[sheet][13] != "") {
        if (this.SheetValue[sheet][13] == 'Retained') {
          var Retained = this.SheetValue[sheet][10];
          this.TotalRetained += Number(Retained);
        }
        if (this.SheetValue[sheet][13] == 'Deleted') {
          var Deleted = this.SheetValue[sheet][9];
          this.TotalDeleted += Number(Deleted);
          var DeletedDuration = this.SheetValue[sheet][6];
          this.DeletedTaskDuration += Number(DeletedDuration)
        }
      }
      if (this.TotalRetained != undefined && this.TotalRetained != 0 && this.TotalDeleted != undefined && this.TotalDeleted != 0 && this.DeletedTaskDuration != undefined && this.DeletedTaskDuration != 0) {
        this.annualcostwithmaintenance = this.TotalRetained + (this.TotalDeleted / this.DeletedTaskDuration);
        this.jspreadsheet.setValueFromCoords(22, this.AnnualCostIndex, this.annualcostwithmaintenance.toFixed(3), true)
      }
      else {
        this.jspreadsheet.setValueFromCoords(22, this.AnnualCostIndex, this.annualcostwithmaintenance.toFixed(3), true)
      }
    }
  }

  public TotalRepairCost() {
    this.TotalRepairCostsList = [];
    for (let sheet = 0; sheet < this.SheetValue.length; sheet++) {
      if (this.SheetValue[sheet][0] != "" && this.SheetValue[sheet][7] != "") {
        this.TotalRepairCosts = 0;
        var RepairCost = this.SheetValue[sheet][7];
        this.TotalRepairCosts = Number(RepairCost);
        var RepairCostFM = this.SheetValue[sheet][0];
        var RepairCostIndex = sheet;
        var sheetid = sheet + 1;
        if ((this.SheetValue[sheetid][0] != RepairCostFM && this.SheetValue[sheetid][1] != '') ||
          (this.SheetValue[sheetid][0] == '' && this.SheetValue[sheetid][1] == '')) {
          let obj = {}
          obj['FailureMode'] = RepairCostFM;
          obj['RepairCostIndex'] = RepairCostIndex;
          obj['TotalRepairCosts'] = this.TotalRepairCosts;
          this.TotalRepairCostsList.push(obj);
        }
      }
      else if (this.SheetValue[sheet][0] == "" && this.SheetValue[sheet][7] != "") {
        var RepairCost = this.SheetValue[sheet][7];
        this.TotalRepairCosts += Number(RepairCost);
        var index = sheet + 1;
        if ((this.SheetValue[index][0] != '' && this.SheetValue[index][1] != '') ||
          (this.SheetValue[index][0] == '' && this.SheetValue[index][1] == '')) {
          let obj = {}
          obj['FailureMode'] = RepairCostFM;
          obj['RepairCostIndex'] = RepairCostIndex;
          obj['TotalRepairCosts'] = this.TotalRepairCosts;
          this.TotalRepairCostsList.push(obj);
        }
      }
      else if (this.SheetValue[sheet][0] == "" && this.SheetValue[sheet][1] == "" &&
        this.SheetValue[sheet][2] == "" && this.SheetValue[sheet][3] == "") {
        break;
      }

    }
  }

  public riskMatrix(Matrix: any) {
    this.RiskMatrix5 = false;
    this.RiskMatrix6 = false;
    var r = Matrix.innerText;
    this.jspreadsheet.setValueFromCoords([this.x], [this.y], [r], [true]);
  }

  public SetCBAData() {
    this.MSSIndex = 0;
    this.SetTagNumber = this.SelectedPrescriptiveTree[0].TagNumber;
    this.FCAPattern = this.SelectedPrescriptiveTree[0].centrifugalPumpPrescriptiveFailureModes[0].Pattern;
    this.SetEquipmentType = this.SelectedPrescriptiveTree[0].EquipmentType;
    this.SetFunctionFailure = this.SelectedPrescriptiveTree[0].FunctionFailure
    if (this.FCAPattern == "Pattern 2" || this.FCAPattern == "Pattern 3") {
      this.SetAgeRelated = "Yes";
    } else if (this.FCAPattern == "Pattern 5" || this.FCAPattern == "Pattern 6") {
      this.SetAgeRelated = "No";
    }
    this.FCAConsequence = this.SelectedPrescriptiveTree[0].centrifugalPumpPrescriptiveFailureModes[0].Consequence.split(" ", 1);
    if (this.FCAConsequence == 'B' || this.FCAConsequence == 'C' || this.FCAConsequence == 'D') {
      this.SetConsequence = 'Revealed';
    } else if (this.FCAConsequence == 'A' || this.FCAConsequence == 'E') {
      this.SetConsequence = 'Hidden';
    }
    this.SelectedPrescriptiveTree[0].centrifugalPumpPrescriptiveFailureModes.forEach(failuremodes => {
      this.SetFailureMode = failuremodes.FunctionMode;
      this.jspreadsheet.setValueFromCoords(0, this.MSSIndex, this.SetFailureMode, true);
      failuremodes.CentrifugalPumpMssModel.forEach(MSSData => {
        this.jspreadsheet.setValueFromCoords(1, this.MSSIndex, MSSData.MSSMaintenanceTask, true);
        this.jspreadsheet.setValueFromCoords(2, this.MSSIndex, MSSData.MSSStartergy, true);
        this.jspreadsheet.setValueFromCoords(3, this.MSSIndex, MSSData.MSSFrequency, true);
        this.MSSIndex++;
        this.MSSIndexId = this.MSSIndex;
      });
    });
  }

  public SetEconomics() {
    if (this.DownTime != 0 || this.ReducedThroughput != 0 || this.MISC != 0) {
      this.TotalProductionLoss = 0;
      this.TotalProductionLoss = Number(this.DownTime) + Number(this.ReducedThroughput) + Number(this.MISC);
    }
    if (this.Misc != 0 || this.MaterialsEquipment != 0 || this.ContractPayments != 0) {
      this.TotalRepairCosts = 0;
      this.TotalRepairCosts = Number(this.MaterialsEquipment) + Number(this.ContractPayments) + Number(this.Misc);
    }
    if (this.TotalProductionLoss != 0 || this.TotalRepairCosts != 0 || this.TotalLabour != 0) {
      this.TotalEconomicConsequences = this.TotalProductionLoss + this.TotalRepairCosts + this.TotalLabour;
      this.jspreadsheet.setValueFromCoords(15, this.Economicsy, this.TotalEconomicConsequences.toFixed(3), true);
    }
  }

  // public BacktoSelectCBATag() {
  //   this.jspreadsheet.destroy();
  //   this.MSSIndex = 0;
  //   this.PrescriptiveCBA = false;
  //   this.cbaSheet = false;
  //   this.Economics = false;
  //   this.SelectBoxEnabled = true;
  // }

  public ScenarioValue() {
    if (this.ScenarioYN == 'Yes') {
      this.DisableScenario = false;
    }
    else if (this.ScenarioYN == 'No') {
      this.DisableScenario = true;
    }
  }

  public SavePLE() {
    let obj = {};
    obj['FailureMode'] = this.SheetValue[this.Economicsy][0];
    obj['Y'] = this.Economicsy;
    obj['PLE'] = this.PLE;
    obj['DownTimeHr'] = this.DownTimeHr;
    obj['DownTime'] = this.DownTime;
    obj['ReducedThroughputHr'] = this.ReducedThroughPutHr;
    obj['ReducedThroughputHr1'] = this.ReducedThroughPutHr1;
    obj['ReducedThroughput'] = this.ReducedThroughput;
    obj['MISC'] = this.MISC;
    obj['TotalProductionLoss'] = this.TotalProductionLoss;
    obj['MaterialsEquipment'] = this.MaterialsEquipment;
    obj['ContractPayments'] = this.ContractPayments;
    obj['Misc'] = this.Misc;
    obj['MISCHr'] = this.MISCHr;
    obj['TotalRepairCosts'] = this.TotalRepairCosts;
    obj['TotalEconomicConsequences'] = this.TotalEconomicConsequences;
    this.PONCList.push(obj);
    this.DisplayEconomics = false;
  }

  public UpdatePLE() {
    var failuremode = this.SheetValue[this.Economicsy][0];
    this.PONCList.forEach((poncdata, index) => {
      if (poncdata.FailureMode == failuremode) {
        this.PONCList.splice(index, 1)
      }
    });
    this.SavePLE();
    this.DisplayEconomics = false;
  }

  public SaveCBA() {
    if (this.RiskMatrix != '' && this.ScenarioYN != '') {
      let CbaModelObj = new PrescriptiveCbaModel();
      CbaModelObj.PCMId = 0;
      CbaModelObj.CFPPrescriptiveId = this.SelectedPrescriptiveTree[0].CFPPrescriptiveId;
      CbaModelObj.CPPFMId = this.SelectedPrescriptiveTree[0].centrifugalPumpPrescriptiveFailureModes[0].CPPFMId;
      CbaModelObj.EquipmentType = this.SelectedPrescriptiveTree[0].EquipmentType;
      CbaModelObj.FunctionFailure = this.SelectedPrescriptiveTree[0].FunctionFailure
      CbaModelObj.TagNumber = this.SetTagNumber;
      CbaModelObj.IsAgeRelated = this.SetAgeRelated;
      CbaModelObj.RiskMatrix = this.RiskMatrix;
      CbaModelObj.Consequence = this.SetConsequence;
      CbaModelObj.HasScenario = this.ScenarioYN;
      CbaModelObj.DescribeScenario = this.DescribeScenario;
      this.FailureModeId = 0;
      this.SheetValue = this.jspreadsheet.getData();
      for (let cbafailuremode = 0; cbafailuremode < this.SheetValue.length; cbafailuremode++) {
        if (this.SheetValue[cbafailuremode][0] != "") {
          let CBAFailure = new CBAFailureMode();
          CBAFailure.PCMId = CbaModelObj.PCMId;
          CBAFailure.FailureMode = this.SheetValue[cbafailuremode][0];
          CBAFailure.ETBF = this.SheetValue[cbafailuremode][14];
          CBAFailure.PONC = this.SheetValue[cbafailuremode][15];
          CBAFailure.EC = this.SheetValue[cbafailuremode][16][0];
          CBAFailure.HS = this.SheetValue[cbafailuremode][17][0];
          CBAFailure.EV = this.SheetValue[cbafailuremode][18][0];
          CBAFailure.CA = this.SheetValue[cbafailuremode][19];
          CBAFailure.ETBC = this.SheetValue[cbafailuremode][20];
          CBAFailure.TotalAnnualPOC = this.SheetValue[cbafailuremode][21];
          CBAFailure.TotalAnnualCostWithMaintenance = this.SheetValue[cbafailuremode][22];
          CBAFailure.ResidualRiskWithMaintenance = this.SheetValue[cbafailuremode][23];
          CBAFailure.MEI = this.SheetValue[cbafailuremode][24];
          CbaModelObj.CBAFailureModes.push(CBAFailure);
          for (let cbamaintenancetask = cbafailuremode; cbamaintenancetask < this.SheetValue.length; cbamaintenancetask++) {
            if ((this.SheetValue[cbamaintenancetask][1] != "" && CBAFailure.FailureMode == this.SheetValue[cbamaintenancetask][0]) ||
              this.SheetValue[cbamaintenancetask][0] == "" && this.SheetValue[cbamaintenancetask][1] != "") {
              let CBATask = new CBAMaintenanceTask();
              // CBATask.CMTId = 1;
              CBATask.CFMId = CBAFailure.CFMId;
              CBATask.CentrifugalPumpMssId = 1;
              CBATask.MSSMaintenanceTask = this.SheetValue[cbamaintenancetask][1];
              CBATask.MSSStartergy = this.SheetValue[cbamaintenancetask][2];
              CBATask.MaterialCost = this.SheetValue[cbamaintenancetask][8];
              CBATask.Status = this.SheetValue[cbamaintenancetask][13];
              CBAFailure.CBAMaintenanceTasks.push(CBATask);
              for (let cbainterval = cbamaintenancetask; cbainterval < this.SheetValue.length; cbainterval++) {
                if ((CBATask.MSSMaintenanceTask == this.SheetValue[cbainterval][1] && this.SheetValue[cbainterval][0] == CBAFailure.FailureMode) ||
                  (this.SheetValue[cbainterval][0] == "" && this.SheetValue[cbainterval][1] == "" && this.SheetValue[cbainterval][3] != "") ||
                  (CBATask.MSSMaintenanceTask == this.SheetValue[cbainterval][1] && this.SheetValue[cbainterval][0] == '')) {
                  let CBAInterval = new CBAMaintenanceInterval();
                  // CBAInterval.CMIId = 1;
                  CBAInterval.CMTId = CBATask.CMTId;
                  CBAInterval.Maintenancelibrary = this.SheetValue[cbainterval][4];
                  CBAInterval.MSSFrequency = this.SheetValue[cbainterval][3];
                  CBAInterval.RWC = this.SheetValue[cbainterval][5];
                  CBAInterval.TaskDuration = this.SheetValue[cbainterval][6];
                  CBAInterval.ResourceCost = this.SheetValue[cbainterval][7];
                  CBAInterval.POC = this.SheetValue[cbainterval][9];
                  CBAInterval.AnnualPOC = this.SheetValue[cbainterval][10];
                  CBAInterval.WorkCenter = this.SheetValue[cbainterval][11];
                  CBAInterval.OnStream = this.SheetValue[cbainterval][12];
                  CBATask.CBAMainenanceIntervals.push(CBAInterval);
                  // cbamaintenancetask++
                  // cbafailuremode++;
                  // this.FailureModeId = cbafailuremode;
                }
                else if (CBATask.MSSMaintenanceTask != this.SheetValue[cbainterval][1] || (this.SheetValue[cbainterval][3] == "" &&
                  this.SheetValue[cbainterval][0] == "") && this.SheetValue[cbainterval][1] == ""
                  || (this.SheetValue[cbainterval][0] == "" && this.SheetValue[cbainterval][1] != this.SheetValue[cbainterval][1] && this.SheetValue[cbainterval][3] != "")) {
                  break;
                }
              }
            }
            else if (CBAFailure.FailureMode != this.SheetValue[cbamaintenancetask][0] && this.SheetValue[cbamaintenancetask][1] == "" &&
              this.SheetValue[cbamaintenancetask][3] == "" ||
              CBAFailure.FailureMode != '' && this.SheetValue[cbamaintenancetask][1] != "") {
              break;
            }

          }
        }
        else if (this.SheetValue[cbafailuremode][0] == "" && this.SheetValue[cbafailuremode][3] == "") {
          break;
        }
      }
      var url: string = this.prescriptiveContantAPI.CBASheet
      this.prescriptiveBLService.postWithoutHeaders(url, CbaModelObj)
        .subscribe(
          res => {
            console.log(res);
            this.messageService.add({ severity: 'success', summary: 'success', detail: 'Successfully Updated MSS' });
            this.router.navigateByUrl('/Home/Prescriptive/List');
          },
          err => {
            console.log(err.Message);
            console.log(err.error)
            this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'Something went wrong while updating, please try again later' });
          }
        )
    }
    else if (this.RiskMatrix == '') {
      this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'Please Select Riskmatrix' });
    }
    else if (this.ScenarioYN == '') {
      this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'Please Select Scenario' });
    }
  }

}

