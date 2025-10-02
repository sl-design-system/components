import { JsonPipe } from '@angular/common';
import { Component, type ElementRef, ViewChild, type WritableSignal, signal } from '@angular/core';
import {
  type AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  type ValidationErrors
} from '@angular/forms';
import { Form } from '@sl-design-system/form';
import { type Meta, type StoryFn, moduleMetadata } from '@storybook/angular';
import { ButtonComponent } from '../src/button/button.component';
import { ButtonBarComponent } from '../src/button-bar/button-bar.component';
import { CheckboxGroupComponent } from '../src/checkbox/checkbox-group.component';
import { CheckboxComponent } from '../src/checkbox/checkbox.component';
import { ComboboxComponent } from '../src/combobox/combobox.component';
import { FormFieldComponent } from '../src/form/form-field.component';
import { FormComponent } from '../src/form/form.component';
import { CheckboxGroupDirective } from '../src/forms/checkbox-group.directive';
import { CheckboxDirective } from '../src/forms/checkbox.directive';
import { ComboboxDirective } from '../src/forms/combobox-directive';
import { NumberFieldDirective } from '../src/forms/number-field.directive';
import { RadioGroupDirective } from '../src/forms/radio-group.directive';
import { SelectDirective } from '../src/forms/select.directive';
import { SwitchDirective } from '../src/forms/switch.directive';
import { TextAreaDirective } from '../src/forms/text-area.directive';
import { TextFieldDirective } from '../src/forms/text-field.directive';
import { TimeFieldDirective } from '../src/forms/time-field.directive';
import { InlineMessageComponent } from '../src/inline-message/inline-message.component';
import { OptionComponent } from '../src/listbox/option.component';
import { NumberFieldComponent } from '../src/number-field/number-field.component';
import { RadioGroupComponent } from '../src/radio-group/radio-group.component';
import { RadioComponent } from '../src/radio-group/radio.component';
import { SelectComponent } from '../src/select/select.component';
import { SwitchComponent } from '../src/switch/switch.component';
import { TextAreaComponent } from '../src/text-area/text-area.component';
import { TextFieldComponent } from '../src/text-field/text-field.component';
import { TimeFieldComponent } from '../src/time-field/time-field.component';

@Component({
  selector: 'sla-all-form-controls-reactive',
  template: `
    <sl-form [formGroup]="formGroup">
      <sl-form-field label="Text field">
        <sl-text-field formControlName="textField" autofocus></sl-text-field>
      </sl-form-field>

      <sl-form-field label="Number field">
        <sl-number-field formControlName="numberField"></sl-number-field>
      </sl-form-field>

      <sl-form-field label="Time field">
        <sl-time-field formControlName="timeField"></sl-time-field>
      </sl-form-field>

      <sl-form-field label="Textarea">
        <sl-text-area formControlName="textArea"></sl-text-area>
      </sl-form-field>

      <sl-form-field label="Checkbox">
        <sl-checkbox formControlName="checkbox" value="checked">Checkbox</sl-checkbox>
      </sl-form-field>

      <sl-form-field label="Select">
        <sl-select formControlName="select">
          @for (option of options(); track option.value) {
            <sl-option [value]="option.value">{{ option.label }}</sl-option>
          }
        </sl-select>
      </sl-form-field>

      <sl-form-field label="Combobox - single select">
        <sl-combobox formControlName="comboboxSingle" placeholder="Select an option">
          <sl-listbox>
            @for (option of options(); track option.value) {
              <sl-option>{{ option.label }}</sl-option>
            }
          </sl-listbox>
        </sl-combobox>
      </sl-form-field>

      <sl-form-field label="Combobox - multiple select">
        <sl-combobox formControlName="comboboxMultiple" multiple placeholder="Select one or more options">
          <sl-listbox>
            @for (option of options(); track option.value) {
              <sl-option>{{ option.label }}</sl-option>
            }
          </sl-listbox>
        </sl-combobox>
      </sl-form-field>

      <sl-form-field label="Switch">
        <sl-switch formControlName="switch" reverse value="toggled">Toggle me</sl-switch>
      </sl-form-field>

      <sl-form-field label="Checkbox group">
        <sl-checkbox-group formControlName="checkboxGroup">
          <sl-checkbox value="0">One</sl-checkbox>
          <sl-checkbox value="1">Two</sl-checkbox>
          <sl-checkbox value="2">Three</sl-checkbox>
        </sl-checkbox-group>
      </sl-form-field>

      <sl-form-field label="Radio group">
        <sl-radio-group formControlName="radioGroup">
          <sl-radio value="1">One</sl-radio>
          <sl-radio value="2">Two</sl-radio>
          <sl-radio value="3">Three</sl-radio>
        </sl-radio-group>
      </sl-form-field>
    </sl-form>

    <pre>{{ formGroup.value | json }}</pre>
  `,
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    CheckboxDirective,
    CheckboxGroupDirective,
    ComboboxDirective,
    NumberFieldDirective,
    RadioGroupDirective,
    SelectDirective,
    SwitchDirective,
    TextAreaDirective,
    TextFieldDirective,
    TimeFieldDirective
  ]
})
export class AllFormControlsReactiveComponent {
  formGroup = new FormGroup({
    checkbox: new FormControl('checked'),
    checkboxGroup: new FormControl(['2', '1', '0']),
    comboboxSingle: new FormControl(''),
    comboboxMultiple: new FormControl(''),
    numberField: new FormControl(10),
    radioGroup: new FormControl('1'),
    select: new FormControl('1'),
    switch: new FormControl('toggled'),
    textArea: new FormControl('Text area'),
    textField: new FormControl('Text field'),
    timeField: new FormControl('13:45')
  });

  options: WritableSignal<Array<{ label: string; value: string }>> = signal([]);

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.options.set([
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' },
        { label: 'Option 3', value: '3' }
      ]);
    }, 500);
  }
}

@Component({
  selector: 'sla-all-form-controls-empty-reactive',
  template: `
    <sl-form #form [formGroup]="formGroup">
      <sl-form-field label="Text field">
        <sl-text-field formControlName="textField" required autofocus></sl-text-field>
      </sl-form-field>

      <sl-form-field label="Number field">
        <sl-number-field formControlName="numberField" required></sl-number-field>
      </sl-form-field>

      <sl-form-field label="Time field">
        <sl-time-field formControlName="timeField" required></sl-time-field>
      </sl-form-field>

      <sl-form-field label="Text area">
        <sl-text-area formControlName="textArea" required></sl-text-area>
      </sl-form-field>

      <sl-form-field label="Checkbox">
        <sl-checkbox formControlName="checkbox" required>Checkbox</sl-checkbox>
      </sl-form-field>

      <sl-form-field label="Select">
        <sl-select formControlName="select" required>
          @for (option of options(); track option.value) {
            <sl-option [value]="option.value">{{ option.label }}</sl-option>
          }
        </sl-select>
      </sl-form-field>

      <sl-form-field label="Combobox - single select">
        <sl-combobox formControlName="comboboxSingle" required>
          <sl-listbox>
            @for (option of options(); track option.value) {
              <sl-option>{{ option.label }}</sl-option>
            }
          </sl-listbox>
        </sl-combobox>
      </sl-form-field>

      <sl-form-field label="Combobox - multiple select">
        <sl-combobox formControlName="comboboxMultiple" multiple required>
          <sl-listbox>
            @for (option of options(); track option.value) {
              <sl-option>{{ option.label }}</sl-option>
            }
          </sl-listbox>
        </sl-combobox>
      </sl-form-field>

      <sl-form-field label="Switch">
        <sl-switch formControlName="switch" reverse>Toggle me</sl-switch>
      </sl-form-field>

      <sl-form-field label="Checkbox group">
        <sl-checkbox-group formControlName="checkboxGroup" required>
          <sl-checkbox value="0">One</sl-checkbox>
          <sl-checkbox value="1">Two</sl-checkbox>
          <sl-checkbox value="2">Three</sl-checkbox>
        </sl-checkbox-group>
      </sl-form-field>

      <sl-form-field label="Radio group">
        <sl-radio-group formControlName="radioGroup" required>
          <sl-radio value="1">One</sl-radio>
          <sl-radio value="2">Two</sl-radio>
          <sl-radio value="3">Three</sl-radio>
        </sl-radio-group>
      </sl-form-field>

      <sl-button-bar align="end">
        <sl-button (click)="onClick()" variant="primary">Report validity</sl-button>
      </sl-button-bar>
    </sl-form>

    <pre>{{ formGroup.value | json }}</pre>
  `,
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    ButtonComponent,
    ButtonBarComponent,
    CheckboxDirective,
    CheckboxGroupDirective,
    ComboboxDirective,
    NumberFieldDirective,
    RadioGroupDirective,
    SelectDirective,
    SwitchDirective,
    TextAreaDirective,
    TextFieldDirective,
    TimeFieldDirective
  ]
})
export class AllFormControlsEmptyReactiveComponent {
  @ViewChild('form') form!: ElementRef<Form>;

  formGroup = new FormGroup({
    checkbox: new FormControl(false),
    checkboxGroup: new FormControl([]),
    comboboxSingle: new FormControl(''),
    comboboxMultiple: new FormControl(''),
    numberField: new FormControl(),
    radioGroup: new FormControl(''),
    select: new FormControl(''),
    switch: new FormControl(false),
    textArea: new FormControl(''),
    textField: new FormControl(''),
    timeField: new FormControl('')
  });

  options: WritableSignal<Array<{ label: string; value: string }>> = signal([]);

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.options.set([
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' },
        { label: 'Option 3', value: '3' }
      ]);
    }, 500);
  }

  onClick(): void {
    this.form.nativeElement.reportValidity();
  }
}

@Component({
  selector: 'sla-all-form-controls-template',
  template: `
    <sl-form>
      <sl-form-field label="Text field">
        <sl-text-field [(ngModel)]="formGroup.textField" autofocus></sl-text-field>
      </sl-form-field>

      <sl-form-field label="Number field">
        <sl-number-field [(ngModel)]="formGroup.numberField"></sl-number-field>
      </sl-form-field>

      <sl-form-field label="Time field">
        <sl-time-field [(ngModel)]="formGroup.timeField"></sl-time-field>
      </sl-form-field>

      <sl-form-field label="Text area">
        <sl-text-area [(ngModel)]="formGroup.textArea"></sl-text-area>
      </sl-form-field>

      <sl-form-field label="Checkbox">
        <sl-checkbox [(ngModel)]="formGroup.checkbox" value="checked">Checkbox</sl-checkbox>
      </sl-form-field>

      <sl-form-field label="Select">
        <sl-select [(ngModel)]="formGroup.select">
          <sl-option value="1">Option 1</sl-option>
          <sl-option value="2">Option 2</sl-option>
          <sl-option value="3">Option 3</sl-option>
        </sl-select>
      </sl-form-field>

      <sl-form-field label="Combobox - single select">
        <sl-combobox [(ngModel)]="formGroup.comboboxSingle">
          <sl-listbox>
            <sl-option>Option 1</sl-option>
            <sl-option>Option 2</sl-option>
            <sl-option>Option 3</sl-option>
          </sl-listbox>
        </sl-combobox>
      </sl-form-field>

      <sl-form-field label="Combobox - multiple select">
        <sl-combobox [(ngModel)]="formGroup.comboboxMultiple" multiple>
          <sl-listbox>
            <sl-option>Option 1</sl-option>
            <sl-option>Option 2</sl-option>
            <sl-option>Option 3</sl-option>
          </sl-listbox>
        </sl-combobox>
      </sl-form-field>

      <sl-form-field label="Switch">
        <sl-switch [(ngModel)]="formGroup.switch" reverse value="toggled">Toggle me</sl-switch>
      </sl-form-field>

      <sl-form-field label="Checkbox group">
        <sl-checkbox-group [(ngModel)]="formGroup.checkboxGroup">
          <sl-checkbox value="0">Check me</sl-checkbox>
          <sl-checkbox value="1">No me</sl-checkbox>
          <sl-checkbox value="2">I was here first</sl-checkbox>
        </sl-checkbox-group>
      </sl-form-field>

      <sl-form-field label="Radio group">
        <sl-radio-group [(ngModel)]="formGroup.radioGroup">
          <sl-radio value="1">One</sl-radio>
          <sl-radio value="2">Two</sl-radio>
          <sl-radio value="3">Three</sl-radio>
        </sl-radio-group>
      </sl-form-field>
    </sl-form>

    <pre>{{ formGroup | json }}</pre>
  `,
  imports: [
    JsonPipe,
    FormsModule,
    CheckboxDirective,
    CheckboxGroupDirective,
    ComboboxDirective,
    NumberFieldDirective,
    RadioGroupDirective,
    SelectDirective,
    SwitchDirective,
    TextAreaDirective,
    TextFieldDirective,
    TimeFieldDirective
  ]
})
export class AllFormControlsTemplateComponent {
  formGroup = {
    checkbox: 'checked',
    checkboxGroup: ['2', '1', '0'],
    comboboxMultiple: ['Option 1', 'Option 2'],
    comboboxSingle: 'Option 1',
    numberField: 10,
    radioGroup: '1',
    select: '1',
    switch: 'toggled',
    textArea: 'Text area',
    textField: 'Text field',
    timeField: '13:45'
  };
}

@Component({
  selector: 'sla-all-form-controls-empty-template',
  template: `
    <sl-form #form>
      <sl-form-field label="Text field">
        <sl-text-field [(ngModel)]="formGroup.textField" required autofocus></sl-text-field>
      </sl-form-field>

      <sl-form-field label="Number field">
        <sl-number-field [(ngModel)]="formGroup.numberField" min="5" max="15" required></sl-number-field>
      </sl-form-field>

      <sl-form-field label="Text area">
        <sl-text-area [(ngModel)]="formGroup.textArea" required></sl-text-area>
      </sl-form-field>

      <sl-form-field label="Checkbox">
        <sl-checkbox [(ngModel)]="formGroup.checkbox" required>Checkbox</sl-checkbox>
      </sl-form-field>

      <sl-form-field label="Select">
        <sl-select [(ngModel)]="formGroup.select" required>
          <sl-option value="1">Option 1</sl-option>
          <sl-option value="2">Option 2</sl-option>
          <sl-option value="3">Option 3</sl-option>
        </sl-select>
      </sl-form-field>

      <sl-form-field label="Combobox - single select">
        <sl-combobox [(ngModel)]="formGroup.comboboxSingle" required>
          <sl-listbox>
            <sl-option>Option 1</sl-option>
            <sl-option>Option 2</sl-option>
            <sl-option>Option 3</sl-option>
          </sl-listbox>
        </sl-combobox>
      </sl-form-field>

      <sl-form-field label="Combobox - multiple select">
        <sl-combobox [(ngModel)]="formGroup.comboboxMultiple" multiple required>
          <sl-listbox>
            <sl-option>Option 1</sl-option>
            <sl-option>Option 2</sl-option>
            <sl-option>Option 3</sl-option>
          </sl-listbox>
        </sl-combobox>
      </sl-form-field>

      <sl-form-field label="Switch">
        <sl-switch [(ngModel)]="formGroup.switch" reverse>Toggle me</sl-switch>
      </sl-form-field>

      <sl-form-field label="Checkbox group">
        <sl-checkbox-group [(ngModel)]="formGroup.checkboxGroup" required>
          <sl-checkbox value="0">Check me</sl-checkbox>
          <sl-checkbox value="1">No me</sl-checkbox>
          <sl-checkbox value="2">I was here first</sl-checkbox>
        </sl-checkbox-group>
      </sl-form-field>

      <sl-form-field label="Radio group">
        <sl-radio-group [(ngModel)]="formGroup.radioGroup" required>
          <sl-radio value="1">One</sl-radio>
          <sl-radio value="2">Two</sl-radio>
          <sl-radio value="3">Three</sl-radio>
        </sl-radio-group>
      </sl-form-field>

      <sl-button-bar align="end">
        <sl-button (click)="onClick()" variant="primary">Report validity</sl-button>
      </sl-button-bar>
    </sl-form>

    <pre>{{ formGroup | json }}</pre>
  `,
  imports: [
    JsonPipe,
    FormsModule,
    ButtonComponent,
    ButtonBarComponent,
    CheckboxDirective,
    CheckboxGroupDirective,
    ComboboxDirective,
    NumberFieldDirective,
    RadioGroupDirective,
    SelectDirective,
    SwitchDirective,
    TextAreaDirective,
    TextFieldDirective
  ]
})
export class AllFormControlsEmptyTemplateComponent {
  @ViewChild('form') form!: ElementRef<Form>;

  formGroup = {
    checkbox: false,
    checkboxGroup: [],
    comboboxMultiple: [],
    comboboxSingle: '',
    numberField: '',
    radioGroup: null,
    select: '',
    switch: false,
    textArea: '',
    textField: '',
    timeField: ''
  };

  onClick(): void {
    this.form.nativeElement.reportValidity();
  }
}

@Component({
  selector: 'sla-login-form',
  template: `
    <sl-form #form [formGroup]="formGroup">
      @if (showValidity && formGroup.errors?.invalidCredentials) {
        <sl-inline-message variant="danger">Please enter admin/admin to gain access.</sl-inline-message>
      }

      <sl-form-field label="Username">
        <sl-text-field
          formControlName="username"
          placeholder="Enter your username or email address here"
          required
          [customValidity]="
            showValidity && formGroup.controls.username.errors?.invalidUsername ? 'Invalid username, enter admin.' : ''
          "
        ></sl-text-field>
      </sl-form-field>

      <sl-form-field label="Password">
        <sl-text-field formControlName="password" type="password" required></sl-text-field>
      </sl-form-field>

      <sl-form-field>
        <sl-checkbox formControlName="remember">Remember me</sl-checkbox>
      </sl-form-field>

      <sl-button-bar align="space-between">
        <sl-button fill="link">Forgot password?</sl-button>
        <sl-button (click)="onSubmit()" variant="primary">Log in</sl-button>
      </sl-button-bar>
    </sl-form>
  `,
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    ButtonComponent,
    ButtonBarComponent,
    CheckboxDirective,
    InlineMessageComponent,
    TextFieldDirective
  ]
})
export class LoginFormComponent {
  @ViewChild('form') form!: ElementRef<Form>;

  showValidity = false;

  customUsernameValidator = (control: AbstractControl): ValidationErrors | null => {
    return control.touched && control.value !== 'admin' ? { invalidUsername: true } : null;
  };

  formGroup = new FormGroup(
    {
      username: new FormControl('', this.customUsernameValidator),
      password: new FormControl(''),
      remember: new FormControl(false)
    },
    (control: AbstractControl): ValidationErrors | null => {
      const username = control.get('username'),
        password = control.get('password');

      if (username?.errors || password?.errors) {
        return null;
      } else if (username?.value !== 'admin' || password?.value !== 'admin') {
        return { invalidCredentials: true };
      }

      return null;
    }
  );

  onSubmit(): void {
    if (this.formGroup.invalid) {
      this.form.nativeElement.reportValidity();
      this.showValidity = this.form.nativeElement.showValidity;
    }

    console.log('onSubmit', this.formGroup.valid, this.formGroup.value, this.formGroup);
  }
}

export default {
  title: 'Forms',
  decorators: [
    moduleMetadata({
      imports: [
        AllFormControlsReactiveComponent,
        AllFormControlsEmptyReactiveComponent,
        AllFormControlsTemplateComponent,
        AllFormControlsEmptyTemplateComponent,
        LoginFormComponent,
        CheckboxComponent,
        CheckboxGroupComponent,
        ComboboxComponent,
        FormComponent,
        FormFieldComponent,
        NumberFieldComponent,
        OptionComponent,
        RadioComponent,
        RadioGroupComponent,
        SelectComponent,
        SwitchComponent,
        TextAreaComponent,
        TextFieldComponent,
        TimeFieldComponent
      ]
    })
  ],
  args: {}
} as Meta;

export const AllReactive: StoryFn = () => ({
  template: '<sla-all-form-controls-reactive></sla-all-form-controls-reactive>'
});

export const AllEmptyReactive: StoryFn = () => ({
  template: '<sla-all-form-controls-empty-reactive></sla-all-form-controls-empty-reactive>'
});

export const AllTemplate: StoryFn = () => ({
  template: '<sla-all-form-controls-template></sla-all-form-controls-template>'
});

export const AllEmptyTemplate: StoryFn = () => ({
  template: '<sla-all-form-controls-empty-template></sla-all-form-controls-empty-template>'
});

export const Login: StoryFn = () => ({
  template: '<sla-login-form></sla-login-form>'
});
