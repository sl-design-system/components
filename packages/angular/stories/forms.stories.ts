import { Component, type ElementRef, ViewChild } from '@angular/core';
import {
  type AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  type ValidationErrors
} from '@angular/forms';
import { type Form } from '@sl-design-system/form';
import { type Meta, type StoryFn, moduleMetadata } from '@storybook/angular';
import {
  CheckboxDirective,
  CheckboxGroupDirective,
  RadioGroupDirective,
  SelectDirective,
  SwitchDirective,
  TextAreaDirective,
  TextFieldDirective
} from '../src/forms/index';
import {
  ButtonBarComponent,
  ButtonComponent,
  CheckboxComponent,
  CheckboxGroupComponent,
  FormComponent,
  FormFieldComponent,
  InlineMessageComponent,
  RadioComponent,
  RadioGroupComponent,
  SelectComponent,
  SelectOptionComponent,
  SwitchComponent,
  TextAreaComponent,
  TextFieldComponent
} from '../src/wrappers';

@Component({
  selector: 'sla-all-form-controls-reactive',
  template: `
    <sl-form [formGroup]="formGroup">
      <sl-form-field label="Text field">
        <sl-text-field formControlName="textField"></sl-text-field>
      </sl-form-field>

      <sl-form-field label="Textarea">
        <sl-text-area formControlName="textarea"></sl-text-area>
      </sl-form-field>

      <sl-form-field label="Checkbox">
        <sl-checkbox formControlName="checkbox" value="checked">Checkbox</sl-checkbox>
      </sl-form-field>

      <sl-form-field label="Select">
        <sl-select formControlName="select">
          <sl-select-option value="1">Option 1</sl-select-option>
          <sl-select-option value="2">Option 2</sl-select-option>
          <sl-select-option value="3">Option 3</sl-select-option>
        </sl-select>
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
  `
})
export class AllFormControlsReactiveComponent {
  formGroup = new FormGroup({
    textField: new FormControl('Text field'),
    textArea: new FormControl('Text area'),
    checkbox: new FormControl('checked'),
    select: new FormControl('1'),
    switch: new FormControl('toggled'),
    checkboxGroup: new FormControl(['2', '1', '0']),
    radioGroup: new FormControl('1')
  });
}

@Component({
  selector: 'sla-all-form-controls-empty-reactive',
  template: `
    <sl-form #form [formGroup]="formGroup">
      <sl-form-field label="Text field">
        <sl-text-field formControlName="textField" required></sl-text-field>
      </sl-form-field>

      <sl-form-field label="Text area">
        <sl-text-area formControlName="textArea" required></sl-text-area>
      </sl-form-field>

      <sl-form-field label="Checkbox">
        <sl-checkbox formControlName="checkbox" required>Checkbox</sl-checkbox>
      </sl-form-field>

      <sl-form-field label="Select">
        <sl-select formControlName="select" required>
          <sl-select-option value="1">Option 1</sl-select-option>
          <sl-select-option value="2">Option 2</sl-select-option>
          <sl-select-option value="3">Option 3</sl-select-option>
        </sl-select>
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
  `
})
export class AllFormControlsEmptyReactiveComponent {
  @ViewChild('form') form!: ElementRef<Form>;

  formGroup = new FormGroup({
    textField: new FormControl(''),
    textArea: new FormControl(''),
    checkbox: new FormControl(false),
    select: new FormControl(''),
    switch: new FormControl(false),
    checkboxGroup: new FormControl([]),
    radioGroup: new FormControl('')
  });

  onClick(): void {
    this.form.nativeElement.reportValidity();
  }
}

@Component({
  selector: 'sla-all-form-controls-template',
  template: `
    <sl-form>
      <sl-form-field label="Text field">
        <sl-text-field [(ngModel)]="formGroup.textField"></sl-text-field>
      </sl-form-field>

      <sl-form-field label="Text area">
        <sl-text-area [(ngModel)]="formGroup.textArea"></sl-text-area>
      </sl-form-field>

      <sl-form-field label="Checkbox">
        <sl-checkbox [(ngModel)]="formGroup.checkbox" value="checked">Checkbox</sl-checkbox>
      </sl-form-field>

      <sl-form-field label="Select">
        <sl-select [(ngModel)]="formGroup.select">
          <sl-select-option value="1">Option 1</sl-select-option>
          <sl-select-option value="2">Option 2</sl-select-option>
          <sl-select-option value="3">Option 3</sl-select-option>
        </sl-select>
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
  `
})
export class AllFormControlsTemplateComponent {
  formGroup = {
    textField: 'Text field',
    textArea: 'Text area',
    checkbox: 'checked',
    select: '1',
    switch: 'toggled',
    checkboxGroup: ['2', '1', '0'],
    radioGroup: '1'
  };
}

@Component({
  selector: 'sla-all-form-controls-empty-template',
  template: `
    <sl-form #form>
      <sl-form-field label="Text field">
        <sl-text-field [(ngModel)]="formGroup.textField" required></sl-text-field>
      </sl-form-field>

      <sl-form-field label="Text area">
        <sl-text-area [(ngModel)]="formGroup.textArea" required></sl-text-area>
      </sl-form-field>

      <sl-form-field label="Checkbox">
        <sl-checkbox [(ngModel)]="formGroup.checkbox" required>Checkbox</sl-checkbox>
      </sl-form-field>

      <sl-form-field label="Select">
        <sl-select [(ngModel)]="formGroup.select" required>
          <sl-select-option value="1">Option 1</sl-select-option>
          <sl-select-option value="2">Option 2</sl-select-option>
          <sl-select-option value="3">Option 3</sl-select-option>
        </sl-select>
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
  `
})
export class AllFormControlsEmptyTemplateComponent {
  @ViewChild('form') form!: ElementRef<Form>;

  formGroup = {
    textField: '',
    textArea: '',
    checkbox: false,
    select: '',
    switch: false,
    checkboxGroup: [],
    radioGroup: null
  };

  onClick(): void {
    this.form.nativeElement.reportValidity();
  }
}

@Component({
  selector: 'sla-login-form',
  template: `
    <sl-form #form [formGroup]="formGroup">
      <sl-inline-message *ngIf="showValidity && formGroup.errors?.invalidCredentials" variant="danger">
        Please enter admin/admin to gain access.
      </sl-inline-message>

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
  `
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
      declarations: [
        AllFormControlsReactiveComponent,
        AllFormControlsEmptyReactiveComponent,
        AllFormControlsTemplateComponent,
        AllFormControlsEmptyTemplateComponent,
        LoginFormComponent
      ],
      imports: [
        ButtonComponent,
        ButtonBarComponent,
        CheckboxComponent,
        CheckboxDirective,
        CheckboxGroupComponent,
        CheckboxGroupDirective,
        FormComponent,
        FormFieldComponent,
        FormsModule,
        InlineMessageComponent,
        RadioComponent,
        RadioGroupComponent,
        RadioGroupDirective,
        ReactiveFormsModule,
        SelectComponent,
        SelectDirective,
        SelectOptionComponent,
        SwitchComponent,
        SwitchDirective,
        TextFieldComponent,
        TextFieldDirective,
        TextAreaComponent,
        TextAreaDirective
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
