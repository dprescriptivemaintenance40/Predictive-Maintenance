import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators, FormGroup} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';
import { ProfileConstantAPI } from './profileAPI.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [MessageService],
})
export class ProfileComponent implements OnInit {
  public user: any;
  public url = 'api/UserProfile/';
  public imagePath;
  public fileToUpload: any;
  public progress: number;
  public message: string;
  public registerForm: FormGroup = null;
  constructor(private formBuilder: FormBuilder,
    private messageService: MessageService,
    private title: Title,
    private profileAPIName: ProfileConstantAPI,
    private profileMethod: CommonBLService,
  ) { this.title.setTitle('Profile | Dynamic Prescriptive Maintenence');}


  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      UserName: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      PhoneNumber: ['', [Validators.required, Validators.pattern(("^((\\+91-?)|0)?[0-9]{10}$"))]],
      Company: ['', Validators.required],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required]
    });
    this.registerForm.controls['UserName'].disable();    
    this.getUserProfileData();
  }

  getUserProfileData() {
    this.profileMethod.getWithoutParameters(this.profileAPIName.ProfileAPI)
      .subscribe(
        res => {
          this.user = res;
          this.registerForm.patchValue(this.user);          
          this.user.ImageUrl = this.user.ImageUrl == null ? "dist/DPM/assets/img/undraw_profile.svg" : this.user.ImageUrl;
        },
        err => {
          console.log(err);
        });
  }

  Update() {
    this.registerForm.controls['UserName'].enable();
    var checkIsValid = true;
    if (!this.registerForm.valid) {
      for (var b in this.registerForm.controls) {
        this.registerForm.controls[b].markAsDirty();
        this.registerForm.controls[b].updateValueAndValidity();
        checkIsValid = false;
      }
    }
    if (checkIsValid) {
      let data = {
        UserId: this.user.UserId,
        UserName: this.registerForm.value.UserName,
        FirstName: this.registerForm.value.FirstName,
        LastName: this.registerForm.value.LastName,
        Company: this.registerForm.value.Company,
        Email: this.registerForm.value.Email,
        PhoneNumber: this.registerForm.value.PhoneNumber,
        Password: this.user.Password,
        ImageUrl: this.user.ImageUrl,
        UserType: this.user.UserType,
      }
      const url: string = this.profileAPIName.ProfileAPI
      this.profileMethod.PutData(url, data)
        .subscribe(res => {
          this.user = res;
          this.registerForm.controls['UserName'].disable();
          this.user.ImageUrl = this.user.ImageUrl == null ? "dist/DPM/assets/img/undraw_profile.svg" : this.user.ImageUrl;
          this.registerForm.patchValue(this.user);  
        });
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Please fill all mandatory fields' });
    }
  }


  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    const formData = new FormData();

    formData.append('file', fileToUpload, fileToUpload.name);
    const url: string = this.profileAPIName.UploadImage;
    this.profileMethod.postWithoutHeaders(url, formData)
      .subscribe(res => {
        this.user = res;
        this.user.ImageUrl = this.user.ImageUrl == null ? "dist/DPM/assets/img/undraw_profile.svg" : this.user.ImageUrl;
        this.messageService.add({ severity: 'success', detail: 'Image upload successfully done ', sticky: true });
      });
  }
}