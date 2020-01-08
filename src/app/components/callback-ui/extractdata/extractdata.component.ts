import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Callback } from 'callback';
import { CallbackDataServiceService } from 'src/app/service/callback-data-service.service';

@Component({
  selector: 'app-extractdata',
  templateUrl: './extractdata.component.html',
  styleUrls: ['./extractdata.component.css']
})
export class ExtractdataComponent implements OnInit {

  @Output() extractedData: EventEmitter<any> = new EventEmitter();

  form: FormGroup = null;
  dataType: any;
  dataSource: any;
  eleProperty: any;
  urlProperties: any;
  eleStyle: any;

  extractedDataList : any = [];

  constructor(private callbackdataservice: CallbackDataServiceService) {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      source: new FormControl('', Validators.required),
      cssSelector: new FormControl(''),
      property: new FormControl(''),
      attributeName : new FormControl(''),
      elementStyle : new FormControl(''),
      urlProperty : new FormControl(''),
      cookieName : new FormControl(''),
    });

    this.dataType = [
      { label: 'Scaler', value: 'scaler' },
      { label: 'Vector', value: 'vector' }
    ];

    this.dataSource = [
      { label: 'Select Source', value: null },
      { label: 'Element', value: 'ele' },
      { label: 'Url', value: 'url' },
      { label: 'Cookie', value: 'cookie' },
      { label: 'Code snippet', value: 'code' }
    ];
    
    this.eleProperty = [
      { label: 'Select Property', value: null },
      { label: 'Self', value: 'self' },
      { label: 'Text', value: 'text' },
      { label: 'Class', value: 'clsss' },
      { label: 'Attribute', value: 'attribute' },
      { label: 'Style', value: 'style' }
    ];

    this.eleStyle = [
      { label: 'Select Style', value: null },
      { label: 'Display', value: 'display' },
      { label: 'Height', value: 'height' },
      { label: 'Width', value: 'width' },
      { label: 'Position', value: 'position' },
      { label: 'Custom', value: 'custom' }
    ];

    this.urlProperties = [
      { label: 'Select Url Properties', value: null },
      { label: 'Host', value: 'host' },
      { label: 'Hostname', value: 'hostname' },
      { label: 'Origin', value: 'origin' },
      { label: 'Path', value: 'path' },
      { label: 'Href', value: 'href' },
      { label: 'Search', value: 'search' },
      { label: 'Protocol', value: 'protocol' }
    ]
  }

  ngOnInit() {
    this.callbackdataservice.currentCbData.subscribe((extractedData) => {
      if (extractedData && extractedData.length) {
        this.extractedDataList = extractedData;
      } else {
        this.extractedDataList = [];
      }
    });
  }

  onSubmit() {
    console.log('form submitted with value -  in', this.form.value);
    this.extractedData.emit(this.form.value);
    this.newExtractedData();
  }

  newExtractedData(){
    this.extractedDataList.push(this.form.value);
    this.callbackdataservice.ChangeDataPoint(this.extractedDataList);
  }

}
