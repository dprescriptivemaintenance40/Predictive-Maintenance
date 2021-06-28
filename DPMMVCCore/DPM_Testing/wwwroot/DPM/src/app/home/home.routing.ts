import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HomeComponent } from "./home.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { EducationComponent } from "./education/education.component";
import { ProfileComponent } from "./profile/profile.component";
import { ReportComponent } from "./report/report.component";
import { CentrifugalPumpComponent } from "./Pump/centrifugal-pump/centrifugal-pump.component";
import { RecycleBinComponent } from "./recycle-bin/recycle-bin.component";
import { AndorlogicComponent } from "./ANDORLogic/andorlogic.component";
import { CentrifugalPumpTrainComponent } from "./Pump/centrifugal-pump/centrifugal-pump-train/centrifugal-pump-train.component";
import { PrescriptivePocComponent } from "./Prescriptive_poc/prescriptive-poc.component";
import { CentrifugalPumpPredictionComponent } from "./Pump/centrifugal-pump/centrifugal-pump-prediction/centrifugal-pump-prediction.component";
@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '', component: HomeComponent,
            children: [
                { path: '', redirectTo: 'Education', pathMatch: 'full' },
                { path: 'Education', component: EducationComponent },
                { path: 'Dashboard', component: DashboardComponent },
                { path: 'Compressor', loadChildren: () => import('./Compressor/ScrewCompressor/compressor.module').then(a => a.CompressorModule) },
                { path: 'Prescriptive', loadChildren: () => import('./prescriptive/prescriptive.module').then(a => a.PrescriptiveModule) },
                { path: 'Profile', component: ProfileComponent },
                { path: 'Report', component: ReportComponent },
                { path: 'CentrifugalPump', component: CentrifugalPumpComponent },
                { path: 'RecycleBin', component: RecycleBinComponent },
                { path: 'ANDORLOGIC', component: AndorlogicComponent },
                { path: 'CentrifugalPumpTrain', component: CentrifugalPumpTrainComponent },
                { path: 'RecycleBin', component: RecycleBinComponent },
                { path: 'CentrifugalPumpPrediction', component: CentrifugalPumpPredictionComponent },
                { path: 'PrescriptivePoc', component: PrescriptivePocComponent },
                { path: 'FailureModesLibrary', loadChildren: () => import('./FailureModeLibrary/failure-modes-library.module').then(a => a.FailureModesLibraryModule)},                
            ]
        }
    ])],
    exports: [RouterModule]
})
export class HomeRoutingModule {

}