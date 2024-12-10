import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { Popover } from '@sl-design-system/popover';
import { Tooltip } from '@sl-design-system/tooltip';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
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

export type BreadcrumbsVariant = 'default' | 'inverted';

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

  /** The slotted breadcrumbs. */
  @state() breadcrumbs: Breadcrumb[] = [];

  /** The threshold for when breadcrumbs should be collapsed into a menu. */
  @state() collapseThreshold = COLLAPSE_THRESHOLD;

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

  /**
   * The variant of the breadcrumbs.
   * @default default
   */
  @property() variant?: BreadcrumbsVariant;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('aria-label', msg('Breadcrumb trail'));
    this.setAttribute('role', 'navigation');

    this.#observer.observe(this);
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();

    this.breadcrumbs.forEach(breadcrumb => {
      if (breadcrumb.tooltip instanceof Tooltip) {
        breadcrumb.tooltip.remove();
      } else if (breadcrumb.tooltip) {
        breadcrumb.tooltip();
      }
    });
    this.breadcrumbs = [];

    super.disconnectedCallback();
  }

  override render(): TemplateResult {
    return html`
      <ul>
        ${this.noHome
          ? nothing
          : html`
              <li class="home">
                <a href=${this.homeUrl}><sl-icon name="home-blank"></sl-icon>${isMobile() ? '' : msg('Home')}</a>
              </li>
              <sl-icon name="breadcrumb-separator"></sl-icon>
            `}
        ${this.breadcrumbs.length > this.collapseThreshold
          ? html`
              <li class="more-menu">
                <sl-button
                  @click=${this.#onClick}
                  aria-label=${msg('More breadcrumbs')}
                  fill="link"
                  id="button"
                  variant=${ifDefined(this.variant === 'inverted' ? 'inverted' : undefined)}
                >
                  <sl-icon name="ellipsis"></sl-icon>
                </sl-button>
                <sl-popover anchor="button">
                  ${this.breadcrumbs
                    .slice(0, -this.collapseThreshold)
                    .map(({ url, label }) => (url ? html`<a href=${url}>${label}</a>` : html`${label}`))}
                </sl-popover>
              </li>
              <sl-icon name="breadcrumb-separator"></sl-icon>
            `
          : nothing}
        ${this.breadcrumbs
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
      <slot @slotchange=${this.#onSlotchange} style="display:none"></slot>
    `;
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('breadcrumbs') || changes.has('collapseThreshold')) {
      this.breadcrumbs = this.breadcrumbs.map((breadcrumb, index) => {
        const collapsed =
          this.breadcrumbs.length > this.collapseThreshold && index < this.breadcrumbs.length - this.collapseThreshold;

        return { ...breadcrumb, collapsed };
      });
    }
  }

  #onClick = (): void => {
    this.renderRoot.querySelector('sl-popover')?.togglePopover();
  };

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    this.breadcrumbs = event.target.assignedElements({ flatten: true }).map(element => {
      return {
        label: element.textContent?.trim() || '',
        url: element.getAttribute('href') ?? undefined
      };
    });
  }

  #update(): void {
    this.collapseThreshold = isMobile() ? MOBILE_COLLAPSE_THRESHOLD : COLLAPSE_THRESHOLD;

    this.renderRoot.querySelectorAll<HTMLAnchorElement>('li:not(.home) > a').forEach(link => {
      const breadcrumb = this.breadcrumbs.find(el => el.label === link.textContent?.trim())!;

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
