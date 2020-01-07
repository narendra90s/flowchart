import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { ActionApi, ApiArgument } from 'src/app/interface/action-api';
import { SelectItem, SelectItemGroup } from 'primeng/api';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { CallbackDataServiceService } from 'src/app/service/callback-data-service.service';
import { Callback } from 'callback';


@Component({
  selector: 'app-callback-actionapi-dialog',
  templateUrl: './callback-actionapi-dialog.component.html',
  styleUrls: ['./callback-actionapi-dialog.component.css']
})
export class CallbackActionapiDialogComponent implements OnInit, OnChanges {

  @Input() api: ActionApi;
  // It is needed to show state in state Api.
  @Input() callback: Callback;
  @Output() actionApiSubmit: EventEmitter<any> = new EventEmitter();

  form: FormGroup;

  groupedVariableList: any;
  DataPoint: any = null;
  LocalVar: any = null;
  stateList: any[] = [];
  constructor(private dpData: CallbackDataServiceService) {
    this.groupedVariableList = [{
      label: 'Data points',
      value: 'fa fa-mixcloud',
      items: []
    }, {
      label: 'Local variables',
      value: 'fa fa-cubes',
      items: []
    }];
  }

  ngOnInit() {
    this.groupedVariableList[1].items = [];
    this.groupedVariableList[0].items = [];

    this.dpData.currentCbData.subscribe((DataPoint) => {
      if (DataPoint && DataPoint.length) {
        this.DataPoint = DataPoint;
      } else {
        this.DataPoint = [];
      }
      this.getGroupedVarData();
    });
    this.dpData.currentLocalData.subscribe(LocalVar => {
      if (LocalVar && LocalVar.length) {
        this.LocalVar = LocalVar;
      } else {
        this.LocalVar = [];
      }
      this.getGroupedVarData();
    });
    this.getGroupedVarData();
   }

  ngOnChanges() {
    // console.log('ngOnChanges called', this.DataPoint, "\n", this.groupedVariableList);
    // TODO: Check if input will be available in constructor. if so then move this code in constructor.
    // create form group for api fields.
    if (this.api) {
      this.form = this.toFormGroup(this.api.arguments);
    }

    // Check if gotoState api then set stateList too.
    this.stateList = [];
    this.callback.states.forEach(state => {
      this.stateList.push({label: state.text, value: state.id});
    });
    console.log('form group initialized');
  }

  toFormGroup(args: ApiArgument[]) {
    const group: any = {};

    args.forEach(argument => {
      console.log('toFormGroup : argiment name - ', argument.name);
      group[argument.name] = argument.required ? new FormControl('', Validators.required) : new FormControl('');
    });

    return new FormGroup(group);
  }

  onSubmit() {
    console.log('Form submitted successfully. value - ', this.form.value);
    this.actionApiSubmit.emit({ api: this.api, argument: this.form.value });
  }


  getGroupedVarData() {
    if (this.DataPoint != undefined) {   
      // this.groupedVariableList[0].items = [];   
      for (let i = 0; i < this.DataPoint.length; i++) {
        let temp = {label : this.DataPoint[i].label , value : this.DataPoint[i].label };
        console.log("items og DataPoints", this.DataPoint[i]);
        this.groupedVariableList[0].items[i] = temp;
      }
    }
    if (this.LocalVar != undefined) {
      for (let i = 0; i < this.LocalVar.length; i++) {
        // this.groupedVariableList[1].items = [];
        console.log("items of localVar", this.LocalVar[i]); 
        this.groupedVariableList[1].items[i] = this.LocalVar[i];
      }
    }
  }

}
