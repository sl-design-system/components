import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';
import '../register.js';
import { type Tag } from './tag.js';

type Props = Pick<Tag, 'disabled' | 'label' | 'removable' | 'size' | 'variant'> & {
  maxWidth?: string;
};
type Story = StoryObj<Props>;

export default {
  title: 'Feedback & status/Tag/Tag',
  tags: ['preview'],
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            selector: 'sl-tag:not([disabled])'
          }
        ]
      }
    }
  },
  args: {
    disabled: false,
    label: 'Tag label',
    removable: false
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['md', 'lg']
    },
    variant: {
      control: 'inline-radio',
      options: ['default', 'info']
    }
  },
  render: ({ disabled, label, maxWidth, removable, size, variant }) => html`
    <sl-tag
      ?disabled=${disabled}
      ?removable=${removable}
      size=${ifDefined(size)}
      style=${styleMap({ maxWidth })}
      variant=${ifDefined(variant)}
    >
      ${label}
    </sl-tag>
  `
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

export const Overflow: Story = {
  args: {
    label: 'This is a very long label which overflows',
    maxWidth: '200px'
  }
};

export const Removable: Story = {
  args: {
    removable: true
  }
};
