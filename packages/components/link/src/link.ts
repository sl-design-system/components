import { localized, msg } from '@lit/localize';
import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { cssState } from '@sl-design-system/shared/decorators/css-state.js';
import { ElementInternalsMixin } from '@sl-design-system/shared/mixins/element-internals.js';
import {
  type CSSResultGroup,
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html,
  nothing
} from 'lit';
import { property, queryAssignedElements, state } from 'lit/decorators.js';
import styles from './link.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-link': Link;
  }
}

export type LinkFill = 'solid' | 'outline' | 'ghost';

export type LinkShape = 'rect' | 'pill';

export type LinkType = 'internal' | 'internal-new-tab' | 'external' | 'email' | 'tel';

export type LinkVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'inverted';

/**
 * A standalone link that is visually styled as a button.
 *
 * ```html
 * <sl-link>
 *   <a href="/dashboard">Dashboard</a>
 * </sl-link>
 * ```
 *
 * @slot default - Place a single `<a>` element inside the component.
 * @csspart icon - The new-tab indicator icon.
 * @cssstate reversed - The link has an internal indicator icon on the left side.
 * @cssstate hide-icon - The link has no icon and is an internal link.
 */
@localized()
export class Link extends ScopedElementsMixin(ElementInternalsMixin(LitElement)) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Target value captured before this component injected _blank. */
  #managedTarget?: { anchor: HTMLAnchorElement; originalTarget: string | null };

  /** Observe changes to slotted anchor attributes. */
  #observer = new MutationObserver(() => this.#syncAnchor());

  /** @internal The inferred or explicit link type. */
  @state() linkType?: LinkType;

  /** @internal */
  @queryAssignedElements({ selector: 'a', flatten: true }) anchors?: HTMLAnchorElement[];

  /**
   * The fill style of the link button.
   *
   * @default 'solid'
   */
  @property({ reflect: true }) fill?: LinkFill;

  /**
   * Position of the internal link indicator icon.
   *
   * @default 'end'
   */
  @property({ reflect: true, attribute: 'icon-position' }) iconPosition?: 'start' | 'end';

  /**
   * The shape of the link button.
   *
   * @default 'rect'
   */
  @property({ reflect: true }) shape?: LinkShape;

  /**
   * The size of the link button.
   *
   * @default 'medium'
   */
  @property({ reflect: true }) size?: 'sm' | 'md' | 'lg';

  /**
   * Override the inferred link type.
   *
   * @default undefined
   */
  @property({ reflect: true }) type?: LinkType;

  /**
   * The link's color variant.
   *
   * @default 'secondary'
   */
  @property({ reflect: true }) variant?: LinkVariant;

  /** No icon will be shown on internal links when this attribute is set. */
  @property({ type: Boolean, reflect: true, attribute: 'no-icon' }) noIcon?: boolean;

  /** @internal Whether the indicator icon is rendered before the link text. */
  @cssState()
  get reversed(): boolean {
    return !this.noIcon && this.#indicatorIcon === 'arrow-left';
  }

  /** @internal Helper state whether to show the padding or not (to make place for the icon). */
  @cssState()
  get hideIcon(): boolean {
    return !!(this.noIcon && this.linkType === 'internal');
  }

  get #indicatorIcon(): string {
    switch (this.linkType) {
      case 'internal-new-tab':
        return 'square-arrow-up-right';
      case 'external':
        return 'arrow-up-right-from-square';
      case 'email':
        return 'envelope';
      case 'tel':
        return 'mobile';
      default:
        return this.iconPosition === 'start' ? 'arrow-left' : 'arrow-right';
    }
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();

    super.disconnectedCallback();
  }

  override firstUpdated(): void {
    this.#syncAnchor();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    if (changes.has('type')) {
      this.#syncAnchor();
    }
  }

  override render(): TemplateResult {
    return html`
      <slot @slotchange=${this.#onSlotChange}></slot>
      ${
        !(this.noIcon && this.linkType === 'internal')
          ? html`
              <sl-icon
                .name=${this.#indicatorIcon}
                part="icon"
                .size=${this.size === 'sm' ? 'sm' : undefined}></sl-icon>
            `
          : nothing
      }
    `;
  }

  #getAnchor(): HTMLAnchorElement | undefined {
    return this.anchors?.[0];
  }

  #inferType(anchor: HTMLAnchorElement): LinkType {
    const href = anchor.getAttribute('href');
    const newTab = anchor.getAttribute('target') === '_blank';

    if (!href) {
      return newTab ? 'internal-new-tab' : 'internal';
    }

    if (href.startsWith('//')) {
      const authority = href.slice(2).split(/[/?#]/)[0];

      if (!authority) {
        return newTab ? 'internal-new-tab' : 'internal';
      }

      const currentHost = globalThis.location?.host;

      if (!currentHost) {
        return 'external';
      }

      return authority.toLowerCase() === currentHost.toLowerCase()
        ? newTab
          ? 'internal-new-tab'
          : 'internal'
        : 'external';
    }

    try {
      const baseHref = globalThis.location?.href;
      const url = baseHref ? new URL(href, baseHref) : new URL(href);

      if (url.protocol === 'mailto:') {
        return 'email';
      }

      if (url.protocol === 'tel:') {
        return 'tel';
      }

      // Non-HTTP(S) protocols are treated as external
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        return 'external';
      }

      // Compare origins if we have location context
      if (globalThis.location?.origin) {
        const isInternal = url.origin === globalThis.location.origin;

        if (isInternal) {
          return newTab ? 'internal-new-tab' : 'internal';
        }

        return 'external';
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

  #onSlotChange(): void {
    this.#syncAnchor();
  }

  #restoreManagedTarget(): void {
    if (!this.#managedTarget) {
      return;
    }

    if (this.#managedTarget.originalTarget === null) {
      this.#managedTarget.anchor.removeAttribute('target');
    } else {
      this.#managedTarget.anchor.setAttribute('target', this.#managedTarget.originalTarget);
    }

    this.#managedTarget = undefined;
  }

  #syncTarget(anchor: HTMLAnchorElement): void {
    const shouldOpenInNewTab = this.linkType === 'external' || this.linkType === 'internal-new-tab';
    const managed = this.#managedTarget;

    // Email and tel links should never open in a new tab
    if (this.linkType === 'email' || this.linkType === 'tel') {
      if (anchor.hasAttribute('target')) {
        anchor.removeAttribute('target');
      }
      return;
    }

    if (!shouldOpenInNewTab) {
      if (managed?.anchor === anchor) {
        this.#restoreManagedTarget();
      }

      return;
    }

    if (anchor.target === '_blank' && managed?.anchor !== anchor) {
      return;
    }

    if (anchor.target !== '_blank') {
      if (managed?.anchor !== anchor) {
        this.#managedTarget = { anchor, originalTarget: anchor.getAttribute('target') };
      } else {
        managed.originalTarget = anchor.getAttribute('target');
      }

      anchor.target = '_blank';
    }
  }

  #syncAnchor(): void {
    const anchor = this.#getAnchor();

    if (!anchor) {
      this.#restoreManagedTarget();

      return;
    }

    // Disconnect observer to prevent infinite loop from our own changes
    this.#observer.disconnect();

    if (this.#managedTarget && this.#managedTarget.anchor !== anchor) {
      this.#restoreManagedTarget();
    }

    this.linkType = this.type ?? this.#inferType(anchor);
    this.#syncTarget(anchor);

    const opensInNewTab = anchor.target === '_blank';

    if (opensInNewTab && !anchor.hasAttribute('rel')) {
      anchor.setAttribute('rel', 'noopener noreferrer');
    }

    if (opensInNewTab && !anchor.querySelector('span.sl-link-new-tab')) {
      const srOnly = document.createElement('span');
      srOnly.className = 'sl-link-new-tab';
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

    // Re-observe after making all changes
    this.#observeAnchor(anchor);
  }
}
