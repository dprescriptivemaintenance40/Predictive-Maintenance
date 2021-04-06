import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import * as Chart from 'chart.js';
import { MessageService, TreeNode } from 'primeng/api';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';
import { CentrifugalPumpPrescriptiveModel } from './../../FMEA/prescriptive-add/prescriptive-model'

@Component({
  selector: 'app-fca-add',
  templateUrl: './fca-add.component.html',
  styleUrls: ['./fca-add.component.scss', '../../../../../assets/orgchart.scss'],
  providers: [MessageService],
})
export class FCAADDComponent implements OnInit {

  public FCAdata1: TreeNode[];
  public FMPattern = ['Pattern 1', 'Pattern 2', 'Pattern 3', 'Pattern 4', 'Pattern 5', 'Pattern 6'];
  public Pattern: string = ""
  public PatternPathEnable: boolean = false;
  public PatternNextOnPrescriptiveTree: boolean = false;
  public FailureModePatternTree: boolean = false;
  public PattenNode1: string;
  public PattenNode2: string;
  public PattenNode4: string;
  public PattenAnsNode4: string;
  public PattenNode7: string;
  public PattenAnsNode6P1: string;
  public PattenAnsNode5: string;
  public PattenNode5: string;
  public PattenAnsNode3P1: string;
  public PattenAnsNode2P1: string;
  public PattenNode3: string;
  public PattenAnsNode1: string;
  public PattenNode6: string;
  public PattenAnsNode2P2: string;
  public PattenNode8: string;
  public PattenAnsNode6P2: string;
  public PattenAnsNode3P2: string;
  public PatternEnable: boolean;
  public PatternPath: string = "";
  public PatternFMName: any;
  public PatternCounter: number = 0;
  public prescriptiveTree: boolean = false
  public data1: any;
  public data1Clone: any;
  public CFPPrescriptiveId: number = 0;

  constructor(private messageService: MessageService,
    public title: Title,
    public router: Router,
    public commonLoadingDirective: CommonLoadingDirective,
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    var FCAData = JSON.parse(localStorage.getItem('FCAObject'))
    if (FCAData == null) {
      this.router.navigateByUrl('/Home/Prescriptive/List')
    } else {
      this.CFPPrescriptiveId = FCAData.CFPPrescriptiveId;
      this.data1 = JSON.parse(FCAData.FMWithConsequenceTree);
      this.data1Clone = this.data1[0].children[0].children[0].Consequence;
      this.PatternTree();
      this.prescriptiveTree = true;
      this.PatternNextOnPrescriptiveTree = true;
    }
  }
  async ngOnDestroy() {
    await localStorage.removeItem('FCAObject');
  }


  private GetChartData() {
    const patternLabel1 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
    const patternData1 = [20, 10, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 10, 20];
    this.getChartTree(patternLabel1, patternData1, 'pattern1', 'Pattern 1');

    const patternLabel2 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
    const patternData2 = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 6, 8, 10, 20];
    this.getChartTree(patternLabel2, patternData2, 'pattern2', 'Pattern 2');

    const patternLabel3 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
    const patternData3 = [0, 0, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 14, 15, 20];
    this.getChartTree(patternLabel3, patternData3, 'pattern3', 'Pattern 3');

    const patternLabel4 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
    const patternData4 = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1, 1, 1, 1, 1];
    this.getChartTree(patternLabel4, patternData4, 'pattern4', 'Pattern 4');

    const patternLabel5 = ["20", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "20"];
    const patternData5 = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
    this.getChartTree(patternLabel5, patternData5, 'pattern5', 'Pattern 5');

    const patternLabel6 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
    const patternData6 = [20, 10, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8];
    this.getChartTree(patternLabel6, patternData6, 'pattern6', 'Pattern 6');
  }

  private getChartTree(labels: any[], data: any[], id: string, title: string) {
    let patternCharts = new Chart(id, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Time',
          data: data,
          fill: true,
          borderColor: '#2196f3',
          backgroundColor: '#2196f3',
          borderWidth: 1
        }]
      },
      options: {
        elements: {
          point: {
            radius: 0
          }
        },
        title: {
          display: true,
          text: title
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            ticks: {
              beginAtZero: true,
              display: false
            },
            scaleLabel: {
              display: true,
              labelString: 'Time'
            }
          }],
          yAxes: [{
            gridLines: {
              display: true,
              color: 'rgba(219,219,219,0.3)',
              zeroLineColor: 'rgba(219,219,219,0.3)',
              drawBorder: false,
              lineWidth: 27,
              zeroLineWidth: 1
            },
            ticks: {
              beginAtZero: true,
              display: false
            },
            scaleLabel: {
              display: true,
              labelString: 'Failure probability'
            }
          }]
        }
      }
    });
    this.changeDetectorRef.detectChanges();
  }

  PatternTree() {
    this.FCAdata1 = [
      {
        label: "Pattern",
        type: "person",
        styleClass: this.PattenNode1,
        // node:"Node1",
        expanded: true,
        data: { name: "Are Failures caused by wear elments" },
        children: [
          {
            label: "No",
            type: "person",
            styleClass: this.PattenNode2,
            // node:"Node2",
            expanded: true,
            data: {
              name:
                "Are failures caused by envrionmental chemical or stress reaction?"
            },
            children: [
              {
                label: "No",
                type: "person",
                styleClass: this.PattenNode4,
                // node:"Node4",
                expanded: true,
                data: {
                  name:
                    "Are failures mostly random with only a few early life failures"
                },
                children: [
                  {
                    label: "Yes",
                    type: "person",
                    styleClass: this.PattenAnsNode4,
                    expanded: true,
                    data: {
                      name: "Pattern 4"
                    }
                  },
                  {
                    label: "No",
                    type: "person",
                    styleClass: this.PattenNode7,
                    // node:"Node7",
                    expanded: true,
                    data: {
                      name:
                        "Do more failures Occur Shortly after Installation repair or overhaul"
                    },
                    children: [
                      {
                        label: "Yes",
                        type: "person",
                        styleClass: this.PattenAnsNode6P1,
                        expanded: true,
                        data: {
                          name: "Pattern 6"
                        }
                      },
                      {
                        label: "No",
                        type: "person",
                        styleClass: this.PattenAnsNode5,
                        expanded: true,
                        data: {
                          name: "Pattern 5"
                        }
                      }
                    ]
                  }
                ]
              },
              {
                label: "Yes",
                type: "person",
                styleClass: this.PattenNode5,
                // node:"Node5",
                expanded: true,
                data: {
                  name:
                    "Do failures increase steadily with time but without a discernable sudden increase?"
                },
                children: [
                  {
                    label: "Yes",
                    type: "person",
                    styleClass: this.PattenAnsNode3P1,
                    expanded: true,
                    data: {
                      name: "Pattern 3"
                    }
                  },
                  {
                    label: "No",
                    type: "person",
                    styleClass: this.PattenAnsNode2P1,
                    expanded: true,
                    data: {
                      name: "Pattern 2"
                    }
                  }
                ]
              }
            ]
          },
          {
            label: "Yes",
            type: "person",
            styleClass: this.PattenNode3,
            // node:"Node3",
            expanded: true,
            data: {
              name:
                "Are failures a combination Of early life random and late life"
            },
            children: [
              {
                label: "Yes",
                type: "person",
                styleClass: this.PattenAnsNode1,
                expanded: true,
                data: {
                  name: "Pattern 1"
                }
              },
              {
                label: "No",
                type: "person",
                styleClass: this.PattenNode6,
                // node:"Node6",
                expanded: true,
                data: {
                  name:
                    "Do high Percentage failures occuer at a reasonably consistent age"
                },
                children: [
                  {
                    label: "Yes",
                    type: "person",
                    styleClass: this.PattenAnsNode2P2,
                    expanded: true,
                    data: {
                      name: "Pattern 2"
                    }
                  },
                  {
                    label: "No",
                    type: "person",
                    styleClass: this.PattenNode8,
                    expanded: true,
                    data: {
                      name:
                        "Do more failures Occur Shortly after Installation repair or overhaul"
                    },
                    children: [
                      {
                        label: "Yes",
                        type: "person",
                        styleClass: this.PattenAnsNode6P2,
                        expanded: true,
                        data: {
                          name: "Pattern 6"
                        }
                      },
                      {
                        label: "No",
                        type: "person",
                        styleClass: this.PattenAnsNode3P2,
                        expanded: true,
                        data: {
                          name: "Pattern 3"
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ];
  }



  SelectPatternForFailureMode(value: string) {
    this.Pattern = value;
    this.changeDetectorRef.detectChanges();
    this.PattenNode1 = 'p-person'
    this.PattenNode2 = 'p-person'
    this.PattenNode3 = 'p-person'
    this.PattenNode4 = 'p-person'
    this.PattenNode5 = 'p-person'
    this.PattenNode6 = 'p-person'
    this.PattenNode7 = 'p-person'
    this.PattenNode8 = 'p-person'
    this.PattenAnsNode1 = 'p-person'
    this.PattenAnsNode2P2 = 'p-person'
    this.PattenAnsNode2P1 = 'p-person'
    this.PattenAnsNode3P1 = 'p-person'
    this.PattenAnsNode3P2 = 'p-person'
    this.PattenAnsNode4 = 'p-person'
    this.PattenAnsNode5 = 'p-person'
    this.PattenAnsNode6P1 = 'p-person'
    this.PattenAnsNode6P2 = 'p-person'
    this.PatternPathEnable = false

    if (value === 'Pattern 1') {
      this.PattenNode1 = 'StylePattern'
      this.PattenNode2 = 'p-person'
      this.PattenNode3 = 'StylePattern'
      this.PattenNode4 = 'p-person'
      this.PattenNode5 = 'p-person'
      this.PattenNode6 = 'p-person'
      this.PattenNode7 = 'p-person'
      this.PattenNode8 = 'p-person'
      this.PattenAnsNode1 = 'StylePattern'
      this.changeDetectorRef.detectChanges();
      this.PatternTree()

    } else if (value === 'Pattern 2') {
      this.PatternPathEnable = true
      this.PattenNode2 = 'StylePattern1'
      this.PattenNode5 = 'StylePattern1'
      this.PattenAnsNode2P1 = 'StylePattern1'

      this.PattenNode1 = 'StylePattern'
      this.PattenNode3 = 'StylePattern2'
      this.PattenNode4 = 'p-person'
      this.PattenNode6 = 'StylePattern2'
      this.PattenNode7 = 'p-person'
      this.PattenNode8 = 'p-person'
      this.PattenAnsNode2P2 = 'StylePattern2'
      this.changeDetectorRef.detectChanges();
      this.PatternTree()



    } else if (value === 'Pattern 3') {
      this.PatternPathEnable = true
      this.PattenNode1 = 'StylePattern'
      this.PattenNode2 = 'StylePattern1'
      this.PattenNode5 = 'StylePattern1'
      this.PattenAnsNode3P1 = 'StylePattern1'
      this.PattenNode3 = 'StylePattern2'
      this.PattenNode6 = 'StylePattern2'
      this.PattenNode8 = 'StylePattern2'
      this.PattenAnsNode3P2 = 'StylePattern2'
      this.changeDetectorRef.detectChanges();
      this.PatternTree()


    } else if (value === 'Pattern 4') {
      this.PattenNode1 = 'StylePattern'
      this.PattenNode2 = 'StylePattern'
      this.PattenNode4 = 'StylePattern'
      this.PattenAnsNode4 = 'StylePattern'
      this.changeDetectorRef.detectChanges();
      this.PatternTree()

    } else if (value === 'Pattern 5') {
      this.PattenNode1 = 'StylePattern'
      this.PattenNode2 = 'StylePattern'
      this.PattenNode4 = 'StylePattern'
      this.PattenNode7 = 'StylePattern'
      this.PattenAnsNode5 = 'StylePattern'
      this.changeDetectorRef.detectChanges();
      this.PatternTree()
      this.PatternEnable = true;

    } else if (value === 'Pattern 6') {
      this.PatternPathEnable = true
      this.PattenNode1 = 'StylePattern'
      this.PattenNode2 = 'StylePattern1'
      this.PattenNode4 = 'StylePattern1'
      this.PattenNode7 = 'StylePattern1'
      this.PattenAnsNode6P1 = 'StylePattern1'

      this.PattenNode3 = 'StylePattern2'
      this.PattenNode6 = 'StylePattern2'
      this.PattenNode8 = 'StylePattern2'
      this.PattenAnsNode6P2 = 'StylePattern2'

      this.changeDetectorRef.detectChanges();
      this.PatternTree()

    } else if (value === "") {
      this.PattenNode1 = 'p-person'
      this.PattenNode2 = 'p-person'
      this.PattenNode3 = 'p-person'
      this.PattenNode4 = 'p-person'
      this.PattenNode5 = 'p-person'
      this.PattenNode6 = 'p-person'
      this.PattenNode7 = 'p-person'
      this.PattenNode8 = 'p-person'
      this.PattenAnsNode1 = 'p-person'
      this.PattenAnsNode2P2 = 'p-person'
      this.PattenAnsNode2P1 = 'p-person'
      this.PattenAnsNode3P1 = 'p-person'
      this.PattenAnsNode3P2 = 'p-person'
      this.PattenAnsNode4 = 'p-person'
      this.PattenAnsNode5 = 'p-person'
      this.PattenAnsNode6P1 = 'p-person'
      this.PattenAnsNode6P2 = 'p-person'
      this.PatternPathEnable = false
      this.Pattern = ""
      this.PatternPath = ""
      this.changeDetectorRef.detectChanges();
    }

    const element = document.querySelector("#ScrollToFCATree")
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })

  }

  ADDFMToFCA() {
    this.prescriptiveTree = false
    this.FailureModePatternTree = true

    this.PattenNode1 = 'p-person'
    this.PattenNode2 = 'p-person'
    this.PattenNode3 = 'p-person'
    this.PattenNode4 = 'p-person'
    this.PattenNode5 = 'p-person'
    this.PattenNode6 = 'p-person'
    this.PattenNode7 = 'p-person'
    this.PattenNode8 = 'p-person'
    this.PattenAnsNode1 = 'p-person'
    this.PattenAnsNode2P2 = 'p-person'
    this.PattenAnsNode2P1 = 'p-person'
    this.PattenAnsNode3P1 = 'p-person'
    this.PattenAnsNode3P2 = 'p-person'
    this.PattenAnsNode4 = 'p-person'
    this.PattenAnsNode5 = 'p-person'
    this.PattenAnsNode6P1 = 'p-person'
    this.PattenAnsNode6P2 = 'p-person'
    this.PatternPathEnable = false;
    this.Pattern = "";
    this.PatternPath = "";
    this.changeDetectorRef.detectChanges();
    this.PatternFMName = this.data1[0].children[0].children[0].children[0].data.name;
    this.PatternNextOnPrescriptiveTree = false;
    this.GetChartData();
  }
  PatternBack() {
    this.prescriptiveTree = true
    this.FailureModePatternTree = false
    if (this.PatternCounter == 0) {
      this.PatternNextOnPrescriptiveTree = true;
    }
  }

  PatternAdd() {
    if (this.Pattern === 'Pattern 2' || this.Pattern === 'Pattern 3' || this.Pattern === 'Pattern 6') {
      if ((this.Pattern === 'Pattern 2' || this.Pattern === 'Pattern 3'
        || this.Pattern === 'Pattern 6')
        && this.PatternPath != "") {
        var path, pattern
        if (this.Pattern === 'Pattern 2' && this.PatternPath == "1") {
          path = 1;
          pattern = 'Pattern 2'
        } else if (this.Pattern === 'Pattern 2' && this.PatternPath == "2") {
          path = 2;
          pattern = 'Pattern 2'
        } else if (this.Pattern === 'Pattern 3' && this.PatternPath == "1") {
          path = 1;
          pattern = 'Pattern 3'

        } else if (this.Pattern === 'Pattern 3' && this.PatternPath == "2") {
          path = 2;
          pattern = 'Pattern 3'

        } else if (this.Pattern === 'Pattern 6' && this.PatternPath == "1") {
          path = 1;
          pattern = 'Pattern 6'
        } else if (this.Pattern === 'Pattern 6' && this.PatternPath == "2") {
          path = 2;
          pattern = 'Pattern 6'
        }

        var FCATreeClone = {
          label: this.data1Clone[0].children[0].children[0].children[this.PatternCounter].label,
          type: "person",
          styleClass: 'p-person',
          editFCA: true,
          expanded: true,
          pattern: pattern,
          nodePath: path,
          data: { name: "FCA" },
          children: [
            {
              label: "Pattern",
              type: "person",
              styleClass: 'p-person',
              expanded: true,
              data: {
                name: this.Pattern
              }
            }
          ]
        }
  
  
  
        var FCATree = {
          label: this.data1Clone[0].children[0].children[0].children[this.PatternCounter].label,
          type: "person",
          styleClass: 'p-person',
          viewFCA: true,
          FCAData: FCATreeClone,
          nodePath: path,
          pattern: pattern,
          data: { name: "FCA" }
        }
  
  

        this.data1Clone[0].children[0].children[0].children[this.PatternCounter].children = []
        this.data1Clone[0].children[0].children[0].children[this.PatternCounter].children.push(
          {
            label: "Pattern",
            type: "person",
            styleClass: 'p-person',
            expanded: true,
            data: {
              name: this.Pattern
            }
          }
        )

        this.data1[0].children[0].children[0].children[this.PatternCounter].children.push(FCATree)
        if (this.PatternCounter < this.data1[0].children[0].children[0].children.length - 1) {
          this.PatternFMName = this.data1[0].children[0].children[0].children[this.PatternCounter + 1].data.name

        }
        this.PatternCounter = this.PatternCounter + 1
        if (this.PatternCounter == this.data1[0].children[0].children[0].children.length) {
          this.Pattern = ""
          this.SaveFCAEnable = true
        }
        this.FailureModePatternTree = false;
        this.prescriptiveTree = true
        this.PatternPath = ""

      } else {
        this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Please Select any one color path" })

      }

    } else if (this.Pattern === 'Pattern 1' || this.Pattern === 'Pattern 4' || this.Pattern === 'Pattern 5') {

      if (this.Pattern === 'Pattern 1') {
        path = 0;
        pattern = 'Pattern 1'

      } else if (this.Pattern === 'Pattern 4') {
        path = 0;
        pattern = 'Pattern 4'

      } else if (this.Pattern === 'Pattern 5') {
        path = 0;
        pattern = 'Pattern 5'

      }
      
      var FCATree1Clone = {
        label: this.data1Clone[0].children[0].children[0].children[this.PatternCounter].label,
        type: "person",
        styleClass: 'p-person',
        editFCA: true,
        expanded: true,
        nodePath: path,
        pattern: pattern,
        data: { name: "FCA" },
        children: [
          {
            label: "Pattern",
            type: "person",
            styleClass: 'p-person',
            expanded: true,
            data: {
              name: this.Pattern
            }
          }
        ]
      }



      var FCATree1 = {
        label: this.data1Clone[0].children[0].children[0].children[this.PatternCounter].label,
        type: "person",
        styleClass: 'p-person',
        viewFCA: true,
        FCAData: FCATree1Clone,
        nodePath: path,
        pattern: pattern,
        data: { name: "FCA" }
      }


      this.data1Clone[0].children[0].children[0].children[this.PatternCounter].children = []
      this.data1Clone[0].children[0].children[0].children[this.PatternCounter].children.push(
        {
          label: "Pattern",
          type: "person",
          styleClass: 'p-person',
          expanded: true,
          data: {
            name: this.Pattern
          }
        }
      )



      this.data1[0].children[0].children[0].children[this.PatternCounter].children.push(FCATree1)
      if (this.PatternCounter < this.data1[0].children[0].children[0].children.length - 1) {
        this.PatternFMName = this.data1[0].children[0].children[0].children[this.PatternCounter + 1].data.name

      }
      this.PatternCounter = this.PatternCounter + 1
      if (this.PatternCounter == this.data1[0].children[0].children[0].children.length) {
        this.Pattern = ""
        this.SaveFCAEnable = true
      }
      this.FailureModePatternTree = false;
      this.prescriptiveTree = true
    }
    else {
      this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Please Select any Pattern" })

    }

  }


  ADDNextFCA() {
    this.PattenNode1 = ''
    this.PattenNode2 = ''
    this.PattenNode3 = ''
    this.PattenNode4 = ''
    this.PattenNode5 = ''
    this.PattenNode6 = ''
    this.PattenNode7 = ''
    this.PattenNode8 = ''
    this.PattenAnsNode1 = ''
    this.PattenAnsNode2P2 = ''
    this.PattenAnsNode2P1 = ''
    this.PattenAnsNode3P1 = ''
    this.PattenAnsNode3P2 = ''
    this.PattenAnsNode4 = ''
    this.PattenAnsNode5 = ''
    this.PattenAnsNode6P1 = ''
    this.PattenAnsNode6P2 = ''

    this.PattenNode1 = 'p-person'
    this.PattenNode2 = 'p-person'
    this.PattenNode3 = 'p-person'
    this.PattenNode4 = 'p-person'
    this.PattenNode5 = 'p-person'
    this.PattenNode6 = 'p-person'
    this.PattenNode7 = 'p-person'
    this.PattenNode8 = 'p-person'
    this.PattenAnsNode1 = 'p-person'
    this.PattenAnsNode2P2 = 'p-person'
    this.PattenAnsNode2P1 = 'p-person'
    this.PattenAnsNode3P1 = 'p-person'
    this.PattenAnsNode3P2 = 'p-person'
    this.PattenAnsNode4 = 'p-person'
    this.PattenAnsNode5 = 'p-person'
    this.PattenAnsNode6P1 = 'p-person'
    this.PattenAnsNode6P2 = 'p-person'
    this.prescriptiveTree = false
    this.PatternNextOnPrescriptiveTree = false
    this.changeDetectorRef.detectChanges();
    this.PatternPathEnable = false
    this.FailureModePatternTree = true
    this.changeDetectorRef.detectChanges();
    this.GetChartData();
  }

  public SaveFCAEnable: boolean = false
  SaveFCA() {
    var temp: string = JSON.stringify(this.data1Clone)
    var temp2 = JSON.parse(temp)
    var centrifugalPumpOBJ: CentrifugalPumpPrescriptiveModel = new CentrifugalPumpPrescriptiveModel();
    this.data1[0].children[0].children.forEach((res: any) => {
      res.FCA = temp2
    })
    centrifugalPumpOBJ.CFPPrescriptiveId = this.CFPPrescriptiveId
    centrifugalPumpOBJ.FMWithConsequenceTree = JSON.stringify(this.data1)
    centrifugalPumpOBJ.FCAAdded = "1";

    for (let index = 0; index < this.data1[0].children[0].children[0].children.length; index++) {
      let obj = {};
      obj['CPPFMId'] = 0;
      obj['CFPPrescriptiveId'] = 0;
      obj['FunctionMode'] = "";
      obj['LocalEffect'] = "";
      obj['SystemEffect'] = "";
      obj['Consequence'] = "";
      obj['DownTimeFactor'] = 0;
      obj['ScrapeFactor'] = 0
      obj['SafetyFactor'] = 0
      obj['ProtectionFactor'] = 0
      obj['FrequencyFactor'] = 0
      obj['CriticalityFactor'] = 0
      obj['Rating'] = "";
      obj['MaintainenancePractice'] = "";
      obj['FrequencyMaintainenance'] = "";
      obj['ConditionMonitoring'] = "";
      obj['AttachmentDBPath'] = ""
      obj['AttachmentFullPath'] = ""
      obj['Remark'] = ""
      obj['Pattern'] = this.data1Clone[0].children[0].children[0].children[index].children[0].data.name
      centrifugalPumpOBJ.centrifugalPumpPrescriptiveFailureModes.push(obj)
    }

    this.http.put('api/PrescriptiveAPI/PrespectivePattern', centrifugalPumpOBJ).subscribe(
      res => {
        this.messageService.add({ severity: 'Success', summary: 'Success', detail: "Succssfully FCA Added" })
        this.SaveFCAEnable = false
        this.router.navigateByUrl('/Home/Prescriptive/List');
      }, err => console.log(err.error)
    )


  }

public FCAView : any;
public FCAViewEnabled : boolean = false

 SelectNodeToView(p){
    this.FCAView = []
    this.FCAView.push(p.FCAData)
    this.FCAViewEnabled = true
    this.changeDetectorRef.detectChanges();
    this.GetChartToView(this.FCAView[0].children[0].data.name)
    const element = document.querySelector("#FCATreeShow")
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })

  }


  GetChartToView(p : string){
    this.FCAViewEnabled = true
    if (p == 'Pattern 1') {
      const patternLabel1 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
      const patternData1 = [20, 10, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 10, 20];
      this.getChartTree(patternLabel1, patternData1, 'ViewPattern',p);
    } else if (p == 'Pattern 2') {
      const patternLabel2 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
      const patternData2 = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 6, 8, 10, 20];
      this.getChartTree(patternLabel2, patternData2, 'ViewPattern',p);
    } else if (p == 'Pattern 3') {
      const patternLabel3 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
      const patternData3 = [0, 0, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 14, 15, 20];
      this.getChartTree(patternLabel3, patternData3, 'ViewPattern',p);
    } else if (p == 'Pattern 4') {
      const patternLabel4 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
      const patternData4 = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1, 1, 1, 1, 1];
      this.getChartTree(patternLabel4, patternData4,'ViewPattern',p);
    } else if (p == 'Pattern 5') {
      const patternLabel5 = ["20", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "20"];
      const patternData5 = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
      this.getChartTree(patternLabel5, patternData5, 'ViewPattern',p);
    } else if (p == 'Pattern 6') {
      const patternLabel6 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
      const patternData6 = [20, 10, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8];
      this.getChartTree(patternLabel6, patternData6, 'ViewPattern', p);
    }
  }


  CloseView(){
    this.FCAViewEnabled = false
    const element = document.querySelector("#prescriptive")
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })

  }

}
