import '@sl-design-system/badge/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../register.js';

type Props = { options?(): TemplateResult | TemplateResult[] };
type Story = StoryObj<Props>;

export default {
  title: 'Utilities/Listbox',
  tags: ['draft'],
  argTypes: {
    options: {
      table: { disable: true }
    }
  },
  render: ({ options }) => {
    return html`
      <style>
        sl-listbox {
          border: var(--sl-color-elevation-border-raised) solid var(--sl-size-borderWidth-default);
          border-radius: var(--sl-size-borderRadius-default);
          padding: var(--sl-space-new-md) 0;
        }
      </style>
      <sl-listbox>${options?.()}</sl-listbox>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    options: () => html`
      <option>Option 1</option>
      <option>Option 2</option>
      <option>Option 3</option>
    `
  }
};

export const Disabled: Story = {
  args: {
    options: () => html`
      <option disabled>Option 1</option>
      <option>Option 2</option>
      <option>Option 3</option>
    `
  }
};

export const Divider: Story = {
  args: {
    options: () => html`
      <option>Option 1</option>
      <option>Option 2</option>
      <hr />
      <option>Option 3</option>
    `
  }
};

export const Grouped: Story = {
  args: {
    options: () => html`
      <optgroup label="Group 1">
        <option>Option 1</option>
        <option>Option 2</option>
      </optgroup>
      <optgroup label="Group 2">
        <option>Option 3</option>
        <option>Option 4</option>
      </optgroup>
    `
  }
};

export const Overflow: Story = {
  args: {
    options: () => html`
      <option></option>
      <option>Exercitation laborum elit.</option>
      <option>Aliqua sunt.</option>
    `
  }
};

export const Selected: Story = {
  args: {
    options: () => html`
      <option>Option 1</option>
      <option selected>Option 2</option>
      <option>Option 3</option>
    `
  }
};

export const RichContent: Story = {
  args: {
    options: () => html`
      <style>
        sl-badge {
          margin-inline-start: auto;
        }
      </style>
      <sl-option>Chapter 1 <sl-badge emphasis="bold" variant="info">Published</sl-badge></sl-option>
      <sl-option>Chapter 2 <sl-badge emphasis="bold" variant="info">Published</sl-badge></sl-option>
      <sl-option>Chapter 3 <sl-badge emphasis="bold">Draft</sl-badge></sl-option>
    `
  }
};

export const Scrolling: Story = {
  parameters: {
    layout: 'fullscreen'
  },
  render: () => html`
    <style>
      sl-listbox {
        max-block-size: calc(100dvh - 1rem);
      }
    </style>
    <sl-listbox>${Array.from({ length: 100 }).map((_, i) => html`<option>Option ${i + 1}</option>`)}</sl-listbox>
  `
};
