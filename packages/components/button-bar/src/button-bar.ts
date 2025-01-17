import { type ButtonSize } from '@sl-design-system/button';
import { type CSSResultGroup, LitElement, type PropertyValues, ReactiveElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './button-bar.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-button-bar': ButtonBar;
  }
}

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
 * @slot default - Buttons to be grouped in the bar.
 */
export class ButtonBar extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /**
   * The alignment of the buttons within the bar.
   * @default start
   */
  @property({ reflect: true }) align?: ButtonBarAlign;

  /**
   * Whether the bar only contains icon-only buttons.
   * Determined based on the actual content, so does not need to be set.
   * @internal
   */
  @property({ type: Boolean, reflect: true, attribute: 'icon-only' }) iconOnly?: boolean;

  /** When set to true, the button order is reversed. */
  @property({ type: Boolean, reflect: true }) reverse?: boolean;

  /** Determines the size of all buttons in the bar. */
  @property() size?: ButtonSize;

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('size')) {
      this.#updateButtonSize();
    }
  }

  override render(): TemplateResult {
    return html`<slot @slotchange=${this.#onSlotChange}></slot>`;
  }

  async #onSlotChange(event: Event & { target: HTMLSlotElement }): Promise<void> {
    const assignedElements = event.target.assignedElements({ flatten: true });

    const icons = await Promise.all(
      assignedElements.map(async el => {
        if (el instanceof ReactiveElement) {
          await el.updateComplete;
        }

        return el.hasAttribute('icon-only') && el.getAttribute('fill') === 'ghost';
      })
    );

    this.iconOnly = icons.every(Boolean);

    this.#updateButtonSize();
  }

  #updateButtonSize(): void {
    this.renderRoot
      .querySelector('slot')
      ?.assignedElements({ flatten: true })
      .forEach(element => {
        const button = element as { size?: ButtonSize };

        if (this.size) {
          button.size = this.size;
        }
      });
  }
}
