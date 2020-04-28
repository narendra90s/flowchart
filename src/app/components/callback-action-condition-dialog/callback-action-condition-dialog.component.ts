import { Component, OnInit, OnChanges, EventEmitter, Output, Input } from '@angular/core';
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
  @Input() args: any;
  form: FormGroup = null;

  // TODO: operator list has to be generated dynamically on the basis of operand type.
  operatorList: any;
  extractedData: any = null;
  LocalVar: any = null;
  groupedVariableList: any = null;
  localVar: any;

  constructor(private dpData: CallbackDataServiceService) {
    this.operatorList = Operator.operatorList;


  }


  addLocal() {    
    this.form.addControl('localVar' , new FormControl(''));
    this.showLocalVarDialog = true;
  }

  ngOnInit() {
    this.getGroupedVarData();

    this.setForm();

    // register for change. 
    this.dpData.on('addedLocalVar').subscribe(data => this.getGroupedVarData());
    this.dpData.on('addedDataPoint').subscribe(data => this.getGroupedVarData());
  }

  setForm() {
    let args = this.args || {};
    // initialise form group.
    this.form = new FormGroup({
      lhs: new FormControl(args['lhs'] || '', Validators.required),
      rhs: new FormControl(args['rhs'] || '', Validators.required),
      operator: new FormControl(args['operator'] || '', Validators.required),
    });
  }

  ngOnChanges() {
    console.log('ngOnChanges - called', this.extractedData, "\n", this.LocalVar);

    // new args may received.
    this.setForm();
  }

  onSubmit() {
    console.log('form submitted with value - ', this.form.value);
    this.conditionAdded.emit(this.form.value);
    this.clearForm();
  }

  clearForm(){
    this.form.reset();
  }

  getGroupedVarData() {
        console.log('getGroupedVarData called');
        // TODO: it has to pass by parent component or some other service.
        this.groupedVariableList = [{
          label: 'Data points',
          value: 'fa fa-mixcloud',
          items: []
        }, {
          label: 'Local variables',
          value: 'fa fa-cubes',
          items: []
    
        }];

    let dataPoints = this.dpData.getDataPoint();
    let localVars = this.dpData.getLocalVar();

    console.log('dataPoints - ', dataPoints.length, ', localVars - ' +  localVars.length);
    if (dataPoints) {
      // this.groupedVariableList[0].items = [];   
      for (let i = 0; i < dataPoints.length; i++) {
        let temp = { label: dataPoints[i].name, value: dataPoints[i].name };
        this.groupedVariableList[0].items[i] = temp;
      }
    }
    if (localVars) {
      for (let i = 0; i < localVars.length; i++) {
        // this.groupedVariableList[1].items = [];
        console.log("items of localVar", localVars[i]);
        this.groupedVariableList[1].items[i] = {label: localVars[i].name, value: localVars[i].name};
      }
    }
  }

  showExtractDialog: any = false;
  openExtractDialog() {
    this.showExtractDialog = true;
  }

  ectractedDataPoint(event) {
    console.log("event on submit extractedData", event);
    this.showExtractDialog = false;
  }

  showLocalVarDialog: boolean = false;
  addLocalVar() {
    // let TempLocalVar = { label: this.localVar, value: this.localVar };
    this.dpData.addLocalVar({name: this.localVar});
    this.showLocalVarDialog = false;
  }

  allowDrop(ev) {
    console.log('condition-dd: allowDrop called');
    ev.preventDefault();
  }

  drop(ev, target) {
    const value = ev.dataTransfer.getData('text');
    console.log('condition-dd: drop with value - ' +  value);
    // set the value.
    switch(target) {
      case 'lhs' : 
        this.form.controls['lhs'].patchValue(value);
    }
  }
}
