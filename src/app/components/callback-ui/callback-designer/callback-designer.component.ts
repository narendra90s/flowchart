import { Component, OnInit, Input, Inject } from '@angular/core';
import { Callback, Action, CallBackData } from 'callback';
import { FlowcharthttpserviceService } from 'src/app/service/flowcharthttpservice.service';
import { CallbackDataServiceService } from 'src/app/service/callback-data-service.service';


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
  AddCallbackDialog : boolean = false;
  onTriggerEvents: any;
  onTrigger : any = null;
  name : string=null;
  description : any=null;
  pageid : any = null;
  channel : any = null;
  channels : any;
  page : any;


  constructor( private httpService: FlowcharthttpserviceService ,@Inject(CallbackDataServiceService) public CallbackDataServiceService) { 
    console.log("CallbackDataServiceService callbackObj data",this.CallbackDataServiceService.callbackObj);
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
  callbackList: any;
  ngOnInit() {
    this.getCallback();
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

  getCallback(){
    this.httpService.getCallbacks().subscribe((response: any) => {
      this.callbackList = response;
    });
    // this.callbackService.broadcast('change', this.callbackService.callbackObj);
  }

  addCallbackData(){
    // let callback = new CallBack();
    console.log("Add callback called",this.name , this.callback );
    let callBackData = new CallBackData(this.name , this.onTrigger ,this.description ,"",this.pageid,this.channel,this.callback);
    console.log("callback data ---",this.name ,"\n",this.onTrigger,"\n",this.description,"\n",this.pageid ,"\n",this.channel)
    this.httpService.addCallbacks(callBackData).subscribe((response: any) => {
      console.log("CBDATA",callBackData);
      callBackData = response;
      if(response){
       this.getCallback();
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

  selectedCallback(callback){
    console.log("select Called",callback);
    this.callback = callback;

    // this.CallbackDataServiceService.callbackObj = callback;
    // this.CallbackDataServiceService.broadcast('change',this.CallbackDataServiceService.callbackObj);
    // this.CallbackDataServiceService.broadcast('selected',this.CallbackDataServiceService.callbackObj);
  }

}
