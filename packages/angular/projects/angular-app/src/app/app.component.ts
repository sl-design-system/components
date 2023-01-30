import {Component, OnInit} from '@angular/core';
import { FormControl, FormGroup} from "@angular/forms";

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
  myValue2 = 'test2';

  value3 = new FormControl('value33');

  myForm: FormGroup = new FormGroup({});

  textarea1 = 'textarea content';
  myValueTextarea = 'my value textarea';

  checkboxValue = false;//'test value of checkbox';
  myValueCheckbox = false;

  selectedOption = {value: null, text: ''};

  // value4 = new FormControl('value4');

  //@Output() valueChange = new EventEmitter<any>();

  constructor() {
    // console.log(Checkbox);
    // console.log(CheckboxDirective, (CheckboxDirective as Component));

  }

  ngOnInit(): void {
    const value3Changes = this.value3.value;
    console.log('value3changes', value3Changes);

    this.myForm = new FormGroup({
      name: new FormControl('John'),
      description: new FormControl('Short description'),
      approval: new FormControl(true),
      option: new FormControl()
    });
  }

  onSubmit(form: FormGroup) {
    console.log('Valid?', form.valid);
    // console.log('Name', form.value.name);

    alert(`form submit: Name: ${form.value.name},
          Description: ${form.value.description},
          Approval: ${form.value.approval},
          Option: ${form.value.option}` );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onValueChange(event: any /*Event*/): void {
    //this.valueChange.emit((event as CustomEvent<string>).detail);
    // const shadowRoot: DocumentFragment = event.shadowRoot;
    // const inputDiv = 'test';//shadowRoot?.querySelector('div');
    // console.log('shadowRoot and inputDiv', shadowRoot, inputDiv);

    console.log('onValueChange inside angular component', event, (event as HTMLInputElement).value);
    this.count = (event as HTMLInputElement).value; //event;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onTextareaValueChange(event: any /*Event*/): void {
    //this.valueChange.emit((event as CustomEvent<string>).detail);
    // const shadowRoot: DocumentFragment = event.shadowRoot;
    // const inputDiv = 'test';//shadowRoot?.querySelector('div');
    // console.log('shadowRoot and inputDiv', shadowRoot, inputDiv);

    console.log('onValueChange inside angular component', event, (event as HTMLInputElement).value);
    this.textarea1 = (event as HTMLTextAreaElement).value; //event;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onCheckboxValueChange(event: any /*Event*/): void {
    //this.valueChange.emit((event as CustomEvent<string>).detail);
    // const shadowRoot: DocumentFragment = event.shadowRoot;
    // const inputDiv = 'test';//shadowRoot?.querySelector('div');
    // console.log('shadowRoot and inputDiv', shadowRoot, inputDiv);
    // event.checked = !event;

    console.log('checkbox onValueChange inside angular component', event, (event as HTMLInputElement).value);
    this.checkboxValue = event.checked; //event;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRadioValueChange(event: any /*Event*/): void {
    //this.valueChange.emit((event as CustomEvent<string>).detail);
    // const shadowRoot: DocumentFragment = event.shadowRoot;
    // const inputDiv = 'test';//shadowRoot?.querySelector('div');
    // console.log('shadowRoot and inputDiv', shadowRoot, inputDiv);
    // event.checked = !event;

    console.log('radio onValueChange inside angular component', event, (event as HTMLInputElement).value, event.textContent);
    //this.checkboxValue = event.checked; //event;
    this.selectedOption.value = event.value;
    this.selectedOption.text = event.textContent;
  }

}
