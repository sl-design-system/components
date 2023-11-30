import type { BadgeSize, BadgeVariant } from './badge.js';
import type { Meta, StoryObj } from '@storybook/web-components';
import { Icon } from '@sl-design-system/icon';
import { faCheck, faGear } from '@fortawesome/pro-regular-svg-icons';
import { html } from 'lit';
import '../register.js';

interface Props {}

type Story = StoryObj<Props>;

const sizes: BadgeSize[] = ['sm', 'md', 'lg', 'xl', '2xl', '3xl'];
const variants: BadgeVariant[] = ['neutral', 'primary', 'danger', 'success', 'warning', 'accent'];

const sizeName = (size: string): string => {
  switch (size) {
    case 'sm':
      return 'Small';
    case 'md':
      return 'Medium';
    case 'lg':
      return 'Large';
    case 'xl':
      return 'Extra Large';
    case '2xl':
      return '2 Extra Large';
    case '3xl':
      return '3 Extra Large';
    case '4xl':
      return '4 Extra Large';
    default:
      return 'Extra Small';
  }
};

export default {
  title: 'Badge',
  args: {},
  argTypes: {},
  render: () => html` <sl-badge> 99+ </sl-badge> `
} satisfies Meta<Props>;

export const Basic: Story = {};

export const All: Story = {
  render: () => {
    // load a single icon:
    Icon.registerIcon(faCheck, faGear);

    return html`
      <style>
        table {
          border-collapse: collapse;
          margin-bottom: 24px;
        }

        th {
          text-transform: capitalize;
        }
        th,
        td {
          padding: 4px 8px;
        }
      </style>
      <table>
        <thead>
          <tr>
            <th>Size</th>
            ${variants.map(variant => html`<th>${variant}</th>`)}
          </tr>
        </thead>
        <tbody>
          ${sizes.map(
            size => html` <tr>
              <th>${sizeName(size)}</th>
              ${variants.map(
                variant => html`<td>
                  <sl-badge .variant=${variant} .size=${size}><sl-icon name="far-check"></sl-icon></sl-badge>
                  <sl-badge .variant=${variant} .size=${size}>99+</sl-badge>
                  <sl-badge .variant=${variant} .size=${size}><sl-icon name="far-gear"></sl-icon> away</sl-badge>
                </td>`
              )}
            </tr>`
          )}
        </tbody>
      </table>
    `;
  }
};
