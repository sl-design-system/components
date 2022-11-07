import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement, ReactiveElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './button-bar.scss.js';

export type ButtonBarAlign = 'start' | 'center' | 'end' | 'space-between';

/**
 * Groups buttons together in a bar separated by whitespace.
 *
 * ```html
 * <dna-button-bar>
 *   <dna-button>Foo</dna-button>
 *   <dna-button>Bar</dna-button>
 * </dna-button-bar>
 * ```
 *
 * @slot default - Buttons to be grouped in the bar
 */
export class ButtonBar extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /**
   * How the buttons are aligned with the bar.
   * @type {start | center | end | 'space-between'}
   */
  @property({ reflect: true }) align: ButtonBarAlign = 'start';

  /** Whether the bar only contains icon-only buttons. */
  @property({ type: Boolean, reflect: true, attribute: 'icon-only' }) iconOnly?: boolean;

  /** If set, the button order is reversed. */
  @property({ type: Boolean, reflect: true }) reverse = false;

  override render(): TemplateResult {
    return html`<slot @slotchange=${this.#onSlotchange}></slot>`;
  }

  async #onSlotchange(): Promise<void> {
    const buttons = Array.from(this.querySelectorAll('dna-button'));

    const icons = await Promise.all(
      buttons.map(async el => {
        if (el instanceof ReactiveElement && el.updateComplete) {
          await el.updateComplete;
        }

        return el.hasAttribute('has-icon');
      })
    );

    this.iconOnly = icons.every(Boolean);
  }
}
