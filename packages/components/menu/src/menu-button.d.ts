import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import {
  Button,
  type ButtonFill,
  type ButtonShape,
  type ButtonSize,
  type ButtonVariant
} from '@sl-design-system/button';
import { type EventEmitter, type PopoverPosition } from '@sl-design-system/shared';
import { type SlToggleEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import { Menu } from './menu.js';
declare global {
  interface HTMLElementTagNameMap {
    'sl-menu-button': MenuButton;
  }
}
declare const MenuButton_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@sl-design-system/shared').ForwardAriaMixinInterface
  >;
/**
 * Custom element that combines a button and a menu and automatically wires them up together.
 *
 * @csspart button - The button element.
 *
 * @slot default - The menu items should be slotted in the default slot.
 * @slot button - Any content for the button should be slotted here.
 */
export declare class MenuButton extends MenuButton_base {
  #private;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static styles: CSSResultGroup;
  /** @internal The button. */
  button: Button;
  /** @internal Emits when the menu opens or closes. The event detail is `true` when open and `false` when closed. */
  toggleEvent: EventEmitter<SlToggleEvent<boolean>>;
  /**
   * Whether the button is disabled; when set no interaction is possible.
   *
   * @default false
   */
  disabled?: boolean;
  /**
   * The fill of the button.
   *
   * @default 'outline'
   */
  fill: ButtonFill;
  /** @internal The menu. */
  menu: Menu;
  /**
   * The position of the menu relative to the button.
   *
   * @default 'bottom-start'
   */
  position?: PopoverPosition;
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
  /** The tooltip text for the button invoking the menu. */
  tooltip?: string;
  /**
   * The variant of the button.
   *
   * @default 'secondary'
   */
  variant?: ButtonVariant;
  firstUpdated(changes: PropertyValues<this>): void;
  render(): TemplateResult;
}
export {};
