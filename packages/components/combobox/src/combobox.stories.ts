import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/form/register.js';
import '@sl-design-system/listbox/register.js';
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
  | 'showValid'
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
  'Panel',
  'Popover',
  'Progress bar',
  'Radio group',
  'Search field',
  'Select',
  'Skeleton',
  'Spinner',
  'Switch',
  'Tabs',
  'Tag',
  'Tag list',
  'Text area',
  'Text field',
  'Toggle button',
  'Toggle group',
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
            ${options?.() ?? html`<sl-listbox>${components.map(c => html`<sl-option>${c}</sl-option>`)}</sl-listbox>`}
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

export const Selected: Story = {
  args: {
    value: 'Button bar'
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
    hint: 'The multiple property is true, which means you can select more than 1 option at a time. This will render the selected options as tags.',
    multiple: true,
    value: ['Button bar', 'Checkbox']
  }
};

export const MultipleStacked: Story = {
  args: {
    ...Multiple.args,
    hint: 'When there is not enough space to display all tags, they will be stacked.',
    value: ['Button bar', 'Card', 'Checkbox', 'Inline message', 'Menu', 'Panel', 'Spinner', 'Switch']
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

export const StressTest: Story = {
  args: {
    options: () => html`
      <sl-listbox>${Array.from({ length: 5000 }).map((_, i) => html`<sl-option>Option ${i}</sl-option>`)}</sl-listbox>
    `
  }
};

export const All: Story = {
  render: () => html`
    <style>
      .container {
        align-items: center;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;

        span {
          justify-self: center;
        }
      }
    </style>
    <div class="container">
      <span>md</span>
      <span>lg</span>
      <sl-combobox placeholder="Empty">
        <sl-listbox>
          <sl-option>Option 1</sl-option>
          <sl-option>Option 2</sl-option>
          <sl-option>Option 3</sl-option>
        </sl-listbox>
      </sl-combobox>
      <sl-combobox placeholder="Empty" size="lg">
        <sl-listbox>
          <sl-option>Option 1</sl-option>
          <sl-option>Option 2</sl-option>
          <sl-option>Option 3</sl-option>
        </sl-listbox>
      </sl-combobox>

      <sl-combobox placeholder="Selected" value="Option 2">
        <sl-listbox>
          <sl-option>Option 1</sl-option>
          <sl-option>Option 2</sl-option>
          <sl-option>Option 3</sl-option>
        </sl-listbox>
      </sl-combobox>
      <sl-combobox placeholder="Selected" size="lg" value="Option 2">
        <sl-listbox>
          <sl-option>Option 1</sl-option>
          <sl-option>Option 2</sl-option>
          <sl-option>Option 3</sl-option>
        </sl-listbox>
      </sl-combobox>

      <sl-combobox readonly placeholder="Readonly">
        <sl-listbox>
          <sl-option>Option 1</sl-option>
          <sl-option>Option 2</sl-option>
          <sl-option>Option 3</sl-option>
        </sl-listbox>
      </sl-combobox>
      <sl-combobox readonly placeholder="Readonly" size="lg">
        <sl-listbox>
          <sl-option>Option 1</sl-option>
          <sl-option>Option 2</sl-option>
          <sl-option>Option 3</sl-option>
        </sl-listbox>
      </sl-combobox>

      <sl-combobox disabled placeholder="Disabled">
        <sl-listbox>
          <sl-option>Option 1</sl-option>
          <sl-option>Option 2</sl-option>
          <sl-option>Option 3</sl-option>
        </sl-listbox>
      </sl-combobox>
      <sl-combobox disabled placeholder="Disabled" size="lg">
        <sl-listbox>
          <sl-option>Option 1</sl-option>
          <sl-option>Option 2</sl-option>
          <sl-option>Option 3</sl-option>
        </sl-listbox>
      </sl-combobox>

      <sl-combobox multiple placeholder="Multiple" .value=${['Option 1', 'Option 2']}>
        <sl-listbox>
          <sl-option>Option 1</sl-option>
          <sl-option>Option 2</sl-option>
          <sl-option>Option 3</sl-option>
        </sl-listbox>
      </sl-combobox>
      <sl-combobox multiple placeholder="Multiple" size="lg" .value=${['Option 1', 'Option 2']}>
        <sl-listbox>
          <sl-option>Option 1</sl-option>
          <sl-option>Option 2</sl-option>
          <sl-option>Option 3</sl-option>
        </sl-listbox>
      </sl-combobox>

      <sl-combobox disabled multiple placeholder="Multiple, disabled" .value=${['Option 1', 'Option 2']}>
        <sl-listbox>
          <sl-option>Option 1</sl-option>
          <sl-option>Option 2</sl-option>
          <sl-option>Option 3</sl-option>
        </sl-listbox>
      </sl-combobox>
      <sl-combobox disabled multiple placeholder="Multiple, disabled" size="lg" .value=${['Option 1', 'Option 2']}>
        <sl-listbox>
          <sl-option>Option 1</sl-option>
          <sl-option>Option 2</sl-option>
          <sl-option>Option 3</sl-option>
        </sl-listbox>
      </sl-combobox>
    </div>
  `
};
