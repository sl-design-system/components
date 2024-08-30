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
    return html`<sl-listbox>${options?.()}</sl-listbox>`;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    options: () => html`
      <sl-option>Option 1</sl-option>
      <sl-option>Option 2</sl-option>
      <sl-option>Option 3</sl-option>
    `
  }
};

export const Disabled: Story = {
  args: {
    options: () => html`
      <sl-option disabled>Option 1</sl-option>
      <sl-option>Option 2</sl-option>
      <sl-option>Option 3</sl-option>
    `
  }
};

export const Divider: Story = {
  args: {
    options: () => html`
      <sl-option>Option 1</sl-option>
      <sl-option>Option 2</sl-option>
      <hr />
      <sl-option>Option 3</sl-option>
    `
  }
};

export const Grouped: Story = {
  args: {
    options: () => html`
      <sl-option-group heading="Group 1">
        <sl-option>Option 1</sl-option>
        <sl-option>Option 2</sl-option>
      </sl-option-group>
      <sl-option-group heading="Group 2">
        <sl-option>Option 3</sl-option>
        <sl-option>Option 4</sl-option>
      </sl-option-group>
    `
  }
};

export const Selected: Story = {
  args: {
    options: () => html`
      <sl-option>Option 1</sl-option>
      <sl-option selected>Option 2</sl-option>
      <sl-option>Option 3</sl-option>
    `
  }
};

export const Overflow: Story = {
  parameters: {
    layout: 'fullscreen'
  },
  render: () => html`
    <style>
      sl-listbox {
        max-block-size: calc(100dvh - 1rem);
      }
    </style>
    <sl-listbox>
      ${Array.from({ length: 100 }).map((_, i) => html`<sl-option>Option ${i + 1}</sl-option>`)}
    </sl-listbox>
  `
};
