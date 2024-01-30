import type { CSSResultGroup, TemplateResult } from 'lit';
import { observe } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './tab.scss.js';

/**
 * A tab component - part of the tab group component.
 *
 * ```html
 *      <sl-tab>
 *         <sl-icon slot="icon" name="star" size="md"></sl-icon>
 *         Tab label
 *         <span slot="subtitle">Tab subtitle</span>
 *         <sl-badge slot="badge" size="lg" variant="danger">4</sl-badge>
 *      </sl-tab>
 * ```
 *
 * @slot default - A place for the tab group content.
 * @slot icon -
 * @slot badge -
 * @slot subtitle -
 */
export class Tab extends LitElement {
  // TODO: improve description
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Whether the tab item is selected */
  @property({ reflect: true, type: Boolean }) selected = false;

  /** Whether the tab item is disabled */
  @property({ reflect: true, type: Boolean }) disabled = false;

  override render(): TemplateResult {
    return html` <slot name="icon" part="icon"></slot>
      <div class="content">
        <span class="title">
          <slot></slot>
          <slot name="badge" part="badge"></slot>
        </span>
        <slot name="subtitle" part="subtitle"></slot>
      </div>`;
  }

  /**
   * Apply accessible attributes and values to the tab button.
   * Observe the selected property if it changes
   */
  @observe('selected')
  protected handleSelectionChange(): void {
    this.setAttribute('aria-selected', this.selected ? 'true' : 'false');
    this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'tab');
    this.slot ||= 'tabs';
  }
}
