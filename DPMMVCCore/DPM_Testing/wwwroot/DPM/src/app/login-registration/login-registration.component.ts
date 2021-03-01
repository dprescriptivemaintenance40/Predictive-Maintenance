import { Component, OnInit } from '@angular/core';
import { UserService } from '../home/Services/user.services';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { EventEmitterService } from '../home/Services/event-emitter.service';


@Component({
  selector: 'app-login-registration',
  templateUrl: './login-registration.component.html',
  styleUrls: ['./login-registration.component.css'],
  providers: [MessageService],
})
export class LoginRegistrationComponent {
  formModel = {
    UserName: '',
    Password: ''
  }

  public loginForm: FormGroup = null;

  constructor(public service: UserService,
    public router: Router,
    public messageService: MessageService,
    public title: Title,
    public formBuilder: FormBuilder,
    public eventEmitterService : EventEmitterService,


  ) { }

  ngOnInit() {

    this.title.setTitle('DPM | Login');
    this.service.formModel.reset();

    if (localStorage.getItem('token') != null) {
      this.router.navigateByUrl('/Home/Dashboard');
    }

    this.loginForm = this.formBuilder.group({
      UserName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }


  signUpBtn() {
    var container = document.querySelector(".container");
    container.classList.add("sign-up-mode");
  }
  signInBtn() {
    var container = document.querySelector(".container");
    container.classList.remove("sign-up-mode");
  }



  onSubmit() {
    this.service.register()
      .subscribe(
        (res: any) => {
          if (res.Succeeded) {
            this.service.formModel.reset();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'New user created! Registration successful', sticky: true });
            this.signInBtn();
            this.messageService.add({ severity: 'info', summary: 'info', detail: 'Enter Login Credentials', sticky: true });
          } else {
            res.errors.forEach(element => {
              switch (element.code) {
                case 'DuplicateUserName':
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Registration failed', sticky: true });
                  break;

                default:
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Registration failed', sticky: true });
                  break;
              }

            });
          }
        },

        err => {
          console.log(err);
          this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please Fill All Mandatory Fields', sticky: true });
        }
      );
  }



  onLogin() {
    var checkIsValid = true;
    for (var b in this.loginForm.controls) {
      this.loginForm.controls[b].markAsDirty();
      this.loginForm.controls[b].updateValueAndValidity();
    }
    if (checkIsValid) {
      this.service.login(this.loginForm.value)
        .subscribe(
          (res: any) => {
            localStorage.setItem('token', res.SecurityToken);
           localStorage.setItem('userObject', JSON.stringify(res.user));
           var data = JSON.parse(localStorage.getItem('userObject'))
           this.eventEmitterService.SendDataToHomeComponent(data); 
            this.router.navigateByUrl('/Home/Dashboard');
          },
          err => {
            if (err.status == 400)

              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Incorrect username or password', sticky: true });
            else
              console.log(err);
          }
        );
    } else {

      this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'Please Fill All Mandatory Fields', sticky: true });
    }
  }




}
