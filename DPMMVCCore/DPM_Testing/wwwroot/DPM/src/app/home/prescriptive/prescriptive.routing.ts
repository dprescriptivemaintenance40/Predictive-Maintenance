import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { PrescriptiveAddComponent } from "./FMEA/prescriptive-add/prescriptive-add.component";
import { PrescriptiveConfigurationComponent } from "./FMEA/prescriptive-configuration/prescriptive-configuration.component";
import { PrescriptiveConsequencesComponent } from "./FMEA/prescriptive-consequences/prescriptive-consequences.component";
import { PrescriptiveDisplayComponent } from "./FMEA/prescriptive-display/prescriptive-display.component";
import { PrescriptiveUpdateComponent } from "./FMEA/prescriptive-update/prescriptive-update.component";
import { PrescriptiveComponent } from "./prescriptive.component";

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '', component: PrescriptiveComponent,
            children: [
                { path: '', redirectTo: 'PrescriptiveConfiguration', pathMatch: 'full' },
                { path: 'Update', component: PrescriptiveUpdateComponent },
                { path: 'Configuration', component: PrescriptiveConfigurationComponent },
                { path: 'ADD', component: PrescriptiveAddComponent },
                { path: 'Display', component: PrescriptiveDisplayComponent},
                { path: 'Consequences', component: PrescriptiveConsequencesComponent },
            ]
        }
    ])],
    exports: []
})
export class PrescriptiveRoutingModule {

}