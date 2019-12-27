import { Component, OnInit, OnChanges, EventEmitter, Output } from '@angular/core';
import { Operator } from 'src/app/interface/action-api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { validateConfig } from '@angular/router/src/config';

@Component({
  selector: 'app-callback-action-condition-dialog',
  templateUrl: './callback-action-condition-dialog.component.html',
  styleUrls: ['./callback-action-condition-dialog.component.css']
})
export class CallbackActionConditionDialogComponent implements OnInit, OnChanges {

  @Output() conditionAdded: EventEmitter<any> = new EventEmitter();
  form: FormGroup =  null;
  // TODO: it has to pass by parent component or some other service.
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

  // TODO: operator list has to be generated dynamically on the basis of operand type.
  operatorList: any;

  constructor() {
    this.operatorList = Operator.operatorList;
    // initialise form group.
    this.form = new FormGroup({
      lhs: new FormControl('', Validators.required),
      rhs: new FormControl('', Validators.required),
      operator: new FormControl('', Validators.required)
    });
   }

  ngOnInit() {
  }

  ngOnChanges(){

  }

  onSubmit() {
    console.log('form submitted with value - ', this.form.value);
    this.conditionAdded.emit(this.form.value);
  }
}
