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
import { CostBenefitAnalysisComponent } from "./CostBenefitAnalysis/cost-benefit-analysis.component";
import { CentrifugalPumpPredictionComponent } from "./Pump/centrifugal-pump/centrifugal-pump-prediction/centrifugal-pump-prediction.component";
import { CentrifugalPumpTraindataUploadComponent } from "./Pump/centrifugal-pump/centrifugal-pump-traindata-upload/centrifugal-pump-traindata-upload.component";
import { CentrifugalPumpPredictiondataUploadComponent } from "./Pump/centrifugal-pump/centrifugal-pump-predictiondata-upload/centrifugal-pump-predictiondata-upload.component";
import { ScrewCompressorTraindataUploadComponent } from "./Compressor/ScrewCompressor/screw-compressor-traindata-upload/screw-compressor-traindata-upload.component";
import { ScrewCompressorPredictiondataUploadComponent } from "./Compressor/ScrewCompressor/screw-compressor-predictiondata-upload/screw-compressor-predictiondata-upload.component";
import { PrescriptionComponent } from "./prescription/prescription.component";
import { WeibullAnalysis } from "./WeibullAnalysis/weibull-analysis.component";
import { FailureHistoryComponent } from "./FailureHistory/failure-history.component";
@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '', component: HomeComponent,
            children: [
                { path: '', redirectTo: 'Dashboard', pathMatch: 'full' },
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
                { path: 'Prescription', component: PrescriptionComponent },
                { path: 'CostBenefitAnalysis', component: CostBenefitAnalysisComponent },
                { path: 'FailureModesLibrary', loadChildren: () => import('./FailureModeLibrary/failure-modes-library.module').then(a => a.FailureModesLibraryModule)}, 
                { path: 'TrainUploadData', component: CentrifugalPumpTraindataUploadComponent },
                { path: 'PredictionUploadData', component: CentrifugalPumpPredictiondataUploadComponent }, 
                { path: 'CompTrainUploadData', component: ScrewCompressorTraindataUploadComponent },
                { path: 'CompPredictionUploadData', component: ScrewCompressorPredictiondataUploadComponent },                 
                { path: 'WeibullAnalysis', component: WeibullAnalysis },                 
                { path: 'FailureHistory', component: FailureHistoryComponent },                 
            ]
        }
    ])],
    exports: [RouterModule]
})
export class HomeRoutingModule {

}