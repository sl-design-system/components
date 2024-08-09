import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/checkbox/register.js';
import '@sl-design-system/form/register.js';
import '@sl-design-system/radio-group/register.js';
import '@sl-design-system/select/register.js';
import '@sl-design-system/switch/register.js';
import '@sl-design-system/text-area/register.js';
import '@sl-design-system/text-field/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { LitElement, type TemplateResult, html } from 'lit';
import { when } from 'lit/directives/when.js';
import '../register.js';
import { type Form } from './form.js';

type Props = Pick<Form, 'disabled' | 'value'> & {
  buttons?(): TemplateResult;
  fields(args: Props): TemplateResult;
  reportValidity?: boolean;
};
type Story = StoryObj<Props>;

export default {
  title: 'Form/Form',
  tags: ['preview'],
  args: {
    disabled: false,
    reportValidity: false
  },
  render: args => {
    const { buttons, disabled, fields, reportValidity, value } = args;

    const onToggle = (): void => {
      const form = document.querySelector('sl-form')!;

      form.disabled = !form.disabled;
    };

    const onReport = (): void => {
      const form = document.querySelector('sl-form');

      console.log(form?.reportValidity(), form?.value);
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

export const ClashingEvents: Story = {
  render: () => {
    try {
      customElements.define(
        'clashing-events-example',
        class extends LitElement {
          mayChangeColumnProperties = false;

          private visibilityOptions: string[] = [];

          changeCheckbox(event: CustomEvent<string[]>) {
            console.log('checkbox change', event.detail);
          }

          changeRadio(event: CustomEvent<boolean>) {
            console.log('radio change');
            this.mayChangeColumnProperties = event.detail;
          }

          override render() {
            return html`
              <sl-form>
                <sl-form-field label="Who is allowed to see this column and the results in it?">
                  <sl-checkbox-group
                    name="visibility"
                    .value=${this.visibilityOptions}
                    @sl-change=${this.changeCheckbox}
                  >
                    <sl-checkbox value="isVisibleForStudent">Parents and students</sl-checkbox>
                    <sl-checkbox value="isVisibleForTeacher">Teaching staff (OP)</sl-checkbox>
                  </sl-checkbox-group>
                </sl-form-field>

                <sl-form-field label="Can an OP-er change column properties?">
                  <sl-radio-group
                    name="change-column-properties"
                    .value=${this.mayChangeColumnProperties}
                    @sl-change=${this.changeRadio}
                  >
                    <sl-radio .value=${false} checked>No</sl-radio>
                    <sl-radio .value=${true}>Yes</sl-radio>
                  </sl-radio-group>
                </sl-form-field>

                ${when(
                  this.mayChangeColumnProperties,
                  () => html`
                  <div class="edit-options">
                    <sl-form-field label="Specify what can be changed:">
                      <sl-checkbox-group name="edit-options">
                        <sl-checkbox value="isAllowedToChangeHeader">Changing the extended description</sl-checkbox>
                        <sl-checkbox value="isAllowedToChangeDescription">Changing the short description (column header)</sl-checkbox>
                        <sl-checkbox value="isAllowedToLinkToAssignment">Linking this column to an ELO assignment</sl-checkbox>
                      </sl-checkbox-group>
                    </sl-form-field>
                  </div>
                </sl-form>
                  `
                )}
              </sl-form>
            `;
          }
        }
      );
    } catch {
      /* empty */
    }

    return html`<clashing-events-example></clashing-events-example>`;
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

export const All: Story = {
  args: {
    fields: () => html`
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
    `
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
    value: {
      input: 'Textfield',
      textarea: 'Textarea',
      checkbox: 'checked',
      select: '2',
      switch: 'toggled',
      checkboxGroup: ['1'],
      radioGroup: '2'
    }
  }
};
