import { EventsController, closestElementComposed } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
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
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true
  };

  /** @internal */
  static override styles: CSSResultGroup = styles;

  // eslint-disable-next-line no-unused-private-class-members
  #events = new EventsController(this, {
    click: {
      handler: this.#onClick,
      options: { capture: true }
    }
  });

  /** Observe changes to the slotted content that aren't caught by the `slotchange` event. */
  #observer = new MutationObserver(() => this.#onUpdate());

  /** @internal. */
  readonly internals = this.attachInternals();

  /** @internal */
  @property({ attribute: 'aria-disabled', reflect: true }) override ariaDisabled: string | null = null;

  /** @internal */
  @property({ attribute: 'aria-label', reflect: true }) override ariaLabel: string | null = null;

  /**
   * Set's the command to be invoked when the button is activated.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API
   */
  @property() command?: string;

  /**
   * The DOM id of the element that will be invoked when the button is activated.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API
   */
  @property({ attribute: 'commandfor' }) commandFor?: string;

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

    this.#observer.observe(this, { characterData: true, childList: true, subtree: true });
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();

    super.disconnectedCallback();
  }

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    // Initial update
    this.#onUpdate();
  }

  override render(): TemplateResult {
    const root = this.getRootNode() as Document | ShadowRoot,
      commandForElement = this.commandFor ? (root.getElementById?.(this.commandFor) ?? null) : null;

    return html`
      <button
        .commandForElement=${commandForElement}
        ?disabled=${this.disabled}
        aria-disabled=${ifDefined(this.ariaDisabled === 'true' ? 'true' : undefined)}
        aria-label=${ifDefined(this.ariaLabel || undefined)}
        command=${ifDefined(this.command)}
        type="button"
      >
        <slot></slot>
      </button>
    `;
  }

  #onClick(event: Event): void {
    if (this.disabled || this.ariaDisabled === 'true') {
      event.preventDefault();
      event.stopImmediatePropagation();
    } else if (this.type === 'reset') {
      if (this.internals.form) {
        this.internals.form.reset();
      } else {
        // Workaround for not wanting a dependency on the `@sl-design-system/form` package
        (closestElementComposed(this, 'sl-form') as unknown as { reset(): void })?.reset();
      }
    } else if (this.type === 'submit') {
      if (this.internals.form) {
        this.internals.form.requestSubmit();
      } else {
        // Workaround for not wanting a dependency on the `@sl-design-system/form` package
        (closestElementComposed(this, 'sl-form') as unknown as { requestSubmit(): void })?.requestSubmit();
      }
    }
  }

  #onUpdate(): void {
    const filteredNodes = this.renderRoot
      .querySelector('slot')
      ?.assignedNodes({ flatten: true })
      .filter(node => {
        return node.nodeType === Node.ELEMENT_NODE || node.textContent?.trim().length;
      });

    let iconOnly = false;

    // This button is icon-only if it only contains an icon.
    if (filteredNodes?.length === 1 && filteredNodes[0].nodeType === Node.ELEMENT_NODE) {
      const el = filteredNodes[0] as Element;

      iconOnly =
        el.nodeName === 'SL-ICON' ||
        ((el.textContent || '').trim().length === 0 &&
          el.children.length === 1 &&
          el.children[0].nodeName === 'SL-ICON');
    }

    if (iconOnly) {
      this.internals.states.add('icon-only');
    } else {
      this.internals.states.delete('icon-only');
    }
  }
}
