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

export class GridGroupHeader extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-checkbox': Checkbox,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Whether the group is expanded or collapsed. */
  @property({ type: Boolean, reflect: true }) expanded?: boolean;

  /** Wether you can select the entire group. */
  @property({ type: Boolean, reflect: true }) selectable?: boolean;

  /** Whether the group is selected. */
  @property() selected: 'all' | 'some' | 'none' = 'none';

  /** @internal Emits when the user changes the group selection. */
  @event({ name: 'sl-select' }) selectEvent!: EventEmitter<SlSelectEvent<boolean>>;

  /** @internal Emits when the user collapses/expands the group. */
  @event({ name: 'sl-toggle' }) toggleEvent!: EventEmitter<SlToggleEvent<boolean>>;

  override render(): TemplateResult {
    return html`
      <sl-button @click=${this.#onClick} fill="ghost">
        <sl-icon name="chevron-right"></sl-icon>
      </sl-button>
      ${this.selectable
        ? html`
            <sl-checkbox
              @sl-change=${this.#onChange}
              .checked=${this.selected === 'all'}
              .indeterminate=${this.selected === 'some'}
              size="sm"
            ></sl-checkbox>
          `
        : nothing}
      <div part="wrapper">
        <slot></slot>
      </div>
    `;
  }

  #onChange(event: SlChangeEvent<boolean>): void {
    this.selectEvent.emit(event.detail);
  }

  #onClick(): void {
    this.expanded = !this.expanded;
    this.toggleEvent.emit(this.expanded);
  }
}
