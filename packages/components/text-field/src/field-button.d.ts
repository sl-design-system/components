import { type CSSResultGroup, LitElement, type TemplateResult } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-field-button': FieldButton;
  }
}
export type FieldButtonSize = 'md' | 'lg';
/**
 * A button that is part of a text field. Use this component if you want to have an inline action
 * inside a text field. The clear button in a search field for example.
 *
 * This component can be used by other design system components that inherit from `TextField`, but
 * also by users of the design system that slot it in their own `<sl-text-field>`.
 *
 * @slot default - Add an icon to the button
 */
export declare class FieldButton extends LitElement {
  #private;
  /** @internal */
  static styles: CSSResultGroup;
  /** Determines if the button is disabled. */
  disabled?: boolean;
  /**
   * The size of the field button. The size will automatically be set when the component is
   * embedded/slotted inside a text field.
   *
   * @default 'md'
   */
  size?: FieldButtonSize;
  connectedCallback(): void;
  render(): TemplateResult;
}
