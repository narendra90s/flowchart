import { Component, OnInit, EventEmitter, Output, AfterViewInit, AfterContentInit, Input } from '@angular/core';
import { ActionApi, ActionApiList } from 'src/app/interface/action-api';
import { TreeNode } from 'primeng/api/public_api';
import { trigger } from '@angular/animations';
import { CallbackDataServiceService } from 'src/app/service/callback-data-service.service';


@Component({
  selector: 'app-callback-sidebar-menu',
  templateUrl: './callback-sidebar-menu.component.html',
  styleUrls: ['./callback-sidebar-menu.component.css']
})
export class CallbackSidebarMenuComponent implements OnInit {

  @Output() loaded: EventEmitter<any> = new EventEmitter();
  @Input() selectedTabIndex: number;
  actionApiList: {[key: string]: ActionApi[]} = null;
  showApiDialog = false;
  currentActionApi: ActionApi = null;
  apiTreeData: TreeNode[] = [];
  fpToolbarTreeData: TreeNode[] = [];

  // Toolbar tree data for State diagram.
  sdToolbarTreeData: TreeNode[] = [];
  apiCount = 0;
  timer: any = null;
  dataPointDisplay: boolean = false;
  name: string = null;
  source: any = null;
  type: any = null;
  dataType: any = null;
  dataSource: any = null;
  eleProperty: any = null;
  eleStyle: any = null;
  cssSelector: any = null;
  Property: any = null;
  urlProperties: any = null;
  varList: any = [];
  dataPointList : any = [];
  attributeName: any = null;
  elementStyle: any = null;
  urlProperty: any = null;
  cookieName: any = null;

  constructor(private cbData: CallbackDataServiceService) {
    this.actionApiList = ActionApiList.apiList;

    this.apiTreeData = this.apiToTreeData();

    this.fpToolbarTreeData = [{
      label: 'Condition',
      data: { type: 'question'},
      icon: 'fa fa-file'
    }, {
      label: 'Action Apis',
      data: {id: 'action_api', type: 'folder'},
      expandedIcon: 'fa fa-folder-open',
      collapsedIcon: 'fa fa-folder',
      expanded: true,
      children: this.apiTreeData
    }];

    this.sdToolbarTreeData = [{
      label: 'State',
      data: {
        type: 'state',
        w: 120,
        h: 70
      },
      icon: 'fa fa-file'
    }, {
      label: 'Trigger',
      data: {
        type: 'trigger',
        w: 120,
        h: 70
      },
      icon: 'fa fa-file'
    }, {
      label: 'Action',
      data: {
        type: 'action',
        w: 120,
        h: 70
      },
      icon: 'fa fa-file'
    }];


    this.dataType = [
      { label: 'Scaler', value: 'scaler' },
      { label: 'Vector', value: 'vector' }
    ];
    this.type = "scaler";

    this.dataSource = [
      { label: 'Select Source', value: null },
      { label: 'Element', value: 'ele' },
      { label: 'Url', value: 'url' },
      { label: 'Cookie', value: 'cookie' },
      { label: 'Code snippet', value: 'code' }
    ];

    this.eleProperty = [
      { label: 'Select Property', value: null },
      { label: 'Self', value: 'self' },
      { label: 'Text', value: 'text' },
      { label: 'Class', value: 'clsss' },
      { label: 'Attribute', value: 'attribute' },
      { label: 'Style', value: 'style' }
    ];
    this.eleStyle = [
      { label: 'Select Style', value: null },
      { label: 'Display', value: 'display' },
      { label: 'Height', value: 'height' },
      { label: 'Width', value: 'width' },
      { label: 'Position', value: 'position' },
      { label: 'Custom', value: 'custom' }
    ];

    this.urlProperties = [
      { label: 'Select Url Properties', value: null },
      { label: 'Host', value: 'host' },
      { label: 'Hostname', value: 'hostname' },
      { label: 'Origin', value: 'origin' },
      { label: 'Path', value: 'path' },
      { label: 'Href', value: 'href' },
      { label: 'Search', value: 'search' },
      { label: 'Protocol', value: 'protocol' }
    ]
  }

  DataPoint : any;
  LocalVar : any;
  ngOnInit() {
    // set a timeinterval to check if api list is rendered or not.
    this.timer = setInterval(() => {
      if (document.querySelectorAll('.action-api').length >= this.apiCount) {
        setTimeout(() => {
          this.loaded.emit(true);
          console.log('sidebar loaded at - ', performance.now());
        }, 100);
        clearInterval(this.timer);
      }
    }, 100);
    this.cbData.currentCbData.subscribe(DataPoint => {
      if (DataPoint && DataPoint.length) {
        this.dataPointList = DataPoint;
      } else {
        this.dataPointList = [];
      }
    });
    this.cbData.currentLocalData.subscribe(LocalVar => {
      if (LocalVar && LocalVar.length) {
        this.varList = LocalVar;
      } else {
        this.varList = [];
      }
    });
  }


  onDrag($event) {
    console.log('onDrag fired for event - ', $event);
    this.showApiDialog = true;
    this.currentActionApi = $event;
  }

  /*These methods are related to jtk drop functioanlity */
  typeExtractor(el: Element) {
    return el.getAttribute('jtk-node-type');
  }

  dataGenerator(type:string, el:Element) {
    let data =  {
      type:el.getAttribute('jtk-node-type'),
      w:parseInt(el.getAttribute('jtk-width'), 10),
      h:parseInt(el.getAttribute('jtk-height'), 10),
    };

    // check if this is action-api then return api data too.
    console.log('dataGenerator on element - ', el);
    if (el.getAttribute('api') !== null) {
      data['api'] = el.getAttribute('api');
    }

    return data;
  }


  apiToTreeData(): TreeNode[] {
    const apis = [];
    // tslint:disable-next-line: forin
    for (const key in this.actionApiList) {
      const node: TreeNode = {};
      node.label = key;
      node.data = {type: 'folder', id: key};
      node.expandedIcon = 'fa fa-folder-open';
      node.collapsedIcon = 'fa fa-folder';
      // Note: we are keeping node expanded otherwise it will not be rendered on onload and that is why,
      // jsplumb will not be able to mark that draggable.
      node.expanded = true;
      node.children = [];

      this.actionApiList[key].forEach(api => {
        const n: TreeNode = {};
        n.label = api.label;
        n.data = api;
        n.icon = 'fa fa-file';
        node.children.push(n);
        this.apiCount++;
      });

      apis.push(node);
    }

    console.log('tree data for apis - ', apis);
    return apis;
  }


  showDialogDataPoint() {
    this.dataPointDisplay = true;
  }
  addDataPoint() {
    // FIXME: clean this code.
    //TODO : Store the dataPoint OBJ.
    console.log("data",this.name , this.type ,this.source ,this.cssSelector , this.Property ,this.attributeName ,this.elementStyle , this.urlProperty ,this.cookieName );
    let jsob = {
      label : this.name,
      type : this.type,
      source : this.source,
      cssSelector : this.cssSelector,
      Property : this.Property,
      attributeName : this.attributeName,
      elementStyle : this.elementStyle,
      urlProperty : this.urlProperty,
      cookieName : this.cookieName 
    };   
    this.dataPointList.push(jsob);
    /**TODO : Send this.dataPointList to action-apidialog groupedVariableList : items <Through service> */
    this.newDataPointList();
    // console.log("Comming objdata",this.dataPointList , this.cbData);
    this.name = null;
    this.type = null;
    this.source = null;
    this.cssSelector = null;
    this.Property = null;
    this.attributeName = null;
    this.elementStyle = null;
    this.urlProperty = null;
    this.cookieName = null;
  }

  newDataPointList() {
    console.log("calling newMessage");
    this.cbData.ChangeDataPoint(this.dataPointList);
  }

  newLocalVarList(){
    this.cbData.ChangeLocalVariable(this.varList);
  }

  deleteRecordDP(ind) {
    console.log("deleterec", ind);
    this.dataPointList.splice(ind, 1);
    this.newDataPointList();
  }

  localVar: any = null;
  addLocalVariable() {
    let locVar = { label: this.localVar, value: this.localVar };
    if (this.localVar != null || this.localVar != undefined)
      this.varList.push(locVar);
    this.newLocalVarList();
    console.log("varList", this.varList, "\n", locVar);
    this.localVar = null;
  }

  deleteRecord(ind) {
    console.log("deleterec", ind);
    this.varList.splice(ind, 1);
    this.newLocalVarList();
  }
}
