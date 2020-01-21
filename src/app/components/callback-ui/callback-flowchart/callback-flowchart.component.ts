import { Component, OnInit, ViewChild, Input, OnChanges } from '@angular/core';
import { jsPlumbSurfaceComponent, jsPlumbService } from 'jsplumbtoolkit-angular';
import { jsPlumbToolkit, Surface, Dialogs, DrawingTools, jsPlumbToolkitUtil } from 'jsplumbtoolkit';
import { QuestionNodeComponent, ActionNodeComponent, StartNodeComponent, OutputNodeComponent } from 'src/app/flowchart';
import { Callback, Action, ActionData, ActionApiCallingNodes } from 'callback';
import { ActionApi, ActionApiList } from 'src/app/interface/action-api';

@Component({
  selector: 'app-callback-flowchart',
  templateUrl: './callback-flowchart.component.html',
  styleUrls: ['./callback-flowchart.component.css']
})

export class CallbackFlowchartComponent implements OnInit, OnChanges {

  @Input() callback: Callback;
  @Input() action: Action;

  // This is flow chart data.
  flowChartData: any = {
    nodes: [],
    edges: []
  };

  // Handling input for api.
  showApiDialog = false;
  currentActionApi: ActionApi = null;
  pendingApiJTKCallback: Function = null;
  pendingApiJTKData: any = null;

  // Handling for condition dialog.
  showConditionDialog = false;
  pendingConditionJTKCallback: Function = null;
  pendingConditionJTKData: any = null;

  @ViewChild(jsPlumbSurfaceComponent) surfaceComponent: jsPlumbSurfaceComponent;

  toolkit: jsPlumbToolkit;
  surface: Surface;

  toolkitId: string;
  surfaceId: string;

  private flowDiagramData: any;

  nodeTypes = [
    { label: "Question", type: "question", w: 120, h: 120 },
    { label: "Action", type: "action", w: 120, h: 70 },
    { label: "Output", type: "output", w: 120, h: 70 }
  ];

  constructor(private $jsplumb: jsPlumbService) {
    this.toolkitId = "callbackFlowchart";
    this.surfaceId = "callbackFlowchartSurface";
  }

  ngOnChanges() {
    // If action got change then initialize flowchart.
   if (this.action != null) {
      // add new nodes.
      this.flowChartData = {
        nodes: [{
          type: 'start',
          text: 'start',
          id: 'start',
          w: 100,
          h: 70
        }],
        edges: []
      };

      // update flowchart.
      this.toolkit.load({ data: this.flowChartData });
    } 

    this.flowDiagramData = this.getFlowDiagramData(this.flowChartData);

    this.toolkit.load({ data: this.flowDiagramData });
    console.log("Flowchart-component", this.action);

  }

  getFlowDiagramData(flowChartData: any) {
    let fdData = {
      nodes: [],
      edges: []
    };

    this.flowChartData.nodes.forEach(start => {
      fdData.nodes.push({
        type: 'start',
        text: 'start',
        id: 'start',
        w: 100,
        h: 70
      });
    });

    this.flowChartData.nodes.forEach(action => {
      fdData.nodes.push({
        "id": action.id,
        "type": "action",
        "text": action.name
      });
    });

    this.flowChartData.nodes.forEach(question => {
      fdData.nodes.push({
        "id": question.id,
        "type": "question",
        "text": question.name
      });
    });


    // this.flowChartData = {
    //   nodes: [{
    //     type: 'start',
    //     text: 'start',
    //     id: 'start',
    //     w: 100,
    //     h: 70
    //   }],
    //   edges: []
    // };

    return fdData;
  }
  ngOnInit() {
    // get the toolkit instance
    this.toolkit = this.$jsplumb.getToolkit(this.toolkitId, this.toolkitParams);

    this.toolkit.bind("dataUpdated", this.dataUpdateListener.bind(this));

    console.log("Flow Diagram", this.flowChartData, this.toolkit);

  }

  dataUpdateListener() {
    console.log('JSPlumb data updated in flow Diagram - ', this.toolkit.exportData());
    // TODO: update jsplumb data.
    let tempToolkitData = Object(this.toolkit.exportData());

    console.log("toolKitData", tempToolkitData);
  }

  toolkitParams = {
    nodeFactory: (type: string, data: any, callback: Function) => {
      if (this.action == null) {
        console.log('No Action selected.');
        return;
      }
      console.log('Dropped node type - ', type);
      if (type === 'action') {
        // get api name first. 
        let api = ActionApiList.getApiData(data.api);
        if (api === null) return;

        console.log('api name - ', data.api, ' data - ', api);

        this.currentActionApi = api;
        this.pendingApiJTKData = data;
        this.pendingApiJTKCallback = callback;
        this.showApiDialog = true;
        return;
      } else if (type == 'question') {
        this.showConditionDialog = true;
        this.pendingConditionJTKCallback = callback;
        this.pendingConditionJTKData = data;
        return;
      }
      /*
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
            */
    },
    beforeStartConnect: (node: any, edgeType: string) => {
      return { label: "..." };
    }
  }

  resolveNode(typeId: string) {
    return ({
      "QuestionNode": QuestionNodeComponent,
      "ActionNode": ActionNodeComponent,
      "StartNode": StartNodeComponent,
      "OutputNode": OutputNodeComponent,
    })[typeId]
  }

  getToolkit(): jsPlumbToolkit {
    return this.toolkit;
  }

  toggleSelection(node: any) {
    this.toolkit.toggleSelection(node);
  }

  removeEdge(edge: any) {
    this.toolkit.removeEdge(edge);
  }

  editLabel(edge: any) {
    Dialogs.show({
      id: "dlgText",
      data: {
        text: edge.data.label || ""
      },
      onOK: (data: any) => {
        this.toolkit.updateEdge(edge, { label: data.text });
      }
    });
  }

  view = {
    nodes: {
      "start": {
        template: "StartNode"
      },
      "selectable": {
        events: {
          tap: (params: any) => {
            this.toggleSelection(params.node);
          }
        }
      },
      "question": {
        parent: "selectable",
        template: "QuestionNode"
      },
      "output": {
        parent: "selectable",
        template: "OutputNode"
      },
      "action": {
        parent: "selectable",
        template: "ActionNode"
      }
    },
    edges: {
      "default": {
        anchor: "AutoDefault",
        endpoint: "Blank",
        connector: ["Flowchart", { cornerRadius: 5 }],
        paintStyle: { strokeWidth: 2, stroke: "#f76258", outlineWidth: 3, outlineStroke: "transparent" },	//	paint style for this edge type.
        hoverPaintStyle: { strokeWidth: 2, stroke: "rgb(67,67,67)" }, // hover paint style for this edge type.
        events: {
          "dblclick": (params: any) => {
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
          ["Arrow", { location: 1, width: 10, length: 10 }],
          ["Arrow", { location: 0.3, width: 10, length: 10 }]
        ]
      },
      "connection": {
        parent: "default",
        overlays: [
          [
            "Label", {
              label: "${label}",
              events: {
                click: (params: any) => {
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
        paintStyle: { fill: "#84acb3" },
        anchor: "AutoDefault",
        maxConnections: -1,
        edgeType: "connection"
      },
      "target": {
        maxConnections: -1,
        endpoint: "Blank",
        anchor: "AutoDefault",
        paintStyle: { fill: "#84acb3" },
        isTarget: true
      }
    }
  }

  renderParams = {
    layout: {
      type: "Spring"
    },
    events: {
      canvasClick: (e: Event) => {
        this.toolkit.clearSelection();
      },
      edgeAdded: (params: any) => {
        if (params.addedByMouse) {
          this.editLabel(params.edge);
        }
      }
    },
    consumeRightClick: false,
    dragOptions: {
      filter: ".jtk-draw-handle, .node-action, .node-action i"
    }
  }

  typeExtractor(el: Element) {
    return el.getAttribute("jtk-node-type");
  }

  dataGenerator(type: string, el: Element) {
    return {
      type: el.getAttribute("jtk-node-type"),
      w: parseInt(el.getAttribute("jtk-width"), 10),
      h: parseInt(el.getAttribute("jtk-height"), 10)
    }
  }

  ngAfterViewInit() {
    this.surface = this.surfaceComponent.surface;
    this.toolkit = this.surface.getToolkit();

    new DrawingTools({
      renderer: this.surface
    });

    this.toolkit.load({ url: "assets/data/flowchart-small.json" });
  }

  ngOnDestroy() {
    console.log('flowchart being destroyed');
  }

  // Handling for action api.
  handleActionApiAdded($event) {
    // TODO: set action.
    console.log('action api submitted with values - ', $event);

    // Add in action.
    const value: any = $event.argument;
    // set the arguments.
    let args: string = '';
    this.currentActionApi.arguments.forEach(arg => {
      if (args !== '') {
        args += ','
      }
      args += `${arg.name}:${value[arg.name]}`;
    });

    // TODO: show the complete data.
    // this.pendingApiJTKData.text = `${this.currentActionApi.api}(${args})`;
    this.pendingApiJTKData.text = this.currentActionApi.api;
    this.pendingApiJTKData.id = jsPlumbToolkitUtil.uuid();
    this.pendingApiJTKCallback(this.pendingApiJTKData);
    this.currentActionApi = null;
    this.pendingApiJTKCallback = null;
    this.pendingApiJTKData = null;
    this.showApiDialog = false;

    let apiNodeData = new ActionApiCallingNodes();
    apiNodeData.id = 'api_' + this.action.data.aNOdes.length;
    apiNodeData.text = $event.api;
    apiNodeData.data = $event;
    this.action.data.aNOdes.push(apiNodeData);

    console.log("actual flowchart data", this.flowChartData, $event, apiNodeData);

    // In case gotoState api called then trigger event. and do handling for edges at sd. 
  }

  handleConditionAdded($event) {
    const data = $event;
    // TODO: instead of showing name for operator, better to show sign eg. >=
    const text = `'${data.lhs}' ${data.operator.name} ${data.rhs}`;
    this.pendingConditionJTKData.id = jsPlumbToolkitUtil.uuid();
    this.pendingConditionJTKData.text = text;
    this.pendingConditionJTKCallback(this.pendingConditionJTKData);

    this.pendingConditionJTKCallback = null;
    this.pendingConditionJTKData = null;
    this.showConditionDialog = false;
    console.log('handleConditionAdded completed', this.flowChartData, $event);
  }
}
