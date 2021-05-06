import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { TreeNode } from 'primeng/api';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';

@Component({
  selector: 'app-prescriptive-display',
  templateUrl: './prescriptive-display.component.html',
  styleUrls: ['./prescriptive-display.component.scss']
})

export class PrescriptiveDisplayComponent implements OnInit {
  files1: TreeNode[];
  public PrescriptiveRecords: any = [];
  public abc: any = [];
  public xyz: any = [];
  public InnerTree: any = []
  public data: any = []
  public FMTree: any = []
  public counter: number = 0;
  public Remark: string = "";
  public FileUrl: any;
  public PdfEnable: boolean = false;
  public ImageEnable: boolean = false;

  constructor(private http: HttpClient,
    public commonLoadingDirective: CommonLoadingDirective) { }

  ngOnInit() {
    this.commonLoadingDirective.showLoading(true, "Please wait...");
    this.http.get('api/PrescriptiveAPI').subscribe(
      res => {
        this.PrescriptiveRecords = res;
        if (this.PrescriptiveRecords.length > 0) {
          this.getReadyInnerTree();
        }
        this.commonLoadingDirective.showLoading(false, '');
      }
    )
  }


  getReadyInnerTree() {
    this.InnerTree = []
    var data1
    if (this.PrescriptiveRecords[this.counter].FMWithConsequenceTree == "") {
      data1 = this.PrescriptiveRecords[this.counter].FailureModeWithLSETree
      this.data = JSON.parse(data1)
      this.FMTree = this.data[0].children[0].children[0].children
      for (let index = 0; index < this.FMTree.length; index++) {
        var l: string = ""
        l = this.FMTree[index].children[0].children[0].data.name
        var s: string = ""
        s = this.FMTree[index].children[0].children[1].data.name

        var DBPath = this.PrescriptiveRecords[this.counter].centrifugalPumpPrescriptiveFailureModes[index].AttachmentDBPath
        var Remark = this.PrescriptiveRecords[this.counter].centrifugalPumpPrescriptiveFailureModes[index].Remark

        this.InnerTree.push(
          {
            "label": this.FMTree[index].data.name,
            "data": "Home Folder",
            "edit": true,
            "dbPath": DBPath,
            "remark": Remark,
            "expandedIcon": "pi pi-folder-open",
            "collapsedIcon": "pi pi-folder",
            "children": [
              {
                "label": "Local Effect",
                "expandedIcon": "pi pi-folder-open",
                "collapsedIcon": "pi pi-folder",
                "children": [
                  { "label": this.FMTree[index].children[0].children[0].data.name, "icon": "pi pi-file" }
                ]
              },
              {
                "label": "System Effect", "expandedIcon": "pi pi-folder-open",
                "collapsedIcon": "pi pi-folder",
                "children": [
                  { "label": this.FMTree[index].children[0].children[1].data.name, "icon": "pi pi-file" }
                ]
              },
              {
                "label": "Criticality Factor", "expandedIcon": "pi pi-folder-open",
                "collapsedIcon": "pi pi-folder",
                "children": [
                  { "label": this.PrescriptiveRecords[this.counter].centrifugalPumpPrescriptiveFailureModes[index].CriticalityFactor, "icon": "pi pi-file" }
                ]
              },
              {
                "label": "Rating", "expandedIcon": "pi pi-folder-open",
                "collapsedIcon": "pi pi-folder",
                "children": [
                  { "label": this.PrescriptiveRecords[this.counter].centrifugalPumpPrescriptiveFailureModes[index].Rating, "icon": "pi pi-file" }
                ]
              },
              {
                "label": "Maintenance Practice", "expandedIcon": "pi pi-folder-open",
                "collapsedIcon": "pi pi-folder",
                "children": [
                  { "label": this.PrescriptiveRecords[this.counter].centrifugalPumpPrescriptiveFailureModes[index].MaintainenancePractice, "icon": "pi pi-file" }
                ]
              },
              {
                "label": "Frequency of Maintenance", "expandedIcon": "pi pi-folder-open",
                "collapsedIcon": "pi pi-folder",
                "children": [
                  { "label": this.PrescriptiveRecords[this.counter].centrifugalPumpPrescriptiveFailureModes[index].FrequencyMaintainenance, "icon": "pi pi-file" }
                ]
              },
              {
                "label": "Condition Monitoring", "expandedIcon": "pi pi-folder-open",
                "collapsedIcon": "pi pi-folder",
                "children": [
                  { "label": this.PrescriptiveRecords[this.counter].centrifugalPumpPrescriptiveFailureModes[index].ConditionMonitoring, "icon": "pi pi-file" }
                ]
              }

            ]
          }

        )
      }
    } else if (this.PrescriptiveRecords[this.counter].FMWithConsequenceTree != "") {
      data1 = this.PrescriptiveRecords[this.counter].FMWithConsequenceTree
      this.data = JSON.parse(data1)
      this.FMTree = this.data[0].children[0].children[0].children

      for (let index = 0; index < this.FMTree.length; index++) {

        var l: string = ""
        l = this.FMTree[index].children[0].children[0].data.name
        var s: string = ""
        s = this.FMTree[index].children[0].children[1].data.name
        var c: string = ""
        c = this.FMTree[index].children[0].children[2].data.name

        var DBPath = this.PrescriptiveRecords[this.counter].centrifugalPumpPrescriptiveFailureModes[index].AttachmentDBPath
        var Remark = this.PrescriptiveRecords[this.counter].centrifugalPumpPrescriptiveFailureModes[index].Remark

        this.InnerTree.push(

          {
            "label": this.FMTree[index].data.name,
            "data": "Home Folder",
            "edit": true,
            "dbPath": DBPath,
            "remark": Remark,
            "expandedIcon": "pi pi-folder-open",
            "collapsedIcon": "pi pi-folder",
            "children": [
              {
                "label": "Local Effect",
                "expandedIcon": "pi pi-folder-open",
                "collapsedIcon": "pi pi-folder",
                "children": [
                  { "label": this.FMTree[index].children[0].children[0].data.name, "icon": "pi pi-file" }
                ]
              },
              {
                "label": "System Effect", "expandedIcon": "pi pi-folder-open",
                "collapsedIcon": "pi pi-folder",
                "children": [
                  { "label": this.FMTree[index].children[0].children[1].data.name, "icon": "pi pi-file" }
                ]
              },
              {
                "label": "Consequence", "expandedIcon": "pi pi-folder-open",
                "collapsedIcon": "pi pi-folder",
                "children": [
                  { "label": this.FMTree[index].children[0].children[2].data.name, "icon": "pi pi-file" }
                ]
              },
              {
                "label": "Criticality Factor", "expandedIcon": "pi pi-folder-open",
                "collapsedIcon": "pi pi-folder",
                "children": [
                  { "label": this.PrescriptiveRecords[this.counter].centrifugalPumpPrescriptiveFailureModes[index].CriticalityFactor, "icon": "pi pi-file" }
                ]
              },
              {
                "label": "Rating", "expandedIcon": "pi pi-folder-open",
                "collapsedIcon": "pi pi-folder",
                "children": [
                  { "label": this.PrescriptiveRecords[this.counter].centrifugalPumpPrescriptiveFailureModes[index].Rating, "icon": "pi pi-file" }
                ]
              },
              {
                "label": "Maintenance Practice", "expandedIcon": "pi pi-folder-open",
                "collapsedIcon": "pi pi-folder",
                "children": [
                  { "label": this.PrescriptiveRecords[this.counter].centrifugalPumpPrescriptiveFailureModes[index].MaintainenancePractice, "icon": "pi pi-file" }
                ]
              },
              {
                "label": "Frequency of Maintenance", "expandedIcon": "pi pi-folder-open",
                "collapsedIcon": "pi pi-folder",
                "children": [
                  { "label": this.PrescriptiveRecords[this.counter].centrifugalPumpPrescriptiveFailureModes[index].FrequencyMaintainenance, "icon": "pi pi-file" }
                ]
              },
              {
                "label": "Condition Monitoring", "expandedIcon": "pi pi-folder-open",
                "collapsedIcon": "pi pi-folder",
                "children": [
                  { "label": this.PrescriptiveRecords[this.counter].centrifugalPumpPrescriptiveFailureModes[index].ConditionMonitoring, "icon": "pi pi-file" }
                ]
              }

            ]
          }
        )
      }
    }

    this.PushRecordsInFiles()

  }

  PushRecordsInFiles() {
    this.abc = {
      "label": "Equipment Type : " + this.PrescriptiveRecords[this.counter].EquipmentType + ",  " + "  " + "Tag Number : " + this.PrescriptiveRecords[this.counter].TagNumber,
      "data": "Documents Folder",
      "expandedIcon": "pi pi-folder-open",
      "collapsedIcon": "pi pi-folder",
      "children": [{
        "label": "Function",
        "data": "Work Folder",
        "expandedIcon": "pi pi-folder-open",
        "collapsedIcon": "pi pi-folder",
        "children": [{ "label": "Fluid Type : " + this.PrescriptiveRecords[this.counter].FunctionFluidType + ", " + "Rated Head : " + this.PrescriptiveRecords[this.counter].FunctionRatedHead + " m " + ", " + "Duration Of : " + this.PrescriptiveRecords[this.counter].FunctionPeriodType + " days" }, {
          "label": "Function Failure",
          "data": "Home Folder",
          "expandedIcon": "pi pi-folder-open",
          "collapsedIcon": "pi pi-folder",
          "children": [{ "label": this.PrescriptiveRecords[this.counter].FunctionFailure, "icon": "pi pi-file" },
          {
            "label": "Failure Mode",
            "data": "Home Folder",
            "expandedIcon": "pi pi-folder-open",
            "collapsedIcon": "pi pi-folder",
            "children": this.InnerTree
          },
          {
            "label": "Component Criticality Factor",
            "data": "Home Folder",
            "expandedIcon": "pi pi-folder-open",
            "collapsedIcon": "pi pi-folder",
            "children": [
              { "label": this.PrescriptiveRecords[this.counter].ComponentCriticalityFactor, "icon": "pi pi-file" }
            ]
          },
          {
            "label": "Component Rating",
            "data": "Home Folder",
            "expandedIcon": "pi pi-folder-open",
            "collapsedIcon": "pi pi-folder",
            "children": [
              { "label": this.PrescriptiveRecords[this.counter].ComponentRating, "icon": "pi pi-file" }
            ]
          },
          {
            "label": "Component Maintenance Practice",
            "data": "Home Folder",
            "expandedIcon": "pi pi-folder-open",
            "collapsedIcon": "pi pi-folder",
            "children": [
              { "label": this.PrescriptiveRecords[this.counter].CMaintainenancePractice, "icon": "pi pi-file" }
            ]
          },
          {
            "label": "Component Frequency Maintenance",
            "data": "Home Folder",
            "expandedIcon": "pi pi-folder-open",
            "collapsedIcon": "pi pi-folder",
            "children": [
              { "label": this.PrescriptiveRecords[this.counter].CFrequencyMaintainenance, "icon": "pi pi-file" }
            ]
          },
          {
            "label": "Component Condition Monitoring",
            "data": "Home Folder",
            "expandedIcon": "pi pi-folder-open",
            "collapsedIcon": "pi pi-folder",
            "children": [
              { "label": this.PrescriptiveRecords[this.counter].CConditionMonitoring, "icon": "pi pi-file" }
            ]
          }
          ]
        }]

      }

      ]

    }
    this.xyz.push(this.abc)


    if (this.counter < this.PrescriptiveRecords.length - 1) {
      this.counter += 1;
      this.getReadyInnerTree()
    }
    if (this.counter == this.PrescriptiveRecords.length - 1) {
      this.files1 = this.xyz
      this.commonLoadingDirective.showLoading(false, "");
    }

  }



}


