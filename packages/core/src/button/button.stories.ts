import type { ButtonFill, ButtonSize } from './button.js';
import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../button-bar/register.js';
import '../icon/register.js';
import './register.js';

export default {
  title: 'Button',
  args: {
    fill: 'default',
    size: 'md',
    variant: 'default'
  },
  argTypes: {
    fill: {
      control: 'inline-radio',
      options: ['default', 'outline', 'link']
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg']
    },
    variant: {
      control: 'radio',
      options: ['default', 'primary', 'success', 'warning', 'danger']
    },
    icon: {
      control: 'inline-radio',
      options: ['start', 'end', 'none']
    }
  }
};

export const API: StoryObj = {
  args: {
    text: 'Button'
  },
  render: ({ fill, size, text, variant }) => html`
    <sl-button .fill=${fill} .size=${size} .variant=${variant}>${text}</sl-button>
  `
};

export const All: StoryObj = {
  args: {
    fills: ['default', 'outline', 'link'],
    sizes: ['sm', 'md', 'lg']
  },
  render: ({ icon, fills, sizes }) => {
    const startIcon = icon === 'start' ? html`<sl-icon name="star"></sl-icon>` : '';
    const endIcon = icon === 'end' ? html`<sl-icon name="star"></sl-icon>` : '';
    return html`
      <style>
        .grid {
          display: inline-grid;
          gap: 1rem;
          grid-template-columns: repeat(6, 1fr);
          justify-items: center;
        }
      </style>
      <div class="grid">
        ${(sizes as ButtonSize[]).map((size: ButtonSize) =>
          (fills as ButtonFill[]).map(
            (fill: ButtonFill) => html`
              <sl-button .fill=${fill} .size=${size}><sl-icon name="star"></sl-icon></sl-button>
              <sl-button .fill=${fill} .size=${size}>${startIcon}Default${endIcon}</sl-button>
              <sl-button .fill=${fill} .size=${size} variant="primary">${startIcon}Primary${endIcon}</sl-button>
              <sl-button .fill=${fill} .size=${size} variant="success">${startIcon}Success${endIcon}</sl-button>
              <sl-button .fill=${fill} .size=${size} variant="warning">${startIcon}Warning${endIcon}</sl-button>
              <sl-button .fill=${fill} .size=${size} variant="danger">${startIcon}Danger${endIcon}</sl-button>

              <sl-button disabled .fill=${fill} .size=${size}><sl-icon name="star"></sl-icon></sl-button>
              <sl-button disabled .fill=${fill} .size=${size}>${startIcon}Default${endIcon}</sl-button>
              <sl-button disabled .fill=${fill} .size=${size} variant="primary"
                >${startIcon}Primary${endIcon}</sl-button
              >
              <sl-button disabled .fill=${fill} .size=${size} variant="success"
                >${startIcon}Success${endIcon}</sl-button
              >
              <sl-button disabled .fill=${fill} .size=${size} variant="warning"
                >${startIcon}Warning${endIcon}</sl-button
              >
              <sl-button disabled .fill=${fill} .size=${size} variant="danger">${startIcon}Danger${endIcon}</sl-button>
            `
          )
        )}
      </div>
    `;
  }
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
    <style>
      .grid {
        display: inline-grid;
        gap: 1rem;
        grid-template-columns: repeat(4, max-content);
        justify-items: start;
      }
    </style>
    <div class="grid">
      <sl-button .fill=${fill} size="sm" .variant=${variant}><sl-icon name="star"></sl-icon></sl-button>
      <sl-button .fill=${fill} size="sm" .variant=${variant}><sl-icon name="star"></sl-icon> Icon small</sl-button>
      <sl-button .fill=${fill} size="sm" .variant=${variant}>Icon small<sl-icon name="star"></sl-icon></sl-button>
      <sl-button .fill=${fill} size="sm" .variant=${variant}>Small</sl-button>

      <sl-button .fill=${fill} size="md" .variant=${variant}><sl-icon name="star"></sl-icon></sl-button>
      <sl-button .fill=${fill} size="md" .variant=${variant}><sl-icon name="star"></sl-icon> Icon Medium</sl-button>
      <sl-button .fill=${fill} size="md" .variant=${variant}>Icon Medium<sl-icon name="star"></sl-icon></sl-button>
      <sl-button .fill=${fill} size="md" .variant=${variant}>Medium</sl-button>

      <sl-button .fill=${fill} size="lg" .variant=${variant}><sl-icon name="star"></sl-icon></sl-button>
      <sl-button .fill=${fill} size="lg" .variant=${variant}><sl-icon name="star"></sl-icon> Icon Large</sl-button>
      <sl-button .fill=${fill} size="lg" .variant=${variant}>Icon Large<sl-icon name="star"></sl-icon></sl-button>
      <sl-button .fill=${fill} size="lg" .variant=${variant}>Large</sl-button>
    </div>
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
