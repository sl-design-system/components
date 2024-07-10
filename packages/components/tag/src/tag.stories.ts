import { type ButtonSize, type ButtonVariant } from '@sl-design-system/button';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';
import { type Tag, type SpinnerSize, type SpinnerVariant } from './tag.js';

type Props = Pick<Tag, 'size' | 'variant' | 'label' | 'removable'>;

type Story = StoryObj<Props>;

const sizes: SpinnerSize[] = ['sm', 'md', 'lg', 'xl', '2xl', '3xl'];
const variants: SpinnerVariant[] = ['accent', 'info', 'danger', 'success', 'warning'];
const buttonVariants: ButtonVariant[] = ['default', 'primary', 'success', 'warning', 'danger'];
const buttonSizes: ButtonSize[] = ['sm', 'md', 'lg'];

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
  title: 'Components/Tag',
  tags: ['draft'],
  args: {
    size: 'md',
    label: 'Tag label',
    removable: false,
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
  parameters: {
    // Notifies Chromatic to pause the animations at the first frame for this specific story.
    chromatic: { pauseAnimationAtEnd: false, prefersReducedMotion: 'reduce' }
  },
  render: ({ label, removable }) => html`
    <sl-tag label=${label} ?removable=${removable}></sl-tag>`
} satisfies Meta<Props>;

export const Basic: Story = {};

export const InButton: Story = {
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
          ${buttonSizes.map(
            buttonSize =>
              html` <tr>
                <th>${sizeName(buttonSize)}</th>
                ${buttonVariants.map(
                  buttonVariant =>
                    html`<td>
                      <sl-button .variant=${buttonVariant} size=${buttonSize}>
                        <sl-spinner></sl-spinner>
                        Sending
                      </sl-button>
                      <sl-button .variant=${buttonVariant} fill="outline" size=${buttonSize}>
                        <sl-spinner></sl-spinner>
                        Sending
                      </sl-button>
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
            <th>Default<sup>*</sup></th>
            ${variants.map(variant => html`<th>${variant}</th>`)}
          </tr>
        </thead>
        <tbody>
          ${sizes.map(
            size =>
              html` <tr>
                <th>${sizeName(size)}</th>
                <td>
                  <sl-spinner .size=${size}></sl-spinner>
                </td>
                ${variants.map(
                  variant =>
                    html`<td>
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
