import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { ActionApi, ApiArgument } from 'src/app/interface/action-api';
import { SelectItem, SelectItemGroup } from 'primeng/api';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { CallbackDataServiceService } from 'src/app/service/callback-data-service.service';
import { Callback } from 'callback';
import { MatDialog } from '@angular/material';
import { ExtractdataComponent } from '../extractdata/extractdata.component';


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
  localVariableList: any = [];
  extractedData: any = null;
  // LocalVar: any = null;
  localVar : any ;
  stateList: any[] = [];
  sessionStateList: any = [];
  constructor(private dpData: CallbackDataServiceService , public dialog: MatDialog) {
    this.groupedVariableList = [{
      label: 'Data points',
      value: 'fa fa-mixcloud',
      items: []
    }, {
      label: 'Local variables',
      value: 'fa fa-cubes',
      items: []
    }];

    this.sessionStateList = [
      {label : "BROWSER" , value: "BROWSER"},
      {label : "SHOPPER" , value: "SHOPPER"},
      {label : "BUYER" , value: "BUYER"}
    ]
  }

  ngOnInit() {
    this.groupedVariableList[1].items = [];
    this.groupedVariableList[0].items = [];

    this.dpData.currentCbData.subscribe((extractedData) => {
      if (extractedData && extractedData.length) {
        this.extractedData = extractedData;
      } else {
        this.extractedData = [];
      }
      this.getGroupedVarData();
    });
    this.getGroupedVarData();
   }

  ngOnChanges() {
    // console.log('ngOnChanges called', this.extracteddata, "\n", this.groupedVariableList);
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

    if (this.api.category === 'localVarApi') {
      this.localVariableList = [this.groupedVariableList[1]];
    }

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
    if (this.extractedData != undefined) {      
      for (let i = 0; i < this.extractedData.length; i++) {
        let temp = {label : this.extractedData[i].name , value : this.extractedData[i].name };
        console.log("items og DataPoints", this.groupedVariableList[0].items[i]);
        this.groupedVariableList[0].items[i] = temp;
      }
    }
  }

  showExtractDialog : any = false;
  openExtractDialog(){
    this.showExtractDialog = true;
  }

  ectractedDataPoint(event){
    console.log("event on submit datapoint",event);
    this.showExtractDialog = false;
  }

  showLocalVarDialog : boolean = false;
  addLocalVar(){    
    let TempLocalVar = {label : this.localVar , value : this.localVar};
    this.groupedVariableList[1].items.push(TempLocalVar);
    this.showLocalVarDialog = false;
  }

}
