import { faStrawberry } from '@fortawesome/pro-regular-svg-icons';
import { type ButtonSize } from '@sl-design-system/button';
import '@sl-design-system/form/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/text-field/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../register.js';

type Props = { content: string; size: ButtonSize };
type Story = StoryObj<Props>;

Icon.register(faStrawberry);

export default {
  title: 'Overlay/Infotip',
  args: {
    content: 'This field requires a unique identifier used for account login.',
    size: 'md'
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg']
    }
  },
  render: ({ content, size }) => html`<sl-infotip size=${size}>${content}</sl-infotip>`
} satisfies Meta<Props>;

export const Basic: Story = {};

export const CustomIcon: Story = {
  args: {
    content: 'Strawberries are good for you.'
  },
  render: ({ content, size }) => html`
    <sl-infotip size=${size}>
      <sl-icon name="far-strawberry" slot="icon"></sl-icon>
      ${content}
    </sl-infotip>
  `
};

export const RichContent: Story = {
  render: ({ size }) => html`
    <sl-infotip size=${size}>
      <strong>Password requirements</strong>
      <ul style="margin: 0.25rem 0 0; padding-inline-start: 1.25rem;">
        <li>At least 8 characters</li>
        <li>One uppercase letter</li>
        <li>One number or special character</li>
      </ul>
    </sl-infotip>
  `
};

export const InContext: Story = {
  render: ({ content, size }) => html`
    <sl-form-field>
      <sl-label>
        Username
        <sl-infotip slot="infotip" size=${size}>${content}</sl-infotip>
      </sl-label>
      <sl-text-field placeholder="Username"></sl-text-field>
    </sl-form-field>
  `
};
