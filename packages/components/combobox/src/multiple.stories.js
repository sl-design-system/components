import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/form/register.js';
import '@sl-design-system/listbox/register.js';
import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { components } from './combobox.stories.js';
export default {
  title: 'Form/Combobox/Multiple',
  args: {
    allowCustomValues: false,
    autocomplete: 'both',
    disabled: false,
    filterResults: false,
    label: 'Component',
    hint: '',
    maxWidth: '500px',
    placeholder: '',
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
    hint,
    label,
    maxWidth,
    optionGroupPath,
    optionLabelPath,
    optionValuePath,
    options,
    placeholder,
    selectOnly,
    value,
    virtualList
  }) => {
    return html`
      <sl-form>
        <sl-form-field label=${ifDefined(label)} hint=${ifDefined(hint)}>
          <sl-combobox
            ?allow-custom-values=${allowCustomValues}
            ?disabled=${disabled}
            ?filter-results=${filterResults}
            ?group-selected=${groupSelected}
            ?select-only=${selectOnly}
            .options=${virtualList ? options : void 0}
            .value=${value}
            multiple
            autocomplete=${ifDefined(autocomplete)}
            option-group-path=${ifDefined(optionGroupPath)}
            option-label-path=${ifDefined(optionLabelPath)}
            option-value-path=${ifDefined(optionValuePath)}
            placeholder=${ifDefined(placeholder)}
            style=${`max-width: ${maxWidth || '500px'}`}>
            ${
              virtualList
                ? nothing
                : html`
                    <sl-listbox>
                      ${Array.isArray(options) ? options.map(o => html`<sl-option>${o}</sl-option>`) : options?.()}
                    </sl-listbox>
                  `
            }
          </sl-combobox>
        </sl-form-field>
      </sl-form>
    `;
  }
};
export const Basic = {
  args: {
    options: components
  }
};
export const AllowCustomValues = {
  args: {
    ...Basic.args,
    allowCustomValues: true
  }
};
export const Disabled = {
  args: {
    ...Basic.args,
    disabled: true,
    value: ['Button bar', 'Checkbox']
  }
};
export const FilterResults = {
  args: {
    ...Basic.args,
    filterResults: true
  }
};
export const GroupSelected = {
  args: {
    ...Basic.args,
    groupSelected: true,
    value: ['Button bar', 'Checkbox']
  }
};
export const Groups = {
  args: {
    options: () => html`
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
export const GroupsWithGroupSelected = {
  args: {
    ...Groups.args,
    groupSelected: true,
    value: ['Button bar', 'Checkbox']
  }
};
export const RichContent = {
  args: {
    label: 'Chapter',
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
      <sl-option value="chapter-1"
        >Chapter 1 - Latin <sl-badge size="lg" variant="info">Published</sl-badge></sl-option
      >
      <sl-option value="chapter-2"
        >Chapter 2 - Greek <sl-badge size="lg" variant="info">Published</sl-badge></sl-option
      >
      <sl-option value="chapter-3">
        Chapter 3 - Cillum proident reprehenderit amet ipsum labore aliqua ea excepteur enim duis.
        Nisi eu nulla eiusmod irure ut anim aute ex eiusmod nisi do Lorem ut. Pariatur anim tempor
        in fugiat. Sit ullamco exercitation ipsum et eu nisi id minim ut. Labore id fugiat
        exercitation dolor fugiat non dolore anim et enim ex consequat non Lorem. Lorem quis sint et
        et. <sl-badge emphasis="bold" size="lg">Draft</sl-badge>
      </sl-option>
    `
  }
};
export const SelectOnly = {
  args: {
    ...Basic.args,
    selectOnly: true
  }
};
export const Selected = {
  args: {
    label: 'Your favourite nonsensical word',
    options: () => html`
      <sl-option>Lorem</sl-option>
      <sl-option selected>Ipsum</sl-option>
      <sl-option selected>Dolar</sl-option>
    `
  }
};
export const Stacked = {
  args: {
    ...Basic.args,
    value: [
      'Switch',
      'Card',
      'Checkbox',
      'Inline message',
      'Menu',
      'Panel',
      'Spinner',
      'Button bar'
    ]
  }
};
export const Value = {
  args: {
    ...Basic.args,
    value: ['Button bar', 'Checkbox']
  }
};
export const VirtualList = {
  args: {
    groupSelected: true,
    optionLabelPath: 'label',
    optionValuePath: 'value',
    options: Array.from({ length: 1e4 }).map((_, i) => ({ label: `Option ${i + 1}`, value: i })),
    value: [3e3],
    virtualList: true
  }
};
export const VirtualListWithGroups = {
  args: {
    groupSelected: true,
    optionGroupPath: 'group',
    optionLabelPath: 'label',
    optionValuePath: 'value',
    options: Array.from({ length: 1e4 }).map((_, i) => ({
      group: `Options ${Math.floor((i + 1) / 100) * 100}..${Math.floor((i + 1) / 100) * 100 + 99}`,
      label: `Option ${i + 1}`,
      value: i
    })),
    value: [3e3],
    virtualList: true
  }
};
//# sourceMappingURL=multiple.stories.js.map
