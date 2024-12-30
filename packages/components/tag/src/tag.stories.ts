import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';
import '../register.js';
import { type Tag } from './tag.js';

type Props = Pick<Tag, 'disabled' | 'emphasis' | 'label' | 'removable' | 'size'> & {
  focused?: boolean;
  maxWidth?: string;
};
type Story = StoryObj<Props>;

export default {
  title: 'Feedback & status/Tag',
  tags: ['draft'],
  args: {
    disabled: false,
    emphasis: 'subtle',
    focused: false,
    label: 'Tag label',
    removable: false,
    size: 'md'
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
  render: ({ disabled, emphasis, focused, label, maxWidth, removable, size }) => html`
    <sl-tag
      ?disabled=${disabled}
      ?focused=${focused}
      ?removable=${removable}
      emphasis=${ifDefined(emphasis)}
      size=${ifDefined(size)}
      style=${styleMap({ maxWidth })}
      >${label}</sl-tag
    >
  `
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Bold: Story = {
  args: {
    ...Basic.args,
    emphasis: 'bold'
  }
};

export const Disabled: Story = {
  args: {
    ...Basic.args,
    disabled: true
  }
};

export const Focused: Story = {
  args: {
    ...Basic.args,
    focused: true
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
        #root-inner {
          align-items: start;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        #root-inner > div {
          display: inline-grid;
          gap: 1rem;
          grid-template-columns: repeat(5, auto);
          justify-items: start;
        }
        span {
          justify-self: center;
          grid-column: 1 / -1;
        }
      </style>

      <div>
        <span>md</span>
        <sl-tag>Label</sl-tag>
        <sl-tag style="max-inline-size: 100px">Overflow label</sl-tag>
        <sl-tag removable>Removable</sl-tag>
        <sl-tag disabled>Disabled</sl-tag>
        <sl-tag removable disabled>Disabled, removable</sl-tag>

        <sl-tag emphasis="bold">Label</sl-tag>
        <sl-tag emphasis="bold" style="max-inline-size: 100px">Overflow label</sl-tag>
        <sl-tag emphasis="bold" removable>Removable</sl-tag>
        <sl-tag emphasis="bold" disabled>Disabled</sl-tag>
        <sl-tag emphasis="bold" removable disabled>Disabled, removable</sl-tag>
      </div>

      <div>
        <span>lg</span>
        <sl-tag size="lg">Label</sl-tag>
        <sl-tag size="lg" style="max-inline-size: 100px">Overflow label</sl-tag>
        <sl-tag removable size="lg">Removable</sl-tag>
        <sl-tag size="lg" disabled>Disabled</sl-tag>
        <sl-tag removable size="lg" disabled>Disabled, removable</sl-tag>

        <sl-tag emphasis="bold" size="lg">Label</sl-tag>
        <sl-tag emphasis="bold" size="lg" style="max-inline-size: 100px">Overflow label</sl-tag>
        <sl-tag emphasis="bold" removable size="lg">Removable</sl-tag>
        <sl-tag emphasis="bold" size="lg" disabled>Disabled</sl-tag>
        <sl-tag emphasis="bold" removable size="lg" disabled>Disabled, removable</sl-tag>
      </div>
    `;
  }
};
