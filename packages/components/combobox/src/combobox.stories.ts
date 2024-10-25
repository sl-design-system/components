import '@sl-design-system/badge/register.js';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/form/register.js';
import '@sl-design-system/listbox/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html, nothing } from 'lit';
import '../register.js';
import { Combobox } from './combobox.js';

type Props = Pick<
  Combobox,
  | 'allowCustomValues'
  | 'autocomplete'
  | 'disabled'
  | 'filterResults'
  | 'groupSelected'
  | 'multiple'
  | 'name'
  | 'placeholder'
  | 'required'
  | 'selectOnly'
  | 'showValid'
  | 'value'
> & {
  hint?: string;
  label?: string;
  maxWidth?: string;
  options?(): TemplateResult;
  reportValidity?: boolean;
};
type Story = StoryObj<Props>;

export const components = [
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
  excludeStories: ['components'],
  args: {
    allowCustomValues: false,
    autocomplete: 'both',
    disabled: false,
    filterResults: false,
    label: 'Label',
    multiple: false,
    name: 'combobox',
    placeholder: 'Choose a component',
    required: false,
    selectOnly: false
  },
  argTypes: {
    autocomplete: {
      control: 'inline-radio',
      options: ['off', 'inline', 'list', 'both']
    },
    options: {
      table: { disable: true }
    }
  },
  render: ({
    allowCustomValues,
    autocomplete,
    disabled,
    filterResults,
    groupSelected,
    hint,
    label,
    maxWidth,
    multiple,
    name,
    options,
    placeholder,
    reportValidity,
    required,
    selectOnly,
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
            ?allow-custom-values=${allowCustomValues}
            ?disabled=${disabled}
            ?filter-results=${filterResults}
            ?group-selected=${groupSelected}
            ?multiple=${multiple}
            ?required=${required}
            ?select-only=${selectOnly}
            .autocomplete=${autocomplete}
            .name=${name}
            .placeholder=${placeholder}
            .value=${value}
            style=${`max-width: ${maxWidth ?? 'none'}`}
          >
            ${options?.() ?? html`<sl-listbox>${components.map(c => html`<option>${c}</option>`)}</sl-listbox>`}
          </sl-combobox>
        </sl-form-field>
        ${reportValidity
          ? html`
              <sl-button-bar>
                <sl-button @click=${onClick}>Report validity</sl-button>
              </sl-button-bar>
            `
          : nothing}
      </sl-form>
      <pre></pre>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const AllowCustomValues: Story = {
  args: {
    allowCustomValues: true
  }
};

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

export const Grouped: Story = {
  args: {
    options: () => html`
      <sl-listbox>
        <optgroup label="Actions">
          <option>Button</option>
          <option>Button bar</option>
          <option>Menu button</option>
          <option>Toggle button</option>
          <option>Toggle group</option>
        </optgroup>
        <optgroup label="Form">
          <option>Checkbox</option>
          <option>Checkbox group</option>
          <option>Combobox</option>
          <option>Radio group</option>
          <option>Select</option>
          <option>Switch</option>
          <option>Text area</option>
          <option>Text field</option>
        </optgroup>
      </sl-listbox>
    `
  }
};

export const Required: Story = {
  args: {
    hint: 'The component is required. This means you must select an option in order for the field to be valid.',
    reportValidity: true,
    required: true
  }
};

export const RichContent: Story = {
  args: {
    options: () => html`
      <style>
        sl-option::part(wrapper) {
          gap: 0.5rem;
        }
        sl-badge {
          flex-shrink: 0;
          margin-inline-start: auto;
        }
      </style>
      <sl-listbox>
        <sl-option value="chapter-1">Chapter 1 <sl-badge emphasis="bold" variant="info">Published</sl-badge></sl-option>
        <sl-option value="chapter-2">Chapter 2 <sl-badge emphasis="bold" variant="info">Published</sl-badge></sl-option>
        <sl-option value="chapter-3">
          Cillum proident reprehenderit amet ipsum labore aliqua ea excepteur enim duis. Nisi eu nulla eiusmod irure ut
          anim aute ex eiusmod nisi do Lorem ut. Pariatur anim tempor in fugiat. Sit ullamco exercitation ipsum et eu
          nisi id minim ut. Labore id fugiat exercitation dolor fugiat non dolore anim et enim ex consequat non Lorem.
          Lorem quis sint et et. <sl-badge emphasis="bold">Draft</sl-badge>
        </sl-option>
      </sl-listbox>
    `
  }
};

export const Selected: Story = {
  args: {
    value: 'Button bar'
  }
};

export const SelectOnly: Story = {
  args: {
    hint: 'The component is select only. This means you cannot type in the text field, but you can still select options.',
    selectOnly: true
  }
};

export const StressTest: Story = {
  render: () => html`
    <sl-combobox>
      <sl-listbox>${Array.from({ length: 5000 }).map((_, i) => html`<option>Option ${i}</option>`)}</sl-listbox>
    </sl-combobox>
  `
};

export const All: Story = {
  render: () => html`
    <style>
      .container {
        align-items: center;
        display: grid;
        grid-template-columns: minmax(auto, 350px) minmax(auto, 350px);
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
          <option>Option 1</option>
          <option>Option 2</option>
          <option>Option 3</option>
        </sl-listbox>
      </sl-combobox>
      <sl-combobox placeholder="Empty" size="lg">
        <sl-listbox>
          <option>Option 1</option>
          <option>Option 2</option>
          <option>Option 3</option>
        </sl-listbox>
      </sl-combobox>

      <sl-combobox placeholder="Selected" value="Option 2">
        <sl-listbox>
          <option>Option 1</option>
          <option>Option 2</option>
          <option>Option 3</option>
        </sl-listbox>
      </sl-combobox>
      <sl-combobox placeholder="Selected" size="lg" value="Option 2">
        <sl-listbox>
          <option>Option 1</option>
          <option>Option 2</option>
          <option>Option 3</option>
        </sl-listbox>
      </sl-combobox>

      <sl-combobox select-only placeholder="Select only">
        <sl-listbox>
          <option>Option 1</option>
          <option>Option 2</option>
          <option>Option 3</option>
        </sl-listbox>
      </sl-combobox>
      <sl-combobox select-only placeholder="Select only" size="lg">
        <sl-listbox>
          <option>Option 1</option>
          <option>Option 2</option>
          <option>Option 3</option>
        </sl-listbox>
      </sl-combobox>

      <sl-combobox disabled placeholder="Disabled">
        <sl-listbox>
          <option>Option 1</option>
          <option>Option 2</option>
          <option>Option 3</option>
        </sl-listbox>
      </sl-combobox>
      <sl-combobox disabled placeholder="Disabled" size="lg">
        <sl-listbox>
          <option>Option 1</option>
          <option>Option 2</option>
          <option>Option 3</option>
        </sl-listbox>
      </sl-combobox>

      <sl-combobox disabled multiple placeholder="Multiple, disabled" .value=${['Option 1', 'Option 2']}>
        <sl-listbox>
          <option>Option 1</option>
          <option>Option 2</option>
          <option>Option 3</option>
        </sl-listbox>
      </sl-combobox>
      <sl-combobox disabled multiple placeholder="Multiple, disabled" size="lg" .value=${['Option 1', 'Option 2']}>
        <sl-listbox>
          <option>Option 1</option>
          <option>Option 2</option>
          <option>Option 3</option>
        </sl-listbox>
      </sl-combobox>

      <sl-combobox multiple placeholder="Multiple" .value=${['Option 1', 'Option 2']}>
        <sl-listbox>
          <option>Option 1</option>
          <option>Option 2</option>
          <option>Option 3</option>
        </sl-listbox>
      </sl-combobox>
      <sl-combobox multiple placeholder="Multiple" size="lg" .value=${['Option 1', 'Option 2']}>
        <sl-listbox>
          <option>Option 1</option>
          <option>Option 2</option>
          <option>Option 3</option>
        </sl-listbox>
      </sl-combobox>

      <sl-combobox multiple placeholder="Multiple, stacked" .value=${['Option 1', 'Option 2', 'Option 3', 'Option 4']}>
        <sl-listbox>
          <option>Option 1</option>
          <option>Option 2</option>
          <option>Option 3</option>
          <option>Option 4</option>
          <option>Option 5</option>
        </sl-listbox>
      </sl-combobox>
      <sl-combobox
        multiple
        placeholder="Multiple, stacked"
        size="lg"
        .value=${['Option 1', 'Option 2', 'Option 3', 'Option 4']}
      >
        <sl-listbox>
          <option>Option 1</option>
          <option>Option 2</option>
          <option>Option 3</option>
          <option>Option 4</option>
          <option>Option 5</option>
        </sl-listbox>
      </sl-combobox>
    </div>
  `
};
