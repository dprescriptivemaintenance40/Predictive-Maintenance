import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { ChartModule } from "primeng/chart";
import { DragDropModule } from "primeng/dragdrop";
import { InputTextModule } from "primeng/inputtext";
import { MessageModule } from "primeng/message";
import { MessagesModule } from "primeng/messages";
import { PasswordModule } from "primeng/password";
import { RadioButtonModule } from "primeng/radiobutton";
import { StepsModule } from "primeng/steps";
import { TableModule } from "primeng/table";
import { TreeModule } from "./P-Tree/p-tree";
import { ToastModule } from "primeng/toast";
import { SliderModule } from 'primeng/slider';
import { DialogModule } from 'primeng/dialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CommonLoadingComponent } from "./Loading/common-loading.component";
import { SafePipe } from "./safe.pipe";
import { TooltipModule } from 'primeng/tooltip';
import { TabViewModule } from 'primeng/tabview';
import { OrganizationChartModule } from "./organization-chart/organization-chart.component";
import { SplitButtonModule } from 'primeng/splitbutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
@NgModule({
        declarations: [CommonLoadingComponent, SafePipe],
        imports: [CommonModule,
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
                OrganizationChartModule,
                CardModule,
                StepsModule,
                RadioButtonModule,
                DragDropModule,
                SliderModule,
                DialogModule,
                OverlayPanelModule,
                TreeModule,
                TooltipModule,
                SplitButtonModule,
                ConfirmDialogModule],
        exports: [CommonModule,
                CommonLoadingComponent,
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
                OrganizationChartModule,
                CardModule,
                StepsModule,
                RadioButtonModule,
                DragDropModule,
                SliderModule,
                TreeModule,
                SafePipe,
                DialogModule,
                OverlayPanelModule,
                TabViewModule,
                TooltipModule,
                SplitButtonModule,
                ConfirmDialogModule]
})
export class SharedModule {

}