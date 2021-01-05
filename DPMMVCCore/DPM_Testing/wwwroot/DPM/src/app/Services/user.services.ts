import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private fb: FormBuilder, private http: HttpClient) { }
  readonly BaseURI = 'https://localhost:44331/api';

  

  formModel = this.fb.group({
    UserName: ['', Validators.required],
    Email: ['', Validators.email],
    PhoneNumber: ['', Validators.required],
    Company: ['', Validators.required],
    Firstname: ['', Validators.required],
    Lastname: ['', Validators.required],
    Passwords: this.fb.group({
      Password: ['', [Validators.required, Validators.minLength(8)]],
      ConfirmPassword: ['', Validators.required]
    }, { validator: this.comparePasswords })

  });

  comparePasswords(fb: FormGroup) {
    let confirmPswrdCtrl = fb.get('ConfirmPassword');
    //passwordMismatch
    //confirmPswrdCtrl.errors={passwordMismatch:true}
    if (confirmPswrdCtrl.errors == null || 'passwordMismatch' in confirmPswrdCtrl.errors) {
      if (fb.get('Password').value != confirmPswrdCtrl.value)
        confirmPswrdCtrl.setErrors({ passwordMismatch: true });
      else
        confirmPswrdCtrl.setErrors(null);
    }
  }

  register() {
    var body = {
      UserName: this.formModel.value.UserName,
      Email: this.formModel.value.Email,
      PhoneNumber: this.formModel.value.PhoneNumber,
      Firstname: this.formModel.value.Firstname,
      Lastname: this.formModel.value.Lastname,
      Company: this.formModel.value.Company,
      Password: this.formModel.value.Passwords.Password
    };
    return this.http.post('api/RegistrationAPI/Register', body);
  }

  login(formData) {
    return this.http.post('api/RegistrationAPI/Login', formData);
  }

  getUserProfile() {
    return this.http.get('api/UserProfileAPI');
  }

  
}