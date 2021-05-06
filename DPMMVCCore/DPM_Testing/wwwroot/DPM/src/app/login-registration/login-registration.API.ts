import { Injectable } from "@angular/core";


@Injectable({
    providedIn: 'root'
})

export class LoginRegistrationConstantAPI{

    public RegisterAPI : string = '/RegistrationAPI/Register'
    public LoginAPI : string =  '/RegistrationAPI/Login'
}