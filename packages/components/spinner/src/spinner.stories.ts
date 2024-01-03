import type { Spinner, SpinnerSize, SpinnerVariant } from './spinner.js';
import type { Meta, StoryObj } from '@storybook/web-components';
import { Icon } from '@sl-design-system/icon';
import { faCheck, faGear } from '@fortawesome/pro-regular-svg-icons';
import { html } from 'lit';
import '../register.js';

type Props = Pick<Spinner, 'size' | 'variant'>;

type Story = StoryObj<Props>;

const sizes: SpinnerSize[] = ['sm', 'md', 'lg', 'xl', '2xl', '3xl'];
const variants: SpinnerVariant[] = ['accent', 'info', 'danger', 'success', 'warning'];

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
  title: 'Spinner',
  args: {
    size: 'md'
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
  render: ({ size, variant }) => html` <sl-spinner .size=${size} .variant=${variant}></sl-spinner> `
} satisfies Meta<Props>;

export const Basic: Story = {};

export const All: Story = {
  render: () => {
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
            <th>Default<sup>*</sup></th>
            ${variants.map(variant => html`<th>${variant}</th>`)}
          </tr>
        </thead>
        <tbody>
          ${sizes.map(
            size => html` <tr>
              <th>${sizeName(size)}</th>
              <td>
                <sl-spinner .size=${size}></sl-spinner>
              </td>
              ${variants.map(
                variant => html`<td>
                  <sl-spinner .variant=${variant} .size=${size}></sl-spinner>
                </td>`
              )}
            </tr>`
          )}
        </tbody>
      </table>
      * When no variant is set the color will be set to CurrentColor; so the color of the text in the container wrapping
      the spinner.
    `;
  }
};
