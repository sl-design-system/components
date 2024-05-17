import { EventsController } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './button.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-button': Button;
  }
}

export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonFill = 'solid' | 'outline' | 'link' | 'ghost';

export type ButtonType = 'button' | 'reset' | 'submit';

export type ButtonVariant = 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger';

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
  /** @private */
  static formAssociated = true;

  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Event controller. */
  #events = new EventsController(this, {
    click: this.#onClick,
    keydown: this.#onKeydown
  });

  /** @private. */
  readonly internals = this.attachInternals();

  /** The original tabIndex before disabled. */
  private originalTabIndex = 0;

  /** Whether the button is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /**
   * The fill of the button.
   */
  @property({ reflect: true }) fill: ButtonFill = 'solid';

  /**
   * The size of the button.
   */
  @property({ reflect: true }) size: ButtonSize = 'md';

  /**
   * The type of the button. Can be used to mimic the functionality of submit and reset buttons in native HTML buttons.
   */
  @property() type: ButtonType = 'button';

  /**
   * The variant of the button.
   */
  @property({ reflect: true }) variant: ButtonVariant = 'default';

  override connectedCallback(): void {
    super.connectedCallback();

    this.internals.role = 'button';

    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = 0;
    }
  }

  /** @private */
  formDisabledCallback(disabled: boolean): void {
    if (disabled) {
      this.originalTabIndex = this.tabIndex;
    }

    this.tabIndex = disabled ? -1 : this.originalTabIndex;
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('size')) {
      this.#setIconProperties(Array.from(this.childNodes));
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
      this.internals.form?.reset();
    } else if (this.type === 'submit') {
      this.internals.form?.requestSubmit();
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
    const assignedNodes = event.target.assignedNodes({ flatten: true });
    this.#setIconProperties(assignedNodes);
  }

  #hasOnlyIconAsChild(el: HTMLElement): boolean {
    return (
      (el.textContent || '').trim().length === 0 && el.children.length === 1 && el.children[0].nodeName === 'SL-ICON'
    );
  }

  #setIconProperties(assignedNodes: Node[]): void {
    const filteredNodes = assignedNodes.filter(node => {
      return node.nodeType === Node.ELEMENT_NODE || (node.textContent && node.textContent.trim().length > 0);
    });

    let hasIcon = false;

    filteredNodes.forEach(node => {
      const el = node as HTMLElement;
      if (el.nodeName === 'SL-ICON') {
        el.setAttribute('size', this.size);
      } else if (this.#hasOnlyIconAsChild(el)) {
        (el.children[0] as HTMLElement).setAttribute('size', this.size);
      }
    });

    if (filteredNodes.length === 1) {
      const el = filteredNodes[0] as HTMLElement;
      // This button is icon-only if it only contains an icon.
      hasIcon = el.nodeName === 'SL-ICON' || this.#hasOnlyIconAsChild(el);
    }

    this.toggleAttribute('icon-only', hasIcon);
  }
}
