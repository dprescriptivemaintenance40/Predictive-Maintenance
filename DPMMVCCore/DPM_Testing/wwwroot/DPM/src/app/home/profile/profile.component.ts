import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators, FormGroup,FormArray, FormControl } from '@angular/forms';
import { HttpClient} from '@angular/common/http';
import { UserService } from '../Services/user.services';
import { Title } from '@angular/platform-browser';
import {MessageService} from 'primeng/api';
import { HttpEventType } from '@angular/common/http';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';
import { ProfileConstantAPI } from './profileAPI.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [MessageService],
})
export class ProfileComponent implements OnInit {
  profileForms: FormArray = this.fb.array([]);
  public user :any=[]; 
  public abc :any=[];
  url = 'api/UserProfile/';
  public imagePath;
  fileToUpload: any;
  public progress: number;
  public message: string;
  public userProfile :any =[];
  @Output() public onUploadFinished = new EventEmitter();
  public response: {dbPath: ''};
  constructor(private fb: FormBuilder,
              private http : HttpClient,
              private service : UserService,
              private messageService: MessageService,
              private title: Title,
              private profileAPIName : ProfileConstantAPI,
              private profileMethod : CommonBLService,
               ) { }


  ngOnInit() {
    this.title.setTitle('DPM | Profile');
    const url = this.profileAPIName.ProfileAPI
    this.profileMethod.getWithoutParameters(url)
    .subscribe(
      res => {
        this.user = res;
        this.user.ImageUrl = this.user.ImageUrl == null?"dist/DPM/assets/img/undraw_profile.svg":this.user.ImageUrl;
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
      const url : string =  this.profileAPIName.ProfileAPI
      this.profileMethod.PutData(url , fg.value)
    //  this.http.put('api/UserProfile/' + fg.value.Id, fg.value)
      .subscribe(
        (res: any) => {
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
    const url : string = this.profileAPIName.ProfileAPI
    this.profileMethod.PutData(url, data)
   // this.http.put('api/UserProfileAPI/' + data.Id, data)
    .subscribe(
      res=>{
        this.user=res
      }
    )
    }
   
  
  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    
    formData.append('file', fileToUpload, fileToUpload.name);
    const url : string = this.profileAPIName.UploadImage;
    this.profileMethod.postWithoutHeaders(url, formData)
   // this.http.post('api/UserProfileAPI/UploadImage', formData, {reportProgress: true, observe: 'events'})
      .subscribe(res => {
        // if (res.type === HttpEventType.UploadProgress){
        //   this.progress = Math.round(100 * res.loaded / res.total);
        //   this.userProfile = res;
        // }
        // else if (res.type === HttpEventType.Response) {
        //   this.messageService.add({severity:'success',  detail: 'Image Upload successfully ', sticky: true});
        //   this.onUploadFinished.emit(res.body);
        // }
        this.userProfile = res;
        this.messageService.add({severity:'success',  detail: 'Image Upload successfully ', sticky: true});
         
      });
 
  }

 
}