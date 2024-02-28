import { faChevronRight, faEllipsis, faHouse } from '@fortawesome/pro-regular-svg-icons';
import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { MenuButton, MenuItem } from '@sl-design-system/menu';
import { Icon } from '@sl-design-system/icon';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './breadcrumbs.scss.js';

// Workaround for missing type in @open-wc/scoped-elements
declare global {
  interface ShadowRoot {
    createElement(tagName: string): HTMLElement;
  }
}

Icon.register(faChevronRight, faEllipsis, faHouse);

export interface Breadcrumb {
  element: HTMLElement;
  label: string;
  url?: string;
}

/**
 * A component to display a breadcrumb trail.
 *
 * @slot default - The breadcrumbs to display.
 */
@localized()
export class Breadcrumbs extends ScopedElementsMixin(LitElement) {
  /** The number of breadcrumbs to show before collapsing the rest. */
  static collapseThreshold = 3;

  /**
   * The url for the home link, defaults to the root url.
   *
   * By changing this static property you can change the default value for
   * all future instances of the component. Changing the static property
   * won't affect already created instances.
   */
  static homeUrl = '/';

  /**
   * When true doesn't show a home link as the first breadcrumb.
   *
   * By changing this static property you can change the default value for
   * all future instances of the component. Changing the static property
   * won't affect already created instances.
   */
  static noHome = false;

  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon,
      'sl-menu-button': MenuButton,
      'sl-menu-item': MenuItem
    };
  }

  /** @private */
  static override styles: CSSResultGroup = styles;

  /** The slotted breadcrumbs. */
  @state() breadcrumbs: Breadcrumb[] = [];

  /**
   * The url for the home link, defaults to the root url.
   *
   * If you want to change the default value for all future instances of the component,
   * you can change the static property. If you want to change the property of an already
   * created instance, you need to change this property.
   */
  @property({ attribute: 'home-url' }) homeUrl = Breadcrumbs.homeUrl;

  /**
   * When true doesn't show a home link as the first breadcrumb.
   *
   * If you want to change the default value for all future instances of the component,
   * you can change the static property. If you want to change the property of an already
   * created instance, you need to change this property.
   */
  @property({ type: Boolean, attribute: 'no-home' }) noHome = Breadcrumbs.noHome;

  override render(): TemplateResult {
    return html`
      ${this.noHome
        ? nothing
        : html`
            <a href=${this.homeUrl}><sl-icon name="far-house"></sl-icon>${msg('Home')}</a>
            <sl-icon name="far-chevron-right"></sl-icon>
          `}
      ${this.breadcrumbs.length > Breadcrumbs.collapseThreshold
        ? html`
            <sl-menu-button fill="link">
              <sl-icon name="far-ellipsis" slot="button"></sl-icon>
              ${this.breadcrumbs
                .slice(0, -Breadcrumbs.collapseThreshold)
                .map(
                  ({ element, label }) => html`<sl-menu-item @click=${() => element.click()}>${label}</sl-menu-item>`
                )}
            </sl-menu-button>
          `
        : nothing}
      <slot @slotchange=${this.#onSlotchange}></slot>
    `;
  }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    this.breadcrumbs = event.target
      .assignedElements({ flatten: true })
      .filter((element): element is HTMLElement => !(element instanceof Icon))
      .map(element => {
        return {
          element,
          label: element.textContent?.trim() || '',
          url: element.hasAttribute('href') ? element.getAttribute('href') ?? undefined : undefined
        };
      });

    this.breadcrumbs.forEach(({ element }, index) => {
      // Make sure we stop inserting separators when there is already one there
      // Otherwise we trigger an infinite loop with the slotchange event
      if (index === this.breadcrumbs.length - 1 || element.nextElementSibling instanceof Icon) {
        return;
      }

      const icon = this.shadowRoot!.createElement('sl-icon') as Icon;
      icon.name = 'far-chevron-right';

      element.after(icon);
    });
  }
}
