import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { HttpClient} from '@angular/common/http';
import { UserService } from '../Shared/user.services';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  FormData: FormGroup;
  constructor(private builder: FormBuilder,
              private http : HttpClient,
              private service : UserService) { }


  ngOnInit() {
   this.service.getUserProfile().subscribe(
      res => {
        this.user = res;
      },
      err => {
        console.log(err);
      },
    );
    
  }
  
 user :any=[]; 
  
 

}