import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/form/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../register.js';
import { type Combobox } from './combobox.js';

type Props = Pick<
  Combobox,
  | 'autocomplete'
  | 'disabled'
  | 'filterResults'
  | 'multiple'
  | 'name'
  | 'placeholder'
  | 'readonly'
  | 'required'
  | 'value'
> & {
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
    autocomplete: 'both',
    disabled: false,
    filterResults: false,
    label: 'Label',
    multiple: false,
    name: 'combobox',
    placeholder: 'Choose a component',
    readonly: false,
    required: false
  },
  argTypes: {
    autocomplete: {
      control: 'inline-radio',
      options: ['off', 'inline', 'list', 'both']
    }
  },
  render: ({
    autocomplete,
    disabled,
    filterResults,
    hint,
    label,
    multiple,
    name,
    options,
    placeholder,
    readonly,
    required,
    value
  }) => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      event.target.closest('sl-form')?.reportValidity();
    };

    const onUpdate = (): void => {
      const form = document.querySelector('sl-form')!,
        pre = form.nextElementSibling as HTMLPreElement;

      pre.textContent = JSON.stringify(form.value, null, 2);
    };

    return html`
      <sl-form @sl-update-state=${onUpdate} @sl-update-validity=${onUpdate}>
        <sl-form-field .hint=${hint} .label=${label}>
          <sl-combobox
            ?disabled=${disabled}
            ?filter-results=${filterResults}
            ?multiple=${multiple}
            ?readonly=${readonly}
            ?required=${required}
            .autocomplete=${autocomplete}
            .name=${name}
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
      <pre></pre>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true
  }
};

export const FilterResults: Story = {
  args: {
    hint: 'The filterResults property is true, which means the list of options will be filtered based on user input.',
    filterResults: true
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
