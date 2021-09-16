import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonLoadingDirective } from '../shared/Loading/common-loading.directive';
import { UserService } from './Services/user.services';
import { EventEmitterService } from './Services/event-emitter.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [MessageService]
})
export class HomeComponent implements OnInit {
  menuOpened: boolean = true;
  FormData: FormGroup;

  public user: any = [];
  public screwCompressor: boolean = false;
  public screwCompressorData: boolean = false;
  public centrifugalPump: boolean = false;
  public centrifugalPumpData: boolean = false;
  public report: boolean = false;
  public prescriptive: boolean = false;
  public staticEquitment: boolean = false;
  public recycleBin: boolean = false;
  public prescriptiveConfiguration: boolean = false;
  // public MenuItems: any[] = [
  //   {
  //     label: 'Dashboard',
  //     url: '#/Home/Dashboard',
  //     icon: 'pi pi-home',
  //   },
  //   {
  //     label: 'DPM-Education',
  //     url: '#/Home/Education',
  //     icon: 'pi pi-book',
  //   },
  //   {
  //     label: 'Admin',
  //     icon: 'pi pi-user',
  //     items: [
  //           {
  //             label: 'Designation',
  //             url: '#/Home/Designation'
  //           },
  //           {
  //             label: 'Staff',
  //             url: '#/Home/Staff'
  //           }
  //      ]
  //   },
  //   {
  //     label: 'Failure Mode Library',
  //     icon: 'pi pi-bookmark',
  //     items: [
  //       // {
  //       //   label: 'Asset’s list',
  //       //   items: [
  //       //     {
  //       //       label: 'User',
  //       //       url: '#/Home/FailureModesLibrary/User-Library'
  //       //     },
  //       //     {
  //       //       label: 'Filter',
  //       //       url: '#/Home/FailureModesLibrary/User-Library'
  //       //     }
  //       //   ]
  //       // },
  //       // {
  //       //   label: 'Criticality Assessment',
  //       //   url: '#/Home/FailureModesLibrary/CriticalityAssessment'
  //       // },
  //       // {
  //       //   label: 'Maintenance History',
  //       //   url: '#/Home/FailureModesLibrary/MaintenanceHistory'
  //       // },
  //       // {
  //       //   label: 'Library Of Failure',
  //       //   items: [
  //       //     {
  //       //       label: 'DPM Library',
  //       //       url: '#/Home/FailureModesLibrary/DPMLibrary'
  //       //     },
  //       //     {
  //       //       label: 'Customer Library',
  //       //       url: '#/Home/FailureModesLibrary/CustomerLibrary'
  //       //     }
  //       //   ]
  //       // },
  //       {
  //         label: 'RCA of critical failure',
  //         url: '#/Home/Prescriptive/RCA'
  //       },
  //       // {
  //       //   label: 'List credible failure modes',
  //       //   url: '#/Home/FailureModesLibrary/ListCredibleFailureModes'
  //       // },
  //     ]
  //   },
  //   {
  //     label: 'Customer database',
  //     icon: 'pi pi-users',
  //     items: [
  //       {
  //         label: 'Configuration',
  //         url: '#/Home/Compressor/ScrewConfiguration'
  //       },
  //       {
  //         label: 'Data collection',
  //         items: [
  //           // {
  //           //   label: 'Big data',
  //           //   items: [
  //           //     {
  //           //       label: 'Digital data',
  //           //       items: [
  //           //         {
  //           //           label: 'Screw Compressor',
  //           //           items: [
  //           //             {
  //           //               label: 'Train Data Upload',
  //           //               url: '#/Home/CompTrainUploadData'
  //           //             },
  //           //             {
  //           //               label: 'Prediction Data Upload',
  //           //               url: '#/Home/CompPredictionUploadData'
  //           //             }
  //           //           ]
  //           //         },
  //           //         {
  //           //           label: 'Centrifugal Pump',
  //           //           items: [
  //           //             {
  //           //               label: 'Train Data Upload',
  //           //               url: '#/Home/TrainUploadData'
  //           //             },
  //           //             {
  //           //               label: 'Prediction Data Upload',
  //           //               url: '#/Home/PredictionUploadData'
  //           //             }
  //           //           ]
  //           //         }
  //           //       ],
  //           //       // items: [
  //           //       //   {
  //           //       //     label: 'Analog data',

  //           //       //   }
  //           //       // ]
  //           //     }
  //           //   ]
  //           // },
  //           {
  //             label: 'Moderate data',
  //             items: [
  //               {
  //                 label: 'Digital data',
  //                 items: [
  //                   {
  //                     label:'Sensor Data Upload',
  //                     url: '#/Home/Compressor/SCModerateDataCollection'
  //                   },
  //                   {
  //                     label:'Field Data Upload',
  //                     url: '#/Home/Compressor/SCModerateFieldDataCollection'
  //                   },
  //                   {
  //                     label: 'Pump Data Upload',
  //                     url: '#/Home/CentrifugalPump'
  //                   }
  //                 ]
  //                 // items: [
  //                 //   {
  //                 //     label: 'Analog data',

  //                 //   }
  //                 // ]
  //               }
  //             ]
  //           },
  //           {
  //             label:'Failure History',
  //             url: '#/Home/FailureHistory'
  //           },
  //         ]
  //       },
  //       {
  //         label: 'Forecast',
  //         items: [
  //           {
  //             label: 'Big data',
  //             items: [
  //               {
  //                 label: 'Application / Machine Learning',
  //                 items: [
  //                   {
  //                     label: 'Screw Compressor',
  //                     items: [
  //                       {
  //                         label: 'Train',
  //                         url: '#/Home/Compressor/ScrewTrain'
  //                       },
  //                       {
  //                         label: 'Prediction',
  //                         url: '#/Home/Compressor/ScrewPrediction'
  //                       }
  //                     ]
  //                   },
  //                   {
  //                     label: 'Centrifugal Pump',
  //                     items: [
  //                       {
  //                         label: 'Train',
  //                         url: '#/Home/CentrifugalPumpTrain'
  //                       },
  //                       {
  //                         label: 'Prediction',
  //                         url: '#/Home/CentrifugalPumpPrediction'
  //                       }
  //                     ]
  //                   }
  //                 ]
  //               }
  //             ]
  //           },
  //           // {
  //           //   label: 'Moderate data',
  //           //   items: [
  //           //     {
  //           //       label: 'Statistical analysis'
  //           //     }
  //           //   ]
  //           // }
  //         ]
  //       }
  //     ]
  //   },
    
  //   {
  //     label: 'Criticality Assesment',
  //     icon: 'pi pi-book',
  //     items: [
  //       {
  //         label: 'Critical Asset',
  //         items: [ 
  //           {
  //             label:'RCM',
  //             url: '#/Home/Prescriptive/ADD/CA'
  //           },
  //           {
  //             label: 'CBA',
  //             url: '#/Home/CostBenefitAnalysis'
  //           }
  //         ]
  //       },
  //       {
  //         label: 'Semi Critical Asset',
  //         items: [ 
  //           {
  //             label:'FMEA',
  //             url: '#/Home/Prescriptive/ADD/SCA'
  //           },
  //           {
  //             label:'CBA',
  //             url: '#/Home/CostBenefitAnalysis'
  //           },
  //         ]
  //       },
  //       {
  //         label: 'Normal Criticality',
  //         items: [ 
  //           {
  //             label:'Weibull Analysis',
  //             url: '#/Home/WeibullAnalysis'
  //           },
  //           {
  //             label:'CBA',
  //             url: '#/Home/CostBenefitAnalysis'
  //           },
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     label: 'Strategic Analysis',
  //     icon: 'pi pi-chart-line',
  //     items: [
  //       {
  //         label: 'Develop maintenance strategy',
  //         items: [
  //           {
  //             label: 'RCM (Relaibility Centered Maintenance)',
  //             items: [
  //               {
  //                 label: 'Configuration',
  //                 url: '#/Home/Prescriptive/Configuration'
  //               },
  //               {
  //                 label: 'FMEA Add',
  //                 url: '#/Home/Prescriptive/ADD'
  //               },
  //               {
  //                 label: 'FCA Add',
  //                 url: '#/Home/Prescriptive/FCAAdd'
  //               },
  //               {
  //                 label: 'MSS Add',
  //                 url: '#/Home/Prescriptive/MSSAdd'
  //               },
  //               {
  //                 label: "Add CRAFT's",
  //                 url: '#/Home/Prescriptive/CCL'
  //               },
  //               {
  //                 label: 'Skill Library',
  //                 url: '#/Home/Prescriptive/SkillLibrary'
  //               },
  //               {
  //                 label: 'User Production Details',
  //                 url: '#/Home/Prescriptive/UPD'
  //               },
  //               {
  //                 label:'Input Data Management',
  //                 url : '#/Home/Prescriptive/InputDataManagement'
  //               },
  //               {
  //                 label: 'Display',
  //                 url: '#/Home/Prescriptive/Display'
  //               }
  //             ]
  //           },
  //           // {
  //           //   label: 'RBI (Risk Based Inspection)',
  //           // },
  //           // {
  //           //   label: 'IPF (Intrumenated Protective Function)',
  //           // },
  //           // {
  //           //   label: 'HAZOP (Hazard Operability Analysis)',
  //           // }
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     label: 'Resource Optimization',
  //     icon: 'pi pi-sitemap',
  //     items: [
  //       {
  //         label: 'APM (Assets Performance Management) Platform',
  //         items: [
  //           {
  //             label: 'Cost Benefit Analysis',
  //             items: [
  //               {
  //                 label: 'CBA Report',
  //                 url: '#/Home/CostBenefitAnalysis'
  //               },
  //               {
  //                 label: 'Constraint Management',
  //                 url: '#/Home/Constraint'
  //               },
  //               {
  //                 label: 'Alert Management',
  //                 url: '#/Home/Alert'
  //               },
  //             ]
              
  //           },
  //           {
  //             label: 'Assesment Report',
  //             url: '#/Home/Report'
  //           },
  //           // {
  //           //   label: 'Optimum Spares Analysis'
  //           // }
  //         ]
  //       },
  //       // {
  //       //   label: 'APM (Assets Performance Management) Library',
  //       //   items: [
  //       //     {
  //       //       label: 'Repair Time'
  //       //     },
  //       //     {
  //       //       label: 'Repair Cost'
  //       //     },
  //       //     {
  //       //       label: 'Resource'
  //       //     },
  //       //     {
  //       //       label: 'Special Tools'
  //       //     },
  //       //     {
  //       //       label: 'Skill Pool'
  //       //     }
  //       //   ]
  //       // }
  //     ]
  //   },
  //   {
  //     label: 'Prescriptive Maintenance',
  //     icon: 'pi pi-sliders-v',
  //     items: [
  //       {
  //         label: 'Prescriptive Recommendation',
  //         url: '#/Home/Prescriptive/List'
  //       },
  //       {
  //         label: 'Summary',
  //         url: '#/Home/Prescription'
  //       },
  //     ]
  //   },
  //   {
  //     label: 'Recycle Bin',
  //     icon: 'pi pi-trash',
  //     url: '#/Home/RecycleBin'
  //   },
  // ];
  public MenuItems : any [];
  constructor(public builder: FormBuilder,
    public http: HttpClient,
    public router: Router,
    public service: UserService,
    public messageService: MessageService,
    public eventEmitterService: EventEmitterService,
    public commonLoadingDirective: CommonLoadingDirective,
    private title: Title) {
    this.title.setTitle('Login | Dynamic Prescriptive Maintenence');
  }


  ngOnInit() {
    this.FormData = this.builder.group({
      Subject: new FormControl('', [Validators.required]),
      Email: new FormControl('', [Validators.compose([Validators.required, Validators.email])]),
      Comment: new FormControl('', [Validators.required]),
    });

    if (this.eventEmitterService.subsVar == undefined) {
      this.eventEmitterService.subsVar = this.eventEmitterService.
        invokeHomeComponentFunction.subscribe((userData: any) => {
          this.user = userData;
        });
    }
    this.UserData()
  }

 public async UserData() {
    if (localStorage.getItem('userObject') != null) {
      this.user = JSON.parse(localStorage.getItem('userObject'))
    }
    // if (this.user.UserType == 1) {
    //   this.screwCompressor = true;
    //   this.screwCompressorData = true;
    //   this.centrifugalPump = true;
    //   this.centrifugalPumpData = true;
    //   this.report = true;
    //   this.prescriptive = true;
    //   this.prescriptiveConfiguration = true;
    //   this.staticEquitment = true;
    //   this.recycleBin = true
    // } else if (this.user.UserType == 2) {
    //   this.centrifugalPump = true
    //   this.centrifugalPumpData = true;
    //   this.report = true;
    //   this.prescriptive = true;
    //   this.prescriptiveConfiguration = false;
    //   this.screwCompressor = true;
    //   this.screwCompressorData = true;
    //   this.staticEquitment = true;
    //   this.recycleBin = true
    // }
    // else if (this.user.UserType == 3) {
    //   this.centrifugalPump = true
    //   this.centrifugalPumpData = true;
    //   this.report = false;
    //   this.prescriptive = false;
    //   this.prescriptiveConfiguration = false;
    //   this.screwCompressor = false;
    //   this.screwCompressorData = false;
    //   this.staticEquitment = false;
    //   this.recycleBin = false
    // } else if (this.user.UserType == 4) {
    //   this.centrifugalPump = false
    //   this.centrifugalPumpData = false;
    //   this.report = false;
    //   this.prescriptive = true;
    //   this.prescriptiveConfiguration = false;
    //   this.recycleBin = true
    //   this.screwCompressor = false;
    //   this.screwCompressorData = false;
    //   this.staticEquitment = false;
    // }
  
    this.MenuItems = [
      this.user.Dashboard === 1 || this.user.UserType === 0 || this.user.UserType === 1  ? {
        id : 1,
        label: 'Dashboard',
        url: '#/Home/Dashboard',
        icon: 'pi pi-home',
      } : 0, 
      {
        id : 2,
        label: 'DPM-Education',
        url: '#/Home/Education',
        icon: 'pi pi-book',
      },
      this.user.UserType === 0 || this.user.UserType === 1 ?
      {
        id : 58,
        label: 'Admin',
        icon: 'pi pi-user',
        items: [
              {
                id : 3,
                label: 'Designation',
                url: '#/Home/Designation'
              },
              {
                id : 4,
                label: 'Staff',
                url: '#/Home/Staff'
              }
         ]
      } : 0,
      this.user.UserType === 0 || this.user.UserType === 1 ||this.user.RCA === 1 ?
      {
        id : 57,
        label: 'Failure Mode Library',
        icon: 'pi pi-bookmark',
        items: [
          {
            id : 5,
            label: 'RCA of critical failure',
            url: '#/Home/Prescriptive/RCA'
          },
        ]
      }:0,
      {
        id : 56,
        label: 'Customer database',
        icon: 'pi pi-users',
        items: [
          this.user.UserType === 0 || this.user.UserType === 1 ||this.user.TrainConfiguration === 1 ?
          {
            id : 6,
            label: 'Configuration',
            url: '#/Home/Compressor/ScrewConfiguration'
          }:0,
          {
            id : 55,
            label: 'Data collection',
            items: [
              // {
              //   label: 'Big data',
              //   items: [
              //     {
              //       label: 'Digital data',
              //       items: [
              //         {
              //           label: 'Screw Compressor',
              //           items: [
              //             {
              //               label: 'Train Data Upload',
              //               url: '#/Home/CompTrainUploadData'
              //             },
              //             {
              //               label: 'Prediction Data Upload',
              //               url: '#/Home/CompPredictionUploadData'
              //             }
              //           ]
              //         },
              //         {
              //           label: 'Centrifugal Pump',
              //           items: [
              //             {
              //               label: 'Train Data Upload',
              //               url: '#/Home/TrainUploadData'
              //             },
              //             {
              //               label: 'Prediction Data Upload',
              //               url: '#/Home/PredictionUploadData'
              //             }
              //           ]
              //         }
              //       ],
              //       // items: [
              //       //   {
              //       //     label: 'Analog data',
  
              //       //   }
              //       // ]
              //     }
              //   ]
              // },
              {
                id : 54,
                label: 'Moderate data',
                items: [
                  {
                    id : 53,
                    label: 'Digital data',
                    items: [
                      {
                        id : 7,
                        label:'Sensor Data Upload',
                        url: '#/Home/Compressor/SCModerateDataCollection'
                      },
                      {
                        id : 8,
                        label:'Field Data Upload',
                        url: '#/Home/Compressor/SCModerateFieldDataCollection'
                      },
                      {
                        id : 9,
                        label: 'Pump Data Upload',
                        url: '#/Home/CentrifugalPump'
                      }
                    ]
                    // items: [
                    //   {
                    //     label: 'Analog data',
  
                    //   }
                    // ]
                  }
                ]
              },
              {
                id : 10,
                label:'Failure History',
                url: '#/Home/FailureHistory'
              },
            ]
          },
          {
            id : 52,
            label: 'Forecast',
            items: [
              this.user.UserType === 0 || this.user.UserType === 1 ||this.user.ScrewTrain === 1 || this.user.ScrewPrediction === 1?
              {
                id : 51,
                label: 'Big data',
                items: [
                  {
                    id : 50,
                    label: 'Application / Machine Learning',
                    items: [
                      {
                        id : 49,
                        label: 'Screw Compressor',
                        items: [
                          this.user.UserType === 0 || this.user.UserType === 1 ||this.user.ScrewTrain === 1 ?
                          {
                            id : 11,
                            label: 'Train',
                            url: '#/Home/Compressor/ScrewTrain'
                          }:0,
                          this.user.UserType === 0 || this.user.UserType === 1 ||this.user.ScrewPrediction === 1 ?
                          {
                            id : 12,
                            label: 'Prediction',
                            url: '#/Home/Compressor/ScrewPrediction'
                          }:0
                        ]
                      },
                      {
                        id : 48,
                        label: 'Centrifugal Pump',
                        items: [
                          {
                            id : 13,
                            label: 'Train',
                            url: '#/Home/CentrifugalPumpTrain'
                          },
                          {
                            id : 14,
                            label: 'Prediction',
                            url: '#/Home/CentrifugalPumpPrediction'
                          }
                        ]
                      }
                    ]
                  }
                ]
              } : 0,
              // {
              //   label: 'Moderate data',
              //   items: [
              //     {
              //       label: 'Statistical analysis'
              //     }
              //   ]
              // }
            ]
          }
        ]
      },
      
      {
        id : 47,
        label: 'Criticality Assesment',
        icon: 'pi pi-book',
        items: [
          {
            id : 46,
            label: 'Critical Asset',
            items: [ 
              {
                id : 15,
                label:'RCM',
                url: '#/Home/Prescriptive/ADD/CA'
              },
              {
                id : 16,
                label: 'CBA',
                url: '#/Home/CostBenefitAnalysis'
              }
            ]
          },
          {
            id : 45,
            label: 'Semi Critical Asset',
            items: [ 
              {
                id : 17,
                label:'FMEA',
                url: '#/Home/Prescriptive/ADD/SCA'
              },
              {
                id : 18,
                label:'CBA',
                url: '#/Home/CostBenefitAnalysis'
              },
            ]
          },
          {
            id : 44,
            label: 'Normal Criticality',
            items: [ 
              {
                id : 19,
                label:'Weibull Analysis',
                url: '#/Home/WeibullAnalysis'
              },
              {
                id : 20,
                label:'CBA',
                url: '#/Home/CostBenefitAnalysis'
              },
            ]
          }
        ]
      },
      this.user.UserType === 0 || this.user.UserType === 1 ||this.user.RCM === 1 ||this.user.FMEA === 1 || this.user.RCMConfiguration ||this.user.CCL === 1 ||this.user.SkillLibrary === 1 ||this.user.UPD === 1  ?
      {
        id : 43,
        label: 'Strategic Analysis',
        icon: 'pi pi-chart-line',
        items: [
          {
            id : 42,
            label: 'Develop maintenance strategy',
            items: [
              {
                id : 41,
                label: 'RCM (Relaibility Centered Maintenance)',
                items: [
                  this.user.UserType === 0 || this.user.UserType === 1 || this.user.RCMConfiguration ?
                  {
                    id : 21,
                    label: 'Configuration',
                    url: '#/Home/Prescriptive/Configuration'
                  }:0,
                  this.user.UserType === 0 || this.user.UserType === 1 ||this.user.RCM === 1 ||this.user.FMEA === 1 ?
                  {
                    id : 22,
                    label: 'FMEA Add',
                    url: '#/Home/Prescriptive/ADD'
                  }:0,
                  this.user.UserType === 0 || this.user.UserType === 1 ||this.user.RCM === 1 ?
                  {
                    id : 23,
                    label: 'FCA Add',
                    url: '#/Home/Prescriptive/FCAAdd'
                  }:0,
                  this.user.UserType === 0 || this.user.UserType === 1 ||this.user.RCM === 1 ?
                  {
                    id : 24,
                    label: 'MSS Add',
                    url: '#/Home/Prescriptive/MSSAdd'
                  } :0,
                  this.user.UserType === 0 || this.user.UserType === 1 ||this.user.CCL === 1 ?
                  {
                    id : 25,
                    label: "Add CRAFT's",
                    url: '#/Home/Prescriptive/CCL'
                  }:0,
                  this.user.UserType === 0 || this.user.UserType === 1 ||this.user.SkillLibrary === 1 ?
                  {
                    id : 26,
                    label: 'Skill Library',
                    url: '#/Home/Prescriptive/SkillLibrary'
                  }:0,
                  this.user.UserType === 0 || this.user.UserType === 1 ||this.user.UPD === 1 ?
                  {
                    id : 27,
                    label: 'User Production Details',
                    url: '#/Home/Prescriptive/UPD'
                  }:0,
                  {
                    id : 28,
                    label:'Input Data Management',
                    url : '#/Home/Prescriptive/InputDataManagement'
                  },
                  {
                    id : 29,
                    label: 'Display',
                    url: '#/Home/Prescriptive/Display'
                  }
                ]
              },
              // {
              //   label: 'RBI (Risk Based Inspection)',
              // },
              // {
              //   label: 'IPF (Intrumenated Protective Function)',
              // },
              // {
              //   label: 'HAZOP (Hazard Operability Analysis)',
              // }
            ]
          }
        ]
      }:0,
      this.user.UserType === 0 || this.user.UserType === 1 ||this.user.CBA === 1 || this.user.AssesmentReport ?
      {
        id : 40,
        label: 'Resource Optimization',
        icon: 'pi pi-sitemap',
        items: [
          {
            id : 39,
            label: 'APM (Assets Performance Management) Platform',
            items: [
              this.user.UserType === 0 || this.user.UserType === 1 ||this.user.CBA === 1 ?
              {
                id : 38,
                label: 'Cost Benefit Analysis',
                items: [
                  {
                    id : 30,
                    label: 'CBA Report',
                    url: '#/Home/CostBenefitAnalysis'
                  },
                  {
                    id : 31,
                    label: 'Constraint Management',
                    url: '#/Home/Constraint'
                  },
                  {
                    id : 32,
                    label: 'Alert Management',
                    url: '#/Home/Alert'
                  },
                ]
                
              }:0,
              this.user.UserType === 0 || this.user.UserType === 1 || this.user.AssesmentReport ?
              {
                id : 33,
                label: 'Assesment Report',
                url: '#/Home/Report'
              }:0,
              // {
              //   label: 'Optimum Spares Analysis'
              // }
            ]
          },
          // {
          //   label: 'APM (Assets Performance Management) Library',
          //   items: [
          //     {
          //       label: 'Repair Time'
          //     },
          //     {
          //       label: 'Repair Cost'
          //     },
          //     {
          //       label: 'Resource'
          //     },
          //     {
          //       label: 'Special Tools'
          //     },
          //     {
          //       label: 'Skill Pool'
          //     }
          //   ]
          // }
        ]
      }:0,
      this.user.UserType === 0 || this.user.UserType === 1 ||this.user.RCM === 1 ||this.user.FMEA === 1 ?
      {
        id : 37,
        label: 'Prescriptive Maintenance',
        icon: 'pi pi-sliders-v',
        items: [
          {
            id : 34,
            label: 'Prescriptive Recommendation',
            url: '#/Home/Prescriptive/List'
          },
          {
            id : 35,
            label: 'Summary',
            url: '#/Home/Prescription'
          },
        ]
      }:0,
      {
        id : 36,
        label: 'Recycle Bin',
        icon: 'pi pi-trash',
        url: '#/Home/RecycleBin'
      },
    ];
    let a: any = this.MenuItems;
    let d : any = await this.RemoveBlankSpacesFromMenuItem(a)
    let e : any = await this.RemoveBlankSpacesFromMenuItem(d)
    this.MenuItems = [];
    this.MenuItems =e;
  }


  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/Login');
  }


  Send(FormData) {
    const email = FormData;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.commonLoadingDirective.showLoading(true, "Sending message please wait.");
    this.http.post('https://formspree.io/f/meqpvnej',
      { name: email.Subject, replyto: email.email, message: "Sender Email : " + email.Email + "  " + " Message : " + email.Comment },
      { 'headers': headers }).subscribe(
        suc => {
          console.log(suc);
          this.FormData.reset({
            'Fullname': '',
            'Email': '',
            'Comment': ''
          });
          this.messageService.add({ severity: 'success', detail: 'Message Sent Successfully' });
          this.commonLoadingDirective.showLoading(false, "");
        },
        err => {
          console.log(err);
          this.FormData.reset({
            'Fullname': '',
            'Email': '',
            'Comment': ''
          });
          this.messageService.add({ severity: 'error', detail: 'Something went Wrong !!!' });
          this.commonLoadingDirective.showLoading(false, "");
        }
      );
  }


  private async RemoveBlankSpacesFromMenuItem(r:any){
    if(r.length > 0){
       r.forEach(element => {
         if(element.items !== undefined){
          this.RemoveBlankSpacesFromMenuItem(element.items)
          if(element.item === []){
            var ii = r.findIndex(a => a.id == element.id);
             r.splice(ii,1);
          }
         }
        if(element === 0){
          var i = r.findIndex(a => a == element);
          r.splice(i,1);
        } 
       });
    }
    return r;
  }

}