import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { SharedModule } from "src/app/shared/shared.module";
import { CompressorComponent } from "./compressor.component";
import { CompressorRoutingModule } from "./compressor.routing";
import { ConfigurationComponent } from "./configuration/configuration.component";
import { PredictionComponent } from "./prediction/prediction.component";
import { TrainComponent } from "./train/train.component";

@NgModule({
    declarations: [
        CompressorComponent,
        ConfigurationComponent,
        TrainComponent,
        PredictionComponent
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