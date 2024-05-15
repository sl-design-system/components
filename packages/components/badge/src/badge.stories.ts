import { faCheck, faGear } from '@fortawesome/pro-regular-svg-icons';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html, nothing } from 'lit';
import '../register.js';
import { type Badge, type BadgeSize, type BadgeVariant } from './badge.js';

type Props = Pick<Badge, 'size' | 'variant'> & { icon?: boolean; text?: string };

type Story = StoryObj<Props>;

Icon.register(faCheck, faGear);

const sizes: BadgeSize[] = ['sm', 'md', 'lg', 'xl', '2xl', '3xl'];
const variants: BadgeVariant[] = ['neutral', 'primary', 'info', 'danger', 'success', 'warning', 'accent'];

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
  title: 'Components/Badge',
  tags: ['deprecated'],
  args: {
    text: '99+',
    size: 'md',
    variant: 'neutral',
    icon: false
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: sizes
    },
    variant: {
      control: 'radio',
      options: variants
    }
  },
  render: ({ size, text, variant, icon }) => html`
    <sl-badge .size=${size} .variant=${variant}>
      ${icon ? html`<sl-icon name="check"></sl-icon>` : nothing} ${text}
    </sl-badge>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};

export const All: Story = {
  render: () => {
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
            size =>
              html` <tr>
                <th>${sizeName(size)}</th>
                ${variants.map(
                  variant => html`
                    <td>
                      <sl-badge .variant=${variant} .size=${size}><sl-icon name="far-check"></sl-icon></sl-badge>
                      <sl-badge .variant=${variant} .size=${size}>99+</sl-badge>
                      <sl-badge .variant=${variant} .size=${size}><sl-icon name="far-gear"></sl-icon> away</sl-badge>
                    </td>
                  `
                )}
              </tr>`
          )}
        </tbody>
      </table>
    `;
  }
};
