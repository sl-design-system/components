import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ThemeSwitch } from './theme-switch.js';

type Props = Pick<ThemeSwitch, 'colorScheme'>;
type Story = StoryObj<Props>;

try {
  customElements.define('doc-theme-switch', ThemeSwitch);
} catch {
  /* empty */
}

export default {
  title: 'Theme Switch',
  args: {
    colorScheme: 'light'
  },
  argTypes: {
    colorScheme: {
      control: 'inline-radio',
      options: ['light', 'dark']
    }
  },
  render: ({ colorScheme }) => html`<doc-theme-switch color-scheme=${colorScheme}></doc-theme-switch>`
} satisfies Meta<Props>;

export const Light: Story = {};

export const Dark: Story = {
  args: {
    colorScheme: 'dark'
  }
};
