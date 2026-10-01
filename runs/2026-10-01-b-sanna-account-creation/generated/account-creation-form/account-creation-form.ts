import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Checkbox } from '@sl-design-system/checkbox';
import { Form, FormController, FormField } from '@sl-design-system/form';
// No `Icon.register(...)` call here: this example's `teacher-assistant` theme setup() already
// registers `arrow-left` (and 53 other icons) globally, so the bare name renders without one.
// `Icon` is still imported as a class purely to satisfy the scopedElements map below.
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { TextField } from '@sl-design-system/text-field';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './account-creation-form.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-account-creation-form': AccountCreationForm;
  }

  interface GlobalEventHandlersEventMap {
    'sl-account-creation-form-submit': SlAccountCreationFormSubmitEvent;
    'sl-account-creation-form-cancel': SlAccountCreationFormCancelEvent;
    'sl-account-creation-form-sign-in': SlAccountCreationFormSignInEvent;
  }
}

/**
 * The data this component owns and reports back: the two name fields, the email address, and the
 * three consent checkboxes. All fields are optional, matching `FormController`'s partial value —
 * this is the shared contract the owning page imports to type its own state.
 */
export interface AccountCreationFormValue {
  firstName?: string;
  lastName?: string;
  email?: string;
  acceptTerms?: boolean;
  acceptPrivacy?: boolean;
  acceptCookies?: boolean;
}

export type SlAccountCreationFormSubmitEvent = CustomEvent<AccountCreationFormValue>;

export type SlAccountCreationFormCancelEvent = CustomEvent<void>;

export type SlAccountCreationFormSignInEvent = CustomEvent<void>;

/**
 * A presentational account-creation form: a heading, a name/email field group, three rich-text
 * consent checkboxes, a primary/secondary action pair, and a "Sign in" link row. It owns the
 * single `<sl-form>` and its `FormController`; the data-owning page passes in the initial `value`
 * and handles the events this component emits.
 *
 * ```html
 * <sl-account-creation-form .value=${value}></sl-account-creation-form>
 * ```
 *
 * @slot heading - The page's main heading. Defaults to the design's "Create an account" headline.
 * @slot actions - The primary/secondary action pair. Defaults to the "Continue"/"Go back" buttons.
 *   A consumer who replaces this slot owns disabling their own buttons when `disabled` is set.
 * @fires sl-account-creation-form-submit - Emitted with the form's value once it reports valid.
 * @fires sl-account-creation-form-cancel - Emitted when "Go back" is clicked.
 * @fires sl-account-creation-form-sign-in - Emitted when "Sign in" is clicked.
 */
export class AccountCreationForm extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-checkbox': Checkbox,
      'sl-form': Form,
      'sl-form-field': FormField,
      'sl-icon': Icon,
      'sl-text-field': TextField
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Controller for managing the form state; discovers the `<sl-form>` in this render root. */
  #form = new FormController<AccountCreationFormValue>(this);

  /**
   * Whether the form is disabled.
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * The form's current value. The data-owning parent passes this in (and reacts to the emitted
   * events); this component never fetches or owns the data itself.
   *
   * @default { firstName: '', lastName: '', email: '', acceptTerms: true, acceptPrivacy: true, acceptCookies: true }
   */
  @property({ attribute: false }) value: AccountCreationFormValue = {
    firstName: '',
    lastName: '',
    email: '',
    acceptTerms: true,
    acceptPrivacy: true,
    acceptCookies: true
  };

  /** Emits with the form's value once `<sl-form>` reports it is valid. */
  @event({ name: 'sl-account-creation-form-submit' })
  submitEvent!: EventEmitter<SlAccountCreationFormSubmitEvent>;

  /** Emits when the user clicks "Go back". The host is responsible for the actual navigation. */
  @event({ name: 'sl-account-creation-form-cancel' })
  cancelEvent!: EventEmitter<SlAccountCreationFormCancelEvent>;

  /** Emits when the user clicks "Sign in". The host is responsible for the actual navigation. */
  @event({ name: 'sl-account-creation-form-sign-in' })
  signInEvent!: EventEmitter<SlAccountCreationFormSignInEvent>;

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('value')) {
      this.#form.value = this.value;
    }
  }

  override render(): TemplateResult {
    return html`
      <slot name="heading">
        <h1>Create an account</h1>
      </slot>

      <sl-form ?disabled=${this.disabled} @sl-submit=${this.#onSubmit}>
        <div class="name-row">
          <sl-form-field label="First name">
            <sl-text-field name="firstName" placeholder="Your first name"></sl-text-field>
          </sl-form-field>
          <sl-form-field label="Last name">
            <sl-text-field name="lastName" placeholder="Your last name"></sl-text-field>
          </sl-form-field>
        </div>

        <sl-form-field class="email-field" label="Email address" mark="required">
          <!--
            The placeholder below reads "Enter your password" on an email field. This is a
            verified defect in the source Figma design (see the manifest's "Design defect
            observed in the reference"), reproduced verbatim here because pixel fidelity to the
            design is the measured objective of this run — this is not a bug to "fix".
          -->
          <sl-text-field name="email" placeholder="Enter your password" required></sl-text-field>
        </sl-form-field>

        <ul class="consents">
          <li>
            <sl-checkbox
              name="acceptTerms"
              aria-label="I have read and accept Terms &amp; conditions"
            ></sl-checkbox>
            <span @click=${AccountCreationForm.#onConsentLabelClick}>
              I have read and accept <a href="#">Terms &amp; conditions</a>
            </span>
          </li>
          <li>
            <sl-checkbox
              name="acceptPrivacy"
              aria-label="I confirm that I have read and understood the Privacy Notice and how my data will be processed during this pilot of AI TA."
            ></sl-checkbox>
            <span @click=${AccountCreationForm.#onConsentLabelClick}>
              I confirm that I have read and understood the
              <a href="#">Privacy Notice</a>
              and how my data will be processed during this pilot of AI TA.
            </span>
          </li>
          <li>
            <sl-checkbox
              name="acceptCookies"
              aria-label="I accept that AI Teacher Assistant uses cookies and similar technologies for Personalization, usage analysis and service improvement as explained in the Privacy Notice."
            ></sl-checkbox>
            <span @click=${AccountCreationForm.#onConsentLabelClick}>
              I accept that AI Teacher Assistant uses cookies and similar technologies for
              Personalization, usage analysis and service improvement as explained in the
              <a href="#">Privacy Notice</a>.
            </span>
          </li>
        </ul>

        <div class="actions">
          <slot name="actions">
            <sl-button
              ?disabled=${this.disabled}
              shape="pill"
              size="lg"
              type="submit"
              variant="primary"
            >
              Continue
            </sl-button>
            <sl-button
              ?disabled=${this.disabled}
              fill="outline"
              shape="pill"
              size="lg"
              variant="primary"
              @click=${this.#onCancel}
            >
              <sl-icon name="arrow-left"></sl-icon>
              Go back
            </sl-button>
          </slot>
        </div>

        <div class="sign-in">
          <span>Already have an account?</span>
          <sl-button
            ?disabled=${this.disabled}
            fill="link"
            shape="pill"
            variant="primary"
            @click=${this.#onSignIn}
          >
            Sign in
          </sl-button>
        </div>
      </sl-form>
    `;
  }

  /**
   * Toggles the sibling `<sl-checkbox>` when its consent text is clicked, restoring the
   * click-to-toggle behavior lost by moving the rich text out of the checkbox's default slot —
   * unless the click originated on the embedded link, which must navigate instead.
   */
  static #onConsentLabelClick(e: Event): void {
    if ((e.target as Element).closest('a')) {
      return;
    }

    ((e.currentTarget as HTMLElement).previousElementSibling as HTMLElement | null)?.click();
  }

  #onCancel(): void {
    if (this.disabled) {
      return;
    }

    this.cancelEvent.emit();
  }

  #onSignIn(): void {
    if (this.disabled) {
      return;
    }

    this.signInEvent.emit();
  }

  #onSubmit(): void {
    if (this.disabled) {
      return;
    }

    this.submitEvent.emit(this.#form.value ?? {});
  }
}

// This child is used only inside the account-creation page's scoped registry — it must NOT
// register itself globally (no `customElements.define` here).
