import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type TagList } from './tag-list.js';

type Props = Pick<TagList, 'size' | 'stacked' | 'variant'> & {
  count: number;
  disabled?: boolean;
  removable?: boolean;
  tags?(): TemplateResult[];
};
type Story = StoryObj<Props>;

export default {
  title: 'Feedback & status/Tag list',
  tags: ['draft'],
  args: {
    count: 50,
    removable: false,
    stacked: false
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['md', 'lg']
    },
    variant: {
      control: 'inline-radio',
      options: ['neutral', 'info']
    }
  },
  render: ({ count, disabled, removable, size, stacked, tags, variant }) => {
    tags ??= () =>
      Array.from({ length: count }).map(
        (_, index) => html`<sl-tag ?disabled=${disabled} ?removable=${removable}>${`Tag ${index + 1}`}</sl-tag>`
      );

    return html`
      <sl-tag-list size=${ifDefined(size)} ?stacked=${stacked} variant=${ifDefined(variant)}>${tags()}</sl-tag-list>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true
  }
};

export const Info: Story = {
  args: {
    variant: 'info'
  }
};

export const Large: Story = {
  args: {
    size: 'lg'
  }
};

export const Removable: Story = {
  args: {
    removable: true
  }
};

export const Mixed: Story = {
  args: {
    tags: () =>
      Array.from({ length: 10 }).map(
        (_, index) => html`<sl-tag ?removable=${index % 2 === 0}>${`Tag ${index + 1}`}</sl-tag>`
      )
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

export const StackedRemovable: Story = {
  args: {
    ...Stacked.args,
    removable: true
  }
};
