import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { UserLibraryComponent } from "./AssetsList/User/user-library.component";
import { CriticalityAssessmentComponent } from "./CriticalityAssessment/criticality-assessment.component";
import { FailureModesLibraryComponent } from "./failure-modes-library.component";
import { FailureModesLibraryRoutingModule } from "./failure-modes-library.routing.module";
import { CustomerLibraryComponent } from "./LibraryFailure/CustomerLibrary/customer-library.component";
import { DPMLibraryComponent } from "./LibraryFailure/DPMLibrary/dpm-library.component";
import { ListCredibleFailureModesComponent } from "./ListCredibleFailureModes/list-credible-failure-modes.component";
import { MaintenanceHistoryComponent } from "./MaintenanceHistory/maintenance-history.component";

@NgModule({
    declarations: [
        FailureModesLibraryComponent,
        UserLibraryComponent,
        CriticalityAssessmentComponent,
        DPMLibraryComponent,
        CustomerLibraryComponent,
        ListCredibleFailureModesComponent,
        MaintenanceHistoryComponent
    ],
    imports:[
        SharedModule,
        FailureModesLibraryRoutingModule
    ],
    bootstrap:[FailureModesLibraryComponent]
})
export class FailureModesLibraryModule {

}