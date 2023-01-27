import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";
// import '@sanomalearning/slds-core/dist/components/checkbox/register.js';
// import {Checkbox} from '@sanomalearning/slds-core/dist/components/checkbox';
// import {CheckboxDirective} from 'core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-app';
  count = 'test1';
  myValue = 'my value';

  value3 = new FormControl('value33');

  //@Output() valueChange = new EventEmitter<any>();

  constructor() {
    // console.log(Checkbox);
    // console.log(CheckboxDirective, (CheckboxDirective as Component));

  }

  ngOnInit(): void {
    const value3Changes = this.value3.value;
    console.log('value3changes', value3Changes);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onValueChange(event: any /*Event*/): void {
    //this.valueChange.emit((event as CustomEvent<string>).detail);
    console.log('onValueChange inside angular component', event);
    this.count = event;
  }

}
