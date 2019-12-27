import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core/src/metadata/ng_module';
import { DatasetComponent } from "./dataset";
import { FlowchartComponent } from "./flowchart";
import {StateDiagramComponent} from './state-diagram/state-diagram.component';
import {CallbackSdComponent} from './components/callback-ui/callback-sd/callback-sd.component';
import { CallbackDesignerComponent } from './components/callback-ui/callback-designer/callback-designer.component';

export const AppRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: FlowchartComponent },
  { path: 'data', component: DatasetComponent },
  {path: 'sd', component: StateDiagramComponent},
  {path: 'callback', component: CallbackDesignerComponent}
];

export const ROUTING: ModuleWithProviders = RouterModule.forRoot(AppRoutes, {useHash: true});
