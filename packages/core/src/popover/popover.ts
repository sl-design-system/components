import type { Placement } from './utils/position-anchored-element.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { AnchoredPopoverMixin } from './mixins/anchored-popover.js';
import styles from './popover.scss.js';

export class Popover extends AnchoredPopoverMixin(LitElement) {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Popover placement relative to the anchor. */
  @property() placement: Placement = 'bottom';

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
