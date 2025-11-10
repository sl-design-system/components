import { CheckboxComponent, CheckboxGroupComponent } from '@sl-design-system/angular/checkbox';
import { ComboboxComponent } from '@sl-design-system/angular/combobox';
import { DateFieldComponent } from '@sl-design-system/angular/date-field';
import { OptionComponent } from '@sl-design-system/angular/listbox';
import { NumberFieldComponent } from '@sl-design-system/angular/number-field';
import { RadioComponent, RadioGroupComponent } from '@sl-design-system/angular/radio-group';
import { SearchFieldComponent } from '@sl-design-system/angular/search-field';
import { SelectComponent } from '@sl-design-system/angular/select';
import { SwitchComponent } from '@sl-design-system/angular/switch';
import { TextAreaComponent } from '@sl-design-system/angular/text-area';
import { TextFieldComponent } from '@sl-design-system/angular/text-field';
import { TimeFieldComponent } from '@sl-design-system/angular/time-field';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

export default {
  title: 'Wrappers/Form',
  decorators: [
    moduleMetadata({
      imports: [
        CheckboxComponent,
        CheckboxGroupComponent,
        ComboboxComponent,
        DateFieldComponent,
        NumberFieldComponent,
        OptionComponent,
        RadioComponent,
        RadioGroupComponent,
        SearchFieldComponent,
        SelectComponent,
        SwitchComponent,
        TextFieldComponent,
        TextAreaComponent,
        TimeFieldComponent
      ]
    })
  ]
} as Meta;

export const Checkbox: StoryObj = {
  render: () => ({
    template: `
      <sl-checkbox-group>
        <sl-checkbox>Checkbox 1</sl-checkbox>
        <sl-checkbox>Checkbox 2</sl-checkbox>
        <sl-checkbox>Checkbox 3</sl-checkbox>
      </sl-checkbox-group>
    `
  })
};

export const Combobox: StoryObj = {
  render: () => ({
    template: `
      <sl-combobox placeholder="Select an option">
        <sl-listbox>
          <sl-option>Option 1</sl-option>
          <sl-option>Option 2</sl-option>
          <sl-option>Option 3</sl-option>
        </sl-listbox>
      </sl-combobox>
    `
  })
};

export const NumberField: StoryObj = {
  render: () => ({
    template: '<sl-number-field></sl-number-field>'
  })
};

export const RadioGroup: StoryObj = {
  render: () => ({
    template: `
      <sl-radio-group>
        <sl-radio value="1">Radio 1</sl-radio>
        <sl-radio value="2">Radio 2</sl-radio>
        <sl-radio value="3">Radio 3</sl-radio>
      </sl-radio-group>
    `
  })
};

export const SearchField: StoryObj = {
  render: () => ({
    template: '<sl-search-field placeholder="Search..."></sl-search-field>'
  })
};

export const Select: StoryObj = {
  render: () => ({
    template: `
      <sl-select>
        <sl-option value="1">Option 1</sl-option>
        <sl-option value="2">Option 2</sl-option>
        <sl-option value="3">Option 3</sl-option>
      </sl-select>
    `
  })
};

export const Switch: StoryObj = {
  render: () => ({
    template: '<sl-switch></sl-switch>'
  })
};

export const TextField: StoryObj = {
  render: () => ({
    template: '<sl-text-field></sl-text-field>'
  })
};

export const TextArea: StoryObj = {
  render: () => ({
    template: '<sl-text-area></sl-text-area>'
  })
};

export const DateField: StoryObj = {
  render: () => ({
    template: '<sl-date-field></sl-date-field>'
  })
};

export const TimeField: StoryObj = {
  render: () => ({
    template: '<sl-time-field></sl-time-field>'
  })
};
