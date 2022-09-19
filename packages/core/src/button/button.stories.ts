import { Story } from '@storybook/web-components';
import { html } from 'lit';
import '../button-bar/register.js';
import './register.js';

export default {
  title: 'Button'
};

export const API: Story = {
  args: {
    fill: 'solid',
    size: 'lg',
    text: 'Button',
    variant: 'primary'
  },
  argTypes: {
    fill: {
      control: {
        type: 'inline-radio',
        options: ['ghost', 'outline', 'solid', 'subtle']
      }
    },
    size: {
      control: {
        type: 'inline-radio',
        options: ['sm', 'md', 'lg']
      }
    },
    variant: {
      control: {
        type: 'radio',
        options: ['primary', 'secondary']
      }
    }
  },
  render: ({ fill, size, text, variant }) => html`
    <sl-button .fill=${fill} .size=${size} .variant=${variant}>${text}</sl-button>
  `
};

export const Fills: Story = {
  render: () => html`
    <sl-button-bar>
      <sl-button fill="ghost">Ghost</sl-button>
      <sl-button fill="outline">Outline</sl-button>
      <sl-button fill="solid">Solid</sl-button>
      <sl-button fill="subtle">Subtle</sl-button>
    </sl-button-bar>
  `
};

export const Sizes: Story = {
  render: () => html`
    <sl-button-bar>
      <sl-button size="sm">Small</sl-button>
      <sl-button size="md">Medium</sl-button>
      <sl-button size="lg">Large</sl-button>
    </sl-button-bar>
  `
};

export const Variants: Story = {
  render: () => html`
    <sl-button-bar>
      <sl-button>Primary</sl-button>
      <sl-button disabled>Primary disabled</sl-button>
      <sl-button variant="secondary">Secondary</sl-button>
      <sl-button variant="secondary" disabled>Secondary disabled</sl-button>
    </sl-button-bar>
  `
};
