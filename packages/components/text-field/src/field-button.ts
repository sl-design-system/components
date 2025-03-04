import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './field-button.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-field-button': FieldButton;
  }
}

export type FieldButtonSize = 'md' | 'lg';

/**
 * A button that is part of a text field. Use this component if you want to
 * have an inline action inside a text field. The clear button in a search field
 * for example.
 *
 * This component can be used by other design system components that inherit from
 * `TextField`, but also by users of the design system that slot it in their own
 * `<sl-text-field>`.
 *
 * @slot default - Add an icon to the button
 */
export class FieldButton extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Determines if the button is disabled. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /**
   * The size of the field button. The size will automatically be set
   * when the component is embedded/slotted inside a text field.
   * @default 'md'
   */
  @property({ reflect: true }) size?: FieldButtonSize;

  override connectedCallback(): void {
    super.connectedCallback();

    this.role = 'button';
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
