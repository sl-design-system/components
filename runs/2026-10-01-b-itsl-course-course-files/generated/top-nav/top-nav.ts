import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Avatar } from '@sl-design-system/avatar';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './top-nav.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-itsl-course-top-nav': TopNav;
  }

  interface GlobalEventHandlersEventMap {
    'sl-itsl-course-nav-select': SlItslNavSelectEvent;
  }
}

/** One item in the main-menu link list. */
export interface TopNavItem {
  id: string;
  label: string;
}

/** One tab in the secondary-menu tab list. */
export interface TopNavTab {
  id: string;
  label: string;
}

/** The signed-in user shown in the avatar control. */
export interface TopNavUser {
  name: string;
  initials?: string;
}

/**
 * The data this component renders; owned and passed in by the page. Presentational - this
 * component fetches nothing and renders exactly what it's given.
 */
export interface TopNavModel {
  items: TopNavItem[];
  activeItemId?: string;
  sectionLabel: string;
  tabs: TopNavTab[];
  activeTabId?: string;
  searchPlaceholder: string;
  user: TopNavUser;
}

/** The id of the main-menu item or secondary-menu tab that was activated. */
export type SlItslNavSelectEvent = CustomEvent<string>;

/**
 * The itslearning product shell's two-tier top navigation: a main menu (brand mark, primary
 * links, search, avatar) and a secondary menu (section label, tabs). Presentational - the page
 * passes in its `model` and handles the emitted selection event.
 *
 * ```html
 * <sl-itsl-course-top-nav .model=${model}></sl-itsl-course-top-nav>
 * ```
 *
 * @fires sl-itsl-course-nav-select - Emitted with the id of the main-menu item or tab that was activated.
 */
export class TopNav extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-avatar': Avatar,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal Emits with the id of the main-menu item or tab that was activated. */
  @event({ name: 'sl-itsl-course-nav-select' }) navSelectEvent!: EventEmitter<SlItslNavSelectEvent>;

  /** The data this component renders. */
  @property({ attribute: false }) model?: TopNavModel;

  override render(): TemplateResult {
    const model = this.model;

    if (!model) {
      return html``;
    }

    return html`
      <nav aria-label="Main" class="tier main-menu">
        <div class="start">
          <!--
            The design's logo mark ("itslearning-logo-symbol") is a brand asset with no theme
            icon and no asset-export step, and its fill (#f47920) has no exact token in this
            theme - the nearest palette step is used as an approximation. See implementation
            report.
          -->
          <span aria-hidden="true" class="logo"></span>
          <ul class="items">
            ${model.items.map(item => {
              const active = item.id === model.activeItemId;

              return html`
                <li>
                  <button
                    aria-current=${ifDefined(active ? 'page' : undefined)}
                    class=${classMap({ active })}
                    type="button"
                    @click=${() => this.#onSelect(item.id)}
                  >
                    ${item.label}
                  </button>
                </li>
              `;
            })}
          </ul>
        </div>
        <div class="end">
          <div class="search">
            <input
              aria-label=${model.searchPlaceholder}
              class="search-input"
              placeholder=${model.searchPlaceholder}
              type="search"
            />
            <button aria-label=${model.searchPlaceholder} class="search-button" type="button">
              <sl-icon aria-hidden="true" name="search"></sl-icon>
            </button>
          </div>
          <!-- "bell" is not a registered icon in this theme; omitted, the slot's footprint is
               kept so the search field and avatar don't shift left. See implementation report. -->
          <span aria-hidden="true" class="icon-slot"></span>
          <!-- "comment" is not a registered icon in this theme; same treatment as above. -->
          <span aria-hidden="true" class="icon-slot"></span>
          <span aria-label=${model.user.name} class="user" role="img">
            <sl-avatar
              aria-hidden="true"
              display-initials=${ifDefined(model.user.initials)}
              display-name=${model.user.name}
              image-only
              size="sm"
            ></sl-avatar>
          </span>
        </div>
      </nav>
      <nav aria-label="Section" class="tier secondary-menu">
        <div class="section">
          <!-- "your-files" is not a registered icon in this theme (brand mark); omitted, the
               32px footprint is kept for the design's row rhythm. See implementation report. -->
          <span aria-hidden="true" class="section-icon"></span>
          <span class="section-label">${model.sectionLabel}</span>
        </div>
        <ul class="tabs">
          ${model.tabs.map(tab => {
            const active = tab.id === model.activeTabId;

            return html`
              <li>
                <button
                  aria-current=${ifDefined(active ? 'page' : undefined)}
                  class=${classMap({ active })}
                  type="button"
                  @click=${() => this.#onSelect(tab.id)}
                >
                  ${tab.label}
                </button>
              </li>
            `;
          })}
        </ul>
      </nav>
    `;
  }

  #onSelect(id: string): void {
    this.navSelectEvent.emit(id);
  }
}

if (!customElements.get('sl-itsl-course-top-nav')) {
  customElements.define('sl-itsl-course-top-nav', TopNav);
}
