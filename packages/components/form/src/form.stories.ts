import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/checkbox/register.js';
import '@sl-design-system/form/register.js';
import { CompositeForm } from '@sl-design-system/lit-examples';
import '@sl-design-system/radio-group/register.js';
import '@sl-design-system/select/register.js';
import '@sl-design-system/switch/register.js';
import '@sl-design-system/text-field/register.js';
import '@sl-design-system/textarea/register.js';
import { type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';
import { type Form } from './form.js';

type Story = StoryObj;

export default {
  title: 'Form/Form'
};

export const Basic: Story = {
  render: () => {
    const onSubmit = (event: Event & { target: HTMLElement }): void => {
      const form = event.target.closest('sl-form') as Form;

      console.log(form.reportValidity(), form.value);
    };

    return html`
      <sl-form>
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
          <sl-checkbox name="remember" required>Remember me</sl-checkbox>
        </sl-form-field>

        <sl-button-bar align="space-between">
          <sl-button fill="link">Forgot password?</sl-button>
          <sl-button @click=${onSubmit} variant="primary">Log in</sl-button>
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

export const CustomComponent: Story = {
  render: () => {
    try {
      customElements.define('example-composite-form', CompositeForm);
    } catch {
      /* empty */
    }

    return html`<example-composite-form></example-composite-form>`;
  }
};

export const All: Story = {
  render: () => {
    const onClick = (): void => {
      const form = document.querySelector('sl-form');

      console.log(form?.reportValidity(), form?.value);
    };

    return html`
      <sl-form>
        <sl-form-field hint="Hint text" label="Text field">
          <sl-text-field name="input" placeholder="Placeholder" required></sl-text-field>
        </sl-form-field>

        <sl-form-field hint="Hint text" label="Textarea">
          <sl-textarea name="textarea" placeholder="Placeholder" required></sl-textarea>
        </sl-form-field>

        <sl-form-field hint="Hint text" label="Checkbox">
          <sl-checkbox name="checkbox" required value="checked">Checkbox</sl-checkbox>
        </sl-form-field>

        <sl-form-field hint="Hint text" label="Select">
          <sl-select name="select" required>
            <sl-select-option value="1">Option 1</sl-select-option>
            <sl-select-option value="2">Option 2</sl-select-option>
            <sl-select-option value="3">Option 3</sl-select-option>
          </sl-select>
        </sl-form-field>

        <sl-form-field hint="Hint text" label="Switch">
          <sl-switch name="switch" reverse value="toggled">Toggle me</sl-switch>
        </sl-form-field>

        <sl-form-field hint="Hint text" label="Checkbox group">
          <sl-checkbox-group name="checkboxGroup" required>
            <sl-checkbox value="0">Check me</sl-checkbox>
            <sl-checkbox value="1">No me</sl-checkbox>
            <sl-checkbox value="2">I was here first</sl-checkbox>
          </sl-checkbox-group>
        </sl-form-field>

        <sl-form-field hint="Hint text" label="Radio group">
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
        <sl-form-field hint="Hint text" label="Text field">
          <sl-text-field name="input" placeholder="Placeholder" required></sl-text-field>
        </sl-form-field>

        <sl-form-field hint="Hint text" label="Textarea">
          <sl-textarea name="textarea" placeholder="Placeholder" required></sl-textarea>
        </sl-form-field>

        <sl-form-field hint="Hint text" label="Checkbox">
          <sl-checkbox name="checkbox" required value="checked">Checkbox</sl-checkbox>
        </sl-form-field>

        <sl-form-field hint="Hint text" label="Select">
          <sl-select name="select" required>
            <sl-select-option value="1">Option 1</sl-select-option>
            <sl-select-option value="2">Option 2</sl-select-option>
            <sl-select-option value="3">Option 3</sl-select-option>
          </sl-select>
        </sl-form-field>

        <sl-form-field hint="Hint text" label="Switch">
          <sl-switch name="switch" reverse value="toggled">Toggle me</sl-switch>
        </sl-form-field>

        <sl-form-field hint="Hint text" label="Checkbox group">
          <sl-checkbox-group name="checkboxGroup" required>
            <sl-checkbox value="0">Check me</sl-checkbox>
            <sl-checkbox value="1">No me</sl-checkbox>
            <sl-checkbox value="2">I was here first</sl-checkbox>
          </sl-checkbox-group>
        </sl-form-field>

        <sl-form-field hint="Hint text" label="Radio group">
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
          <sl-checkbox checked name="checkbox" required show-valid value="checked">Checkbox</sl-checkbox>
        </sl-form-field>

        <sl-form-field label="Select">
          <sl-select name="select" show-valid value="2">
            <sl-select-option value="1">Option 1</sl-select-option>
            <sl-select-option value="2">Option 2</sl-select-option>
            <sl-select-option value="3">Option 3</sl-select-option>
          </sl-select>
        </sl-form-field>

        <sl-form-field label="Switch">
          <sl-switch checked name="switch" reverse value="toggled">Toggle me</sl-switch>
        </sl-form-field>

        <sl-form-field label="Checkbox group">
          <sl-checkbox-group name="checkboxGroup" required value='["1"]'>
            <sl-checkbox value="0">Check me</sl-checkbox>
            <sl-checkbox show-valid value="1">No me</sl-checkbox>
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
