import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';
import '../register.js';
import { type Tag } from './tag.js';

type Props = Pick<Tag, 'disabled' | 'label' | 'removable' | 'size'> & {
  maxWidth?: string;
};
type Story = StoryObj<Props>;

export default {
  title: 'Feedback & status/Tag',
  tags: ['draft'],
  args: {
    disabled: false,
    label: 'Tag label',
    removable: false
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['md', 'lg']
    }
  },
  render: ({ disabled, label, maxWidth, removable, size }) => html`
    <sl-tag ?disabled=${disabled} ?removable=${removable} size=${ifDefined(size)} style=${styleMap({ maxWidth })}
      >${label}</sl-tag
    >
  `
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Disabled: Story = {
  args: {
    ...Basic.args,
    disabled: true
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
    ...Basic.args,
    removable: true
  }
};

export const All: Story = {
  render: () => {
    return html`
      <style>
        .wrapper {
          align-items: center;
          display: inline-grid;
          grid-template-columns: auto 1fr 1fr;
          gap: 1rem;
          justify-items: center;
        }
        span {
          justify-self: start;
        }
      </style>
      <div class="wrapper">
        <span></span>
        <span style="justify-self: center">md</span>
        <span style="justify-self: center">lg</span>

        <span>Default</span>
        <sl-tag>Label</sl-tag>
        <sl-tag size="lg">Label</sl-tag>

        <span>Overflow</span>
        <sl-tag style="max-inline-size: 100px">Overflow label</sl-tag>
        <sl-tag size="lg" style="max-inline-size: 100px">Overflow label</sl-tag>

        <span>Removable</span>
        <sl-tag removable>Removable</sl-tag>
        <sl-tag removable size="lg">Removable</sl-tag>

        <span>Disabled</span>
        <sl-tag disabled>Disabled</sl-tag>
        <sl-tag size="lg" disabled>Disabled</sl-tag>

        <span>Removable, disabled</span>
        <sl-tag removable disabled>Disabled, removable</sl-tag>
        <sl-tag removable size="lg" disabled>Disabled, removable</sl-tag>
      </div>
    `;
  }
};
