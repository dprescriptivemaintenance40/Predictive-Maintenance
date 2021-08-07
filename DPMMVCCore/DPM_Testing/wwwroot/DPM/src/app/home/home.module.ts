
import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { EducationComponent } from "./education/education.component";
import { HomeComponent } from "./home.component";
import { HomeRoutingModule } from "./home.routing";
import { ProfileComponent } from "./profile/profile.component";
import { CentrifugalPumpComponent } from "./Pump/centrifugal-pump/centrifugal-pump.component";
import { ReportComponent } from "./report/report.component";
import { UserService } from "./Services/user.services";
import { ProfileService } from "./Services/ProfileService";
import { EventEmitterService } from "./Services/event-emitter.service";
import { ExcelFormatService } from "./Services/excel-format.service";
import { RecycleBinComponent } from './recycle-bin/recycle-bin.component';
import { AndorlogicComponent } from "./ANDORLogic/andorlogic.component";
import { CentrifugalPumpTrainComponent } from './Pump/centrifugal-pump/centrifugal-pump-train/centrifugal-pump-train.component';
import { CostBenefitAnalysisComponent } from "./CostBenefitAnalysis/cost-benefit-analysis.component";
import { CentrifugalPumpPredictionComponent } from './Pump/centrifugal-pump/centrifugal-pump-prediction/centrifugal-pump-prediction.component';
import { CentrifugalPumpTraindataUploadComponent } from './Pump/centrifugal-pump/centrifugal-pump-traindata-upload/centrifugal-pump-traindata-upload.component';
import { CentrifugalPumpPredictiondataUploadComponent } from './Pump/centrifugal-pump/centrifugal-pump-predictiondata-upload/centrifugal-pump-predictiondata-upload.component';
import {DialogModule} from 'primeng/dialog';
@NgModule({
    declarations: [
        HomeComponent,
        DashboardComponent,
        EducationComponent,
        ProfileComponent,
        CentrifugalPumpComponent,
        ReportComponent,
        RecycleBinComponent,
        AndorlogicComponent,
        CentrifugalPumpTrainComponent,
        CostBenefitAnalysisComponent,
        CentrifugalPumpPredictionComponent,
        CentrifugalPumpTraindataUploadComponent,
        CentrifugalPumpPredictiondataUploadComponent,
    ],
    imports: [        
        HomeRoutingModule,       
        SharedModule,
        DialogModule
    ],
    providers: [UserService,ProfileService,EventEmitterService,ExcelFormatService],
    bootstrap: [HomeComponent]
})
export class HomeModule {

}