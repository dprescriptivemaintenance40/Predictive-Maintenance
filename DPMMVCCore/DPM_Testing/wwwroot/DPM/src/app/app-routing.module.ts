import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginRegistrationComponent } from './login-registration/login-registration.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RCMFunctionalAnalysis } from './home/prescriptive/CBA/RCMFunctionalAnalysis/rcmreport.component';

@NgModule({
  imports: [RouterModule.forRoot([
    { path: '', redirectTo: 'Login', pathMatch: 'full' },
    { path: 'Login', component: LoginRegistrationComponent },
    { path: 'Home', loadChildren: () => import('./home/home.module').then(a => a.HomeModule), canActivate: [AuthGuard] },
    { path: 'Reset', component: ResetPasswordComponent },
    { path: 'ForgotPassword', component: ForgotPasswordComponent },
    { path: 'RCMFunctionalAnalysis', component: RCMFunctionalAnalysis},
   
  ])],
  exports: [RouterModule]
})
export class AppRoutingModule { }
