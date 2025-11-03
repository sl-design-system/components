import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';
import { CheckboxGroupComponent } from '../src/checkbox/checkbox-group.component';
import { CheckboxComponent } from '../src/checkbox/checkbox.component';
import { ComboboxComponent } from '../src/combobox/combobox.component';
import { OptionComponent } from '../src/listbox/option.component';
import { NumberFieldComponent } from '../src/number-field/number-field.component';
import { RadioGroupComponent } from '../src/radio-group/radio-group.component';
import { RadioComponent } from '../src/radio-group/radio.component';
import { SelectComponent } from '../src/select/select.component';
import { SwitchComponent } from '../src/switch/switch.component';
import { TextAreaComponent } from '../src/text-area/text-area.component';
import { TextFieldComponent } from '../src/text-field/text-field.component';

export default {
  title: 'Wrappers/Form',
  decorators: [
    moduleMetadata({
      imports: [
        CheckboxComponent,
        CheckboxGroupComponent,
        ComboboxComponent,
        NumberFieldComponent,
        OptionComponent,
        RadioComponent,
        RadioGroupComponent,
        SelectComponent,
        SwitchComponent,
        TextFieldComponent,
        TextAreaComponent
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
