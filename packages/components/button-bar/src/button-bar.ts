import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement, ReactiveElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './button-bar.scss.js';

export type ButtonBarAlign = 'start' | 'center' | 'end' | 'space-between';

/**
 * Groups buttons together in a bar separated by whitespace.
 *
 * ```html
 * <sl-button-bar>
 *   <sl-button>Foo</sl-button>
 *   <sl-button>Bar</sl-button>
 * </sl-button-bar>
 * ```
 *
 * @slot default - Buttons to be grouped in the bar
 */
export class ButtonBar extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /**
   * The alignment of the buttons within the bar.
   * Functionally the same as flex-box alignments.
   * @type {'start' | 'center' | 'end' | 'space-between'}
   */
  @property({ reflect: true }) align: ButtonBarAlign = 'start';

  /** When set to true, the button order is reversed using flex-direction.*/
  @property({ type: Boolean, reflect: true }) reverse = false;

  /** Whether the bar only contains icon-only buttons.
   *  Determined based on the actual content, so does not need to be set.
   * @private
   */
  @property({ type: Boolean, reflect: true, attribute: 'icon-only' }) iconOnly?: boolean;

  override render(): TemplateResult {
    return html`<slot @slotchange=${this.#onSlotchange}></slot>`;
  }

  async #onSlotchange(): Promise<void> {
    const buttons = Array.from(this.querySelectorAll('sl-button'));

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
