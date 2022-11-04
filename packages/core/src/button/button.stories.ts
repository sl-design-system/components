import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../button-bar/register.js';
import './register.js';

export default {
  title: 'Button'
};

export const API: StoryObj = {
  args: {
    fill: 'default',
    size: 'md',
    text: 'Button',
    variant: 'default'
  },
  argTypes: {
    fill: {
      control: 'inline-radio',
      options: ['default', 'outline']
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg']
    },
    variant: {
      control: 'radio',
      options: ['default', 'primary', 'success', 'warning', 'danger']
    }
  },
  render: ({ fill, size, text, variant }) => html`
    <sl-button .fill=${fill} .size=${size} .variant=${variant}>${text}</sl-button>
  `
};

export const Fills: StoryObj = {
  render: () => html`
    <sl-button-bar>
      <sl-button fill="default">Default</sl-button>
      <sl-button fill="outline">Outline</sl-button>
    </sl-button-bar>
  `
};

export const Sizes: StoryObj = {
  render: () => html`
    <sl-button-bar>
      <sl-button size="sm">Small</sl-button>
      <sl-button size="md">Medium</sl-button>
      <sl-button size="lg">Large</sl-button>
    </sl-button-bar>
  `
};

export const Variants: StoryObj = {
  render: () => html`
    <style>
      .grid {
        display: inline-grid;
        gap: 1rem;
        grid-template-columns: 1fr 1fr;
        justify-items: center;
      }
    </style>
    <div class="grid">
      <sl-button>Default</sl-button>
      <sl-button disabled>Disabled</sl-button>
      <sl-button variant="primary">Primary</sl-button>
      <sl-button variant="primary" disabled>Disabled</sl-button>
      <sl-button variant="success">Success</sl-button>
      <sl-button variant="success" disabled>Disabled</sl-button>
      <sl-button variant="warning">Warning</sl-button>
      <sl-button variant="warning" disabled>Disabled</sl-button>
      <sl-button variant="danger">Danger</sl-button>
      <sl-button variant="danger" disabled>Disabled</sl-button>
    </div>
  `
};
