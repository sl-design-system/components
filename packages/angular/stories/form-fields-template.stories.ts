import { FormsModule as AngularFormsModule } from '@angular/forms';
import type { StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '../src/forms/forms.module';

export default {
  title: 'Forms/Fields/Template',
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [AngularFormsModule, FormsModule]
    })
  ]
};

export const Checkbox: StoryObj = {
  render: () => ({
    template: `
      <sl-form-field [hint]="value || 'The value from the checkbox is displayed here using ngModel'" label="Checkbox">
        <sl-checkbox value="check">Check me</sl-checkbox>
      </sl-form-field>
    `
  })
};

export const CheckboxGroup: StoryObj = {
  render: () => ({
    template: `
      <sl-form-field [hint]="value || 'The value from the checkbox group is displayed here using ngModel'" label="Checkbox group">
        <sl-checkbox-group [(ngModel)]="value">
          <sl-checkbox value="1">Option 1</sl-checkbox>
          <sl-checkbox value="2">Option 2</sl-checkbox>
          <sl-checkbox value="3">Option 3</sl-checkbox>
        </sl-checkbox-group>
      </sl-form-field>
    `
  })
};

export const RadioGroup: StoryObj = {
  render: () => ({
    template: `
      <sl-form-field [hint]="value || 'The value from the radio group is displayed here using ngModel'" label="Radio group">
        <sl-radio-group [(ngModel)]="value">
          <sl-radio value="1">Option 1</sl-radio>
          <sl-radio value="2">Option 2</sl-radio>
          <sl-radio value="3">Option 3</sl-radio>
        </sl-radio-group>
      </sl-form-field>
    `
  })
};

export const Select: StoryObj = {
  render: () => ({
    template: `
      <sl-form-field [hint]="value || 'The value from the select is displayed here using ngModel'" label="Select">
        <sl-select [(ngModel)]="value">
          <sl-select-option value="1">Option 1</sl-select-option>
          <sl-select-option value="2">Option 2</sl-select-option>
          <sl-select-option value="3">Option 3</sl-select-option>
        </sl-select>
      </sl-form-field>
    `
  })
};

export const TextField: StoryObj = {
  render: () => ({
    template: `
      <sl-form-field [hint]="value || 'The value from the text field is displayed here using ngModel'" label="Text field">
        <sl-text-field [(ngModel)]="value"></sl-text-field>
      </sl-form-field>
    `
  })
};

export const Textarea: StoryObj = {
  render: () => ({
    template: `
      <sl-form-field [hint]="value || 'The value from the textarea is displayed here using ngModel'" label="Textarea">
        <sl-textarea [(ngModel)]="value"></sl-textarea>
      </sl-form-field>
    `
  })
};
