import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginRegistrationComponent } from './login-registration/login-registration.component';
import { HomeComponent } from './home/home.component';
import { AddRuleComponent } from './add-rule/add-rule.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartComponent } from './chart/chart.component';
import { CompressorDetailComponent } from './compressor-detail/compressor-detail.component';
import { EducationComponent } from './education/education.component';
import { ProfileComponent } from './profile/profile.component';
import { ReportComponent } from './report/report.component';
import { AuthGuard } from './auth.guard';


const routes: Routes = [
  { path: '', component:LoginRegistrationComponent},
  { path: 'Login', component:LoginRegistrationComponent},
  { path: 'AddRule', component: AddRuleComponent,canActivate:[AuthGuard]},
  { path: 'Dashboard', component: DashboardComponent, canActivate:[AuthGuard]},
  { path: 'Chart', component: ChartComponent, canActivate:[AuthGuard]},
  { path: 'CompressorDetail', component: CompressorDetailComponent,canActivate:[AuthGuard]},
  { path:'Education', component: EducationComponent, canActivate:[AuthGuard]},
  { path:'Profile', component: ProfileComponent, canActivate:[AuthGuard]},
  { path:'Report', component: ReportComponent,canActivate:[AuthGuard]}
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
