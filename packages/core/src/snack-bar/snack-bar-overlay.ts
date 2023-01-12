import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import styles from './snack-bar-overlay.scss.js';

export class SnackBarOverlay extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  override render(): TemplateResult {
    return html` <output>SnackBarOverlay works</output> `;
  }
}
