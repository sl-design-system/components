import type { CSSResultGroup, TemplateResult } from 'lit';
import { observe } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './tab-listbox.scss.js';

export class TabListbox extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Whether the tab item is selected */
  @property({ reflect: true, type: Boolean }) selected = false;

  /** Whether the tab item is disabled */
  @property({ reflect: true, type: Boolean }) disabled = false;

  override render(): TemplateResult {
    return html`<slot></slot>`;
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
