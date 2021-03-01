import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CompressorComponent } from "./compressor.component";
import { ConfigurationComponent } from "./configuration/configuration.component";
import { PredictionComponent } from "./prediction/prediction.component";
import { TrainComponent } from "./train/train.component";

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '', component: CompressorComponent,
            children: [
                { path: '', redirectTo: 'ScrewConfiguration', pathMatch: 'full' },                
                { path: 'ScrewConfiguration', component: ConfigurationComponent},
                { path: 'ScrewTrain', component: TrainComponent},
                { path: 'ScrewPrediction', component: PredictionComponent},
            ]
        }
    ])],
    exports: [RouterModule]
})
export class CompressorRoutingModule {

}