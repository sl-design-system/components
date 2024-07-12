import { type ButtonFill, type ButtonSize } from '@sl-design-system/button';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './button-group.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-button-group': ButtonGroup;
  }
}

type ButtonLike = HTMLElement & {
  disabled: boolean;
  fill?: ButtonFill;
  size?: ButtonSize;
};

/**
 * A component for visually grouping buttons together.
 *
 * @slot default - The default slot.
 */
export class ButtonGroup extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** If set, will disable all buttons in the group. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** Determines the size of all buttons in the group. */
  @property({ reflect: true }) size?: ButtonSize;

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    this.#updateButtonProperties();
  }

  override render(): TemplateResult {
    return html`<slot @slotchange=${() => this.#updateButtonProperties()}></slot>`;
  }

  #updateButtonProperties(): void {
    this.renderRoot
      .querySelector('slot')
      ?.assignedElements({ flatten: true })
      .forEach(element => {
        const button = element as ButtonLike;

        button.disabled = !!this.disabled;
        button.fill = 'outline';

        if (this.size) {
          button.size = this.size;
        }
      });
  }
}
