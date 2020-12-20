import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginRegistrationComponent } from './login-registration/login-registration.component';
import { HomeComponent } from './home/home.component';
import { ChartComponent } from './chart/chart.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CompressorDetailComponent } from './compressor-detail/compressor-detail.component';
import { AddRuleComponent } from './add-rule/add-rule.component';

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
import { UserService } from './Shared/user.services';
import { AuthInterceptor } from './Token.Interceptor';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    LoginRegistrationComponent,
    HomeComponent,
    AddRuleComponent,
    ChartComponent,
    DashboardComponent,
    CompressorDetailComponent,
    EducationComponent,
    ProfileComponent,
    ReportComponent,
   
  
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
   
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,

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
