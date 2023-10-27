import type { ValidatorErrors } from '../validators.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
import type { Signal } from '@lit-labs/preact-signals';
import type { StoryObj } from '@storybook/web-components';
import '@sl-design-system/button/register.js';
import '@sl-design-system/checkbox/register.js';
import '@sl-design-system/form/register.js';
import '@sl-design-system/text-input/register.js';
import { LitElement, css, html } from 'lit';
import { FormGroup } from '../form-group.js';
import { FormControl } from '../form-control.js';
import '../../register.js';

export default {
  title: 'Form/Examples'
};

export const Login: StoryObj = {
  render: () => {
    class LoginForm extends LitElement {
      static override styles: CSSResultGroup = css`
        sl-checkbox,
        sl-text-input {
          margin-block-end: 1rem;
        }
      `;

      form = new FormGroup(this, {
        username: new FormControl(this, ''),
        password: new FormControl(this, '', (value: Signal<string>): ValidatorErrors | null => {
          return value.value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
            ? null
            : {
                invalidPassword: {
                  message:
                    'Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one number'
                }
              };
        })
      });

      override render(): TemplateResult {
        return html`
          <form>
            <h1>Sign up</h1>

            <sl-label for="username">Username</sl-label>
            <sl-text-input
              ${this.form.bind('username')}
              id="username"
              minlength="8"
              placeholder="Enter your username"
              required
            ></sl-text-input>

            <sl-label for="password">Password</sl-label>
            <sl-text-input
              ${this.form.bind('password')}
              id="password"
              placeholder="Enter your password"
              required
              type="password"
            ></sl-text-input>

            <sl-checkbox required>I agree to the terms of service</sl-checkbox>

            <sl-button @click=${this.#onClick} variant="primary">Sign up</sl-button>
          </form>
        `;
      }

      #onClick(): void {
        if (this.renderRoot.querySelector('form')?.reportValidity()) {
          console.log('Ready to submit form:', this.form.value.value);
        }
      }
    }

    try {
      customElements.define('login-form', LoginForm);
    } catch {}

    return html`<login-form></login-form>`;
  }
};

export const Nested: StoryObj = {};

export const Complex: StoryObj = {};
