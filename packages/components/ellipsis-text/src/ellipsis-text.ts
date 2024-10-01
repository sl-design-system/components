import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Tooltip } from '@sl-design-system/tooltip';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import styles from './ellipsis-text.scss.js';

/**
 * Small utility component to add ellipsis to text that overflows
 * its container. It also adds a tooltip with the full text.
 */
export class EllipsisText extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-tooltip': Tooltip
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
