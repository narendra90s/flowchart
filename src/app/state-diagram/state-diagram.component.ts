import { Component, OnInit, ViewChild } from '@angular/core';
import { jsPlumbSurfaceComponent, jsPlumbService } from 'jsplumbtoolkit-angular';
import { jsPlumbToolkit, Surface, Dialogs, DrawingTools, jsPlumbToolkitUtil } from 'jsplumbtoolkit';
import { QuestionNodeComponent, ActionNodeComponent, StartNodeComponent, OutputNodeComponent } from '../flowchart';

@Component({
  selector: 'app-state-diagram',
  templateUrl: './state-diagram.component.html',
  styleUrls: ['./state-diagram.component.css']
})
export class StateDiagramComponent  {

  @ViewChild(jsPlumbSurfaceComponent) surfaceComponent:jsPlumbSurfaceComponent;

  toolkit:jsPlumbToolkit;
  surface:Surface;

  toolkitId:string;
  surfaceId:string;

  nodeTypes = [
    { label: "Question", type: "question", w:120, h:120 },
    { label: "Action", type: "action", w:120, h:70 },
    { label: "Output", type: "output", w:120, h:70 }
  ];

  constructor(private $jsplumb:jsPlumbService) {
    this.toolkitId = "stateDiagram";
    this.surfaceId = "stateDiagramSurface";
  }
  ngOnInit() {
    // get the toolkit instance
    this.toolkit = this.$jsplumb.getToolkit(this.toolkitId, this.toolkitParams);
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
  
  resolveNode(typeId:string) {
    return ({
      "QuestionNode":QuestionNodeComponent,
      "ActionNode":ActionNodeComponent,
      "StartNode":StartNodeComponent,
      "OutputNode":OutputNodeComponent
    })[typeId]
  }

  getToolkit():jsPlumbToolkit {
    return this.toolkit;
  }

  toggleSelection(node:any) {
    this.toolkit.toggleSelection(node);
  }

  removeEdge(edge:any) {
    this.toolkit.removeEdge(edge);
  }

  editLabel(edge:any) {
    Dialogs.show({
      id: "dlgText",
      data: {
        text: edge.data.label || ""
      },
      onOK: (data:any) => {
        this.toolkit.updateEdge(edge, { label:data.text });
      }
    });
  }

  view = {
    nodes:{
      "start":{
        template:"StartNode"
      },
      "selectable": {
        events: {
          tap: (params:any) => {
            this.toggleSelection(params.node);
          }
        }
      },
      "question":{
        parent:"selectable",
        template:"QuestionNode"
      },
      "output":{
        parent:"selectable",
        template:"OutputNode"
      },
      "action":{
        parent:"selectable",
        template:"ActionNode"
      }
    },
    edges: {
      "default": {
        anchor:"AutoDefault",
        endpoint:"Blank",
        connector: ["Flowchart", { cornerRadius: 5 } ],
        paintStyle: { strokeWidth: 2, stroke: "#f76258", outlineWidth: 3, outlineStroke: "transparent" },	//	paint style for this edge type.
        hoverPaintStyle: { strokeWidth: 2, stroke: "rgb(67,67,67)" }, // hover paint style for this edge type.
        events: {
          "dblclick": (params:any) => {
            Dialogs.show({
              id: "dlgConfirm",
              data: {
                msg: "Delete Edge"
              },
              onOK: () => { this.removeEdge(params.edge); }
            });
          }
        },
        overlays: [
          [ "Arrow", { location: 1, width: 10, length: 10 }],
          [ "Arrow", { location: 0.3, width: 10, length: 10 }]
        ]
      },
      "connection":{
        parent:"default",
        overlays:[
          [
            "Label", {
            label: "${label}",
            events:{
              click:(params:any) => {
                this.editLabel(params.edge);
              }
            }
          }
          ]
        ]
      }
    },
    ports: {
      "start": {
        endpoint: "Blank",
        anchor: "Continuous",
        uniqueEndpoint: true,
        edgeType: "default"
      },
      "source": {
        endpoint: "Blank",
        paintStyle: {fill: "#84acb3"},
        anchor: "AutoDefault",
        maxConnections: -1,
        edgeType: "connection"
      },
      "target": {
        maxConnections: -1,
        endpoint: "Blank",
        anchor: "AutoDefault",
        paintStyle: {fill: "#84acb3"},
        isTarget: true
      }
    }
  }

  renderParams = {
    layout:{
      type:"Spring"
    },
    events: {
      canvasClick: (e:Event) => {
        this.toolkit.clearSelection();
      },
      edgeAdded:(params:any) => {
        if (params.addedByMouse) {
          this.editLabel(params.edge);
        }
      }
    },
    consumeRightClick:false,
    dragOptions: {
      filter: ".jtk-draw-handle, .node-action, .node-action i"
    }
  }

  typeExtractor(el:Element) {
    return el.getAttribute("jtk-node-type");
  }

  dataGenerator(type:string, el:Element) {
    return {
      type:el.getAttribute("jtk-node-type"),
      w:parseInt(el.getAttribute("jtk-width"), 10),
      h:parseInt(el.getAttribute("jtk-height"), 10)
    }
  }

  ngAfterViewInit() {
    this.surface = this.surfaceComponent.surface;
    this.toolkit = this.surface.getToolkit();

    new DrawingTools({
      renderer: this.surface
    });

    this.toolkit.load({ url:"assets/data/flowchart-small.json" });
  }

  ngOnDestroy() {
    console.log("flowchart being destroyed");
  }

}
