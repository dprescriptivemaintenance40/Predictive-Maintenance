import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { LoginRegistrationConstantAPI } from 'src/app/login-registration/login-registration.API';
import { CommonBLService } from 'src/app/shared/BLDL/common.bl.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private LoginAPIName : LoginRegistrationConstantAPI, 
    private LoginMethod : CommonBLService) { }
  readonly BaseURI = 'https://localhost:44331/api';

  register(registerForm) {
    var body = {
      UserName: registerForm.value.UserName,
      Email: registerForm.value.Email,
      PhoneNumber: registerForm.value.PhoneNumber,
      Firstname: registerForm.value.Firstname,
      Lastname: registerForm.value.Lastname,
      Company: registerForm.value.Company,
      Password: registerForm.value.Password
    };
    const url : string = this.LoginAPIName.RegisterAPI;
   
    return  this.LoginMethod.postWithoutHeaders(url, body)
  }

  login(formData) {
    const url : string = this.LoginAPIName.LoginAPI;
    return  this.LoginMethod.postWithoutHeaders(url, formData)
  }
  
}