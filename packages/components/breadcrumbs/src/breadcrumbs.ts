import { faChevronRight, faHouse } from '@fortawesome/pro-regular-svg-icons';
import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
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

Icon.register(faChevronRight, faHouse);

export interface Breadcrumb {
  element: Element;
  label: string;
  url?: string;
}

@localized()
export class Breadcrumbs extends ScopedElementsMixin(LitElement) {
  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  }

  /** @private */
  static override styles: CSSResultGroup = styles;

  /** The slotted breadcrumbs. */
  @state() breadcrumbs: Breadcrumb[] = [];

  /** The url for the home link, defaults to the root url. */
  @property({ attribute: 'home-url' }) homeUrl = '/';

  /** When true doesn't show a home link as the first breadcrumb. */
  @property({ type: Boolean, attribute: 'no-home' }) noHome?: boolean;

  override render(): TemplateResult {
    return html`
      ${this.noHome
        ? nothing
        : html`
            <a href=${this.homeUrl}><sl-icon name="far-house"></sl-icon>${msg('Home')}</a>
            <sl-icon name="far-chevron-right"></sl-icon>
          `}
      <slot @slotchange=${this.#onSlotchange}></slot>
    `;
  }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    this.breadcrumbs = event.target
      .assignedElements({ flatten: true })
      .filter(element => !(element instanceof Icon))
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
