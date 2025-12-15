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
    description: 'You can bind actions to buttons using the (sl-change) event to respond to value changes.',
    props: {
      action: (event: Event) => console.log('Checkbox toggled, current value:', event)
    },
    template: `
      <sl-checkbox-group (sl-change)="action($event)">
        <sl-checkbox>Checkbox 1</sl-checkbox>
        <sl-checkbox>Checkbox 2</sl-checkbox>
        <sl-checkbox>Checkbox 3</sl-checkbox>
      </sl-checkbox-group>
    `
  })
};

export const Combobox: StoryObj = {
  render: () => ({
    description: 'You can bind actions to the combobox using the (sl-change) event to respond to value changes.',
    props: {
      action: (event: Event) => console.log('Combobox changed, current value:', event)
    },
    template: `
      <sl-combobox placeholder="Select an option" (sl-change)="action($event)">
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
    description: 'You can bind actions to buttons using the (sl-change) event to respond to value changes.',
    props: {
      action: (event: Event) => console.log('NumberField changed, current value:', event)
    },
    template: '<sl-number-field (sl-change)="action($event)"></sl-number-field>'
  })
};

export const RadioGroup: StoryObj = {
  render: () => ({
    description: 'You can bind actions to buttons using the (sl-change) event to respond to value changes.',
    props: {
      action: (event: Event) => console.log('RadioGroup changed, current value:', event)
    },
    template: `
      <sl-radio-group (sl-change)="action($event)">
        <sl-radio value="1">Radio 1</sl-radio>
        <sl-radio value="2">Radio 2</sl-radio>
        <sl-radio value="3">Radio 3</sl-radio>
      </sl-radio-group>
    `
  })
};

export const SearchField: StoryObj = {
  render: () => ({
    description:
      'You can bind actions to the search field using the (sl-search) event when the user submits a search, or (sl-clear) when they clear the field.',
    props: {
      onSearch: (event: Event) => console.log('Search submitted:', event),
      onClear: (event: Event) => console.log('Search cleared:', event)
    },
    template:
      '<sl-search-field placeholder="Search..." (sl-search)="onSearch($event)" (sl-clear)="onClear($event)"></sl-search-field>'
  })
};

export const Select: StoryObj = {
  render: () => ({
    description: 'You can bind actions to the select using the (sl-change) event to respond to selection changes.',
    props: {
      action: (event: Event) => console.log('Select changed, current value:', event)
    },
    template: `
      <sl-select (sl-change)="action($event)">
        <sl-option value="1">Option 1</sl-option>
        <sl-option value="2">Option 2</sl-option>
        <sl-option value="3">Option 3</sl-option>
      </sl-select>
    `
  })
};

export const Switch: StoryObj = {
  render: () => ({
    description: 'You can bind actions to the switch using the (sl-change) event to respond to toggle changes.',
    props: {
      action: (event: Event) => console.log('Switch toggled, current value:', event)
    },
    template: '<sl-switch (sl-change)="action($event)">Toggle me</sl-switch>'
  })
};

export const TextField: StoryObj = {
  render: () => ({
    description: 'You can bind actions to the text field using the (sl-change) event to respond to input changes.',
    props: {
      action: (event: Event) => console.log('TextField changed, current value:', event)
    },
    template: '<sl-text-field (sl-change)="action($event)" placeholder="Type something..."></sl-text-field>'
  })
};

export const TextArea: StoryObj = {
  render: () => ({
    description: 'You can bind actions to the text area using the (sl-change) event to respond to input changes.',
    props: {
      action: (event: Event) => console.log('TextArea changed, current value:', event)
    },
    template: '<sl-text-area (sl-change)="action($event)" placeholder="Enter text..."></sl-text-area>'
  })
};

export const DateField: StoryObj = {
  render: () => ({
    description:
      'You can bind actions to the date field using the (sl-change) event to respond to date selection changes.',
    props: {
      action: (event: Event) => console.log('DateField changed, current value:', event)
    },
    template: '<sl-date-field (sl-change)="action($event)"></sl-date-field>'
  })
};

export const TimeField: StoryObj = {
  render: () => ({
    description:
      'You can bind actions to the time field using the (sl-change) event to respond to time selection changes.',
    props: {
      action: (event: Event) => console.log('TimeField changed, current value:', event)
    },
    template: '<sl-time-field (sl-change)="action($event)"></sl-time-field>'
  })
};
