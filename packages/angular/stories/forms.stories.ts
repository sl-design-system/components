import { JsonPipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  type ElementRef,
  ViewChild,
  type WritableSignal,
  inject,
  signal
} from '@angular/core';
import {
  type AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  type ValidationErrors,
  Validators
} from '@angular/forms';
import { ButtonComponent } from '@sl-design-system/angular/button';
import { ButtonBarComponent } from '@sl-design-system/angular/button-bar';
import { CheckboxComponent, CheckboxGroupComponent } from '@sl-design-system/angular/checkbox';
import { ComboboxComponent } from '@sl-design-system/angular/combobox';
import { DateFieldComponent } from '@sl-design-system/angular/date-field';
import { FormComponent, FormFieldComponent } from '@sl-design-system/angular/form';
import {
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
} from '@sl-design-system/angular/forms';
import { InlineMessageComponent } from '@sl-design-system/angular/inline-message';
import { OptionComponent } from '@sl-design-system/angular/listbox';
import { NumberFieldComponent } from '@sl-design-system/angular/number-field';
import { RadioComponent, RadioGroupComponent } from '@sl-design-system/angular/radio-group';
import { SelectComponent } from '@sl-design-system/angular/select';
import { SwitchComponent } from '@sl-design-system/angular/switch';
import { TextAreaComponent } from '@sl-design-system/angular/text-area';
import { TextFieldComponent } from '@sl-design-system/angular/text-field';
import { TimeFieldComponent } from '@sl-design-system/angular/time-field';
import { Form } from '@sl-design-system/form';
import { type Meta, type StoryFn, moduleMetadata } from '@storybook/angular-vite';
import { DateFieldDirective } from '../src/forms/date-field.directive';

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

      <sl-form-field label="Date field">
        <sl-date-field formControlName="dateField"></sl-date-field>
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
        <sl-combobox
          formControlName="comboboxSingle"
          placeholder="Select an option"
          style="max-width: 500px">
          <sl-listbox>
            @for (option of options(); track option.value) {
              <sl-option>{{ option.label }}</sl-option>
            }
          </sl-listbox>
        </sl-combobox>
      </sl-form-field>

      <sl-form-field label="Combobox - multiple select">
        <sl-combobox
          formControlName="comboboxMultiple"
          multiple
          placeholder="Select one or more options"
          style="max-width: 500px">
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
    DateFieldDirective,
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
    dateField: new FormControl(new Date(2026, 0, 1)),
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

      <sl-form-field label="Date field">
        <sl-date-field formControlName="dateField" required></sl-date-field>
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
        <sl-combobox formControlName="comboboxSingle" required style="max-width: 500px">
          <sl-listbox>
            @for (option of options(); track option.value) {
              <sl-option>{{ option.label }}</sl-option>
            }
          </sl-listbox>
        </sl-combobox>
      </sl-form-field>

      <sl-form-field label="Combobox - multiple select">
        <sl-combobox formControlName="comboboxMultiple" multiple required style="max-width: 500px">
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
    DateFieldDirective,
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
    dateField: new FormControl(''),
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

      <sl-form-field label="Date field">
        <sl-date-field [(ngModel)]="formGroup.dateField"></sl-date-field>
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
        <sl-combobox [(ngModel)]="formGroup.comboboxSingle" style="max-width: 500px">
          <sl-listbox>
            <sl-option>Option 1</sl-option>
            <sl-option>Option 2</sl-option>
            <sl-option>Option 3</sl-option>
          </sl-listbox>
        </sl-combobox>
      </sl-form-field>

      <sl-form-field label="Combobox - multiple select">
        <sl-combobox [(ngModel)]="formGroup.comboboxMultiple" multiple style="max-width: 500px">
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
    DateFieldDirective,
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
    dateField: '01/01/2026',
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
  selector: 'sla-all-form-controls-template-driven-on-blur',
  template: `
    <sl-form #form validate-on-blur>
      <sl-form-field label="Text field">
        <sl-text-field [(ngModel)]="formGroup.textField" required></sl-text-field>
      </sl-form-field>

      <sl-form-field label="Number field">
        <sl-number-field [(ngModel)]="formGroup.numberField" required></sl-number-field>
      </sl-form-field>

      <sl-form-field label="Date field">
        <sl-date-field [(ngModel)]="formGroup.dateField" required></sl-date-field>
      </sl-form-field>

      <sl-form-field label="Time field">
        <sl-time-field [(ngModel)]="formGroup.timeField" required></sl-time-field>
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
    DateFieldDirective,
    NumberFieldDirective,
    RadioGroupDirective,
    SelectDirective,
    SwitchDirective,
    TextAreaDirective,
    TextFieldDirective,
    TimeFieldDirective
  ]
})
export class AllFormControlsTemplateDrivenBlurComponent {
  @ViewChild('form') form!: ElementRef<Form>;

  formGroup = {
    checkbox: false,
    checkboxGroup: [],
    comboboxMultiple: [],
    comboboxSingle: '',
    dateField: '',
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
  selector: 'sla-all-form-controls-empty-template',
  template: `
    <sl-form #form>
      <sl-form-field label="Text field">
        <sl-text-field [(ngModel)]="formGroup.textField" required autofocus></sl-text-field>
      </sl-form-field>

      <sl-form-field label="Number field">
        <sl-number-field
          [(ngModel)]="formGroup.numberField"
          min="5"
          max="15"
          required></sl-number-field>
      </sl-form-field>

      <sl-form-field label="Date field">
        <sl-date-field [(ngModel)]="formGroup.dateField" required></sl-date-field>
      </sl-form-field>

      <sl-form-field label="Time field">
        <sl-time-field [(ngModel)]="formGroup.timeField" required></sl-time-field>
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
        <sl-combobox [(ngModel)]="formGroup.comboboxSingle" required style="max-width: 500px">
          <sl-listbox>
            <sl-option>Option 1</sl-option>
            <sl-option>Option 2</sl-option>
            <sl-option>Option 3</sl-option>
          </sl-listbox>
        </sl-combobox>
      </sl-form-field>

      <sl-form-field label="Combobox - multiple select">
        <sl-combobox
          [(ngModel)]="formGroup.comboboxMultiple"
          multiple
          required
          style="max-width: 500px">
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
    DateFieldDirective,
    NumberFieldDirective,
    RadioGroupDirective,
    SelectDirective,
    SwitchDirective,
    TextAreaDirective,
    TextFieldDirective,
    TimeFieldDirective
  ]
})
export class AllFormControlsEmptyTemplateComponent {
  @ViewChild('form') form!: ElementRef<Form>;

  formGroup = {
    checkbox: false,
    checkboxGroup: [],
    comboboxMultiple: [],
    comboboxSingle: '',
    dateField: '',
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
      @if (showValidity && formGroup.errors?.['invalidCredentials']) {
        <sl-inline-message variant="danger"
          >Please enter admin/admin to gain access.</sl-inline-message
        >
      }

      <sl-form-field label="Username">
        <sl-text-field
          formControlName="username"
          placeholder="Enter your username or email address here"
          required
          [customValidity]="
            showValidity && formGroup.controls.username.errors?.['invalidUsername']
              ? 'Invalid username, enter admin.'
              : ''
          "></sl-text-field>
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

@Component({
  selector: 'sla-all-form-controls-reactive-on-blur',
  template: `
    <sl-form #form validate-on-blur [formGroup]="formGroup">
      <sl-form-field label="Text field">
        <sl-text-field formControlName="textField" required></sl-text-field>
      </sl-form-field>

      <sl-form-field label="Number field">
        <sl-number-field formControlName="numberField" required></sl-number-field>
      </sl-form-field>

      <sl-form-field label="Date field">
        <sl-date-field formControlName="dateField" required></sl-date-field>
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
    DateFieldDirective,
    NumberFieldDirective,
    RadioGroupDirective,
    SelectDirective,
    SwitchDirective,
    TextAreaDirective,
    TextFieldDirective,
    TimeFieldDirective
  ]
})
export class AllFormControlsReactiveBlurComponent {
  @ViewChild('form') form!: ElementRef<Form>;

  formGroup = new FormGroup({
    checkbox: new FormControl(false, Validators.requiredTrue),
    checkboxGroup: new FormControl([], Validators.required),
    comboboxSingle: new FormControl('', Validators.required),
    comboboxMultiple: new FormControl('', Validators.required),
    dateField: new FormControl('', Validators.required),
    numberField: new FormControl(null, Validators.required),
    radioGroup: new FormControl('', Validators.required),
    select: new FormControl('', Validators.required),
    switch: new FormControl(false),
    textArea: new FormControl('', Validators.required),
    textField: new FormControl('', Validators.required),
    timeField: new FormControl('', Validators.required)
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

/*@Component({
  selector: 'sla-validation-trigger-scenario',
  template: `
    <sl-form #form [formGroup]="formGroup">
      <sl-form-field label="Required text field">
        <sl-text-field formControlName="name" required (focusout)="onControlBlur()"></sl-text-field>
      </sl-form-field>

      <sl-button-bar>
        <sl-button (click)="showErrors()" variant="primary">Call reportValidity()</sl-button>
      </sl-button-bar>
    </sl-form>

    <pre>
Angular state: touched={{ control.touched }} dirty={{ control.dirty }} valid={{ control.valid }}
SLDS form state: showValidity={{ formRef?.nativeElement?.showValidity }}
    </pre>
  `,
  imports: [ReactiveFormsModule, ButtonComponent, ButtonBarComponent, FormFieldComponent, TextFieldDirective]
})
export class ValidationTriggerScenarioComponent {
  readonly #changeDetectorRef = inject(ChangeDetectorRef);

  @ViewChild('form') formRef?: ElementRef<Form>;

  formGroup = new FormGroup({
    name: new FormControl('', {validators: Validators.required, updateOn: 'blur'})
  });

  get control(): FormControl<string | null> {
    return this.formGroup.controls.name;
  }

  showErrors(): void {
    this.formRef?.nativeElement.reportValidity();
  }

  onControlBlur(): void {
    // Use setTimeout (macro task) so the ControlValueAccessor can process sl-blur
    // and call onTouched() before we force a view refresh.
    this.#changeDetectorRef.detectChanges();
    setTimeout(() => this.#changeDetectorRef.detectChanges());
  }
}*/

/*@Component({
  selector: 'sla-angular-state-gating-scenario',
  template: `
    <sl-form [formGroup]="formGroup">
      <sl-form-field label="Email">
        <sl-text-field formControlName="email" required (focusout)="onControlBlur()"></sl-text-field>
      </sl-form-field>
    </sl-form>

    <p>
      Angular-gated helper:
      {{
        control.invalid && (control.touched || control.dirty)
          ? 'show custom message now (touched/dirty)'
          : 'hide custom message until touched/dirty'
      }}
    </p>

    <pre>
Angular state: touched={{ control.touched }} dirty={{ control.dirty }} valid={{ control.valid }}
    </pre>
  `,
  imports: [ReactiveFormsModule, FormFieldComponent, TextFieldDirective]
})
export class AngularStateGatingScenarioComponent {
  readonly #changeDetectorRef = inject(ChangeDetectorRef);

  formGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  get control(): FormControl<string | null> {
    return this.formGroup.controls.email;
  }

  onControlBlur(): void {
    setTimeout(() => this.#changeDetectorRef.detectChanges());
  }
}*/

/*@Component({
  selector: 'sla-default-vs-blur-scenario',
  template: `
    <h4>Default behavior</h4>
    <sl-form [formGroup]="defaultForm">
      <sl-form-field label="Required field">
        <sl-text-field formControlName="name" required (focusout)="onControlBlur()"></sl-text-field>
      </sl-form-field>
    </sl-form>

    <h4>With validate-on-blur</h4>
    <sl-form validate-on-blur [formGroup]="blurForm">
      <sl-form-field label="Required field">
        <sl-text-field formControlName="name" required (focusout)="onControlBlur()"></sl-text-field>
      </sl-form-field>
    </sl-form>

    <pre>
Default touched={{ defaultControl.touched }} dirty={{ defaultControl.dirty }} valid={{ defaultControl.valid }}
Blur touched={{ blurControl.touched }} dirty={{ blurControl.dirty }} valid={{ blurControl.valid }}
    </pre>
  `,
  imports: [ReactiveFormsModule, FormComponent, FormFieldComponent, TextFieldDirective]
})
export class DefaultVsBlurScenarioComponent {
  readonly #changeDetectorRef = inject(ChangeDetectorRef);

  defaultForm = new FormGroup({
    name: new FormControl('', Validators.required)
  });

  blurForm = new FormGroup({
    name: new FormControl('', Validators.required)
  });

  get defaultControl(): FormControl<string | null> {
    return this.defaultForm.controls.name;
  }

  get blurControl(): FormControl<string | null> {
    return this.blurForm.controls.name;
  }

  onControlBlur(): void {
    setTimeout(() => this.#changeDetectorRef.detectChanges());
  }
}*/

// @Component({
//   selector: 'sla-custom-validation-scenario',
//   template: `
//     <sl-form #form [formGroup]="formGroup">
//       <sl-form-field label="Password">
//         <sl-text-field formControlName="password" required type="password"></sl-text-field>
//       </sl-form-field>
//
//       <sl-form-field label="Confirm password">
//         <sl-text-field
//           formControlName="confirmPassword"
//           required
//           type="password"
//           [customValidity]="showPasswordMismatch ? 'Passwords do not match.' : ''"></sl-text-field>
//       </sl-form-field>
//
//       <sl-button-bar align="end">
//         <sl-button (click)="onClick()" variant="primary">Report validity</sl-button>
//       </sl-button-bar>
//     </sl-form>
//
//     <pre>
// passwordMismatch={{ !!formGroup.errors?.['passwordMismatch'] }}
// touched={{ confirmPasswordControl.touched }} dirty={{ confirmPasswordControl.dirty }}
//     </pre>
//   `,
//   imports: [
//     ReactiveFormsModule,
//     ButtonComponent,
//     ButtonBarComponent,
//     FormComponent,
//     FormFieldComponent,
//     TextFieldDirective
//   ]
// })
// export class CustomValidationScenarioComponent {
//   @ViewChild('form') formRef?: ElementRef<Form>;
//
//   passwordMatchValidator = (control: AbstractControl): ValidationErrors | null => {
//     const password = `${control.get('password')?.value ?? ''}`,
//       confirmPassword = `${control.get('confirmPassword')?.value ?? ''}`;
//
//     return password === confirmPassword ? null : { passwordMismatch: true };
//   };
//
//   formGroup = new FormGroup(
//     {
//       password: new FormControl('', Validators.required),
//       confirmPassword: new FormControl('', Validators.required)
//     },
//     this.passwordMatchValidator
//   );
//
//   get confirmPasswordControl(): FormControl<string | null> {
//     return this.formGroup.controls.confirmPassword;
//   }
//
//   get showPasswordMismatch(): boolean {
//     return !!this.formGroup.errors?.['passwordMismatch'] &&
//       (this.confirmPasswordControl.touched ||
//         this.confirmPasswordControl.dirty ||
//         !!this.formRef?.nativeElement.showValidity);
//   }
//
//   onClick(): void {
//     this.formRef?.nativeElement.reportValidity();
//   }
// }

export default {
  title: 'Components/Forms',
  decorators: [
    moduleMetadata({
      imports: [
        AllFormControlsReactiveComponent,
        AllFormControlsEmptyReactiveComponent,
        AllFormControlsReactiveBlurComponent,
        // ValidationTriggerScenarioComponent,
        // AngularStateGatingScenarioComponent,
        // DefaultVsBlurScenarioComponent,
        // CustomValidationScenarioComponent,
        AllFormControlsTemplateComponent,
        AllFormControlsTemplateDrivenBlurComponent,
        AllFormControlsEmptyTemplateComponent,
        LoginFormComponent,
        CheckboxComponent,
        CheckboxGroupComponent,
        ComboboxComponent,
        DateFieldComponent,
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
  description: 'An example form that includes all form controls using reactive forms.',
  template: '<sla-all-form-controls-reactive></sla-all-form-controls-reactive>'
});

export const AllEmptyReactive: StoryFn = () => ({
  description:
    'An example form that includes all form controls using reactive forms with empty initial values.',
  template: '<sla-all-form-controls-empty-reactive></sla-all-form-controls-empty-reactive>'
});

export const AllReactiveOnBlur: StoryFn = () => ({
  description:
    'Reactive forms example with `validate-on-blur` on `<sl-form>`. SLDS validates controls when they emit `sl-blur` (focus leaves the field), so errors are shown after interaction instead of during typing.',
  template: '<sla-all-form-controls-reactive-on-blur></sla-all-form-controls-reactive-on-blur>'
});

// export const ValidationTriggerWithReportValidity: StoryFn = () => ({
//   description:
//     'Shows how calling `reportValidity()` triggers SLDS validation feedback, while Angular state (`touched`/`dirty`) is still tracked separately. The debug panel below the form listens to `focusout` to force a view refresh, so `touched` and `dirty` update immediately after you tab out of a field.',
//   template: '<sla-validation-trigger-scenario></sla-validation-trigger-scenario>'
// });

// export const AngularTouchedDirtyGating: StoryFn = () => ({
//   description:
//     'Shows Angular-driven error timing (`touched` / `dirty`) with SLDS controls. Angular decides when to show custom messages; SLDS handles control validity and rendering. The debug panel listens to `focusout` to force a view refresh, so the state display updates immediately after you tab out.',
//   template: '<sla-angular-state-gating-scenario></sla-angular-state-gating-scenario>'
// });

// export const DefaultVsValidateOnBlur: StoryFn = () => ({
//   description:
//     'Compares default validation behavior with `validate-on-blur` on `<sl-form>` using the same required field setup. The debug panel listens to `focusout` to force a view refresh, so `touched` and `dirty` update immediately after you tab out of either field.',
//   template: '<sla-default-vs-blur-scenario></sla-default-vs-blur-scenario>'
// });

// export const CustomValidationReactive: StoryFn = () => ({
//   description:
//     'Reactive forms example with a custom cross-field validator. The form validates that `password` and `confirmPassword` match and shows a custom validity message on the confirmation field.',
//   template: '<sla-custom-validation-scenario></sla-custom-validation-scenario>'
// });

export const AllTemplate: StoryFn = () => ({
  description: 'An example form that includes all form controls using template-driven forms.',
  template: '<sla-all-form-controls-template></sla-all-form-controls-template>'
});

export const AllTemplateDrivenOnBlur: StoryFn = () => ({
  description:
    'Template-driven forms example with `validate-on-blur` on `<sl-form>`. Works with `[(ngModel)]` fields and shows validation feedback after blur, matching the reactive on-blur behavior.',
  template:
    '<sla-all-form-controls-template-driven-on-blur></sla-all-form-controls-template-driven-on-blur>'
});

export const AllEmptyTemplate: StoryFn = () => ({
  description:
    'An example form that includes all form controls using template-driven forms with empty initial values.',
  template: '<sla-all-form-controls-empty-template></sla-all-form-controls-empty-template>'
});

export const Login: StoryFn = () => ({
  description: 'A simple login form example using reactive forms with custom validation.',
  template: '<sla-login-form></sla-login-form>'
});
