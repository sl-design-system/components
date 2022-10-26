import { Story } from '@storybook/web-components';
import { html } from 'lit';
import './register.js';

export default {
  title: 'Grid'
};

export const API: Story = {
  render: () => html`
    <sl-grid></sl-grid>
  `
};
