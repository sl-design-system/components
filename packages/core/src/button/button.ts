import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './button.scss.js';

export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonFill = 'default' | 'outline' | 'pill';

export type ButtonType = 'button' | 'reset' | 'submit';

export type ButtonVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';

export class Button extends LitElement {
  /** @private */
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  static styles: CSSResultGroup = styles;

  /** Whether the button is disabled. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** The button fill. */
  @property({ reflect: true }) fill: ButtonFill = 'default';

  /** Button ARIA role. Defaults to `button`. */
  @property({ reflect: true }) role = 'button';

  /** Button size. */
  @property({ reflect: true }) size: ButtonSize = 'md';

  /**
   * The button type. Defaults to `button`, but can be set to `submit` when used in a form.
   * @type {button | reset | submit}
   */
  @property() type: ButtonType = 'button';

  /**
   * The button variant. If no variant is specified, it uses the default button style.
   */
  @property({ reflect: true }) variant: ButtonVariant = 'default';

  firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = 0;
    }
  }

  render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
