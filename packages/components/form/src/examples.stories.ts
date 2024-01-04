import type { StoryObj } from '@storybook/web-components';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/checkbox/register.js';
import '@sl-design-system/form/register.js';
import '@sl-design-system/radio-group/register.js';
import '@sl-design-system/select/register.js';
import '@sl-design-system/switch/register.js';
import '@sl-design-system/textarea/register.js';
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
      <sl-form @submit=${onSubmit}>
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
      </sl-form>
    `;
  }
};

export const Complex: Story = {
  render: () => {
    return html`
      <style>
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
      <sl-form>
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
      </sl-form>
    `;
  }
};

export const All: Story = {
  render: () => {
    const onClick = (): void => {
      document.querySelector('sl-form')?.reportValidity();
    };

    return html`
      <sl-form>
        <sl-form-field label="Text field">
          <sl-text-field name="input" placeholder="Placeholder" required></sl-text-field>
        </sl-form-field>

        <sl-form-field label="Textarea">
          <sl-textarea name="textarea" placeholder="Placeholder" required></sl-textarea>
        </sl-form-field>

        <sl-form-field label="Checkbox">
          <sl-checkbox name="checkbox" required value="checkbox">Checkbox</sl-checkbox>
        </sl-form-field>

        <sl-form-field label="Select">
          <sl-select name="select" required>
            <sl-select-option value="1">Option 1</sl-select-option>
            <sl-select-option value="2">Option 2</sl-select-option>
            <sl-select-option value="3">Option 3</sl-select-option>
          </sl-select>
        </sl-form-field>

        <sl-form-field label="Switch">
          <sl-switch name="switch" reverse value="toggle">Toggle me</sl-switch>
        </sl-form-field>

        <sl-form-field label="Checkbox group">
          <sl-checkbox-group name="checkboxGroup" required>
            <sl-checkbox value="0">Check me</sl-checkbox>
            <sl-checkbox value="1">No me</sl-checkbox>
            <sl-checkbox value="2">I was here first</sl-checkbox>
          </sl-checkbox-group>
        </sl-form-field>

        <sl-form-field label="Radio group">
          <sl-radio-group name="radioGroup" required>
            <sl-radio value="1">One</sl-radio>
            <sl-radio value="2">Two</sl-radio>
            <sl-radio value="3">Three</sl-radio>
          </sl-radio-group>
        </sl-form-field>

        <sl-button-bar align="end">
          <sl-button fill="ghost" type="reset">Reset</sl-button>
          <sl-button @click=${onClick} variant="primary">Report validity</sl-button>
        </sl-button-bar>
      </sl-form>
    `;
  }
};

export const AllInvalid: Story = {
  render: () => {
    setTimeout(() => {
      document.querySelector('sl-form')?.reportValidity();
    });

    return html`
      <sl-form>
        <sl-form-field label="Text field">
          <sl-text-field name="input" placeholder="Placeholder" required></sl-text-field>
        </sl-form-field>

        <sl-form-field label="Textarea">
          <sl-textarea name="textarea" placeholder="Placeholder" required></sl-textarea>
        </sl-form-field>

        <sl-form-field label="Checkbox">
          <sl-checkbox name="checkbox" required value="checkbox">Checkbox</sl-checkbox>
        </sl-form-field>

        <sl-form-field label="Select">
          <sl-select name="select" required>
            <sl-select-option value="1">Option 1</sl-select-option>
            <sl-select-option value="2">Option 2</sl-select-option>
            <sl-select-option value="3">Option 3</sl-select-option>
          </sl-select>
        </sl-form-field>

        <sl-form-field label="Switch">
          <sl-switch name="switch" reverse value="toggle">Toggle me</sl-switch>
        </sl-form-field>

        <sl-form-field label="Checkbox group">
          <sl-checkbox-group name="checkboxGroup" required>
            <sl-checkbox value="0">Check me</sl-checkbox>
            <sl-checkbox value="1">No me</sl-checkbox>
            <sl-checkbox value="2">I was here first</sl-checkbox>
          </sl-checkbox-group>
        </sl-form-field>

        <sl-form-field label="Radio group">
          <sl-radio-group name="radioGroup" required>
            <sl-radio value="1">One</sl-radio>
            <sl-radio value="2">Two</sl-radio>
            <sl-radio value="3">Three</sl-radio>
          </sl-radio-group>
        </sl-form-field>

        <sl-button-bar align="end">
          <sl-button type="reset">Reset</sl-button>
        </sl-button-bar>
      </sl-form>
    `;
  }
};

export const AllValid: Story = {
  render: () => {
    setTimeout(() => {
      document.querySelector('sl-form')?.reportValidity();
    });

    return html`
      <sl-form>
        <sl-form-field label="Text field">
          <sl-text-field name="input" placeholder="Placeholder" show-valid value="Textfield"></sl-text-field>
        </sl-form-field>

        <sl-form-field label="Textarea">
          <sl-textarea name="textarea" placeholder="Placeholder" show-valid value="Textarea"></sl-textarea>
        </sl-form-field>

        <sl-form-field label="Checkbox">
          <sl-checkbox checked name="checkbox" required show-valid value="checkbox">Checkbox</sl-checkbox>
        </sl-form-field>

        <sl-form-field label="Select">
          <sl-select name="select" show-valid value="2">
            <sl-select-option value="1">Option 1</sl-select-option>
            <sl-select-option value="2">Option 2</sl-select-option>
            <sl-select-option value="3">Option 3</sl-select-option>
          </sl-select>
        </sl-form-field>

        <sl-form-field label="Switch">
          <sl-switch checked name="switch" reverse value="toggle">Toggle me</sl-switch>
        </sl-form-field>

        <sl-form-field label="Checkbox group">
          <sl-checkbox-group name="checkboxGroup" required>
            <sl-checkbox value="0">Check me</sl-checkbox>
            <sl-checkbox checked show-valid value="1">No me</sl-checkbox>
            <sl-checkbox value="2">I was here first</sl-checkbox>
          </sl-checkbox-group>
        </sl-form-field>

        <sl-form-field label="Radio group">
          <sl-radio-group name="radioGroup" required show-valid value="2">
            <sl-radio value="1">One</sl-radio>
            <sl-radio value="2">Two</sl-radio>
            <sl-radio value="3">Three</sl-radio>
          </sl-radio-group>
        </sl-form-field>

        <sl-button-bar align="end">
          <sl-button type="reset">Reset</sl-button>
        </sl-button-bar>
      </sl-form>
    `;
  }
};
