import type { CSSResultGroup, TemplateResult } from 'lit';
import type { SelectSize } from './select.js';
import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './select-option-group.scss.js';

/**
 * A way to group together options, with or without heading.
 *
 * ```html
 *  <sl-select>
      <sl-select-option-group group-heading="Europ">
      <sl-select-option>Netherlands</sl-select-option>
      <sl-select-option>Spain</sl-select-option>
        <sl-select-option>Poland</sl-select-option>
      </sl-select-option-group>
    </sl-select>
 * ```
 *
 * @slot default - List of `sl-option` elements
 */
export class SelectOptionGroup extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** @private The size of the select. Is inherited from the select component it is in */
  @property({ reflect: true }) size: SelectSize = 'md';

  /** The heading of the option group */
  @property({ attribute: 'group-heading' }) groupHeading?: string;

  override render(): TemplateResult {
    return html`
      ${this.groupHeading ? html`<span>${this.groupHeading}</span>` : nothing}
      <slot></slot>
    `;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'group');
    this.setAttribute('aria-label', this.groupHeading || '');
  }
}
