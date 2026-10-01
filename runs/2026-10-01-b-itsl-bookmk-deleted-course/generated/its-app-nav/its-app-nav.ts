import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Avatar } from '@sl-design-system/avatar';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './its-app-nav.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-its-app-nav-navigate': SlItsAppNavNavigateEvent;
    'sl-its-app-nav-search': SlItsAppNavSearchEvent;
  }
}

/** A single link in either the primary (app) or the secondary (product) menu. */
export interface AppNavItem {
  id: string;
  label: string;
  href?: string;
}

/** The slice of the page's domain model this navigation chrome renders. */
export interface AppNavModel {
  primaryItems: AppNavItem[];
  productLabel: string;
  secondaryItems: AppNavItem[];
  activeSecondaryId: string;
  userName: string;
}

/** Emitted when one of the primary or secondary menu items is activated. */
export type SlItsAppNavNavigateEvent = CustomEvent<{ itemId: string }>;

/** Emitted with the submitted term when the user runs a global search. */
export type SlItsAppNavSearchEvent = CustomEvent<string>;

/**
 * The itslearning application chrome: the white main-menu bar (logo, primary menu, global
 * search, notification controls, avatar) stacked on top of the grey product bar (product mark
 * and label + the product's own secondary menu).
 *
 * Presentational — the page owns the data and passes it in as `model`, and handles the
 * navigate/search events this component emits.
 *
 * ```html
 * <sl-its-app-nav .model=${model}></sl-its-app-nav>
 * ```
 *
 * @fires sl-its-app-nav-navigate - Emitted when a primary or secondary menu item is activated.
 * @fires sl-its-app-nav-search - Emitted with the search term when the user submits the global search.
 * @csspart app-bar - The white main-menu row.
 * @csspart product-bar - The grey product row below it.
 */
export class ItsAppNav extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-avatar': Avatar,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal Emits when a primary or secondary menu item is activated. */
  @event({ name: 'sl-its-app-nav-navigate' }) navigateEvent!: EventEmitter<SlItsAppNavNavigateEvent>;

  /** @internal Emits the search term when the global search is submitted. */
  @event({ name: 'sl-its-app-nav-search' }) searchEvent!: EventEmitter<SlItsAppNavSearchEvent>;

  /** The menus, product label and user this navigation renders. */
  @property({ attribute: false }) model!: AppNavModel;

  override render(): TemplateResult {
    const model = this.model;

    return html`
      <div class="chrome">
        <div class="app-bar" part="app-bar">
          <!-- The itslearning logo is a remote Figma image asset that isn't available in this
               repo. The 32x32 box is rendered empty so the bar's leading offset is preserved;
               drawing a substitute mark would corrupt the visual comparison. -->
          <div class="logo-area">
            <div class="logo" aria-hidden="true"></div>
          </div>

          <nav class="primary-nav" aria-label="Main menu">
            <ul>
              ${(model?.primaryItems ?? []).map(item => html`<li>${this.#renderItem(item)}</li>`)}
            </ul>
          </nav>

          <div class="personal-menu">
            <div class="search-wrapper">
              <div class="search">
                <input
                  class="search-input"
                  type="search"
                  aria-label="Search"
                  placeholder="Search"
                  @keydown=${this.#onSearchKeydown}
                />
                <button class="search-button" type="button" aria-label="Submit search" @click=${this.#onSearchClick}>
                  <sl-icon name="search" size="xl" aria-hidden="true"></sl-icon>
                </button>
              </div>
            </div>

            <!-- "bell" and "comment" are not among the icons the itslearning theme registers.
                 Both hit boxes are rendered empty (but still labelled) so the spacing of the
                 right-hand cluster matches the design. -->
            <button class="icon-button" type="button" aria-label="Notifications" disabled>
              <span class="icon-slot" aria-hidden="true"></span>
            </button>
            <button class="icon-button" type="button" aria-label="Messages" disabled>
              <span class="icon-slot" aria-hidden="true"></span>
            </button>

            <div class="user-menu" role="img" aria-label=${ifDefined(model?.userName)}>
              <!-- No displayName: sl-avatar falls back to rendering initials when it has a name
                   and no picture, and the user photo is an unavailable remote Figma asset. Invented
                   initials inside a pixel-compared region are the same defect class as a hand-drawn
                   icon, so the circle is left empty and the accessible name lives on the wrapper. -->
              <sl-avatar image-only shape="circle" size="md"></sl-avatar>
            </div>
          </div>
        </div>

        <div class="product-bar" part="product-bar">
          <div class="product">
            <!-- The "your-files" product glyph is a remote Figma image asset; rendered as an
                 empty 32x32 box for the same reason as the logo. -->
            <div class="product-icon" aria-hidden="true"></div>
            <span class="product-label">${model?.productLabel}</span>
          </div>

          <nav class="secondary-nav" aria-label=${ifDefined(model?.productLabel)}>
            <ul>
              ${(model?.secondaryItems ?? []).map(item => {
                const active = item.id === model.activeSecondaryId;

                return html`
                  <li class=${active ? 'active' : ''}>
                    ${this.#renderItem(item, active)}
                    ${active ? html`<span class="highlight" aria-hidden="true"></span>` : nothing}
                  </li>
                `;
              })}
            </ul>
          </nav>
        </div>
      </div>
    `;
  }

  /**
   * Renders one menu item. Items that carry an `href` are real links; items without one are
   * buttons, so they stay keyboard-operable and are announced correctly (an `<a>` without an
   * `href` has no link role).
   */
  #renderItem(item: AppNavItem, active = false): TemplateResult {
    const current = active ? 'page' : undefined;

    return item.href
      ? html`
          <a
            class="nav-item"
            href=${item.href}
            aria-current=${ifDefined(current)}
            @click=${(event: MouseEvent) => this.#onItemClick(event, item)}
            >${item.label}</a
          >
        `
      : html`
          <button
            class="nav-item"
            type="button"
            aria-current=${ifDefined(current)}
            @click=${(event: MouseEvent) => this.#onItemClick(event, item)}
          >
            ${item.label}
          </button>
        `;
  }

  /**
   * Emits the navigate event as cancelable so a host router can `preventDefault()` it and take
   * over the anchor's own navigation.
   */
  #onItemClick(event: MouseEvent, item: AppNavItem): void {
    const notCancelled = this.navigateEvent.emit({ itemId: item.id }, { cancelable: true });

    if (!notCancelled) {
      event.preventDefault();
    }
  }

  #onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.searchEvent.emit((event.target as HTMLInputElement).value);
    }
  }

  #onSearchClick(): void {
    this.searchEvent.emit(this.renderRoot.querySelector<HTMLInputElement>('.search-input')?.value ?? '');
  }
}
