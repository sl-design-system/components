import { type ButtonFill, type ButtonSize, type ButtonVariant } from '@sl-design-system/button';
import { cssState } from '@sl-design-system/shared/decorators/css-state.js';
import { ElementInternalsMixin } from '@sl-design-system/shared/mixins/element-internals.js';
import {
  type CSSResultGroup,
  LitElement,
  type PropertyValues,
  ReactiveElement,
  type TemplateResult,
  html
} from 'lit';
import { property, queryAssignedElements, state } from 'lit/decorators.js';
import styles from './button-bar.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-button-bar': ButtonBar;
  }
}

export type ButtonBarAlign = 'start' | 'center' | 'end' | 'space-between';

/**
 * Groups buttons together in a bar separated by whitespace.
 *
 * @element sl-button-bar
 *
 * @slot - Buttons to be grouped in the bar.
 *
 * @cssstate empty - Set when there are no buttons in the bar.
 * @cssstate icon-only - Set when all buttons in the bar are icon-only.
 * @cssstate reverse - Set when the button order is reversed.
 */
export class ButtonBar extends ElementInternalsMixin(LitElement) {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Observer for slot changes to update button states. */
  #observer = new MutationObserver(() => this.#onMutate());

  /**
   * The alignment of the buttons within the bar.
   *
   * @default 'start'
   */
  @property({ reflect: true }) align?: ButtonBarAlign;

  /** @internal The slotted buttons. */
  @queryAssignedElements({ flatten: true, selector: ':not(style)' }) buttons!: HTMLElement[];

  /**
   * @internal Whether there are no buttons in the bar. Defaults to `true`, since `slotchange`
   * never fires for a slot that has no assigned nodes to begin with.
   */
  @state() @cssState() empty = true;

  /** @internal Whether all buttons in the bar are icon-only ghost buttons. */
  @state() @cssState() iconOnly?: boolean;

  /**
   * Determines the fill of all buttons in the bar.
   *
   * @default undefined
   */
  @property() fill?: ButtonFill;

  /**
   * When set to true, the button order is reversed.
   *
   * @default false
   */
  @property({ type: Boolean }) @cssState() reverse?: boolean;

  /**
   * Determines the size of all buttons in the bar.
   *
   * @default undefined
   */
  @property() size?: ButtonSize;

  /**
   * Determines the variant of all buttons in the bar.
   *
   * @default undefined
   */
  @property() variant?: ButtonVariant;

  override disconnectedCallback(): void {
    this.#observer.disconnect();

    super.disconnectedCallback();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('fill') || changes.has('size') || changes.has('variant')) {
      this.#updateButtons();
    }
  }

  override render(): TemplateResult {
    return html`<slot @slotchange=${this.#onSlotChange}></slot>`;
  }

  async #onMutate(): Promise<void> {
    if (this.buttons.length) {
      this.empty = false;

      this.#updateButtons();
    } else {
      this.empty = true;
    }

    const icons = await Promise.all(
      this.buttons.map(async el => {
        if (el instanceof ReactiveElement) {
          // Give the button time to set the `icon-only` state
          await new Promise(resolve => setTimeout(resolve));
        }

        // Also check for the `icon-only` attribute for backward compatibility with older button versions
        return (
          (el.matches(':state(icon-only)') || el.hasAttribute('icon-only')) &&
          el.getAttribute('fill') === 'ghost'
        );
      })
    );

    this.iconOnly = !!icons.length && icons.every(Boolean);
  }

  #onSlotChange(event: Event & { target: HTMLSlotElement }): void {
    this.#observer.disconnect();

    // Workaround until `MutationObserver` can observe across slots; see
    // https://github.com/whatwg/dom/issues/1415
    const assigned = new Set(
      event.target.assignedElements({ flatten: true, selector: ':not(style)' })
    );
    assigned.forEach(el => {
      this.#observer.observe(el, { attributes: true });
    });

    // Trigger an initial update of the button states
    void this.#onMutate();
  }

  #updateButtons(): void {
    this.buttons.forEach(element => {
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
