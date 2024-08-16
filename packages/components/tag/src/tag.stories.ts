import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';
import '../register.js';
import { type Tag } from './tag.js';

type Props = Pick<Tag, 'disabled' | 'emphasis' | 'label' | 'readonly' | 'removable' | 'size'> & { maxWidth?: string };
type Story = StoryObj<Props>;

export default {
  title: 'Components/Tag',
  tags: ['draft'],
  args: {
    disabled: false,
    emphasis: 'subtle',
    label: 'Tag label',
    readonly: false,
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
  render: ({ disabled, emphasis, label, maxWidth, readonly, removable, size }) => html`
    <sl-tag
      .label=${label}
      ?disabled=${disabled}
      ?readonly=${readonly}
      ?removable=${removable}
      emphasis=${ifDefined(emphasis)}
      size=${ifDefined(size)}
      style=${styleMap({ maxWidth })}
    ></sl-tag>
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

export const Readonly: Story = {
  args: {
    ...Basic.args,
    readonly: true
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
          grid-template-columns: auto auto auto auto auto;
          justify-items: start;
        }
        span {
          justify-self: center;
          grid-column: 1 / -1;
        }
      </style>

      <div>
        <span>md</span>
        <sl-tag label="Label" size="md"></sl-tag>
        <sl-tag label="Readonly" size="md" readonly></sl-tag>
        <sl-tag label="Removable" removable size="md"></sl-tag>
        <sl-tag label="Disabled" size="md" disabled></sl-tag>
        <sl-tag label="Disabled, removable" removable size="md" disabled></sl-tag>

        <sl-tag emphasis="bold" label="Label" size="md"></sl-tag>
        <sl-tag emphasis="bold" label="Readonly" size="md" readonly></sl-tag>
        <sl-tag emphasis="bold" label="Removable" removable size="md"></sl-tag>
        <sl-tag emphasis="bold" label="Disabled" size="md" disabled></sl-tag>
        <sl-tag emphasis="bold" label="Disabled, removable" removable size="md" disabled></sl-tag>
      </div>

      <div>
        <span>lg</span>
        <sl-tag label="Label" size="lg"></sl-tag>
        <sl-tag label="Readonly" size="lg" readonly></sl-tag>
        <sl-tag label="Removable" removable size="lg"></sl-tag>
        <sl-tag label="Disabled" size="lg" disabled></sl-tag>
        <sl-tag label="Disabled, removable" removable size="lg" disabled></sl-tag>

        <sl-tag emphasis="bold" label="Label" size="lg"></sl-tag>
        <sl-tag emphasis="bold" label="Readonly" size="lg" readonly></sl-tag>
        <sl-tag emphasis="bold" label="Removable" removable size="lg"></sl-tag>
        <sl-tag emphasis="bold" label="Disabled" size="lg" disabled></sl-tag>
        <sl-tag emphasis="bold" label="Disabled, removable" removable size="lg" disabled></sl-tag>
      </div>
    `;
  }
};
