import '@sl-design-system/listbox/register.js';
import { type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../register.js';

export type Story = StoryObj;

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
  excludeStories: ['components']
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
      <sl-combobox placeholder="Empty" aria-label="Choose an option">
        <sl-listbox>
          <sl-option>Option 1</sl-option>
          <sl-option>Option 2</sl-option>
          <sl-option>Option 3</sl-option>
        </sl-listbox>
      </sl-combobox>
      <sl-combobox placeholder="Empty" size="lg" aria-label="Choose an option">
        <sl-listbox>
          <sl-option>Option 1</sl-option>
          <sl-option>Option 2</sl-option>
          <sl-option>Option 3</sl-option>
        </sl-listbox>
      </sl-combobox>

      <sl-combobox placeholder="Selected" value="Option 2" aria-label="Choose an option">
        <sl-listbox>
          <sl-option>Option 1</sl-option>
          <sl-option>Option 2</sl-option>
          <sl-option>Option 3</sl-option>
        </sl-listbox>
      </sl-combobox>
      <sl-combobox placeholder="Selected" size="lg" value="Option 2" aria-label="Choose an option">
        <sl-listbox>
          <sl-option>Option 1</sl-option>
          <sl-option>Option 2</sl-option>
          <sl-option>Option 3</sl-option>
        </sl-listbox>
      </sl-combobox>

      <sl-combobox select-only placeholder="Select only" aria-label="Choose an option">
        <sl-listbox>
          <sl-option>Option 1</sl-option>
          <sl-option>Option 2</sl-option>
          <sl-option>Option 3</sl-option>
        </sl-listbox>
      </sl-combobox>
      <sl-combobox select-only placeholder="Select only" size="lg" aria-label="Choose an option">
        <sl-listbox>
          <sl-option>Option 1</sl-option>
          <sl-option>Option 2</sl-option>
          <sl-option>Option 3</sl-option>
        </sl-listbox>
      </sl-combobox>

      <sl-combobox disabled placeholder="Disabled" aria-label="Choose an option">
        <sl-listbox>
          <sl-option>Option 1</sl-option>
          <sl-option>Option 2</sl-option>
          <sl-option>Option 3</sl-option>
        </sl-listbox>
      </sl-combobox>
      <sl-combobox disabled placeholder="Disabled" size="lg" aria-label="Choose an option">
        <sl-listbox>
          <sl-option>Option 1</sl-option>
          <sl-option>Option 2</sl-option>
          <sl-option>Option 3</sl-option>
        </sl-listbox>
      </sl-combobox>

      <sl-combobox
        disabled
        multiple
        placeholder="Multiple, disabled"
        .value=${['Option 1', 'Option 2']}
        aria-label="Choose an option">
        <sl-listbox>
          <sl-option>Option 1</sl-option>
          <sl-option>Option 2</sl-option>
          <sl-option>Option 3</sl-option>
        </sl-listbox>
      </sl-combobox>
      <sl-combobox
        disabled
        multiple
        placeholder="Multiple, disabled"
        size="lg"
        .value=${['Option 1', 'Option 2']}
        aria-label="Choose an option">
        <sl-listbox>
          <sl-option>Option 1</sl-option>
          <sl-option>Option 2</sl-option>
          <sl-option>Option 3</sl-option>
        </sl-listbox>
      </sl-combobox>

      <sl-combobox
        multiple
        placeholder="Multiple"
        .value=${['Option 1', 'Option 2']}
        aria-label="Choose an option">
        <sl-listbox>
          <sl-option>Option 1</sl-option>
          <sl-option>Option 2</sl-option>
          <sl-option>Option 3</sl-option>
        </sl-listbox>
      </sl-combobox>
      <sl-combobox
        multiple
        placeholder="Multiple"
        size="lg"
        .value=${['Option 1', 'Option 2']}
        aria-label="Choose an option">
        <sl-listbox>
          <sl-option>Option 1</sl-option>
          <sl-option>Option 2</sl-option>
          <sl-option>Option 3</sl-option>
        </sl-listbox>
      </sl-combobox>

      <sl-combobox
        multiple
        placeholder="Multiple, stacked"
        .value=${['Option 1', 'Option 2', 'Option 3', 'Option 4']}
        aria-label="Choose an option">
        <sl-listbox>
          <sl-option>Option 1</sl-option>
          <sl-option>Option 2</sl-option>
          <sl-option>Option 3</sl-option>
          <sl-option>Option 4</sl-option>
          <sl-option>Option 5</sl-option>
        </sl-listbox>
      </sl-combobox>
      <sl-combobox
        multiple
        placeholder="Multiple, stacked"
        size="lg"
        .value=${['Option 1', 'Option 2', 'Option 3', 'Option 4']}
        aria-label="Choose an option">
        <sl-listbox>
          <sl-option>Option 1</sl-option>
          <sl-option>Option 2</sl-option>
          <sl-option>Option 3</sl-option>
          <sl-option>Option 4</sl-option>
          <sl-option>Option 5</sl-option>
        </sl-listbox>
      </sl-combobox>
    </div>
  `
};
