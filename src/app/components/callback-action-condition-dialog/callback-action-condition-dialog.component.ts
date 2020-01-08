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
  extractedData: any = null;
  LocalVar: any = null;
  groupedVariableList: any = null;
  localVar : any ;

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
      items: []
    }, {
      label: 'Local variables',
      value: 'fa fa-cubes',
      items: []
  
    }];
   }

  ngOnInit() {
    console.log("GIT PUSH Works");
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

  ngOnChanges(){
    console.log('ngOnChanges - called',this.extractedData , "\n" ,this.LocalVar);

  }

  onSubmit() {
    console.log('form submitted with value - ', this.form.value);
    this.conditionAdded.emit(this.form.value);
  }

  getGroupedVarData() {
    if (this.extractedData != undefined) {   
      // this.groupedVariableList[0].items = [];   
      for (let i = 0; i < this.extractedData.length; i++) {
        let temp = {label : this.extractedData[i].name , value : this.extractedData[i].name };
        console.log("items og extractedDatas", this.extractedData[i]);
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

  showExtractDialog : any = false;
  openExtractDialog(){
    this.showExtractDialog = true;
  }

  ectractedDataPoint(event){
    console.log("event on submit extractedData",event);
    this.showExtractDialog = false;
  }

  showLocalVarDialog : boolean = false;
  addLocalVar(){    
    let TempLocalVar = {label : this.localVar , value : this.localVar};
    this.groupedVariableList[1].items.push(TempLocalVar);
    this.showLocalVarDialog = false;
  }
}
