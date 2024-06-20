import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';
import { type EmojiBrowser } from './emoji-browser.js';

type Props = Pick<EmojiBrowser, 'locale'>;
type Story = StoryObj<Props>;

export default {
  title: 'Components/Emoji browser',
  tags: ['draft'],
  render: () => {
    return html`<sl-emoji-browser base-url="/emoji" locale="en"></sl-emoji-browser>`;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};
