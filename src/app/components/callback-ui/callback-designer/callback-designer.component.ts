import { Component, OnInit, Input } from '@angular/core';
import { Callback, Action, CallBackData } from 'callback';
import { FlowcharthttpserviceService } from 'src/app/service/flowcharthttpservice.service';


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


  constructor( private httpService: FlowcharthttpserviceService) { 
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
    console.log("Add callback called",this.name);
    let callBackData = new CallBackData(this.name , this.onTrigger ,this.description ,"",this.pageid,this.channel,"");
    console.log("callback data ---",this.name ,"\n",this.onTrigger,"\n",this.description,"\n",this.pageid ,"\n",this.channel)
    this.httpService.addCallbacks(callBackData).subscribe((response: any) => {
      callBackData = response;
      if(response){
       this.getCallback();
      }
    });    
    this.name = null;
    this.pageid = null;
    this.description = null;
    this.channel = null;
    this.onTrigger = null;
  }

}
