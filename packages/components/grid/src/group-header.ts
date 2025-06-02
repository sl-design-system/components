import { localized, msg } from '@lit/localize';
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

@localized()
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

  /** Whether the group is collapsed or expanded. */
  @property({ type: Boolean, reflect: true }) collapsed?: boolean;

  /** Whether the group is draggable. */
  @property({ type: Boolean, attribute: 'drag-handle' }) dragHandle?: boolean;

  /** Whether you can select the entire group. */
  @property({ type: Boolean, reflect: true }) selectable?: boolean;

  /** Whether the group is selected. */
  @property() selected: 'all' | 'some' | 'none' = 'none';

  /** @internal Emits when the user changes the group selection. */
  @event({ name: 'sl-select' }) selectEvent!: EventEmitter<SlSelectEvent<boolean>>;

  /** @internal Emits when the user collapses/expands the group. */
  @event({ name: 'sl-toggle' }) toggleEvent!: EventEmitter<SlToggleEvent<boolean>>;

  override render(): TemplateResult {
    return html`
      ${this.dragHandle
        ? html`
            <div part="drag-handle">
              <sl-icon name="far-grip-lines"></sl-icon>
            </div>
          `
        : nothing}
      ${this.selectable
        ? html`
            <div part="checkbox">
              <sl-checkbox
                @sl-change=${this.#onChange}
                .checked=${this.selected === 'all'}
                .indeterminate=${this.selected === 'some'}
                size="sm"
              ></sl-checkbox>
            </div>
          `
        : nothing}
      <sl-button
        @click=${this.#onClick}
        aria-label=${msg('Toggle group', { id: 'sl.grid.toggleGroup' })}
        fill="ghost"
        size="sm"
      >
        <sl-icon name="chevron-down"></sl-icon>
      </sl-button>
      <div part="wrapper">
        <div part="group-heading">
          <slot name="group-heading"></slot>
        </div>
        <slot></slot>
      </div>
    `;
  }

  #onChange(event: SlChangeEvent<boolean>): void {
    this.selectEvent.emit(event.detail);
  }

  #onClick(): void {
    this.collapsed = !this.collapsed;
    this.toggleEvent.emit(this.collapsed);
  }
}
