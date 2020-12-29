import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginRegistrationComponent } from './login-registration/login-registration.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EducationComponent } from './education/education.component';
import { ProfileComponent } from './profile/profile.component';
import { ReportComponent } from './report/report.component';
import { AuthGuard } from './auth.guard';
import { PredictionComponent } from './Compressor/ScrewCompressor/prediction/prediction.component';
import { TrainComponent } from './Compressor/ScrewCompressor/train/train.component';
import { ConfigurationComponent } from './Compressor/ScrewCompressor/configuration/configuration.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';


const routes: Routes = [
  
  { path: 'Login', component:LoginRegistrationComponent},
  {
    path: '',
    redirectTo: 'Login',
    pathMatch: 'full'
  },
  { path:'Reset', component: ResetPasswordComponent},
 // { path:'Home', component: HomeComponent, canActivate:[AuthGuard]},
  { path: 'ScrewConfiguration', component: ConfigurationComponent,canActivate:[AuthGuard]},
  { path: 'Dashboard', component: DashboardComponent, canActivate:[AuthGuard]},
  { path: 'ScrewTrain', component: TrainComponent,canActivate:[AuthGuard]},
  { path:'ScrewPrediction', component: PredictionComponent,canActivate:[AuthGuard]},
  { path:'Education', component: EducationComponent, canActivate:[AuthGuard]},
  { path:'Profile', component: ProfileComponent, canActivate:[AuthGuard]},
  { path:'Report', component: ReportComponent,canActivate:[AuthGuard]},
  { path:'ForgotPassword', component: ForgotPasswordComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
