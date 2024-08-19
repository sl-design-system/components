import { RovingTabindexController } from '@sl-design-system/shared';
import { type SlToggleEvent } from '@sl-design-system/shared/events.js';
import { ToggleButton, type ToggleButtonSize } from '@sl-design-system/toggle-button';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './toggle-group.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-toggle-group': ToggleGroup;
  }
}

/**
 * A component for visually grouping toggle buttons together.
 *
 * @slot default - The default slot.
 */
export class ToggleGroup extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  get #buttons(): ToggleButton[] {
    return (
      this.renderRoot
        .querySelector('slot')
        ?.assignedElements({ flatten: true })
        .filter((element): element is ToggleButton => element instanceof ToggleButton) ?? []
    );
  }

  /** Manage keyboard navigation between buttons. */
  #rovingTabindexController = new RovingTabindexController<ToggleButton>(this, {
    focusInIndex: (elements: ToggleButton[]) => elements.findIndex(el => !el.disabled),
    direction: 'horizontal',
    elements: () => this.#buttons || [],
    isFocusableElement: (el: ToggleButton) => !el.disabled
  });

  /** If set, will disable all buttons in the group. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /**
   * By default, only a single toggle button inside the group can be active. This means
   * that the group will automatically deactivate the other buttons when one is toggled.
   *
   * If you toggle this property, then multiple buttons can be active at the same time.
   * In this case the group does nothing when a button is toggled. Use this mode if you want to
   * handle the toggling of buttons yourself.
   */
  @property({ type: Boolean }) multiple?: boolean;

  /** Determines the size of all buttons in the group. */
  @property({ reflect: true }) size?: ToggleButtonSize;

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('disabled') || changes.has('size')) {
      this.#updateButtonProperties();
    }
  }

  override render(): TemplateResult {
    return html`<slot @sl-toggle=${this.#onToggle} @slotchange=${this.#onSlotChange}></slot>`;
  }

  #onSlotChange(): void {
    this.#rovingTabindexController.clearElementCache();

    this.#updateButtonProperties();
  }

  #onToggle(event: SlToggleEvent): void {
    if (this.multiple) {
      return;
    } else if (event.detail) {
      this.#buttons.filter(button => button !== event.target).forEach(button => (button.pressed = false));
    }
  }

  #updateButtonProperties(): void {
    this.#buttons.forEach(button => {
      if (typeof this.disabled === 'boolean') {
        button.disabled = this.disabled;
      }

      button.fill = 'ghost';

      if (this.size) {
        button.size = this.size;
      }
    });
  }
}
