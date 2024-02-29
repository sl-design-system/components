import { faChevronRight, faEllipsis, faHouse } from '@fortawesome/pro-regular-svg-icons';
import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { MenuButton, MenuItem } from '@sl-design-system/menu';
import { Icon } from '@sl-design-system/icon';
import { Tooltip } from '@sl-design-system/tooltip';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './breadcrumbs.scss.js';

// Workaround for missing type in @open-wc/scoped-elements
declare global {
  interface ShadowRoot {
    createElement(tagName: string): HTMLElement;
  }
}

export interface Breadcrumb {
  element: HTMLElement;
  label: string;
  tooltip?: boolean | Tooltip;
  url?: string;
}

Icon.register(faChevronRight, faEllipsis, faHouse);

/**
 * If there are more than 3 items, hide all items except the last 3
 * items. Note that we cannot use CSS custom properties for styling,
 * so the value needs to be hardcoded there. It doesn't make sense
 * to not use a hardcoded value here.
 */
const COLLAPSE_THRESHOLD = 3;

/**
 * A component to display a breadcrumb trail.
 *
 * @slot default - The breadcrumbs to display.
 */
@localized()
export class Breadcrumbs extends ScopedElementsMixin(LitElement) {
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
      'sl-menu-item': MenuItem,
      'sl-tooltip': Tooltip
    };
  }

  /** @private */
  static override styles: CSSResultGroup = styles;

  /**
   * Observe changes in size, so we can check whether we need to show tooltips
   * for truncated links.
   */
  #observer = new ResizeObserver(() => this.#updateTooltips());

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

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('aria-label', msg('Breadcrumb trail'));
    this.setAttribute('role', 'navigation');

    this.#observer.observe(this);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.#observer.disconnect();
  }

  override render(): TemplateResult {
    return html`
      ${this.noHome
        ? nothing
        : html`
            <a href=${this.homeUrl}><sl-icon name="far-house"></sl-icon>${msg('Home')}</a>
            <sl-icon name="far-chevron-right"></sl-icon>
          `}
      ${this.breadcrumbs.length > COLLAPSE_THRESHOLD
        ? html`
            <sl-menu-button fill="link">
              <sl-icon name="far-ellipsis" slot="button"></sl-icon>
              ${this.breadcrumbs
                .slice(0, -COLLAPSE_THRESHOLD)
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
      .filter((element): element is HTMLElement => !(element instanceof Icon || element instanceof Tooltip))
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

  #updateTooltips(): void {
    this.breadcrumbs.forEach(breadcrumb => {
      const element = breadcrumb.element;

      if (!breadcrumb.tooltip && element.offsetWidth < element.scrollWidth) {
        breadcrumb.tooltip = true;

        Tooltip.lazy(
          element,
          tooltip => {
            breadcrumb.tooltip = tooltip;
            tooltip.position = 'bottom';
            tooltip.textContent = breadcrumb.label;
          },
          { context: this.shadowRoot!, parentNode: this.shadowRoot! }
        );
      } else if (breadcrumb.tooltip && element.offsetWidth >= element.scrollWidth) {
        breadcrumb.element.removeAttribute('aria-describedby');

        if (typeof breadcrumb.tooltip !== 'boolean') {
          breadcrumb.tooltip.remove();
          breadcrumb.tooltip = undefined;
        }
      }
    });
  }
}
