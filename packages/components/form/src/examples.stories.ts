import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/checkbox/register.js';
import '@sl-design-system/form/register.js';
import {
  CompositeForm as CompositeFormComponent,
  DynamicArrayForm as DynamicArrayFormComponent,
  NestedForm as NestedFormComponent
} from '@sl-design-system/lit-examples';
import '@sl-design-system/radio-group/register.js';
import '@sl-design-system/select/register.js';
import '@sl-design-system/switch/register.js';
import '@sl-design-system/text-area/register.js';
import '@sl-design-system/text-field/register.js';
import { type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { type SlSubmitEvent } from './form.js';

type Story = StoryObj;

export default {
  title: 'Form/Examples'
};

export const LogIn: Story = {
  render: () => {
    const onReset = (): void => console.log('Form has been reset');

    const onSubmit = (event: SlSubmitEvent): void => {
      console.log('submit', event.target.value);
    };

    return html`
      <sl-form @sl-reset=${onReset} @sl-submit=${onSubmit}>
        <sl-form-field label="Username">
          <sl-text-field
            name="username"
            placeholder="Enter your username or email address here"
            required
          ></sl-text-field>
        </sl-form-field>

        <sl-form-field label="Password">
          <sl-text-field name="password" type="password" required></sl-text-field>
        </sl-form-field>

        <sl-form-field>
          <sl-checkbox name="remember">Remember me</sl-checkbox>
        </sl-form-field>

        <sl-button-bar align="end">
          <sl-button fill="link" style="margin-inline-end:auto">Forgot password?</sl-button>
          <sl-button fill="outline" type="reset" variant="primary">Reset</sl-button>
          <sl-button type="submit" variant="primary">Log in</sl-button>
        </sl-button-bar>
      </sl-form>
    `;
  }
};

export const CompositeForm: Story = {
  render: () => {
    try {
      customElements.define('example-composite-form', CompositeFormComponent);
    } catch {
      /* empty */
    }

    return html`<example-composite-form></example-composite-form>`;
  }
};

export const DynamicArray: Story = {
  render: () => {
    try {
      customElements.define('example-dynamic-array-form', DynamicArrayFormComponent);
    } catch {
      /* empty */
    }

    return html`<example-dynamic-array-form></example-dynamic-array-form>`;
  }
};

export const NestedForm: Story = {
  render: () => {
    try {
      customElements.define('example-nested-form', NestedFormComponent);
    } catch {
      /* empty */
    }

    return html`<example-nested-form></example-nested-form>`;
  }
};
