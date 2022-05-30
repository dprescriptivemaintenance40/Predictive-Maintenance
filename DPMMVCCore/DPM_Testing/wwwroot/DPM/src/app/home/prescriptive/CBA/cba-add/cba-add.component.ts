import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';
import { PrescriptiveContantAPI } from '../../Shared/prescriptive.constant';
import { CBAFailureModeTask, CentrifugalPumpCbaModel } from '../../Shared/cba-model';
import * as jspreadsheet from "jspreadsheet-ce";
declare var vis: any;

@Component({
  selector: 'app-cba',
  templateUrl: './cba-add.component.html',
  styleUrls: ['./cba-add.component.css'],

})

export class CBAComponent implements OnInit {
  @ViewChild("spreadsheet", { static: true }) spreadsheet: ElementRef;
  public SelectBoxEnabled: boolean = false;
  public cbaSheet: boolean = false;
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
  public SetAgeRelated: string = "";
  public FCAConsequence: string = "";
  public SetConsequence: string = "";
  public DescribeScenario: string = "";
  public RiskMatrix: string = "";
  public SetMSSStratergy: string = "";
  public ScenarioYN: string = "";
  public Economics: boolean = false;
  public setData: any = [];
  public MSSIndex: number = 0;
  public FCAPattern: string = "";
  public SheetValue: Array<any> = [];

  ngOnInit() {
    this.getPrescriptiveRecords();
    this.cbaSheet = false;
  }

  constructor(private prescriptiveContantAPI: PrescriptiveContantAPI,
    private prescriptiveBLService: CommonBLService,) {
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


  TagNumberSelect() {
    if (this.SelectedTagNumber != "") {
      this.PrescriptiveTreeList.forEach((res: any) => {
        if (res.TagNumber === this.SelectedTagNumber) {
          this.SelectedPrescriptiveTree.push(res);
          // let obj = {};
          // obj['0'] = this.SelectedPrescriptiveTree[0].TagNumber;
          // obj['11'] = this.SelectedPrescriptiveTree[0].centrifugalPumpPrescriptiveFailureModes[0].FunctionMode;
          // obj['12'] = this.SelectedPrescriptiveTree[0].EquipmentType;
          // this.setData.push(obj);
          // this.SetTagNumber = this.SelectedPrescriptiveTree[0].TagNumber;
          // this.SetFailureMode = this.SelectedPrescriptiveTree[0].centrifugalPumpPrescriptiveFailureModes[0].FunctionMode;
          // this.SetEquipmentType = this.SelectedPrescriptiveTree[0].EquipmentType;
          console.log(this.SelectedPrescriptiveTree)
          // this.CFPPrescriptiveId = res.CFPPrescriptiveId;
          // this.data1 = JSON.parse(res.FMWithConsequenceTree)
          // this.data1Clone = this.data1[0].children[0].children[0].Consequence;
          // this.cbaSheet = true;
          this.cbasheet();
          // this.SelectBoxEnabled = false
        }
      });
    }
  }

  createColumns() {
    // this.columns.push({ type: 'text', title: 'ETBF', width: "60" }),
    // this.columns.push({ type: 'text', title: 'EC', width: "40" }),
    // this.columns.push({ type: 'text', title: 'HS', width: "40" }),
    // this.columns.push({ type: 'text', title: 'EV', width: "40" }),
    // this.columns.push({ type: 'text', title: 'Criticality Assessment', width: "100" }),
    // this.columns.push({ type: 'text', title: 'PONC', width: "40" }),
    // this.columns.push({ type: 'text', title: 'Equipment Type', width: "100" })
    this.columns.push({ type: 'text', title: 'MSSMaintenanceTask', wordWrap: true, width: "140" }),
      this.columns.push({ type: 'text', title: 'MSSStartergy', width: "160", wordWrap: true }),
      this.columns.push({ type: 'text', title: 'MSSMAintenanceInterval', width: "150" }),
      this.columns.push({ type: 'text', title: 'RWC', width: "40" }),
      this.columns.push({ type: 'text', title: 'Task duration, h', width: "80" }),
      this.columns.push({ type: 'text', title: 'Resource cost Annual Total, k$', width: "160" }),
      this.columns.push({ type: 'text', title: 'Material cost Annual Total, k$', width: "160" }),
      this.columns.push({ type: 'text', title: 'POC,K', width: "70" }),
      this.columns.push({ type: 'text', title: 'Workcenter', width: "80" }),
      this.columns.push({ type: 'dropdown', title: 'On stream', width: "80", source: ['Yes', 'No'] }),
      this.columns.push({ type: 'dropdown', title: 'Status', width: "60", source: ['New', 'Existing'] })
  }

  cbasheet() {
    this.createColumns();
    this.jspreadsheet = jspreadsheet(this.spreadsheet.nativeElement, {
      data: [[]],
      columns: this.columns,
      tableOverflow: true,
      tableWidth: "1200px",
      tableHeight: "600px",
      minDimensions: [, 3]
    });
    this.SetCBAData();
    this.PrescriptiveCBA = true;
    this.cbaSheet = true;
    this.Economics = true;
    this.SelectBoxEnabled = false;
  }

  SetCBAData() {
    this.MSSIndex = 0;
    this.SetTagNumber = this.SelectedPrescriptiveTree[0].TagNumber;
    this.FCAPattern = this.PrescriptiveTreeList[0].centrifugalPumpPrescriptiveFailureModes[0].Pattern;
    if (this.FCAPattern == "Pattern 2" || this.FCAPattern == "Pattern 3") {
      this.SetAgeRelated = "Yes";
    } else if (this.FCAPattern == "Pattern 5" || this.FCAPattern == "Pattern 6") {
      this.SetAgeRelated = "No";
    }
    this.FCAConsequence = this.PrescriptiveTreeList[0].centrifugalPumpPrescriptiveFailureModes[0].Consequence.split(" ", 1);
    if (this.FCAConsequence == 'B' || this.FCAConsequence == 'C' || this.FCAConsequence == 'D') {
      this.SetConsequence = 'Revealed';
    } else if (this.FCAConsequence == 'A' || this.FCAConsequence == 'E') {
      this.SetConsequence = 'Hidden';
    }
    this.SetFailureMode = this.SelectedPrescriptiveTree[0].centrifugalPumpPrescriptiveFailureModes[0].FunctionMode;
    // this.jspreadsheet.setValueFromCoords(12, 0, this.SelectedPrescriptiveTree[0].EquipmentType, true);
    this.SelectedPrescriptiveTree[0].centrifugalPumpPrescriptiveFailureModes[0].CentrifugalPumpMssModel.forEach(MSSData => {
      this.jspreadsheet.setValueFromCoords(0, this.MSSIndex, MSSData.MSSMaintenanceTask, true);
      this.jspreadsheet.setValueFromCoords(1, this.MSSIndex, MSSData.MSSStartergy, true);
      this.jspreadsheet.setValueFromCoords(2, this.MSSIndex, MSSData.MSSMaintenanceInterval, true);
      this.MSSIndex++;
    });
  }

  Save() {
    let CbaModelObj = new CentrifugalPumpCbaModel();
    CbaModelObj.CPCMId = 0;
    CbaModelObj.CFPPrescriptiveId = this.PrescriptiveTreeList[0].CFPPrescriptiveId;
    CbaModelObj.CPPFMId = this.SelectedPrescriptiveTree[0].centrifugalPumpPrescriptiveFailureModes[0].CPPFMId;
    CbaModelObj.TagNumber = this.SetTagNumber;
    CbaModelObj.FailureMode = this.SetFailureMode;
    CbaModelObj.IsAgeRelated = this.SetAgeRelated;
    CbaModelObj.Consequence = this.SetConsequence;
    CbaModelObj.DescribeScenario = this.DescribeScenario;
    CbaModelObj.RiskMatrix = this.RiskMatrix;
    CbaModelObj.HasScenario = this.ScenarioYN;
    this.SheetValue = this.jspreadsheet.getData();
    for (let cbasheet = 0; cbasheet < this.SheetValue.length; cbasheet++) {
      if (this.SheetValue[cbasheet][0] != "") {
        let CBATask = new CBAFailureModeTask();
        CBATask.CPCMId = CbaModelObj.CPCMId;
        CBATask.CPMId = 1;
        CBATask.MSSMaintenanceTask = this.SheetValue[cbasheet][0];
        CBATask.MSSStartergy = this.SheetValue[cbasheet][1]
        CBATask.MSSMAintenanceInterval = this.SheetValue[cbasheet][2]
        CBATask.RWC = this.SheetValue[cbasheet][3]
        CBATask.TaskDuration = this.SheetValue[cbasheet][4]
        CBATask.ResourceCost = this.SheetValue[cbasheet][5]
        CBATask.MaterialCost = this.SheetValue[cbasheet][6]
        CBATask.POC = this.SheetValue[cbasheet][7]
        CBATask.WorkCenter = this.SheetValue[cbasheet][8]
        CBATask.OnStream = this.SheetValue[cbasheet][9]
        CBATask.Status = this.SheetValue[cbasheet][10];
        CbaModelObj.CBAFailureModeTasks.push(CBATask);
      }
    }

    var url: string = this.prescriptiveContantAPI.CBASheet
    this.prescriptiveBLService.postWithoutHeaders(url, CbaModelObj)
      .subscribe(
        res => {
          console.log(res);
          // this.treeResponseData = res;
          // localStorage.setItem('PrescriptiveObject', JSON.stringify(this.treeResponseData))
          // this.prescriptiveTreeNextEnable = true
          // this.prescriptiveTreeUpdateEnable = false;
          // this.prescriptiveTreeSubmitEnable = false;
          // this.prescriptiveTreeBackEnable = false
        },
        err => { console.log(err.Message) }
      )
  }
}