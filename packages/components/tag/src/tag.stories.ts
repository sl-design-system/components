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
  render: ({ label, removable, size }) => html`
    <sl-tag label=${label} ?removable=${removable} .size=${size}></sl-tag>
    <sl-tag label=${label} ?removable=${removable} .size=${size} disabled></sl-tag>
    <sl-tag label=${label} ?removable=${removable} .size=${size} readonly></sl-tag>`
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
          <sl-tag label=${label} removable></sl-tag>
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
      const amount = Array.from({length: 50});
    return html`
        <sl-tag-list>
          ${amount.map(
            () => html`
          <sl-tag .label=${label}></sl-tag>
        `
          )}
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
      <style>
        sl-tag-list {
          margin-bottom: 24px;
        }
      </style>
        <sl-tag-list stacked>
          <sl-tag label="my label" removable></sl-tag>
          <sl-tag label="test" removable></sl-tag>
          <sl-tag label=${label + '1'} removable></sl-tag>
          <sl-tag label=${label + '2'} removable></sl-tag>
          <sl-tag label=${label + '3'} removable></sl-tag>
          <sl-tag label=${label + '4'} removable></sl-tag>
          <sl-tag label=${label + '5'} removable></sl-tag>
          <sl-tag label=${label + '6'} removable></sl-tag>
          <sl-tag label=${label + '7'} removable></sl-tag>
          <sl-tag label=${label + '8'} removable></sl-tag>
          <sl-tag label=${label + '9'} removable></sl-tag>
          <sl-tag label=${label + '10'} removable></sl-tag>
          <sl-tag label=${label + '11'} removable></sl-tag>
          <sl-tag label=${label + '12'} removable></sl-tag>
          <sl-tag label=${label + '13'} removable></sl-tag>
          <sl-tag label=${label + '14'} removable></sl-tag>
          <sl-tag label=${label + '15'} removable></sl-tag>
          <sl-tag label=${label + '16'} removable></sl-tag>
          <sl-tag label=${label + '17'} removable></sl-tag>
          <sl-tag label=${label + '18'} removable></sl-tag>
          <sl-tag label=${label + '19'} removable></sl-tag>
          <sl-tag label=${label + '20'} removable></sl-tag>
          <sl-tag label=${label + '21'} removable></sl-tag>
          <sl-tag label=${label + '21'} removable></sl-tag>
          <sl-tag label=${label + '23'} removable></sl-tag>
        </sl-tag-list>

        <sl-tag-list stacked size="lg">
          <sl-tag label="my label" removable></sl-tag>
          <sl-tag label="test" removable></sl-tag>
          <sl-tag label=${label + '1'} removable></sl-tag>
          <sl-tag label=${label + '2'} removable></sl-tag>
          <sl-tag label=${label + '3'} removable></sl-tag>
          <sl-tag label=${label + '4'} removable></sl-tag>
          <sl-tag label=${label + '5'} removable></sl-tag>
          <sl-tag label=${label + '6'} removable></sl-tag>
          <sl-tag label=${label + '7'} removable></sl-tag>
          <sl-tag label=${label + '8'} removable></sl-tag>
          <sl-tag label=${label + '9'} removable></sl-tag>
          <sl-tag label=${label + '10'} removable></sl-tag>
          <sl-tag label=${label + '11'} removable></sl-tag>
          <sl-tag label=${label + '12'} removable></sl-tag>
          <sl-tag label=${label + '13'} removable></sl-tag>
          <sl-tag label=${label + '14'} removable></sl-tag>
          <sl-tag label=${label + '15'} removable></sl-tag>
          <sl-tag label=${label + '16'} removable></sl-tag>
          <sl-tag label=${label + '17'} removable></sl-tag>
          <sl-tag label=${label + '18'} removable></sl-tag>
          <sl-tag label=${label + '19'} removable></sl-tag>
          <sl-tag label=${label + '20'} removable></sl-tag>
          <sl-tag label=${label + '21'} removable></sl-tag>
          <sl-tag label=${label + '21'} removable></sl-tag>
          <sl-tag label=${label + '23'} removable></sl-tag>
        </sl-tag-list>
    `;
  }
};

export const All: Story = {
  render: () => {
    return html`
      <style>
        sl-tag {
          margin: 8px;
        }
      </style>

        <h2>Subtle</h2>
        <sl-tag label="label" size="md"></sl-tag>
        <sl-tag label="label" removable size="md"></sl-tag>
        <sl-tag label="tag label" size="md" disabled></sl-tag>
        <sl-tag label="tag label" removable size="md" disabled></sl-tag>
        <sl-tag label="label" size="md" readonly></sl-tag>
        <sl-tag label="label" removable size="md" readonly></sl-tag>

        <sl-tag label="label" size="lg"></sl-tag>
        <sl-tag label="label" removable size="lg"></sl-tag>
        <sl-tag label="tag label" size="lg" disabled></sl-tag>
        <sl-tag label="tag label" removable size="lg" disabled></sl-tag>
        <sl-tag label="label" size="lg" readonly></sl-tag>
        <sl-tag label="label" removable size="lg" readonly></sl-tag>

        <h2>Bold</h2>
        <sl-tag emphasis="bold" label="label" size="md"></sl-tag>
        <sl-tag emphasis="bold" label="label" removable size="md"></sl-tag>
        <sl-tag emphasis="bold" label="tag label" size="md" disabled></sl-tag>
        <sl-tag emphasis="bold" label="tag label" removable size="md" disabled></sl-tag>
        <sl-tag emphasis="bold" label="label" size="md" readonly></sl-tag>
        <sl-tag emphasis="bold" label="label" removable size="md" readonly></sl-tag>

        <sl-tag emphasis="bold" label="label" size="lg"></sl-tag>
        <sl-tag emphasis="bold" label="label" removable size="lg"></sl-tag>
        <sl-tag emphasis="bold" label="tag label" size="lg" disabled></sl-tag>
        <sl-tag emphasis="bold" label="tag label" removable size="lg" disabled></sl-tag>
        <sl-tag emphasis="bold" label="label" size="lg" readonly></sl-tag>
        <sl-tag emphasis="bold" label="label" removable size="lg" readonly></sl-tag>
    `;
  }
};

// TODO: with links example


// TODO: disabled and readonly in all story