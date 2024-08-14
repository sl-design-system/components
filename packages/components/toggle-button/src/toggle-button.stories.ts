import { faGear as farGear } from '@fortawesome/pro-regular-svg-icons';
import { faEyeSlash, faGear as fasGear } from '@fortawesome/pro-solid-svg-icons';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type ToggleButton, ToggleButtonFill, ToggleButtonSize } from './toggle-button.js';

interface Props extends Pick<ToggleButton, 'disabled' | 'fill' | 'pressed' | 'size'> {
  icons?: TemplateResult;
  label: string;
}
type Story = StoryObj<Props>;

const disabledStates = [false, true];
const fills: ToggleButtonFill[] = ['ghost', 'outline'];
const sizes: ToggleButtonSize[] = ['sm', 'md', 'lg'];

Icon.register(fasGear, farGear, faEyeSlash);

export default {
  title: 'Components/Toggle button',
  tags: ['draft'],
  args: {
    disabled: false,
    fill: 'ghost',
    label: 'Show settings',
    pressed: false,
    size: 'md'
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: sizes
    },
    fill: {
      control: 'inline-radio',
      options: fills
    }
  },
  render: ({ fill, icons, size, pressed, label, disabled }) => {
    const onToggle = (event: Event & { target: ToggleButton }): void => {
      console.log(event.target.pressed);
    };

    return html`
      <sl-toggle-button
        @sl-toggle=${onToggle}
        ?disabled=${disabled}
        ?pressed=${pressed}
        .fill=${fill}
        .size=${size}
        aria-label=${ifDefined(label)}
      >
        ${icons}
      </sl-toggle-button>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    icons: html`
      <sl-icon name="far-gear" slot="default"></sl-icon>
      <sl-icon name="fas-gear" slot="pressed"></sl-icon>
    `
  }
};

export const Empty: Story = {};

export const Errors: Story = {
  render: () => {
    return html`
      <p>
        When the 'pressed' icon is not set you will get an error in the console and the button will not look correct
      </p>
      <sl-toggle-button fill="outline">
        <sl-icon name="pinata" slot="default"></sl-icon>
      </sl-toggle-button>

      <p>Setting the same icon for both states as "workaround" will not work, you will get the same error</p>
      <sl-toggle-button fill="outline">
        <sl-icon name="far-gear" slot="default"></sl-icon>
        <sl-icon name="far-gear" slot="pressed"></sl-icon>
      </sl-toggle-button>
    `;
  }
};

export const All: Story = {
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
      <h2>sizes:</h2>
      ${sizes.map(
        size => html`
          <sl-toggle-button fill="outline" .size=${size}>
            <sl-icon name="far-gear" slot="default"></sl-icon>
            <sl-icon name="fas-gear" slot="pressed"></sl-icon>
          </sl-toggle-button>
          <sl-toggle-button fill="ghost" .size=${size}>
            <sl-icon name="far-gear" slot="default"></sl-icon>
            <sl-icon name="fas-gear" slot="pressed"></sl-icon>
          </sl-toggle-button>
        `
      )}
      <h2>Variants:</h2>
      <table>
        <thead>
          <tr>
            <td></td>
            ${fills.map(fill => html`<th colspan="4">${fill}</th>`)}
          </tr>
          <tr>
            <td></td>
            ${fills.map(() =>
              disabledStates.map(
                disabledState => html`
                  <td colspan="2" class=${disabledState ? 'sb-disabled' : ''}>
                    ${disabledState ? 'Disabled' : 'Enabled'}
                  </td>
                `
              )
            )}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th></th>
            ${fills.map(
              fill =>
                html` ${disabledStates.map(
                  disabledState => html`
                    <td class=${disabledState ? 'sb-disabled' : ''}>
                      <sl-toggle-button .fill=${fill} size="md" ?disabled=${disabledState} data-mock-state>
                        <sl-icon name="far-gear"></sl-icon>
                        <sl-icon name="fas-gear" slot="pressed"></sl-icon>
                      </sl-toggle-button>
                    </td>
                    <td class=${disabledState ? 'sb-disabled' : ''}>
                      <sl-toggle-button .fill=${fill} size="md" ?disabled=${disabledState} pressed data-mock-state>
                        <sl-icon name="far-gear"></sl-icon>
                        <sl-icon name="fas-gear" slot="pressed"></sl-icon>
                      </sl-toggle-button>
                    </td>
                  `
                )}`
            )}
          </tr>
        </tbody>
      </table>
    `;
  }
};
