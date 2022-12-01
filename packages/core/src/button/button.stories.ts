import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../button-bar/register.js';
import './register.js';

export default {
  title: 'Button',
  argTypes: {
    fill: {
      control: 'inline-radio',
      options: ['default', 'outline'],
      defaultValue: 'default'
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      defaultValue: 'sm'
    },
    variant: {
      control: 'radio',
      options: ['default', 'primary', 'success', 'warning', 'danger'],
      defaultValue: 'default'
    }
  }
};

export const API: StoryObj = {
  args: {
    fill: 'default',
    size: 'md',
    text: 'Button',
    variant: 'default'
  },
  render: ({ fill, size, text, variant }) => html`
    <sl-button .fill=${fill} .size=${size} .variant=${variant}>${text}</sl-button>
  `
};

export const Fills: StoryObj = {
  argTypes: {
    fill: {
      table: {
        disable: true
      }
    }
  },
  render: ({ size, variant }) => html`
    <sl-button-bar>
      <sl-button fill="default" .size=${size} .variant=${variant}>Default</sl-button>
      <sl-button fill="outline" .size=${size} .variant=${variant}>Outline</sl-button>
    </sl-button-bar>
  `
};

export const Sizes: StoryObj = {
  argTypes: {
    size: {
      table: {
        disable: true
      }
    }
  },
  render: ({ fill, variant }) => html`
    <sl-button-bar>
      <sl-button .fill=${fill} size="sm" .variant=${variant}>Small</sl-button>
      <sl-button .fill=${fill} size="md" .variant=${variant}>Medium</sl-button>
      <sl-button .fill=${fill} size="lg" .variant=${variant}>Large</sl-button>
    </sl-button-bar>
  `
};

export const Variants: StoryObj = {
  argTypes: {
    variant: {
      table: {
        disable: true
      }
    }
  },
  render: ({ fill, size }) => html`
    <style>
      .grid {
        display: inline-grid;
        gap: 1rem;
        grid-template-columns: 1fr 1fr;
        justify-items: center;
      }
    </style>
    <div class="grid">
      <sl-button .fill=${fill} .size=${size}>Default</sl-button>
      <sl-button .fill=${fill} .size=${size} disabled>Disabled</sl-button>
      <sl-button .fill=${fill} .size=${size} variant="primary">Primary</sl-button>
      <sl-button .fill=${fill} .size=${size} variant="primary" disabled>Disabled</sl-button>
      <sl-button .fill=${fill} .size=${size} variant="success">Success</sl-button>
      <sl-button .fill=${fill} .size=${size} variant="success" disabled>Disabled</sl-button>
      <sl-button .fill=${fill} .size=${size} variant="warning">Warning</sl-button>
      <sl-button .fill=${fill} .size=${size} variant="warning" disabled>Disabled</sl-button>
      <sl-button .fill=${fill} .size=${size} variant="danger">Danger</sl-button>
      <sl-button .fill=${fill} .size=${size} variant="danger" disabled>Disabled</sl-button>
    </div>
  `
};
