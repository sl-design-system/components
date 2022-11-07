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
    },
    selected: {
      control: 'inline-radio',
      options: ['1', '2', '3']
    }
  },
  render: ({ disabled, selected, orientation }) => html`
    <sl-radio-group ?disabled=${disabled} .orientation=${orientation} .selected=${selected}>
      <sl-radio value="1">One</sl-radio>
      <sl-radio value="2">Two</sl-radio>
      <sl-radio value="3">Three</sl-radio>
    </sl-radio-group>
  `
};

export const Disabled: StoryObj = {
  render: () => html`
    <sl-radio-group>
      <sl-radio value="1">One</sl-radio>
      <sl-radio disabled value="2">Two (disabled)</sl-radio>
      <sl-radio value="3">Three</sl-radio>
      <sl-radio disabled value="4">Four (disabled)</sl-radio>
    </sl-radio-group>
  `
};
