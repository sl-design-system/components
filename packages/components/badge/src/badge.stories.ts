import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html, nothing } from 'lit';
import '../register.js';
import { type Badge, type BadgeVariant } from './badge.js';

type Props = Pick<Badge, 'emphasis' | 'size' | 'variant'> & { icon?: boolean; text?: string };
type Story = StoryObj<Props>;

const variants: BadgeVariant[] = ['neutral', 'primary', 'info', 'danger', 'success', 'warning', 'accent'];

export default {
  title: 'Components/Badge',
  tags: ['preview'],
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
        table {
          border-collapse: collapse;
        }
        th,
        td {
          padding: 4px 8px;
        }
      </style>
      <table>
        <thead>
          <tr>
            <th></th>
            <th colspan="2">Subtle</th>
            <th colspan="2">Bold</th>
          </tr>
          <tr>
            <th></th>
            <th>sm</th>
            <th>md</th>
            <th>lg</th>
            <th>sm</th>
            <th>md</th>
            <th>lg</th>
          </tr>
        </thead>
        <tbody>
          ${variants.map(
            variant => html`
              <tr>
                <td>${variant}</td>
                <td>
                  <sl-badge .variant=${variant} emphasis="subtle" size="sm"></sl-badge>
                </td>
                <td>
                  <sl-badge .variant=${variant} emphasis="subtle" size="md">8</sl-badge>
                  <sl-badge .variant=${variant} emphasis="subtle" size="md">
                    <sl-icon name="check"></sl-icon>
                  </sl-badge>
                  <sl-badge .variant=${variant} emphasis="subtle" size="md">
                    <sl-icon name="check"></sl-icon> Status
                  </sl-badge>
                  <sl-badge .variant=${variant} emphasis="subtle" size="md">Status</sl-badge>
                </td>
                <td>
                  <sl-badge .variant=${variant} emphasis="subtle" size="lg">8</sl-badge>
                  <sl-badge .variant=${variant} emphasis="subtle" size="lg">
                    <sl-icon name="check"></sl-icon>
                  </sl-badge>
                  <sl-badge .variant=${variant} emphasis="subtle" size="lg">
                    <sl-icon name="check"></sl-icon> Status
                  </sl-badge>
                  <sl-badge .variant=${variant} emphasis="subtle" size="lg">Status</sl-badge>
                </td>
                <td>
                  <sl-badge .variant=${variant} emphasis="bold" size="sm"></sl-badge>
                </td>
                <td>
                  <sl-badge .variant=${variant} emphasis="bold" size="md">8</sl-badge>
                  <sl-badge .variant=${variant} emphasis="bold" size="md">
                    <sl-icon name="check"></sl-icon>
                  </sl-badge>
                  <sl-badge .variant=${variant} emphasis="bold" size="md">
                    <sl-icon name="check"></sl-icon> Status
                  </sl-badge>
                  <sl-badge .variant=${variant} emphasis="bold" size="md">Status</sl-badge>
                </td>
                <td>
                  <sl-badge .variant=${variant} emphasis="bold" size="lg">8</sl-badge>
                  <sl-badge .variant=${variant} emphasis="bold" size="lg">
                    <sl-icon name="check"></sl-icon>
                  </sl-badge>
                  <sl-badge .variant=${variant} emphasis="bold" size="lg">
                    <sl-icon name="check"></sl-icon> Status
                  </sl-badge>
                  <sl-badge .variant=${variant} emphasis="bold" size="lg">Status</sl-badge>
                </td>
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
  }
};
