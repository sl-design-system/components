import type { Button, ButtonFill, ButtonSize, ButtonVariant } from './button.js';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/icon/register.js';
import { html } from 'lit';
import '../register.js';

interface Props extends Pick<Button, 'fill' | 'size' | 'variant'> {
  icon: string;
  text: string;
  disabled: boolean;
}

type Story = StoryObj<Props>;

const fills: ButtonFill[] = ['default', 'outline', 'link'];
const variants: ButtonVariant[] = ['default', 'primary', 'success', 'warning', 'danger'];
const disabledStates = [false, true];
const sizes: ButtonSize[] = ['sm', 'md', 'lg'];

export default {
  title: 'Button',
  args: {
    text: 'Button',
    icon: 'none',
    size: 'md',
    fill: 'default',
    variant: 'default'
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: sizes
    },
    icon: {
      control: 'inline-radio',
      options: ['start', 'end', 'none']
    },
    fill: {
      control: 'inline-radio',
      options: fills
    },
    variant: {
      control: 'radio',
      options: variants
    }
  },
  render: ({ fill, size, text, variant, icon }) => {
    const startIcon = icon === 'start' ? html`<sl-icon name="face-smile"></sl-icon>` : '';
    const endIcon = icon === 'end' ? html`<sl-icon name="face-smile"></sl-icon>` : '';

    return html`<sl-button .fill=${fill} .size=${size} .variant=${variant}>${startIcon}${text}${endIcon}</sl-button>`;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const All: Story = {
  render: ({ icon, size, text }) => {
    const startIcon = icon === 'start' ? html`<sl-icon name="face-smile"></sl-icon>` : '';
    const endIcon = icon === 'end' ? html`<sl-icon name="face-smile"></sl-icon>` : '';
    return html` <style>
        table {
          border-collapse: collapse;
        }

        th {
          text-transform: capitalize;
        }
        th,
        td {
          padding: 4px 8px;
        }
        thead td {
          text-align: center;
        }

        tbody td:nth-of-type(4n) {
          border-right: 2px solid #dedede;
          padding-right: 24px;
        }
        tbody td:nth-of-type(4n + 1):not(:first-of-type) {
          padding-left: 24px;
        }
        tbody td:last-of-type {
          border: none;
        }
      </style>
      <table>
        <thead>
          <tr>
            <td></td>
            ${fills.map(fill => html`<th colspan="4">${fill}</th>`)}
          </tr>
          <tr>
            <td></td>
            ${fills.map(_ =>
              disabledStates.map(disabledState => html` <td colspan="2">${disabledState ? 'Disabled' : 'Enabled'}</td>`)
            )}
          </tr>
        </thead>
        <tbody>
          ${variants.map(
            variant => html`
              <tr>
                <th>${variant}</th>
                ${fills.map(fill =>
                  disabledStates.map(
                    disabledState => html` <td>
                        <sl-button .fill=${fill} .size=${size} ?disabled=${disabledState} .variant=${variant}>
                          ${startIcon}${text}${endIcon}
                        </sl-button>
                      </td>
                      <td>
                        <sl-button .fill=${fill} .size=${size} ?disabled=${disabledState} .variant=${variant}>
                          <sl-icon name="face-smile"></sl-icon>
                        </sl-button>
                      </td>`
                  )
                )}
              </tr>
            `
          )}
        </tbody>
      </table>`;
  }
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
      ${sizes.map(
        size => html`
          <sl-button .fill=${fill} .size=${size} .variant=${variant}><sl-icon name="face-smile"></sl-icon></sl-button>
          <sl-button .fill=${fill} .size=${size} .variant=${variant}
            ><sl-icon name="face-smile"></sl-icon> Icon ${size}</sl-button
          >
          <sl-button .fill=${fill} .size=${size} .variant=${variant}
            >Icon ${size}<sl-icon name="face-smile"></sl-icon
          ></sl-button>
          <sl-button .fill=${fill} .size=${size} .variant=${variant}>${size}</sl-button>
        `
      )}
    </div>
  `
};
