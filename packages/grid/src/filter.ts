import type { CSSResultGroup, TemplateResult } from 'lit';
import type { ScopedElementsMap } from '@open-wc/scoped-elements';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { Input } from '@sanomalearning/slds-core/input';
import type { EventEmitter } from '@sanomalearning/slds-core/utils/decorators';
import { event } from '@sanomalearning/slds-core/utils/decorators';
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

  @event() filterChange!: EventEmitter<string>;

  override render(): TemplateResult {
    return html`
      <div class="name">
        <slot></slot>
      </div>
      <sl-input @input=${this.#onInput} placeholder="Filter"></sl-input>
    `;
  }

  #onInput({ target }: Event & { target: Input }): void {
    const value = target.value.trim();

    this.filterChange.emit(value);
  }
}
