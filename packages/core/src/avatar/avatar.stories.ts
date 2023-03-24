import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './register.js';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

type Story = StoryObj<Props>;

export default {
  title: 'Avatar'
} satisfies Meta<Props>;

export const Basic: Story = {
  render: () =>
    html`
      <style>
        section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
      </style>
      <section>
        <sl-avatar uniqueProfileId="1"></sl-avatar>
        <sl-avatar uniqueProfileId="2"></sl-avatar>
        <sl-avatar uniqueProfileId="3"></sl-avatar>
        <sl-avatar uniqueProfileId="4"></sl-avatar>
        <sl-avatar uniqueProfileId="5"></sl-avatar>
      </section>
    `
};
