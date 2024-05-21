import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/checkbox/register.js';
import '@sl-design-system/form/register.js';
import { CompositeForm, NestedForm } from '@sl-design-system/lit-examples';
import '@sl-design-system/radio-group/register.js';
import '@sl-design-system/select/register.js';
import '@sl-design-system/switch/register.js';
import '@sl-design-system/text-area/register.js';
import '@sl-design-system/text-field/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../register.js';
import { type Form } from './form.js';

type Props = Pick<Form, 'disabled' | 'value'> & {
  fields: TemplateResult;
};
type Story = StoryObj<Props>;

export default {
  title: 'Form/Form',
  tags: ['preview'],
  args: {
    disabled: false,
    value: {}
  },
  render: ({ disabled, fields, value }) => {
    const onToggle = (): void => {
      const form = document.querySelector('sl-form')!;

      form.disabled = !form.disabled;
    };

    const onReport = (): void => {
      const form = document.querySelector('sl-form');

      console.log(form?.reportValidity(), form?.value);
    };

    const onReset = (): void => document.querySelector('sl-form')?.reset();

    return html`
      <style>
        sl-button[variant='primary'] {
          margin-inline-start: auto;
        }
      </style>
      <sl-form ?disabled=${disabled} .value=${value}>
        ${fields}
        <sl-button-bar>
          <sl-button @click=${onReset}>Reset</sl-button>
          <sl-button @click=${onToggle}>Toggle</sl-button>
          <sl-button @click=${onReport} variant="primary">Report</sl-button>
        </sl-button-bar>
      </sl-form>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    fields: html`
      <sl-form-field label="Text field">
        <sl-text-field name="textField" required></sl-text-field>
      </sl-form-field>
    `
  }
};

export const Disabled: Story = {
  args: {
    ...Basic.args,
    disabled: true
  }
};

export const Value: Story = {
  ...Basic,
  args: {
    value: {
      username: 'john.doe',
      password: 'password',
      remember: true
    }
  }
};

export const Complex: Story = {
  render: () => {
    return html`
      <style>
        .name {
          display: grid;
          gap: 1rem;
          grid-template-columns: 1fr 110px 1.5fr;
        }
        .address1 {
          display: grid;
          gap: 1rem;
          grid-template-columns: 1fr 1fr 110px;
        }
        .address2 {
          display: grid;
          gap: 1rem;
          grid-template-columns: 1fr 1fr 1fr;
        }
      </style>
      <sl-form>
        <div class="name">
          <sl-form-field label="First name">
            <sl-text-field required></sl-text-field>
          </sl-form-field>

          <sl-form-field label="Infix">
            <sl-text-field></sl-text-field>
          </sl-form-field>

          <sl-form-field label="Last name">
            <sl-text-field required></sl-text-field>
          </sl-form-field>
        </div>

        <sl-form-field label="Gender">
          <sl-radio-group required>
            <sl-radio value="0">Male</sl-radio>
            <sl-radio value="1">Female</sl-radio>
            <sl-radio value="2">Other</sl-radio>
          </sl-radio-group>
        </sl-form-field>

        <div class="address1">
          <sl-form-field label="Zip code">
            <sl-text-field required></sl-text-field>
          </sl-form-field>

          <sl-form-field label="Number">
            <sl-text-field required></sl-text-field>
          </sl-form-field>

          <sl-form-field label="Addition">
            <sl-text-field></sl-text-field>
          </sl-form-field>
        </div>

        <div class="address2">
          <sl-form-field label="Street">
            <sl-text-field required></sl-text-field>
          </sl-form-field>

          <sl-form-field label="City">
            <sl-text-field required></sl-text-field>
          </sl-form-field>

          <sl-form-field label="Country">
            <sl-text-field required></sl-text-field>
          </sl-form-field>
        </div>
      </sl-form>
    `;
  }
};

export const CustomComponent: Story = {
  render: () => {
    try {
      customElements.define('example-composite-form', CompositeForm);
    } catch {
      /* empty */
    }

    return html`<example-composite-form></example-composite-form>`;
  }
};

export const NestedComponent: Story = {
  render: () => {
    try {
      customElements.define('example-nested-form', NestedForm);
    } catch {
      /* empty */
    }

    return html`<example-nested-form></example-nested-form>`;
  }
};

export const All: Story = {
  render: () => {
    const onClick = (): void => {
      const form = document.querySelector('sl-form');

      console.log(form?.reportValidity(), form?.value);
    };

    return html`
      <sl-form>
        <sl-form-field hint="Hint text" label="Text field">
          <sl-text-field name="input" placeholder="Placeholder" required></sl-text-field>
        </sl-form-field>

        <sl-form-field hint="Hint text" label="Textarea">
          <sl-text-area name="textarea" placeholder="Placeholder" required></sl-text-area>
        </sl-form-field>

        <sl-form-field hint="Hint text" label="Checkbox">
          <sl-checkbox name="checkbox" required value="checked">Checkbox</sl-checkbox>
        </sl-form-field>

        <sl-form-field hint="Hint text" label="Select">
          <sl-select name="select" required>
            <sl-select-option value="1">Option 1</sl-select-option>
            <sl-select-option value="2">Option 2</sl-select-option>
            <sl-select-option value="3">Option 3</sl-select-option>
          </sl-select>
        </sl-form-field>

        <sl-form-field hint="Hint text" label="Switch">
          <sl-switch name="switch" reverse value="toggled">Toggle me</sl-switch>
        </sl-form-field>

        <sl-form-field hint="Hint text" label="Checkbox group">
          <sl-checkbox-group name="checkboxGroup" required>
            <sl-checkbox value="0">Check me</sl-checkbox>
            <sl-checkbox value="1">No me</sl-checkbox>
            <sl-checkbox value="2">I was here first</sl-checkbox>
          </sl-checkbox-group>
        </sl-form-field>

        <sl-form-field hint="Hint text" label="Radio group">
          <sl-radio-group name="radioGroup" required>
            <sl-radio value="1">One</sl-radio>
            <sl-radio value="2">Two</sl-radio>
            <sl-radio value="3">Three</sl-radio>
          </sl-radio-group>
        </sl-form-field>

        <sl-button-bar align="end">
          <sl-button fill="ghost" type="reset">Reset</sl-button>
          <sl-button @click=${onClick} variant="primary">Report validity</sl-button>
        </sl-button-bar>
      </sl-form>
    `;
  }
};

export const AllInvalid: Story = {
  render: () => {
    setTimeout(() => {
      document.querySelector('sl-form')?.reportValidity();
    });

    return html`
      <sl-form>
        <sl-form-field hint="Hint text" label="Text field">
          <sl-text-field name="input" placeholder="Placeholder" required></sl-text-field>
        </sl-form-field>

        <sl-form-field hint="Hint text" label="Textarea">
          <sl-text-area name="textarea" placeholder="Placeholder" required></sl-text-area>
        </sl-form-field>

        <sl-form-field hint="Hint text" label="Checkbox">
          <sl-checkbox name="checkbox" required value="checked">Checkbox</sl-checkbox>
        </sl-form-field>

        <sl-form-field hint="Hint text" label="Select">
          <sl-select name="select" required>
            <sl-select-option value="1">Option 1</sl-select-option>
            <sl-select-option value="2">Option 2</sl-select-option>
            <sl-select-option value="3">Option 3</sl-select-option>
          </sl-select>
        </sl-form-field>

        <sl-form-field hint="Hint text" label="Switch">
          <sl-switch name="switch" reverse value="toggled">Toggle me</sl-switch>
        </sl-form-field>

        <sl-form-field hint="Hint text" label="Checkbox group">
          <sl-checkbox-group name="checkboxGroup" required>
            <sl-checkbox value="0">Check me</sl-checkbox>
            <sl-checkbox value="1">No me</sl-checkbox>
            <sl-checkbox value="2">I was here first</sl-checkbox>
          </sl-checkbox-group>
        </sl-form-field>

        <sl-form-field hint="Hint text" label="Radio group">
          <sl-radio-group name="radioGroup" required>
            <sl-radio value="1">One</sl-radio>
            <sl-radio value="2">Two</sl-radio>
            <sl-radio value="3">Three</sl-radio>
          </sl-radio-group>
        </sl-form-field>

        <sl-button-bar align="end">
          <sl-button type="reset">Reset</sl-button>
        </sl-button-bar>
      </sl-form>
    `;
  }
};

export const AllValid: Story = {
  render: () => {
    setTimeout(() => {
      document.querySelector('sl-form')?.reportValidity();
    });

    return html`
      <sl-form>
        <sl-form-field label="Text field">
          <sl-text-field name="input" placeholder="Placeholder" show-valid value="Textfield"></sl-text-field>
        </sl-form-field>

        <sl-form-field label="Textarea">
          <sl-text-area name="textarea" placeholder="Placeholder" show-valid value="Textarea"></sl-text-area>
        </sl-form-field>

        <sl-form-field label="Checkbox">
          <sl-checkbox checked name="checkbox" required show-valid value="checked">Checkbox</sl-checkbox>
        </sl-form-field>

        <sl-form-field label="Select">
          <sl-select name="select" show-valid value="2">
            <sl-select-option value="1">Option 1</sl-select-option>
            <sl-select-option value="2">Option 2</sl-select-option>
            <sl-select-option value="3">Option 3</sl-select-option>
          </sl-select>
        </sl-form-field>

        <sl-form-field label="Switch">
          <sl-switch checked name="switch" reverse value="toggled">Toggle me</sl-switch>
        </sl-form-field>

        <sl-form-field label="Checkbox group">
          <sl-checkbox-group name="checkboxGroup" required value='["1"]'>
            <sl-checkbox value="0">Check me</sl-checkbox>
            <sl-checkbox show-valid value="1">No me</sl-checkbox>
            <sl-checkbox value="2">I was here first</sl-checkbox>
          </sl-checkbox-group>
        </sl-form-field>

        <sl-form-field label="Radio group">
          <sl-radio-group name="radioGroup" required show-valid value="2">
            <sl-radio value="1">One</sl-radio>
            <sl-radio value="2">Two</sl-radio>
            <sl-radio value="3">Three</sl-radio>
          </sl-radio-group>
        </sl-form-field>

        <sl-button-bar align="end">
          <sl-button type="reset">Reset</sl-button>
        </sl-button-bar>
      </sl-form>
    `;
  }
};
