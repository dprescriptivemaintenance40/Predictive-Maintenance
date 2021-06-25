import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import * as Chart from 'chart.js';
import { MessageService, TreeNode } from 'primeng/api';
import { CommonLoadingDirective } from 'src/app/shared/Loading/common-loading.directive';
import { CentrifugalPumpPrescriptiveModel } from './../../FMEA/prescriptive-add/prescriptive-model'
import * as XLSX from 'xlsx';
import { ExcelFormatService } from 'src/app/home/Services/excel-format.service';
import { PrescriptiveContantAPI } from '../../Shared/prescriptive.constant';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';

@Component({
  selector: 'app-fca-add',
  templateUrl: './fca-add.component.html',
  styleUrls: ['./fca-add.component.scss', '../../../../../assets/orgchart.scss'],
  providers: [MessageService],
})
export class FCAADDComponent implements OnInit {
  borderStyle = 'solid';
  public FCAdata1: TreeNode[];
  public FMPattern = ['Pattern 1', 'Pattern 2', 'Pattern 3', 'Pattern 4', 'Pattern 5', 'Pattern 6'];
  public Pattern: string = ""
  public PatternPathEnable: boolean = false;
  public PatternNextOnPrescriptiveTree: boolean = false;
  public FinalBack: boolean = false;
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
  public PatternAddNext: boolean = true;
  public interval: string = ""
  public intervalValue: number = 0;

  public ffInterval: string = ""
  public ffIntervalValue: number = 0;

  public FailuerRate: boolean = false
  public FailureWarning: boolean = false
  public WarningSign: boolean = false
  public IntervalDeteacting: boolean = false
  public FailuerEvident: boolean = false
  public FailuerMaintenance: boolean = false
  public FailuerComments: boolean = false

  public failuerrate: boolean = true
  public failurewarning: boolean = true
  public warningsign: boolean = true
  public intervaldeteacting: boolean = true
  public failuerevident: boolean = true
  public failuermaintenance: boolean = true
  public failuercomments: boolean = true

  public FCAFreeTextCancel1: boolean = true
  public FCAFreeTextSave1: boolean = true
  public patternaddshow: boolean = false
  public PatternFailuerAll: boolean = false
   

  public PrescriptiveTreeList: any = [];
  public TagList: any = [];
  public SelectedTagNumber: string = ""
  public SelectedPrescriptiveTree: any = [];
  public SelectBoxEnabled: boolean = false
  public FCAView: any;
  public FCAViewEnabled: boolean = false

  public FCAInterval: number = 0
  public FCAComment: any = []
  public FCACondition: any = []

  public FCAFFInterval: number = 0

  public FCAData: any = []
  public FCAFreeText: string = ""
  public Vibration: string = ""
  public Noice: string = ""
  public Leakage: string = ""
  public PerformanceDrop: string = ""
  public TempratureChange: string = ""
  public EmmisionChange: string = ""
  public IncreaseLubricantConsumption: string = ""
  public Other: string = ""

  public HumanSenses: string = ""
  public ExistingInstumentation: string = ""
  public NewInstumentation: string = ""
  public ProcessCondtions: string = ""
  public SampleAnyalysis: string = ""

  public CommentFIEYN: string = ""
  public CommentFIEYN2: string = ""

  public Interval: boolean = true;
  public Condition: boolean = true;
  public FCAFFI: boolean = true;
  public SafeUsefulLife: boolean = false
  public SafeLife: number = 0
  public UsefulLife: number = 0

  public alphaBeta: boolean = false
  public alpha: number = 0
  public beta: number = 0
  public ConsequenceFM: string = ""
  public WebalYN: string = ""

  public UpdateFCACondition: any = []
  public UpdateFCAIntervals: any = []
  public MSSLibraryJsonData: any = []

  public file: any;
  public arrayBuffer: any;
  public daysList: any;
  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }


  constructor(private messageService: MessageService,
    public title: Title,
    public router: Router,
    private excelFormatService: ExcelFormatService,
    private changeDetectorRef: ChangeDetectorRef,
    private prescriptiveBLService: CommonBLService,
    private prescriptiveContantAPI: PrescriptiveContantAPI,
    private http: HttpClient) {
    this.title.setTitle('FCA ADD | Dynamic Prescriptive Maintenence');
  }

  ngOnInit() {
    var FCAData = JSON.parse(localStorage.getItem('FCAObject'))
    this.getMSSLibraryDataInJSon();
    if (FCAData == null) {
      this.SelectBoxEnabled = true;
      this.prescriptiveTree = false;
      this.getPrescriptiveRecords()
    } else {
      this.CFPPrescriptiveId = FCAData.CFPPrescriptiveId;
      this.data1 = JSON.parse(FCAData.FMWithConsequenceTree);
      this.data1Clone = this.data1[0].children[0].children[0].Consequence;
      this.PatternTree();
      this.prescriptiveTree = true;
      this.PatternNextOnPrescriptiveTree = true;
      this.FinalBack= true;
    }
  }
  async ngOnDestroy() {
    await localStorage.removeItem('FCAObject');
  }

  BaxkToAssetList(){
    this.router.navigateByUrl('/Home/Prescriptive/List');
  }
  async getPrescriptiveRecords() {
    this.SelectBoxEnabled = true;
    var url: string = this.prescriptiveContantAPI.PrescriptiveRecordsForFCA
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
          this.SelectedPrescriptiveTree.push(res)
          this.CFPPrescriptiveId = res.CFPPrescriptiveId;
          this.data1 = JSON.parse(res.FMWithConsequenceTree)
          this.data1Clone = this.data1[0].children[0].children[0].Consequence;
          this.prescriptiveTree = true;
          this.SelectBoxEnabled = false
          this.PatternTree();
          this.PatternNextOnPrescriptiveTree = true;
          this.FinalBack = true;
        }
      });
    }
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
    var e: string = 'L10';
    this.SafeLifeCalculation(e);
    this.PatternNextOnPrescriptiveTree = false;
    this.GetChartData();
    this.ConsequenceFM = this.data1[0].children[0].children[0].children[this.PatternCounter].children[0].children[2].data.name
    if (this.ConsequenceFM == 'A (Failure Mode:Hidden, Failure Mode with Condition : Combined with one or other failure mode events, Failure Mode Consequences : Safety and/or environmental hazard))' || this.ConsequenceFM == 'B (Failure Mode:Evident, Failure Mode with Condition : Direct only, Failure Mode Consequences : Safety and/or environmental hazard)') {
      this.UsefulLife = 0;
    } else if (this.ConsequenceFM == 'D (Failure Mode:Evident, Failure Mode with Condition : Direct only, Failure Mode Consequences : No effect on safety or environment operation)' || this.ConsequenceFM == 'E (Failure Mode:Hidden, Failure Mode with Condition : Combined with one or other failure mode events, Failure Mode Consequences : No effect on safety or environment)' || this.ConsequenceFM == 'C (Failure Mode:Evident, Failure Mode with Condition : Direct only, Failure Mode Consequences : Operational capability adversly affected but no effect on safety or environment)') {
      this.SafeLife = 0;
    }
  }
  PatternBack() {
    this.prescriptiveTree = true
    this.FailureModePatternTree = false
    this.PatternAddNext = false
    if (this.PatternCounter == 0) {
      this.PatternNextOnPrescriptiveTree = true;
    }
    this.PatternAddNext = false
  }

  async PatternSave() {
    if (this.Pattern === 'Pattern 1' || this.Pattern === 'Pattern 2' || this.Pattern === 'Pattern 3' || this.Pattern === 'Pattern 4' || this.Pattern === 'Pattern 5' || this.Pattern === 'Pattern 6') {
      this.FailuerRate = true
      this.FailureWarning = true
      this.FailureWarning = true
      this.WarningSign = true
      this.IntervalDeteacting = true
      this.FailuerEvident = true
      this.FailuerMaintenance = true
      this.FailuerComments = true
      this.FailureModePatternTree = true
      this.changeDetectorRef.detectChanges()
      this.failuerrate = !this.failuerrate;
      const element = document.querySelector("#PatternTree2")
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Please Select One of these Pattern" })
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

        let SUNode = {}

        if (this.ConsequenceFM == 'A (Failure Mode:Hidden, Failure Mode with Condition : Combined with one or other failure mode events, Failure Mode Consequences : Safety and/or environmental hazard)' || this.ConsequenceFM == 'B (Failure Mode:Evident, Failure Mode with Condition : Direct only, Failure Mode Consequences : Safety and/or environmental hazard)') {
          this.UsefulLife = 0;
          SUNode = {
            label: "SafeLife",
            type: "person",
            styleClass: 'p-person',
            expanded: true,
            data: {
              name: this.SafeLife
            }
          }
        } else if (this.ConsequenceFM == 'D (Failure Mode:Evident, Failure Mode with Condition : Direct only, Failure Mode Consequences : No effect on safety or environment operation)' || this.ConsequenceFM == 'E (Failure Mode:Hidden, Failure Mode with Condition : Combined with one or other failure mode events, Failure Mode Consequences : No effect on safety or environment)' || this.ConsequenceFM == 'C (Failure Mode:Evident, Failure Mode with Condition : Direct only, Failure Mode Consequences : Operational capability adversly affected but no effect on safety or environment)') {
          this.SafeLife = 0;
          SUNode = {
            label: "UsefulLife",
            type: "person",
            styleClass: 'p-person',
            expanded: true,
            data: {
              name: this.UsefulLife
            }
          }
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
            },
            {
              label: "Condition",
              type: "person",
              styleClass: 'p-person',
              expanded: true,
              data: {
                name: this.FCACondition
              }
            },
            {
              label: "Interval",
              type: "person",
              styleClass: 'p-person',
              expanded: true,
              data: {
                name: `${this.FCAInterval}${" "}${"Hours"}`
              }
            },
            {
              label: "FFI",
              type: "person",
              styleClass: 'p-person',
              expanded: true,
              data: {
                name: `${this.FCAFFInterval}${" "}${"Hours"}`
              }
            },
            {
              label: "Alpha",
              type: "person",
              styleClass: 'p-person',
              expanded: true,
              data: {
                name: this.alpha.toFixed(2)
              }
            },
            {
              label: "Beta",
              type: "person",
              styleClass: 'p-person',
              expanded: true,
              data: {
                name: this.beta.toFixed(2)
              }
            },
            SUNode,

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

        let obj = {};
        obj['FCACondition'] = this.FCACondition;
        obj['FCAInterval'] = this.FCAInterval;
        obj['FCAFFI'] = this.FCAFFInterval
        obj['FCAComment'] = this.FCAComment;
        obj['FCAAlpha'] = this.alpha.toFixed(2);
        obj['FCABeta'] = this.beta.toFixed(2);
        obj['FCASafeLife'] = this.SafeLife
        obj['FCAUsefulLife'] = this.UsefulLife;
        obj['FCAUpdateIntervals'] = this.UpdateFCAIntervals;
        obj['FCAUpdateConditions'] = this.UpdateFCACondition;

        this.UpdateFCACondition = []
        this.UpdateFCAIntervals = []

        this.FCAData.push(obj)
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
          },
          {
            label: "Condition",
            type: "person",
            styleClass: 'p-person',
            expanded: true,
            data: {
              name: this.FCACondition
            }
          },
          {
            label: "Interval",
            type: "person",
            styleClass: 'p-person',
            expanded: true,
            data: {
              name: `${this.FCAInterval}${" "}${"Hours"}`
            }
          },
          {
            label: "FFI",
            type: "person",
            styleClass: 'p-person',
            expanded: true,
            data: {
              name: `${this.FCAFFInterval}${" "}${"Hours"}`
            }
          },
          {
            label: "Alpha",
            type: "person",
            styleClass: 'p-person',
            expanded: true,
            data: {
              name: this.alpha.toFixed(2)
            }
          },
          {
            label: "Beta",
            type: "person",
            styleClass: 'p-person',
            expanded: true,
            data: {
              name: this.beta.toFixed(2)
            }
          },
          SUNode,
        )


        this.FCAFFInterval = 0
        this.FCAInterval = 0
        this.FCAComment = []
        this.FCACondition = []
        this.FCAFreeText = ""
        this.Vibration = ""
        this.Noice = ""
        this.Leakage = ""
        this.PerformanceDrop = ""
        this.TempratureChange = ""
        this.EmmisionChange = ""
        this.IncreaseLubricantConsumption = ""
        this.Other = ""
        this.HumanSenses = ""
        this.ExistingInstumentation = ""
        this.NewInstumentation = ""
        this.ProcessCondtions = ""
        this.SampleAnyalysis = ""
        this.CommentFIEYN = ""
        this.CommentFIEYN2 = ""
        this.interval = ""
        this.intervalValue = 0
        this.ffInterval = ""
        this.ffIntervalValue = 0
        this.failuerrate = true
        this.failurewarning = true
        this.warningsign = true
        this.intervaldeteacting = true
        this.failuerevident = true
        this.failuermaintenance = true
        this.failuercomments = true

        this.FailuerRate = false
        this.FailureWarning = false
        this.WarningSign = false
        this.IntervalDeteacting = false
        this.FailuerEvident = false
        this.FailuerMaintenance = false
        this.FailuerComments = false

        this.alpha = 0;
        this.beta = 0;
        this.SafeLife = 0
        this.UsefulLife = 0;
        this.alphaBeta = false;
        this.SafeUsefulLife = false;
        this.ConsequenceFM = ""
        this.WebalYN = ""
        this.patternaddshow = false

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

      let SUNode = {}

      if (this.ConsequenceFM == 'A (Failure Mode:Hidden, Failure Mode with Condition : Combined with one or other failure mode events, Failure Mode Consequences : Safety and/or environmental hazard)' || this.ConsequenceFM == 'B (Failure Mode:Evident, Failure Mode with Condition : Direct only, Failure Mode Consequences : Safety and/or environmental hazard)') {
        this.UsefulLife = 0;
        SUNode = {
          label: "SafeLife",
          type: "person",
          styleClass: 'p-person',
          expanded: true,
          data: {
            name: this.SafeLife
          }
        }
      } else if (this.ConsequenceFM == 'D (Failure Mode:Evident, Failure Mode with Condition : Direct only, Failure Mode Consequences : No effect on safety or environment operation)' || this.ConsequenceFM == 'E (Failure Mode:Hidden, Failure Mode with Condition : Combined with one or other failure mode events, Failure Mode Consequences : No effect on safety or environment)' || this.ConsequenceFM == 'C (Failure Mode:Evident, Failure Mode with Condition : Direct only, Failure Mode Consequences : Operational capability adversly affected but no effect on safety or environment)') {
        this.SafeLife = 0
        SUNode = {
          label: "UsefulLife",
          type: "person",
          styleClass: 'p-person',
          expanded: true,
          data: {
            name: this.UsefulLife
          }
        }
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
          },
          {
            label: "Condition",
            type: "person",
            styleClass: 'p-person',
            expanded: true,
            data: {
              name: this.FCACondition
            }
          },
          {
            label: "Interval",
            type: "person",
            styleClass: 'p-person',
            expanded: true,
            data: {
              name: `${this.FCAInterval}${" "}${"Hours"}`
            }
          },
          {
            label: "FFI",
            type: "person",
            styleClass: 'p-person',
            expanded: true,
            data: {
              name: `${this.FCAFFInterval}${" "}${"Hours"}`
            }
          },
          {
            label: "Alpha",
            type: "person",
            styleClass: 'p-person',
            expanded: true,
            data: {
              name: this.alpha.toFixed(2)
            }
          },
          {
            label: "Beta",
            type: "person",
            styleClass: 'p-person',
            expanded: true,
            data: {
              name: this.beta.toFixed(2)
            }
          },
          SUNode,
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
      let obj = {};
      obj['FCACondition'] = this.FCACondition;
      obj['FCAInterval'] = this.FCAInterval;
      obj['FCAFFI'] = this.FCAFFInterval
      obj['FCAComment'] = this.FCAComment;
      obj['FCAAlpha'] = this.alpha.toFixed(2);
      obj['FCABeta'] = this.beta.toFixed(2);
      obj['FCASafeLife'] = this.SafeLife
      obj['FCAUsefulLife'] = this.UsefulLife;
      obj['FCAUpdateIntervals'] = this.UpdateFCAIntervals;
      obj['FCAUpdateConditions'] = this.UpdateFCACondition;

      this.UpdateFCACondition = []
      this.UpdateFCAIntervals = []

      this.FCAData.push(obj)

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
        },
        {
          label: "Condition",
          type: "person",
          styleClass: 'p-person',
          expanded: true,
          data: {
            name: this.FCACondition
          }
        },
        {
          label: "Interval",
          type: "person",
          styleClass: 'p-person',
          expanded: true,
          data: {
            name: `${this.FCAInterval}${" "}${"Hours"}`
          }
        },
        {
          label: "FFI",
          type: "person",
          styleClass: 'p-person',
          expanded: true,
          data: {
            name: `${this.FCAFFInterval}${" "}${"Hours"}`
          }
        },
        {
          label: "Alpha",
          type: "person",
          styleClass: 'p-person',
          expanded: true,
          data: {
            name: this.alpha.toFixed(2)
          }
        },
        {
          label: "Beta",
          type: "person",
          styleClass: 'p-person',
          expanded: true,
          data: {
            name: this.beta.toFixed(2)
          }
        },
        SUNode,
      )
      this.FCAFFInterval = 0
      this.FCAInterval = 0
      this.FCAComment = []
      this.FCACondition = []
      this.FCAFreeText = ""
      this.Vibration = ""
      this.Noice = ""
      this.Leakage = ""
      this.PerformanceDrop = ""
      this.TempratureChange = ""
      this.EmmisionChange = ""
      this.IncreaseLubricantConsumption = ""
      this.Other = ""
      this.HumanSenses = ""
      this.ExistingInstumentation = ""
      this.NewInstumentation = ""
      this.ProcessCondtions = ""
      this.SampleAnyalysis = ""
      this.CommentFIEYN = ""
      this.CommentFIEYN2 = ""
      this.interval = ""
      this.intervalValue = 0
      this.ffInterval = ""
      this.ffIntervalValue = 0
      this.failuerrate = true
      this.failurewarning = true
      this.warningsign = true
      this.intervaldeteacting = true
      this.failuerevident = true
      this.failuermaintenance = true
      this.failuercomments = true

      this.FailuerRate = false
      this.FailureWarning = false
      this.WarningSign = false
      this.IntervalDeteacting = false
      this.FailuerEvident = false
      this.FailuerMaintenance = false
      this.FailuerComments = false

      this.alpha = 0;
      this.beta = 0;
      this.SafeLife = 0
      this.UsefulLife = 0;
      this.alphaBeta = false;
      this.SafeUsefulLife = false;
      this.ConsequenceFM = ""
      this.WebalYN = ""
      this.patternaddshow = false

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
    const element = document.querySelector("#PatternFailuerComments")
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })

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
    this.ConsequenceFM = this.data1[0].children[0].children[0].children[this.PatternCounter].children[0].children[2].data.name
    if (this.ConsequenceFM == 'A (Failure Mode:Hidden, Failure Mode with Condition : Combined with one or other failure mode events, Failure Mode Consequences : Safety and/or environmental hazard)' || this.ConsequenceFM == 'B (Failure Mode:Evident, Failure Mode with Condition : Direct only, Failure Mode Consequences : Safety and/or environmental hazard)') {
      this.UsefulLife = 0;
    } else if (this.ConsequenceFM == 'D (Failure Mode:Evident, Failure Mode with Condition : Direct only, Failure Mode Consequences : No effect on safety or environment operation)' || this.ConsequenceFM == 'E (Failure Mode:Hidden, Failure Mode with Condition : Combined with one or other failure mode events, Failure Mode Consequences : No effect on safety or environment))' || this.ConsequenceFM == 'C (Failure Mode:Evident, Failure Mode with Condition : Direct only, Failure Mode Consequences : Operational capability adversly affected but no effect on safety or environment)') {
      this.SafeLife = 0;
    }
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
      obj['FCACondition'] = JSON.stringify(this.FCAData[index].FCACondition)
      obj['FCAInterval'] = this.FCAData[index].FCAInterval
      obj['FCAFFI'] = this.FCAData[index].FCAFFI
      obj['FCAComment'] = JSON.stringify(this.FCAData[index].FCAComment)
      obj['FCAAlpha'] = this.FCAData[index].FCAAlpha;
      obj['FCABeta'] = this.FCAData[index].FCABeta;
      obj['FCASafeLife'] = this.FCAData[index].FCASafeLife
      obj['FCAUsefulLife'] = this.FCAData[index].FCAUsefulLife
      obj['FCAUpdateIntervals'] = JSON.stringify(this.FCAData[index].FCAUpdateIntervals)
      obj['FCAUpdateConditions'] = JSON.stringify(this.FCAData[index].FCAUpdateConditions)
      centrifugalPumpOBJ.centrifugalPumpPrescriptiveFailureModes.push(obj)
    }
    var url: string = this.prescriptiveContantAPI.FCASave
    this.prescriptiveBLService.PutData(url, centrifugalPumpOBJ).subscribe(
      res => {
        this.messageService.add({ severity: 'Success', summary: 'Success', detail: "Succssfully FCA Added" })
        this.SaveFCAEnable = false
        this.router.navigateByUrl('/Home/Prescriptive/List');
      }, err => console.log(err.error)
    )

    const element = document.querySelector("#PatternFailuerComments")
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })

  }



  async SelectNodeToView(p) {
    this.FCAView = []
    this.FCAView.push(p.FCAData)
    this.FCAViewEnabled = true
    this.changeDetectorRef.detectChanges();
    this.GetChartToView(this.FCAView[0].children[0].data.name)
    const element = document.querySelector("#ScrollToFCATree1")
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }


  GetChartToView(p: string) {
    this.FCAViewEnabled = true
    if (p == 'Pattern 1') {
      const patternLabel1 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
      const patternData1 = [20, 10, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 10, 20];
      this.getChartTree(patternLabel1, patternData1, 'ViewPattern', p);
    } else if (p == 'Pattern 2') {
      const patternLabel2 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
      const patternData2 = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 6, 8, 10, 20];
      this.getChartTree(patternLabel2, patternData2, 'ViewPattern', p);
    } else if (p == 'Pattern 3') {
      const patternLabel3 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
      const patternData3 = [0, 0, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 14, 15, 20];
      this.getChartTree(patternLabel3, patternData3, 'ViewPattern', p);
    } else if (p == 'Pattern 4') {
      const patternLabel4 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
      const patternData4 = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1, 1, 1, 1, 1];
      this.getChartTree(patternLabel4, patternData4, 'ViewPattern', p);
    } else if (p == 'Pattern 5') {
      const patternLabel5 = ["20", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "3", "20"];
      const patternData5 = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
      this.getChartTree(patternLabel5, patternData5, 'ViewPattern', p);
    } else if (p == 'Pattern 6') {
      const patternLabel6 = ["20", "10", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "10", "20"];
      const patternData6 = [20, 10, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8];
      this.getChartTree(patternLabel6, patternData6, 'ViewPattern', p);
    }
  }


  CloseView() {
    this.FCAViewEnabled = false
    const element = document.querySelector("#prescriptive")
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })

  }

  IntervalSave() {
    var FCAIntervalDWY: any, FCAIntervalDWYValues: any;
    if (this.interval != "" && this.intervalValue != 0) {
      if (this.interval == 'Days') {
        FCAIntervalDWY = 'Days';
        FCAIntervalDWYValues = this.intervalValue;
        this.UpdateFCAIntervals.push({ FCAIntervalDWY })
        this.UpdateFCAIntervals.push({ FCAIntervalDWYValues })
        this.FCAInterval = this.intervalValue * 1 * 24
      } else if (this.interval == 'Week') {
        this.FCAInterval = this.intervalValue * 7 * 24
        FCAIntervalDWY = 'Week';
        FCAIntervalDWYValues = this.intervalValue;
        this.UpdateFCAIntervals.push({ FCAIntervalDWY })
        this.UpdateFCAIntervals.push({ FCAIntervalDWYValues })
      } else if (this.interval == 'Month') {
        FCAIntervalDWY = 'Month';
        FCAIntervalDWYValues = this.intervalValue;
        this.UpdateFCAIntervals.push({ FCAIntervalDWY })
        this.UpdateFCAIntervals.push({ FCAIntervalDWYValues })
        this.FCAInterval = this.intervalValue * 30 * 24
      } else if (this.interval == 'Year') {
        FCAIntervalDWY = 'Year';
        FCAIntervalDWYValues = this.intervalValue;
        this.UpdateFCAIntervals.push({ FCAIntervalDWY })
        this.UpdateFCAIntervals.push({ FCAIntervalDWYValues })
        this.FCAInterval = this.intervalValue * 365 * 24
      }

      this.changeDetectorRef.detectChanges()
      this.failurewarning = !this.failurewarning;

      const element = document.querySelector("#Patternfailurewarning")
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Interval value is missing" })
    }
  }


  ConditionFirst() {
    if (this.Vibration != "" || this.Noice != "" || this.Leakage != "" || this.PerformanceDrop != "" || this.TempratureChange != "" || this.EmmisionChange != "" || this.IncreaseLubricantConsumption != "" || this.Other) {
      var Vibration: string = "", Noice: string = "", Leakage: string = "",
        PerformanceDrop: string = "", TempratureChange: string = "",
        EmmisionChange: string = "", IncreaseLubricantConsumption: string = "",
        Other: string = "";

      Vibration = this.Vibration
      Noice = this.Noice
      Leakage = this.Leakage
      PerformanceDrop = this.PerformanceDrop
      TempratureChange = this.TempratureChange
      EmmisionChange = this.EmmisionChange
      IncreaseLubricantConsumption = this.IncreaseLubricantConsumption
      Other = this.Other

      if (this.Vibration != "") {
        this.Vibration = "Vibration"
        Vibration = "Vibration"
        this.FCACondition.push(this.Vibration)
      }
      if (this.Noice != "") {
        this.Noice = "Noice"
        Noice = "Noice"
        this.FCACondition.push(this.Noice)
      }
      if (this.Leakage != "") {
        this.Leakage = "Leakage"
        this.FCACondition.push(this.Leakage)
        Leakage = "Leakage"

      }
      if (this.PerformanceDrop != "") {
        this.PerformanceDrop = "Performance Drop"
        this.FCACondition.push(this.PerformanceDrop)
        PerformanceDrop = "Performance Drop"
      }
      if (this.TempratureChange != "") {
        this.TempratureChange = "Temprature Change"
        this.FCACondition.push(this.TempratureChange)
        TempratureChange = "Temprature Change"
      }
      if (this.EmmisionChange != "") {
        this.EmmisionChange = "Emmision Change"
        this.FCACondition.push(this.EmmisionChange)
        EmmisionChange = "Emmision Change"
      }
      if (this.IncreaseLubricantConsumption != "") {
        this.IncreaseLubricantConsumption = "Increase Lubricant Consumption"
        this.FCACondition.push(this.IncreaseLubricantConsumption)
        IncreaseLubricantConsumption = "Increase Lubricant Consumption"
      }
      if (this.Other != "") {
        this.Other = "Other"
        this.FCACondition.push(this.Other)
        Other = "Other"
      }

      this.UpdateFCACondition.push({ Vibration })
      this.UpdateFCACondition.push({ Noice })
      this.UpdateFCACondition.push({ Leakage })
      this.UpdateFCACondition.push({ PerformanceDrop })
      this.UpdateFCACondition.push({ TempratureChange })
      this.UpdateFCACondition.push({ EmmisionChange })
      this.UpdateFCACondition.push({ IncreaseLubricantConsumption })
      this.UpdateFCACondition.push({ Other })

      this.changeDetectorRef.detectChanges()
      this.warningsign = !this.warningsign;

      const element = document.querySelector("#PatternWarningSign")
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    else {
      this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Prior warnings before the failure occure are missing" })
    }

  }

  ConditionSecond() {
    if (this.HumanSenses != "" || this.ExistingInstumentation != "" || this.NewInstumentation != "" || this.ProcessCondtions != "" || this.SampleAnyalysis != "") {

      var HumanSenses: string = "", ExistingInstumentation: string = "", NewInstumentation: string = "", ProcessCondtions: string = "", SampleAnyalysis: string = ""
      HumanSenses = this.HumanSenses
      ExistingInstumentation = this.ExistingInstumentation
      NewInstumentation = this.NewInstumentation
      ProcessCondtions = this.ProcessCondtions
      SampleAnyalysis = this.SampleAnyalysis
      if (this.HumanSenses != "") {
        this.HumanSenses = "Human Senses"
        HumanSenses = "Human Senses"
        this.FCACondition.push(this.HumanSenses)

      }
      if (this.ExistingInstumentation != "") {
        this.ExistingInstumentation = "Existing Instumentation(portable or fixed)"
        ExistingInstumentation = "Existing Instumentation(portable or fixed)"
        this.FCACondition.push(this.ExistingInstumentation)

      }
      if (this.NewInstumentation != "") {
        this.NewInstumentation = "New Instumentation(portable or fixed)"
        NewInstumentation = "New Instumentation(portable or fixed)"
        this.FCACondition.push(this.NewInstumentation)

      }
      if (this.ProcessCondtions != "") {
        this.ProcessCondtions = "Process Condtions"
        ProcessCondtions = "Process Condtions"
        this.FCACondition.push(this.ProcessCondtions)
      }
      if (this.SampleAnyalysis != "") {
        this.SampleAnyalysis = "Sample Anyalysis"
        SampleAnyalysis = "Sample Anyalysis"
        this.FCACondition.push(this.SampleAnyalysis)
      }


      this.UpdateFCACondition.push({ HumanSenses })
      this.UpdateFCACondition.push({ ExistingInstumentation })
      this.UpdateFCACondition.push({ NewInstumentation })
      this.UpdateFCACondition.push({ ProcessCondtions })
      this.UpdateFCACondition.push({ SampleAnyalysis })

      this.changeDetectorRef.detectChanges()
      this.intervaldeteacting = !this.intervaldeteacting;
      const element = document.querySelector("#PatternIntervalDeteacting")
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Warning signs are missing" })
    }

  }

  FFInterval() {
    var FCAFFIIntervalDWY: any, FCAFFIIntervalDWYValues: any;

    if (this.ffInterval != "" && this.ffIntervalValue != 0) {

      if (this.ffInterval == 'Days') {
        FCAFFIIntervalDWY = 'Days';
        FCAFFIIntervalDWYValues = this.ffIntervalValue;
        this.UpdateFCAIntervals.push({ FCAFFIIntervalDWY })
        this.UpdateFCAIntervals.push({ FCAFFIIntervalDWYValues })
        this.FCAFFInterval = this.ffIntervalValue * 1 * 24
      } else if (this.ffInterval == 'Week') {
        FCAFFIIntervalDWY = 'Week';
        FCAFFIIntervalDWYValues = this.ffIntervalValue;
        this.UpdateFCAIntervals.push({ FCAFFIIntervalDWY })
        this.UpdateFCAIntervals.push({ FCAFFIIntervalDWYValues })
        this.FCAFFInterval = this.ffIntervalValue * 7 * 24
      } else if (this.ffInterval == 'Month') {
        FCAFFIIntervalDWY = 'Month';
        FCAFFIIntervalDWYValues = this.ffIntervalValue;
        this.UpdateFCAIntervals.push({ FCAFFIIntervalDWY })
        this.UpdateFCAIntervals.push({ FCAFFIIntervalDWYValues })
        this.FCAFFInterval = this.ffIntervalValue * 30 * 24
      } else if (this.ffInterval == 'Year') {
        FCAFFIIntervalDWY = 'Year';
        FCAFFIIntervalDWYValues = this.ffIntervalValue;
        this.UpdateFCAIntervals.push({ FCAFFIIntervalDWY })
        this.UpdateFCAIntervals.push({ FCAFFIIntervalDWYValues })
        this.FCAFFInterval = this.ffIntervalValue * 365 * 24
      }


      this.changeDetectorRef.detectChanges()
      this.failuerevident = !this.failuerevident;
      const element = document.querySelector("#PatternFailuerEvident")
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      this.messageService.add({ severity: 'warn', summary: 'warn', detail: "FFIInterval is missing" })
    }

  }

  CommentThird() {
    if (this.CommentFIEYN.length > 0) {
      this.FCAComment.push(this.CommentFIEYN)
      this.changeDetectorRef.detectChanges()
      this.failuermaintenance = !this.failuermaintenance;
      const element = document.querySelector("#PatternFailuerMaintenance")
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      this.messageService.add({ severity: 'warn', summary: 'warn', detail: "fill the data" })
    }

  }

  CommentFourth() {
    this.FCAComment.push(this.CommentFIEYN2)
    if (this.CommentFIEYN2.length > 0 && this.CommentFIEYN2.length > 0) {
      this.changeDetectorRef.detectChanges()
      this.failuercomments = !this.failuercomments;
      const element = document.querySelector("#PatternFailuerComments")
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      this.messageService.add({ severity: 'warn', summary: 'warn', detail: "fill the data" })
    }

  }

  async FCAFreeTextSave() {
    this.PatternFailuerAll = true
    this.FCAComment.push(this.FCAFreeText)
    this.SafeUsefulLife = true;
    this.changeDetectorRef.detectChanges()
    const element = document.querySelector("#SafeUsefulLife")
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  async FCAFreeTextCancel() {
    this.PatternFailuerAll = true
    this.FCAFreeText = ""
    this.alphaBeta = true
    this.SafeUsefulLife = !this.SafeUsefulLife;
    this.changeDetectorRef.detectChanges();
    const element = document.querySelector("#alphaBeta")
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })

  }


  Webal(event) {
    this.file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary", cellDates: true });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
      this.daysList = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      var Data: any = []
      this.daysList.forEach(element => {
        Data.push(element.Days)
      });
      var url: string = this.prescriptiveContantAPI.FCAWebal
      this.prescriptiveBLService.postWithHeaders(url, Data).subscribe(
        (res: any) => {
          this.alpha = res.alpha;
          this.beta = res.beta;
          this.changeDetectorRef.detectChanges();
        }, err => { console.log(err.error) }
      )
    }

  }


  async SafeUsefulLifeSave() {
    if (this.WebalYN == 'YES' || this.WebalYN == 'No') {
      if (this.WebalYN == 'YES') {
        this.alphaBeta = true
        this.alpha = 0;
        this.beta = 0;
        this.changeDetectorRef.detectChanges();
        const element = document.querySelector("#alphaBeta")
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        this.patternaddshow = true
        this.changeDetectorRef.detectChanges();
        const element = document.querySelector("#ScrollToFCATree")
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })

      }
    } else {
      this.messageService.add({ severity: 'warn', summary: 'warn', detail: "Please choose Yes or No for webal analysis" })
    }
  }

  async alphaBetaSave() {
    this.patternaddshow = true
    this.changeDetectorRef.detectChanges();
    const element = document.querySelector("#ScrollToFCATree")
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })

  }

  ExcelDownload() {
    var ColumnsData: any = ["Days"];
    this.excelFormatService.GetExcelFormat(ColumnsData, 'Webal_Days_Format')
  }

  getMSSLibraryDataInJSon() {
    this.http.get<any>('dist/DPM/assets/MSS_Library/mss_library.json').subscribe(
      res => {
        this.MSSLibraryJsonData = res;
      }, error => { console.log(error.error) }
    )
  }

  SafeLifeCalculation(e) {
    var FMName = this.PatternFMName;
    var dataFromLibrary = this.MSSLibraryJsonData.find(a => a['name'] === FMName);
    var MTBF: number = dataFromLibrary.mtbf;
    if (e === 'L10') {
      var cal: any = - MTBF * Math.log(0.9)
      this.SafeLife = cal.toFixed(2)
    } else if (e === 'L20') {
      var cal: any = - MTBF * Math.log(0.8)
      this.SafeLife = cal.toFixed(2)
    }
  }

}
