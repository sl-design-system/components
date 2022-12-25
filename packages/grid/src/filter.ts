import type { CSSResultGroup, TemplateResult } from 'lit';
import type { ScopedElementsMap } from '@open-wc/scoped-elements';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { Input } from '@sanomalearning/slds-core/input';
import { LitElement, html } from 'lit';
import styles from './filter.scss.js';

export class GridFilter extends ScopedElementsMixin(LitElement) {
  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-input': Input
    };
  }

  /** @private */
  static override styles: CSSResultGroup = styles;

  override render(): TemplateResult {
    return html`<slot></slot>FILTER`;
  }
}
