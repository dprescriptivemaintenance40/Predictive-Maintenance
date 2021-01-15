import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup,FormArray, FormControl } from '@angular/forms';
import { HttpClient} from '@angular/common/http';
import { UserService } from '../Services/user.services';
import { Title } from '@angular/platform-browser';
import {MessageService} from 'primeng/api';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [MessageService],
})
export class ProfileComponent implements OnInit {
 
  profileForms: FormArray = this.fb.array([]);
  private user :any=[]; 

  constructor(private fb: FormBuilder,
              private http : HttpClient,
              private service : UserService,
              private messageService: MessageService,
              private title: Title) { }


  ngOnInit() {
    this.title.setTitle('DPM | Profile');
   this.service.getUserProfile().subscribe(
      res => {
        this.user = res;
      },
      err => {
        console.log(err);
      },
    );
    
  }
  
 
  
  profileForm() {
    this.profileForms.push(this.fb.group({
      Id:[0],
      UserName: ['', Validators.required],
      Firstname: ['', Validators.required],
      Lastname: ['', Validators.required],
      Company: ['', Validators.required],
      PhoneNumber: ['', Validators.required],
      Email: ['', Validators.required]
    }));
  }

    onUpdate(fg: FormGroup){
      this.http.put('api/UserProfile/' + fg.value.Id, fg.value).subscribe(
        (res: any) => {
       // alert("Done")
        this.messageService.add({severity:'info',  detail: 'Wait for some time ', sticky: true});
        });
      
    }


    Update(){
      let data={
        Id:this.user.Id,
        UserName:this.user.UserName,
        Firstname:this.user.Firstname,
        Lastname:this.user.Lastname,
        Company:this.user.Company,
        Email:this.user.Email,
        PhoneNumber:this.user.PhoneNumber
    }
    this.http.put('api/UserProfileAPI/' + data.Id, data).subscribe(
      res=>{
        this.user=res
      }
    )
    }

}