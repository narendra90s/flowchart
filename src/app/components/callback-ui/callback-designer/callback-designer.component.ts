import { Component, OnInit, Input, Inject, OnChanges } from '@angular/core';
import { Callback, Action, CallBackData, State } from 'callback';
import { FlowcharthttpserviceService } from 'src/app/service/flowcharthttpservice.service';
import { CallbackDataServiceService } from 'src/app/service/callback-data-service.service';
import { state } from '@angular/animations';


@Component({
  selector: 'app-callback-designer',
  templateUrl: './callback-designer.component.html',
  styleUrls: ['./callback-designer.component.css']
})



export class CallbackDesignerComponent implements OnInit {

  static STATE_DIAGRAM_TAB = 0;
  static FLOW_CHART_TAB = 1;
  static SOURCE_CODE_TAB = 2;
  static TriggerActionSideBar = 3;
  static TRUE = true;
  static FALSE = false;

  activeTabIndex: number = CallbackDesignerComponent.STATE_DIAGRAM_TAB;
  openFlag: boolean = false;
  currentAction: Action = null;
  currentState : State = null;
  sidebarLoaded = false;
  AddCallbackDialog : boolean = false;
  onTriggerEvents: any;
  onTrigger : any = null;
  name : string=null;
  description : any=null;
  pageid : any = null;
  channel : any = null;
  channels : any;
  page : any;


  constructor( private httpService: FlowcharthttpserviceService , private cbService: CallbackDataServiceService) { 

    this.onTriggerEvents = [
      { label: 'Page Ready', value: '1' },
      { label: 'After Beacon', value: '2' },
      { label: 'Page Unload', value: '3' }
    ];

    //TODO : Call metadata service and fill the page and channel option

    this.page = [
      { label: 'Home', value: 'home' },
      { label: 'Cart', value: 'cart' },
      { label: 'Login', value: 'login' },
    ];

    this.channels = [
      { label: 'Desktop', value: '0' },
      { label: 'Mobile', value: '1' },
      { label: 'All', value: '-1' },      
    ]


    /*
    this.metaDataService.getMetadata().subscribe(response => {
      this.metadata = response
      console.log("metadata response---", response);
      // -------channel----------
      let channelm: any[] = Array.from(this.metadata.channelMap.keys());
      this.channels = channelm.map(key => {
        return {
          label: this.metadata.channelMap.get(key).name,
          value: this.metadata.channelMap.get(key).id
        }
      });
      // -------pages------------
      let pagem: any[] = Array.from(this.metadata.pageNameMap.keys());
      this.page = pagem.map(key => {
        return {
          label: this.metadata.pageNameMap.get(key).name,
          value: this.metadata.pageNameMap.get(key).id
        }
      });
    });
    */
  }
  @Input() callback: Callback;
  callbackList: any[];
  callbackEntry: any = null;
  ngOnInit() {
    this.getCallback(null);

    // register editAction.
    this.cbService.on('editAction').subscribe(data => this.editAction(data));

    this.cbService.on('editState').subscribe(data => this.editState(data));


    // register for change in localvariable and global variable
    this.cbService.currentCbData.subscribe(dataPoints => {
      if (this.callback) {
        this.callback.dataPoints = dataPoints;
      }
    });
    // this.cbService.currentLocalData.subscribe(localVariables => {
    //   if (this.callback) {
    //     this.callback.localVariables = localVariables;
    //   }
    // });
  }

  // ngOnChanges(){
  //   this.activeTabIndex = CallbackDesignerComponent.TriggerActionSideBar;
  // }

  editAction(obj) {
    let actionId = obj.id;
    console.log('editAction called for action id', actionId);

    if (this.callback === null) {
      alert('No Callback selected');
      return;
    }

    let match = this.callback.actions.some((action) => {
      if(action.id === actionId) {
        console.log('Edit action, matched action - ', action);
        this.currentAction = action;
        this.activeTabIndex = CallbackDesignerComponent.FLOW_CHART_TAB;
        // switch the tab.
        return true;
      }
      return false;
    });

    if (match === false) {
      alert('No Action matched for id - '+ actionId);
      return;
    }
  }

  openFlagChanged($event)
  {
    this.openFlag = $event;
  }

  editState(obj){
    let stateId = obj.id;

    console.log('editState called for state id and flag', this.openFlag, stateId ,this.activeTabIndex);

    if (this.callback === null) {
      alert('No Callback selected');
      return;
    }

    let match = this.callback.states.some((state) => {
      if(state.id === stateId) {
        console.log('Edit state, matched state - ', state , this.openFlag);
        this.currentState = state;
        this.openFlag = CallbackDesignerComponent.TRUE;
        console.log('Edit state, matched state -2 ', state , this.openFlag);
        //insted of tab we need to show right pannel
        this.activeTabIndex = CallbackDesignerComponent.TriggerActionSideBar;
        return true;
      }
      return false;
    });

    if (match === false) {
      alert('No State matched for id - '+ stateId);
      return;
    }

  }

  addCallback() {
    this.AddCallbackDialog = true;
    // this.addCallbackData();
    this.callback = new Callback();
  }

  // Event will be triggered by sd when a new action is added.
  actionAdded($event) {
    console.log('Event actionAdded called', $event);
    if (this.callback && this.callback.actions.length > 0) {
      this.currentAction = this.callback.actions[0];
    }
  }

  stateAdded($event){
    console.log("event on state emit",$event);
    if(this.callback && this.callback.states.length > 0){
      this.currentState = this.callback.states[0];
    }
  }

  getCallback(name){
    this.httpService.getCallbacks().subscribe((response: any) => {
      this.callbackList = response;

      if (this.callbackList.length === 0) {
        return;
      }

      // select current callback.
      if (name === null) {
        this.callbackEntry = this.callbackEntry[0];
        this.callback = this.callbackEntry.jsondata;
        return;
      } else {
        this.callbackList.some(cb => {
          if (cb.name === name) {
            this.callbackEntry  = cb;
            this.callback = cb.jsondata;
            this.deserializeActionMap(this.callback);
            return true;
          } 
          return false;
        });
      }

      // broadcast changed global and local variable list. 
      this.cbService.ChangeDataPoint(this.callback.dataPoints);

      // this.cbService.ChangeLocalVariable(this.callback.localVariables);
    });
    // this.callbackService.broadcast('change', this.callbackService.callbackObj);
  }

  addCallbackData() {
    // let callback = new CallBack();
    console.log("Add callback called",this.name , this.callback );
    let callBackData = new CallBackData(this.name , this.onTrigger ,this.description ,"",this.pageid,this.channel,this.callback);
    console.log("callback data ---",this.name ,"\n",this.onTrigger,"\n",this.description,"\n",this.pageid ,"\n",this.channel)
    this.httpService.addCallbacks(callBackData).subscribe((response: any) => {
      console.log("CBDATA",callBackData);
      callBackData = response;
      if(response){
       this.getCallback(this.name);
      }
    }); 
    
    
    // this.CallbackDataServiceService.callbackObj = callBackData;
    // this.CallbackDataServiceService.callbacks.push(callBackData);
    // this.CallbackDataServiceService.broadcast('change',this.CallbackDataServiceService.callbackObj);
    // this.selectedCallback(callBackData);


    this.name = null;
    this.pageid = null;
    this.description = null;
    this.channel = null;
    this.onTrigger = null;
  }

  deserializeActionMap(callback) {
    let obj = callback.actionMap;
    let map:Map<string, Map<string, string>> = new Map();
    for (let key in obj) {
      let valueMap: Map<string, string> = new Map();
      for (let k in obj[key]) {
        valueMap.set(k, obj[key][k]);
      }
      map.set(key, valueMap);
    }

    console.log('actionMap after deserialise ', map);
    callback.actionMap = map;
  }

  selectedCallback(callbackEntry) {
    console.log('select Called', callbackEntry);
    this.callbackEntry = callbackEntry;

    if (typeof callbackEntry.jsondata === 'string') {
      this.callback = JSON.parse(callbackEntry.jsondata);
    } else {
      this.callback = callbackEntry.jsondata;
    }

    this.deserializeActionMap(this.callback);

    // broadcast changed global and local variable list. 
    this.cbService.ChangeDataPoint(this.callback.dataPoints);

    // this.cbService.ChangeLocalVariable(this.callback.localVariables);

    // this.CallbackDataServiceService.callbackObj = callback;
    // this.CallbackDataServiceService.broadcast('change',this.CallbackDataServiceService.callbackObj);
    // this.CallbackDataServiceService.broadcast('selected',this.CallbackDataServiceService.callbackObj);
  }

  // TODO: acknowledge by message that successfully saved.
  saveCallback() {
    if (this.callbackEntry) {
      this.httpService.updateCallback(this.callbackEntry);
    }
  }


  newTriggerName: string = null;
  visibleSidebar : boolean;
  closeSideBar(){
    this.activeTabIndex = CallbackDesignerComponent.STATE_DIAGRAM_TAB;
    this.visibleSidebar = false;
  }

  AddTriggerDialog : boolean = false;
  addTrigger(){
    console.log("callback data --- ",this.callback);
    this.AddTriggerDialog = true;
  }


  select : boolean;
  currentActionGet($event){
    this.currentAction = $event;
    this.select = true;
  }

}
