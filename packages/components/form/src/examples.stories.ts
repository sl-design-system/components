import type { StoryObj } from '@storybook/web-components';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/checkbox/register.js';
import '@sl-design-system/radio-group/register.js';
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

        <sl-form-field>
          <sl-checkbox required>Remember me</sl-checkbox>
        </sl-form-field>

        <sl-button-bar align="space-between">
          <sl-button fill="link">Forgot password?</sl-button>
          <sl-button type="submit" variant="primary">Log in</sl-button>
        </sl-button-bar>
      </form>
    `;
  }
};

export const Complex: Story = {
  render: () => {
    return html`
      <style>
        form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .name {
          display: grid;
          gap: 1rem;
          grid-template-columns: 1fr 110px 1.5fr;
        }
        .address1 {
          display: grid;
          gap: 1rem;
          grid-template-columns: 1fr 1fr 110px;
        }
        .address2 {
          display: grid;
          gap: 1rem;
          grid-template-columns: 1fr 1fr 1fr;
        }
      </style>
      <form>
        <div class="name">
          <sl-form-field label="First name">
            <sl-text-field required></sl-text-field>
          </sl-form-field>

          <sl-form-field label="Infix">
            <sl-text-field></sl-text-field>
          </sl-form-field>

          <sl-form-field label="Last name">
            <sl-text-field required></sl-text-field>
          </sl-form-field>
        </div>

        <sl-form-field label="Gender">
          <sl-radio-group required>
            <sl-radio value="0">Male</sl-radio>
            <sl-radio value="1">Female</sl-radio>
            <sl-radio value="2">Other</sl-radio>
          </sl-radio-group>
        </sl-form-field>

        <div class="address1">
          <sl-form-field label="Zip code">
            <sl-text-field required></sl-text-field>
          </sl-form-field>

          <sl-form-field label="Number">
            <sl-text-field required></sl-text-field>
          </sl-form-field>

          <sl-form-field label="Addition">
            <sl-text-field></sl-text-field>
          </sl-form-field>
        </div>

        <div class="address2">
          <sl-form-field label="Street">
            <sl-text-field required></sl-text-field>
          </sl-form-field>

          <sl-form-field label="City">
            <sl-text-field required></sl-text-field>
          </sl-form-field>

          <sl-form-field label="Country">
            <sl-text-field required></sl-text-field>
          </sl-form-field>
        </div>
      </form>
    `;
  }
};
