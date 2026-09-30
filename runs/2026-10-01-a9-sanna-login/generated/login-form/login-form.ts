import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Form, FormController, FormField } from '@sl-design-system/form';
import { Option } from '@sl-design-system/listbox';
import { Select } from '@sl-design-system/select';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import {
  type CSSResultGroup,
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html
} from 'lit';
import { property } from 'lit/decorators.js';
import styles from './login-form.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-login-form': LoginForm;
  }

  interface GlobalEventHandlersEventMap {
    'sl-login-form-location-change': SlLoginFormLocationChangeEvent;
    'sl-login-form-submit': SlLoginFormSubmitEvent;
  }
}

/** A single selectable location. */
export interface LocationOption {
  id: string;
  name: string;
}

/** The data this component renders: the available locations and the current selection. */
export interface LoginFormModel {
  locations: LocationOption[];
  selectedLocationId: string | null;
}

/** The detail of the `sl-login-form-submit` event. */
export interface LoginFormSubmitDetail {
  locationId: string;
}

export type SlLoginFormLocationChangeEvent = CustomEvent<{ locationId: string }>;

export type SlLoginFormSubmitEvent = CustomEvent<LoginFormSubmitDetail>;

/** The shape of the single form control this component manages. */
interface LoginFormValue {
  location?: string;
}

/** Structural constant: the name of the location select's form control. */
const LOCATION_FIELD_NAME = 'location';

/** Structural constant: the location select's placeholder text. */
const LOCATION_PLACEHOLDER = 'Select your location';

/**
 * A presentational login form: it renders a heading, subheading, a location select and a primary
 * "Sign in" action, and emits when the location changes or the form is submitted.
 *
 * ```html
 * <sl-login-form .model=${model}></sl-login-form>
 * ```
 *
 * @slot heading - The page's main heading. Defaults to the design's headline.
 * @slot subheading - The supporting text below the heading. Defaults to the design's subhead.
 * @slot actions - The form's primary action. Defaults to the "Sign in" button.
 * @fires sl-login-form-location-change - Emitted when the selected location changes.
 * @fires sl-login-form-submit - Emitted with the selected location once the form reports valid.
 */
export class LoginForm extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-form': Form,
      'sl-form-field': FormField,
      'sl-option': Option,
      'sl-select': Select
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Controller for managing the (single-field) form state. */
  #form = new FormController<LoginFormValue>(this);

  /**
   * Whether the form is disabled.
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** The locations to show, and the currently selected one. */
  @property({ attribute: false }) model!: LoginFormModel;

  /** Emits when the user changes the selected location. */
  @event({ name: 'sl-login-form-location-change' })
  locationChangeEvent!: EventEmitter<SlLoginFormLocationChangeEvent>;

  /** Emits once the form reports valid, with the selected location. */
  @event({ name: 'sl-login-form-submit' }) submitEvent!: EventEmitter<SlLoginFormSubmitEvent>;

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('model')) {
      this.#form.value = { location: this.model?.selectedLocationId ?? undefined };
    }
  }

  override render(): TemplateResult {
    const locations = this.model?.locations ?? [];

    return html`
      <div class="heading-group">
        <slot name="heading">
          <h1>Welcome to AI Teacher Assistant</h1>
        </slot>
        <slot name="subheading">
          <p>Let's get you to the right place. Select your country level to continue</p>
        </slot>
      </div>
      <sl-form ?disabled=${this.disabled} @sl-submit=${this.#onSubmit}>
        <sl-form-field label="Select location">
          <sl-select
            name=${LOCATION_FIELD_NAME}
            placeholder=${LOCATION_PLACEHOLDER}
            required
            @sl-change=${this.#onLocationChange}
          >
            ${locations.map(
              location => html`<sl-option value=${location.id}>${location.name}</sl-option>`
            )}
          </sl-select>
        </sl-form-field>
        <slot name="actions">
          <sl-button shape="pill" type="submit" variant="primary">Sign in</sl-button>
        </slot>
      </sl-form>
    `;
  }

  #onLocationChange(e: SlChangeEvent<string | undefined>): void {
    this.locationChangeEvent.emit({ locationId: e.detail ?? '' });
  }

  #onSubmit(): void {
    const locationId = this.#form.value?.location;

    if (locationId) {
      this.submitEvent.emit({ locationId });
    }
  }
}

// This is the top-level element for this example, so - unlike its scoped children above - it
// registers itself globally, guarded so re-importing this module doesn't throw.
if (!customElements.get('sl-login-form')) {
  customElements.define('sl-login-form', LoginForm);
}
