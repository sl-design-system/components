import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type TagList } from './tag-list.js';

type Props = Pick<TagList, 'emphasis' | 'size' | 'stacked'> & { count: number };
type Story = StoryObj<Props>;

export default {
  title: 'Components/Tag list',
  tags: ['draft'],
  args: {
    count: 50,
    stacked: false
  },
  argTypes: {
    emphasis: {
      control: 'inline-radio',
      options: ['subtle', 'bold']
    },
    size: {
      control: 'inline-radio',
      options: ['md', 'lg']
    }
  },
  render: ({ count, emphasis, size, stacked }) => {
    const tags = Array.from({ length: count }).map((_, index) => html`<sl-tag .label=${`Tag ${index + 1}`}></sl-tag>`);

    return html`
      <sl-tag-list emphasis=${ifDefined(emphasis)} size=${ifDefined(size)} ?stacked=${stacked}>${tags}</sl-tag-list>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Bold: Story = {
  args: {
    emphasis: 'bold'
  }
};

export const Large: Story = {
  args: {
    size: 'lg'
  }
};

export const Stacked: Story = {
  args: {
    count: 20,
    stacked: true
  }
};

export const StackedOver100: Story = {
  args: {
    ...Stacked.args,
    count: 120
  }
};
