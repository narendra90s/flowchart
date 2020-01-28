import { Component, OnInit, Input, OnChanges, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Callback, State, Trigger, Action, ActionData } from 'callback';

@Component({
  selector: 'app-callback-sd-trigger-action',
  templateUrl: './callback-sd-trigger-action.component.html',
  styleUrls: ['./callback-sd-trigger-action.component.css']
})
export class CallbackSdTriggerActionComponent implements OnInit, OnChanges {


  @Input() callback = null;
  @Input() currentState: State;
  @Output() flowChartFlag: EventEmitter<any> = new EventEmitter();
  @Output() currentAction: EventEmitter<any> = new EventEmitter();
  //It will be set when new trigger is being added.
  newTriggerName: string = null;
  pendingTriggerCallback: Function = null;
  pendingTriggerData: any = null;
  showTriggerDialog: boolean = false;

  // It is for add action callback.
  showActionDialog = false;
  selectedTriggerForAction: any = null;
  addActionFormDirty = false;
  newActionName: string = null;
  pendingActionCallback: Function = null;
  pendingActionData: any = null;
  listOfTrigger: any;
  selectedTrigger: any;

  constructor() {
    // this.listOfAction = this.callback.actions;
    this.listOfTrigger = [];
  }

  ngOnInit() {
    console.log("Calling action trigger OnInit", this.callback);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("Callback is -", this.callback);
    for (let change in changes) {
      console.log("changes is-" , change);
      if (change === 'currentState') {
        console.log("currentState is changed -" , );
        this.getTriggerList();
        this.getActionList();
      }
    }
  }

  stateName: any;
  openDialogTrigger() {
    this.showTriggerDialog = true;
    this.stateName = this.currentState.id;
    this.newTriggerName = 'Trigger_' + this.callback.triggers.length + '';
    // this.triggerList();
  }

  openDialogAction() {
    console.log("triggerList", this.triggerList);
    this.showActionDialog = true;
    this.newActionName = 'Action_' + this.callback.actions.length + '';
    // this.actionList();
  }

  submitAddAction() {
    if (this.selectedTriggerForAction === null) {
      console.log('Trigger not selected.');
      this.addActionFormDirty = true;
    } else {
      let action = new Action(this.newActionName);
      action.id = 'action_' + this.callback.actions.length;
      action.data = new ActionData();
      action.stateId = this.selectedTriggerForAction.stateId;
      action.triggerId = this.selectedTriggerForAction.id;
      this.callback.actions.push(action);
      // this.listOfAction = this.callback.actions;
      // Note: We can have same callback for multiple trigger. That is why need to maintain mapping.

      // this.pendingActionData.text = action.name;
      // this.pendingActionData.id = action.id;

      // Add mapping.
      let map = new Map();
      map.set('state', this.selectedTriggerForAction.stateId);
      map.set('trigger', this.selectedTriggerForAction.id);
      this.callback.actionMap.set(action.id, map);

      // add node.
      // this.pendingActionCallback(this.pendingActionData);
      // this.pendingActionCallback = null;
      // this.pendingActionData = null;
      this.newActionName = null;
      this.showActionDialog = false;

      //add edge.
      // setTimeout(() => {
      //   this.toolkit.addEdge({ source: map.get('trigger'), target: action.id });
      // }, 100);

      // TODO: It has to be taken care by double click.
      console.log('Emitting actionAdded event with data - ', action);
      this.getActionList();
      // this.actionAdded.emit(action);
    }
  }



  addTriggerNode($event: any) {
    console.log('Trigger Added Successfully, event - ', $event);

    let trigger: Trigger = <Trigger>$event;
    trigger.id = 'trigger_' + this.callback.triggers.length;
    // this.pendingTriggerData.text = trigger.name;
    // this.pendingTriggerData.id = trigger.id;
    // this.pendingTriggerCallback(this.pendingTriggerData);
    // this.pendingTriggerCallback = null;
    // this.pendingTriggerData = null;
    this.showTriggerDialog = false;
    this.newTriggerName = null;
    this.callback.triggers.push(trigger);
    let tempTrigger = { label: this.newTriggerName, value: this.newTriggerName };
    this.listOfTrigger.push(tempTrigger);
    // this.listOfTrigger = this.callback.triggers;
    this.getTriggerList();

    console.log("After Adding Trigger", this.callback);

  }


  openChart: boolean = false;
  openflowChart(action) {
    console.log("Current Action", action);
    this.openChart = true;
    this.currentAction.emit(action);
    this.flowChartFlag.emit(this.openChart);
  }

  triggerList: any = [];
  getTriggerList() {
    this.triggerList = [];
    console.log("current State", this.currentState, this.callback.triggers);
    this.callback.triggers.forEach(trigger => {
      if (trigger.stateId === this.currentState.id) {
        this.triggerList.push(trigger);
      }
    })
    console.log("list of trigger", this.triggerList)
    return this.triggerList;
  }

  actionList: any = [];
  getActionList() {
    this.actionList = [];
    console.log("current State", this.currentState, this.callback.actions);
    this.callback.actions.forEach(action => {
      if (action.stateId === this.currentState.id) {
        this.actionList.push(action);
      }
    })
    return this.actionList;
  }


}
