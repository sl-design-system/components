import '@sl-design-system/badge/register.js';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/form/register.js';
import '@sl-design-system/listbox/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html, nothing } from 'lit';
import '../register.js';
import { Combobox } from './combobox.js';
import { components } from './combobox.stories.js';

type Props = Pick<
  Combobox,
  | 'allowCustomValues'
  | 'autocomplete'
  | 'disabled'
  | 'filterResults'
  | 'groupSelected'
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

export default {
  title: 'Form/Combobox/Single',
  args: {
    allowCustomValues: false,
    autocomplete: 'both',
    disabled: false,
    filterResults: false,
    label: 'Label',
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
