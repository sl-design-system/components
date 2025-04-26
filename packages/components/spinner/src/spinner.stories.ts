import { type ButtonSize, type ButtonVariant } from '@sl-design-system/button';
import '@sl-design-system/button/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type Spinner, type SpinnerSize } from './spinner.js';

type Props = Pick<Spinner, 'size'>;

type Story = StoryObj<Props>;

const sizes: SpinnerSize[] = ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];
const buttonVariants: ButtonVariant[] = ['primary', 'secondary', 'success', 'warning', 'danger'];
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
  title: 'Feedback & status/Spinner',
  tags: ['stable'],
  argTypes: {
    size: {
      control: 'inline-radio',
      options: sizes
    }
  },
  parameters: {
    // Notifies Chromatic to pause the animations at the first frame for this specific story.
    chromatic: { pauseAnimationAtEnd: false, prefersReducedMotion: 'reduce' }
  },
  render: ({ size }) => html` <sl-spinner size=${ifDefined(size)}></sl-spinner> `
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
            ${buttonVariants.map(variant => html`<th>${variant}</th>`)}
          </tr>
        </thead>
        <tbody>
          ${buttonSizes.map(
            buttonSize => html`
              <tr>
                <th>${sizeName(buttonSize)}</th>
                ${buttonVariants.map(
                  buttonVariant => html`
                    <td>
                      <sl-button variant=${buttonVariant} size=${buttonSize}>
                        <sl-spinner></sl-spinner>
                        Sending </sl-button
                      ><br />
                      <sl-button variant=${buttonVariant} fill="outline" size=${buttonSize}>
                        <sl-spinner></sl-spinner>
                        Sending
                      </sl-button>
                    </td>
                  `
                )}
              </tr>
            `
          )}
        </tbody>
      </table>
      The colour of the spinner is set to CurrentColor; so the color of the text in the container wrapping the spinner.
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
        th,
        td {
          padding: 4px 8px;
        }
      </style>
      <table>
        <tbody>
          ${sizes.map(
            size => html`
              <tr>
                <th>${sizeName(size)}</th>
                <td>
                  <sl-spinner .size=${size}></sl-spinner>
                </td>
              </tr>
            `
          )}
        </tbody>
      </table>
      The color of the spinner is set to CurrentColor; so the color of the text in the container wrapping the spinner.
    `;
  }
};
