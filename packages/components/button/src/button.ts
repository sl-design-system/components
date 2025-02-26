import { EventsController, closestElementComposed } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './button.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-button': Button;
  }
}

export type ButtonFill = 'solid' | 'outline' | 'link' | 'ghost';

export type ButtonShape = 'square' | 'pill';

export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonType = 'button' | 'reset' | 'submit';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'inverted';

/**
 * A single, simple button, with optionally an icon.
 *
 * ```html
 *   <sl-button>Foo</sl-button>
 * ```
 *
 * @slot default - Text label of the button. Optionally an <code>sl-icon</code> can be added
 */
export class Button extends LitElement {
  /** @internal */
  static formAssociated = true;

  /** @internal */
  static override styles: CSSResultGroup = styles;

  // eslint-disable-next-line no-unused-private-class-members
  #events = new EventsController(this, {
    click: this.#onClick,
    keydown: this.#onKeydown
  });

  /** @internal. */
  readonly internals = this.attachInternals();

  /** Whether the button is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /**
   * The fill of the button.
   * @default solid
   */
  @property({ reflect: true }) fill?: ButtonFill;

  /**
   * The shape of the button.
   * @default square
   */
  @property({ reflect: true }) shape?: ButtonShape;

  /**
   * The size of the button.
   * @default 'md'
   */
  @property({ reflect: true }) size?: ButtonSize;

  /**
   * The type of the button. Can be used to mimic the functionality of submit and reset buttons in native HTML buttons.
   * @default button
   */
  @property() type?: ButtonType;

  /**
   * The variant of the button.
   * @default secondary
   */
  @property({ reflect: true }) variant?: ButtonVariant;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'button');

    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = 0;
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('disabled')) {
      this.tabIndex = this.disabled ? -1 : 0;
    }
  }

  override render(): TemplateResult {
    return html`<slot @slotchange=${this.#onSlotChange}></slot>`;
  }

  #onClick(event: Event): void {
    if (this.hasAttribute('disabled')) {
      event.preventDefault();
      event.stopPropagation();
    } else if (this.type === 'reset') {
      if (this.internals.form) {
        this.internals.form.reset();
      } else {
        // Workaround for not wanting a dependency on the `@sl-design-system/form` package
        (closestElementComposed(this, 'sl-form') as unknown as { reset(): void })?.reset();
      }
    } else if (this.type === 'submit') {
      if (this.internals.form) {
        this.internals.form?.requestSubmit();
      } else {
        // Workaround for not wanting a dependency on the `@sl-design-system/form` package
        (closestElementComposed(this, 'sl-form') as unknown as { requestSubmit(): void })?.requestSubmit();
      }
    }
  }

  #onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      this.click();

      event.preventDefault();
      event.stopPropagation();
    }
  }

  #onSlotChange(event: Event & { target: HTMLSlotElement }): void {
    const filteredNodes = event.target.assignedNodes({ flatten: true }).filter(node => {
      return node.nodeType === Node.ELEMENT_NODE || (node.textContent && node.textContent.trim().length > 0);
    });

    let hasIcon = false;

    if (filteredNodes.length === 1) {
      const el = filteredNodes[0] as HTMLElement;
      // This button is icon-only if it only contains an icon.
      hasIcon = el.nodeName === 'SL-ICON' || this.#hasOnlyIconAsChild(el);
    }

    this.toggleAttribute('icon-only', hasIcon);
  }

  #hasOnlyIconAsChild(el: HTMLElement): boolean {
    return (
      (el.textContent || '').trim().length === 0 && el.children.length === 1 && el.children[0].nodeName === 'SL-ICON'
    );
  }
}
