import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Avatar } from '@sl-design-system/avatar';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './app-bar.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-a10-app-bar': A10AppBar;
  }

  interface GlobalEventHandlersEventMap {
    'sl-a10-project-switch': SlA10ProjectSwitchEvent;
    'sl-a10-user-menu': SlA10UserMenuEvent;
  }
}

/** The signed-in user shown in the app bar's avatar. */
export interface AppBarUser {
  initials: string;
  name: string;
}

/** The slice of the page's domain model this bar renders. Owned and passed in by the root. */
export interface AppBarModel {
  productName: string;
  user: AppBarUser;
}

/** Emitted when the user activates the project switcher. */
export type SlA10ProjectSwitchEvent = CustomEvent<void>;

/** Emitted when the user activates the account control. */
export type SlA10UserMenuEvent = CustomEvent<void>;

/**
 * Structural/presentation config, not model data: the accessible names of the two chrome
 * controls. i18n is OFF for this run, so they are rendered directly.
 */
const PROJECT_SWITCH_LABEL = 'Switch project',
  USER_MENU_LABEL = 'Account menu';

/**
 * The Editorial Suite dark product chrome: the brand wordmark at the inline start, a project
 * switcher and the signed-in user's avatar at the inline end (Figma `17264:29099`, 1440 × 50).
 *
 * Purely presentational — it renders the `model` the page root gives it and emits the two
 * intent events; the root owns the data and decides what the intents do. The host app owns the
 * page-level `banner`/`navigation` landmarks, so this renders a neutral `<div>`.
 *
 * Scoped child of the page root: it deliberately does **not** register a custom element of its
 * own — the root declares it in `scopedElements`.
 *
 * ```html
 * <sl-a10-app-bar .model=${model}></sl-a10-app-bar>
 * ```
 *
 * @fires sl-a10-project-switch - Emitted when the project switcher is activated.
 * @fires sl-a10-user-menu - Emitted when the account control is activated.
 */
export class A10AppBar extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-avatar': Avatar,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal Emits when the project switcher is activated. */
  @event({ name: 'sl-a10-project-switch' })
  projectSwitchEvent!: EventEmitter<SlA10ProjectSwitchEvent>;

  /** @internal Emits when the account control is activated. */
  @event({ name: 'sl-a10-user-menu' }) userMenuEvent!: EventEmitter<SlA10UserMenuEvent>;

  /** The product name and signed-in user this bar renders. */
  @property({ attribute: false }) model!: AppBarModel;

  override render(): TemplateResult {
    // The contract types `model` as required and the root always sets it; the empty fallback
    // only keeps an unset model from throwing inside `render`, which would blank the whole page.
    const { productName, user } = this.model ?? {
      productName: '',
      user: { initials: '', name: '' }
    };

    return html`
      <div class="bar">
        <div class="brand">
          <!--
            DISCREPANCY (recorded for Stage 4): the design's brand mark is a 155 × 20 raster
            ("Editorial Suite", Figma node I17264:29099;1481:4109) served from a signed Figma CDN
            URL. This pipeline has no asset-export step and the harness serves /assets from an
            empty, shared directory, so an <img src="/assets/..."> would be a guaranteed 404.
            The same string is rendered as text in the brand face instead, inside a box pinned to
            the raster's exact 155 × 20 footprint so nothing downstream shifts. The letterforms
            therefore differ from the Figma raster (the raster sets "Editorial" bold and "Suite"
            light, and its E is a custom glyph); only the footprint is faithful.
          -->
          <span class="wordmark">${productName}</span>
        </div>
        <div class="bar-end">
          <button
            @click=${this.#onProjectSwitchClick}
            aria-label=${PROJECT_SWITCH_LABEL}
            class="switcher"
            type="button">
            <!--
              DISCREPANCY (recorded for Stage 4): the design's leading glyph here is
              "book-circle-arrow-up" (FA6 Pro Solid, 20px), which is NOT one of the 54 icons
              the editorial-suite theme's icons.ts registers. Per the run's policy it is omitted rather
              than substituted or hand-drawn, and its empty 20 × 20 box is kept so the control's
              footprint — and everything inline-end of it — does not shift.
            -->
            <span aria-hidden="true" class="switcher-glyph"></span>
            <sl-icon aria-hidden="true" name="chevron-down"></sl-icon>
          </button>
          <button
            @click=${this.#onUserMenuClick}
            aria-label=${USER_MENU_LABEL}
            class="account"
            type="button">
            <!--
              image-only suppresses the avatar's name line, which the design does not show; the
              initials still render. display-name carries the user's name for the avatar's own
              alt/tooltip paths, while the button's aria-label is what a screen reader
              announces for the control.
            -->
            <sl-avatar
              display-initials=${user.initials}
              display-name=${user.name}
              image-only
              size="md"></sl-avatar>
          </button>
        </div>
      </div>
    `;
  }

  #onProjectSwitchClick(): void {
    this.projectSwitchEvent.emit();
  }

  #onUserMenuClick(): void {
    this.userMenuEvent.emit();
  }
}
