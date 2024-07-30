import { type ButtonSize, type ButtonVariant } from '@sl-design-system/button';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';
import { type Tag, type TagSize, type TagEmphasis } from './tag.js';
import { type TagList } from './tag-list.js';

type Props = Pick<Tag, 'emphasis' | 'size' | 'label' | 'removable'>;

type Story = StoryObj<Props>;

const sizes: TagSize[] = ['md', 'lg'];
const emphases: TagEmphasis[] = ['subtle', 'bold'];

export default {
  title: 'Components/Tag',
  tags: ['draft'],
  args: {
    size: 'md',
    label: 'Tag label',
    removable: false,
    emphasis: 'subtle',
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: sizes
    },
    emphasis: {
      control: 'radio',
      options: emphases
    }
  },
  parameters: {
    // Notifies Chromatic to pause the animations at the first frame for this specific story.
    chromatic: { pauseAnimationAtEnd: false, prefersReducedMotion: 'reduce' }
  },
  render: ({ emphasis, label, removable, size }) => html`
    <sl-tag label=${label} .emphasis=${emphasis} ?removable=${removable} .size=${size}></sl-tag>
    <sl-tag label=${label} .emphasis=${emphasis} ?removable=${removable} .size=${size} disabled></sl-tag>
    <sl-tag label=${label} .emphasis=${emphasis} ?removable=${removable} .size=${size} readonly></sl-tag>`
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
    label: 'This is a very long label which overflows',
    emphasis: 'subtle'
  },
  argTypes: {
    removable: {
      table: {
        disable: true
      }
    },
  },
  render: ({emphasis, label, size}) => {
    return html`
      <style>
        div {
          inline-size: 200px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
      </style>
      <div>
          <sl-tag .emphasis=${emphasis} label=${label} .size=${size}></sl-tag>
          <sl-tag .emphasis=${emphasis} label=${label} removable .size=${size}></sl-tag>
      </div>
    `;
  }
};

export const List: Story = {
    args: {
      size: 'md',
      label: 'Tag label',
      removable: false,
      emphasis: 'subtle'
    },
  render: ({emphasis, label, removable, size}) => {
      const amount = Array.from({length: 50});
    return html`
        <sl-tag-list .emphasis=${emphasis} .size=${size}>
          ${amount.map(
            () => html`
          <sl-tag .label=${label} ?removable=${removable}></sl-tag>
        `
          )}
          <sl-tag label="I am a veeeeeeeeeeeeeeery long tag label" ?removable=${removable}></sl-tag>
          <sl-tag label="I am a label" ?removable=${removable}></sl-tag>
          <sl-tag label="I am another label" ?removable=${removable}></sl-tag>
        </sl-tag-list>
    `;
  }
};

export const Stacked: Story = {
  args: {
    size: 'md',
    label: 'Tag label',
    removable: true,
    emphasis: 'subtle'
  },
  render: ({emphasis, label, removable, size}) => {
    const amount = Array.from({ length: 20 });
    return html`
      <style>
        sl-tag-list {
          margin-bottom: 24px;
        }
      </style>
        <sl-tag-list stacked .emphasis=${emphasis} .size=${size}>
          <sl-tag .emphasis=${emphasis} label="my label" ?removable=${removable}></sl-tag>
          <sl-tag .emphasis=${emphasis} label="test" ?removable=${removable}></sl-tag>
          <sl-tag .emphasis=${emphasis} label="This is a very long label of the tag" ?removable=${removable}></sl-tag>
          ${amount.map(
            (_, index) => html`
          <sl-tag .label=${label + ' ' + (index + 1) } ?removable=${removable}></sl-tag>
        `
          )}
        </sl-tag-list>
    `;
  }
};

export const StackedOver100: Story = {
  args: {
    size: 'md',
    label: 'Tag label',
    removable: false,
    emphasis: 'subtle'
  },
  render: ({emphasis}) => {
    const amount = Array.from({ length: 120 });
    return html`
      <style>
        sl-tag-list {
          margin-bottom: 24px;
        }
      </style>
      <sl-tag-list stacked .emphasis=${emphasis}>
          ${amount.map(
      (_, index) => html`
          <sl-tag .label=${'label ' + (index + 1) } removable></sl-tag>
        `
    )}
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
        <sl-tag label="Removable" removable size="md"></sl-tag>
        <sl-tag label="Disabled" size="md" disabled></sl-tag>
        <sl-tag label="Disabled removable" removable size="md" disabled></sl-tag>
        <sl-tag label="Readonly" size="md" readonly></sl-tag>

        <sl-tag label="label lg" size="lg"></sl-tag>
        <sl-tag label="Removable lg" removable size="lg"></sl-tag>
        <sl-tag label="Disabled lg" size="lg" disabled></sl-tag>
        <sl-tag label="Disabled removable lg" removable size="lg" disabled></sl-tag>
        <sl-tag label="Readonly lg" size="lg" readonly></sl-tag>

        <h2>Bold</h2>
        <sl-tag emphasis="bold" label="label" size="md"></sl-tag>
        <sl-tag emphasis="bold" label="Removable" removable size="md"></sl-tag>
        <sl-tag emphasis="bold" label="Disabled" size="md" disabled></sl-tag>
        <sl-tag emphasis="bold" label="Disabled removable" removable size="md" disabled></sl-tag>
        <sl-tag emphasis="bold" label="Readonly" size="md" readonly></sl-tag>

        <sl-tag emphasis="bold" label="label" size="lg"></sl-tag>
        <sl-tag emphasis="bold" label="Removable lg" removable size="lg"></sl-tag>
        <sl-tag emphasis="bold" label="Disabled lg" size="lg" disabled></sl-tag>
        <sl-tag emphasis="bold" label="Disabled removable lg" removable size="lg" disabled></sl-tag>
        <sl-tag emphasis="bold" label="Readonly lg" size="lg" readonly></sl-tag>
    `;
  }
};

// TODO: with links example


// TODO: disabled and readonly in all story
