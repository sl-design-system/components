import { faPinata } from '@fortawesome/pro-regular-svg-icons';
import '@sl-design-system/button-bar/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';
import { type Button, type ButtonFill, type ButtonSize, type ButtonVariant } from './button.js';

interface Props extends Pick<Button, 'disabled' | 'fill' | 'size' | 'variant'> {
  icon: string;
  text: string;
}

type Story = StoryObj<Props>;

const fills: ButtonFill[] = ['solid', 'outline', 'link', 'ghost'];
const variants: ButtonVariant[] = ['default', 'primary', 'success', 'warning', 'danger'];
const disabledStates = [false, true];
const sizes: ButtonSize[] = ['sm', 'md', 'lg'];

Icon.register(faPinata);

export default {
  title: 'Components/Button',
  tags: ['draft'],
  args: {
    text: 'Button',
    icon: 'none',
    size: 'md',
    fill: 'solid',
    variant: 'default',
    disabled: false
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
  render: ({ fill, size, text, variant, icon, disabled }) => {
    const startIcon = icon === 'start' ? html`<sl-icon name="face-smile"></sl-icon>` : '';
    const endIcon = icon === 'end' ? html`<sl-icon name="face-smile"></sl-icon>` : '';

    return html`<sl-button .fill=${fill} .size=${size} .variant=${variant} ?disabled=${disabled}
      >${startIcon}${text}${endIcon}</sl-button
    >`;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const All: Story = {
  render: () => {
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

        tbody td:nth-of-type(6n) {
          border-right: 2px solid #dedede;
          padding-right: 24px;
        }
        tbody td:nth-of-type(6n + 1):not(:first-of-type) {
          padding-left: 24px;
        }
        tbody td:last-of-type {
          border: none;
        }
      </style>
      ${sizes.map(
        size =>
          html` <h2>Size: ${size}</h2>
            <table>
              <thead>
                <tr>
                  <td></td>
                  ${fills.map(fill => html`<th colspan="6">${fill}</th>`)}
                </tr>
                <tr>
                  <td></td>
                  ${fills.map(() =>
                    disabledStates.map(
                      disabledState => html`
                        <td colspan="3" class=${disabledState ? 'sb-disabled' : ''}>
                          ${disabledState ? 'Disabled' : 'Enabled'}
                        </td>
                      `
                    )
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
                          disabledState =>
                            html` <td class=${disabledState ? 'sb-disabled' : ''}>
                                <sl-button
                                  .fill=${fill}
                                  .size=${size}
                                  ?disabled=${disabledState}
                                  .variant=${variant}
                                  data-mock-state
                                  >Label
                                </sl-button>
                              </td>
                              <td class=${disabledState ? 'sb-disabled' : ''}>
                                <sl-button
                                  .fill=${fill}
                                  .size=${size}
                                  ?disabled=${disabledState}
                                  .variant=${variant}
                                  data-mock-state
                                >
                                  <sl-icon name="face-smile"></sl-icon> Label
                                </sl-button>
                              </td>
                              <td class=${disabledState ? 'sb-disabled' : ''}>
                                <sl-button
                                  .fill=${fill}
                                  .size=${size}
                                  ?disabled=${disabledState}
                                  .variant=${variant}
                                  data-mock-state
                                >
                                  <sl-icon name="face-smile"></sl-icon>
                                </sl-button>
                              </td>`
                        )
                      )}
                    </tr>
                  `
                )}
              </tbody>
            </table>`
      )}`;
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
    return html`
      <sl-button .fill=${fill} size="md" .variant=${variant}><sl-icon name="far-pinata"></sl-icon></sl-button>
      <sl-button .fill=${fill} size="md" .variant=${variant}><sl-icon name="far-pinata"></sl-icon></sl-button><br />
      <span>Some random text</span>
      <sl-button .fill=${fill} size="md" .variant=${variant}><sl-icon name="far-pinata"></sl-icon></sl-button>
    `;
  }
};
