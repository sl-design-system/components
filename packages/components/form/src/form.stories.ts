import { ScopedElementsMixin } from '@open-wc/scoped-elements/html-element.js';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/checkbox/register.js';
import '@sl-design-system/combobox/register.js';
import '@sl-design-system/date-field/register.js';
import '@sl-design-system/form/register.js';
import '@sl-design-system/listbox/register.js';
import '@sl-design-system/radio-group/register.js';
import '@sl-design-system/select/register.js';
import '@sl-design-system/switch/register.js';
import '@sl-design-system/text-area/register.js';
import '@sl-design-system/text-field/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { LitElement, type TemplateResult, html, nothing } from 'lit';
import '../register.js';
import { type Form } from './form.js';

type Props = Pick<Form, 'disabled' | 'value'> & {
  buttons?(): TemplateResult;
  fields(args: Props): TemplateResult;
  reset: boolean;
  reportValidity?: boolean;
};
type Story = StoryObj<Props>;
class customComponent extends ScopedElementsMixin(LitElement) {
  constructor() {
    super();
  }

  override render() {
    return html`
      <sl-form-field label="Text field">
        <sl-text-field name="textField" required></sl-text-field>
      </sl-form-field>
    `;
  }
}
customElements.define('custom-component', customComponent);

export default {
  title: 'Form/Form',
  tags: ['preview'],
  args: {
    disabled: false,
    reportValidity: false
  },
  render: args => {
    const { buttons, disabled, fields, reportValidity, reset, value } = args;

    const onToggle = (): void => {
      const form = document.querySelector('sl-form')!;

      form.disabled = !form.disabled;
    };

    const onReport = (): void => {
      const form = document.querySelector('sl-form');

      console.log(form?.reportValidity(), form?.value);
    };

    const onReset = (): void => {
      document.querySelector('sl-form')?.reset();
    };

    const onUpdate = (): void => {
      const form = document.querySelector('sl-form')!,
        pre = form.nextElementSibling as HTMLPreElement;

      pre.textContent = JSON.stringify(form.value, null, 2);
    };

    if (reportValidity) {
      setTimeout(() => document.querySelector('sl-form')?.reportValidity(), 100);
    }

    return html`
      <style>
        sl-button[variant='primary'] {
          margin-inline-start: auto;
        }
      </style>
      <sl-form @sl-update-state=${onUpdate} @sl-update-validity=${onUpdate} ?disabled=${disabled} .value=${value}>
        ${fields(args)}
        <sl-button-bar>
          ${buttons?.() ??
          html`
            <sl-button @click=${onToggle}>Toggle</sl-button>
            ${reset ? html`<sl-button @click=${onReset}>Reset</sl-button>` : nothing}
            <sl-button @click=${onReport} variant="primary">Report</sl-button>
          `}
        </sl-button-bar>
      </sl-form>
      <pre>${JSON.stringify(value, null, 2)}</pre>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    fields: () => html`
      <sl-form-field label="Text field">
        <sl-text-field name="textField" required></sl-text-field>
      </sl-form-field>
    `
  }
};

export const Reset: Story = {
  args: {
    reset: true,
    reportValidity: true,
    fields: () => html`
      <sl-form-field hint="Has value on load" label="Text field">
        <sl-text-field name="input" placeholder="Placeholder" required value="Value set initially"></sl-text-field>
      </sl-form-field>
      <sl-form-field hint="Has no value on load" label="Text field">
        <sl-text-field name="input2" placeholder="Placeholder" required></sl-text-field>
      </sl-form-field>
    `,
    value: {
      input: 'Value set initially'
    }
  }
};

export const Array: Story = {
  args: {
    fields: () => html`
      <sl-form-field label="Item 1">
        <sl-text-field name="items[0]" required></sl-text-field>
      </sl-form-field>
      <sl-form-field label="Item 2">
        <sl-text-field name="items[1]" required></sl-text-field>
      </sl-form-field>
      <sl-form-field label="Item 3">
        <sl-text-field name="items[2]" required></sl-text-field>
      </sl-form-field>
    `
  }
};

export const DeepName: Story = {
  args: {
    fields: () => html`
      <sl-form-field label="Deep name">
        <sl-text-field name="deep.name" required></sl-text-field>
      </sl-form-field>
    `,
    value: {
      deep: {
        name: 'Deep name'
      }
    }
  }
};

export const Disabled: Story = {
  args: {
    ...Basic.args,
    disabled: true
  }
};

export const Value: Story = {
  args: {
    ...Basic.args,
    value: {
      textField: 'Hello world'
    }
  }
};

export const CustomComponent: Story = {
  args: {
    reportValidity: false,
    fields: ({ disabled }) => html`
      <sl-form-field hint="Hint text" label="Text field">
        <sl-text-field ?disabled=${disabled} name="customTextField" placeholder="Placeholder" required></sl-text-field>
      </sl-form-field>
      <custom-component></custom-component>
    `
  }
};

export const All: Story = {
  args: {
    fields: ({ disabled }) => html`
      <sl-form-field hint="Hint text" label="Text field">
        <sl-text-field ?disabled=${disabled} name="textField" placeholder="Placeholder" required></sl-text-field>
      </sl-form-field>

      <sl-form-field hint="Hint text" label="Date field">
        <sl-date-field name="dateField" placeholder="Placeholder" required></sl-date-field>
      </sl-form-field>

      <sl-form-field hint="Hint text" label="Text area">
        <sl-text-area ?disabled=${disabled} name="textArea" placeholder="Placeholder" required></sl-text-area>
      </sl-form-field>

      <sl-form-field hint="Hint text" label="Checkbox">
        <sl-checkbox ?disabled=${disabled} name="checkbox" required value="checked">Checkbox</sl-checkbox>
      </sl-form-field>

      <sl-form-field hint="Hint text" label="Checkbox group">
        <sl-checkbox-group ?disabled=${disabled} name="checkboxGroup" required>
          <sl-checkbox value="0">Check me</sl-checkbox>
          <sl-checkbox value="1">No me</sl-checkbox>
          <sl-checkbox value="2">I was here first</sl-checkbox>
        </sl-checkbox-group>
      </sl-form-field>

      <sl-form-field hint="Hint text" label="Combobox single">
        <sl-combobox ?disabled=${disabled} name="comboboxSingle" placeholder="Single select" required>
          <sl-listbox>
            <sl-option>Option 1</sl-option>
            <sl-option>Option 2</sl-option>
            <sl-option>Option 3</sl-option>
            <sl-option>Option 4</sl-option>
          </sl-listbox>
        </sl-combobox>
      </sl-form-field>

      <sl-form-field hint="Hint text" label="Combobox multiple">
        <sl-combobox ?disabled=${disabled} name="comboboxMultiple" multiple placeholder="Multiple select" required>
          <sl-listbox>
            <sl-option>Option 1</sl-option>
            <sl-option>Option 2</sl-option>
            <sl-option>Option 3</sl-option>
            <sl-option>Option 4</sl-option>
          </sl-listbox>
        </sl-combobox>
      </sl-form-field>

      <sl-form-field hint="Hint text" label="Radio group">
        <sl-radio-group ?disabled=${disabled} name="radioGroup" required>
          <sl-radio value="1">One</sl-radio>
          <sl-radio value="2">Two</sl-radio>
          <sl-radio value="3">Three</sl-radio>
        </sl-radio-group>
      </sl-form-field>

      <sl-form-field hint="Hint text" label="Select">
        <sl-select ?disabled=${disabled} name="select" placeholder="Placeholder" required>
          <sl-option value="1">Option 1</sl-option>
          <sl-option value="2">Option 2</sl-option>
          <sl-option value="3">Option 3</sl-option>
        </sl-select>
      </sl-form-field>

      <sl-form-field hint="Hint text" label="Switch">
        <sl-switch ?disabled=${disabled} name="switch" reverse value="toggled">Toggle me</sl-switch>
      </sl-form-field>
    `
  }
};

export const AllDisabled: Story = {
  args: {
    ...All.args,
    disabled: true
  }
};

export const AllInvalid: Story = {
  args: {
    ...All.args,
    reportValidity: true
  }
};

export const AllValid: Story = {
  args: {
    ...All.args,
    reportValidity: true,
    reset: true,
    value: {
      checkbox: 'checked',
      checkboxGroup: ['1'],
      comboboxSingle: 'Option 2',
      comboboxMultiple: ['Option 1', 'Option 2'],
      dateField: new Date(),
      radioGroup: '2',
      select: '2',
      switch: 'toggled',
      textArea: 'Text area',
      textField: 'Text field'
    }
  }
};
