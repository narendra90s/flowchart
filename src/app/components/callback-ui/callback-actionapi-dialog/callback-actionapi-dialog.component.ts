import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { ActionApi, ApiArgument } from 'src/app/interface/action-api';
import {SelectItem, SelectItemGroup} from 'primeng/api';
import { FormControl, Validators, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-callback-actionapi-dialog',
  templateUrl: './callback-actionapi-dialog.component.html',
  styleUrls: ['./callback-actionapi-dialog.component.css']
})
export class CallbackActionapiDialogComponent implements OnInit, OnChanges {

  @Input() api: ActionApi;
  @Output() actionApiSubmit: EventEmitter<any> = new EventEmitter();
  groupedVariableList: any = [{
    label: 'Data points',
    value: 'fab fa-accusoft',
    items: [{
      label: 'dataPoint1', value: 'DP::dataPoint1',
    }, {
      label: 'dataPoint2', value: 'DP::dataPoint2'
    }]
  }, {
    label: 'Local variables',
    value: 'fa fa-cubes',
    items: [{
      label: 'localVar1', value: 'Local::localVar1',
    }, {
      label: 'localVar2', value: 'Local::localVar2'
    }]

  }];
  form: FormGroup;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    console.log('ngOnChanges called');
    // TODO: Check if input will be available in constructor. if so then move this code in constructor.
    // create form group for api fields.
    this.form = this.toFormGroup(this.api.arguments);
    console.log('form group initialized');
  }

  toFormGroup(args: ApiArgument[])  {
    const group: any = {};

    args.forEach(argument => {
      console.log('toFormGroup : argiment name - ', argument.name);
      group[argument.name] = argument.required ? new FormControl('', Validators.required) : new FormControl('');
    });

    return new FormGroup(group);
  }

  onSubmit() {
    console.log('Form submitted successfully. value - ' , this.form.value);
    this.actionApiSubmit.emit({api: this.api, argument: this.form.value});
  }

}
