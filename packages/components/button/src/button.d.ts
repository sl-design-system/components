import { Tooltip } from '@sl-design-system/tooltip';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-button': Button;
  }
}
export type ButtonFill = 'solid' | 'outline' | 'link' | 'ghost';
export type ButtonShape = 'rect' | 'pill';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'reset' | 'submit';
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'inverted';
declare const Button_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@sl-design-system/shared').ForwardAriaMixinInterface
  >;
/**
 * A single, simple button, with optionally an icon.
 *
 * @customElement sl-button
 *
 * @slot default - Text label of the button. Optionally an <code>sl-icon</code> can be added
 *
 * @csspart button - The internal <code>&lt;button&gt;</code> element.
 * @csspart tooltip - The tooltip element that is shown when the <code>tooltip</code> attribute is set.
 */
export declare class Button extends Button_base {
  #private;
  /** @internal */
  static formAssociated: boolean;
  /** @internal */
  static get scopedElements(): {
    'sl-tooltip': typeof Tooltip;
  };
  /** @internal */
  static shadowRootOptions: ShadowRootInit;
  /** @internal */
  static styles: CSSResultGroup;
  /** @internal */
  readonly internals: ElementInternals;
  /** @internal The button element. */
  button: HTMLButtonElement;
  /**
   * Sets the command to be invoked when the button is activated.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API
   */
  command?: string;
  /**
   * The DOM id of the element that will be invoked when the button is activated. The referenced
   * element must be in the same DOM scope as the `<sl-button>`.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API
   */
  commandFor?: string;
  /**
   * The element that will be invoked when the button is activated. Use this instead of `commandFor`
   * when you already have a reference to the element.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API
   */
  commandForElement?: Element;
  /** Whether the button is disabled; when set no interaction is possible. */
  disabled?: boolean;
  /**
   * The fill of the button.
   *
   * @default 'solid'
   */
  fill?: ButtonFill;
  /**
   * The shape of the button.
   *
   * @default 'rect'
   */
  shape?: ButtonShape;
  /**
   * The size of the button.
   *
   * @default 'md'
   */
  size?: ButtonSize;
  get tabIndex(): number;
  set tabIndex(value: number);
  /** The text that will be shown in a tooltip. */
  tooltip?: string;
  /**
   * The type of the button. Can be used to mimic the functionality of submit and reset buttons in
   * native HTML buttons.
   *
   * @default 'button'
   */
  type?: ButtonType;
  /**
   * The variant of the button.
   *
   * @default 'secondary'
   */
  variant?: ButtonVariant;
  connectedCallback(): void;
  disconnectedCallback(): void;
  firstUpdated(changes: PropertyValues<this>): void;
  render(): TemplateResult;
}
export {};
