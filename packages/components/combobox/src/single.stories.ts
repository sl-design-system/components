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
  | 'options'
  | 'placeholder'
  | 'required'
  | 'selectOnly'
  | 'showValid'
  | 'value'
> & {
  hint?: string;
  label?: string;
  listbox?(): TemplateResult;
  maxWidth?: string;
  optionLabelPath?: string;
  optionValuePath?: string;
  reportValidity?: boolean;
};
export type Story = StoryObj<Props>;

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
    listbox: {
      table: { disable: true }
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
    listbox,
    maxWidth,
    name,
    optionLabelPath,
    optionValuePath,
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
            .optionLabelPath=${optionLabelPath}
            .optionValuePath=${optionValuePath}
            .options=${options}
            .placeholder=${placeholder}
            .value=${value}
            style=${`max-width: ${maxWidth ?? 'none'}`}
          >
            ${listbox?.()}
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

export const Basic: Story = {
  args: {
    listbox: () => html`<sl-listbox>${components.map(c => html`<sl-option>${c}</sl-option>`)}</sl-listbox>`
  }
};

export const AllowCustomValues: Story = {
  args: {
    ...Basic.args,
    allowCustomValues: true
  }
};

export const Disabled: Story = {
  args: {
    ...Basic.args,
    disabled: true
  }
};

export const FilterResults: Story = {
  args: {
    ...Basic.args,
    hint: 'The filterResults property is true, which means the list of options will be filtered based on user input.',
    filterResults: true
  }
};

export const Grouped: Story = {
  args: {
    listbox: () => html`
      <sl-listbox>
        <sl-option-group label="Actions">
          <sl-option>Button</sl-option>
          <sl-option>Button bar</sl-option>
          <sl-option>Menu button</sl-option>
          <sl-option>Toggle button</sl-option>
          <sl-option>Toggle group</sl-option>
        </sl-option-group>
        <sl-option-group label="Form">
          <sl-option>Checkbox</sl-option>
          <sl-option>Checkbox group</sl-option>
          <sl-option>Combobox</sl-option>
          <sl-option>Radio group</sl-option>
          <sl-option>Select</sl-option>
          <sl-option>Switch</sl-option>
          <sl-option>Text area</sl-option>
          <sl-option>Text field</sl-option>
        </sl-option-group>
      </sl-listbox>
    `
  }
};

export const Required: Story = {
  args: {
    ...Basic.args,
    hint: 'The component is required. This means you must select an option in order for the field to be valid.',
    reportValidity: true,
    required: true
  }
};

export const RichContent: Story = {
  args: {
    listbox: () => html`
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
    ...Basic.args,
    value: 'Button bar'
  }
};

export const SelectOnly: Story = {
  args: {
    ...Basic.args,
    hint: 'The component is select only. This means you cannot type in the text field, but you can still select options.',
    selectOnly: true
  }
};

export const VirtualList: Story = {
  args: {
    optionLabelPath: 'label',
    optionValuePath: 'value',
    options: Array.from({ length: 10000 }).map((_, i) => ({ label: `Option ${i + 1}`, value: i })),
    value: 3000
  }
};