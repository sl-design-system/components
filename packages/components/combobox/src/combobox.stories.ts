import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/form/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../register.js';
import { type Combobox } from './combobox.js';

type Props = Pick<Combobox, 'disabled' | 'multiple' | 'placeholder' | 'readonly' | 'required' | 'value'> & {
  hint?: string;
  label?: string;
  options?(): TemplateResult;
};
type Story = StoryObj<Props>;

const components = [
  'Accordion',
  'Avatar',
  'Badge',
  'Breadcrumbs',
  'Button',
  'Button bar',
  'Card',
  'Checkbox',
  'Combobox',
  'Dialog',
  'Drawer',
  'Editor',
  'Form',
  'Grid',
  'Icon',
  'Inline message',
  'Menu',
  'Message dialog',
  'Popover',
  'Radio group',
  'Search field',
  'Select',
  'Skeleton',
  'Spinner',
  'Switch',
  'Tabs',
  'Text area',
  'Text field',
  'Tooltip'
];

export default {
  title: 'Form/Combobox',
  tags: ['draft'],
  args: {
    disabled: false,
    label: 'Label',
    multiple: false,
    placeholder: 'Choose a component',
    readonly: false,
    required: false
  },
  render: ({ disabled, hint, label, multiple, options, placeholder, readonly, required, value }) => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      event.target.closest('sl-form')?.reportValidity();
    };

    return html`
      <sl-form>
        <sl-form-field .hint=${hint} .label=${label}>
          <sl-combobox
            ?disabled=${disabled}
            ?multiple=${multiple}
            ?readonly=${readonly}
            ?required=${required}
            .placeholder=${placeholder}
            .value=${value}
          >
            ${options?.() ?? html`<div slot="options">${components.map(c => html`<sl-option>${c}</sl-option>`)}</div>`}
          </sl-combobox>
        </sl-form-field>
        <sl-button-bar>
          <sl-button @click=${onClick}>Report validity</sl-button>
        </sl-button-bar>
      </sl-form>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true
  }
};

export const Multiple: Story = {
  args: {
    hint: 'The multiple property is true, which means you can select more than 1 option at a time.',
    multiple: true
  }
};

export const Readonly: Story = {
  args: {
    hint: 'The component is readonly. This means you cannot type in the text field, but you can still select options.',
    readonly: true
  }
};

export const Required: Story = {
  args: {
    hint: 'The component is required. This means you must select an option in order for the field to be valid.',
    required: true
  }
};

export const Value: Story = {
  args: {
    value: 'Button'
  }
};
