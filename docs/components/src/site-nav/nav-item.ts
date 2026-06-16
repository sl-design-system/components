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

  /** Whether this is the active/current page. */
  @property({ type: Boolean, reflect: true }) active?: boolean;

  /** @internal Whether this item has child nav items. */
  @state() expandable = false;

  /** The display text for this nav item. */
  @property() heading?: string;

  /** The URL this item links to. */
  @property() href?: string;

  /** The icon name (for top-level items). */
  @property({ reflect: true }) icon?: string;

  /** @internal The nesting level (0-based), computed from DOM. */
  @state() level = 0;

  /** Whether the children are expanded. */
  @property({ type: Boolean, reflect: true }) open?: boolean;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'treeitem');

    const style = document.createElement('style');
    style.innerText = `
      doc-nav-item:has(> doc-nav-item[active])::part(active) {
        position-anchor: --active;
      }
      doc-nav-item > doc-nav-item[active]::part(leaf) {
        anchor-name: --active;
      }
    `;
    this.append(style);

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
    if (this.expandable) {
      this.setAttribute('aria-expanded', Boolean(this.open).toString());
    } else {
      this.removeAttribute('aria-expanded');
    }
  }

  override render(): TemplateResult {
    if (this.expandable) {
      return html`
        <details ?open=${this.open} @toggle=${this.#onToggle}>
          <summary tabindex="-1">
            ${this.icon ? html`<sl-icon name=${this.icon}></sl-icon>` : nothing}
            ${this.href
              ? html`<a href=${this.href}>${this.heading}</a>`
              : html`<span class="label">${this.heading}</span>`}
            <sl-icon class="chevron" name="far-chevron-right" size="xs"></sl-icon>
          </summary>
          <div class="subtree">
            <span part="active"></span>
            <slot @slotchange=${this.#onSlotChange}></slot>
          </div>
        </details>
      `;
    }

    return html`
      <a
        href=${ifDefined(this.href)}
        aria-current=${ifDefined(this.active ? 'page' : undefined)}
        part="leaf"
        tabindex="-1"
      >
        ${this.icon ? html`<sl-icon name=${this.icon}></sl-icon>` : nothing} ${this.heading}
      </a>
      <slot @slotchange=${this.#onSlotChange}></slot>
    `;
  }

  #onSlotChange(event: Event & { target: HTMLSlotElement }): void {
    const children = event.target.assignedElements({ flatten: true });

    this.expandable = children.some(child => child.localName === this.localName);
  }

  #onToggle(event: Event & { target: HTMLDetailsElement }): void {
    this.open = event.target.open;
  }
}
