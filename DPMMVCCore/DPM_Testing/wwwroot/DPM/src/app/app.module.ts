import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginRegistrationComponent } from './login-registration/login-registration.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {TableModule} from 'primeng/table';
import {ChartModule} from 'primeng/chart';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { EducationComponent } from './education/education.component';
import { ProfileComponent} from './profile/profile.component';
import { ReportComponent } from './report/report.component';
import { UserService } from './Services/user.services';
import { AuthInterceptor } from './Token.Interceptor';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { PredictionComponent } from './Compressor/ScrewCompressor/prediction/prediction.component';
import { ConfigurationComponent } from './Compressor/ScrewCompressor/configuration/configuration.component';
import { TrainComponent } from './Compressor/ScrewCompressor/train/train.component';
import { ToastrModule } from 'ngx-toastr';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginRegistrationComponent,
    HomeComponent,
    DashboardComponent,
    EducationComponent,
    ProfileComponent,
    ReportComponent,
    PredictionComponent,
    ConfigurationComponent,
    TrainComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
   
  
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    ToastrModule.forRoot({
      progressBar: true
    }),
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ChartModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    MessagesModule,
    MessageModule,
    TableModule
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy },
    UserService, {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [HomeComponent]
})
export class AppModule { }
