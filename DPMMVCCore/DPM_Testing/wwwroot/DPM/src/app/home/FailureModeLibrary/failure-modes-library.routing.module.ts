import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { UserLibraryComponent } from "./AssetsList/User/user-library.component";
import { CriticalityAssessmentComponent } from "./CriticalityAssessment/criticality-assessment.component";
import { FailureModesLibraryComponent } from "./failure-modes-library.component";
import { CustomerLibraryComponent } from "./LibraryFailure/CustomerLibrary/customer-library.component";
import { DPMLibraryComponent } from "./LibraryFailure/DPMLibrary/dpm-library.component";
import { ListCredibleFailureModesComponent } from "./ListCredibleFailureModes/list-credible-failure-modes.component";
import { MaintenanceHistoryComponent } from "./MaintenanceHistory/maintenance-history.component";

@NgModule({
    imports:[
        RouterModule.forChild([
            {
                path: '', component: FailureModesLibraryComponent,
                children: [
                    { path: '', redirectTo: 'User-Library', pathMatch: 'full' },                
                    { path: 'User-Library', component: UserLibraryComponent},
                    { path: 'CriticalityAssessment', component: CriticalityAssessmentComponent},
                    { path: 'DPMLibrary', component: DPMLibraryComponent},
                    { path: 'CustomerLibrary', component: CustomerLibraryComponent},
                    { path: 'ListCredibleFailureModes', component: ListCredibleFailureModesComponent},
                    { path: 'MaintenanceHistory', component: MaintenanceHistoryComponent},
                ]
            }
        ])
    ],
    exports:[
        RouterModule
    ]
})
export class FailureModesLibraryRoutingModule{

}