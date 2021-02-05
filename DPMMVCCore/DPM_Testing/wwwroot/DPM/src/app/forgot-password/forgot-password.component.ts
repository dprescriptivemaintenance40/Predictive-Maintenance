import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  public Email;
  public res1:any;
  public res2:any;
  public disableEnter:boolean= true;
  public hideForm:boolean=true
  
  
  
  constructor( public http : HttpClient ) { }

  ngOnInit() {

  }

 

  Validate(){
    let data ={
      Email: this.Email
    }
    this.http.post('api/ForgotPasswordAPI/Forgot', data).subscribe(
      res =>{
       this.res1=res;
       console.log(this.res1);
      },
      err=>{
        this.res2=err;
        console.log(this.res2)
      }
    )

    this.disableEnter=false
    this.hideForm=false
    
  }

}
