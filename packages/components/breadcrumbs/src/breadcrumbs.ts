import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { Popover } from '@sl-design-system/popover';
import { Tooltip } from '@sl-design-system/tooltip';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
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
 * @slot home - Custom home link element.
 */
@localized()
export class Breadcrumbs extends ScopedElementsMixin(LitElement) {
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    slotAssignment: 'manual'
  };

  /**
   * When true, doesn't show a home label in the first breadcrumb next to the home icon.
   *
   * By changing this static property you can change the default value for all future instances of the component.
   * Changing the static property won't affect already created instances.
   */
  static hideHomeLabel = false;

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

  #mutationObserver = new MutationObserver(() => this.#onMutation());

  #updateScheduled = false;

  /** @internal The slotted breadcrumbs. */
  @state() breadcrumbLinks: HTMLElement[] = [];
  @state() customHomeLink: HTMLElement | undefined = undefined;

  /** @internal The threshold for when breadcrumbs should be collapsed into a menu. */
  @state() collapseThreshold = COLLAPSE_THRESHOLD;

  /**
   * When true, doesn't show a home label in the first breadcrumb next to the home icon.
   *
   * If you want to change the default value for all future instances of the component, you can change the static property.
   * If you want to change the property of an already created instance, you need to change this property.
   */
  @property({ type: Boolean, attribute: 'hide-home-label' }) hideHomeLabel = Breadcrumbs.hideHomeLabel;

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
   * When true, doesn't show a home link as the first breadcrumb.
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

    // Process initial light DOM children before first render
    this.#processChildren();

    this.#observer.observe(this);
    this.#mutationObserver.observe(this, {
      childList: true
    });
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();
    this.#mutationObserver.disconnect();

    // Clean up any tooltips projected into the "tooltips" slot to avoid memory leaks.
    this.querySelectorAll('[slot="tooltips"]').forEach(tooltip => {
      tooltip.remove();
    });

    super.disconnectedCallback();
  }

  override render(): TemplateResult {
    return html`
      <slot name="tooltips"></slot>
      <ul>
        ${this.noHome
          ? nothing
          : html`
              <li class="home">
                ${!this.customHomeLink
                  ? html`
                      <a
                        href=${this.homeUrl}
                        aria-label=${ifDefined(
                          isMobile() || this.hideHomeLabel ? msg('Home', { id: 'sl.breadcrumbs.home' }) : undefined
                        )}
                      >
                        <sl-icon name="home-blank"></sl-icon>
                        ${isMobile() || this.hideHomeLabel ? '' : msg('Home', { id: 'sl.breadcrumbs.home' })}
                      </a>
                    `
                  : html`<slot name="home"></slot>`}
              </li>
              <sl-icon name="breadcrumb-separator"></sl-icon>
            `}
        ${this.breadcrumbLinks.length > this.collapseThreshold
          ? html`
              <li class="more-menu">
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
                    .map((_, index) => html`<slot name="breadcrumb-menu-${index}"></slot>` as TemplateResult)}
                </sl-popover>
              </li>
              <sl-icon name="breadcrumb-separator"></sl-icon>
            `
          : nothing}
        ${this.breadcrumbLinks.slice(this.breadcrumbLinks.length - this.collapseThreshold).map(
          (_, index, array) => html`
            <li><slot name="breadcrumb-${index}"></slot></li>
            ${index < array.length - 1 ? html`<sl-icon name="breadcrumb-separator"></sl-icon>` : nothing}
          `
        )}
      </ul>
    `;
  }

  override firstUpdated(): void {
    // Perform slot assignments after first render
    this.#assignSlots();
  }

  #onClick = (): void => {
    this.renderRoot.querySelector('sl-popover')?.togglePopover();
  };

  #processChildren(): void {
    const children = Array.from(this.children);

    // Filter for elements without a slot attribute (default slot content)
    this.breadcrumbLinks = children
      .filter(el => !el.hasAttribute('slot') && !(el instanceof Tooltip))
      .map(el => el as HTMLElement);
    this.customHomeLink = children.find(el => el.getAttribute('slot') === 'home') as HTMLElement | undefined;
  }

  #assignSlots(): void {
    requestAnimationFrame(() => {
      if (this.customHomeLink) {
        const slot = this.renderRoot.querySelector('slot[name="home"]') as HTMLSlotElement;
        slot?.assign(this.customHomeLink);
      }
      this.breadcrumbLinks.slice(0, -this.collapseThreshold).forEach((link, index) => {
        const slot = this.renderRoot.querySelector(`slot[name="breadcrumb-menu-${index}"]`) as HTMLSlotElement;
        link.removeAttribute('aria-current');
        slot?.assign(link);
      });
      this.breadcrumbLinks.slice(this.breadcrumbLinks.length - this.collapseThreshold).forEach((link, index) => {
        const slot = this.renderRoot.querySelector(`slot[name="breadcrumb-${index}"]`) as HTMLSlotElement;
        link.removeAttribute('aria-current');
        this.#setTooltip(link);
        slot?.assign(link);
      });
      this.breadcrumbLinks.slice(this.breadcrumbLinks.length - 1).forEach(link => {
        link.setAttribute('aria-current', 'page');
      });
    });
  }

  #onMutation = (): void => {
    this.#processChildren();
    this.#assignSlots();
  };

  #update(): void {
    if (this.#updateScheduled) {
      return;
    }

    this.#updateScheduled = true;
    requestAnimationFrame(() => {
      this.#updateScheduled = false;
      this.collapseThreshold = isMobile() ? MOBILE_COLLAPSE_THRESHOLD : COLLAPSE_THRESHOLD;
      this.#onMutation();
    });
  }

  #setTooltip(link: HTMLElement): void {
    const tooltipsSlot = this.renderRoot.querySelector('slot[name="tooltips"]') as HTMLSlotElement;

    if (!tooltipsSlot) {
      return;
    }

    if (link.offsetWidth < link.scrollWidth) {
      if (link.hasAttribute('data-has-tooltip')) {
        return;
      } else {
        Tooltip.lazy(
          link,
          tooltip => {
            tooltip.position = 'bottom';
            tooltip.textContent = link.textContent?.trim() || '';
            requestAnimationFrame(() => {
              tooltipsSlot.assign(...(tooltipsSlot.assignedElements() || []), tooltip);
            });
          },
          { context: this.shadowRoot! }
        );
        link.dataset.hasTooltip = 'true';
      }
    } else if (link.hasAttribute('data-has-tooltip') && link.hasAttribute('aria-describedby')) {
      const tooltip = tooltipsSlot.assignedElements().find(el => el.id === link.getAttribute('aria-describedby')) as
        | Tooltip
        | undefined;
      tooltip?.remove();
      link.removeAttribute('data-has-tooltip');
      link.removeAttribute('aria-describedby');
    }
  }
}
