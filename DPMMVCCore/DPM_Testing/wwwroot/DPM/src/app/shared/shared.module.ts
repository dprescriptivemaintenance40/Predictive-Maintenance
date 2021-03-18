import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { ChartsModule } from "ng2-charts";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { ChartModule } from "primeng/chart";
import { DragDropModule } from "primeng/dragdrop";
import { InputTextModule } from "primeng/inputtext";
import { MessageModule } from "primeng/message";
import { MessagesModule } from "primeng/messages";
import { OrganizationChartModule } from "primeng/organizationchart";
import { PasswordModule } from "primeng/password";
import { RadioButtonModule } from "primeng/radiobutton";
import { StepsModule } from "primeng/steps";
import { TableModule } from "primeng/table";
import { TreeModule } from "./P-Tree/p-tree";
import { NgxSpinnerModule } from "ngx-spinner";
import { ToastModule } from "primeng/toast";
import {SliderModule} from 'primeng/slider';
import {DialogModule} from 'primeng/dialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';;


import { CommonLoadingComponent } from "./Loading/common-loading.component";

@NgModule({
    declarations: [CommonLoadingComponent],
    imports: [CommonModule,
        NgxSpinnerModule,
        TableModule,
        FormsModule,
        ReactiveFormsModule,
        ToastModule,
        ChartModule,
        ButtonModule,
        InputTextModule,
        PasswordModule,
        MessagesModule,
        MessageModule,        
        NgxChartsModule,
        OrganizationChartModule,
        ChartsModule,
        CardModule,
        StepsModule,
        RadioButtonModule,
        DragDropModule,
        SliderModule,
        DialogModule,
        TreeModule],
    exports: [CommonModule,
        CommonLoadingComponent,
        NgxSpinnerModule,
        TableModule,
        FormsModule,
        ReactiveFormsModule,
        ToastModule,
        ChartModule,
        ButtonModule,
        InputTextModule,
        PasswordModule,
        MessagesModule,
        MessageModule,        
        NgxChartsModule,
        OrganizationChartModule,
        ChartsModule,
        CardModule,
        StepsModule,
        RadioButtonModule,
        DragDropModule,
        SliderModule,
        TreeModule,
        DialogModule,
        OverlayPanelModule]
})
export class SharedModule {

}