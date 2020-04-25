import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { jsPlumbToolkitModule } from "jsplumbtoolkit-angular";
import { Dialogs } from "jsplumbtoolkit";
import { ROUTING } from './app.routing';
import { DatasetComponent } from "./dataset";
import { ControlsComponent } from "./controls";
import { TreeModule } from 'primeng/tree';
import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { TieredMenuModule } from 'primeng/tieredmenu';

import { FlowchartComponent, QuestionNodeComponent, ActionNodeComponent, StartNodeComponent, OutputNodeComponent, EndNodeComponent, StateNodeComponent, SDActionNodeComponent, PlaceHolderComponent } from './flowchart';
import { StateDiagramComponent } from './state-diagram/state-diagram.component';
import { CallbackSdComponent } from './components/callback-ui/callback-sd/callback-sd.component';
import { SdAddtriggerdialogComponent } from './components/callback-ui/sd-addtriggerdialog/sd-addtriggerdialog.component';
import { FieldsetModule } from 'primeng/fieldset';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { SidebarModule } from 'primeng/sidebar';
import { AccordionModule } from 'primeng/accordion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CallbackDesignerComponent } from './components/callback-ui/callback-designer/callback-designer.component';
import { CallbackFlowchartComponent } from './components/callback-ui/callback-flowchart/callback-flowchart.component';
import { CallbackSidebarMenuComponent } from './components/callback-ui/callback-sidebar-menu/callback-sidebar-menu.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule, MatDialogModule } from '@angular/material';
import { CallbackActionapiDialogComponent } from './components/callback-ui/callback-actionapi-dialog/callback-actionapi-dialog.component';
import { CallbackActionConditionDialogComponent } from './components/callback-action-condition-dialog/callback-action-condition-dialog.component';
import { CallbackDataServiceService } from './service/callback-data-service.service';
import { ExtractdataComponent } from './components/callback-ui/extractdata/extractdata.component';
import { MatCardModule } from '@angular/material/card';
import { CallbackSdTriggerActionComponent } from './components/callback-ui/callback-sd/callback-sd-trigger-action/callback-sd-trigger-action.component';


@NgModule({
    imports: [BrowserModule, HttpClientModule, CommonModule, BrowserAnimationsModule, jsPlumbToolkitModule, ROUTING, FormsModule, ReactiveFormsModule,
        InputTextModule, DropdownModule, FieldsetModule, DialogModule, ButtonModule, TabViewModule, SidebarModule,
        MatDividerModule, MatButtonModule, AccordionModule, TreeModule, ListboxModule, MatSidenavModule, MultiSelectModule, MatDialogModule, MatCardModule, MatListModule, MatMenuModule , TieredMenuModule],
    declarations: [AppComponent, QuestionNodeComponent, ActionNodeComponent, StartNodeComponent, OutputNodeComponent,
        DatasetComponent, ControlsComponent, FlowchartComponent, StateDiagramComponent, CallbackSdComponent,
        SdAddtriggerdialogComponent, CallbackDesignerComponent, EndNodeComponent, StateNodeComponent, PlaceHolderComponent,
        CallbackFlowchartComponent,
        CallbackSidebarMenuComponent,
        CallbackActionapiDialogComponent,
        CallbackActionConditionDialogComponent,
        SDActionNodeComponent, ExtractdataComponent, CallbackSdTriggerActionComponent],
    bootstrap: [AppComponent],
    providers: [CallbackDataServiceService],
    entryComponents: [QuestionNodeComponent, ActionNodeComponent, StartNodeComponent, OutputNodeComponent, EndNodeComponent, StateNodeComponent, SDActionNodeComponent, ExtractdataComponent, PlaceHolderComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
    constructor() {
        // initialize dialogs
        Dialogs.initialize({
            selector: ".dlg"
        });
    }
}

