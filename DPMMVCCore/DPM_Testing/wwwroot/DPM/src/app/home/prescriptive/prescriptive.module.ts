import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { PrescriptiveAddComponent } from "./FMEA/prescriptive-add/prescriptive-add.component";
import { PrescriptiveConfigurationComponent } from "./FMEA/prescriptive-configuration/prescriptive-configuration.component";
import { PrescriptiveConsequencesComponent } from "./FMEA/prescriptive-consequences/prescriptive-consequences.component";
import { PrescriptiveDisplayComponent } from "./FMEA/prescriptive-display/prescriptive-display.component";
import { PrescriptiveUpdateComponent } from "./FMEA/prescriptive-update/prescriptive-update.component";
import { PrescriptiveComponent } from "./prescriptive.component";
import { PrescriptiveRoutingModule } from "./prescriptive.routing";
import { PrescriptiveReportComponent } from './FMEA/prescriptive-report/prescriptive-report.component';
import { PrescriptiveListComponent } from './FMEA/prescriptive-list/prescriptive-list.component';
import { FCAADDComponent } from './FCA/fca-add/fca-add.component';
import { MSSAddComponent } from './MSS/mss-add/mss-add.component';
import { RCAComponent } from "./RCA/rca.component";
import { ClientContractorLibraryComponent } from './PSR/client-contractor-library/client-contractor-library.component';
import { MssStrategyComponent } from './PSR/mss-strategy/mss-strategy.component';
import { SkillLibraryComponent } from './PSR/skill-library/skill-library.component';
import { MSRComponent } from './PSR/msr/msr.component';

@NgModule({
    declarations: [PrescriptiveComponent,
        PrescriptiveAddComponent,
        PrescriptiveConfigurationComponent,
        PrescriptiveDisplayComponent,
        PrescriptiveUpdateComponent,
        PrescriptiveConsequencesComponent,
        PrescriptiveReportComponent,
        PrescriptiveListComponent,
        FCAADDComponent,
        MSSAddComponent,
        RCAComponent,
        ClientContractorLibraryComponent,
        MssStrategyComponent,
        SkillLibraryComponent,
        MSRComponent
    ],
    imports: [
        SharedModule,
        PrescriptiveRoutingModule
    ],
    providers: [],
    bootstrap: [PrescriptiveComponent]
})
export class PrescriptiveModule {

}