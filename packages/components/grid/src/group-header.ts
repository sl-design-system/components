import type { CSSResultGroup, TemplateResult } from 'lit';
import type { ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { faChevronDown } from '@fortawesome/pro-regular-svg-icons';
import { Button } from '@sl-design-system/button';
import { Checkbox } from '@sl-design-system/checkbox';
import { Icon } from '@sl-design-system/icon';
import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './group-header.scss.js';

Icon.register(faChevronDown);

export class GridGroupHeader extends ScopedElementsMixin(LitElement) {
  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-checkbox': Checkbox,
      'sl-icon': Icon
    };
  }

  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Whether the group is expanded or collapsed. */
  @property({ type: Boolean, reflect: true }) expanded?: boolean;

  /** Wether you can select the entire group. */
  @property({ type: Boolean }) selectable?: boolean;

  @property({ type: Boolean }) selected?: boolean;

  /** The group heading. */
  @property() heading?: string;

  override render(): TemplateResult {
    return html`
      <sl-button @click=${this.#onClick} fill="ghost">
        <sl-icon name="far-chevron-down"></sl-icon>
      </sl-button>
      ${this.selectable
        ? html`<sl-checkbox @sl-change=${this.#onChange} .checked=${this.selected}></sl-checkbox>`
        : nothing}
      <span class="heading">${this.heading}</span>
    `;
  }

  #onChange(): void {
    console.log('change');
  }

  #onClick(): void {
    console.log('click');
  }
}
