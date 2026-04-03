import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type Infotip } from './infotip.js';

type Props = Pick<Infotip, 'icon' | 'maxWidth'> & {
  content: string;
};
type Story = StoryObj<Props>;

export default {
  title: 'Overlay/Infotip',
  tags: ['draft'],
  args: {
    content: 'This field requires a unique identifier used for account login.'
  },
  render: ({ content, icon, maxWidth }) => html`
    <sl-infotip icon=${ifDefined(icon)} max-width=${ifDefined(maxWidth)}>${content}</sl-infotip>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};

export const CustomIcon: Story = {
  args: {
    icon: 'far-circle-question'
  }
};

export const RichContent: Story = {
  render: () => html`
    <sl-infotip>
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
  render: ({ content }) => html`
    <style>
      label {
        align-items: center;
        display: inline-flex;
        font-family: sans-serif;
        gap: 0.25rem;
      }
    </style>
    <label>
      Username
      <sl-infotip>${content}</sl-infotip>
    </label>
  `
};
