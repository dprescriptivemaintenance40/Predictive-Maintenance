import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, Validators, FormGroup, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../Services/user.services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    FormData: FormGroup;
 
    constructor(private builder: FormBuilder,
                private http : HttpClient,
                private router: Router,
                private service : UserService) { }
  
  
  ngOnInit(){
    this.FormData = this.builder.group({
      Subject: new FormControl('', [Validators.required]),
      Email: new FormControl('', [Validators.compose([Validators.required, Validators.email])]),
      Comment: new FormControl('', [Validators.required]),
     // Phone: new FormControl('', [Validators.required, Validators.pattern("[0-9]{0-10}")]),
    });


    this.service.getUserProfile().subscribe(
      res => {
        this.user = res;
      },
      err => {
        console.log(err);
      },
    );
  }
  
  user: any=[];

  logout(){
    localStorage.removeItem('token');
    this.router.navigateByUrl('/Login'); 
  }


  Send(FormData){
    const email = FormData;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.post('api/ContactUsAPI/ContactUs',email)
    
       .subscribe(
          suc => {
            console.log(suc);
            this.FormData.reset({
              'Fullname': '',
              'Email': '',
              'Comment': ''
             });
             alert("Message Send Successfully ")
            },
            err => {
                console.log(err);
                this.FormData.reset({
                  'Fullname': '',
                  'Email': '',
                  'Comment': ''
                 });
                alert("Message Send Successfully !!!")
            }
        
      );

  }


}
