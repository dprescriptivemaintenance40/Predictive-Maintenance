import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonLoadingDirective } from '../shared/Loading/common-loading.directive';
import { UserService } from './Services/user.services';
import { EventEmitterService } from './Services/event-emitter.service';

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
  public Video: boolean = false;
  public prescriptiveConfiguration: boolean = false;
  constructor(public builder: FormBuilder,
    public http: HttpClient,
    public router: Router,
    public service: UserService,
    public messageService: MessageService,
    public eventEmitterService: EventEmitterService,
    public commonLoadingDirective: CommonLoadingDirective) { }


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

  video(){
   this.Video= true
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
    }else if (this.user.UserType == 4) {
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
    localStorage.removeItem('token');
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