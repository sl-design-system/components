import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './button.scss.js';

export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonFill = 'ghost' | 'outline' | 'solid' | 'subtle';

export type ButtonVariant = 'primary' | 'secondary';

export class Button extends LitElement {
  /** @private */
  static styles: CSSResultGroup = styles;

  /** The button fill. */
  @property({ reflect: true }) fill: ButtonFill = 'solid';

  /** Size. */
  @property({ reflect: true }) size: ButtonSize = 'lg';

  /** The variant. */
  @property({ reflect: true }) variant: ButtonVariant = 'primary';

  render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
