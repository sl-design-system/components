import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { Popover } from '@sl-design-system/popover';
import { Tooltip } from '@sl-design-system/tooltip';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { BreadcrumbItem } from './breadcrumb-item.js';
import styles from './breadcrumbs.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-breadcrumbs': Breadcrumbs;
  }

  interface ShadowRoot {
    // Workaround for missing type in @open-wc/scoped-elements
    createElement<K extends keyof HTMLElementTagNameMap>(
      tagName: K,
      options?: ElementCreationOptions
    ): HTMLElementTagNameMap[K];
  }
}

export interface Breadcrumb {
  collapsed?: boolean;
  label: string;
  tooltip?: Tooltip | (() => void);
  url?: string;
}

/**
 * If there are more than 3 items, hide all items except the last 3
 * items. Note that we cannot use CSS custom properties for styling,
 * so the value needs to be hardcoded there. It doesn't make sense
 * to not use a hardcoded value here.
 */
const COLLAPSE_THRESHOLD = 3;

// On mobile, only show the last 2 items.
const MOBILE_COLLAPSE_THRESHOLD = 2;

const isMobile = (): boolean => matchMedia('(width <= 600px)').matches;

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
   * By changing this static property you can change the default value for all future instances of the component.
   * Changing the static property won't affect already created instances.
   */
  static homeUrl = '/';

  /**
   * When true doesn't show a home link as the first breadcrumb.
   *
   * By changing this static property you can change the default value for all future instances of the component.
   * Changing the static property won't affect already created instances.
   */
  static noHome = false;

  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-breadcrumb-item': BreadcrumbItem,
      'sl-icon': Icon,
      'sl-popover': Popover,
      'sl-tooltip': Tooltip
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /**
   * Observe changes in size, so we can check whether we need to show tooltips
   * for truncated links.
   */
  #observer = new ResizeObserver(() => this.#update());

  /** @internal The slotted breadcrumbs. */
  @state() breadcrumbLinks: Breadcrumb[] = [];

  /** @internal The slotted breadcrumbs. */
  @state() breadcrumbItems: BreadcrumbItem[] = [];

  /** @internal The threshold for when breadcrumbs should be collapsed into a menu. */
  @state() collapseThreshold = COLLAPSE_THRESHOLD;

  /**
   * Set this to true to invert the color of the breadcrumbs. This should be used
   * when the breadcrumbs are displayed on a dark background.
   */
  @property({ type: Boolean, reflect: true }) inverted?: boolean;

  /**
   * The url for the home link, defaults to the root url.
   *
   * If you want to change the default value for all future instances of the component, you can change the static property.
   * If you want to change the property of an already created instance, you need to change this property.
   */
  @property({ attribute: 'home-url' }) homeUrl = Breadcrumbs.homeUrl;

  /**
   * When true doesn't show a home link as the first breadcrumb.
   *
   * If you want to change the default value for all future instances of the component, you can change the static property.
   * If you want to change the property of an already created instance, you need to change this property.
   */
  @property({ type: Boolean, attribute: 'no-home' }) noHome = Breadcrumbs.noHome;

  override connectedCallback(): void {
    super.connectedCallback();

    if (!this.hasAttribute('aria-label')) {
      this.setAttribute('aria-label', msg('Breadcrumb trail', { id: 'sl.breadcrumbs.breadcrumbTrail' }));
    }

    this.setAttribute('role', 'navigation');

    this.#observer.observe(this);
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();

    this.breadcrumbLinks.forEach(breadcrumb => {
      if (breadcrumb.tooltip instanceof Tooltip) {
        breadcrumb.tooltip.remove();
      } else if (breadcrumb.tooltip) {
        breadcrumb.tooltip();
      }
    });
    this.breadcrumbLinks = [];

    super.disconnectedCallback();
  }

  override render(): TemplateResult {
    return html`
      ${this.breadcrumbItems.length > 0
        ? html`
            ${this.noHome ? nothing : html`${this.#renderHomeLink()}<sl-icon name="breadcrumb-separator"></sl-icon>`}
            ${this.breadcrumbItems.length > this.collapseThreshold
              ? html`${this.#renderCollapsedMenu()}<sl-icon name="breadcrumb-separator"></sl-icon>`
              : nothing}
            ${Array.from(
              { length: this.collapseThreshold - 1 },
              (_, index) => html`<sl-icon name="breadcrumb-separator" style="order: ${(index + 1) * 2 - 1};"></sl-icon>`
            )}
          ` // and the slot at the end of the render method
        : html`
            <ul>
              ${this.noHome
                ? nothing
                : html`
                    <li class="home">${this.#renderHomeLink()}</li>
                    <sl-icon name="breadcrumb-separator"></sl-icon>
                  `}
              ${this.breadcrumbLinks.length > this.collapseThreshold
                ? html`
                    <li class="more-menu">${this.#renderCollapsedMenu()}</li>
                    <sl-icon name="breadcrumb-separator"></sl-icon>
                  `
                : nothing}
              ${this.breadcrumbLinks
                .filter(({ collapsed }) => !collapsed)
                .map(({ url, label }, index, array) =>
                  url
                    ? html`
                        <li>
                          <a aria-current=${ifDefined(index === array.length - 1 ? 'page' : undefined)} href=${url}>
                            ${label}
                          </a>
                        </li>
                        ${index < array.length - 1 ? html`<sl-icon name="breadcrumb-separator"></sl-icon>` : nothing}
                      `
                    : html`<li>${label}</li>`
                )}
            </ul>
          `}

      <slot @slotchange=${this.#onSlotchange} style=${this.breadcrumbItems.length === 0 ? 'display:none' : ''}></slot>
    `;
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('breadcrumbLinks') || changes.has('collapseThreshold')) {
      this.breadcrumbLinks = this.breadcrumbLinks.map((breadcrumb, index) => {
        const collapsed =
          this.breadcrumbLinks.length > this.collapseThreshold &&
          index < this.breadcrumbLinks.length - this.collapseThreshold;

        return { ...breadcrumb, collapsed };
      });
    }
    if (changes.has('breadcrumbItems') || changes.has('collapseThreshold')) {
      this.breadcrumbItems.forEach((breadcrumb, index) => {
        const collapsed =
          this.breadcrumbItems.length > this.collapseThreshold &&
          index < this.breadcrumbItems.length - this.collapseThreshold;

        breadcrumb.collapsed = collapsed;
        breadcrumb.style.order = ((index - (this.breadcrumbItems.length - this.collapseThreshold)) * 2).toString();
      });
    }
  }

  #renderHomeLink(): TemplateResult {
    return html`
      <a href=${this.homeUrl}>
        <sl-icon name="home-blank"></sl-icon>
        ${isMobile() ? '' : msg('Home', { id: 'sl.breadcrumbs.home' })}
      </a>
    `;
  }

  #renderCollapsedMenu(): TemplateResult | typeof nothing {
    return html`
      <sl-button
        @click=${this.#onClick}
        aria-label=${msg('More breadcrumbs', { id: 'sl.breadcrumbs.moreBreadcrumbs' })}
        fill="ghost"
        id="button"
        variant=${ifDefined(this.inverted ? 'inverted' : undefined)}
      >
        <sl-icon name="ellipsis"></sl-icon>
      </sl-button>
      <sl-popover anchor="button">
        ${this.breadcrumbLinks
          .slice(0, -this.collapseThreshold)
          .map(({ url, label }) => (url ? html`<a href=${url}>${label}</a>` : label))}
        ${this.breadcrumbItems
          .slice(0, -this.collapseThreshold)
          .map(
            breadcrumb => html`
              <sl-breadcrumb-item
                ?current=${breadcrumb.current}
                ?disabled=${breadcrumb.disabled}
                @click=${() => breadcrumb.click()}
                >${breadcrumb.textContent}</sl-breadcrumb-item
              >
            `
          )}
      </sl-popover>
    `;
  }

  #onClick = (): void => {
    this.renderRoot.querySelector('sl-popover')?.togglePopover();
  };

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    this.breadcrumbItems = event.target
      .assignedElements({ flatten: true })
      .filter(element => element instanceof BreadcrumbItem);
    this.breadcrumbLinks = event.target
      .assignedElements({ flatten: true })
      .filter(element => !(element instanceof BreadcrumbItem))
      .map(element => {
        return {
          label: element.textContent?.trim() || '',
          url: element.getAttribute('href') ?? undefined
        };
      });
  }

  #update(): void {
    this.collapseThreshold = isMobile() ? MOBILE_COLLAPSE_THRESHOLD : COLLAPSE_THRESHOLD;

    this.renderRoot.querySelectorAll<HTMLAnchorElement>('li:not(.home) > a').forEach(link => {
      const breadcrumb = this.breadcrumbLinks.find(el => el.label === link.textContent?.trim())!;

      if (link.offsetWidth < link.scrollWidth) {
        breadcrumb.tooltip ||= Tooltip.lazy(
          link,
          tooltip => {
            breadcrumb.tooltip = tooltip;
            tooltip.position = 'bottom';
            tooltip.textContent = link.textContent?.trim() || '';
          },
          { context: this.shadowRoot! }
        );
      } else if (breadcrumb.tooltip instanceof Tooltip) {
        link.removeAttribute('aria-describedby');

        breadcrumb.tooltip.remove();
        breadcrumb.tooltip = undefined;
      } else if (breadcrumb.tooltip) {
        breadcrumb.tooltip();
        breadcrumb.tooltip = undefined;
      }
    });
  }
}
