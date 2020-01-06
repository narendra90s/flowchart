import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { ActionApi, ApiArgument } from 'src/app/interface/action-api';
import { SelectItem, SelectItemGroup } from 'primeng/api';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { CallbackDataServiceService } from 'src/app/service/callback-data-service.service';


@Component({
  selector: 'app-callback-actionapi-dialog',
  templateUrl: './callback-actionapi-dialog.component.html',
  styleUrls: ['./callback-actionapi-dialog.component.css']
})
export class CallbackActionapiDialogComponent implements OnInit, OnChanges {

  @Input() api: ActionApi;
  @Output() actionApiSubmit: EventEmitter<any> = new EventEmitter();

  form: FormGroup;

  groupedVariableList: any;
  DataPoint: any = null;
  LocalVar: any = null;
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
    
   }

  ngOnChanges() {
    this.groupedVariableList[1].items = [];
    this.groupedVariableList[0].items = [];
    this.dpData.currentCbData.subscribe(DataPoint => this.DataPoint = DataPoint);
    this.dpData.currentLocalData.subscribe(LocalVar => this.LocalVar = LocalVar);
    // console.log('ngOnChanges called', this.DataPoint, "\n", this.groupedVariableList);
    // TODO: Check if input will be available in constructor. if so then move this code in constructor.
    // create form group for api fields.
    if (this.api)
      this.form = this.toFormGroup(this.api.arguments);
    console.log('form group initialized');
    this.getGroupedVarData();
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
