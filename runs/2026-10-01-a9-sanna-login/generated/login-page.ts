import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Link } from '@sl-design-system/link';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
// Importing this module registers `sl-login-form` globally (guarded) as a side effect; its own
// internal children (`sl-form`, `sl-select`, etc.) are registered in its own scoped registry.
import {
  type LocationOption,
  type LoginFormModel,
  type SlLoginFormLocationChangeEvent,
  type SlLoginFormSubmitEvent
} from './login-form/login-form.js';
import styles from './login-page.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-login-page': LoginPage;
  }

  interface GlobalEventHandlersEventMap {
    'sl-login-page-sign-in': SlLoginPageSignInEvent;
  }
}

/** The detail of the `sl-login-page-sign-in` event. */
export interface LoginPageSignInDetail {
  locationId: string;
}

export type SlLoginPageSignInEvent = CustomEvent<LoginPageSignInDetail>;

/** A single legal/footer link. Structural, presentational content — not part of the data model. */
interface LegalLinkItem {
  id: string;
  label: string;
  href: string;
}

/**
 * Structural constant: the footer's legal links, in design order. This is fixed presentational
 * content owned by this component, not data the consumer supplies.
 */
const LEGAL_LINKS: LegalLinkItem[] = [
  { id: 'privacy-notice', label: 'Privacy Notice', href: '#' },
  { id: 'terms-and-conditions', label: 'Terms and conditions', href: '#' },
  { id: 'other-link', label: 'Other link', href: '#' },
  { id: 'ai-transparency-statement', label: 'AI Transparency Statement', href: '#' }
];

/**
 * The root page for signing in: it owns the list of selectable locations and the current
 * selection, hands the `<sl-login-form>` its model, and re-emits once the form validates.
 *
 * ```html
 * <sl-login-page></sl-login-page>
 * ```
 *
 * @slot logo - The wordmark shown above the form. Defaults to the design's wordmark image.
 * @slot media - The decorative photo in the right-hand column. Defaults to the design's photo.
 * @slot heading - Forwarded to the `<sl-login-form>`'s `heading` slot.
 * @slot subheading - Forwarded to the `<sl-login-form>`'s `subheading` slot.
 * @slot footer - Extra consumer content rendered after the legal links in the footer.
 * @fires sl-login-page-sign-in - Emitted with the selected location once the login form validates.
 */
export class LoginPage extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-link': Link
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /**
   * The endpoint to fetch the selectable locations from.
   *
   * @default '/api/locations'
   */
  @property({ attribute: 'locations-endpoint' }) locationsEndpoint = '/api/locations';

  /**
   * Whether the page is loading; forwarded to the login form as `disabled`.
   */
  @property({ type: Boolean, reflect: true }) loading = false;

  /**
   * The id of the currently selected location, if any.
   *
   * @default null
   */
  @property({ attribute: 'selected-location-id', reflect: true }) selectedLocationId:
    | string
    | null = null;

  /** Emits with the selected location once the login form reports valid. */
  @event({ name: 'sl-login-page-sign-in' })
  signInEvent!: EventEmitter<SlLoginPageSignInEvent>;

  override render(): TemplateResult {
    const model: LoginFormModel = {
      locations: this.#getLocations(),
      selectedLocationId: this.selectedLocationId
    };

    return html`
      <div class="content">
        <div class="logo">
          <slot name="logo">
            <img alt="AI Teacher Assistant" src="./assets/wordmark.svg" />
          </slot>
        </div>

        <sl-login-form
          ?disabled=${this.loading}
          .model=${model}
          @sl-login-form-location-change=${this.#onLocationChange}
          @sl-login-form-submit=${this.#onSubmit}
        >
          <slot name="heading" slot="heading">
            <h1>Welcome to AI Teacher Assistant</h1>
          </slot>
          <slot name="subheading" slot="subheading">
            <p>Let's get you to the right place. Select your country level to continue</p>
          </slot>
        </sl-login-form>

        <footer>
          <nav aria-label="Legal">
            <ul>
              ${LEGAL_LINKS.map(
                link => html`
                  <li>
                    <sl-link fill="ghost" no-icon shape="pill" size="sm" variant="primary">
                      <a href=${link.href}>${link.label}</a>
                    </sl-link>
                  </li>
                `
              )}
            </ul>
          </nav>
          <slot name="footer"></slot>
        </footer>
      </div>

      <div aria-hidden="true" class="media">
        <slot name="media">
          <img alt="" aria-hidden="true" src="./assets/hero.jpg" />
        </slot>
      </div>
    `;
  }

  #getLocations(): LocationOption[] {
    // fetch goes here: `GET ${this.locationsEndpoint}` would return the available locations.
    return [
      { id: 'belgium', name: 'Belgium' },
      { id: 'netherlands', name: 'Netherlands' },
      { id: 'sweden', name: 'Sweden' },
      { id: 'finland', name: 'Finland' }
    ];
  }

  #onLocationChange(e: SlLoginFormLocationChangeEvent): void {
    this.selectedLocationId = e.detail.locationId || null;
  }

  #onSubmit(e: SlLoginFormSubmitEvent): void {
    this.signInEvent.emit({ locationId: e.detail.locationId });
  }
}

// This is the top-level element for this example, so - unlike its scoped children above - it
// registers itself globally, guarded so re-importing this module doesn't throw.
if (!customElements.get('sl-login-page')) {
  customElements.define('sl-login-page', LoginPage);
}
