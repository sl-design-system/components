import { type ButtonFill, type ButtonSize, type ButtonVariant } from '@sl-design-system/button';
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
   * @default 'start'
   */
  @property({ reflect: true }) align?: ButtonBarAlign;

  /**
   * Determines the fill of all buttons in the bar.
   * @default undefined
   */
  @property() fill?: ButtonFill;

  /**
   * Whether the bar only contains icon-only buttons.
   * Determined based on the actual content, so does not need to be set.
   * @internal
   */
  @property({ type: Boolean, reflect: true, attribute: 'icon-only' }) iconOnly?: boolean;

  /**
   * When set to true, the button order is reversed.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) reverse?: boolean;

  /**
   * Determines the size of all buttons in the bar.
   * @default undefined
   */
  @property() size?: ButtonSize;

  /**
   * Determines the variant of all buttons in the bar.
   * @default undefined
   */
  @property() variant?: ButtonVariant;

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('fill') || changes.has('size') || changes.has('variant')) {
      this.#updateButtons();
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

    this.#updateButtons();
  }

  #updateButtons(): void {
    this.renderRoot
      .querySelector('slot')
      ?.assignedElements({ flatten: true })
      .forEach(element => {
        const button = element as { fill?: ButtonFill; size?: ButtonSize; variant?: ButtonVariant };

        if (this.size) {
          button.size = this.size;
        }

        if (this.fill) {
          button.fill = this.fill;
        }

        if (this.variant) {
          button.variant = this.variant;
        }
      });
  }
}
