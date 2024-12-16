import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type Badge, type BadgeColor, type BadgeVariant } from './badge.js';

type Props = Pick<Badge, 'color' | 'emphasis' | 'size' | 'variant'> & { icon?: boolean; text?: string };
type Story = StoryObj<Props>;

const colors: BadgeColor[] = ['blue', 'green', 'grey', 'orange', 'purple', 'red', 'teal', 'yellow'],
  variants: BadgeVariant[] = ['neutral', 'primary', 'info', 'danger', 'success', 'warning', 'accent'];

export default {
  title: 'Feedback & status/Badge',
  tags: ['stable'],
  args: {
    emphasis: 'subtle',
    icon: false,
    size: 'md',
    text: 'Status'
  },
  argTypes: {
    color: {
      control: 'radio',
      options: colors
    },
    emphasis: {
      control: 'inline-radio',
      options: ['subtle', 'bold']
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg']
    },
    variant: {
      control: 'radio',
      options: variants
    }
  },
  render: ({ color, emphasis, icon, size, text, variant }) => html`
    <sl-badge
      color=${ifDefined(color)}
      emphasis=${ifDefined(emphasis)}
      size=${ifDefined(size)}
      variant=${ifDefined(variant)}
    >
      ${icon ? html`<sl-icon name="check"></sl-icon>` : nothing} ${text}
    </sl-badge>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Round: Story = {
  render: ({ emphasis, size, variant }) => html`
    <sl-badge .emphasis=${emphasis} .size=${size} .variant=${variant}>8</sl-badge>
    <sl-badge .emphasis=${emphasis} .size=${size} .variant=${variant}>
      <sl-icon name="check"></sl-icon>
    </sl-badge>
  `
};

export const Variant: Story = {
  render: ({ emphasis, size }) => html`
    <style>
      div {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
      }
    </style>
    <p>
      The <code>variant</code> property has been deprecated. Use the new <code>color</code> property instead. The
      variants still work, but are mapped to the matching <code>color</code> property.
    </p>
    <div>
      ${variants.map(
        variant => html`<sl-badge .emphasis=${emphasis} .size=${size} variant=${variant}>${variant}</sl-badge>`
      )}
    </div>
  `
};

export const All: Story = {
  render: () => {
    return html`
      <style>
        section {
          align-items: center;
          display: inline-grid;
          gap: 0.5rem 2rem;
          grid-template-columns: auto auto 1fr 1fr;
          justify-items: center;
        }
      </style>
      <section>
        <span></span>
        <span>sm</span>
        <span>md</span>
        <span>lg</span>

        ${[undefined, 'bold'].map(emphasis =>
          colors.map(
            color => html`
              <span>${color}</span>
              <sl-badge color=${ifDefined(color)} emphasis=${ifDefined(emphasis)} size="sm"></sl-badge>
              <div class="wrapper">
                <sl-badge color=${ifDefined(color)} emphasis=${ifDefined(emphasis)}>8</sl-badge>
                <sl-badge color=${ifDefined(color)} emphasis=${ifDefined(emphasis)}>
                  <sl-icon name="check"></sl-icon>
                </sl-badge>
                <sl-badge color=${ifDefined(color)} emphasis=${ifDefined(emphasis)}>
                  <sl-icon name="check"></sl-icon> Status
                </sl-badge>
                <sl-badge color=${ifDefined(color)} emphasis=${ifDefined(emphasis)}>Status</sl-badge>
              </div>
              <div class="wrapper">
                <sl-badge color=${ifDefined(color)} emphasis=${ifDefined(emphasis)} size="lg">8</sl-badge>
                <sl-badge color=${ifDefined(color)} emphasis=${ifDefined(emphasis)} size="lg">
                  <sl-icon name="check"></sl-icon>
                </sl-badge>
                <sl-badge color=${ifDefined(color)} emphasis=${ifDefined(emphasis)} size="lg">
                  <sl-icon name="check"></sl-icon> Status
                </sl-badge>
                <sl-badge color=${ifDefined(color)} emphasis=${ifDefined(emphasis)} size="lg">Status</sl-badge>
              </div>
            `
          )
        )}
      </section>
    `;
  }
};
