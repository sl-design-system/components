import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { Popover } from '@sl-design-system/popover';
import { Tooltip } from '@sl-design-system/tooltip';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './breadcrumbs.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-breadcrumbs': Breadcrumbs;
  }

  interface ShadowRoot {
    // Workaround for missing type in @open-wc/scoped-elements
    createElement(tagName: string): HTMLElement;
  }
}

export interface Breadcrumb {
  element: HTMLElement;
  label: string;
  tooltip?: boolean | Tooltip;
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
      'sl-tooltip': Tooltip,
      'sl-popover': Popover,
      'sl-button': Button
    };
  }

  /** @private */
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
            <a href=${this.homeUrl}><sl-icon name="home-blank"></sl-icon>${isMobile() ? '' : msg('Home')}</a>
            <sl-icon name="slash-forward"></sl-icon>
          `}
      ${this.breadcrumbs.length > this.collapseThreshold
        ? html`
            <sl-button fill="link" id="button" @click=${this.#onClick} icon-only aria-label=${msg('More breadcrumbs')}>
              <sl-icon name="ellipsis"></sl-icon>
            </sl-button>
            <sl-popover anchor="button">
              ${this.breadcrumbs
                .slice(0, -this.collapseThreshold)
                .map(({ url, label }) => (url ? html`<a href=${url}>${label}</a>` : html`${label}`))}
            </sl-popover>
          `
        : nothing}
      <slot @slotchange=${this.#onSlotchange}></slot>
    `;
  }

  #onClick = (): void => {
    this.renderRoot.querySelector<Popover>('sl-popover')?.togglePopover();
  };

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    this.breadcrumbs = event.target
      .assignedElements({ flatten: true })
      .filter((element): element is HTMLElement => !(element instanceof Icon || element instanceof Tooltip))
      .map(element => {
        if (element.matches(':last-of-type')) {
          element.setAttribute('aria-current', 'page');
        }
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
      icon.name = 'slash-forward';

      element.after(icon);
    });
  }

  #update(): void {
    this.collapseThreshold = isMobile() ? MOBILE_COLLAPSE_THRESHOLD : COLLAPSE_THRESHOLD;

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
