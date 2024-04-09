import { faChevronRight } from '@fortawesome/pro-regular-svg-icons';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Checkbox } from '@sl-design-system/checkbox';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type SlChangeEvent, type SlSelectEvent, type SlToggleEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './group-header.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-grid-group-header': GridGroupHeader;
  }
}

Icon.register(faChevronRight);

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

  /** The group heading. */
  @property() heading?: string;

  /** Wether you can select the entire group. */
  @property({ type: Boolean }) selectable?: boolean;

  /** Whether the group is selected. */
  @property() selected: 'all' | 'some' | 'none' = 'none';

  /** Emits when the user changes the group selection. */
  @event({ name: 'sl-select' }) selectEvent!: EventEmitter<SlSelectEvent<boolean>>;

  /** Emits when the user collapses/expands the group. */
  @event({ name: 'sl-toggle' }) toggleEvent!: EventEmitter<SlToggleEvent<boolean>>;

  override render(): TemplateResult {
    return html`
      <sl-button @click=${this.#onClick} fill="ghost">
        <sl-icon name="far-chevron-right"></sl-icon>
      </sl-button>
      ${this.selectable
        ? html`
            <sl-checkbox
              @sl-change=${this.#onToggle}
              .checked=${this.selected === 'all'}
              .indeterminate=${this.selected === 'some'}
              size="sm"
            ></sl-checkbox>
          `
        : nothing}
      <span class="heading">${this.heading}</span>
    `;
  }

  #onClick(): void {
    this.expanded = !this.expanded;
    this.toggleEvent.emit(this.expanded);
  }

  #onToggle(event: SlChangeEvent<boolean>): void {
    this.selectEvent.emit(event.detail);
  }
}
