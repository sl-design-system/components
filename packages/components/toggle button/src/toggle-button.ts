import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './toggle-button.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-toggle-button': ToggleButton;
  }
}

export type ToggleButtonEmphasis = 'subtle' | 'bold';
export type ToggleButtonSize = 'sm' | 'md' | 'lg';
export type ToggleButtonVariant = 'ghost' | 'outline';

/**
 * Show totals at a glance or labels contents with a tag.
 *
 * ```html
 * <sl-toggle-button>99+</sl-toggle-button>
 * ```
 *
 * @slot default - Contents of the toggle-button
 */
export class ToggleButton extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The size of the toggle-button component. */
  @property({ reflect: true }) size: ToggleButtonSize = 'md';

  /** The variant of the toggle-button. */
  @property({ reflect: true }) variant: ToggleButtonVariant = 'ghost';

  /** The variant of the toggle-button. */
  @property({ reflect: true }) pressed = false;

  override render(): TemplateResult {
    return html`<sl-button><slot @slotchange=${this.#onSlotChange}></slot></sl-button>`;
  }

  #onSlotChange(event: Event & { target: HTMLSlotElement }): void {
    const elements = event.target.assignedElements({ flatten: true }),
      icon = elements.length === 1 && elements[0].tagName === 'SL-ICON',
      text = event.target
        .assignedNodes({ flatten: true })
        .filter(node => node.nodeType === Node.TEXT_NODE)
        .map(node => node.textContent?.trim())
        .join('');

    // Toggle the round attribute if the toggle-button contains only an icon, or a single character
    this.toggleAttribute('round', (icon && text === '') || (!icon && text?.length === 1));
  }
}
