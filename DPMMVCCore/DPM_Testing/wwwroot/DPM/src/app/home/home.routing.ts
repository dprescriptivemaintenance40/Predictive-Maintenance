import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HomeComponent } from "./home.component";
import { ConfigurationComponent } from "./Compressor/ScrewCompressor/configuration/configuration.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AuthGuard } from "../auth.guard";
import { TrainComponent } from "./Compressor/ScrewCompressor/train/train.component";
import { PredictionComponent } from "./Compressor/ScrewCompressor/prediction/prediction.component";
import { EducationComponent } from "./education/education.component";
import { ProfileComponent } from "./profile/profile.component";
import { ReportComponent } from "./report/report.component";
import { PrescriptiveUpdateComponent } from "./prescriptive/FMEA/prescriptive-update/prescriptive-update.component";
import { PrescriptiveConfigurationComponent } from "./prescriptive/FMEA/prescriptive-configuration/prescriptive-configuration.component";
import { PrescriptiveAddComponent } from "./prescriptive/FMEA/prescriptive-add/prescriptive-add.component";
import { PrescriptiveDisplayComponent } from "./prescriptive/FMEA/prescriptive-display/prescriptive-display.component";
import { CentrifugalPumpComponent } from "./Pump/centrifugal-pump/centrifugal-pump.component";
import { RecycleBinComponent } from "./recycle-bin/recycle-bin.component";

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '', component: HomeComponent,
            children: [
                { path: '', redirectTo: 'Dashboard', pathMatch: 'full' },
                { path: 'Dashboard', component: DashboardComponent },
                { path: 'Compressor', loadChildren: () => import('./Compressor/ScrewCompressor/compressor.module').then(a => a.CompressorModule) },
                { path: 'Prescriptive', loadChildren: () => import('./prescriptive/prescriptive.module').then(a => a.PrescriptiveModule) },
                { path: 'Education', component: EducationComponent },
                { path: 'Profile', component: ProfileComponent },
                { path: 'Report', component: ReportComponent },
                { path: 'CentrifugalPump', component: CentrifugalPumpComponent },
                { path: 'RecycleBin', component: RecycleBinComponent }
            ]
        }
    ])],
    exports: [RouterModule]
})
export class HomeRoutingModule {

}