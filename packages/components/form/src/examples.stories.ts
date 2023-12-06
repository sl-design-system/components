import type { StoryObj } from '@storybook/web-components';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/text-field/register.js';
import { html } from 'lit';
import '../register.js';

type Story = StoryObj;

export default {
  title: 'Form/Examples'
};

export const Basic: Story = {
  render: () => {
    const onSubmit = (event: Event): void => {
      event.preventDefault();

      console.log('onSubmit', event);
    };

    return html`
      <style>
        sl-form-field {
          margin-block-end: 1rem;
        }
      </style>
      <form @submit=${onSubmit}>
        <sl-form-field label="Username">
          <sl-text-field placeholder="Enter your username or email address here" required></sl-text-field>
        </sl-form-field>

        <sl-form-field label="Password">
          <sl-text-field type="password" required></sl-text-field>
        </sl-form-field>

        <sl-button-bar align="space-between">
          <sl-button fill="link">Forgot password?</sl-button>
          <sl-button type="submit" variant="primary">Log in</sl-button>
        </sl-button-bar>
      </form>
    `;
  }
};
