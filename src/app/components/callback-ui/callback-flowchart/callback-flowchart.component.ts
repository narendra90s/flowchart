import { Component, OnInit, ViewChild, Input, OnChanges } from '@angular/core';
import { jsPlumbSurfaceComponent, jsPlumbService } from 'jsplumbtoolkit-angular';
import { jsPlumbToolkit, Surface, Dialogs, DrawingTools, jsPlumbToolkitUtil } from 'jsplumbtoolkit';
import { QuestionNodeComponent, ActionNodeComponent, StartNodeComponent, OutputNodeComponent } from 'src/app/flowchart';
import { Callback, Action, ActionData, ActionApiCallingNodes, ConditionNode, JtkNodeParam } from 'callback';
import { ActionApi, ActionApiList } from 'src/app/interface/action-api';
import { Source } from 'webpack-sources';
import { CallbackDataServiceService } from 'src/app/service/callback-data-service.service';
import { Dialog } from 'primeng/dialog/dialog';

@Component({
  selector: 'app-callback-flowchart',
  templateUrl: './callback-flowchart.component.html',
  styleUrls: ['./callback-flowchart.component.css']
})

export class CallbackFlowchartComponent implements OnInit, OnChanges {

  @Input() callback: Callback;
  @Input() action: Action;
  // @ViewChild(jsPlumbSurfaceComponent) surfaceComponent: jsPlumbSurfaceComponent;

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

  constructor(private $jsplumb: jsPlumbService, private cdService: CallbackDataServiceService) {
    this.toolkitId = "callbackFlowchart";
    this.surfaceId = "callbackFlowchartSurface";
  }

  ngOnChanges() {
    // If action got change then initialize flowchart.
    if (this.action != null) {
      
      if (this.toolkit) {
        this.toolkit.clear();
      }

      this.flowDiagramData = this.getFlowDiagramData();
      
      // this.flowDiagramData = this.getFlowDiagramData(this.callback);

      this.toolkit.load({ data: this.flowDiagramData });

    }
    console.log("Flowchart-component", this.action, this.callback);

  }


  copyJData(input: any, out: any) {
    if (!input) return;

    const keys = ["w", "h", "top", "left"];
    keys.forEach(key => {
      if (input[key] !== undefined) {
        out[key] = input[key];
      }
    });

    return true;
  }

  getFlowDiagramData() {
    let fdData = {
      nodes: [],
      edges: []
    };

    fdData.nodes.push({
      type: 'start',
      text: 'start',
      id: 'start',
      w: 100,
      h: 70
    });

    //FIXME: how to remember start position.
    // this.copyJData(da.jData, fdData.nodes[fdData.nodes.length - 1]);
    this.copyJData(this.action.data.startNodeJData, fdData.nodes[fdData.nodes.length - 1]);

    this.action.data.aNOdes.forEach(da => {
      fdData.nodes.push({
        "id": da.id,
        "text": da.data.api["id"],
        "type": "action",
        "data": da.data,
        w: 180,
        h: 70
      });
      this.copyJData(da.jData, fdData.nodes[fdData.nodes.length - 1]);
    });

    this.action.data.cNodes.forEach(d => {
      let text = "'" + d.data.lhs + "' " + d.data.operator["name"] + " " + d.data.rhs;
      fdData.nodes.push({
        "id": d.id,
        "text": text,
        "type": "question",
        "data": d.data,
        w: 180,
        h: 70
      });
     this.copyJData(d.jData, fdData.nodes[fdData.nodes.length - 1]);
    });

    // this.callback.actions.forEach(action =>{
    //   fdData.edges = action.data.edges;
    //   console.log("inside getflo",fdData);
    // });

    // console.log("refresh edge of flowchart",this.callback.actions);
    fdData.edges = this.action.data.edges;



    // this.callback.actions.forEach(action => {
    //   if (this.action != null && action.id == this.action.id) {
    //     fdData.nodes.push({
    //       type: 'start',
    //       text: 'start',
    //       id: 'start',
    //       w: 100,
    //       h: 70
    //     });

    // if (this.action.data.aNOdes.length) {
    //   this.action.data.aNOdes.forEach(da => {
    //     fdData.nodes.push({
    //       "id": da.id,
    //       "text": da.data.api["id"],
    //       "type": "action",
    //       "data": da.data,
    //       w: 180,
    //       h: 70
    //     });
    //   });
    // }
    // if (this.action.data.cNodes.length) {
    //   this.action.data.cNodes.forEach(d => {
    //     let text = "'" + d.data.lhs + "' " + d.data.operator["name"] + " " + d.data.rhs;
    //     fdData.nodes.push({
    //       "id": d.id,
    //       "text": text,
    //       "type": "question",
    //       "data": d.data,
    //       w: 180,
    //       h: 70
    //     });
    //   });
    // }
    // if (this.action.data.edges.length) {
    //   this.action.data.edges.forEach(n => {
    //     fdData.edges.push({
    //       id: fdData.edges.length,
    //       source: n.source,
    //       target: n.target,
    //       data: n.data
    //     });
    //   });
    // }
    // }
    // else{
    //   fdData.nodes.push({
    //     type: 'start',
    //     text: 'start',
    //     id: 'start',
    //     w: 100,
    //     h: 70
    //   });
    // }
    // });


    console.log("GetflowdiagramData called ===>",this.action.data.edges , fdData ,this.callback)
    return fdData;
  }


  ngOnInit() {
    // get the toolkit instance
    this.toolkit = this.$jsplumb.getToolkit(this.toolkitId, this.toolkitParams);

    this.toolkit.bind("dataUpdated", this.dataUpdateListener.bind(this));

    console.log("Flow Diagram onInit ===>", this.flowChartData, this.toolkit);

  }

  updateBTInfo(toolKitData: any) {
    // console.log("updateListner called ===>",toolKitData);
    toolKitData.nodes.forEach((node: any) => {
      if (node.type === 'start'){
        if (!this.action.data.startNodeJData)
          this.action.data.startNodeJData = new JtkNodeParam();
        return this.copyJData(node , this.action.data.startNodeJData);
      }
      if (node.type === 'action') {
        // this.callback.actions.forEach(action => {
          this.action.data.aNOdes.some(n => {
            if (node.id === n.id) {
              if (n.jData === undefined) {
                n.jData = new JtkNodeParam();
              }
              return this.copyJData(node, n.jData);
            }
          });
          return false;
        // });
      }
      if (node.type === 'question') {
        // this.callback.actions.forEach(action => {
          this.action.data.cNodes.some(nq => {
            if (node.id === nq.id) {
              if (nq.jData === undefined) {
                nq.jData = new JtkNodeParam();
              }
              return this.copyJData(node, nq.jData);
            }
          })
        // })
      }
    });
    

    console.log('callback after updateBTInfo for flowdiagram - ', this.callback , toolKitData);
  }

  dataUpdateListener() {
    console.log('JSPlumb data updated in flow Diagram - ', this.toolkit.exportData());
    // TODO: update jsplumb data.
    let tempToolkitData = Object(this.toolkit.exportData());
    this.action.data.edges = tempToolkitData.edges;

    this.updateBTInfo(tempToolkitData);   


    console.log("toolKitData on refresh", tempToolkitData, this.callback);
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
    console.log("On Edit edge",edge , this.action , Object(this.toolkit.exportData()));

    if (edge.source.getType() !== 'question') return;

    Dialogs.show({
      id: "dlgRadio",
      data : {
        yes : edge.data.label,
        no : edge.data.label
      },
      onOK: (data: any) => {
            this.toolkit.updateEdge(edge, { label: data.text});
          }
    });

    // Dialogs.show({
    //   id: "dlgText",
    //   data: {
    //     text: edge.data.label || ""
    //   },
    //   onOK: (data: any) => {
    //     this.toolkit.updateEdge(edge, { label: data.text });
    //   }
    // });
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
        connector: ["Flowchart", { curviness: 10 }],
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
  
        ]
      },
      "connection": {
        parent: "default",
        overlays: [
          [
            "Label", {
              label: "${label}",
              events: {
                /*
                click: (params: any) => {
                  this.editLabel(params.edge);
                }*/
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
        edgeType: "default",
        maxConnections: 1
      },
      "source": {
        endpoint: "Blank",
        paintStyle: { fill: "#84acb3" },
        anchor: "AutoDefault",
        maxConnections: 2,
        edgeType: "connection"
      },
      "target": {
        maxConnections: 1,
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

    // this.toolkit.load({ url: "assets/data/flowchart-small.json" });
  }

  ngOnDestroy() {
    console.log('flowchart being destroyed');
  }

  // Handling for action api.
  handleActionApiAdded($event) {
    // TODO: set action.
    console.log('action api submitted with values - ', $event, this.action.data.aNOdes);

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
    this.pendingApiJTKData.id = 'api_' + this.action.data.aNOdes.length;
    this.pendingApiJTKCallback(this.pendingApiJTKData);
    this.currentActionApi = null;
    this.pendingApiJTKCallback = null;
    this.pendingApiJTKData = null;
    this.showApiDialog = false;

    let apiNodeData = new ActionApiCallingNodes();
    apiNodeData.id = 'api_' + this.action.data.aNOdes.length;
    apiNodeData.text = $event.api.api;
    apiNodeData.data = $event;
    this.action.data.aNOdes.push(apiNodeData);

    console.log("actual flowchart data", this.flowChartData, $event, apiNodeData);

    // In case gotoState api called then trigger event. and do handling for edges at sd. 
    if ($event.api.id === 'gotoState') {
      console.log("on goto", $event.api.id);
      this.cdService.broadcast('refreshSDEdge', $event.argument.stateName);
    }
  }

  handleConditionAdded($event) {
    console.log("HandleConditionAdded", $event);
    const data = $event;
    // TODO: instead of showing name for operator, better to show sign eg. >=
    const text = `'${data.lhs}' ${data.operator.name} ${data.rhs}`;
    this.pendingConditionJTKData.id = 'condition_' + this.action.data.cNodes.length;
    this.pendingConditionJTKData.text = text;
    this.pendingConditionJTKCallback(this.pendingConditionJTKData);

    this.pendingConditionJTKCallback = null;
    this.pendingConditionJTKData = null;
    this.showConditionDialog = false;


    let conditionNodeData = new ConditionNode();
    conditionNodeData.id = 'condition_' + this.action.data.cNodes.length;
    conditionNodeData.text = $event.condition;
    conditionNodeData.data = $event;

    this.action.data.cNodes.push(conditionNodeData);

    console.log('handleConditionAdded completed', this.flowChartData, $event);
  }
}
