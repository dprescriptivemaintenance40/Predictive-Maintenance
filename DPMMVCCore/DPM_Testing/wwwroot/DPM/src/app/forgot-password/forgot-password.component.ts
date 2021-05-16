import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  public Email;
  public res1: any;
  public res2: any;
  public disableEnter: boolean = true;
  public hideForm: boolean = true
  constructor(public http: HttpClient,
    private title: Title) {
    this.title.setTitle('Forget Password | Dynamic Prescriptive Maintenence')
  }

  Validate() {
    let data = {
      Email: this.Email
    }
    this.http.post('api/ForgotPasswordAPI/Forgot', data)
      .subscribe(res => {
        this.res1 = res;
      }, err => {
        this.res2 = err;
      });
    this.disableEnter = false;
    this.hideForm = false;
  }
}
