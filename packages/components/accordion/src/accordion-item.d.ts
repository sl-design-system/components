import { type EventEmitter } from '@sl-design-system/shared';
import { type SlToggleEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import { type AccordionIconType } from './accordion.js';
declare global {
  interface HTMLElementTagNameMap {
    'sl-accordion-item': AccordionItem;
  }
}
/**
 * An accordion item component.
 *
 * @csspart details - Details element of the accordion-item
 * @csspart summary - Header element of the accordion-item
 * @csspart icon - The icon in the header of the accordion-item
 * @csspart panel - The body of the accordion-item
 *
 * @slot default - Body content for the accordion
 * @slot summary - Header content for the accordion; use this if the `summary` property is not enough
 * @slot summary-extras - Extra content in the header of the accordion item
 */
export declare class AccordionItem extends LitElement {
  #private;
  /** @internal */
  static styles: CSSResultGroup;
  /** Whether the element is disabled. */
  disabled?: boolean;
  /** @internal */
  iconType?: AccordionIconType;
  /** Whether the details element is opened. */
  open?: boolean;
  /** A text shown in the header - as a title of the accordion item. */
  summary?: string;
  /** @internal Emits when the accordion item has been toggled. */
  toggleEvent: EventEmitter<SlToggleEvent<boolean>>;
  firstUpdated(changes: PropertyValues<this>): void;
  updated(changes: PropertyValues<this>): void;
  render(): TemplateResult;
  /**
   * This is a workaround for `delegatesFocus` not allowing you to select any text in the content of
   * the accordion item. See https://issues.chromium.org/issues/40622041
   */
  focus(options?: FocusOptions): void;
  /**
   * Toggles the component state between open or closed. If the `force` parameter is provided, the
   * state will be set to the value of the parameter.
   *
   * @param force - The state to forcibly set the component to
   */
  toggle(force?: boolean): void;
}
