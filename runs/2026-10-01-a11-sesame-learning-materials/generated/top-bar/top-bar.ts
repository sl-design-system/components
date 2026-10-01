import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Avatar } from '@sl-design-system/avatar';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { type TopBarModel } from '../types.js';
import styles from './top-bar.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-sesame-menu-toggle': SlSesameMenuToggleEvent;
    'sl-sesame-profile-select': SlSesameProfileSelectEvent;
    'sl-sesame-school-switch': SlSesameSchoolSwitchEvent;
  }
}

/** Emitted when the school switcher is activated. The detail is the selected school's id. */
export type SlSesameSchoolSwitchEvent = CustomEvent<string>;

/** Emitted when the hamburger menu is toggled. The detail is the new open state. */
export type SlSesameMenuToggleEvent = CustomEvent<boolean>;

/** Emitted when the profile/avatar button is activated. */
export type SlSesameProfileSelectEvent = CustomEvent<void>;

/**
 * The top bar of the "My Sesame" learning-materials page: the brand wordmark, the signed-in
 * user's avatar, a hamburger menu toggle, and (on the row below) the active-school switcher.
 *
 * Presentational — it renders the `model` the page gives it and emits when the avatar, the
 * hamburger, or the school switcher is activated; it owns no data and opens no menu itself.
 *
 * Scoped child of the page root: it does not register a custom element of its own.
 *
 * ```html
 * <sl-sesame-top-bar .model=${model}></sl-sesame-top-bar>
 * ```
 *
 * @fires sl-sesame-school-switch - Emitted with the school id when the school switcher is activated.
 * @fires sl-sesame-menu-toggle - Emitted with the new open state when the hamburger menu is toggled.
 * @fires sl-sesame-profile-select - Emitted when the avatar/profile button is activated.
 */
export class SesameTopBar extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-avatar': Avatar,
      'sl-button': Button,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The brand, the active school, and the signed-in user. */
  @property({ attribute: false }) model?: TopBarModel;

  /**
   * Whether the hamburger menu is open.
   *
   * @default false
   */
  @property({ type: Boolean, reflect: true, attribute: 'menu-open' }) menuOpen = false;

  /** @internal Emitted with the school id when the school switcher is activated. */
  @event({ name: 'sl-sesame-school-switch' })
  schoolSwitchEvent!: EventEmitter<SlSesameSchoolSwitchEvent>;

  /** @internal Emitted with the new open state when the hamburger menu is toggled. */
  @event({ name: 'sl-sesame-menu-toggle' }) menuToggleEvent!: EventEmitter<SlSesameMenuToggleEvent>;

  /** @internal Emitted when the avatar/profile button is activated. */
  @event({ name: 'sl-sesame-profile-select' })
  profileSelectEvent!: EventEmitter<SlSesameProfileSelectEvent>;

  override render(): TemplateResult {
    const model = this.model;

    if (!model) {
      return html``;
    }

    return html`
      <div class="bar">
        <div class="row row-brand">
          ${model.brandLogoUrl
            ? html`<img alt=${model.brandName} class="wordmark-logo" src=${model.brandLogoUrl} />`
            : html`<span class="wordmark">${model.brandName}</span>`}

          <div class="actions">
            <button @click=${this.#onProfileClick} aria-label="Open account menu" class="profile" type="button">
              <sl-avatar
                .displayName=${model.user.displayName}
                .pictureUrl=${model.user.pictureUrl}
                image-only></sl-avatar>
            </button>
            <sl-button
              @click=${this.#onMenuToggleClick}
              aria-expanded=${this.menuOpen}
              aria-label="Open menu"
              fill="link">
              <sl-icon aria-hidden="true" name="menu"></sl-icon>
            </sl-button>
          </div>
        </div>

        <div class="row row-school">
          <!--
            Spec asked for <sl-menu-button> with a "chevron-down" icon in its button slot, but
            MenuButton hardcodes its own toggle icon (name="angle-down", no csspart exposed on
            it) whenever the button slot holds more than one element (our label span + our
            chevron-down icon) — there is no way to suppress or retarget that internal icon via
            CSS, so using it as specified would render two chevrons. Falling back to a plain
            button per the spec's own escape hatch; see the report.
          -->
          <!--
            No aria-haspopup/aria-expanded here on purpose. This component renders no menu of its
            own — it emits sl-sesame-school-switch and the host application owns the school
            picker. Advertising a disclosure whose expanded state is a hardcoded literal (it can
            never change, because nothing in this component opens) would misreport the control to
            assistive technology, which is worse than describing it as the plain button it is.
          -->
          <button @click=${this.#onSchoolSwitchClick} class="school-switch" type="button">
            <span class="school-name">${model.schoolName}</span>
            <sl-icon aria-hidden="true" name="chevron-down"></sl-icon>
          </button>
        </div>
      </div>
    `;
  }

  #onProfileClick(): void {
    this.profileSelectEvent.emit();
  }

  #onMenuToggleClick(): void {
    this.menuOpen = !this.menuOpen;

    this.menuToggleEvent.emit(this.menuOpen);
  }

  #onSchoolSwitchClick(): void {
    if (this.model) {
      this.schoolSwitchEvent.emit(this.model.schoolId);
    }
  }
}
