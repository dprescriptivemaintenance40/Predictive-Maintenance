import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CompressorComponent } from "./compressor.component";
import { ConfigurationComponent } from "./configuration/configuration.component";
import { ModerateDataCollectionFieldComponent } from "./moderate-data-collection-field/moderate-data-collection-field.component";
import { ModerateDataCollectionComponent } from "./moderate-data-collection/moderate-data-collection.component";
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
                { path: 'SCModerateDataCollection', component: ModerateDataCollectionComponent},
                { path: 'SCModerateFieldDataCollection', component: ModerateDataCollectionFieldComponent},
            ]
        }
    ])],
    exports: [RouterModule]
})
export class CompressorRoutingModule {

}