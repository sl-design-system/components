import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type Badge, type BadgeVariant } from './badge.js';

type Props = Pick<Badge, 'emphasis' | 'size' | 'variant'> & { icon?: boolean; text?: string };
type Story = StoryObj<Props>;

const variants: BadgeVariant[] = ['neutral', 'primary', 'info', 'danger', 'success', 'warning', 'accent'];

export default {
  title: 'Feedback & status/Badge',
  tags: ['stable'],
  args: {
    emphasis: 'subtle',
    icon: false,
    size: 'md',
    text: 'Status',
    variant: 'neutral'
  },
  argTypes: {
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
  render: ({ emphasis, icon, size, text, variant }) => html`
    <sl-badge .emphasis=${emphasis} .size=${size} .variant=${variant}>
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
          [undefined, 'primary', 'info', 'danger', 'success', 'warning', 'accent'].map(
            variant => html`
              <span>${variant ?? 'neutral'}</span>
              <sl-badge emphasis=${ifDefined(emphasis)} size="sm" variant=${ifDefined(variant)}></sl-badge>
              <div class="wrapper">
                <sl-badge emphasis=${ifDefined(emphasis)} variant=${ifDefined(variant)}>8</sl-badge>
                <sl-badge emphasis=${ifDefined(emphasis)} variant=${ifDefined(variant)}>
                  <sl-icon name="check"></sl-icon>
                </sl-badge>
                <sl-badge emphasis=${ifDefined(emphasis)} variant=${ifDefined(variant)}>
                  <sl-icon name="check"></sl-icon> Status
                </sl-badge>
                <sl-badge emphasis=${ifDefined(emphasis)} variant=${ifDefined(variant)}>Status</sl-badge>
              </div>
              <div class="wrapper">
                <sl-badge emphasis=${ifDefined(emphasis)} size="lg" variant=${ifDefined(variant)}>8</sl-badge>
                <sl-badge emphasis=${ifDefined(emphasis)} size="lg" variant=${ifDefined(variant)}>
                  <sl-icon name="check"></sl-icon>
                </sl-badge>
                <sl-badge emphasis=${ifDefined(emphasis)} size="lg" variant=${ifDefined(variant)}>
                  <sl-icon name="check"></sl-icon> Status
                </sl-badge>
                <sl-badge emphasis=${ifDefined(emphasis)} size="lg" variant=${ifDefined(variant)}>Status</sl-badge>
              </div>
            `
          )
        )}
      </section>
    `;
  }
};
