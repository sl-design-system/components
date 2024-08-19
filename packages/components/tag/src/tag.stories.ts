import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';
import '../register.js';
import { type Tag } from './tag.js';

type Props = Pick<Tag, 'disabled' | 'emphasis' | 'label' | 'removable' | 'size'> & { maxWidth?: string };
type Story = StoryObj<Props>;

export default {
  title: 'Components/Tag',
  tags: ['draft'],
  args: {
    disabled: false,
    emphasis: 'subtle',
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
  render: ({ disabled, emphasis, label, maxWidth, removable, size }) => html`
    <sl-tag
      ?disabled=${disabled}
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
          grid-template-columns: auto auto auto auto;
          justify-items: start;
        }
        span {
          justify-self: center;
          grid-column: 1 / -1;
        }
      </style>

      <div>
        <span>md</span>
        <sl-tag size="md">Label</sl-tag>
        <sl-tag removable size="md">Removable</sl-tag>
        <sl-tag size="md" disabled>Disabled</sl-tag>
        <sl-tag removable size="md" disabled>Disabled, removable</sl-tag>

        <sl-tag emphasis="bold" size="md">Label</sl-tag>
        <sl-tag emphasis="bold" removable size="md">Removable</sl-tag>
        <sl-tag emphasis="bold" size="md" disabled>Disabled</sl-tag>
        <sl-tag emphasis="bold" removable size="md" disabled>Disabled, removable</sl-tag>
      </div>

      <div>
        <span>lg</span>
        <sl-tag size="lg">Label</sl-tag>
        <sl-tag removable size="lg">Removable</sl-tag>
        <sl-tag size="lg" disabled>Disabled</sl-tag>
        <sl-tag removable size="lg" disabled>Disabled, removable</sl-tag>

        <sl-tag emphasis="bold" size="lg">Label</sl-tag>
        <sl-tag emphasis="bold" removable size="lg">Removable</sl-tag>
        <sl-tag emphasis="bold" size="lg" disabled>Disabled</sl-tag>
        <sl-tag emphasis="bold" removable size="lg" disabled>Disabled, removable</sl-tag>
      </div>
    `;
  }
};
