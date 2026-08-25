import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter } from '@sl-design-system/shared';
import { type SlToggleEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, PropertyValues, type TemplateResult } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-toggle-button': ToggleButton;
  }
}
export type ToggleButtonFill = 'outline' | 'solid';
export type ToggleButtonShape = 'rect' | 'pill';
export type ToggleButtonSize = 'sm' | 'md' | 'lg';
declare const ToggleButton_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@sl-design-system/shared').ForwardAriaMixinInterface
  >;
/**
 * A button that lets the user toggle between two states.
 *
 * @customElement sl-toggle-button
 *
 * @slot default - The icon shown in the default state of the button
 * @slot pressed - The icon shown in the pressed state of the button
 *
 * @csspart button - The internal <code>&lt;button&gt;</code> element.
 * @csspart tooltip - The tooltip element that is shown when the <code>tooltip</code> attribute is set.
 *
 * @cssstate error - Set when there is an error with the toggle button, for example when there are no icons in an icon-only toggle button.
 * @cssstate pressed - Set when the toggle button is in the pressed state.
 * @cssstate icon-only - Set when the toggle button has icons and no text.
 * @cssstate text-only - Set when the toggle button has text and no icons.
 */
export declare class ToggleButton extends ToggleButton_base {
  #private;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static shadowRootOptions: ShadowRootInit;
  /** @internal */
  static styles: CSSResultGroup;
  /** @internal The button element. */
  button: HTMLButtonElement;
  /** @internal The default (non-pressed) icon. */
  defaultIcon?: Icon;
  /**
   * Whether the button is disabled; when set no interaction is possible.
   *
   * @default false
   */
  disabled?: boolean;
  /**
   * The variant of the toggle-button.
   *
   * @default 'solid'
   */
  fill?: ToggleButtonFill;
  /** @internal True when the user has slotted text in the button. */
  hasText?: boolean;
  /** @internal */
  readonly internals: ElementInternals;
  /**
   * The pressed state of the button.
   *
   * @default false
   */
  pressed?: boolean;
  /** @internal The pressed icon. */
  pressedIcon?: Icon;
  /**
   * The shape of the button.
   *
   * @default 'rect'
   */
  shape?: ToggleButtonShape;
  /**
   * The size of the button.
   *
   * @default 'md'
   */
  size?: ToggleButtonSize;
  /** @internal Emits when the button has been toggled. */
  toggleEvent: EventEmitter<SlToggleEvent<boolean>>;
  /** The tooltip text for the button. */
  tooltip?: string;
  firstUpdated(changes: PropertyValues<this>): void;
  updated(changes: PropertyValues<this>): void;
  render(): TemplateResult;
}
export {};
