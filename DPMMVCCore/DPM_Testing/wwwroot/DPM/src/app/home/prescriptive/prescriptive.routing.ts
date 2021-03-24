import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AuthGuard } from "src/app/auth.guard";
import { PrescriptiveAddComponent } from "./FMEA/prescriptive-add/prescriptive-add.component";
import { PrescriptiveConfigurationComponent } from "./FMEA/prescriptive-configuration/prescriptive-configuration.component";
import { PrescriptiveConsequencesComponent } from "./FMEA/prescriptive-consequences/prescriptive-consequences.component";
import { PrescriptiveDisplayComponent } from "./FMEA/prescriptive-display/prescriptive-display.component";
import { PrescriptiveReportComponent } from "./FMEA/prescriptive-report/prescriptive-report.component";
import { PrescriptiveUpdateComponent } from "./FMEA/prescriptive-update/prescriptive-update.component";
import { PrescriptiveComponent } from "./prescriptive.component";

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
            ]
        }
    ])],
    exports: []
})
export class PrescriptiveRoutingModule {

}