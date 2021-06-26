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
      label: 'A',
      items: [
        {
          label: 'Asset’s list',
          items: [
            { label: 'User'},
            { label: 'Filter'}
          ]
        },
        { label: 'Criticality Assessment' },
        { separator: true },
        { label: 'Maintenance History' },
        {
          label: 'Library Of Failure',
          items: [
            { label: 'DPM Library' },
            { label: 'Customer Library' }
          ]
        },
        { label: 'RCA of critical failure' },
        { label: 'List credible failure modes' },
      ]
    },
    {
      label: 'B',
      items: [
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
                      label: 'Analog data',
                      items: [
                        { label: 'Analog to digital conversion' }
                      ]
                    }
                  ]
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
                      label: 'Analog data',
                      items: [
                        { label: 'Analog to digital conversion' }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          label: 'Configuration',
        },
        {
          label: 'Forecast',
          items: [
            {
              label: 'Big data',
              items: [
                {
                  label: 'Application / Machine Learning'
                }
              ]
            },
            {
              label: 'Moderate data',
              items: [
                {
                  label: 'Statistical analysis'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      label: 'C',
      items: [
        {
          label: 'Develop maintenance strategy',
          items: [
            {
              label: 'RCM (Relaibility Centered Maintenance)',
            },
            {
              label: 'RBI (Risk Based Inspection)',
            },
            {
              label: 'IPF (Intrumenated Protective Function)',
            },
            {
              label: 'HAZOP (Hazard Operability Analysis)',
            }
          ]
        }
      ]
    },
    {
      label: 'D',
      items: [
        {
          label: 'APM (Assets Performance Management) Platform',
          items: [
            {
              label: 'Cost Benefit Analysis'
            },
            {
              label: 'Residual Risk Analysis'
            },
            {
              label: 'Optimum Spares Analysis'
            }
          ]
        },
        {
          label: 'APM (Assets Performance Management) Library',
          items: [
            {
              label: 'Repair Time'
            },
            {
              label: 'Repair Cost'
            },
            {
              label: 'Resource'
            },
            {
              label: 'Special Tools'
            },
            {
              label: 'Skill Pool'
            }
          ]
        }
      ]
    },
    {
      label: 'E',
      items: [
        { label: 'Prescriptive Recommendation' }
      ]
    }
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