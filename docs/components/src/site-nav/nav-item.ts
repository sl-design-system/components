import { faChevronRight } from '@fortawesome/pro-regular-svg-icons';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './nav-item.css' with { type: 'css' };

Icon.register(faChevronRight);

export class NavItem extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  }

  /** @internal */
  static styles: CSSResultGroup = styles;

  /** The display text for this nav item. */
  @property() heading?: string;

  /** The URL this item links to. */
  @property() href?: string;

  /** The icon name (for top-level items). */
  @property() icon?: string;

  /** Whether this is the active/current page. */
  @property({ type: Boolean, reflect: true }) active = false;

  /** Whether the children are expanded. */
  @property({ type: Boolean, reflect: true }) open = false;

  /** @internal Whether this item has child nav items. */
  @state() expandable = false;

  /** @internal The nesting level (0-based), computed from DOM. */
  @state() level = 0;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'treeitem');

    // Compute nesting level by counting ancestor nav-item elements
    let level = 0,
      parent = this.parentElement;

    while (parent) {
      if (parent.localName === this.localName) {
        level++;
      }
      parent = parent.parentElement;
    }

    this.level = level;
    this.dataset.level = String(level);
    this.style.setProperty('--nav-level', String(level));

    // Pre-detect expandability from light DOM children
    this.expandable = !!this.querySelector(this.localName);
  }

  override updated(): void {
    // Sync ARIA states with properties
    if (this.expandable) {
      this.setAttribute('aria-expanded', String(this.open));
    } else {
      this.removeAttribute('aria-expanded');
    }

    if (this.active) {
      this.setAttribute('aria-current', 'page');
    } else {
      this.removeAttribute('aria-current');
    }
  }

  override render(): TemplateResult {
    if (this.expandable) {
      return html`
        <details ?open=${this.open} @toggle=${this.#onToggle}>
          <summary tabindex="-1">
            ${this.active ? html`<span class="active"></span>` : nothing}
            ${this.icon ? html`<sl-icon name=${this.icon}></sl-icon>` : nothing}
            ${this.href
              ? html`<a href=${this.href}>${this.heading}</a>`
              : html`<span class="label">${this.heading}</span>`}
            <sl-icon class="chevron" name="far-chevron-right" size="xs"></sl-icon>
          </summary>
          <slot @slotchange=${this.#onSlotChange}></slot>
        </details>
      `;
    }

    return html`
      <a href=${ifDefined(this.href)} tabindex="-1">
        ${this.active ? html`<span class="active"></span>` : nothing}
        ${this.icon ? html`<sl-icon name=${this.icon}></sl-icon>` : nothing} ${this.heading}
      </a>
      <slot @slotchange=${this.#onSlotChange}></slot>
    `;
  }

  #onSlotChange(event: Event): void {
    const slot = event.target as HTMLSlotElement,
      children = slot.assignedElements({ flatten: true });

    this.expandable = children.some(child => child.localName === this.localName);
  }

  #onToggle(event: Event): void {
    this.open = (event.target as HTMLDetailsElement).open;
  }
}
