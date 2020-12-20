import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, Validators, FormGroup, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    FormData: FormGroup;
 
    constructor(private builder: FormBuilder,
                private http : HttpClient,
                private router: Router) { }
  
  
  ngOnInit(){
    this.FormData = this.builder.group({
      Subject: new FormControl('', [Validators.required]),
      Email: new FormControl('', [Validators.compose([Validators.required, Validators.email])]),
      Comment: new FormControl('', [Validators.required]),
     // Phone: new FormControl('', [Validators.required, Validators.pattern("[0-9]{0-10}")]),
    });
  }
  
  logout(){
    localStorage.removeItem('token');
    this.router.navigateByUrl('/Login'); 
  }


  Send(FormData){
    const email = FormData;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.post('https://formspree.io/f/mrgoypyy',
      { name: email.Subject, replyto: email.Email, message: email.Comment },
      { 'headers': headers }).subscribe(
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
                alert("Message not Send !!!")
            }
        
      );

  }


}
