import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/form/register.js';
import '@sl-design-system/listbox/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { type Combobox } from './combobox.js';
import { components } from './combobox.stories.js';

type Props = Pick<
  Combobox,
  | 'allowCustomValues'
  | 'autocomplete'
  | 'disabled'
  | 'filterResults'
  | 'groupSelected'
  | 'placeholder'
  | 'selectOnly'
  | 'value'
> & {
  maxWidth?: string;
  options?: unknown[] | TemplateResult;
  optionLabelPath?: string;
  optionValuePath?: string;
  virtualList?: boolean;
};
type Story = StoryObj<Props>;

export default {
  title: 'Form/Combobox/Multiple',
  args: {
    allowCustomValues: false,
    autocomplete: 'both',
    disabled: false,
    filterResults: false,
    placeholder: 'Choose a component',
    selectOnly: false,
    virtualList: false
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
    maxWidth,
    optionLabelPath,
    optionValuePath,
    options,
    placeholder,
    selectOnly,
    value,
    virtualList
  }) => {
    return html`
      <sl-combobox
        ?allow-custom-values=${allowCustomValues}
        ?disabled=${disabled}
        ?filter-results=${filterResults}
        ?group-selected=${groupSelected}
        ?select-only=${selectOnly}
        .options=${virtualList ? options : undefined}
        .value=${value}
        multiple
        autocomplete=${ifDefined(autocomplete)}
        option-label-path=${ifDefined(optionLabelPath)}
        option-value-path=${ifDefined(optionValuePath)}
        placeholder=${ifDefined(placeholder)}
        style=${`max-width: ${maxWidth ?? 'none'}`}
      >
        ${virtualList
          ? nothing
          : html`
              <sl-listbox>
                ${Array.isArray(options) ? options.map(o => html`<sl-option>${o}</sl-option>`) : options}
              </sl-listbox>
            `}
      </sl-combobox>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    options: components
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
    disabled: true,
    value: ['Button bar', 'Checkbox']
  }
};

export const FilterResults: Story = {
  args: {
    ...Basic.args,
    filterResults: true
  }
};

export const Grouped: Story = {
  args: {
    options: html`
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
    `
  }
};

export const GroupSelected: Story = {
  args: {
    ...Grouped.args,
    groupSelected: true,
    value: ['Button bar', 'Checkbox']
  }
};

export const RichContent: Story = {
  args: {
    options: html`
      <style>
        sl-option::part(wrapper) {
          gap: 0.5rem;
        }
        sl-badge {
          flex-shrink: 0;
          margin-inline-start: auto;
        }
      </style>
      <sl-option value="chapter-1">Chapter 1 <sl-badge emphasis="bold" variant="info">Published</sl-badge></sl-option>
      <sl-option value="chapter-2">Chapter 2 <sl-badge emphasis="bold" variant="info">Published</sl-badge></sl-option>
      <sl-option value="chapter-3">
        Cillum proident reprehenderit amet ipsum labore aliqua ea excepteur enim duis. Nisi eu nulla eiusmod irure ut
        anim aute ex eiusmod nisi do Lorem ut. Pariatur anim tempor in fugiat. Sit ullamco exercitation ipsum et eu nisi
        id minim ut. Labore id fugiat exercitation dolor fugiat non dolore anim et enim ex consequat non Lorem. Lorem
        quis sint et et. <sl-badge emphasis="bold">Draft</sl-badge>
      </sl-option>
    `
  }
};

export const SelectOnly: Story = {
  args: {
    ...Basic.args,
    selectOnly: true
  }
};

export const Stacked: Story = {
  args: {
    ...Basic.args,
    maxWidth: '700px',
    value: ['Switch', 'Card', 'Checkbox', 'Inline message', 'Menu', 'Panel', 'Spinner', 'Button bar']
  }
};

export const Value: Story = {
  args: {
    ...Basic.args,
    value: ['Button bar', 'Checkbox']
  }
};

export const VirtualList: Story = {
  args: {
    optionLabelPath: 'label',
    optionValuePath: 'value',
    options: Array.from({ length: 10000 }).map((_, i) => ({ label: `Option ${i + 1}`, value: i })),
    value: [3000],
    virtualList: true
  }
};
