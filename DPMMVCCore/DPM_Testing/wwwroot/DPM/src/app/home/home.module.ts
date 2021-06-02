
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

@NgModule({
    declarations: [
        HomeComponent,
        DashboardComponent,
        EducationComponent,
        ProfileComponent,
        CentrifugalPumpComponent,
        ReportComponent,
        RecycleBinComponent,
        AndorlogicComponent
    ],
    imports: [        
        HomeRoutingModule,       
        SharedModule
    ],
    providers: [UserService,ProfileService,EventEmitterService,ExcelFormatService],
    bootstrap: [HomeComponent]
})
export class HomeModule {

}