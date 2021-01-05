import { Component, OnInit } from '@angular/core';
import { UserService } from '../Services/user.services';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
 import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login-registration',
  templateUrl: './login-registration.component.html',
  styleUrls: ['./login-registration.component.css']
})
export class LoginRegistrationComponent {
  formModel = {
    UserName: '',
    Password: ''
  }
private loginForm: FormGroup=null;

  constructor(public service: UserService,
              private router: Router,
             private toastr: ToastrService,
              private title: Title,
              private FormBuilder: FormBuilder
       ) { }
   
     ngOnInit() {

      this.title.setTitle('DPM | Login');
      this.service.formModel.reset();

       if (localStorage.getItem('token') != null){
      this.router.navigateByUrl('/Dashboard'); 
          }
          this.loginForm = this.FormBuilder.group({
            userName: ['', Validators.required],
            password: ['', Validators.required],
            
          });
     }
   
   signUpBtn(){
    var container = document.querySelector(".container");
    container.classList.add("sign-up-mode");
  }
   signInBtn(){
   var container = document.querySelector(".container");
    container.classList.remove("sign-up-mode");
   }
 
   onSubmit() {
    this.service.register().subscribe(
      (res: any) => {
        if (res.Succeeded) {
          this.service.formModel.reset();
          alert('New user created! Registration successful.') 
         this.signInBtn();
          this.toastr.success('New user created!', 'Registration successful.');
        } else {
          res.Errors.forEach(element => {
            switch (element.Code) {
              case 'DuplicateUserName':
                alert( 'Username is already taken');
                break;

              default:
                alert('Registration failed.');
                break;
            }
          });
        }
      },
      err => {
        //console.log(err);
       alert('Please Fill All Mandatory Fields.')
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
            this.router.navigateByUrl('/Dashboard');
          },
          err => {
            if (err.status == 400)
               alert('Incorrect username or password.')
         
            else
              console.log(err);
          }
        );
    }else{
      alert('Please fill mandatory fields.')
    }
  }

}
