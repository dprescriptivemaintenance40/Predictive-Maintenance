
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
import { ScrewCompressorService } from "./Services/ScrewCompressorService";
import { EventEmitterService } from "./Services/event-emitter.service";

@NgModule({
    declarations: [
        HomeComponent,
        DashboardComponent,
        EducationComponent,
        ProfileComponent,
        CentrifugalPumpComponent,
        ReportComponent
    ],
    imports: [        
        HomeRoutingModule,       
        SharedModule
    ],
    providers: [UserService,ProfileService,ScrewCompressorService,EventEmitterService],
    bootstrap: [HomeComponent]
})
export class HomeModule {

}