import type { Button, ButtonFill, ButtonSize, ButtonVariant } from './button.js';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/icon/register.js';
import { faPinata } from '@fortawesome/pro-regular-svg-icons';
import { Icon } from '@sl-design-system/icon';
import { html } from 'lit';
import '../register.js';

interface Props extends Pick<Button, 'fill' | 'size' | 'variant'> {
  icon: string;
  text: string;
  disabled: boolean;
}

type Story = StoryObj<Props>;

const fills: ButtonFill[] = ['solid', 'outline', 'ghost', 'link'];
const variants: ButtonVariant[] = ['default', 'primary', 'success', 'warning', 'danger'];
const sizes: ButtonSize[] = ['sm', 'md', 'lg'];

export default {
  title: 'Button',
  args: {
    text: 'Button',
    icon: 'none',
    size: 'md',
    fill: 'solid',
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
  render: () => {
    return html`
      <style>
        table {
          border-collapse: collapse;
        }
        td,
        th {
          padding: 4px;
        }
        th {
          text-align: center;
          text-transform: capitalize;
        }
        td:nth-of-type(6n + 1):not(:last-of-type):not(:nth-of-type(1)) {
          border-right: 2px solid #dedede;
          padding-right: 24px;
        }
        td:nth-of-type(6n + 2) {
          padding-left: 24px;
        }
        td:nth-of-type(1) {
          border-right: none;
          font-weight: bold;
          padding-right: 1rem;
          text-transform: capitalize;
        }
        td.header {
          font-weight: bold;
          text-align: center;
          text-transform: capitalize;
        }
      </style>
      <table>
        <thead>
          <tr>
            <th></th>
            ${sizes.map(size => html`<th colspan="6">${size}</th>`)}
          </tr>
        </thead>
        <tbody>
          ${fills.map(
            fill => html`
              <tr>
                <td></td>
                <td colspan="18" class="header">${fill}</td>
              </tr>
              <tr>
                <td></td>
                ${sizes.map(
                  () => html`
                    <td colspan="3" class="header">Enabled</td>
                    <td colspan="3" class="header">Disabled</td>
                  `
                )}
              </tr>
              ${variants.map(
                variant => html`
                  <tr>
                    <td>${variant}</td>
                    ${sizes.map(
                      size => html`
                        <td><sl-button .fill=${fill} .size=${size} .variant=${variant}>Label</sl-button></td>
                        <td>
                          <sl-button .fill=${fill} .size=${size} .variant=${variant}>
                            <sl-icon name="face-smile"></sl-icon>
                            Label
                          </sl-button>
                        </td>
                        <td>
                          <sl-button .fill=${fill} .size=${size} .variant=${variant}>
                            <sl-icon name="face-smile"></sl-icon>
                          </sl-button>
                        </td>
                        <td><sl-button .fill=${fill} .size=${size} .variant=${variant} disabled>Label</sl-button></td>
                        <td>
                          <sl-button .fill=${fill} .size=${size} .variant=${variant} disabled>
                            <sl-icon name="face-smile"></sl-icon>
                            Label
                          </sl-button>
                        </td>
                        <td>
                          <sl-button .fill=${fill} .size=${size} .variant=${variant} disabled>
                            <sl-icon name="face-smile"></sl-icon>
                          </sl-button>
                        </td>
                      `
                    )}
                  </tr>
                `
              )}
            `
          )}
        </tbody>
      </table>
    `;
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

export const AlignmentIssues: Story = {
  argTypes: {
    size: {
      table: {
        disable: true
      }
    }
  },
  render: ({ fill, variant }) => {
    Icon.registerIcon(faPinata);
    return html`
      <sl-button .fill=${fill} size="md" .variant=${variant}><sl-icon name="far-pinata"></sl-icon></sl-button>
      <sl-button .fill=${fill} size="md" .variant=${variant}><sl-icon name="far-pinata"></sl-icon></sl-button><br />
      <span>Some random text</span>
      <sl-button .fill=${fill} size="md" .variant=${variant}><sl-icon name="far-pinata"></sl-icon></sl-button>
    `;
  }
};
