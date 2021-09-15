import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { CompressorComponent } from "./compressor.component";
import { CompressorRoutingModule } from "./compressor.routing";
import { ConfigurationComponent } from "./configuration/configuration.component";
import { PredictionComponent } from "./prediction/prediction.component";
import { TrainComponent } from "./train/train.component";
import { ScrewCompressorPredictiondataUploadComponent } from './screw-compressor-predictiondata-upload/screw-compressor-predictiondata-upload.component';
import { ScrewCompressorTraindataUploadComponent } from './screw-compressor-traindata-upload/screw-compressor-traindata-upload.component';
import { ModerateDataCollectionComponent } from './moderate-data-collection/moderate-data-collection.component';
import { ModerateDataCollectionFieldComponent } from "./moderate-data-collection-field/moderate-data-collection-field.component";

@NgModule({
    declarations: [
        CompressorComponent,
        ConfigurationComponent,
        TrainComponent,
        PredictionComponent,
        ScrewCompressorPredictiondataUploadComponent,
        ScrewCompressorTraindataUploadComponent,
        ModerateDataCollectionComponent,
        ModerateDataCollectionFieldComponent
    ],
    imports: [
        CompressorRoutingModule,
        SharedModule
    ],
    providers: [],
    bootstrap: [CompressorComponent]
})
export class CompressorModule {

}