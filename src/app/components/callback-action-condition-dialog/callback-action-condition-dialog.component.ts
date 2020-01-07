import { Component, OnInit, OnChanges, EventEmitter, Output } from '@angular/core';
import { Operator } from 'src/app/interface/action-api';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { validateConfig } from '@angular/router/src/config';
import { CallbackDataServiceService } from 'src/app/service/callback-data-service.service';

@Component({
  selector: 'app-callback-action-condition-dialog',
  templateUrl: './callback-action-condition-dialog.component.html',
  styleUrls: ['./callback-action-condition-dialog.component.css']
})
export class CallbackActionConditionDialogComponent implements OnInit, OnChanges {

  @Output() conditionAdded: EventEmitter<any> = new EventEmitter();
  form: FormGroup =  null;
  
  // TODO: operator list has to be generated dynamically on the basis of operand type.
  operatorList: any;
  DataPoint: any = null;
  LocalVar: any = null;
  groupedVariableList: any = null;

  constructor(private dpData: CallbackDataServiceService) {
    this.operatorList = Operator.operatorList;
    // initialise form group.
    this.form = new FormGroup({
      lhs: new FormControl('', Validators.required),
      rhs: new FormControl('', Validators.required),
      operator: new FormControl('', Validators.required)
    });

    // TODO: it has to pass by parent component or some other service.
    this.groupedVariableList = [{
      label: 'Data points',
      value: 'fa fa-mixcloud',
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
   }

  ngOnInit() {
    console.log("GIT PUSH Works");
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

  ngOnChanges(){
    console.log('ngOnChanges - called',this.DataPoint , "\n" ,this.LocalVar);

  }

  onSubmit() {
    console.log('form submitted with value - ', this.form.value);
    this.conditionAdded.emit(this.form.value);
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
