import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {DropdownModule} from 'primeng/dropdown';
import { StateType, State } from 'callback';

@Component({
  selector: 'app-sd-addtriggerdialog',
  templateUrl: './sd-addtriggerdialog.component.html',
  styleUrls: ['./sd-addtriggerdialog.component.css']
})
export class SdAddtriggerdialogComponent implements OnInit {

  TriggerTypes: any[];

  @Input() triggerName: string;
  @Input() stateName: string;
  selectedState: any;
  @Input() states: State[];
  @Output() success: EventEmitter<any> = new EventEmitter();
  @Output() close: EventEmitter<any> = new EventEmitter();
  triggerType: any;
  domSelector: string;
  urlPattern: string;
  // First argument mapping.
  firstArgument: any ;
  dirty = false;
  stateList: any[] = [];

  constructor() {
    this.triggerName = 'Trigger1';
    this.stateName = 'State1';
    this.TriggerTypes = [
      {name: 'Click', code: 'CLICK'},
      {name: 'Input Change', code: 'INPUT_CHANGE'},
      {name: 'Visibility Change', code: 'VISIBILITY_CHANGE'},
      {name: 'Content Change', code: 'CONTENT_CHANGE'},
      {name: 'HashChange', code: 'HASHCHANGE'},
      {name: 'XHR Success', code: 'XHR_COMPLETE' },
      {name: 'XHR Failed', code : 'XHR_FAILED'}];

    this.firstArgument = {
      CLICK: 'DOM_SELECTOR',
      INPUT_CHANGE: 'DOM_SELECTOR',
      VISIBILITY_CHANGE: 'DOM_SELECTOR',
      CONTENT_CHANGE: 'DOM_SELECTOR',
      HASHCHANGE: 'NONE',
      XHR_COMPLETE: 'URL_PATTERN',
      XHR_FAILED: 'URL_PATTERN'
    };
   }

  ngOnInit() {
    // If states are given then set the state option.
    this.states.forEach(state => {
      if (state.type != StateType.End)
        this.stateList.push({name: state.name, value: state.id});
    });
  }

  ngOnChange() {
    console.log(' triggerType - ', this.triggerType);
  }

  reset() {
    this.triggerType = null;
    this.domSelector = '';
    this.urlPattern = '';
  }

  submit() {
    const type = this.triggerType ? this.triggerType.code: null; 
    if (type) {
      if (this.firstArgument[type] === 'DOM_SELECTOR' && !(this.domSelector && this.domSelector.length))
      {
        this.dirty = true;
        console.log('form dirty');
        return;
      }
      if (this.firstArgument[type] === 'URL_PATTERN' && !(this.urlPattern && this.urlPattern))
      {
        this.dirty = true;
        console.log('form dirty');
        return;
      }

      const trigger = {stateId: this.selectedState.value, name: this.triggerName, type: type,
        urlPattern: this.urlPattern, domSelector: this.domSelector};
      this.success.emit(trigger);
      console.log('Trigger Dialog Success');
    }
  }
}
