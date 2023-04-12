import type { ButtonFill, ButtonSize, ButtonVariant } from './button.js';
import type { Meta, StoryObj } from '@storybook/web-components';
import '../button-bar/register.js';
import '../icon/register.js';
import './register.js';
import { html } from 'lit';

interface Props {
  fill: ButtonFill;
  size: ButtonSize;
  text: string;
  icon: string;
  variant: ButtonVariant;
}

type Story = StoryObj<Props>;

export default {
  title: 'Button',
  args: {
    fill: 'default',
    size: 'md',
    text: 'Button',
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
  },
  render: ({ fill, size, text, variant, icon }) => {
    const startIcon = icon === 'start' ? html`<sl-icon name="check"></sl-icon>` : '';
    const endIcon = icon === 'end' ? html`<sl-icon name="star"></sl-icon>` : '';

    return html`<sl-button .fill=${fill} .size=${size} .variant=${variant}>${startIcon}${text}${endIcon}</sl-button>`;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const All: Story = {
  render: ({ icon }) => {
    const fills = ['default', 'outline', 'link'];
    const sizes = ['sm', 'md', 'lg'];
    const disabledStates = [false, true];
    const startIcon = icon === 'start' ? html`<sl-icon name="face-smile"></sl-icon>` : '';
    const endIcon = icon === 'end' ? html`<sl-icon name="face-smile"></sl-icon>` : '';
    return html` <style>
        .grid {
          display: inline-grid;
          gap: 1rem;
          grid-template-columns: repeat(7, 1fr);
          justify-items: center;
        }
      </style>
      <div class="grid">
        ${(sizes as ButtonSize[]).map((size: ButtonSize) =>
          (fills as ButtonFill[]).map((fill: ButtonFill) =>
            disabledStates.map(
              (disabledState: boolean) => html`
                <sl-button .fill=${fill} .size=${size} ?disabled=${disabledState}>
                  <sl-icon name="face-smile"></sl-icon>
                </sl-button>
                <sl-button .fill=${fill} .size=${size} ?disabled=${disabledState} variant="primary">
                  <sl-icon name="face-smile"></sl-icon>
                </sl-button>
                <sl-button .fill=${fill} .size=${size} ?disabled=${disabledState}>
                  ${startIcon}Default${endIcon}
                </sl-button>
                <sl-button .fill=${fill} .size=${size} ?disabled=${disabledState} variant="primary">
                  ${startIcon}Primary${endIcon}
                </sl-button>
                <sl-button .fill=${fill} .size=${size} ?disabled=${disabledState} variant="success">
                  ${startIcon}Success${endIcon}
                </sl-button>
                <sl-button .fill=${fill} .size=${size} ?disabled=${disabledState} variant="warning">
                  ${startIcon}Warning${endIcon}
                </sl-button>
                <sl-button .fill=${fill} .size=${size} ?disabled=${disabledState} variant="danger">
                  ${startIcon}Danger${endIcon}
                </sl-button>
              `
            )
          )
        )}
      </div>`;
  }
};

export const Fills: Story = {
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

export const Sizes: Story = {
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

export const Variants: Story = {
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
