import '@sl-design-system/checkbox/register.js';
import '@sl-design-system/combobox/register.js';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/listbox/register.js';
import '@sl-design-system/radio-group/register.js';
import '@sl-design-system/select/register.js';
import '@sl-design-system/switch/register.js';
import '@sl-design-system/text-area/register.js';
import '@sl-design-system/text-field/register.js';
import '@sl-design-system/tooltip/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../register.js';
import { type FormField } from './form-field.js';

type Props = Pick<FormField, 'hint' | 'label'> & {
  customValidity?: string;
  slot?(): TemplateResult;
};
type Story = StoryObj<Props>;

export default {
  title: 'Form/Form field',
  tags: ['stable'],
  args: {
    hint: 'This is a hint',
    label: 'Label'
  },
  argTypes: {
    slot: {
      table: {
        disable: true
      }
    }
  },
  render: ({ customValidity, hint, label, slot }) => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      event.target.closest('sl-form')?.reportValidity();
    };

    return html`
      <sl-form>
        <sl-form-field .hint=${hint} .label=${label}>
          ${slot?.() ?? html`<sl-text-field .customValidity=${customValidity}></sl-text-field>`}
        </sl-form-field>
        <sl-button-bar>
          <sl-button @click=${onClick}>Report validity</sl-button>
        </sl-button-bar>
      </sl-form>
    `;
  }
} satisfies Meta<Props>;

export const Checkbox: Story = {
  args: {
    slot: () => html`<sl-checkbox required>Checkbox</sl-checkbox>`
  }
};

export const CheckboxGroup: Story = {
  args: {
    slot: () => html`
      <sl-checkbox-group required>
        <sl-checkbox>Checkbox 1</sl-checkbox>
        <sl-checkbox>Checkbox 2</sl-checkbox>
        <sl-checkbox>Checkbox 3</sl-checkbox>
      </sl-checkbox-group>
    `
  }
};

export const Combobox: Story = {
  args: {
    slot: () => html`
      <sl-combobox required>
        <sl-listbox>
          <sl-option>Option 1</sl-option>
          <sl-option>Option 2</sl-option>
          <sl-option>Option 3</sl-option>
        </sl-listbox>
      </sl-combobox>
    `
  }
};

export const RadioGroup: Story = {
  args: {
    slot: () => html`
      <sl-radio-group required>
        <sl-radio value="1">Radio 1</sl-radio>
        <sl-radio value="2">Radio 2</sl-radio>
        <sl-radio value="3">Radio 3</sl-radio>
      </sl-radio-group>
    `
  }
};

export const Select: Story = {
  args: {
    slot: () => html`
      <sl-select required>
        <sl-select-option value="1">Option 1</sl-select-option>
        <sl-select-option value="2">Option 2</sl-select-option>
        <sl-select-option value="3">Option 3</sl-select-option>
      </sl-select>
    `
  }
};

export const Switch: Story = {
  args: {
    slot: () => html`<sl-switch reverse>Toggle me</sl-switch>`
  }
};

export const Textarea: Story = {
  args: {
    slot: () => html`<sl-text-area required></sl-text-area>`
  }
};

export const TextField: Story = {
  args: {
    slot: () => html`<sl-text-field required></sl-text-field>`
  }
};

export const CustomError: Story = {
  args: {
    slot: () => html`
      <sl-text-field required show-validity="invalid"></sl-text-field>
      <sl-error>This is a <strong>custom</strong> error</sl-error>
    `
  }
};

export const CustomHint: Story = {
  args: {
    hint: undefined,
    slot: () => html`
      <sl-text-field></sl-text-field>
      <sl-hint>This is a <strong>custom</strong> hint</sl-hint>
    `
  }
};

export const CustomLabel: Story = {
  args: {
    label: undefined,
    slot: () => html`
      <style>
        span[aria-describedby] {
          display: inline-flex;
          margin-inline-start: 0.25rem;
          vertical-align: top;

          sl-icon {
            pointer-events: none;
          }
        }
      </style>
      <sl-label>
        This is a <em>custom</em> label
        <span aria-describedby="tooltip" tabindex="-1">
          <sl-icon name="info"></sl-icon>
        </span>
        <sl-tooltip id="tooltip">Some information about this field</sl-tooltip>
      </sl-label>
      <sl-text-field></sl-text-field>
    `
  }
};
