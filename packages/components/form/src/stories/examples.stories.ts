import type { ValidatorErrors } from '../validators.js';
import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { type Signal, effect } from '@lit-labs/preact-signals';
import type { StoryObj } from '@storybook/web-components';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/checkbox/register.js';
import '@sl-design-system/form/register.js';
import '@sl-design-system/text-input/register.js';
import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { FormGroup } from '../form-group.js';
import { FormControl } from '../form-control.js';
import '../../register.js';
import { FormControlMixin } from '../form-control-mixin.js';

export default {
  title: 'Form/Examples'
};

export const Signup: StoryObj = {
  render: () => {
    class SignupForm extends LitElement {
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
      customElements.define('signup-form', SignupForm);
    } catch {}

    return html`<signup-form></signup-form>`;
  }
};

export const Nested: StoryObj = {
  render: () => {
    class AddressForm extends FormControlMixin(LitElement) {
      static formAssociated = true;

      static override styles: CSSResultGroup = css`
        :host {
          display: block;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-row {
          display: grid;
          gap: 0.25rem 0.5rem;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
        }

        sl-label {
          grid-row: 1;
        }

        sl-text-input {
          grid-row: 2;
        }
      `;

      internals = this.attachInternals();

      @property({ attribute: false }) address?: FormGroup<{
        postalCode: FormControl<string>;
        houseNumber: FormControl<string>;
        street: FormControl<string>;
        city: FormControl<string>;
      }>;

      override connectedCallback(): void {
        super.connectedCallback();

        this.setFormControlElement(this);

        effect(() => {
          this.internals.setValidity({ valueMissing: !this.address?.valid.value }, 'Address is invalid');
        });
      }

      override willUpdate(changes: PropertyValues<this>): void {
        if (changes.has('report')) {
          this.renderRoot.querySelector('form')?.reportValidity();
        }
      }

      override render(): TemplateResult | undefined {
        if (!this.address) {
          return;
        }

        return html`
          <form>
            <h2>Address</h2>

            <div class="form-row">
              <sl-label for="postalCode">Postal code</sl-label>
              <sl-text-input ${this.address.bind('postalCode')} id="postalCode" required></sl-text-input>

              <sl-label for="houseNumber">House number</sl-label>
              <sl-text-input ${this.address.bind('houseNumber')} id="houseNumber" required></sl-text-input>
            </div>

            <div class="form-row">
              <sl-label for="street">Street</sl-label>
              <sl-text-input ${this.address.bind('street')} id="street"></sl-text-input>

              <sl-label for="city">City</sl-label>
              <sl-text-input ${this.address.bind('city')} id="city"></sl-text-input>
            </div>
          </form>
        `;
      }
    }

    class NestedForm extends LitElement {
      static override styles: CSSResultGroup = css`
        address-form,
        sl-text-input {
          margin-block-end: 1rem;
        }
      `;

      form = new FormGroup(this, {
        firstName: new FormControl(this, ''),
        lastName: new FormControl(this, ''),
        address: new FormGroup(this, {
          postalCode: new FormControl(this, ''),
          houseNumber: new FormControl(this, ''),
          street: new FormControl(this, ''),
          city: new FormControl(this, '')
        })
      });

      override render(): TemplateResult {
        return html`
          <form>
            <h1>Nested form</h1>

            <sl-label for="firstName">First name</sl-label>
            <sl-text-input ${this.form.bind('firstName')} id="firstName" required></sl-text-input>

            <sl-label for="lastName">Last name</sl-label>
            <sl-text-input ${this.form.bind('lastName')} id="lastName" required></sl-text-input>

            <address-form .address=${this.form.get('address')}></address-form>

            <sl-button-bar align="end">
              <sl-button>Cancel</sl-button>
              <sl-button @click=${this.#onClick} variant="primary">Save</sl-button>
            </sl-button-bar>
          </form>
        `;
      }

      #onClick(): void {
        if (this.renderRoot.querySelector('form')?.reportValidity()) {
          console.log('Valid form', this.form.value.value);
        }
      }
    }

    try {
      customElements.define('address-form', AddressForm);
      customElements.define('nested-form', NestedForm);
    } catch {}

    return html`<nested-form></nested-form>`;
  }
};

export const Complex: StoryObj = {};
