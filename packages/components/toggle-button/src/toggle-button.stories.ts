import { faGear as farGear } from '@fortawesome/pro-regular-svg-icons';
import { faEyeSlash, faGear as fasGear } from '@fortawesome/pro-solid-svg-icons';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';
import { type ToggleButton, ToggleButtonFill, ToggleButtonSize } from './toggle-button.js';

interface Props extends Pick<ToggleButton, 'disabled' | 'fill' | 'pressed' | 'size' | 'tabIndex'> {
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
    size: 'md',
    tabIndex: undefined
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: sizes
    },
    fill: {
      control: 'inline-radio',
      options: fills
    },
    tabIndex: {
      control: 'number'
    }
  },
  render: ({ fill, size, pressed, label, disabled, tabIndex }) => {
    const onToggle = (event: Event & { target: ToggleButton }): void => {
      console.log(event.target.pressed);
    };

    return html`
      <sl-toggle-button
        .fill=${fill}
        .size=${size}
        .tabIndex=${tabIndex}
        ?disabled=${disabled}
        ?pressed=${pressed}
        @sl-toggle=${onToggle}
        .ariaLabel=${label}
      >
        <sl-icon name="far-gear"></sl-icon>
        <sl-icon name="fas-gear" slot="pressed"></sl-icon>
      </sl-toggle-button>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const OneIcon: Story = {
  render: () => {
    return html`
      <sl-toggle-button fill="outline">
        <sl-icon name="pinata"></sl-icon>
      </sl-toggle-button>
      <sl-toggle-button fill="outline" pressed>
        <sl-icon name="pinata"></sl-icon>
      </sl-toggle-button>
      <sl-toggle-button fill="outline">
        <sl-icon name="far-gear"></sl-icon>
        <sl-icon name="fas-gear" slot="pressed"></sl-icon>
      </sl-toggle-button>
      <sl-toggle-button fill="ghost" pressed>
        <sl-icon name="far-gear"></sl-icon>
        <sl-icon name="fas-gear" slot="pressed"></sl-icon>
      </sl-toggle-button>
    `;
  }
};

export const All: Story = {
  render: () => {
    return html` <style>
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
            <sl-icon name="far-gear"></sl-icon>
            <sl-icon name="fas-gear" slot="pressed"></sl-icon>
          </sl-toggle-button>
          <sl-toggle-button fill="ghost" .size=${size}>
            <sl-icon name="far-gear"></sl-icon>
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
                  disabledState =>
                    html`<td class=${disabledState ? 'sb-disabled' : ''}>
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
                      </td>`
                )}`
            )}
          </tr>
        </tbody>
      </table>`;
  }
};
