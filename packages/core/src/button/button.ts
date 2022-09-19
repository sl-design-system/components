import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './button.scss.js';

export type ButtonVariant = 'ghost' | 'outline' | 'solid' | 'subtle';

export class Button extends LitElement {
  /** @private */
  static styles: CSSResultGroup = styles;

  /** The button variant. */
  @property({ reflect: true }) variant: ButtonVariant = 'solid';

  render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
