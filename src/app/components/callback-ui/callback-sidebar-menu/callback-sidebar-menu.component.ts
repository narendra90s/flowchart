import { Component, OnInit, EventEmitter, Output, AfterViewInit, AfterContentInit, Input } from '@angular/core';
import { ActionApi, ActionApiList } from 'src/app/interface/action-api';
import { TreeNode, MenuItem } from 'primeng/api/public_api';
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
  actionApiList: { [key: string]: ActionApi[] } = null;
  showApiDialog = false;
  currentActionApi: ActionApi = null;
  apiTreeData: TreeNode[] = [];
  fpToolbarTreeData: TreeNode[] = [];

  // Toolbar tree data for State diagram.
  sdToolbarTreeData: TreeNode[] = [];
  apiCount = 0;
  timer: any = null;
  items: MenuItem[];

  constructor(private cbData: CallbackDataServiceService) {

    console.log("fpToolbarTreeData", this.fpToolbarTreeData);

    this.items = [
      {
        label: 'Condition',
        // data: { type: 'question' },
        icon: 'pi pi-fw pi-file',
        styleClass: 'drag condition'
      },
      {

        label: 'SPA',
        icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'Page Transition Start',
            id: 'cav_nv_ajax_pg_start',
            styleClass: 'drag api',
            title: 'Drag api'
          },
          {
            label: 'Page Transition End',
            id: 'cav_nv_ajax_pg_end',
            styleClass: 'drag api',
            title: 'Drag api'
          },
          {
            label: 'Transaction Start',
            id: 'cav_nv_ajax_start',
            styleClass: 'drag api',
            title: 'Drag api'
          },
          {
            label: 'Transaction Report',
            id: 'cav_nv_ajax_report',
            styleClass: 'drag api',
            title: 'Drag api'
          },
          {
            label: 'Transaction End',
            id: 'cav_nv_ajax_pg_end',
            styleClass: 'drag api',
            title: 'Drag api'
          },

        ]
      },
      {
        label: 'Cookie',
        icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'Set Cookie',
            id: 'setCookie',
            styleClass: 'drag api',
            title: 'Drag api'
          },
          {
            label: 'Remove Cookie',
            id: 'setCookie',
            styleClass: 'drag api',
            title: 'Drag api'
          },
        ]
      },
      {
        label: 'State',
        icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'Goto State',
            id: 'gotoState',
            styleClass: 'drag api',
            title: 'Drag api'
          }
        ]
      },
      {
        label: 'Session_Data',
        icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'Set Session Data',
            id: 'setSessionData',
            styleClass: 'drag api',
            title: 'Drag api'
          }
        ]
      },
      {
        label: 'Session_State',
        icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'Set Session State',
            id: 'setSessionState',
            styleClass: 'drag api',
            title: 'Drag api'
          }
        ]
      },
      {
        label: 'LoginId',
        icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'Set Login Id',
            id: 'setLoginId',
            styleClass: 'drag api',
            title: 'Drag api'
          }
        ]
      },
      {
        label: 'SessionId',
        icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'Set SessionId',
            id: 'setSessionId',
            styleClass: 'drag api',
            title: 'Drag api'
          }
        ]
      },
      {
        label: 'LogEvent',
        icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'Log Event',
            id: 'eventName',
            styleClass: 'drag api',
            title: 'Drag api'
          }
        ]
      },
      {
        label: 'UserSegment',
        icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'Set User Segment',
            id: 'userSegment',
            styleClass: 'drag api',
            title: 'Drag api'
          }
        ]
      },
      {
        label: 'CustomMetric',
        icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'Custom Matric Name',
            id: 'customMetric',
            styleClass: 'drag api',
            title: 'Drag api'
          }
        ]
      },
      {
        label: 'OrderTotal',
        icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'Order Total',
            id: 'orderTotal',
            styleClass: 'drag api',
            title: 'Drag api'
          }
        ]
      }
    ];


    this.actionApiList = ActionApiList.apiList;

    this.apiTreeData = this.apiToTreeData();

    this.fpToolbarTreeData = [{
      label: 'Condition',
      data: { type: 'question' },
      icon: 'fa fa-file'
    }, {
      label: 'Action Apis',
      data: { id: 'action_api', type: 'folder' },
      expandedIcon: 'fa fa-folder-open',
      collapsedIcon: 'fa fa-folder',
      expanded: true,
      children: this.apiTreeData
    }];

    console.log("fpToolbarTreeData", this.fpToolbarTreeData);

    this.sdToolbarTreeData = [
      {
        label: 'State',
        data: {
          type: 'state',
          w: 120,
          h: 70
        },
        icon: 'fa fa-file'
      }
      // {
      //   label: 'Trigger',
      //   data: {
      //     type: 'trigger',
      //     w: 120,
      //     h: 70
      //   },
      //   icon: 'fa fa-file'
      // }, {
      //   label: 'Action',
      //   data: {
      //     type: 'action',
      //     w: 120,
      //     h: 70
      //   },
      //   icon: 'fa fa-file'
      // }
    ];
  }

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
  }


  onDrag($event) {
    console.log('onDrag fired for event - ', $event);
    this.showApiDialog = true;
    this.currentActionApi = $event;
  }

  /*These methods are related to jtk drop functioanlity */
  typeExtractor(el: Element) {
    if (el.getAttribute('jtk-node-type'))
      return el.getAttribute('jtk-node-type');

    // Because of tiered menu we are not able to set attributes. 
    // Get from class. 
    if (el.classList.contains('condition')) {
      return 'question';
    } else if (el.classList.contains('api')) {
      return 'action';
    } else {
      return 'Unknown';
    }
  }

  dataGenerator(type: string, el: Element) {
    // class based draggable element. 
    console.log('dataGenerator on element - ', el);
    if (el.classList.contains('condition')) {
      return {
        type: 'question',
        w: 180,
        h: 70
      };
    } else if (el.classList.contains('api')) {
      return {
        type: 'action',
        w: 180,
        h: 70,
        api: el.querySelector('a').getAttribute('id')
        // api: el.querySelector('a').getAttribute('title').replace('Drag api ', '')
      }
    }


    // TODO: Check if this code is not used then remove. 
    let data = {
      type: el.getAttribute('jtk-node-type'),
      w: parseInt(el.getAttribute('jtk-width'), 10),
      h: parseInt(el.getAttribute('jtk-height'), 10),
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
      node.data = { type: 'folder', id: key };
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
}
