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
  public MenuItems: any[] = [
    {
      label: 'Dashboard',
      url: '#/Home/Dashboard'
    },
    {
      label: 'DPM-Education',
      url: '#/Home/Education',
      icon: 'pi pi-book',
    },
    {
      label: 'Failure Mode Library',
      icon: 'pi pi-bookmark',
      items: [
        // {
        //   label: 'Asset’s list',
        //   items: [
        //     {
        //       label: 'User',
        //       url: '#/Home/FailureModesLibrary/User-Library'
        //     },
        //     {
        //       label: 'Filter',
        //       url: '#/Home/FailureModesLibrary/User-Library'
        //     }
        //   ]
        // },
        // {
        //   label: 'Criticality Assessment',
        //   url: '#/Home/FailureModesLibrary/CriticalityAssessment'
        // },
        // {
        //   label: 'Maintenance History',
        //   url: '#/Home/FailureModesLibrary/MaintenanceHistory'
        // },
        // {
        //   label: 'Library Of Failure',
        //   items: [
        //     {
        //       label: 'DPM Library',
        //       url: '#/Home/FailureModesLibrary/DPMLibrary'
        //     },
        //     {
        //       label: 'Customer Library',
        //       url: '#/Home/FailureModesLibrary/CustomerLibrary'
        //     }
        //   ]
        // },
        {
          label: 'RCA of critical failure',
          url: '#/Home/Prescriptive/RCA'
        },
        // {
        //   label: 'List credible failure modes',
        //   url: '#/Home/FailureModesLibrary/ListCredibleFailureModes'
        // },
      ]
    },
    {
      label: 'Customer database',
      icon: 'pi pi-users',
      items: [
        {
          label: 'Configuration',
          url: '#/Home/Compressor/ScrewConfiguration'
        },
        {
          label: 'Data collection',
          items: [
            {
              label: 'Big data',
              items: [
                {
                  label: 'Digital data',
                  items: [
                    {
                      label: 'Screw Compressor',
                      items: [
                        {
                          label: 'Train Data Upload',
                          url: '#/Home/CompTrainUploadData'
                        },
                        {
                          label: 'Prediction Data Upload',
                          url: '#/Home/CompPredictionUploadData'
                        }
                      ]
                    },
                    {
                      label: 'Centrifugal Pump',
                      items: [
                        {
                          label: 'Train Data Upload',
                          url: '#/Home/TrainUploadData'
                        },
                        {
                          label: 'Prediction Data Upload',
                          url: '#/Home/PredictionUploadData'
                        }
                      ]
                    }
                  ],
                  // items: [
                  //   {
                  //     label: 'Analog data',

                  //   }
                  // ]
                }
              ]
            },
            {
              label: 'Moderate data',
              items: [
                {
                  label: 'Digital data',
                  items: [
                    {
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
            }
          ]
        },
        {
          label: 'Forecast',
          items: [
            {
              label: 'Big data',
              items: [
                {
                  label: 'Application / Machine Learning',
                  items: [
                    {
                      label: 'Screw Compressor',
                      items: [
                        {
                          label: 'Train',
                          url: '#/Home/Compressor/ScrewTrain'
                        },
                        {
                          label: 'Prediction',
                          url: '#/Home/Compressor/ScrewPrediction'
                        }
                      ]
                    },
                    {
                      label: 'Centrifugal Pump',
                      items: [
                        {
                          label: 'Train',
                          url: '#/Home/CentrifugalPumpTrain'
                        },
                        {
                          label: 'Prediction',
                          url: '#/Home/CentrifugalPumpPrediction'
                        }
                      ]
                    }
                  ]
                }
              ]
            },
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
      label: 'Strategic Analysis',
      icon: 'pi pi-chart-line',
      items: [
        {
          label: 'Develop maintenance strategy',
          items: [
            {
              label: 'RCM (Relaibility Centered Maintenance)',
              items: [
                {
                  label: 'Configuration',
                  url: '#/Home/Prescriptive/Configuration'
                },
                {
                  label: 'FMEA Add',
                  url: '#/Home/Prescriptive/ADD'
                },
                {
                  label: 'FCA Add',
                  url: '#/Home/Prescriptive/FCAAdd'
                },
                {
                  label: 'MSS Add',
                  url: '#/Home/Prescriptive/MSSAdd'
                },
                {
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
    },
    {
      label: 'Resource Optimization',
      icon: 'pi pi-sitemap',
      items: [
        {
          label: 'APM (Assets Performance Management) Platform',
          items: [
            {
              label: 'Cost Benefit Analysis',
              url: '#/Home/CostBenefitAnalysis'
            },
            {
              label: 'Residual Risk Analysis',
              url: '#/Home/Report'
            },
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
    },
    {
      label: 'Prescriptive Maintenance',
      icon: 'pi pi-sliders-v',
      items: [
        {
          label: 'Prescriptive Recommendation',
          url: '#/Home/Prescriptive/List'
        }
      ]
    },
    {
      label: 'Recycle Bin',
      icon: 'pi pi-trash',
      url: '#/Home/RecycleBin'
    },
  ];
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

  UserData() {
    if (localStorage.getItem('userObject') != null) {
      this.user = JSON.parse(localStorage.getItem('userObject'))
    }
    if (this.user.UserType == 1) {
      this.screwCompressor = true;
      this.screwCompressorData = true;
      this.centrifugalPump = true;
      this.centrifugalPumpData = true;
      this.report = true;
      this.prescriptive = true;
      this.prescriptiveConfiguration = true;
      this.staticEquitment = true;
      this.recycleBin = true
    } else if (this.user.UserType == 2) {
      this.centrifugalPump = true
      this.centrifugalPumpData = true;
      this.report = true;
      this.prescriptive = true;
      this.prescriptiveConfiguration = false;
      this.screwCompressor = true;
      this.screwCompressorData = true;
      this.staticEquitment = true;
      this.recycleBin = true
    }
    else if (this.user.UserType == 3) {
      this.centrifugalPump = true
      this.centrifugalPumpData = true;
      this.report = false;
      this.prescriptive = false;
      this.prescriptiveConfiguration = false;
      this.screwCompressor = false;
      this.screwCompressorData = false;
      this.staticEquitment = false;
      this.recycleBin = false
    } else if (this.user.UserType == 4) {
      this.centrifugalPump = false
      this.centrifugalPumpData = false;
      this.report = false;
      this.prescriptive = true;
      this.prescriptiveConfiguration = false;
      this.recycleBin = true
      this.screwCompressor = false;
      this.screwCompressorData = false;
      this.staticEquitment = false;
    }
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
}