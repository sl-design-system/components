import { faPinata, faUniversalAccess } from '@fortawesome/pro-regular-svg-icons';
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
const variants: ButtonVariant[] = ['default', 'primary', 'secondary', 'success', 'info', 'warning', 'danger'];
const disabledStates = [false, true];
const sizes: ButtonSize[] = ['sm', 'md', 'lg'];

Icon.register(faPinata, faUniversalAccess);

export default {
  title: 'Actions/Button',
  tags: ['stable'],
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

    return html`
      <sl-button .fill=${fill} .size=${size} .variant=${variant} ?disabled=${disabled}>
        ${startIcon}${text}${endIcon}
      </sl-button>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

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

export const All: Story = {
  render: () => {
    return html`
      <style>
        .sizes {
          align-items: center;
          align-self: start;
          display: inline-grid;
          gap: 1rem 2rem;
          grid-template-columns: auto 1fr 1fr 1fr 1fr;
          justify-items: center;
          margin-block-end: 2rem;
          position: relative;
        }
        .variants {
          align-items: center;
          align-self: start;
          display: inline-grid;
          gap: 1rem 2rem;
          grid-template-columns: auto 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
          justify-items: center;
          position: relative;

          > span:nth-of-type(8) {
            color: var(--sl-color-text-inverted);
          }
        }
        .inverted-background {
          background: linear-gradient(
            to right,
            var(--sl-color-background-accent-grey-bold-idle),
            var(--sl-color-background-accent-grey-bold-idle) 50%,
            var(--sl-color-palette-blue-700) 50%,
            var(--sl-color-palette-blue-700) 100%
          );
          grid-column: 8 / 9;
          grid-row: 1 / 6;
          inset: -1rem;
          position: absolute;
          z-index: -1;
        }
      </style>
      <section class="sizes">
        <span></span>
        <span>Square text</span>
        <span>Square icon</span>
        <span>Pill text</span>
        <span>Pill icon</span>

        <span>Small</span>
        <sl-button fill="outline" size="sm" variant="primary">Button</sl-button>
        <sl-button fill="outline" size="sm" variant="primary">
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button fill="outline" shape="pill" size="sm" variant="primary">Button</sl-button>
        <sl-button fill="outline" shape="pill" size="sm" variant="primary">
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>

        <span>Medium</span>
        <sl-button fill="outline" variant="primary">Button</sl-button>
        <sl-button fill="outline" variant="primary">
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button fill="outline" shape="pill" variant="primary">Button</sl-button>
        <sl-button fill="outline" shape="pill" variant="primary">
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>

        <span>Large</span>
        <sl-button fill="outline" size="lg" variant="primary">Button</sl-button>
        <sl-button fill="outline" size="lg" variant="primary">
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button fill="outline" shape="pill" size="lg" variant="primary">Button</sl-button>
        <sl-button fill="outline" shape="pill" size="lg" variant="primary">
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
      </section>
      <section class="variants">
        <span></span>
        <span>Primary</span>
        <span>Secondary</span>
        <span>Success</span>
        <span>Warning</span>
        <span>Danger</span>
        <span>Info</span>
        <span>Inverted</span>
        <span>Disabled</span>

        <span>Outline</span>
        <sl-button fill="outline" variant="primary">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button fill="outline" variant="secondary">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button fill="outline" variant="success">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button fill="outline" variant="warning">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button fill="outline" variant="danger">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button fill="outline" variant="info">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button fill="outline" variant="inverted">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button disabled fill="outline">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>

        <span>Solid</span>
        <sl-button variant="primary">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button variant="secondary">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button variant="success">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button variant="warning">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button variant="danger">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button variant="info">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button variant="inverted">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button disabled>
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>

        <span>Ghost</span>
        <sl-button fill="ghost" variant="primary">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button fill="ghost" variant="secondary">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button fill="ghost" variant="success">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button fill="ghost" variant="warning">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button fill="ghost" variant="danger">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button fill="ghost" variant="info">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button fill="ghost" variant="inverted">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button disabled fill="ghost">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>

        <span>Link</span>
        <sl-button fill="link" variant="primary">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button fill="link" variant="secondary">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button fill="link" variant="success">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button fill="link" variant="warning">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button fill="link" variant="danger">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button fill="link" variant="info">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button fill="link" variant="inverted">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>
        <sl-button disabled fill="link">
          <sl-icon name="far-universal-access"></sl-icon>
          Button
          <sl-icon name="far-universal-access"></sl-icon>
        </sl-button>

        <div class="inverted-background"></div>
      </section>
    `;
  }
};

export const All2: Story = {
  render: () => {
    return html`
      <style>
        sl-button-bar {
          margin-block-end: 8px;
        }
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
      <h2>Sizes:</h2>
      ${sizes.map(
        size => html`
          <sl-button-bar>
            <sl-button fill="solid" .size=${size} variant="primary"><sl-icon name="face-smile"></sl-icon></sl-button>
            <sl-button fill="solid" .size=${size} variant="primary"
              ><sl-icon name="face-smile"></sl-icon> Icon ${size}</sl-button
            >
            <sl-button fill="solid" .size=${size} variant="primary"
              >Icon ${size}<sl-icon name="face-smile"></sl-icon
            ></sl-button>
            <sl-button fill="solid" .size=${size} variant="primary">${size}</sl-button>
          </sl-button-bar>
        `
      )}
      <h2>Variants:</h2>
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
                            size="md"
                            ?disabled=${disabledState}
                            .variant=${variant}
                            data-mock-state
                            >Button
                          </sl-button>
                        </td>
                        <td class=${disabledState ? 'sb-disabled' : ''}>
                          <sl-button
                            .fill=${fill}
                            size="md"
                            ?disabled=${disabledState}
                            .variant=${variant}
                            data-mock-state
                          >
                            <sl-icon name="face-smile"></sl-icon> Button
                          </sl-button>
                        </td>
                        <td class=${disabledState ? 'sb-disabled' : ''}>
                          <sl-button
                            .fill=${fill}
                            size="md"
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
      </table>
    `;
  }
};
