import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { observe } from '../utils/decorators/observe.js';
import styles from './select-option.scss.js';

export class SelectOption extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Whether the option item is selected*/
  @property({ reflect: true, type: Boolean }) selected = false;

  /** Whether the option item is disabled*/
  @property({ reflect: true, type: Boolean }) disabled = false;

  /** Get the selected tab button, or the first tab button. */
  get #tabIndex(): string | null {
    return this.getAttribute('tabIndex');
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
    this.slot ||= 'options';
  }

  override render(): TemplateResult {
    return html`<slot></slot> ${this.#tabIndex}`;
  }
}
