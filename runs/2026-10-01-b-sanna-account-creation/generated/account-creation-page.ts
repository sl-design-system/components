import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
// Value import (not `type`-only): this module's side effect must run so that
// `AccountCreationForm` is a usable class for the `scopedElements` map below, and so the child is
// available wherever this page module is imported. The child itself does not self-register; it
// only becomes a defined custom element inside this page's scoped shadow root (see rule 2).
import {
  AccountCreationForm,
  type AccountCreationFormValue,
  type SlAccountCreationFormSubmitEvent
} from './account-creation-form/account-creation-form.js';
import styles from './account-creation-page.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-account-creation-page': AccountCreationPage;
  }

  interface GlobalEventHandlersEventMap {
    'sl-account-creation-page-submit': SlAccountCreationPageSubmitEvent;
    'sl-account-creation-page-cancel': SlAccountCreationPageCancelEvent;
    'sl-account-creation-page-sign-in': SlAccountCreationPageSignInEvent;
    'sl-account-creation-page-legal-link': SlAccountCreationPageLegalLinkEvent;
  }
}

/** The identifiers for the footer's legal links, in design order. */
export type LegalLinkId =
  | 'privacy-notice'
  | 'cookie-notice'
  | 'terms-of-user'
  | 'ai-transparency-statement';

export type SlAccountCreationPageSubmitEvent = CustomEvent<AccountCreationFormValue>;

export type SlAccountCreationPageCancelEvent = CustomEvent<void>;

export type SlAccountCreationPageSignInEvent = CustomEvent<void>;

export type SlAccountCreationPageLegalLinkEvent = CustomEvent<{ id: LegalLinkId }>;

/** A single footer legal link. Structural, presentational content — not part of the data model. */
interface LegalLinkItem {
  id: LegalLinkId;
  label: string;
}

/**
 * Structural constant: the footer's legal links, in design order. Fixed presentational content
 * owned by this component, not data the consumer supplies.
 *
 * "Terms of User" (not "Terms of Use") is the design's own wording, reproduced verbatim here —
 * see the manifest's "Design defect observed in the reference" / open question #6. Do not "fix"
 * this typo; it is a recorded default, not an oversight.
 */
const LEGAL_LINKS: LegalLinkItem[] = [
  { id: 'privacy-notice', label: 'Privacy Notice' },
  { id: 'cookie-notice', label: 'Cookie Notice' },
  { id: 'terms-of-user', label: 'Terms of User' },
  { id: 'ai-transparency-statement', label: 'AI Transparency Statement' }
];

/**
 * The root page for account creation: it owns the form's data, renders the page chrome (wordmark,
 * decorative photo, legal footer), hands the `<sl-account-creation-form>` its value, and re-emits
 * the form's submit/cancel/sign-in events at the page level.
 *
 * ```html
 * <sl-account-creation-page></sl-account-creation-page>
 * ```
 *
 * @slot logo - The wordmark shown top-left. Defaults to the design's wordmark image.
 * @slot media - The decorative photo in the right-hand column. Defaults to the design's photo.
 * @slot heading - Forwarded to the `<sl-account-creation-form>`'s `heading` slot.
 * @slot footer - Extra consumer content rendered after the legal links in the footer.
 * @fires sl-account-creation-page-submit - Emitted with the form's value once it reports valid.
 * @fires sl-account-creation-page-cancel - Emitted when "Go back" is clicked.
 * @fires sl-account-creation-page-sign-in - Emitted when "Sign in" is clicked.
 * @fires sl-account-creation-page-legal-link - Emitted with the clicked link's id; the host routes.
 */
export class AccountCreationPage extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-account-creation-form': AccountCreationForm,
      'sl-button': Button
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /**
   * The endpoint to fetch a prefilled value from (e.g. an invited user's known name/email).
   *
   * @default '/api/signup/prefill'
   */
  @property({ attribute: 'prefill-endpoint' }) prefillEndpoint = '/api/signup/prefill';

  /** Whether the page is loading; forwarded to the account creation form as `disabled`. */
  @property({ type: Boolean, reflect: true }) loading = false;

  /**
   * The data this page owns and hands to the form. Empty strings for the name/email fields and
   * all three consents checked, matching the design's screenshot (empty fields with their
   * placeholders visible; prefilling would hide them and break the pixel comparison).
   *
   * @default { firstName: '', lastName: '', email: '', acceptTerms: true, acceptPrivacy: true, acceptCookies: true }
   */
  @property({ attribute: false }) value: AccountCreationFormValue = this.#getPrefill();

  /** Emits with the form's value once the account creation form reports it is valid. */
  @event({ name: 'sl-account-creation-page-submit' })
  submitEvent!: EventEmitter<SlAccountCreationPageSubmitEvent>;

  /** Emits when the user clicks "Go back". The host is responsible for the actual navigation. */
  @event({ name: 'sl-account-creation-page-cancel' })
  cancelEvent!: EventEmitter<SlAccountCreationPageCancelEvent>;

  /** Emits when the user clicks "Sign in". The host is responsible for the actual navigation. */
  @event({ name: 'sl-account-creation-page-sign-in' })
  signInEvent!: EventEmitter<SlAccountCreationPageSignInEvent>;

  /** Emits with the clicked legal link's id. The host is responsible for the actual navigation. */
  @event({ name: 'sl-account-creation-page-legal-link' })
  legalLinkEvent!: EventEmitter<SlAccountCreationPageLegalLinkEvent>;

  override render(): TemplateResult {
    return html`
      <div class="logo">
        <slot name="logo">
          <img alt="sanna" src="./assets/wordmark.svg" />
        </slot>
      </div>

      <div class="form">
        <sl-account-creation-form
          ?disabled=${this.loading}
          .value=${this.value}
          @sl-account-creation-form-cancel=${this.#onCancel}
          @sl-account-creation-form-sign-in=${this.#onSignIn}
          @sl-account-creation-form-submit=${this.#onSubmit}
        >
          <slot name="heading" slot="heading">
            <h1>Create an account</h1>
          </slot>
        </sl-account-creation-form>
      </div>

      <div aria-hidden="true" class="media">
        <slot name="media">
          <img alt="" aria-hidden="true" src="./assets/hero.jpg" />
        </slot>
      </div>

      <footer>
        <nav aria-label="Legal">
          <ul>
            ${LEGAL_LINKS.map(
              link => html`
                <li>
                  <sl-button
                    fill="link"
                    shape="pill"
                    size="sm"
                    variant="primary"
                    @click=${() => this.#onLegalLink(link.id)}
                  >
                    ${link.label}
                  </sl-button>
                </li>
              `
            )}
          </ul>
        </nav>
        <slot name="footer"></slot>
      </footer>
    `;
  }

  #getPrefill(): AccountCreationFormValue {
    // fetch goes here: `GET ${this.prefillEndpoint}` would return a known user's prefilled
    // name/email, if any. The design's screenshot shows empty fields with their placeholders
    // visible, so the default below is empty strings, not a fetched value.
    return {
      firstName: '',
      lastName: '',
      email: '',
      acceptTerms: true,
      acceptPrivacy: true,
      acceptCookies: true
    };
  }

  #onCancel(): void {
    this.cancelEvent.emit();
  }

  #onSignIn(): void {
    this.signInEvent.emit();
  }

  #onSubmit(e: SlAccountCreationFormSubmitEvent): void {
    this.submitEvent.emit(e.detail);
  }

  #onLegalLink(id: LegalLinkId): void {
    this.legalLinkEvent.emit({ id });
  }
}

// This is the top-level element for this example, so - unlike its scoped child above - it
// registers itself globally, guarded so re-importing this module doesn't throw.
if (!customElements.get('sl-account-creation-page')) {
  customElements.define('sl-account-creation-page', AccountCreationPage);
}
