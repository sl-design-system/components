import { type ButtonSize, type ButtonVariant } from '@sl-design-system/button';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';
// import { TagList } from './tag-list.js';
import { type Tag, type TagSize, type SpinnerVariant } from './tag.js';
import { type TagList } from './tag-list.js';

type Props = Pick<Tag, 'size' | 'variant' | 'label' | 'removable'>;

type Story = StoryObj<Props>;

const sizes: TagSize[] = ['md', 'lg'];
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
    <sl-tag label=${label} ?removable=${removable}></sl-tag>
    <sl-tag label=${label} ?removable=${removable} disabled></sl-tag>
    <sl-tag label=${label} ?removable=${removable} readonly></sl-tag>`
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Sizes: Story = {
  args: {
    size: 'md',
    label: 'Tag label',
    removable: false,
  },
  render: ({label}) => {
    return html`
          <sl-tag label=${label}></sl-tag>
          <sl-tag label=${label} size="lg"></sl-tag>
    `;
  }
};

export const Overflow: Story = {
  args: {
    size: 'md',
    label: 'This is a veeeeeeery long tag\'s label which overlows',
    removable: false,
  },
  render: ({label}) => {
    return html`
      <style>
        div {
          inline-size: 200px;
        }
      </style>
      <div>
          <sl-tag label=${label}></sl-tag>
          <sl-tag label=${label}></sl-tag>
      </div>
    `;
  }
};

export const List: Story = {
    args: {
      size: 'md',
      label: 'Tag label',
      removable: false,
    },
  render: ({label}) => {
    return html`
        <sl-tag-list>
          <sl-tag label=${label}></sl-tag>
          <sl-tag label=${label}></sl-tag>
          <sl-tag label=${label}></sl-tag>
        </sl-tag-list>
    `;
  }
};

export const Stacked: Story = {
  args: {
    size: 'md',
    label: 'Tag label',
    removable: false,
  },
  render: ({label}) => {
    return html`
        <sl-tag-list stacked>
          <sl-tag label=${label} removable></sl-tag>
          <sl-tag label=${label} removable></sl-tag>
          <sl-tag label=${label} removable></sl-tag>
        </sl-tag-list>
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

// TODO: with links example


// TODO: disabled and readonly in all story
