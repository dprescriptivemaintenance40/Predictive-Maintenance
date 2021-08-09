import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AuthGuard } from "src/app/auth.guard";
import { FCAADDComponent } from "./FCA/fca-add/fca-add.component";
import { PrescriptiveAddComponent } from "./FMEA/prescriptive-add/prescriptive-add.component";
import { PrescriptiveConfigurationComponent } from "./FMEA/prescriptive-configuration/prescriptive-configuration.component";
import { PrescriptiveConsequencesComponent } from "./FMEA/prescriptive-consequences/prescriptive-consequences.component";
import { PrescriptiveDisplayComponent } from "./FMEA/prescriptive-display/prescriptive-display.component";
import { PrescriptiveListComponent } from "./FMEA/prescriptive-list/prescriptive-list.component";
import { PrescriptiveReportComponent } from "./FMEA/prescriptive-report/prescriptive-report.component";
import { PrescriptiveUpdateComponent } from "./FMEA/prescriptive-update/prescriptive-update.component";
import { MSSAddComponent } from "./MSS/mss-add/mss-add.component";
import { PrescriptiveComponent } from "./prescriptive.component";
import { ClientContractorLibraryComponent } from "./PSR/client-contractor-library/client-contractor-library.component";
import { RCAComponent } from "./RCA/rca.component";

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '', component: PrescriptiveComponent,
            children: [
                { path: '', redirectTo: 'PrescriptiveConfiguration', pathMatch: 'full' },
                { path: 'Update', component: PrescriptiveUpdateComponent, canDeactivate: [AuthGuard] },
                { path: 'Configuration', component: PrescriptiveConfigurationComponent },
                { path: 'ADD', component: PrescriptiveAddComponent, canDeactivate: [AuthGuard]  },
                { path: 'Display', component: PrescriptiveDisplayComponent},
                { path: 'Consequences', component: PrescriptiveConsequencesComponent,  canDeactivate: [AuthGuard]  },
                { path: 'Report', component: PrescriptiveReportComponent},
                { path: 'List', component: PrescriptiveListComponent},
                { path: 'FCAAdd', component: FCAADDComponent},
                { path: 'MSSAdd', component: MSSAddComponent},
                { path: 'RCA', component: RCAComponent},
                { path: 'CCL', component: ClientContractorLibraryComponent}
            ]
        }
    ])],
    exports: []
})
export class PrescriptiveRoutingModule {

}