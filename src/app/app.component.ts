import {Component, ElementRef, Input, ViewChild} from '@angular/core';

import {FlowchartComponent } from "./flowchart";
import {DatasetComponent } from "./dataset";
import { Dialogs, jsPlumbToolkit, jsPlumb, jsPlumbToolkitUtil  } from "jsplumbtoolkit";
import { jsPlumbService } from "jsplumbtoolkit-angular";

@Component({
    selector: 'jsplumb-demo',
    template:`
        <nav>
           
            <a routerLink="/home" style="cursor:pointer;" routerLinkActive="active">Flowchart</a>           
            <a routerLink="/data" style="cursor:pointer;" routerLinkActive="active">Dataset</a>
           
            <a routerLink="/sd" style="cursor:pointer;" routerLinkActive="active">State Diagram</a>
            <a routerLink="/callback" style="cursor:pointer;" routerLinkActive="active">Callback</a>
        </nav>
        <router-outlet></router-outlet>       
        <div class="description">
          <p>
            This sample application is a copy of the Flowchart Builder application, using the Toolkit's
            Angular 4 integration components and Angular CLI.
          </p>
          <ul>
            <li>Drag new nodes from the palette on the left onto the workspace to add nodes</li>
            <li>Drag from the grey border of any node to any other node to establish a link, then provide a description for the link's label</li>
            <li>Click a link to edit its label.</li>
            <li>Click the 'Pencil' icon to enter 'select' mode, then select several nodes. Click the canvas to exit.</li>
            <li>Click the 'Home' icon to zoom out and see all the nodes.</li>
          </ul>
        </div>
    `
})
export class AppComponent {

  @ViewChild(FlowchartComponent) flowchart:FlowchartComponent;
  @ViewChild(DatasetComponent) dataset:DatasetComponent;

  toolkitId:string;
  toolkit:jsPlumbToolkit;

  constructor(private $jsplumb:jsPlumbService, private elementRef:ElementRef) {
    this.toolkitId = this.elementRef.nativeElement.getAttribute("toolkitId");
  }

  ngOnInit() {
    this.toolkit = this.$jsplumb.getToolkit(this.toolkitId, this.toolkitParams)
  }

  ngAfterViewInit() {
    this.toolkit.load({ url:"assets/data/flowchart-1.json" });
  }

  toolkitParams = {
    nodeFactory:(type:string, data:any, callback:Function) => {
      Dialogs.show({
        id: "dlgText",
        title: "Enter " + type + " name:",
        onOK: (d:any) => {
          data.text = d.text;
          // if the user entered a name...
          if (data.text) {
            // and it was at least 2 chars
            if (data.text.length >= 2) {
              // set an id and continue.
              data.id = jsPlumbToolkitUtil.uuid();
              callback(data);
            }
            else
            // else advise the user.
              alert(type + " names must be at least 2 characters!");
          }
          // else...do not proceed.
        }
      });
    },
    beforeStartConnect:(node:any, edgeType:string) => {
      return { label:"..." };
    }
  }

}
