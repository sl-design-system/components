import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { SelectSize } from './select.js';
import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './select-option-group.scss.js';

/**
 * A way to group options together, with or without a heading.
 *
 * ```html
 *  <sl-select>
      <sl-select-option-group heading="Europe">
        <sl-select-option>Netherlands</sl-select-option>
        <sl-select-option>Spain</sl-select-option>
        <sl-select-option>Poland</sl-select-option>
      </sl-select-option-group>
      ...
    </sl-select>
 * ```
 *
 * @slot default - List of `sl-select-option` elements
 */
export class SelectOptionGroup extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** The heading for the group. */
  @property() heading?: string;

  /** @private The size of the select. Is inherited from the select component it is in. */
  @property({ reflect: true }) size: SelectSize = 'md';

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'group');
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('heading')) {
      /**
       * NOTE: When we have ARIA reflection, change this to use that:
       *
       * this.ariaLabelledByElements = this.heading ? [this.renderRoot.querySelector('span')] : [];
       *
       * For now, duplicate the heading in the aria-label attribute.
       */
      if (this.heading) {
        this.setAttribute('aria-label', this.heading);
      } else {
        this.removeAttribute('aria-label');
      }
    }
  }

  override render(): TemplateResult {
    return html`
      ${this.heading ? html`<span>${this.heading}</span>` : nothing}
      <slot></slot>
    `;
  }
}
