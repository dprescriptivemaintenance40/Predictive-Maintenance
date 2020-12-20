import { Component, OnInit } from '@angular/core';
import { UserService } from '../Shared/user.services';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

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

  constructor(public service: UserService,
              private router: Router
    //   , private toastr: ToastrService
       ) { }
   
     ngOnInit() {
      this.service.formModel.reset();

       this.isLogin=true;
       this.isRegister=false;
       if (localStorage.getItem('token') != null){
      this.router.navigateByUrl('/Dashboard');       }
     }
   

  isLogin:boolean
  isRegister:boolean




  goToRegister(){
    this.isLogin=false;
    this.isRegister=true;
  }
  goToLogin(){
    this.isLogin=true;
    this.isRegister=false;
  }

 
   onSubmit() {
    this.service.register().subscribe(
      (res: any) => {
        if (res.Succeeded) {
          this.service.formModel.reset();
          alert('New user created! Registration successful.')
         // this.toastr.success('New user created!', 'Registration successful.');
        } else {
          res.errors.forEach(element => {
            switch (element.code) {
              case 'DuplicateUserName':
            //    this.toastr.error('Username is already taken','Registration failed.');
                break;

              default:
            //  this.toastr.error(element.description,'Registration failed.');
                break;
            }
          });
        }
      },
      err => {
        console.log(err);
      }
    );
  }




  onLogin(form: NgForm) {
    this.service.login(form.value).subscribe(
      (res: any) => {
        localStorage.setItem('token', res.SecurityToken);
        this.router.navigateByUrl('/Dashboard'); 
      },
      err => {
        if (err.status == 400)
         // this.toastr.error('Incorrect username or password.', 'Authentication failed.');
            alert('Incorrect username or password.')
        else
          console.log(err);
      }
    );
  }




}
