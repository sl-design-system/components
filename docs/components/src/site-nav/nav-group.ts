import { faChevronDown } from '@fortawesome/pro-regular-svg-icons';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './nav-group.css' with { type: 'css' };

Icon.register(faChevronDown);

export class NavGroup extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  }

  /** @internal */
  static styles: CSSResultGroup = styles;

  /** Whether this group can be collapsed. */
  @property({ type: Boolean, reflect: true }) collapsible?: boolean;

  /** Whether this group is collapsed. Only applies when collapsible is true. */
  @property({ type: Boolean, reflect: true }) collapsed?: boolean;

  /** The section heading text. */
  @property() heading?: string;

  /** Optional URL for the heading. */
  @property() href?: string;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'group');
  }

  override render(): TemplateResult {
    return html`
      ${this.heading
        ? html`
            <h2 id="group-label" @click=${this.#onHeadingClick}>
              ${this.href ? html`<a href=${this.href}>${this.heading}</a>` : this.heading}
              ${this.collapsible
                ? html`<sl-icon class="chevron" name="far-chevron-down" size="xs"></sl-icon>`
                : nothing}
            </h2>
          `
        : nothing}
      <slot></slot>
    `;
  }

  override updated(): void {
    if (this.heading) {
      this.setAttribute('aria-label', this.heading);
    } else {
      this.removeAttribute('aria-label');
    }
  }

  #onHeadingClick(): void {
    if (this.collapsible) {
      this.collapsed = !this.collapsed;
    }
  }
}
