import { Component, OnInit, ViewChild, Input, OnChanges, Output, EventEmitter, ElementRef, SimpleChange, SimpleChanges } from '@angular/core';
import { jsPlumbSurfaceComponent, jsPlumbService } from 'jsplumbtoolkit-angular';
import { jsPlumbToolkit, Surface, Dialogs, jsPlumbToolkitUtil, DrawingTools } from 'jsplumbtoolkit';
import { QuestionNodeComponent, ActionNodeComponent, StartNodeComponent, OutputNodeComponent, EndNodeComponent, StateNodeComponent, SDActionNodeComponent } from 'src/app/flowchart';
import { DialogModule } from 'primeng/dialog';
import { Callback, StateType, State, Trigger, Action, JtkNodeParam } from 'callback';
import { startTimeRange } from '@angular/core/src/profile/wtf_impl';
import { CallbackDataServiceService } from 'src/app/service/callback-data-service.service';
import { CallbackDesignerComponent } from '../callback-designer/callback-designer.component';
import { InvokeFunctionExpr } from '@angular/compiler';
import { TreeNode } from 'primeng/api/public_api';

@Component({
  selector: 'app-callback-sd',
  templateUrl: './callback-sd.component.html',
  styleUrls: ['./callback-sd.component.css']
})
export class CallbackSdComponent implements OnInit, OnChanges {


  @ViewChild('drawer2') drawer: any;
  @ViewChild('drawer3') drawer3: any;
  @ViewChild('api') api : any;
  @ViewChild(jsPlumbSurfaceComponent) surfaceComponent: jsPlumbSurfaceComponent;

  @Output() actionAdded: EventEmitter<any> = new EventEmitter();
  @Output() stateAdded: EventEmitter<any> = new EventEmitter();
  @Input() callback: Callback = null;
  @Input() activeTabIndex: any = null;
  @Output() activeTabIndexChange: EventEmitter<any> = new EventEmitter();
  @Input() currentState: State = null;
  @Input() openFlag: boolean = false;
  @Output() openFlagChanged: EventEmitter<any> = new EventEmitter();
  @Input() action: Action;
  toolkit: jsPlumbToolkit;
  surface: Surface;
  showTriggerDialog: boolean = false;
  sidebarLoaded = false;
  currentAction: Action = null;

  private stateDiagramData: any;

  //It will be set when new trigger is being added.
  newTriggerName: string = null;
  pendingTriggerCallback: Function = null;
  pendingTriggerData: any = null;

  // It is for add action callback.
  showActionDialog = false;
  selectedTriggerForAction: any = null;
  addActionFormDirty = false;
  newActionName: string = null;
  pendingActionCallback: Function = null;
  pendingActionData: any = null;

  toolkitId: string;
  surfaceId: string;

  nodeTypes = [
    { label: "State", type: "state", w: 100, h: 70 },
    { label: "Trigger", type: "trigger", w: 120, h: 70 },
    { label: "Action", type: "action", w: 120, h: 70 }
  ];

  constructor(private $jsplumb: jsPlumbService) {
    this.toolkitId = "callbackSD";
    this.surfaceId = "callbackSDSurface";
    // initialize dialogs
    Dialogs.initialize({
      selector: ".dlg"
    });

    this.sdToolbarTreeData = [
      {
        label: 'State',
        data: {
          type: 'state',
          w: 120,
          h: 70
        },
        icon: 'fa fa-file'
      }];


  }
  ngOnInit() {

    console.log("Calling sd OnInit", this.callback);
    // get the toolkit instance
    this.toolkit = this.$jsplumb.getToolkit(this.toolkitId, this.toolkitParams);

    this.toolkit.bind("dataUpdated", this.dataUpdateListener.bind(this));
  }

  sdToolbarTreeData: TreeNode[] = [];

  // dataGenerator(type: string, el: Element) {
  //   let data = {
  //     type: el.getAttribute('jtk-node-type'),
  //     w: parseInt(el.getAttribute('jtk-width'), 10),
  //     h: parseInt(el.getAttribute('jtk-height'), 10),
  //   };

  //   // check if this is action-api then return api data too.
  //   console.log('dataGenerator on element - ', el);
  //   if (el.getAttribute('api') !== null) {
  //     data['api'] = el.getAttribute('api');
  //   }

  //   return data;
  // }

  jtkNodeData: JtkNodeParam;
  newJData = {
    w: null,
    h: null,
    top: null,
    left: null
  }

  copyJData(input: any, out: any) {
    const keys = ["w", "h", "top", "left"];
    keys.forEach(key => {
      if (input[key] !== undefined) {
        out[key] = input[key];
      }
    });

    return true;
  }

  // TODO: Move to some common util file.
  updateBTInfo(toolKitData: any) {
    toolKitData.nodes.forEach((node: any) => {

      if (node.type === 'state' || node.type === 'start' || node.type === 'end') {
        this.callback.states.some(state => {
          if (node.id === state.id) {
            if (state.jData === undefined) {
              state.jData = new JtkNodeParam();
            }
            state.jData;
            return this.copyJData(node, state.jData);
          }
          return false;
        });
      } else if (node.type === 'trigger') {
        this.callback.triggers.some(trigger => {
          if (node.id === trigger.id) {
            if (trigger.jData === undefined) {
              trigger.jData = new JtkNodeParam();
            }
            return this.copyJData(node, trigger.jData);
          }
          return false;
        })
      } else if (node.type === 'action') {
        this.callback.actions.some(action => {
          if (node.id === action.id) {
            if (action.jData === undefined) {
              action.jData = new JtkNodeParam();
            }
            return this.copyJData(node, action.jData);
          }
          return false;
        })
      }
    })
  }

  dataUpdateListener() {
    console.log('JSPlumb data updated - ', this.toolkit.exportData());
    // TODO: update jsplumb data.
    let tempToolkitData = Object(this.toolkit.exportData());

    this.updateBTInfo(tempToolkitData);

    console.log("State Data on callback", this.callback, tempToolkitData);
  }

  closeDrawer() {
    this.openFlag = false;
    this.sideNav = CallbackDesignerComponent.STATE_DIAGRAM_TAB;
    this.openFlagChanged.emit(this.openFlag);
    this.drawer.close();
  }

  // FIXME: Currently it is loading stateDiagramData all the time. It should do only if callback is changed. 
  ngOnChanges() {
    // for (let change in changes) {

    //   if (changes[change].firstChange || (changes[change].previousValue != changes[change].currentValue)) {
    //     if (change === 'callback') {

    //     } else if (change === 'openFlag') {
    //       this.openFlag == true && this.drawer && 
    //     }
    //   }
    // }

    if (this.openFlag == true && this.drawer) {
      this.drawer.open();
      this.sideNav = CallbackDesignerComponent.TriggerActionSideBar;
      this.openFlag = false;
    }

    // Callback is changed. So reset the stateDiagramData.
    // this.activeTabIndex = CallbackDesignerComponent.TriggerActionSideBar;
    console.log("callback and ActivetabIndex in sd", this.openFlag, this.callback, this.activeTabIndex, this.currentState);
    this.stateDiagramData = this.getStateDiagramData(this.callback);

    // reload jsplumb.
    this.toolkit.load({ data: this.stateDiagramData });
    // this.openSideBar();
  }

  getStateDiagramData(callback: Callback) {
    let sdData = {
      nodes: [],
      edges: []
    };

    this.callback.states.forEach(state => {
      switch (state.type) {
        case StateType.Start:
          // TODO: Need to remember node position.
          sdData.nodes.push({
            "id": "start",
            "type": "start",
            "text": "Start",
            "w": 100,
            "h": 70
          });
          break;
        case StateType.End:
          sdData.nodes.push({
            "id": "end",
            "type": "end",
            "text": "End",
            "w": 100,
            "h": 70
          });
          break;
        default:
          sdData.nodes.push({
            "id": state.id,
            "type": "state",
            "text": state.text,
          });
      }

      this.copyJData(state.jData, sdData.nodes[sdData.nodes.length - 1]);
    });

    // Iterate triggers. 
    // this.callback.triggers.forEach(trigger => {
    //   sdData.nodes.push({
    //     "id": trigger.id,
    //     "type": "trigger",
    //     "text": trigger.name
    //   })

      // this.copyJData(trigger.jData, sdData.nodes[sdData.nodes.length - 1]);

      //Add edge for this trigger. 
    //   sdData.edges.push({
    //     id: sdData.edges.length,
    //     source: trigger.stateId,
    //     target: trigger.id
    //   });
    // });

    // this.callback.actions.forEach(action => {
    //   sdData.nodes.push({
    //     "id": action.id,
    //     "type": "action",
    //     "text": action.name
    //   });
      // this.copyJData(action.jData, sdData.nodes[sdData.nodes.length - 1]);
    // });

    //make edge for trigger to action.
    for (let actionId in this.callback.actionMap) {
      sdData.edges.push({
        id: sdData.edges.length,
        source: this.callback.actionMap.get(actionId).get('trigger'),
        target: actionId
      });
    }

    console.log('sdData - ', sdData);

    return sdData;
  }

  Jdata: any;
  toolkitParams = {
    nodeFactory: (type: string, data: any, callback: Function) => {
      if (this.callback == null) {
        console.log('No Callback selected.');
        return;
      }

      switch (type) {
        case 'state':
          // add a state.
          let Jdata = { w: 100, h: 70 };
          let state = new State('State_' + this.callback.states.length, StateType.NORMAL, Jdata);
          state.id = 'state_' + this.callback.states.length;
          this.callback.states.push(state);
          console.log('Emitting stateAdded event with data - this.Jdata ', state);
          // this.activeTabIndex = CallbackDesignerComponent.TriggerActionSideBar;
          console.log("activeTab - ", this.activeTabIndex);
          this.stateAdded.emit(state);

          // add node. 
          data.text = state.text;
          data.id = state.id;
          data.jData = state.jData;
          callback(data);
          break;
        case 'trigger':
          // add new trigger.
          this.newTriggerName = 'Trigger_' + this.callback.triggers.length + '';
          this.pendingTriggerData = data;
          this.pendingTriggerCallback = callback;
          this.showTriggerDialog = true;
          break;
        case 'action':
          this.newActionName = 'Action_' + this.callback.actions.length;
          this.pendingActionData = data;
          this.pendingActionCallback = callback;
          this.showActionDialog = true;
          break;
      }
    },
    beforeStartConnect: (node: any, edgeType: string) => {
      return { label: "..." };
    }
  }

  closeSideBar() {
    this.activeTabIndex = CallbackDesignerComponent.STATE_DIAGRAM_TAB;
    this.sideNav = CallbackDesignerComponent.STATE_DIAGRAM_TAB;
    this.activeTabIndexChange.emit(this.activeTabIndex);
  }


  sideNav : any;
  flowChartFlag($event){
    console.log("flowchart -- ",$event);
    // this.drawer3.open();
    this.sideNav = CallbackDesignerComponent.FLOW_CHART_TAB;
  }

  closeDrawerFlowchart(){
   this.sideNav = CallbackDesignerComponent.TriggerActionSideBar;
  }
 
  /*
    (type:string, data:any, callback:Function) => {
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
    }*/


  addTriggerNode($event: any) {
    console.log('Trigger Added Successfully, event - ', $event);

    let trigger: Trigger = <Trigger>$event;
    trigger.id = 'trigger_' + this.callback.triggers.length;
    this.pendingTriggerData.text = trigger.name;
    this.pendingTriggerData.id = trigger.id;
    this.pendingTriggerCallback(this.pendingTriggerData);
    this.pendingTriggerCallback = null;
    this.pendingTriggerData = null;
    this.showTriggerDialog = false;
    this.newTriggerName = null;

    this.callback.triggers.push(trigger);

    // Check if state name is given then add the edge.
    setTimeout(() => {
      this.toolkit.addEdge({
        source: trigger.stateId,
        target: trigger.id
      });
    }, 100);
  }

  resolveNode(typeId: string) {
    return ({
      "QuestionNode": QuestionNodeComponent,
      "ActionNode": SDActionNodeComponent,
      "StartNode": StartNodeComponent,
      "EndNode": EndNodeComponent,
      "OutputNode": OutputNodeComponent,
      "StateNode": StateNodeComponent
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
        template: "StartNode",
        parent: "selectable"
      },
      "end": {
        template: "EndNode"
      },
      "selectable": {
        events: {
          tap: (params: any) => {
            this.toggleSelection(params.node);
          }
        }
      },
      "trigger": {
        parent: "selectable",
        template: "QuestionNode"
      },
      "state": {
        parent: "selectable",
        template: "StateNode"
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

    // this.toolkit.load({ url:"assets/data/flowchart-small.json" });
  }

  ngOnDestroy() {
    console.log("flowchart being destroyed");
  }

  openDialog() {
    this.showTriggerDialog = true;
  }

  submitAddAction() {
    if (this.selectedTriggerForAction === null) {
      console.log('Trigger not selected.');
      this.addActionFormDirty = true;
    } else {
      let action = new Action(this.newActionName);
      action.id = 'action_' + this.callback.actions.length;
      this.callback.actions.push(action);
      // Note: We can have same callback for multiple trigger. That is why need to maintain mapping.

      this.pendingActionData.text = action.name;
      this.pendingActionData.id = action.id;

      // Add mapping.
      let map = new Map();
      map.set('state', this.selectedTriggerForAction.stateId);
      map.set('trigger', this.selectedTriggerForAction.id);
      this.callback.actionMap.set(action.id, map);

      // add node.
      this.pendingActionCallback(this.pendingActionData);
      this.pendingActionCallback = null;
      this.pendingActionData = null;
      this.newActionName = null;
      this.showActionDialog = false;

      //add edge.
      setTimeout(() => {
        this.toolkit.addEdge({ source: map.get('trigger'), target: action.id });
      }, 100);

      // TODO: It has to be taken care by double click.
      console.log('Emitting actionAdded event with data - ', action);
      this.actionAdded.emit(action);
    }
  }
  ApiMenu : boolean = false;
  openApiMenu(){
    this.ApiMenu = true;
  }
  closeApiMenu(){
    this.ApiMenu = false;
  }

  currentActionGet($event){
    console.log("On CurrentAction",$event);
    this.currentAction = $event;
  }
}
