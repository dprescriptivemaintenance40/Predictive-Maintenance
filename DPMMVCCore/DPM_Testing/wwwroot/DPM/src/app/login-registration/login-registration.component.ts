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
  public registerForm: FormGroup = null;

  constructor(public service: UserService,
    public router: Router,
    public messageService: MessageService,
    public title: Title,
    public formBuilder: FormBuilder,
    public eventEmitterService: EventEmitterService) { 
      this.title.setTitle('Login | Dynamic Prescriptive Maintenence');
    }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      UserName: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      PhoneNumber: ['', [Validators.required, Validators.pattern(("^((\\+91-?)|0)?[0-9]{10}$"))]],
      Company: ['', Validators.required],
      Firstname: ['', Validators.required],
      Lastname: ['', Validators.required],
      Password: ['', Validators.required],
      ConfirmPassword: [''],
    }, { validators: this.checkConfirmPass });

    this.loginForm = this.formBuilder.group({
      UserName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  checkConfirmPass(group: FormGroup) {
    let pass = group.get('Password').value;
    let confirmPass = group.get('ConfirmPassword').value;
    return pass === confirmPass ? null : { notSame: true };
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
    var checkIsValid = true;
    if (!this.registerForm.valid) {
      for (var b in this.registerForm.controls) {
        this.registerForm.controls[b].markAsDirty();
        this.registerForm.controls[b].updateValueAndValidity();
        checkIsValid = false;
      }
    }
    if (checkIsValid) {
      if (this.registerForm.value.Password.length >= 8) {
        this.service.register(this.registerForm)
          .subscribe((res: any) => {
            this.registerForm.reset();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'New user created! Registration successful' });
            this.signInBtn();
            this.messageService.add({ severity: 'info', summary: 'info', detail: 'Enter Login Credentials' });
          }, err => {
            this.messageService.add({ severity: 'warn', summary: 'Warn', detail: err.error });
          });
      }
      else {
        this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Password must be character atleast' });
      }
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please fill all mandatory fields' });
    }
  }

  onLogin() {
    var checkIsValid = true;
    if (!this.loginForm.valid) {
      for (var b in this.loginForm.controls) {
        this.loginForm.controls[b].markAsDirty();
        this.loginForm.controls[b].updateValueAndValidity();
        checkIsValid = false;
      }
    }
    if (checkIsValid) {
      this.service.login(this.loginForm.value)
        .subscribe(
          (res: any) => {
            if(res.user.Enable === 1){
              localStorage.setItem('token', res.SecurityToken);
              localStorage.setItem('userObject', JSON.stringify(res.user));
              var data = JSON.parse(localStorage.getItem('userObject'))
              this.eventEmitterService.SendDataToHomeComponent(data);
              this.router.navigateByUrl('Home');
            }else{
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please contact admin, your login has disabled' });
            }
          },
          err => {
            if (err.status == 400)

              this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error });
            else
              console.log(err);
          }
        );
    } else {
      this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'Missing User name or password' });
    }
  }
}
