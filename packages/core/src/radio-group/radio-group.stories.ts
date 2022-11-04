import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './register.js';

export default {
  title: 'Radio group'
};

export const API: StoryObj = {
  args: {
    disabled: false,
    orientation: 'vertical'
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical']
    }
  },
  render: ({ disabled, orientation }) => html`
    <sl-radio-group ?disabled=${disabled} .orientation=${orientation}>
      <sl-radio value="1">One</sl-radio>
      <sl-radio value="2">Two</sl-radio>
      <sl-radio value="3">Three</sl-radio>
    </sl-radio-group>
  `
};
