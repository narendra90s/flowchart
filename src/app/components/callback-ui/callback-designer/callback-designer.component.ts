import { Component, OnInit, Input } from '@angular/core';
import { Callback, Action } from 'callback';


@Component({
  selector: 'app-callback-designer',
  templateUrl: './callback-designer.component.html',
  styleUrls: ['./callback-designer.component.css']
})



export class CallbackDesignerComponent implements OnInit {

  static STATE_DIAGRAM_TAB = 0;
  static FLOW_CHART_TAB = 1;
  static SOURCE_CODE_TAB = 2;

  activeTabIndex: number = CallbackDesignerComponent.STATE_DIAGRAM_TAB;
  currentAction: Action = null;
  sidebarLoaded = false;

  constructor() { }
  @Input() callback: Callback;

  ngOnInit() {
  }

  addCallback() {
    this.callback = new Callback();
  }

  // Event will be triggered by sd when a new action is added.
  actionAdded($event) {
    console.log('Event actionAdded called', $event);
    if (this.callback && this.callback.actions.length > 0) {
      this.currentAction = this.callback.actions[0];
    }
  }

}
