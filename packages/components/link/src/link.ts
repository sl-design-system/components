import {
  faArrowLeft,
  faArrowRight,
  faArrowUpRightFromSquare,
  faSquareArrowUpRight
} from '@fortawesome/pro-regular-svg-icons';
import { localized, msg } from '@lit/localize';
import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import {
  type CSSResultGroup,
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html
} from 'lit';
import { property, query, state } from 'lit/decorators.js';
import styles from './link.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-link': Link;
  }
}

export type LinkFill = 'solid' | 'outline' | 'ghost';

export type LinkType = 'internal' | 'internal-new-tab' | 'external';

export type LinkVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'inverted';

Icon.register(faArrowRight, faArrowLeft, faArrowUpRightFromSquare, faSquareArrowUpRight);

/**
 * A standalone link that is visually styled as a button.
 *
 * ```html
 * <sl-link>
 *   <a href="/dashboard">Dashboard</a>
 * </sl-link>
 * ```
 *
 * @slot default - Place a single <code>&lt;a&gt;</code> element inside the component.
 * @csspart indicator - The new-tab indicator icon.
 */
@localized()
export class Link extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Observe changes to slotted anchor attributes. */
  #observer = new MutationObserver(() => this.#syncAnchor());

  /** @internal The inferred or explicit link type. */
  @state() linkType?: LinkType;

  /** @internal */
  @query('slot') slotElement!: HTMLSlotElement;

  /**
   * The link's color variant.
   *
   * @default 'secondary'
   */
  @property({ reflect: true }) variant?: LinkVariant;

  /**
   * The fill style of the link button.
   *
   * @default 'solid'
   */
  @property({ reflect: true }) fill?: LinkFill;

  /**
   * Override the inferred link type.
   *
   * @default undefined
   */
  @property({ reflect: true }) type?: LinkType;

  /**
   * Position of the internal link indicator icon.
   *
   * @default 'end'
   */
  @property({ reflect: true, attribute: 'icon-position' }) iconPosition: 'start' | 'end' = 'end';

  get #indicatorIcon(): string {
    switch (this.linkType) {
      case 'internal-new-tab':
        return 'far-square-arrow-up-right';
      case 'external':
        return 'far-arrow-up-right-from-square';
      default:
        return this.iconPosition === 'start' ? 'far-arrow-left' : 'far-arrow-right';
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener('click', this.#onClick);
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();
    this.removeEventListener('click', this.#onClick);

    super.disconnectedCallback();
  }

  override firstUpdated(): void {
    this.#syncAnchor();
  }

  override render(): TemplateResult {
    return html`
      <slot @slotchange=${this.#onSlotChange}></slot>
      <sl-icon .name=${this.#indicatorIcon} part="icon"></sl-icon>
    `;
  }

  override willUpdate(changes: PropertyValues<this>): void {
    if (changes.has('type')) {
      this.#syncAnchor();
    }
  }

  #getAnchor(): HTMLAnchorElement | undefined {
    const assigned = this.slotElement?.assignedElements({ flatten: true }) ?? [];

    return assigned.find((element): element is HTMLAnchorElement => element.tagName === 'A');
  }

  #inferType(anchor: HTMLAnchorElement): LinkType {
    const href = anchor.getAttribute('href');
    const newTab = anchor.getAttribute('target') === '_blank';

    if (!href) {
      return newTab ? 'internal-new-tab' : 'internal';
    }

    // Relative paths are always internal
    if (/^(\/|#|\.\/|\.\.\/)/.test(href)) {
      return newTab ? 'internal-new-tab' : 'internal';
    }

    try {
      // At this point, href should be an absolute URL
      const url = new URL(href);

      // Non-HTTP(S) protocols (mailto:, tel:, etc.) are treated as external
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        return 'external';
      }

      // Compare origins if we have location context
      if (globalThis.location?.origin) {
        return url.origin === globalThis.location.origin ? 'internal' : 'external';
      }

      // No location context - treat absolute URLs as external to be safe
      return 'external';
    } catch {
      // Malformed URL - treat as internal
      return newTab ? 'internal-new-tab' : 'internal';
    }
  }

  #observeAnchor(anchor: HTMLAnchorElement): void {
    this.#observer.disconnect();
    this.#observer.observe(anchor, {
      attributeFilter: ['aria-description', 'href', 'rel', 'target'],
      attributes: true
    });
  }

  #onClick = (event: MouseEvent): void => {
    const anchor = this.#getAnchor();

    if (!anchor) {
      return;
    }

    // If the click originated from the anchor itself, let it propagate naturally
    if (event.target === anchor || anchor.contains(event.target as Node)) {
      return;
    }

    // Click was on padding or icon - delegate to the anchor
    event.preventDefault();
    anchor.click();
  };

  #onSlotChange = (): void => {
    this.#syncAnchor();
  };

  #syncAnchor(): void {
    const anchor = this.#getAnchor();

    if (!anchor) {
      this.toggleAttribute('has-indicator', false);

      return;
    }

    // Disconnect observer to prevent infinite loop from our own changes
    this.#observer.disconnect();

    this.linkType = this.type ?? this.#inferType(anchor);

    if (this.linkType === 'external') {
      anchor.target = '_blank';
    }

    const opensInNewTab = anchor.target === '_blank';

    if (opensInNewTab && !anchor.hasAttribute('rel')) {
      anchor.setAttribute('rel', 'noopener noreferrer');
    }

    if (opensInNewTab && !anchor.querySelector('span.sr-only')) {
      const srOnly = document.createElement('span');
      srOnly.className = 'sr-only';
      srOnly.style.cssText = `
          clip: rect(1px, 1px, 1px, 1px);
          clip-path: inset(50%);
          height: 1px;
          width: 1px;
          margin: -1px;
          overflow: hidden;
          padding: 0;
          position: absolute;
      `;
      srOnly.textContent = `(${msg('opens in a new tab', { id: 'link.opens-in-new-tab' })})`;
      anchor.appendChild(srOnly);
    }

    this.toggleAttribute('has-indicator', opensInNewTab);

    // Re-observe after making all changes
    this.#observeAnchor(anchor);
  }
}
